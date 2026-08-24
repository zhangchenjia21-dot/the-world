/**
 * the-world-core — The World TW-01 Minimal World Core.
 *
 * 程序只保证几个长期容易失守的边界：
 * - 未经玩家确认的 Game Composition 不能进入正式游戏；
 * - Setup 的有限选择优先走 DSH 原生 ask_user_question；
 * - 已确认游戏会在新 Session 恢复；
 * - 正式游戏每轮结束会做一次 durable-change / choice-UI review；
 * - 具体世界内容、叙事和文件语义仍交给模型。
 */
import z from '@deepseek-ai/schemastery'
import { createUserMessage } from '@deepseek-ai/dsh-llm/message'
import {
  resolveGame,
  readGameDynamics,
  readBounded,
  readCompositionStatus,
  readSavePolicyInterval,
  COMPOSITION_FILE
} from './游戏定位.js'
import {
  GAME_MODE_SECTION_TEXT,
  buildDynamicContext,
  buildRecoveryInjection,
  buildNoGameInjection,
  buildSetupResumeInjection,
  buildSetupContinueText,
  buildMaintenanceText,
  buildConsolidationText
} from './提示文本.js'
import path from 'node:path'

export const name = 'the-world-core'
export const inject = ['systemPrompt']

export const Config = z.object({
  gamesDir: z.string().default('games'),
  templateDir: z.string().default('games/_template'),
  maxFileChars: z.number().default(12000),
  maintenance: z.boolean().default(true),
  consolidationInterval: z.number().default(10)
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
      const deltas = readBounded(path.join(game.dir, 'memory', 'DELTAS.md'), config.maxFileChars)

      agent.inject(userMessage(
        buildRecoveryInjection({ game, source, current, recent, composition, deltas }),
        'recovery'
      ))
    } catch (error) {
      logger.warn('session-start 恢复注入失败: %s', error?.message ?? error)
    }
  })

  // Setup 是一次交互式向导。模型如果在未 confirmed 时准备结束本轮，
  // 允许 World Core 在同一 turn 内轻推它继续使用 ask_user_question。
  // 上限只用于防止模型持续拒绝工具时形成无限 steering。
  const setupNudges = new WeakMap()
  const maintainedTurns = new WeakMap()
  // 玩家回合计数：只用于决定何时把「delta 捕获」升级为「检查点归并」。
  // 计数器随 Session 生命周期，不追求跨 Session 精确——DELTAS.md 本身是持久事实源，
  // 归并早一点晚一点都不丢事实。
  const playerTurnCounts = new WeakMap()

  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted) return

    try {
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      const compositionStatus = game ? readCompositionStatus(game.dir) : null

      if (compositionStatus !== 'confirmed') {
        if (!game) return
        const priorNudges = countForTurn(setupNudges, agent, turn)
        if (priorNudges >= MAX_SETUP_NUDGES_PER_TURN) return

        agent.steer(userMessage(buildSetupContinueText({ game }), 'setup'))
        return
      }

      if (!config.maintenance || !game) return

      let turns = maintainedTurns.get(agent)
      if (!turns) {
        turns = new Set()
        maintainedTurns.set(agent, turns)
      }
      if (turns.has(turn)) return
      turns.add(turn)

      const playerTurns = (playerTurnCounts.get(agent) ?? 0) + 1
      playerTurnCounts.set(agent, playerTurns)
      const interval = readSavePolicyInterval(game.dir) ?? config.consolidationInterval

      if (playerTurns % interval === 0) {
        agent.steer(userMessage(buildConsolidationText({ game, interval }), 'maintenance'))
      } else {
        agent.steer(userMessage(buildMaintenanceText({ game }), 'maintenance'))
      }
    } catch (error) {
      logger.warn('turn-stopping World Core 收尾失败: %s', error?.message ?? error)
    }
  })
}
