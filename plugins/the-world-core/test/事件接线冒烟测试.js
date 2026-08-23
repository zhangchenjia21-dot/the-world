/**
 * 事件接线冒烟测试：用最小 stub ctx / agent 驱动真实 apply()，
 * 验证四条 seam 的接线行为：
 * - systemPrompt.section/context 已注册；
 * - agent/session-start → inject 恢复上下文（有/无游戏两种路径）；
 * - agent/turn-stopping → 同一 turn 只 steer 一次维护提醒（无无限循环）；
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

function 建夹具() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-smoke-'))
  const gameDir = path.join(root, 'games', 'three-kingdoms_001')
  fs.mkdirSync(path.join(gameDir, 'state'), { recursive: true })
  fs.mkdirSync(path.join(gameDir, 'memory'), { recursive: true })
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), [
    '# Current Game State',
    '- Current time / date: 建安五年 春',
    '- Current location: 许昌',
    '- Control mode: full-control'
  ].join('\n'))
  fs.writeFileSync(path.join(gameDir, 'memory', 'RECENT.md'), '最近：主角抵达许昌。')
  return { root, gameDir }
}

/** 最小 cordis ctx stub：只实现 apply 用到的四个面。 */
function 建StubCtx() {
  const sections = []
  const contexts = []
  const listeners = new Map()
  const ctx = {
    systemPrompt: {
      section(section) { sections.push(section); return () => {} },
      context(context) { contexts.push(context); return () => {} }
    },
    on(event, fn) { listeners.set(event, fn); return () => {} },
    logger() { return { warn() {} } }
  }
  return { ctx, sections, contexts, listeners }
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

test('session-start：有游戏时注入恢复上下文（含 CURRENT.md 与 RECENT.md 内容）', () => {
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
})

test('session-start：无游戏时注入开局指引而不是报错', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'tw-smoke-empty-'))
  const { listeners } = 装配()
  const agent = 建StubAgent(root)
  listeners.get('agent/session-start')({ agent, source: 'startup' })
  assert.equal(agent.injected.length, 1)
  assert.match(文本(agent.injected[0]), /尚未识别到进行中的游戏/)
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
