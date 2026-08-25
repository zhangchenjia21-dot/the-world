/**
 * 游戏定位测试：解析当前游戏、控制模式归一化、CURRENT.md 字段提取、有界读取。
 * 全部使用临时目录夹具，不依赖真实游戏工作区。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  resolveGame,
  isGameDir,
  readBounded,
  parseCurrentFields,
  normalizeControlMode,
  readSavePolicyInterval,
  parseSavePolicy,
  policyFingerprint,
  describeSavePolicy,
  DEFAULT_CONTROL_MODE
} from '../../shared/游戏定位.js'

function 建临时目录() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tw-test-'))
}

function 建游戏(root, id, currentText = '# Current Game State\n') {
  const dir = path.join(root, 'games', id)
  fs.mkdirSync(path.join(dir, 'state'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'state', 'CURRENT.md'), currentText)
  return dir
}

test('cwd 本身就是游戏目录时直接命中', () => {
  const root = 建临时目录()
  const gameDir = 建游戏(root, 'three-kingdoms_001')
  // 以游戏目录自身作为会话 cwd
  const found = resolveGame(gameDir, 'games')
  assert.equal(found.id, 'three-kingdoms_001')
  assert.equal(found.dir, gameDir)
})

test('指针文件优先于目录推断', () => {
  const root = 建临时目录()
  建游戏(root, 'game-a')
  建游戏(root, 'game-b')
  fs.writeFileSync(path.join(root, 'games', 'CURRENT_GAME'), 'game-b\n')
  const found = resolveGame(root, 'games')
  assert.equal(found.id, 'game-b')
})

test('多游戏且无指针时不猜（恢复错游戏比不恢复更糟）', () => {
  const root = 建临时目录()
  建游戏(root, 'game-a')
  建游戏(root, 'game-b')
  assert.equal(resolveGame(root, 'games'), null)
})

test('唯一游戏目录自动命中，模板目录被排除', () => {
  const root = 建临时目录()
  建游戏(root, 'only-game')
  // _template 即使长得像游戏也不参与推断
  建游戏(root, '_template')
  const found = resolveGame(root, 'games')
  assert.equal(found.id, 'only-game')
})

test('指针指向不存在的目录时回落到唯一目录推断', () => {
  const root = 建临时目录()
  建游戏(root, 'real-game')
  fs.writeFileSync(path.join(root, 'games', 'CURRENT_GAME'), 'ghost')
  const found = resolveGame(root, 'games')
  assert.equal(found.id, 'real-game')
})

test('指针拒绝路径穿越', () => {
  const root = 建临时目录()
  建游戏(root, 'real-game')
  fs.writeFileSync(path.join(root, 'games', 'CURRENT_GAME'), '..')
  const found = resolveGame(root, 'games')
  assert.equal(found?.id, 'real-game')
})

test('无 games 目录 / 无 state 时返回 null 而不是抛错', () => {
  const root = 建临时目录()
  assert.equal(resolveGame(root, 'games'), null)
  assert.equal(isGameDir(path.join(root, 'nowhere')), false)
})

test('readBounded：缺失返回 null，超长截断并标记', () => {
  const root = 建临时目录()
  assert.equal(readBounded(path.join(root, 'none.md'), 100), null)
  const file = path.join(root, 'a.md')
  fs.writeFileSync(file, 'x'.repeat(50))
  assert.deepEqual(readBounded(file, 100), { text: 'x'.repeat(50), truncated: false })
  const bounded = readBounded(file, 10)
  assert.equal(bounded.truncated, true)
  assert.equal(bounded.text.length, 10)
})

test('parseCurrentFields：提取时间/位置/操控模式，TODO 视为未填写', () => {
  const fields = parseCurrentFields([
    '# Current Game State',
    '## Time',
    '- Current time / date: 建安五年 春',
    '## Player',
    '- Identity: 穿越者',
    '- Current location: `许昌`',
    '- Control mode: narrative-delegation'
  ].join('\n'))
  assert.equal(fields.time, '建安五年 春')
  assert.equal(fields.location, '许昌')
  assert.equal(fields.controlMode, 'narrative-delegation')

  const todo = parseCurrentFields('- Current time / date: `TODO`\n- Current location: TODO\n')
  assert.equal(todo.time, undefined)
  assert.equal(todo.location, undefined)
  assert.equal(todo.controlMode, DEFAULT_CONTROL_MODE)
})

test('normalizeControlMode：别名与中文归一，未知值回落默认', () => {
  assert.equal(normalizeControlMode('Full Control'), 'full-control')
  assert.equal(normalizeControlMode('轻度委托'), 'light-delegation')
  assert.equal(normalizeControlMode('叙事委托'), 'narrative-delegation')
  assert.equal(normalizeControlMode('随便玩'), DEFAULT_CONTROL_MODE)
  assert.equal(normalizeControlMode(undefined), DEFAULT_CONTROL_MODE)
})

test('parseCurrentFields：接受中文「操控模式」行', () => {
  const fields = parseCurrentFields('- 操控模式: 完全控制\n')
  assert.equal(fields.controlMode, 'full-control')
})

test('readSavePolicyInterval：从 COMPOSITION.md 解析「每 N 玩家回合」', () => {
  const root = 建临时目录()
  const gameDir = 建游戏(root, 'save-policy')
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), [
    '# Game Composition',
    '- 确认状态: confirmed',
    '- 策略: **每 5 玩家回合自动存档**'
  ].join('\n'))
  assert.equal(readSavePolicyInterval(gameDir), 5)
})

test('readSavePolicyInterval：兼容「每 N 个玩家回合」写法', () => {
  const root = 建临时目录()
  const gameDir = 建游戏(root, 'save-policy-ge')
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), '- 每 10 个玩家回合自动存档\n')
  assert.equal(readSavePolicyInterval(gameDir), 10)
})

test('readSavePolicyInterval：手动存档 / 文件缺失 / 非法数字都返回 null', () => {
  const root = 建临时目录()
  const gameDir = 建游戏(root, 'save-policy-manual')
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), '- 策略: 手动存档\n')
  assert.equal(readSavePolicyInterval(gameDir), null)

  // 没有 COMPOSITION.md
  const bare = 建游戏(root, 'save-policy-none')
  assert.equal(readSavePolicyInterval(bare), null)

  // 0 与负数不是有效间隔
  fs.writeFileSync(path.join(gameDir, 'COMPOSITION.md'), '- 每 0 玩家回合自动存档\n')
  assert.equal(readSavePolicyInterval(gameDir), null)
})

/** ── Save Policy v0.2：parseSavePolicy（任务 §2/§12-1~5）──────────────────── */

test('parseSavePolicy：仅手动（§12-1）', () => {
  assert.deepEqual(parseSavePolicy('- 策略: 仅手动存档；玩家可随时手动存档\n'), {
    manual: true,
    milestone: false,
    interval: null
  })
  // 空文本 / 无策略段落 → 纯手动默认
  assert.deepEqual(parseSavePolicy(''), { manual: true, milestone: false, interval: null })
  assert.deepEqual(parseSavePolicy(null), { manual: true, milestone: false, interval: null })
})

test('parseSavePolicy：每 5 / 10 / 20 玩家回合（§12-2）', () => {
  for (const n of [5, 10, 20]) {
    const policy = parseSavePolicy(`- 策略: 每 ${n} 玩家回合自动存档；玩家可随时手动存档\n`)
    assert.equal(policy.interval, n)
    assert.equal(policy.milestone, false)
    assert.equal(policy.manual, true)
  }
})

test('parseSavePolicy：仅里程碑（§12-3）', () => {
  const policy = parseSavePolicy('- 策略: 仅里程碑（重大阶段切换）自动存档；玩家可随时手动存档\n')
  assert.equal(policy.milestone, true)
  assert.equal(policy.interval, null)
})

test('parseSavePolicy：里程碑 + 定期混合（§12-4）', () => {
  const policy = parseSavePolicy('- 策略: 里程碑 + 每 10 玩家回合自动存档；玩家可随时手动存档\n')
  assert.equal(policy.milestone, true)
  assert.equal(policy.interval, 10)
})

test('parseSavePolicy：乱世三国2 真实文本解析为 milestone-only（§2/§12-5）', () => {
  // 从 games/luan-shi-sanguo-2/COMPOSITION.md 复制的存档策略段落原文（测试只复制文本，不改真实档）
  const text = [
    '## 存档策略',
    '',
    '- 策略: **仅重大阶段切换（里程碑）自动存档 + 玩家随时手动「存档」**',
    '',
    '- 里程碑: THREADS 大批量结算、势力归属变化、主角身份跃迁、重大时间跳跃',
    '- 自动存档保留: 最近 5 个，超出滚动删除；手动存档永不自动删除',
    ''
  ].join('\n')
  const policy = parseSavePolicy(text)
  assert.equal(policy.milestone, true)
  assert.equal(policy.interval, null, '不得把「最近 5 个」误判为每 5 玩家回合')
})

test('parseSavePolicy：乱世三国1 真实文本解析为里程碑 + 每 5（§8 兼容）', () => {
  // 从 games/luan-shi-sanguo/COMPOSITION.md 复制的存档策略段落原文
  const text = [
    '## 存档策略',
    '',
    '- 策略: **每 5 玩家回合自动存档**（2026-08-24 架构迁移时玩家确认）',
    '- 里程碑兜底: 重大阶段切换（THREADS 大批量结算、势力归属变化、主角身份跃迁）时，无论回合计数都自动建立存档',
    '- 自动存档保留: 最近 5 个，超出滚动删除；**手动存档永不自动删除**（玩家随时可说「存档」）',
    ''
  ].join('\n')
  const policy = parseSavePolicy(text)
  assert.equal(policy.milestone, true)
  assert.equal(policy.interval, 5)
})

test('policyFingerprint：策略差异产生不同指纹，同策略同指纹（§4）', () => {
  const a = parseSavePolicy('- 策略: 每 5 玩家回合自动存档\n')
  const b = parseSavePolicy('- 策略: 每 10 玩家回合自动存档\n')
  const c = parseSavePolicy('- 策略: 里程碑 + 每 5 玩家回合自动存档\n')
  assert.notEqual(policyFingerprint(a), policyFingerprint(b))
  assert.notEqual(policyFingerprint(a), policyFingerprint(c))
  assert.equal(policyFingerprint(a), policyFingerprint(parseSavePolicy('- 每 5 个玩家回合自动存档\n')))
})

test('describeSavePolicy：玩家可读中文摘要（§10 可选策略行）', () => {
  assert.equal(describeSavePolicy({ manual: true, milestone: false, interval: null }), '仅手动存档')
  assert.equal(
    describeSavePolicy({ manual: true, milestone: false, interval: 10 }),
    '每 10 玩家回合自动存档；玩家可随时手动存档'
  )
  assert.equal(
    describeSavePolicy({ manual: true, milestone: true, interval: null }),
    '仅里程碑（重大阶段切换）自动存档；玩家可随时手动存档'
  )
  assert.equal(
    describeSavePolicy({ manual: true, milestone: true, interval: 20 }),
    '里程碑 + 每 20 玩家回合自动存档；玩家可随时手动存档'
  )
})
