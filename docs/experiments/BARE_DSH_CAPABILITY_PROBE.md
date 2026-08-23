---
title: The World｜Bare DSH RPG Capability Probe
status: current-experiment-evidence
version: 0.3
updated: 2026-08-23
experiment_branch: TEST
reference_host: DeepSeek Harness
---

# Bare DSH RPG Capability Probe｜运行证据

本文件记录在**不开发 World Core / RPG 插件**的前提下，直接向 DeepSeek Harness 提供 RPG 资产后进行真实游玩的观察证据。

目的不是把 Bare DSH 的偶然行为冻结为 The World 架构，而是识别：

- DSH + 强模型已经天然擅长什么；
- 哪些错误只需要低成本恢复；
- 哪些问题会重复破坏长期体验；
- TW-01 World Core / RPG UI / Save / Mechanics 真正应该补什么。

核心实验原则：

> **先观察 Agent 自己能做到什么，再开发最少的缺口。**

> **不为了一个理论风险立即增加限制。**

---

## 1. Experiment Setup

实验形态：

```text
DeepSeek Harness
+
优秀模型
+
三国题材世界 / 人物 / 机制资产
+
极轻自然语言 RPG 主持要求
```

明确没有加入：

- World Core Plugin；
- The World state/story/memory/saves 规范；
- 强制目录模板；
- 每回合 checklist；
- typed mutation；
- validator；
- The World RPG UI；
- 自定义长期恢复算法。

实验分支：`TEST`。

Git checkpoint 用于保存客观演化历史，不等于游戏已经拥有 player-facing Save / Restore。

---

## 2. Evidence Status

### 已通过 GitHub Connector 核验到的 TEST 头

当前连接器最后稳定核验到的 TEST checkpoint：

`cfa88b8d21152647bc6733303bdc588a5a926e14`

在此 checkpoint 之后，玩家已经继续 push 多轮更新，但当前 ChatGPT GitHub connector 一度仍停留在旧 TEST head。因此后文分为：

- **Verified**：已经通过仓库文件 / diff 直接核验；
- **Player-reported, pending connector sync**：来自真实玩家试玩并已声明 push，但本次文档更新时连接器尚未显示最新 TEST 文件。

这一区分只影响证据来源标记，不否定玩家实际体验反馈的产品价值。

---

## 3. Positive Evidence｜已观察正向能力

### P01｜GM 文笔与生成自由度

**Evidence type：Player-reported + repeated subjective experience**

Bare DSH 首次实际生成的文笔、自由感与 GM 发挥空间明显优于此前高度受限的 SillyTavern v2 游戏 AI 体验。

当前意义：

> 过度约束确实可能损伤模型原生 GM 能力。

这支持但不单独证明：

```text
Freedom Before Prevention
```

### P02｜自发建立长期工作区

**Evidence type：Verified**

没有 World Core / The World workspace 规范时，DSH 自行建立：

- `save/README.md`；
- `world_state.md`；
- `player_character.md`；
- `npc_relations.md`；
- `factions.md`；
- `locations.md`；
- `session_log.md`。

这说明裸 DSH 已具有相当明显的长期状态分工意识。

### P03｜理解 Persistent World / History-as-starting-condition

**Evidence type：Verified**

DSH 自行写入过类似原则：

- 历史只约束玩家进入前的事实；
- 玩家进入后未来不再必然；
- 历史 NPC 按自身目标行动；
- 世界会继续演化；
- 不存在自动历史纠偏力。

说明不少原本准备由 World Core 大量解释的语义，模型已经能够自然理解。

### P04｜GM Authority：玩家判断不自动成为世界事实

**Evidence type：Player-reported gameplay evidence**

玩家曾输入：

> “这种散兵游勇应当惧怕官府……”

DSH 没有把该断言直接当作世界事实，而是将其理解为玩家策略，并根据：

- 表达能力；
- 市井交涉；
- 对手身份；
- 话术合理性；

独立裁定“部分有效但并未完全相信”。

正向语义：

```text
Player owns Attempt
World / GM owns Consequence
```

### P05｜自然语言机制资产可以直接参与 adjudication

**Evidence type：Player-reported + state evidence**

人物能力拓展包已经被 Agent 用于：

- 交涉判断；
- 能力实践验证；
- 战斗 / 技能成长；
- 系统兑换后的能力状态。

这说明部分 soft mechanics 可能只需要高质量自然语言资产，不需要立即程序化。

当前不据此否定 dice / combat / map / calculation 等 deterministic mechanics。

### P06｜玩家自身 durable state 维护较稳定

**Evidence type：Verified**

在已核验 checkpoint 中，DSH 能持续把玩家的：

- 新技能；
- 战斗风格萌芽；
- 信条萌芽；
- 健康变化；
- 疲劳 / 饥饿；
- 当前位置；
- 系统兑换结果；

写回 `player_character.md`。

因此目前主要问题不是“Agent 完全不会持久化”，而是：

> **不同类型 durable facts 的 persistence reliability 明显不均衡。**

### P07｜一次完整场景 / 事件闭环已经可玩

**Evidence type：Player-reported + partially verified**

第一段雪夜破庙事件已经形成完整闭环，覆盖：

- 开局角色进入；
- 观察；
- 社交博弈；
- 战斗；
- 动态 NPC；
- 救人 / 俘虏；
- 系统机制；
- 伤势；
- 场景转移；
- 后续审案 / 新局面。

这意味着 Bare DSH Probe 已经从“看几段文笔”进入真正的微型纵向试玩。

### P08｜Player Desire 可以被转译成世界内合理机会

**Evidence type：Player-reported, pending latest TEST sync**

玩家表达“需要一位谋士”后，DSH 没有直接投放当前阶段不合理的历史名臣，而是设计了：

- 当前身份可接触；
- 能力与现阶段相称；
- 与前文酒肆情节形成呼应；
- 可自然进入关系发展的原创人物。

当前优先视为优秀的 Player Spotlight / dramatic organization，而不是错误。

### P09｜能自然引入低层级三国题材人物

**Evidence type：Player-reported, pending latest TEST sync**

玩家报告：系统主动以合剧情方式把“裴元绍”引入玩家附近。

需要注意 Source Fidelity：**裴元绍属于《三国演义》虚构人物，并非正史可考人物。**

因此这条正向证据更准确地说明：

> DSH 能把三国题材 Source 中的低层级人物自然组织进当前剧情，而不是只盯著名历史角色。

同时也引出 Watch 02：世界究竟采用正史、演义、混合还是原创口径，需要未来 Source 明确。

---

## 4. Confirmed Gaps｜已确认真实缺口

### Gap 01｜Agent Execution Trace Noise

**Evidence type：Player-reported, repeated**

DSH 默认主界面大量展示：

- `think`；
- `read`；
- `write`；
- tool execution。

这些对 Agent 调试有价值，但明显破坏 RPG 沉浸。

产品方向：

> **隐藏工作噪音，不限制 Agent 工作能力。**

Owner：RPG UI / Presentation Plugin。

### Gap 02｜Current Workspace != Player-facing Save / Rollback

**Evidence type：Verified**

Bare DSH 当前 `save/` 主要是持续更新 latest state，没有明确：

- snapshot；
- named save；
- rollback；
- branch；
- restore manifest。

Git checkpoint 可以恢复实验状态，但属于开发历史，不是游戏功能。

未来候选：

- Auto Save；
- explicit Save Point；
- Undo / Regenerate；
- Restore；
- 从旧节点 Branch。

同时要处理 Session 与文件时间线一致性。

### Gap 03｜长期机制状态只能从 Chat 回看

**Evidence type：Player-reported, repeated**

System、Quest、Character、Map、Faction、Inventory 等机制已经能在聊天中自然发生，但长期查看依赖翻聊天记录会快速恶化。

正式产品原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

UI 是 game truth 投影，不成为第二事实源。

### Gap 04｜Dynamic NPC Durable Persistence Failure

**Evidence type：Verified + repeated**

第一次：

- “老卒”已形成潜在同伴；
- 关系友善 → 信任倾向；
- 有军旅经验、搏斗能力、官场知识、左腿旧伤；

但 `npc_relations.md` 仍为：

```text
## 已结识 NPC

（暂无）
```

随后更完整事件中：

- 周砚欠救命之恩；
- 老卒愿意跟随；
- 陈三重伤被俘；
- 刀疤逃走；
- 胖子逃走；

但 `npc_relations.md` 仍未更新。

因此失败模式已经明确：

> **Bare DSH 会积极维护玩家状态与 session log，但对运行中动态生成 / 遭遇的 NPC durable state 存在系统性漏记倾向。**

这已是 TW-01 World Core 的真实候选 Required Behavior。

正式语义：

> **重要性决定注意力与模拟资源，不决定实体是否存在。**

未命名不等于无身份；玩家 UI 可以显示：

```text
老卒（姓名未知）
```

### Gap 05｜Agency Granularity / Action Batching

**Evidence type：Player-reported, pending latest TEST sync**

玩家输入近似：

> “粗铁兵器十件 + 军粮三十日份，准备前往东线。”

一次输出却直接跨过：

```text
兑换确认
→ 出发
→ 荒野遭遇
→ 自动收服
→ 曹营
```

最初这看起来像 Player Agency Failure，但进一步产品判断后得到更准确结论：

> **自动推进本身可能是好功能；真正缺少的是玩家可控制的 Agency Granularity。**

当前产品方向：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同原则：

> **Compress dead time; stop at meaningful choice.**

Player Agency 是授权边界，不是禁止所有主角代操。

---

## 5. Watch Items｜尚未升级为缺口

### Watch 01｜Player Desire Accommodation Bias

玩家表达“需要谋士”后，GM 创造了一个恰当、可接触、与前文呼应的原创人物。

单次结果是正向的。

潜在风险：长期退化为：

```text
玩家需要什么
→ 世界及时生成什么
```

从而削弱：

- 稀缺性；
- 渠道价值；
- 社会网络；
- 身份门槛；
- 错过与竞争；
- World Independence。

当前不加 guardrail。

只有“按需供货”反复出现并明显伤害体验，才考虑极薄 guidance。

### Watch 02｜Source Fidelity：正史 / 演义 / 原创

裴元绍案例说明世界资产如果混合正史、演义和原创，而没有显式口径，Agent 可能自然消费这些角色但玩家对“历史真实性”的预期会不同。

当前不建设复杂 provenance system。

未来至少需要考虑 Source / World Pack 是否声明：

- 正史；
- 演义；
- 混合；
- 原创架空。

### Watch 03｜Current State / History Duplication

已观察到 `player_character.md` 开始写“已发生事件”，而 `session_log.md` 同时保存同类历史。

当前内容很短，暂不算问题。

继续观察是否出现：

- 大量重复；
- state 文件膨胀；
- old history 混入 current state；
- fresh-session 恢复时 owner 混淆。

### Watch 04｜Non-NPC Selective Persistence

Dynamic NPC 已经证明存在 selective persistence bias。

后续继续观察同样问题是否发生在：

- 地点；
- 势力；
- 任务；
- 承诺；
- 物品；
- 经济资源；
- 离屏事件。

---

## 6. Product Conclusions So Far

目前最重要的阶段性结论不是“World Core 不需要”，而是：

> **World Core 很可能应该比最初设想薄得多。**

Bare DSH 已经表现出很强的：

```text
GM prose
+ world reasoning
+ natural adjudication
+ character creation
+ scene construction
+ basic file persistence
```

The World 当前真实增量开始收敛为：

```text
1. Durable World Continuity
2. Dynamic Entity Persistence
3. Cross-session Recovery
4. Save / Rollback
5. RPG UI / Persistent Surfaces
6. Agent Trace Presentation
7. Configurable Protagonist Control
8. RPG-specific Map / Mechanics / Expansion Value
```

产品重心正在从：

> “教 Agent 怎么当 GM”

转向：

> **“给一个本来就很会当 GM 的 Agent，提供长期世界基础、恢复能力和真正像游戏的交互 / 呈现层。”**

---

## 7. Remaining Probe Plan

继续试玩，不改变 Bare DSH Prompt，不提醒它我们发现了哪些 persistence 问题。

下一阶段优先自然覆盖：

### Phase B｜Multi-scene Continuity

- 第一场事件过去后，旧 NPC / 承诺 / 敌人是否继续存在；
- dynamic entity omission 是否真正造成世界断裂。

### Phase C｜Source Character Consumption

- 真正遇到人物卡角色；
- Agent 是否利用角色卡但允许 game-local evolution；
- 是否出现 Source 重置当前现实。

### Phase D｜Source Fidelity + Historical / Thematic Events

- 三国题材人物 / 历史人物如何进入；
- 正史 / 演义 / 原创边界；
- 大事件是否成为剧本强制轨道。

### Phase E｜History Divergence

- 玩家改变历史后，game-local reality 是否优先；
- 是否出现“为了贴回历史”而修正已发生事实。

### Phase F｜Fresh Session Recovery

结束旧 DSH Session，启动完全全新 Session，仅给出类似：

> “继续这个目录里的游戏。”

观察是否自动：

- 定位 save / workspace；
- 恢复人物与关系；
- 恢复 unresolved consequences；
- 恢复地点和世界局势；
- 继续相同 GM continuity。

这是 Bare DSH Probe 最关键的最终压力之一。

---

## 8. Experiment Discipline

继续遵循：

```text
A. 模型自己处理好了
→ The World 不开发这个

B. 偶尔失败，但 Undo / Regenerate / 提醒即可
→ 可能不值得开发

C. 持续反复失败，明显破坏体验
→ World Core / Plugin / Tool 候选
```

不要：

- 因单次坏体验立即加规则；
- 因单次漂亮表现立即冻结架构；
- 在 checkpoint 前要求 DSH “整理文件”；
- 提醒 Bare DSH 更新 NPC / faction / state；
- 把实验 branch 的偶然文件布局直接复制进 `main` architecture。

用户主观体验继续作为一等产品证据，例如：

- 想不想继续玩；
- 文笔是否自然；
- 是否觉得出戏；
- 是否感到被代操；
- 是否觉得世界太迎合；
- 哪次遗忘真正让人烦；
- 哪个设计让人惊艳。
