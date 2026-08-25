/**
 * 事件接线冒烟测试：用最小 stub ctx / agent 驱动真实 apply()，
 * 验证四条 seam 的接线行为：
 * - systemPrompt.section/context 已注册；
 * - agent/session-start → inject 恢复上下文（已确认游戏 / 未确认草稿 / 无游戏三种路径；
 *   已确认游戏的恢复注入包含未归并的 DELTAS）；
 * - agent/turn-stopping → 同一 turn 只 steer 一次维护提醒（无无限循环）；
 *   普通回合 steer Tier 1 delta 捕获，存档间隔回合升级为 Tier 2 检查点归并；
 * - 无游戏 / 已 abort / 关闭 maintenance 时不 steer。
 *
 * 这是“最小本地 smoke test”的自动化部分；真实 preset 挂载校验见 scripts/验证挂载.mjs。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { apply, Config } from '../lib/index.js'
import { REQUIRED_STRUCTURE, listSaves, resolveSaveDir, readPolicyState } from '../../shared/存档.js'

function 建夹具(policyLine = '- Save Policy: 每 5 玩家回合自动存档') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-smoke-'))
  const gameDir = path.join(root, 'games', 'three-kingdoms_001')
  for (const relative of REQUIRED_STRUCTURE) {
    const file = path.join(gameDir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, `# ${relative.replace(/\\/g, '/')}\n`, 'utf8')
  }
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), [
    '# Game Composition',
    '- World: 乱世三国',
    '- Control Mode: full-control',
    policyLine,
    '- 确认状态: confirmed'
  ].join('\n'))
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), [
    '# Current Game State',
    '- Current time / date: 建安五年 春',
    '- Current location: 许昌',
    '- Control mode: full-control'
  ].join('\n'))
  fs.writeFileSync(path.join(gameDir, 'memory', 'RECENT.md'), '最近：主角抵达许昌。')
  fs.writeFileSync(path.join(gameDir, 'memory', 'DELTAS.md'), [
    '# DELTAS｜待归并的持久变化',
    '## 待归并',
    '- 张辽 对主角 好感上升（建议 Owner: state/characters/张辽.md）'
  ].join('\n'))
  return { root, gameDir }
}

/** 最小 cordis ctx stub：实现 apply 用到的面（含 tools 服务软取与 logger.debug）。 */
function 建StubCtx() {
  const sections = []
  const contexts = []
  const listeners = new Map()
  const tools = { registered: [], register(def) { this.registered.push(def); return () => {} } }
  const ctx = {
    systemPrompt: {
      section(section) { sections.push(section); return () => {} },
      context(context) { contexts.push(context); return () => {} }
    },
    on(event, fn) { listeners.set(event, fn); return () => {} },
    get(name) { return name === 'tools' ? tools : null },
    logger() { return { warn() {}, debug() {} } }
  }
  return { ctx, sections, contexts, listeners, tools }
}

function 建StubAgent(cwd) {
  return {
    id: 'session-stub',
    session: { header: { cwd } },
    injected: [],
    steered: [],
    inject(message) { this.injected.push(message) },
    steer(message) { this.steered.push(message) }
  }
}

function 装配(overrides = {}) {
  const config = Config(overrides) // schemastery schema 同时承担默认值填充
  const harness = 建StubCtx()
  apply(harness.ctx, config)
  return harness
}

function 文本(message) {
  return message.content[0].text
}

test('apply 注册稳定 section 与动态 context，且 apply 期不触碰 agent', () => {
  const { sections, contexts, listeners } = 装配()
  assert.equal(sections.length, 1)
  assert.equal(sections[0].name, 'the-world:game-mode')
  assert.match(sections[0].text, /The World/)
  assert.equal(contexts.length, 1)
  assert.equal(contexts[0].name, 'the-world:game-state')
  assert.ok(listeners.has('agent/session-start'))
  assert.ok(listeners.has('agent/turn-stopping'))
})

test('session-start：已确认游戏注入恢复上下文（含 CURRENT / RECENT / 未归并 DELTAS）', () => {
  const { root } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  listeners.get('agent/session-start')({ agent, source: 'startup' })
  assert.equal(agent.injected.length, 1)
  assert.equal(agent.injected[0].source.kind, 'plugin')
  assert.equal(agent.injected[0].source.plugin, 'the-world-core')
  assert.equal(agent.injected[0].source.form, 'recovery')
  assert.match(文本(agent.injected[0]), /建安五年 春/)
  assert.match(文本(agent.injected[0]), /主角抵达许昌/)
  // 未归并的 DELTAS 自写入起即为有效事实，恢复时必须带入
  assert.match(文本(agent.injected[0]), /张辽 对主角 好感上升/)
})

test('session-start：无游戏时注入开局指引而不是报错', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-smoke-empty-'))
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  listeners.get('agent/session-start')({ agent, source: 'startup' })
  assert.equal(agent.injected.length, 1)
  assert.match(文本(agent.injected[0]), /New Game Setup/)
})

test('session-start：未 confirmed 的草稿目录注入 Setup 续推指引而非恢复', () => {
  const { root, gameDir } = 建夹具()
  // 去掉确认标记，模拟 Setup 半成品
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), '# Game Composition\n- World: 乱世三国\n')
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  listeners.get('agent/session-start')({ agent, source: 'startup' })
  assert.equal(agent.injected.length, 1)
  assert.equal(agent.injected[0].source.form, 'setup')
  assert.match(文本(agent.injected[0]), /未确认草稿/)
})

test('turn-stopping：每个 turn 恰好 steer 一次维护提醒，不形成无限循环', () => {
  const { root } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  const fire = (turn) => listeners.get('agent/turn-stopping')({ agent, turn, signal: { aborted: false } })
  fire(1)
  assert.equal(agent.steered.length, 1)
  assert.equal(agent.steered[0].source.form, 'maintenance')
  assert.match(文本(agent.steered[0]), /回合维护/)
  fire(1) // 维护步骤结束后的第二次 turn-stopping：不得重复
  fire(1)
  assert.equal(agent.steered.length, 1)
  fire(2) // 下一回合：恢复提醒
  assert.equal(agent.steered.length, 2)
})

test('turn-stopping：普通回合 steer delta 捕获，存档间隔回合升级为检查点归并', () => {
  const { root, gameDir } = 建夹具() // 夹具存档策略：每 5 玩家回合
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  const fire = (turn) => listeners.get('agent/turn-stopping')({ agent, turn, signal: { aborted: false } })

  for (const turn of [1, 2, 3, 4]) {
    fire(turn)
    assert.match(文本(agent.steered[turn - 1]), /回合维护/)
    assert.doesNotMatch(文本(agent.steered[turn - 1]), /检查点归并/)
  }
  fire(5)
  assert.equal(agent.steered.length, 5)
  assert.match(文本(agent.steered[4]), /检查点归并/)
  assert.match(文本(agent.steered[4]), /每 5 玩家回合/)
  assert.equal(listSaves(gameDir).length, 0, '归并 maintenance 尚未完成时不得提前 snapshot')

  // 模拟归并 step 已把 Owner / DELTAS 更新完；同一 turn 第二次 stopping 才是安全存档 seam。
  fs.writeFileSync(path.join(gameDir, 'memory', 'DELTAS.md'), '# DELTAS｜待归并的持久变化\n', 'utf8')
  fire(5)
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 1)
  assert.equal(saves[0].kind, 'auto-checkpoint')
  assert.equal(saves[0].label, '第 5 玩家回合自动存档')
  assert.equal(
    fs.readFileSync(path.join(resolveSaveDir(gameDir, saves[0].id), 'memory', 'DELTAS.md'), 'utf8'),
    '# DELTAS｜待归并的持久变化\n'
  )
})

test('turn-stopping：无自动存档策略时按 consolidationInterval 默认值归并', () => {
  const { root, gameDir } = 建夹具()
  // 手动存档：COMPOSITION 里没有「每 N 玩家回合」，回落到 config 默认值
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), [
    '# Game Composition',
    '- Save Policy: 手动存档',
    '- 确认状态: confirmed'
  ].join('\n'))
  const { listeners } = 装配({ consolidationInterval: 3 })
  const agent = 建StubAgent(root)
  const fire = (turn) => listeners.get('agent/turn-stopping')({ agent, turn, signal: { aborted: false } })
  fire(1)
  fire(2)
  assert.match(文本(agent.steered[1]), /回合维护/)
  fire(3)
  assert.match(文本(agent.steered[2]), /检查点归并/)
  assert.match(文本(agent.steered[2]), /每 3 玩家回合/)
  fire(3)
  assert.equal(listSaves(gameDir).length, 0, '手动策略只归并，不自动创建快照')
})

test('turn-stopping：无游戏 / 已 abort / 关闭 maintenance 时一律不 steer', () => {
  const emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-smoke-empty-'))
  const { root } = 建夹具()
  const { listeners } = 装配()
  const noGame = 建StubAgent(emptyRoot)
  listeners.get('agent/turn-stopping')({ agent: noGame, turn: 1, signal: { aborted: false } })
  assert.equal(noGame.steered.length, 0)

  const aborted = 建StubAgent(root)
  listeners.get('agent/turn-stopping')({ agent: aborted, turn: 1, signal: { aborted: true } })
  assert.equal(aborted.steered.length, 0)

  const off = 装配({ maintenance: false })
  const disabled = 建StubAgent(root)
  off.listeners.get('agent/turn-stopping')({ agent: disabled, turn: 1, signal: { aborted: false } })
  assert.equal(disabled.steered.length, 0)
})

test('动态 context：有游戏时包含模式与位置；无 agent 的诊断组装返回空', () => {
  const { root } = 建夹具()
  const { contexts } = 装配()
  const agent = 建StubAgent(root)
  const text = contexts[0].text({ agent })
  assert.match(text, /three-kingdoms_001/)
  assert.match(text, /full-control/)
  assert.match(text, /许昌/)
  assert.equal(contexts[0].text({}), '')
})

test('动态 context：玩家改完 CURRENT.md 的 Control mode 后下一轮立即生效', () => {
  const { root, gameDir } = 建夹具()
  const { contexts } = 装配()
  const agent = 建StubAgent(root)
  assert.match(contexts[0].text({ agent }), /full-control/)
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'),
    '# Current Game State\n- Control mode: narrative-delegation\n')
  assert.match(contexts[0].text({ agent }), /narrative-delegation/)
})

/** ── Save Policy v0.2（任务 §5/§6/§8/§12）────────────────────────────────── */

const 里程碑策略行 = '- 策略: 仅里程碑（重大阶段切换）自动存档；玩家可随时手动存档'
const 混合策略行 = '- 策略: 里程碑 + 每 5 玩家回合自动存档；玩家可随时手动存档'

function 触发(listeners, agent, turn, aborted = false) {
  listeners.get('agent/turn-stopping')({ agent, turn, signal: { aborted } })
}

function 里程碑工具(harness) {
  const tool = harness.tools.registered.find((t) => t.name === 'world_mark_milestone')
  assert.ok(tool, 'world_mark_milestone 必须注册到 tools 服务')
  return tool
}

test('apply 把 world_mark_milestone 注册到 tools 服务（§6 seam）', () => {
  const harness = 装配()
  const tool = 里程碑工具(harness)
  assert.equal(tool.parameters.required.includes('label'), true)
  assert.equal(typeof tool.execute, 'function')
})

test('跨 Session：Session A 4 回合 + Session B 1 回合，在每 5 策略下产生自动档（§12-6）', () => {
  const { root, gameDir } = 建夹具() // 每 5 玩家回合
  // Session A：4 个完整回合（first + second stopping）
  const harnessA = 装配()
  const agentA = 建StubAgent(root)
  for (const turn of [1, 2, 3, 4]) {
    触发(harnessA.listeners, agentA, turn)
    触发(harnessA.listeners, agentA, turn)
  }
  assert.equal(listSaves(gameDir).length, 0)
  assert.equal(readPolicyState(gameDir).totalPlayerTurns, 4)

  // Session B：新 agent、新 apply（进程内 WeakMap 全空），权威计数来自 POLICY_STATE.json
  const harnessB = 装配()
  const agentB = 建StubAgent(root)
  触发(harnessB.listeners, agentB, 1)
  assert.match(文本(agentB.steered[0]), /检查点归并/)
  assert.equal(listSaves(gameDir).length, 0, '归并完成前不得建档')
  触发(harnessB.listeners, agentB, 1)
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 1)
  assert.equal(saves[0].kind, 'auto-checkpoint')
  assert.equal(saves[0].label, '第 5 玩家回合自动存档')
})

test('maintenance second stopping 不重复计数（§12-7）', () => {
  const { root, gameDir } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  触发(listeners, agent, 1)
  触发(listeners, agent, 1)
  触发(listeners, agent, 1)
  assert.equal(readPolicyState(gameDir).totalPlayerTurns, 1)
})

test('aborted turn 不计数也不建档（§12-8）', () => {
  const { root, gameDir } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  for (const turn of [1, 2, 3, 4]) 触发(listeners, agent, turn)
  触发(listeners, agent, 5, true) // 第 5 回合被 abort
  assert.equal(readPolicyState(gameDir).totalPlayerTurns, 4)
  assert.equal(listSaves(gameDir).length, 0)
})

test('interval：成功重置 progress，第 10 回合再次出档（§12-11）', () => {
  const { root, gameDir } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  const 回合 = (turn) => { 触发(listeners, agent, turn); 触发(listeners, agent, turn) }
  for (const turn of [1, 2, 3, 4]) 回合(turn)
  回合(5)
  assert.equal(listSaves(gameDir).length, 1)
  assert.equal(readPolicyState(gameDir).intervalProgress, 0, '成功后 progress 重置')

  for (const turn of [6, 7, 8, 9]) 回合(turn)
  assert.equal(listSaves(gameDir).length, 1, 'due 前不再 snapshot（§12-9）')
  回合(10)
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 2)
  assert.equal(saves[1].label, '第 10 玩家回合自动存档')
})

test('interval：snapshot 失败不清进度、记录错误，下一安全回合重试并成功（§12-12/24）', () => {
  const { root, gameDir } = 建夹具()
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  for (const turn of [1, 2, 3, 4]) { 触发(listeners, agent, turn); 触发(listeners, agent, turn) }

  触发(listeners, agent, 5) // first stopping：steer 归并
  // 模拟归并 step 出岔：工作区缺 story/LEDGER.md，snapshot 必然 workspace-incomplete
  const ledger = path.join(gameDir, 'story', 'LEDGER.md')
  const ledgerBackup = fs.readFileSync(ledger, 'utf8')
  fs.rmSync(ledger)
  触发(listeners, agent, 5) // second stopping：建档失败
  assert.equal(listSaves(gameDir).length, 0)
  const failed = readPolicyState(gameDir)
  assert.match(failed.lastAutoSaveError, /工作区不完整/)
  assert.equal(failed.intervalProgress, 5, '失败不清零进度')

  // 修复工作区，下一回合重试
  fs.writeFileSync(ledger, ledgerBackup, 'utf8')
  触发(listeners, agent, 6)
  assert.match(文本(agent.steered[agent.steered.length - 1]), /检查点归并/, '进度仍 due：再次 steer 归并')
  触发(listeners, agent, 6)
  assert.equal(listSaves(gameDir).length, 1)
  const recovered = readPolicyState(gameDir)
  assert.equal(recovered.lastAutoSaveError, null, '成功后清除错误')
  assert.equal(recovered.intervalProgress, 0)
})

test('milestone：GM step 里 signal → 本回合升级归并 → second stopping 建 milestone 档（§12-13）', () => {
  const { root, gameDir } = 建夹具(里程碑策略行)
  const harness = 装配()
  const agent = 建StubAgent(root)
  const tool = 里程碑工具(harness)

  // GM step 中识别到重大阶段切换，发出 signal（不建快照、不动世界文件）
  const marked = tool.execute({ label: '升任屯长 · 暗查内坊' }, { agent })
  assert.equal(marked.marked, true)
  assert.equal(listSaves(gameDir).length, 0)

  触发(harness.listeners, agent, 1)
  assert.match(文本(agent.steered[0]), /检查点归并/, 'pending milestone 把本回合升级为归并')
  触发(harness.listeners, agent, 1)
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 1)
  assert.equal(saves[0].kind, 'milestone')
  assert.equal(saves[0].label, '升任屯长 · 暗查内坊')

  const state = readPolicyState(gameDir)
  assert.equal(state.pendingMilestone, null, '成功后清掉 pending milestone')
  assert.equal(state.lastAutoSaveError, null)
})

test('milestone：maintenance review 中才 signal → second stopping 读簿记建档（§8.2）', () => {
  const { root, gameDir } = 建夹具(里程碑策略行)
  const harness = 装配()
  const agent = 建StubAgent(root)
  const tool = 里程碑工具(harness)

  触发(harness.listeners, agent, 1) // first stopping：无 pending → 普通维护，且含里程碑指引
  assert.match(文本(agent.steered[0]), /回合维护/)
  assert.match(文本(agent.steered[0]), /world_mark_milestone/)
  tool.execute({ label: '绎幕侦巡完成' }, { agent }) // maintenance step 里 signal
  触发(harness.listeners, agent, 1) // second stopping：maintenance 已完成，读簿记建档
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 1)
  assert.equal(saves[0].kind, 'milestone')
  assert.equal(saves[0].label, '绎幕侦巡完成')
})

test('milestone：无里程碑策略时 signal 被 ignored，second stopping 不建档（§12-14）', () => {
  const { root, gameDir } = 建夹具() // 每 5 玩家回合（无里程碑）
  const harness = 装配()
  const agent = 建StubAgent(root)
  const tool = 里程碑工具(harness)
  const result = tool.execute({ label: '不该成立' }, { agent })
  assert.equal(result.marked, false)
  assert.equal(result.reason, 'policy-without-milestone')
  触发(harness.listeners, agent, 1)
  assert.doesNotMatch(文本(agent.steered[0]), /world_mark_milestone/, '无里程碑策略的维护文案不提工具')
  触发(harness.listeners, agent, 1)
  assert.equal(listSaves(gameDir).length, 0)
})

test('milestone：未 confirmed 游戏 signal 被拒绝（§6 confirmed 门）', () => {
  const { root, gameDir } = 建夹具(里程碑策略行)
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), '# Game Composition\n- World: 乱世三国\n')
  const harness = 装配()
  const agent = 建StubAgent(root)
  const tool = 里程碑工具(harness)
  const result = tool.execute({ label: '草稿阶段' }, { agent })
  assert.equal(result.marked, false)
  assert.equal(result.reason, 'not-a-confirmed-game')
  assert.equal(readPolicyState(gameDir), null, '不得为未确认游戏创建簿记')
})

test('hybrid：interval due 与 milestone 同 turn 只建一个 milestone 档并重置进度（§8.3/§12-17/18）', () => {
  const { root, gameDir } = 建夹具(混合策略行) // 里程碑 + 每 5
  const harness = 装配()
  const agent = 建StubAgent(root)
  const tool = 里程碑工具(harness)
  for (const turn of [1, 2, 3, 4]) { 触发(harness.listeners, agent, turn); 触发(harness.listeners, agent, turn) }
  assert.equal(listSaves(gameDir).length, 0)

  tool.execute({ label: '加入刘备义军' }, { agent }) // 第 5 回合 GM step 里 signal
  触发(harness.listeners, agent, 5)
  触发(harness.listeners, agent, 5)
  const saves = listSaves(gameDir)
  assert.equal(saves.length, 1, '同 turn 不重复建档')
  assert.equal(saves[0].kind, 'milestone', '里程碑语义优先于 auto-checkpoint')
  assert.equal(saves[0].label, '加入刘备义军')
  const state = readPolicyState(gameDir)
  assert.equal(state.intervalProgress, 0, 'milestone 档同样视为定期安全点已满足')
  assert.equal(state.totalPlayerTurns, 5)
})

test('hybrid：普通回合既不 due 也无 milestone，只维护不建档（§14 验收）', () => {
  const { root, gameDir } = 建夹具(混合策略行)
  const harness = 装配()
  const agent = 建StubAgent(root)
  触发(harness.listeners, agent, 1)
  触发(harness.listeners, agent, 1)
  assert.equal(listSaves(gameDir).length, 0)
  assert.match(文本(agent.steered[0]), /回合维护/)
})
