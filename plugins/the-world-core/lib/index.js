/**
 * the-world-core — The World TW-01 Minimal World Core.
 *
 * 程序只保证几个长期容易失守的边界：
 * - 未经玩家确认的 Game Composition 不能进入正式游戏；
 * - 已确认游戏会在新 Session 恢复；
 * - 正式游戏每轮结束会做一次 durable-change review；
 * - 具体世界内容、叙事和文件语义仍交给模型。
 */
import z from '@deepseek-ai/schemastery'
import { createUserMessage } from '@deepseek-ai/dsh-llm/message'
import {
  resolveGame,
  readGameDynamics,
  readBounded,
  readCompositionStatus,
  COMPOSITION_FILE
} from './游戏定位.js'
import {
  GAME_MODE_SECTION_TEXT,
  buildDynamicContext,
  buildRecoveryInjection,
  buildNoGameInjection,
  buildSetupResumeInjection,
  buildMaintenanceText
} from './提示文本.js'
import path from 'node:path'

export const name = 'the-world-core'
export const inject = ['systemPrompt']

export const Config = z.object({
  gamesDir: z.string().default('games'),
  templateDir: z.string().default('games/_template'),
  maxFileChars: z.number().default(12000),
  maintenance: z.boolean().default(true)
})

const SOURCE = { kind: 'plugin', plugin: name }

function cwdOf(agent) {
  return agent?.session?.header?.cwd
}

function userMessage(text, form) {
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { ...SOURCE, form }
  })
}

export function apply(ctx, config) {
  const logger = ctx.logger('the-world-core')

  ctx.systemPrompt.section({
    name: 'the-world:game-mode',
    order: 40,
    text: GAME_MODE_SECTION_TEXT
  })

  // 每次模型请求都重新检查确认状态。
  // 这是确认门的关键：不能只在 session-start 检查，否则模型在同一 Session
  // 里先写出 state/CURRENT.md 就会被误识别成已经正式开局。
  ctx.systemPrompt.context({
    name: 'the-world:game-state',
    order: 100,
    text: (assembleCtx) => {
      const agent = assembleCtx?.agent
      if (!agent) return ''
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      const compositionStatus = game ? readCompositionStatus(game.dir) : null
      const dynamics = game && compositionStatus === 'confirmed'
        ? readGameDynamics(game.dir)
        : {}

      return buildDynamicContext({
        game,
        compositionStatus,
        dynamics,
        gamesDirDisplay: config.gamesDir,
        templateDirDisplay: config.templateDir
      })
    }
  })

  ctx.on('agent/session-start', ({ agent, source }) => {
    try {
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null

      if (!game) {
        agent.inject(userMessage(
          buildNoGameInjection({
            gamesDirDisplay: config.gamesDir,
            templateDirDisplay: config.templateDir
          }),
          'setup'
        ))
        return
      }

      const compositionStatus = readCompositionStatus(game.dir)

      // COMPOSITION 缺失和 COMPOSITION 未确认都属于 Setup 未完成。
      // 不再把“缺 COMPOSITION 的旧目录”自动当成可继续的正式游戏。
      if (compositionStatus !== 'confirmed') {
        agent.inject(userMessage(buildSetupResumeInjection({ game }), 'setup'))
        return
      }

      const current = readBounded(path.join(game.dir, 'state', 'CURRENT.md'), config.maxFileChars)
      const recent = readBounded(path.join(game.dir, 'memory', 'RECENT.md'), config.maxFileChars)
      const composition = readBounded(path.join(game.dir, COMPOSITION_FILE), config.maxFileChars)

      agent.inject(userMessage(
        buildRecoveryInjection({ game, source, current, recent, composition }),
        'recovery'
      ))
    } catch (error) {
      logger.warn('session-start 恢复注入失败: %s', error?.message ?? error)
    }
  })

  const maintainedTurns = new WeakMap()
  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (!config.maintenance || signal?.aborted) return

    try {
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      if (!game) return

      // Setup 阶段不是游戏回合，禁止 maintenance 把半成品写成正式状态。
      if (readCompositionStatus(game.dir) !== 'confirmed') return

      let turns = maintainedTurns.get(agent)
      if (!turns) {
        turns = new Set()
        maintainedTurns.set(agent, turns)
      }
      if (turns.has(turn)) return
      turns.add(turn)

      agent.steer(userMessage(buildMaintenanceText({ game }), 'maintenance'))
    } catch (error) {
      logger.warn('turn-stopping 维护提醒失败: %s', error?.message ?? error)
    }
  })
}
