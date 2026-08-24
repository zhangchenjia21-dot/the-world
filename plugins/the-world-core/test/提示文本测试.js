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
  buildMaintenanceText,
  buildConsolidationText
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
  // 两层维护：每回合 delta 捕获 + 检查点归并
  assert.match(s, /memory\/DELTAS\.md/)
  assert.match(s, /检查点/)
  assert.match(s, /从写入起就是有效事实/)
  // 写纪律（A6）
  assert.match(s, /没有 durable 变化就不写任何文件/)
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

test('恢复注入：未归并的 DELTAS 作为有效事实一并注入', () => {
  const text = buildRecoveryInjection({
    game: 游戏,
    source: 'startup',
    current: { text: '# Current Game State\n- 主角在许昌', truncated: false },
    recent: null,
    deltas: { text: '## 待归并\n- 张辽 对主角 好感上升（建议 Owner: state/characters/张辽.md）', truncated: false }
  })
  assert.match(text, /memory\/DELTAS\.md/)
  assert.match(text, /自写入起即为有效事实/)
  assert.match(text, /张辽 对主角 好感上升/)
  assert.match(text, /视为已经发生的事实纳入主持/)
  assert.match(text, /归并到各 Owner/)
})

test('恢复注入：没有 DELTAS 时不出现 DELTAS 区块', () => {
  const text = buildRecoveryInjection({
    game: 游戏,
    source: 'startup',
    current: { text: '# Current Game State', truncated: false },
    recent: null,
    deltas: null
  })
  assert.doesNotMatch(text, /DELTAS/)
})

test('维护提醒（Tier 1 delta 捕获）：只追加 DELTAS、无变化不写文件、不继续剧情', () => {
  const text = buildMaintenanceText({ game: 游戏 })
  assert.match(text, /回合维护/)
  assert.match(text, /durable facts/)
  assert.match(text, /没有 durable change：不写任何文件/)
  assert.match(text, /memory\/DELTAS\.md 追加 1–3 行/)
  assert.match(text, /不要为此重读任何文件/)
  assert.match(text, /不建档、不刷新 INDEX、不改写其它文件/)
  assert.match(text, /不要继续剧情/)
  assert.match(text, /不要输出面向玩家的内容/)
  assert.match(text, /Control mode/)
  assert.match(text, /three-kingdoms_001/)
})

test('检查点归并（Tier 2）：先捕获再归并到各 Owner，归并后清空 DELTAS，存档前完成', () => {
  const text = buildConsolidationText({ game: 游戏, interval: 5 })
  assert.match(text, /检查点归并/)
  assert.match(text, /每 5 玩家回合/)
  assert.match(text, /memory\/DELTAS\.md 追加 1–3 行/)
  assert.match(text, /逐条写回正确 Owner/)
  assert.match(text, /state\/THREADS\.md/)
  assert.match(text, /state\/characters\//)
  assert.match(text, /mechanics\/<机制>\/STATE\.md/)
  assert.match(text, /story\/LEDGER\.md/)
  assert.match(text, /移除已归并条目/)
  assert.match(text, /存档快照/)
  assert.match(text, /不替玩家做任何决定/)
  assert.match(text, /静默结束/)
  assert.match(text, /three-kingdoms_001/)
})

test('无游戏注入：说明如何开局与继续旧游戏', () => {
  const text = buildNoGameInjection({ gamesDirDisplay: 'games', templateDirDisplay: 'games/_template' })
  assert.match(text, /_template/)
  assert.match(text, /CURRENT_GAME/)
})
