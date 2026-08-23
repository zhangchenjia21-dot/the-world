---
title: The World｜DSH-native RPG 工作架构
status: current-experimental-architecture
version: 0.3
updated: 2026-08-23
canonical_product_spec: PRODUCT_SPEC_CURRENT.md
reference_host: DeepSeek Harness
current_stage: TW-00.5 Bare DSH Capability Probe
---

# The World｜DSH-native RPG 工作架构 CURRENT

## 0. Architecture Thesis

当前工作架构：

```text
DeepSeek Harness
= Agent Host + Provider / Model + Plugin Runtime + Generic Tooling + Session / UI Foundation

The World World Core
= RPG Game Mode + Thin GM / World / Workspace Coordination

Persistent World Workspace
= Durable State + Story + Memory + Saves

RPG Experience / Mechanics Plugins
= UI + Map + Mechanics + Expansion Value

Recovery
> Preventive Restriction
```

The World 不重新实现通用 Agent Runtime；优先把 RPG 特有能力挂接到 DSH documented extension / plugin seams。

Bare DSH Capability Probe 已经表明：强模型 + DSH 本身拥有相当强的 GM、自然语言 adjudication、文件维护与剧情组织能力。因此 TW-01 的架构目标进一步收紧为：

> **只补 Bare DSH 已经真实暴露的长期 RPG 缺口，不重复实现模型已经会做的能力。**

---

## 1. Host Boundary

### DeepSeek Harness Owns

- Agent loop；
- Provider / Model adapter；
- tool registry / execution；
- Session 与事件流；
- 插件装载与生命周期；
- 通用 Web / headless host；
- DSH 自身 system prompt / agent capability assembly；
- 通用 UI / editor integration foundation。

### The World Owns

- World Core RPG Game Mode；
- RPG 世界语义与 GM coordination；
- reusable RPG assets；
- game-local world truth；
- durable entity persistence 语义；
- story / memory / save 语义；
- protagonist control preferences；
- RPG UI / Map / Mechanics Plugins；
- 与 DSH 的薄集成层。

原则：

> **DSH-native, not DSH-internal-coupled.**

长期 game data 不应依赖某个短期 DSH 内部事件结构才能解释。

---

## 2. Top-level Ownership

```text
library/
→ reusable source assets

plugins/
→ World Core + RPG Experience / Mechanics Plugins

games/<game-id>/state/
→ current game-local canonical reality

games/<game-id>/story/
→ important historical ledger / commitments / consequences

games/<game-id>/memory/
→ context compression / retrieval aids

games/<game-id>/saves/
→ explicit recovery points

tools/
→ narrow deterministic support utilities

docs/
→ product / architecture / experiment truth
```

`plugins/` 与 `tools/` 分离：

- `plugins/` 可以因为直接增加游戏价值而存在；
- `tools/` 若主要用于防错，默认由真实失败驱动。

---

## 3. World Core｜Evidence-driven Thin Core

World Core 是 TW-01 Shared Foundation，但不再假设需要一套大型 RPG Runtime。

### 3.1 当前已被真实证据拉动的候选职责

#### A. Game Entry / Recovery

- 进入 / 继续 The World 游戏模式；
- 找到当前 game；
- 读取恢复入口；
- 在全新 DSH Session 中恢复必要 game-local reality；
- 只装载当前相关上下文，不把全部历史塞进每轮 context。

#### B. Durable Change Coordination

每次游戏交互后，帮助 Agent 判断是否出现真正需要长期存在的变化，例如：

- 新 NPC / 新身份；
- 关系变化；
- 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情；
- 地点变化；
- 势力变化；
- unresolved consequence；
- 任务 / 机制长期状态。

Bare DSH Probe 已重复暴露：玩家自身状态与 session log 会被较积极维护，但动态 NPC durable state 容易漏写。

因此 World Core 当前最明确的真实候选价值之一是：

> **帮助 Agent 识别“刚刚创造出来的什么东西已经成为世界历史的一部分”。**

这不等于要求所有实体先提交 schema / JSON 再审批。

#### C. GM / World Semantics

稳定提供少量高价值语义：

```text
Persistent World
World Independence + Player Spotlight
Player owns Attempt
World owns Consequence
Model Freedom
Recovery First
```

#### D. Agency Authorization Context

World Core / game preference 应能让 Agent知道当前 protagonist control mode 与临时玩家授权范围。

Player Agency 在架构上视为 authorization boundary，不是“Agent 永远不能替主角执行任何动作”。

候选模式：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同基线：

> **Compress dead time; stop at meaningful choice.**

### 3.2 World Core 明确不默认做

- deterministic narrative approval gate；
- typed mutation pipeline；
- 每个世界事实程序批准；
- 玩家行为白名单；
- 模型剧情白名单；
- 每回合固定更新全部文件；
- 每个临时路人建立重型 entity record；
- 全世界逐实体 tick。

---

## 4. RPG Experience / Mechanics Plugins

包括但不限于：

- RPG UI / Presentation；
- Map / Visualization；
- Combat；
- Politics；
- Economy；
- Character Progression；
- System / Quest；
- Inventory；
- 世界专属扩展机制。

这些插件可以由**产品价值**直接驱动，不要求先证明模型失败。

### 4.1 Chat + Persistent UI

Bare DSH Probe 已经形成正式体验原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

Chat 适合机制触发、判定、角色演绎和即时后果；Persistent UI 适合长期查询：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

### 4.2 UI Truth Boundary

```text
Game Workspace / Canonical State
        ↓
Plugin projection / view model
        ↓
RPG UI
```

UI 不应成为第二 game truth。

插件临时 runtime / cache state 只有在构成长期世界事实时才写回对应 Owner。

### 4.3 Agent Trace Presentation

DSH 默认 `think/read/write/tool` 执行轨迹不适合作为 RPG 主阅读流。

正式方向：

> **隐藏工作噪音，不限制 Agent 工作能力。**

UI 默认折叠 / 隐藏 Agent 工作轨迹，但保留可选 debug / inspect surface。

---

## 5. Library / Source Assets

```text
library/
├─ worlds/
├─ characters/
├─ mechanics/
└─ lore/
```

Source：

- 开始一局前存在；
- 可跨 game 复用；
- 不被单局静默反向污染；
- Stage 0 不冻结万能 Schema。

### Source Fidelity

Bare DSH Probe 已开始出现正史 / 演义 / 原创素材边界问题。

当前不先设计复杂 provenance system，但未来 Source 需要能够至少表达其设定口径，例如：

- 正史；
- 演义；
- 混合；
- 原创架空。

是否需要 manifest，由真实资产消费继续决定。

---

## 6. Game Workspace

每局 game 自包含：

```text
games/<game-id>/
├─ README.md
├─ state/
├─ story/
├─ memory/
└─ saves/
```

### 6.1 `state/`

回答：**这局现在真实是什么。**

`state/CURRENT.md` 可作为恢复入口；达到真实规模压力后再拆分 characters / factions / locations / items / world 等域。

### 6.2 Durable Identity

一个运行中动态产生的实体若已经形成会影响未来判断的 durable fact，应进入 game-local state，即使：

- 它不是 Source 角色；
- 它不是历史名人；
- 玩家尚不知道姓名；
- 它后续剧情权重可能很低。

正式原则：

> **Importance controls attention, not existence.**

例如玩家只知道“老卒”时，玩家 UI 可以显示：

```text
老卒（姓名未知）
```

内部只需要保证未来能稳定认出这是同一个 game-local entity；第一阶段不要求为此建设复杂全局实体平台。

### 6.3 `story/`

回答：**发生过哪些未来值得追溯的事情。**

保存 important events、commitments、consequences、unresolved hooks。

不是 current state 第二副本，也不要求逐字聊天日志。

### 6.4 `memory/`

回答：**下一次高质量主持最值得恢复什么。**

Memory 是 lossy compression / retrieval aid；允许压缩和重写，不覆盖 current truth。

### 6.5 `saves/`

语义：

> **Save 是一个明确可恢复到的游戏现场。**

Bare DSH 当前 workspace 更接近 latest-state save，不等于玩家级 rollback system。

具体实现暂不冻结，可组合：

- snapshot；
- Git-like versioning；
- directory copy；
- DSH session/fork capability；
- The World plugin recovery metadata。

最终 Restore 需要避免“文件回到 T2，但 Agent 聊天记忆还在 T5”的时间线错位。

---

## 7. Persistent World Model

The World 不实现所有实体每回合 tick 的全量后台模拟器。

世界持续性由 GM 根据：

- 时间经过；
- 人物目标；
- 势力与冲突；
- 承诺与因果；
- 玩家行为留下的后果；
- 当前世界相关性；

选择性维护。

```text
Persistent != Fully Simulated
```

低重要度 NPC 可以：

- 更少进入上下文；
- 更粗粒度离屏推进；
- UI 中降低 prominence；

但不能因为资源优先级低而从 canonical reality 中消失。

---

## 8. Turn / Interaction Model

第一阶段不另造 Formal Turn Engine，继续使用 DSH turn / step / session 基础。

概念交互：

```text
World Core 提供 game mode + necessary context + control preference
+
Agent 按需读取 workspace / source
↓
GM 主持世界并响应玩家
↓
必要时自动压缩 low-value process
↓
遇到 meaningful choice 时按授权边界决定是否停下
↓
玩家行为 + 世界行为形成后果
↓
Agent 识别 durable changes
↓
更新正确 Owner
↓
必要时创建 recovery point
↓
继续游戏
```

### Meaningful Choice Boundary

“准备前往东线”不能默认等价于：

```text
采购完成
→ 自动出发
→ 自动处理遭遇
→ 自动接受投效
→ 自动抵达目标
```

但也不要求 GM 每走一步都询问。

架构目标是允许：

- 无意义时间快进；
- 例行行为托管；
- 角色性格驱动的小动作；

同时在重大承诺、路线、阵营、关系和风险选择上按当前授权范围返回控制权。

---

## 9. Model Freedom & Recovery

默认：

- 模型自由主持；
- 模型自由创造 NPC / 场景 / 事件；
- 模型可推进离屏世界；
- 模型自行维护工作区；
- 不要求自然语言内容先转 typed proposal；
- 不以 prevent-all-errors 作为架构目标。

```text
Freedom Before Prevention
Prefer Recovery over Prevention
```

优先：

- Undo；
- Regenerate；
- Agent / 人工修正；
- Restore；
- Save branch。

只有重复、昂贵、难察觉或破坏核心体验的问题才升级 guardrail。

---

## 10. Write Semantics

### Current State

只有会影响后续世界判断、互动、恢复或机制的 durable fact 进入 state。

### Dynamic Entity

首次出现不等于必须建档；但一旦形成关系、承诺、持续伤情、未来后果、同伴 / 敌对关系、关键信息或其它 durable identity，应写入长期世界。

### Story

未来值得追溯的事件、承诺、转折与后果进入 story。

### Memory

只保存高价值恢复线索，不追求逐字完整。

### Source

单局演化不得静默反向改写 reusable source。

### UI / Plugin Runtime State

UI / plugin cache 不自动成为 game truth。

---

## 11. Read / Context Strategy

默认恢复：

```text
current game README
→ state/CURRENT
→ recent / unresolved memory
→ directly relevant state / story
→ necessary source assets
→ older history on demand
```

原则：

```text
Repository Total Knowledge
!= Current Turn Context

Game History Growth
!= Agent Context Growth
```

World Core 每轮只提供必要入口与语义，不全仓灌入。

---

## 12. Consistency / Reliability Model

第一阶段不追求数据库事务级一致性。

Agent 可做轻量语义自检：

- state 是否明显矛盾；
- dynamic durable entity 是否完全不可恢复；
- memory 是否把旧状态当 current；
- story 是否错误伪装成 current；
- Source 是否被单局污染。

一次可见错误优先修正 / Regenerate / Restore。

真实重复失败再考虑 validator / atomic writer / structured state。

---

## 13. Tool Boundary

### Product-value Tool / Mechanic

如果确定性能力本身构成游戏机制，例如 dice、距离计算、战斗解析，可以进入对应 RPG Plugin，不需要先证明模型失败。

### Preventive / Reliability Tool

若能力主要用于防错，默认满足：

1. 失败真实发生；
2. 反复出现或代价明显；
3. 模型自检 / Restore 已不足；
4. 程序可以更窄、更可靠解决；
5. 不显著损害 GM 与玩家自由。

---

## 14. Evolution Triggers

### Trigger A — File Split

真实规模导致恢复 / 冲突 / 检索变差。

### Trigger B — Structured Game Data

某机制需要高频精确计算 / 查询，Markdown 成为主要摩擦。

### Trigger C — Guardrail

同类错误反复破坏体验，Recovery 成本不再低廉。

### Trigger D — Database / Service

出现真实复杂查询、原子性、并发或性能需求，且更窄方案无法解决。

### Trigger E — Experience Plugin

UI / Map / Mechanics 预计能明显提升游戏价值时，可直接进入产品路线。

### Trigger F — DSH Integration Adaptation

DSH breaking change 时迁移 integration layer，不让 game data 语义跟随内部结构漂移。

---

## 15. Architecture Non-goals

Stage 0 不追求：

- 独立 Agent Runtime；
- 自建 Provider / Model 层；
- 完整 ECS / universal world OS；
- 万能资产 Protocol / DSL；
- 预先枚举所有 entity type；
- 自动连续全世界模拟；
- 为理论错误设计完整审批 / typed mutation 平台；
- DSH core 深 fork。

---

## 16. Current Reality Route

```text
Product Definition Gate PASS
        ↓
TW-00.5 Bare DSH Capability Probe   ← CURRENT
        ↓
Baseline Evidence
        ↓
Extract Real Gaps
        ↓
TW-01 Minimal World Core
        ↓
Reality Gate A
        ↓
RPG Experience / Mechanics Plugin
        ↓
Reality Gate B
```

TW-00.5 当前仍需要完成：

- 多场景长期连续性；
- Source 角色卡；
- Source Fidelity；
- 历史 / 题材事件与 history divergence；
- off-screen evolution；
- delayed consequences；
- 完全全新 DSH Session 恢复。

当前 Architecture 不应把 Bare DSH 偶然生成的 `save/` 文件布局直接复制成 TW-01 产品结构；只吸收被真实证据证明有价值的语义与缺口。
