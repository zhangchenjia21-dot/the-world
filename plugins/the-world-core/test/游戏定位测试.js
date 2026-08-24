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
