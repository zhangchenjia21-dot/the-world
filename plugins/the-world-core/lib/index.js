/**
 * the-world-core — The World TW-01 Minimal World Core.
 *
 * 程序只保证几个长期容易失守的边界：
 * - 未经玩家确认的 Game Composition 不能进入正式游戏；
 * - Setup 的有限选择优先走 DSH 原生 ask_user_question；
 * - 已确认游戏会在新 Session 恢复；
 * - 正式游戏每轮结束会做一次 durable-change / choice-UI review；
 * - 自动存档策略（每 N 玩家回合 / 里程碑）在检查点归并 step 完成后调用 shared 确定性快照，
 *   回合计数持久化在 saves/POLICY_STATE.json，跨 Session 连续；
 * - 具体世界内容、叙事和文件语义仍交给模型。
 */
import z from '@deepseek-ai/schemastery'
import { createUserMessage } from '@deepseek-ai/dsh-llm/message'
import {
  resolveGame,
  readGameDynamics,
  readBounded,
  readCompositionStatus,
  readSavePolicy,
  COMPOSITION_FILE
} from '../../shared/游戏定位.js'
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
import {
  createSnapshot,
  withGameLock,
  readPolicyState,
  recordPlayerTurn,
  recordAutoSaveSuccess,
  recordAutoSaveFailure,
  markMilestone
} from '../../shared/存档.js'

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
  // 只记录已经 steer consolidation、尚未经过第二次 stopping 的自动档；
  // aborted turn 会清除，避免把未完成维护的状态延后误存。
  const pendingAutoSaves = new WeakMap()
  // Save Policy v0.2：权威回合计数持久化在 saves/POLICY_STATE.json（shared/存档.js），
  // 跨 Session 连续、Restore 不回滚；pendingAutoSaves 只记进程内「已 steer 归并、待第二次 stopping 建档」的时序。

  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (signal?.aborted) {
      pendingAutoSaves.get(agent)?.delete(turn)
      return
    }

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
      if (turns.has(turn)) {
        // 同一 turn 的第二次 stopping 只会发生在 steer 的 maintenance step 完成后。
        // 在此之前绝不建档，避免把尚未归并的 checkpoint 状态固化为恢复点。
        const policy = readSavePolicy(game.dir)
        const pending = pendingAutoSaves.get(agent)?.get(turn)
        // 里程碑可能在 maintenance review 中才由模型 signal：这里重新读簿记，不只靠 first stopping 的快照。
        const milestone = policy.milestone
          ? (pending?.milestone ?? readPolicyState(game.dir)?.pendingMilestone ?? null)
          : null
        if (!pending && !milestone) return
        if (pending) pendingAutoSaves.get(agent).delete(turn)

        // §8.3 hybrid：interval due 与 milestone 同 turn 只建一个 milestone 档；
        // 成功后 intervalProgress 重置（milestone 同样视为定期安全点已满足）。
        const kind = milestone ? 'milestone' : 'auto-checkpoint'
        const label = milestone ? milestone.label : `第 ${pending.playerTurns} 玩家回合自动存档`
        try {
          withGameLock(game.dir, () => createSnapshot(game.dir, { kind, label, sourceSession: agent.id }))
          recordAutoSaveSuccess(game.dir, policy)
        } catch (saveError) {
          // 失败必须可发现且可重试：不清 intervalProgress、不丢 pending milestone，
          // 下一安全回合再试；错误只写入 POLICY_STATE 供 Panel 显形，不污染 RPG Chat。
          recordAutoSaveFailure(game.dir, policy, saveError?.message ?? saveError)
          logger.warn('自动存档失败（已记录，下一安全回合重试）: %s', saveError?.message ?? saveError)
        }
        return
      }
      turns.add(turn)

      // 真实玩家回合只在 first stopping 计一次；aborted / setup / 第二次 stopping 都不计。
      // 计数持久化在 POLICY_STATE.json：跨 Session 连续，Restore 不回滚执行计数。
      const policy = readSavePolicy(game.dir)
      const { state, intervalDue } = recordPlayerTurn(game.dir, policy)
      const milestonePending = policy.milestone ? state.pendingMilestone : null
      const consolidationInterval = config.consolidationInterval
      if (milestonePending || intervalDue) {
        // 里程碑已 signal（GM step 里）或定期存档到期：本回合升级为检查点归并，
        // 归并完成后的第二次 stopping 才建档。
        let pending = pendingAutoSaves.get(agent)
        if (!pending) {
          pending = new Map()
          pendingAutoSaves.set(agent, pending)
        }
        pending.set(turn, { gameDir: game.dir, playerTurns: state.totalPlayerTurns, milestone: milestonePending })
        agent.steer(userMessage(buildConsolidationText({ game, interval: policy.interval ?? consolidationInterval, milestone: policy.milestone }), 'maintenance'))
      } else if (state.totalPlayerTurns % consolidationInterval === 0) {
        // 无自动存档触发：保持既有节奏只做归并，不建档（手动策略行为不变）。
        agent.steer(userMessage(buildConsolidationText({ game, interval: consolidationInterval, milestone: policy.milestone }), 'maintenance'))
      } else {
        agent.steer(userMessage(buildMaintenanceText({ game, milestone: policy.milestone }), 'maintenance'))
      }
    } catch (error) {
      logger.warn('turn-stopping World Core 收尾失败: %s', error?.message ?? error)
    }
  })

  // Save Policy v0.2 里程碑信号：在 DSH 公开 tools 服务上注册极窄 model-facing 工具。
  // 软取服务（CLI / 挂载校验平面没有 tools 时静默降级），不为它新增静态模块依赖。
  const tools = ctx.get ? ctx.get('tools') : null
  if (tools?.register) {
    try {
      tools.register({
        name: 'world_mark_milestone',
        description: 'The World 里程碑信号：仅当本回合发生重大阶段切换（官职/身份/阵营实质跃迁、重要 THREADS 批量结算、重大行动或战役结束、重大时间跳跃、阶段性迁移、重要系统长期阶段突破）时，在回合维护完成后调用一次并附简短玩家可读 label。它只把信号记入存档策略状态（saves/POLICY_STATE.json），不会立即建快照、不改任何世界文件、对玩家不可见；本局存档策略不含里程碑时调用无效。普通场景结束、购物、休息、小关系变化都不是里程碑——拿不准就不要调用。',
        parameters: {
          type: 'object',
          properties: {
            label: { type: 'string', description: '简短玩家可读的阶段名，如「升任屯长 · 暗查内坊」「绎幕侦巡完成」，不超过 48 字。' }
          },
          required: ['label'],
          additionalProperties: false
        },
        output: {
          schema: { type: 'json' },
          render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }]
        },
        execute(args, exec) {
          const agent = exec?.agent
          const cwd = cwdOf(agent)
          const game = cwd ? resolveGame(cwd, config.gamesDir) : null
          if (!game || readCompositionStatus(game.dir) !== 'confirmed') {
            return { marked: false, reason: 'not-a-confirmed-game' }
          }
          return markMilestone(game.dir, readSavePolicy(game.dir), args?.label)
        }
      })
    } catch (error) {
      logger.warn('world_mark_milestone 注册失败: %s', error?.message ?? error)
    }
  } else {
    logger.debug('tools 服务不可用，world_mark_milestone 未注册（里程碑信号降级为不可用）')
  }
}
