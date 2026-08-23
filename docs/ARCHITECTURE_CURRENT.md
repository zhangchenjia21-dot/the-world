---
title: The World｜DSH-native RPG 工作架构
status: current-experimental-architecture
version: 0.2
updated: 2026-08-23
canonical_product_spec: PRODUCT_SPEC_CURRENT.md
reference_host: DeepSeek Harness
---

# The World｜DSH-native RPG 工作架构 CURRENT

## 0. Architecture Thesis

Stage 0 当前工作架构：

```text
DeepSeek Harness
= Agent Host + Provider / Model + Plugin Runtime + Generic Tooling + Session / UI Foundation

The World World Core
= RPG Game Mode + Required Context + GM Guidance + Workspace Coordination

Filesystem Workspace
= Durable World / Story / Memory / Save Substrate

RPG Experience Plugins
= UI / Map / Mechanics / Expansion Value

Recovery
> Preventive Restriction
```

The World 不重新实现通用 Agent Runtime；优先把 RPG 特有能力挂接到 DSH 已公开的插件与 capability seams 上。

目标不是证明“文件系统永远足够”或“模型永远不会错”，而是用最直接的 Agent-native 方案先证明真实游戏价值，再由实际体验决定哪些能力值得程序化。

DeepSeek Harness 当前官方架构把 model adapter、tool registry、session log、agent loop、UI/editor integration 等都作为插件或扩展点；The World 默认利用这些 seam，而不是 patch / fork DSH core。

参考：

- https://github.com/deepseek-ai/deepseek-harness
- https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md

---

## 1. Host Boundary

### DeepSeek Harness Owns

- Agent loop；
- Provider / Model adapter；
- 通用 tool registry / execution；
- Session 与其事件流；
- 插件装载与生命周期；
- 通用 Web / headless host 基础；
- DSH 自身的系统 Prompt / Agent capability assembly。

### The World Owns

- World Core 游戏模式；
- RPG 世界语义与 GM 原则；
- reusable RPG assets；
- game-local world truth；
- story / memory / save 语义；
- RPG UI / Map / Mechanics 等插件；
- 与 DSH 的薄集成层。

架构原则：

> **DSH-native, not DSH-internal-coupled.**

DSH 当前处于 Developer Preview，兼容性可能变化。The World 可以适配 DSH 插件 API，但长期世界资产和 game-local truth 应尽量保持稳定、可迁移，不让几十小时游戏历史依赖某个短期内部事件结构才能解释。

---

## 2. Top-level Ownership

```text
library/
→ reusable source assets

plugins/
→ The World RPG plugins for DeepSeek Harness

games/<game-id>/state/
→ current game-local canonical reality

games/<game-id>/story/
→ important historical narrative ledger

games/<game-id>/memory/
→ context compression / retrieval aids

games/<game-id>/saves/
→ explicit recovery points

tools/
→ narrow deterministic support utilities

docs/
→ project product / architecture truth
```

`plugins/` 与 `tools/` 明确分离：

- `plugins/` 可以因为**直接增加游戏价值**而存在；
- `tools/` 中主要用于纠错、校验或基础可靠性的能力，默认由真实失败驱动。

---

## 3. RPG Plugin Layers

### 3.1 World Core Plugin

World Core 是 The World 第一条真实纵向的 Shared Foundation。

职责：

- 让 DSH Agent 明确进入 / 继续 The World 游戏模式；
- 每个实际游戏回合提供必要且有界的游戏上下文；
- 提供 GM 核心原则、Player Agency、Persistent World、Player Spotlight、文件 Owner 与恢复路径；
- 帮助 Agent 判断应读取哪些 state / story / memory / source；
- 帮助 Agent 在回合后维护必要 durable changes；
- 保持游戏基础设施尽量不打断玩家叙事体验。

World Core 的“强制”语义是：

> 游戏模式下稳定存在的协调上下文和职责约定。

它**不默认意味着**：

- deterministic approval gate；
- typed mutation pipeline；
- 每个世界事实必须先通过程序批准；
- 限制模型可创造哪些剧情；
- 限制玩家可尝试哪些游戏行为。

World Core 首先帮助模型成为更稳定的长期 GM，而不是把模型变成受控状态机。

### 3.2 Experience / Mechanics Plugins

包括但不限于：

- RPG UI；
- Map / Visualization；
- 战斗；
- 政治；
- 经济；
- 角色成长；
- 特定世界扩展机制。

这些能力可以因为：

- 更强沉浸感；
- 更清晰游戏信息；
- 新交互方式；
- 新机制深度；
- 传统 RPG 体验；

直接进入产品路线，不需要先证明“模型犯错”。

它们仍应优先利用 DSH 的 documented extension points，而不是另造 Host。

### 3.3 Guardrail / Reliability Utilities

例如：

- consistency validator；
- duplicate identity detector；
- atomic writer；
- schema checker；
- migration helper。

若其主要目的只是“防模型出错”，则默认遵循 Failure-driven Tooling：

```text
真实重复失败
→ 最窄修复
→ 再试玩
```

---

## 4. Library

```text
library/
├─ worlds/
├─ characters/
├─ mechanics/
└─ lore/
```

Source 语义保持：

- 开始一局前存在；
- 可跨 game 复用；
- 不被某一局反向污染；
- Stage 0 不冻结万能资产 Schema。

允许 Markdown、JSON / YAML、图片、地图、表格或其它合法资料，只要求 Agent / 插件能够理解其用途，并保持 Source 与单局演化边界。

如果真实资产消费证明需要最小 manifest，再从实际消费需求反推。

---

## 5. Game Workspace

每局 game 自包含：

```text
games/<game-id>/
├─ README.md
├─ state/
├─ story/
├─ memory/
└─ saves/
```

### 5.1 `state/`

回答：**这局现在真实是什么。**

`state/CURRENT.md` 是第一版恢复入口。

只有达到真实规模、冲突或检索压力后再按 characters / scenes / factions / items / world 等领域拆分。

### 5.2 `story/`

回答：**发生过哪些未来值得追溯的事情。**

可保存 timeline、important events、unresolved hooks、commitments、consequences。

不是逐字聊天日志，也不是 current state 第二副本。

### 5.3 `memory/`

回答：**下一次高质量主持最值得恢复什么。**

Memory 是 lossy compression / retrieval aid；允许压缩和重写，不覆盖 `state/` current truth。

### 5.4 `saves/`

语义：

> save 是一个明确可恢复到的游戏现场。

具体实现暂不冻结，可由 snapshot、Git、目录复制或 DSH / The World 插件能力实现。

在 Model Freedom 路线下，Undo / Regenerate / Restore 的产品价值高于构建“绝不允许模型写错”的重型约束。

---

## 6. Persistent World Model

The World 不实现“所有实体每回合都 tick”的全量后台模拟器。

世界持续性由 GM 根据以下因素维护：

- 时间经过；
- 已建立的人物目标；
- 势力与冲突；
- 既有承诺与因果；
- 玩家行为留下的后果；
- 当前最相关的世界变化。

正式原则：

```text
Persistent != Fully Simulated
```

玩家视野外的世界可以演化，但无需计算无关细节。

同时：

> **World Independence + Player Spotlight**

世界不围绕玩家才存在，但 GM 应主动把有意义、有戏剧性的冲突和机会尽量组织到玩家可感知、可参与的舞台上。

---

## 7. Turn / Interaction Model

The World 第一阶段不另造 Formal Turn Engine，继续使用 DSH 自身 turn / step / session 基础。

概念上的一个游戏交互：

```text
World Core 提供游戏模式 + 必要上下文
+
Agent 按需读取 game workspace / source
↓
GM 主持世界并响应玩家
↓
玩家行为与世界行为形成后果
↓
Agent 识别 durable changes
↓
更新正确 Owner
↓
必要时压缩 memory / 创建 recovery point
↓
继续游戏
```

实现上 World Core 最终使用哪一个 DSH prompt / agent / session extension seam，在 TW-01 根据当前 DSH 正式接口选择；这属于 non-blocking implementation decision。

---

## 8. Player Attempt & Consequence Semantics

玩家可以尝试任何游戏内行为。

程序层默认不因为行为“不理性”“太疯狂”“不是推荐路线”而拒绝。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

玩家失败、受伤、被捕、失去机会、关系恶化、重大损失甚至死亡都可以存在，只要它们来自世界因果而不是预设剧本强迫。

GM 应尽量让成功和失败都产生新的处境、选择、关系或长期后果，而不是把失败机械压缩成“Game Over”。

---

## 9. Model Freedom & Recovery

默认：

- 模型可以自由主持；
- 模型可以创造 NPC / 场景 / 事件；
- 模型可以根据世界因果推进离屏变化；
- 模型自行维护工作区；
- 不要求每项自然语言内容先结构化 proposal 再由程序 commit；
- 不以通用生命周期方法中的 typed commit 模式作为本项目默认前提。

本项目当前显式选择：

> **Freedom Before Prevention**

> **Prefer recovery over prevention**

如果模型偶尔犯错且可低成本发现，优先使用：

- Undo；
- Regenerate；
- 手工 / Agent 修正；
- Restore；
- 从 Save 分支。

只有错误成为反复、昂贵、难察觉或破坏核心体验的系统性问题，才升级 guardrail。

---

## 10. Write Semantics

### Current State

只有会影响后续世界判断、互动、恢复或规则的 durable fact 进入 state。

### Story

只有未来值得追溯的事件、承诺、转折和后果进入 story。

### Memory

只保存高价值压缩与恢复线索，不追求逐字完整。

### Source

单局演化不得反向改写 reusable source。

### Plugin Runtime State

插件自身临时 UI / operational state 不自动成为 game truth；若某个插件产生长期游戏事实，应写回对应 game Owner，而不是把插件 cache 变成第二事实源。

---

## 11. Read / Context Strategy

默认恢复路径：

```text
当前 game README
→ state/CURRENT.md
→ recent / unresolved memory
→ 本回合直接相关 state / story
→ 必要 source asset
→ 更旧历史按需追溯
```

World Core 每轮必读的是**必要规则与必要当前上下文入口**，不是每轮重载全部仓库。

原则：

```text
Repository Total Knowledge
!= Current Turn Context

Game History Growth
!= Agent Context Growth
```

---

## 12. Consistency Model

第一阶段不追求数据库事务级一致性。

Agent 在重要写入后应做轻量语义自检，例如：

- state 是否明显自相矛盾；
- memory 是否把旧状态当 current；
- story 是否错误伪装成当前状态；
- 新实体是否完全不可恢复；
- library 是否被单局演化污染。

一次可见错误优先修正 / 重答 / Restore。

只有这些问题反复、难以靠模型或低成本恢复解决，才引入 validator / atomic writer / structured state。

---

## 13. Tool Boundary

`tools/` 不是 The World 插件层的替代物。

### Product-value Tool / Mechanic

如果确定性能力本身构成游戏机制，例如 dice、距离计算、战斗解析，它可以作为某个 RPG 插件的底层能力进入，不需要先证明模型失败。

### Preventive / Reliability Tool

如果能力主要用于防止模型或文件出错，例如 validator、duplicate detector、atomic write，则默认满足：

1. 失败真实发生；
2. 反复出现或代价明显；
3. 程序能比模型自检 / Restore 更窄、更可靠地解决；
4. 不显著损害 GM 自由、玩家自由和游戏流畅度。

---

## 14. Evolution Triggers

### Trigger A — File Split

真实文件规模导致恢复、冲突或检索明显变差。

### Trigger B — Structured Game Data

某类机制需要高频精确计算 / 查询，Markdown 成为主要摩擦源。

### Trigger C — Guardrail

同类模型 / 状态错误反复破坏体验，Undo / 修正成本已经不再低廉。

### Trigger D — Database / Service

真实出现复杂查询、原子性、并发、规模或性能问题，且更窄方案无法解决。

### Trigger E — Experience Plugin

World Core 最小纵向成立后，UI / Map / Mechanics 等如果预计能明显增强游戏化与沉浸感，可以直接进入 Reality Gate B；它们由**产品价值**而不是错误证据驱动。

### Trigger F — DSH Integration Adaptation

DSH Developer Preview 发生 breaking change 时，优先迁移 The World integration layer，不让 game-local data 语义跟随上游内部结构漂移。

---

## 15. Architecture Non-goals

Stage 0 明确不追求：

- 独立 Agent Runtime；
- 自建通用 Provider / Model 层；
- 完整 ECS / universal world OS；
- 万能资产 Protocol / DSL；
- 预先枚举所有 entity type；
- 自动连续后台全世界模拟；
- 多租户 / 云平台；
- 为理论错误设计完整审批 / typed mutation 平台；
- 为 DSH 当前内部实现做深 fork。

---

## 16. Architecture Reality Gates

### Gate A — World Core Viability

架构只有在以下真实成立时才继续扩张：

- 游戏真的让玩家想继续；
- World Core 不明显降低 GM 能力；
- 全新 DSH Session 可以恢复同一个世界；
- 世界存在长期因果与离屏变化；
- Agent 自主维护工作区，玩家主要负责玩。

### Gate B — RPG Specialization Value

Gate A 通过后，至少一个 RPG 专用插件应证明：

> DSH 插件体系能够让 The World 从“Agent 聊天式 RPG”明显向“真正游戏体验”前进，而无需重造 Agent Runtime。

当前下一步：**TW-01 First Real Vertical**。