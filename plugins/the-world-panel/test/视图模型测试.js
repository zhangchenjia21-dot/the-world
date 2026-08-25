/** 玩家视图模型层测试：跨 Owner 聚合、开发者元数据清洗、缺失降级、非三国通用性。 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildOverview,
  characterView,
  cleanDisplay,
  stripDevRefs,
  mapCharRefs,
  localizeStatus,
  heroIdentity,
  heroFacts,
  charDisplayName,
  parsePeopleIndex,
  personBuckets,
  parseThreads,
  threadGroup,
  sortThreads,
  splitMechanics,
  mechanicName,
  mechanicStatus,
  sectionsOf,
  splitDoc,
  worldName
} from '../src/client/viewmodel.js'

/** 通用夹具（故意不是三国）：奇幻世界、另一个主角、另一套机制。 */
const PLAYER = `---
id: player-linyuan
姓名: 林远
类型: 玩家角色
updated: 星历 342 年
---

# 星港｜玩家角色：林远

> 本文件 Own：林远「是谁、身体如何」。不归本文件：时间（→ CURRENT.md）。

## 身份

- 姓名: 林远；31 岁，女
- 来历: 外环矿工出身

## 社会身份

- 军职: **代理轮机长**，领**七号坞**检修责
- 保人: 老灶（连坐）

## 身体

- 左臂擦伤，恢复中

## 装备 / 携带物

- 工装、磁力靴随身；备件已入货舱（→ ../mechanics/cargo-system/STATE.md）

## 知识边界（角色本人知道什么）

- 不熟悉内环礼仪
`

const CURRENT = `# 星港｜Current State

## 时间

- 时间: 星历 342 年 · 港时夜
- 操控模式: full-control

## 当前位置与场景

- 当前位置: 七号坞 · 检修平台

## 玩家眼前的人

- 老灶（[char-laozao](characters/char-laozao.md)）——正在核对备件单

## 刚刚发生什么

- **晋升（大成功）**：授代理轮机长
- 七号坞气压阀泄漏已隔离

## 当前最直接的问题 / 选择

- **先修哪一段**：A 段在漏气
`

const THREADS = `# THREADS

## open

### Q-01｜气压阀泄漏未根除

- 状态: open（紧急）
- 目标: 保住七号坞

### Q-02｜老灶的保人债

- 状态: open（长期）
- 目标: 找时机还情

### Q-03｜考取正式轮机资格

- 状态: open
- 目标: 三个月后考核
`

const MECHANIC = `---
mechanic: cargo-system
source: library/mechanics/货舱_Expansion.md
持有者: player-linyuan
updated: 星历 342 年
---

# 货舱系统｜本局运行状态

- 状态: 已激活

## 货币

- 120 信用点（检修津贴余）

## 货舱

- 当前存放：备件箱×2

## 任务

- 「首航」——已完成
`

const INDEX = `# characters｜INDEX

| ID | 姓名 | 状态 | 当前位置 | 所属/阵营 | 与主角关系 | 最后确认 |
|---|---|---|---|---|---|---|
| [char-laozao](char-laozao.md) | 老灶 | active | 七号坞 | 港务局 | 保人 · 同组 | 星历342 |
| [char-x9](char-x9.md) | X-9 巡逻机 | 敌对 | 外环 | 掠劫团 | 敌对 | 星历341 |
`

const COMPOSITION = '# 星港｜Game Composition\n\n- 确认状态: confirmed\n'

const projection = (over = {}) => ({
  game: { id: 'xingang' },
  player: { text: PLAYER },
  current: { text: CURRENT },
  threads: { text: THREADS },
  composition: { text: COMPOSITION },
  charactersIndex: { text: INDEX },
  characters: [],
  mechanics: [{ id: 'cargo-system', text: MECHANIC }],
  ...over
})

test('概览聚合：跨 Owner 拼出 我是谁/何时何地/危机/事务/近期', () => {
  const ov = buildOverview(projection())
  assert.equal(ov.name, '林远')
  assert.ok(ov.identity.some((l) => l.includes('代理轮机长')))
  assert.ok(ov.time?.includes('星历 342'))
  assert.ok(ov.location?.includes('七号坞'))
  assert.ok(ov.health?.includes('左臂'))
  assert.deepEqual(ov.crises.map((c) => c.id), ['Q-01'])
  assert.ok(ov.affairs.length >= 2)
  assert.ok(ov.recent.some((r) => r.includes('晋升')))
  assert.ok(ov.issues.some((i) => i.includes('先修哪一段')))
  assert.ok(ov.resources.some((r) => r.value.includes('120')))
  assert.deepEqual(ov.nearby, ['老灶'])
})

test('开发者元数据不进入概览视图模型', () => {
  const ov = buildOverview(projection())
  const all = JSON.stringify(ov)
  for (const banned of ['player-linyuan', 'cargo-system', 'mechanics/', 'source:', 'updated', '→ ', '.md', '本文件 Own'])
    assert.ok(!all.includes(banned), `概览不应包含 ${banned}`)
})

test('概览缺失降级：没有 CURRENT/THREADS/mechanics 仍可渲染', () => {
  const ov = buildOverview(projection({ current: null, threads: null, mechanics: [], charactersIndex: null }))
  assert.equal(ov.name, '林远')
  assert.equal(ov.time, null)
  assert.deepEqual(ov.crises, [])
  assert.deepEqual(ov.resources, [])
  assert.deepEqual(ov.recent, [])
})

test('概览连 PLAYER 也缺失时不炸', () => {
  const ov = buildOverview({ game: { id: 'empty' } })
  assert.equal(ov.name, null)
  assert.deepEqual(ov.affairs, [])
})

test('角色页分层：低频节折叠，装备节移交行囊', () => {
  const view = characterView(PLAYER)
  assert.equal(view.name, '林远')
  assert.ok(view.primary.some((s) => s.title.startsWith('社会身份')))
  assert.ok(view.collapsed.some((s) => s.title.includes('知识边界')))
  assert.ok(view.gear.some((s) => s.title.includes('装备')))
  assert.ok(!view.primary.some((s) => s.title.includes('知识边界')))
})

test('人物 INDEX 表解析 + 分类桶', () => {
  const people = parsePeopleIndex(INDEX)
  assert.equal(people.length, 2)
  assert.equal(people[0].name, '老灶')
  assert.equal(people[0].relation, '保人 · 同组')
  assert.ok(personBuckets(people[0], ['老灶']).includes('nearby'))
  assert.ok(personBuckets(people[0]).includes('companion'))
  assert.ok(personBuckets(people[1]).includes('hostile'))
  // 解析结果不携带 char-* raw id 之外的开发者字段（id 保留用于内部档案关联，不进 UI）
  assert.equal(people[0].id, 'char-laozao')
})

test('cleanDisplay / stripDevRefs：链接留名、去路径引用', () => {
  assert.equal(cleanDisplay('备件已入货舱（→ ../mechanics/cargo-system/STATE.md）'), '备件已入货舱')
  assert.equal(cleanDisplay('[老灶](characters/char-laozao.md)——核对中'), '老灶——核对中')
  assert.equal(stripDevRefs('见 [档案](state/PLAYER.md) 与（→ x.md）'), '见 档案 与')
})

test('事务解析与分组排序：紧急 → 进行中 → 长期', () => {
  const threads = parseThreads(THREADS)
  assert.equal(threads.length, 3)
  assert.equal(threadGroup(threads[0]), 'urgent')
  assert.equal(threadGroup(threads[1]), 'long')
  assert.deepEqual(sortThreads(threads).map((t) => t.id), ['Q-01', 'Q-03', 'Q-02'])
})

test('机制拆分与显示名：不暴露 mechanic id', () => {
  const { inventory, quests, systems } = splitMechanics(projection().mechanics)
  assert.equal(inventory.length, 1)
  assert.equal(inventory[0].section.title, '货舱')
  assert.equal(quests.length, 1)
  assert.equal(systems[0].sections.length, 1) // 货舱→行囊、任务→事务流出后只剩 货币
  assert.equal(mechanicName(MECHANIC, 'cargo-system'), '货舱系统')
  assert.equal(mechanicStatus(MECHANIC), '已激活')
})

test('世界名：COMPOSITION 标题 ｜ 前半，缺省回退 id', () => {
  assert.equal(worldName(COMPOSITION, 'xingang'), '星港')
  assert.equal(worldName('', 'xingang'), 'xingang')
})

/** ── Part A 收边（§12.1）────────────────────────────────────────────────── */

test('A1：char-* 映射——括号形式去掉、裸 id 换显示名、未知 id 不泄漏', () => {
  const names = { 'char-tianshi': '田石', 'char-laozao': '老灶' }
  assert.equal(mapCharRefs('田石（char-tianshi）亲口说', names), '田石亲口说')
  assert.equal(mapCharRefs('问 char-laozao 便知', names), '问 老灶 便知')
  assert.equal(mapCharRefs('char-x99 的身份不明', names), '的身份不明')
  assert.ok(!mapCharRefs('char-x99 出现', names).includes('char-x99'))
})

test('A1：stripDevRefs 剔除 PLAYER.md / LEDGER / 裸 .md 引用', () => {
  assert.ok(!stripDevRefs('时间见 CURRENT.md，未决事项（→ THREADS.md）').includes('.md'))
  assert.ok(!stripDevRefs('已归档进 LEDGER（详见 story/LEDGER.md）').includes('LEDGER'))
  assert.ok(!stripDevRefs('装备已入系统空间（→ ../mechanics/traveler-system/STATE.md）').includes('STATE.md'))
})

test('A4：状态词玩家显示层本地化', () => {
  assert.equal(localizeStatus('active'), '当前')
  assert.equal(localizeStatus('open（紧急）'), '进行中（紧急）')
  assert.equal(localizeStatus('deadline'), '时限')
  // 非状态词不动
  assert.equal(localizeStatus('已激活'), '已激活')
})

test('A3：Hero 摘要只取加粗身份短语与短事实行，不塞整段社会身份', () => {
  const { sections } = sectionsOf(splitDoc(PLAYER).body)
  const identity = heroIdentity(sections)
  assert.deepEqual(identity, ['代理轮机长', '七号坞'])
  assert.equal(heroFacts(sections), '31 岁，女')
  // Hero 不承担完整社会身份长段
  assert.ok(identity.join('').length < 20)
})

test('人物名录兼容列表式 INDEX：姓名入册、分组进状态、线程引用剥离', () => {
  const LIST_INDEX = `# characters｜人物名录

## 敌对

- [杜横](char-duheng.md)——樊氏家奴头目，断臂之仇（T-1）

## 未建档

- 樊敬——涿郡豪族樊氏家主（出场再立）
`
  const people = parsePeopleIndex(LIST_INDEX)
  assert.equal(people.length, 1) // 未链接的口头提及不入册
  assert.equal(people[0].name, '杜横')
  assert.equal(people[0].id, 'char-duheng') // id 只用于内部档案关联
  assert.equal(people[0].status, '敌对')
  assert.ok(!people[0].relation.includes('T-1'))
  assert.ok(personBuckets(people[0]).includes('hostile'))
})

test('charDisplayName：H1 括号前段 / 题名冒号后段，拿不到返回 null', () => {
  assert.equal(charDisplayName('---\nentity: char-duheng\n---\n\n# 杜横（樊氏家奴头目）\n'), '杜横')
  assert.equal(charDisplayName('# 星港｜人物：老灶\n'), '老灶')
  assert.equal(charDisplayName('没有标题'), null)
})
