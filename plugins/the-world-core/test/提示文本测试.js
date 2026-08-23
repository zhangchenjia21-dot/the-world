/**
 * 提示文本测试：锁定 TW-01 要求注入模型侧的产品语义。
 * 这些断言是产品契约（Gap 01–06），不是实现细节。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  GAME_MODE_SECTION_TEXT,
  CONTROL_MODE_DESCRIPTIONS,
  buildDynamicContext,
  buildRecoveryInjection,
  buildNoGameInjection,
  buildMaintenanceText
} from '../lib/提示文本.js'

const 游戏 = { id: 'three-kingdoms_001', dir: 'D:/games/three-kingdoms_001' }

test('稳定 section 承载全部长期语义（Gap 02/03/05/06 + 工作区 Owner）', () => {
  const s = GAME_MODE_SECTION_TEXT
  // Gap 03 认知边界
  assert.match(s, /NPC 知道 X/)
  assert.match(s, /未来历史事实/)
  // Gap 02 持久身份
  assert.match(s, /Importance controls attention, not existence/)
  // Gap 06 节奏弹性（且不做计数器）
  assert.match(s, /自由支配的时间/)
  // Gap 05 玩家自主权
  assert.match(s, /stop at meaningful choice/)
  // 工作区 Owner 语义
  assert.match(s, /state\/CURRENT\.md/)
  assert.match(s, /story\/LEDGER\.md/)
  assert.match(s, /memory\/RECENT\.md/)
  // Source 边界
  assert.match(s, /绝不把单局演化反向写回 Source/)
  // 写纪律（A6）
  assert.match(s, /没有变化就不写任何文件/)
})

test('三种操控模式语义互不相同且都包含“有意义的选择点”纪律', () => {
  assert.equal(Object.keys(CONTROL_MODE_DESCRIPTIONS).length, 3)
  assert.match(CONTROL_MODE_DESCRIPTIONS['full-control'], /绝不替主角行动/)
  assert.match(CONTROL_MODE_DESCRIPTIONS['light-delegation'], /有意义的选择点/)
  assert.match(CONTROL_MODE_DESCRIPTIONS['narrative-delegation'], /不可逆行为/)
})

test('动态上下文：有游戏时给出 game id / 模式 / 恢复入口，不内联 CURRENT.md 全文', () => {
  const text = buildDynamicContext({
    game: 游戏,
    dynamics: { controlMode: 'light-delegation', time: '建安五年 春', location: '许昌' },
    gamesDirDisplay: 'games',
    templateDirDisplay: 'games/_template'
  })
  assert.match(text, /three-kingdoms_001/)
  assert.match(text, /light-delegation/)
  assert.match(text, /建安五年 春/)
  assert.match(text, /许昌/)
  assert.match(text, /state\/CURRENT\.md/)
  assert.match(text, /NPC 只能说有世界内来源的知识/)
})

test('动态上下文：无游戏时指引开局', () => {
  const text = buildDynamicContext({
    game: null,
    dynamics: {},
    gamesDirDisplay: 'games',
    templateDirDisplay: 'games/_template'
  })
  assert.match(text, /未识别到进行中的游戏/)
  assert.match(text, /_template/)
  assert.match(text, /CURRENT_GAME/)
})

test('恢复注入：内联 current truth，标注截断，不要求玩家复述', () => {
  const text = buildRecoveryInjection({
    game: 游戏,
    source: 'startup',
    current: { text: '# Current Game State\n- 主角在许昌', truncated: true },
    recent: { text: '最近：与张辽结识', truncated: false }
  })
  assert.match(text, /three-kingdoms_001/)
  assert.match(text, /主角在许昌/)
  assert.match(text, /已截断/)
  assert.match(text, /与张辽结识/)
  assert.match(text, /不要要求玩家复述旧剧情/)
})

test('恢复注入：CURRENT.md 缺失时引导重建而不是失败', () => {
  const text = buildRecoveryInjection({ game: 游戏, source: 'resume', current: null, recent: null })
  assert.match(text, /重建/)
})

test('维护提醒：只检查 durable changes、无变化不写文件、不继续剧情', () => {
  const text = buildMaintenanceText({ game: 游戏 })
  assert.match(text, /durable facts/)
  assert.match(text, /没有 durable change 就不要重写任何文件/)
  assert.match(text, /不要继续剧情/)
  assert.match(text, /不要输出面向玩家的内容/)
  assert.match(text, /Control mode/)
  assert.match(text, /three-kingdoms_001/)
})

test('无游戏注入：说明如何开局与继续旧游戏', () => {
  const text = buildNoGameInjection({ gamesDirDisplay: 'games', templateDirDisplay: 'games/_template' })
  assert.match(text, /_template/)
  assert.match(text, /CURRENT_GAME/)
})
