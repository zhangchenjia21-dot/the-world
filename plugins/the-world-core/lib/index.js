/**
 * the-world-core — The World TW-01 Minimal World Core.
 *
 * 程序只保证几个长期容易失守的边界：
 * - 未经玩家确认的 Game Composition 不能进入正式游戏；
 * - Setup 的有限选择优先走 DSH 原生 ask_user_question；
 * - 已确认游戏会在新 Session 恢复；
 * - 正式游戏的 durable-change review 在同一玩家回合内完成，不再额外 steer 一个维护 step；
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
  buildSetupContinueText
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
const MAX_SETUP_NUDGES_PER_TURN = 6

function cwdOf(agent) {
  return agent?.session?.header?.cwd
}

function userMessage(text, form) {
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { ...SOURCE, form }
  })
}

function countForTurn(store, agent, turn) {
  let turns = store.get(agent)
  if (!turns) {
    turns = new Map()
    store.set(agent, turns)
  }
  const count = turns.get(turn) ?? 0
  turns.set(turn, count + 1)
  return count
}

export function apply(ctx, config) {
  const logger = ctx.logger('the-world-core')

  ctx.systemPrompt.section({
    name: 'the-world:game-mode',
    order: 40,
    text: GAME_MODE_SECTION_TEXT
  })

  // 每次模型请求都重新检查确认状态。
  // 不能只在 session-start 检查，否则同一 Session 内的半成品目录会被误当正式游戏。
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

  // 正式游戏的持久化维护必须和玩家可见回复处于同一个模型回合。
  // 这样模型仍负责判断什么是 durable change，但不会在 turn-stopping 后再追加一个
  // “后台维护”模型 step，从而覆盖/打断正文末尾的 meaningful-choice 行动建议。
  ctx.systemPrompt.context({
    name: 'the-world:in-turn-maintenance',
    order: 101,
    text: (assembleCtx) => {
      if (!config.maintenance) return ''
      const agent = assembleCtx?.agent
      if (!agent) return ''
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      if (!game || readCompositionStatus(game.dir) !== 'confirmed') return ''

      return [
        '## The World 回合内持久化',
        '- 在完成本轮世界判定后、输出最终玩家可见回复之前，检查本轮是否产生未来仍需存在的 durable change。',
        `- 有 durable change 时，在同一回合内按需更新 ${game.dir}/state/CURRENT.md、story/LEDGER.md、memory/RECENT.md。`,
        '- 没有 durable change 就不要为了维护而写文件。',
        '- 持久化是后台工作，不要把维护说明写进玩家正文，也不要因此另开一个模型 step。',
        '- 完成必要维护后再输出这一回合完整的玩家可见回复；若停在 meaningful choice，正文末尾保留约 5 个行动方向建议。'
      ].join('\n')
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

  // turn-stopping 只继续承担 New Game Setup 的确认门职责。
  // 正式游戏不再从这里 steer 维护任务，避免在玩家回复之后追加第二个模型 step。
  const setupNudges = new WeakMap()

  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted) return

    try {
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      const compositionStatus = game ? readCompositionStatus(game.dir) : null

      if (compositionStatus === 'confirmed') return

      const priorNudges = countForTurn(setupNudges, agent, turn)
      if (priorNudges >= MAX_SETUP_NUDGES_PER_TURN) return

      agent.steer(userMessage(buildSetupContinueText({ game }), 'setup'))
    } catch (error) {
      logger.warn('turn-stopping Setup 继续失败: %s', error?.message ?? error)
    }
  })
}
