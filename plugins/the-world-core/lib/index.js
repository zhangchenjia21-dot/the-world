/**
 * the-world-core — The World TW-01 Minimal World Core（cordis 插件入口）。
 *
 * 职责（Brief §6）：Game Mode Context + Game Recovery + Durable Maintenance
 * Coordination + Knowledge Boundary + Agency Context + Minimal Pacing Guidance。
 * 不做完整 RPG Runtime（Brief §11 Non-goals）。
 *
 * 实际使用的 DSH 正式 seams：
 * - `ctx.systemPrompt.section()`：稳定游戏模式语义（order 40，persona 之后、工具指导之前）；
 * - `ctx.systemPrompt.context()`：每轮组装的动态游戏上下文（当前 game / 操控模式 / 时间位置指针）；
 * - `agent/session-start` + `Agent.inject()`：新会话恢复注入（Gap 04）；
 *   含 WC-08 确认门：游戏目录存在但 COMPOSITION.md 未经玩家确认时，
 *   注入“先补完最终确认”而不是正常恢复上下文，确认前不进入正式叙事；
 * - `agent/turn-stopping` + `Agent.steer()`：回合结束维护提醒（Gap 01），同一 turn 只发一次；
 * - scoped plugin lifecycle：本插件作为 agent preset（the-world）组合的一行挂载，
 *   在 preset standing scope 注册一次，覆盖所有加入该 preset 的会话（事件沿 scope 链向上到达本监听器）。
 *
 * 未使用的候选 seam 及原因：
 * - `Agent.runMaintenance()`：它把维护放到 turn 之外的 idle 阶段，模型在维护任务里
 *   无法自然延续本轮的叙事上下文；turn-stopping steer 让维护发生在同一 turn 内，更贴近
 *   Brief §7.3 的候选流程；
 * - `agent/pre-step` / `agent/request` waterfall：不需要改写或否决模型请求（Freedom Before Prevention）；
 * - host 平面 bundle + `agent/created` 全局监听：preset 组合是 DSH 官方的“每会话世界”机制，
 *   不触碰宿主 profile，不引入 GUI 启动风险。
 *
 * apply() 只做注册（区段/上下文/监听器），不执行任何运行期动作；
 * 全部运行期行为都在事件回调里，且对缺失工作区、半写文件一律静默回落。
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

/** 依赖 systemPrompt 服务先就位（preset 组合里由宿主平面提供）。 */
export const inject = ['systemPrompt']

export const Config = z.object({
  /** 游戏根目录：相对会话 cwd 或绝对路径。 */
  gamesDir: z.string().default('games'),
  /** 新游戏模板目录（仅用于提示文案）。 */
  templateDir: z.string().default('games/_template'),
  /** 恢复注入中单个文件的最大内联字符数，超出截断并提示模型自行 read。 */
  maxFileChars: z.number().default(12000),
  /** 回合结束维护提醒总开关（调试/对照实验时可关）。 */
  maintenance: z.boolean().default(true)
})

/** 注入消息的来源标签：无标签的注入会在派生历史里被渲染成用户发言。 */
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

  // ── 稳定游戏模式上下文（Brief §7.1）────────────────────────────────────
  ctx.systemPrompt.section({
    name: 'the-world:game-mode',
    order: 40,
    text: GAME_MODE_SECTION_TEXT
  })

  // ── 动态游戏上下文（Brief §7.2）────────────────────────────────────────
  // 每次 prompt 组装求值；无 agent 的诊断性组装返回空，避免误报游戏状态。
  ctx.systemPrompt.context({
    name: 'the-world:game-state',
    order: 100,
    text: (assembleCtx) => {
      const agent = assembleCtx?.agent
      if (!agent) return ''
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      const dynamics = game ? readGameDynamics(game.dir) : {}
      return buildDynamicContext({
        game,
        dynamics,
        gamesDirDisplay: config.gamesDir,
        templateDirDisplay: config.templateDir
      })
    }
  })

  // ── 会话开始恢复（Brief §7.4 / Gap 04）─────────────────────────────────
  // inject() 不唤醒 driver：恢复上下文排队到玩家的第一条消息所在 turn 生效。
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
          'recovery'
        ))
        return
      }
      const compositionStatus = readCompositionStatus(game.dir)
      if (compositionStatus === 'pending') {
        // WC-08 确认门：组合存在但未经玩家确认，先补完最终确认再叙事
        agent.inject(userMessage(buildSetupResumeInjection({ game }), 'setup'))
        return
      }
      const current = readBounded(path.join(game.dir, 'state', 'CURRENT.md'), config.maxFileChars)
      const recent = readBounded(path.join(game.dir, 'memory', 'RECENT.md'), config.maxFileChars)
      // 已确认的组合随恢复一并注入；早期游戏无 COMPOSITION.md 时走原恢复路径并提示补记
      const composition = compositionStatus === 'confirmed'
        ? readBounded(path.join(game.dir, COMPOSITION_FILE), config.maxFileChars)
        : null
      agent.inject(userMessage(
        buildRecoveryInjection({ game, source, current, recent, composition }),
        'recovery'
      ))
    } catch (error) {
      // 恢复失败不阻断会话：玩家仍可正常游戏，模型可从零重建工作区
      logger.warn('session-start 恢复注入失败: %s', error?.message ?? error)
    }
  })

  // ── 回合结束持久维护（Brief §7.3 / Gap 01）─────────────────────────────
  // 程序保证 review 一定发生；哪些变化 durable、写哪个文件由模型决定。
  // 同一 turn 的去重集合保证不会形成 maintenance 无限循环（Brief §7.3 硬性要求）。
  const maintainedTurns = new WeakMap()
  ctx.on('agent/turn-stopping', ({ agent, turn, signal }) => {
    if (!config.maintenance) return
    if (signal?.aborted) return
    try {
      const cwd = cwdOf(agent)
      const game = cwd ? resolveGame(cwd, config.gamesDir) : null
      if (!game) return // 尚未开局：没有可维护的工作区（A6：不无的放矢）
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
