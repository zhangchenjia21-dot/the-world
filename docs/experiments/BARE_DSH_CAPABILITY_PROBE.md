---
title: The World｜Bare DSH RPG Capability Probe
status: current-experiment-evidence
updated: 2026-08-23
experiment_branch: TEST
reference_host: DeepSeek Harness
---

# Bare DSH RPG Capability Probe｜运行证据

本文件记录在**不开发 World Core / RPG 插件**的前提下，直接向 DeepSeek Harness 提供 RPG 资产后进行真实游玩的观察证据。

目的不是把 Bare DSH 的偶然行为直接冻结为 The World 架构，而是识别：

- DSH + 强模型已经天然擅长什么；
- 哪些失败只是低成本模型错误；
- 哪些是重复、真实、影响产品体验的缺口；
- The World 后续 World Core / RPG UI / Save / Mechanics 应真正补什么。

原则：

> **先观察 Agent 自己能做到什么，再开发最少的缺口。**

---

## 已观察正向能力

### 1. GM 文笔与生成自由度

玩家主观反馈：Bare DSH 首次实际生成的文笔和自由感明显优于此前高度受限的 SillyTavern v2 游戏 AI 体验。

当前只作为正向体验证据，不由单次样本推导稳定结论。

### 2. 自发建立长期工作区

DSH 在没有 World Core、没有 The World `state/story/memory/saves` 规范的情况下，自行建立：

- `world_state.md`；
- `player_character.md`；
- `npc_relations.md`；
- `factions.md`；
- `locations.md`；
- `session_log.md`；
- `save/README.md`。

这说明裸 DSH 已具有一定的长期状态分工意识；后续需验证这些结构在长局和跨 Session 下是否稳定有效。

### 3. GM Authority：玩家判断不自动成为世界事实

玩家输入曾包含“这种散兵游勇应当惧怕官府”等主观判断。DSH 没有把该判断直接视为世界真相，而是把它作为玩家策略的一部分，根据人物能力、话术合理性和 NPC 处境独立裁定交涉结果。

当前正向语义：

```text
Player owns Attempt
World / GM owns Consequence
```

### 4. 自然语言机制资产可直接参与 adjudication

人物能力拓展包已经能够被 Agent 用于交涉、能力实践验证和分层后果判断，而不依赖程序化检定引擎。

当前只说明部分软性 RPG 机制可能适合自然语言 adjudication；不据此否定未来 deterministic mechanics。

### 5. 玩家自身 durable state 维护较稳定

在最新 TEST checkpoint `cfa88b8d21152647bc6733303bdc588a5a926e14` 中，DSH 能持续把玩家的：

- 新技能；
- 战斗风格萌芽；
- 信条萌芽；
- 健康变化；
- 疲劳 / 饥饿；
- 当前地点；
- 系统兑换结果；

写回 `player_character.md`。

这说明当前主要问题不是“Agent 完全不会持久化”，而是不同类型 durable facts 的维护稳定性存在明显差异。

---

## 已观察产品缺口

### Gap 01｜Agent 执行轨迹噪音

DSH 默认界面在 RPG 主路径中展示大量 `think/read/write/tool` 执行轨迹。

这些信息对通用 Agent 有价值，但会破坏 RPG 沉浸。

产品方向：

> **隐藏工作噪音，不限制 Agent 工作能力。**

未来 RPG UI 应把执行轨迹默认折叠 / 降级，同时保留可选调试入口。

### Gap 02｜当前存档 ≠ 玩家级回档系统

Bare DSH 当前 `save/` 是持续更新的 latest-state workspace，没有明确的 player-facing checkpoint / snapshot / rollback / branch 语义。

实验用 Git commit 可以恢复 T0/T1，但这属于开发历史，不等于游戏已经拥有 Save / Restore。

未来候选方向：

- Auto Save；
- explicit Save Point；
- Undo / Regenerate；
- Restore；
- 从历史节点 Branch。

具体实现不在本实验阶段冻结。

### Gap 03｜长期机制状态只能从聊天回看

系统、任务、人物、地图、势力、物品等机制可以自然地在 Chat 中触发和解释，但长期查询依赖翻聊天记录会快速恶化。

正式体验原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

UI 应是 game truth 的可视化 / 交互投影，不成为第二事实源。

### Gap 04｜动态遭遇 NPC 没有可靠进入长期记录

该缺口已经从“单次观察”升级为**重复出现的真实持久化失败**。

#### 第一轮证据

玩家在雪夜破庙场景中与“老卒”发生实际交集，聊天中进一步出现：

- `【获得潜在同伴：老卒（未命名）】`；
- 关系从友善向信任倾向发展；
- 已建立军旅经验、近身搏斗、陈留官场知识、左腿旧伤等持续性事实。

但当时：

- `npc_relations.md` 仍显示“已结识 NPC：（暂无）”；
- “潜在同伴”及其关系、能力、伤情没有进入长期 NPC 状态。

#### 最新重复证据

TEST checkpoint `cfa88b8d21152647bc6733303bdc588a5a926e14` 相对上一 checkpoint 只修改了：

- `save/player_character.md`；
- `save/session_log.md`。

此时 durable NPC facts 已明显增加：

- **周砚**：已被玩家救下，形成“救命之恩”；
- **老卒**：已负伤，并明确“愿意跟随琛迦”；
- **陈三**：已被重伤、俘虏并关押县寺，后续审案仍相关；
- **刀疤**：逃走，去向不明，具备潜在后续 consequence；
- **胖子**：逃走，去向不明。

然而 `save/npc_relations.md` 仍完全未更新，继续显示：

```text
## 已结识 NPC

（暂无）
```

因此已经可以排除“只是老卒尚不重要”的解释。

当前更精确的失败模式是：

> **Bare DSH 会稳定维护玩家自身状态和主线 session log，但对运行中动态生成 / 遭遇的 NPC durable state 存在系统性漏记倾向。**

这属于 World Core 候选真实需求，而不是单纯 UI polish。

#### 当前产品语义

> **重要性决定注意力与模拟资源，不决定实体是否存在。**

一个 game-local NPC 一旦与玩家形成有意义的交互，尤其产生以下任一内容：

- 关系变化；
- 承诺 / 债务 / 冲突；
- 同伴 / 敌对 / 雇佣等持续关系；
- 持续伤情或能力认知；
- 玩家拥有的关键信息；
- 未来 hook / consequence；

就应获得可恢复的稳定 game-local 身份并进入 durable state。

“玩家尚不知道姓名”不是不记录的理由。内部可以先使用稳定的临时身份；玩家 UI 可以显示为：

```text
老卒（姓名未知）
```

直到姓名在世界中被玩家得知。

#### Persistent != Fully Simulated

该原则不要求所有 NPC 以相同成本持续模拟。

NPC 的重要性可以影响：

- 后续主动剧情频率；
- 离屏推进粒度；
- context retrieval priority；
- UI prominence；
- 何时进入低活跃 / archival 状态。

但已经形成 durable identity 的 NPC 不应因为叙事权重下降而从 canonical world reality 中消失。

#### UI implication

未来 Character / Relationship UI 不应只展示：

- 初始角色卡；
- 历史名人；
- 预先制作的 Source NPC。

还必须能够展示游戏过程中动态产生 / 遭遇的 game-local NPC，包括：

- 未知姓名人物；
- 普通人；
- 临时同伴；
- 敌人；
- 商人；
- 士卒；
- 地方官吏；
- 玩家实际产生关系的其它原创 NPC。

UI 展示必须遵守玩家知识边界：不能因为后台存在 NPC 的隐藏信息，就把玩家尚未知晓的事实直接暴露出来。

---

## 当前实验纪律

- 不因为该失败已经重复出现就直接建设 Schema / Validator；
- 现在已有足够证据把“动态 durable entity 识别与写回”列入 TW-01 World Core 候选 Required Behavior；
- 首选仍是极薄的语义提醒 / 协调机制，而不是 typed mutation 或审批流水线；
- 后续继续观察除 NPC 外，地点、势力、承诺、任务等运行中动态实体是否也出现相同的 selective persistence bias；
- 任何修复必须继续保护 Bare DSH 当前表现良好的文笔、主动性、GM Authority 与自然机制 adjudication。
