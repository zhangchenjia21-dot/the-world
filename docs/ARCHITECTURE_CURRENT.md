---
title: The World｜DSH-native RPG 工作架构
status: current-experimental-architecture
version: 0.5
updated: 2026-08-24
canonical_product_spec: PRODUCT_SPEC_CURRENT.md
reference_host: DeepSeek Harness
current_stage: TW-01 Minimal World Core
---

# The World｜DSH-native RPG 工作架构 CURRENT

## 0. Architecture Thesis

```text
DeepSeek Harness
= Agent Host + Provider / Model + Plugin Runtime + Generic Tooling + Session / UI Foundation

The World World Core
= RPG Game Mode + Thin GM / World / Workspace Coordination

Persistent World Workspace
= Durable State + Story + Memory + Saves

RPG Experience / Mechanics Plugins
= UI + Map + Mechanics + Expansion Value
```

TW-00.5 Bare DSH Probe 已结束。实验最终证明：

- DSH + 强模型本身非常会主持 RPG；
- 主要长期缺口不在“不会写故事”，而在**长期维护职责会衰减、动态实体易漏写、知识边界会泄漏、节奏缺少生活层，以及宿主/UI 游戏化不足**。

因此 TW-01 架构目标收紧为：

> **只程序化稳定职责与边界，不程序化叙事本身。**

原则：

> **DSH-native, not DSH-internal-coupled.**

> **Freedom Before Prevention. Prefer recovery over prevention.**

---

## 1. Host Boundary

### DeepSeek Harness Owns

- Agent loop；
- Provider / Model adapter；
- tool registry / execution；
- Session / event stream；
- plugin lifecycle；
- generic Web / headless host；
- generic system prompt / context assembly foundation；
- generic UI / editor foundation。

### The World Owns

- World Core RPG Game Mode；
- game entry / continue / recovery semantics；
- persistent world workspace conventions；
- durable maintenance discipline；
- dynamic durable identity semantics；
- knowledge / exposure boundary；
- protagonist control preference；
- minimal pacing / world semantics；
- RPG UI / Map / Mechanics Plugins；
- thin DSH integration。

The World 不 fork / 重写通用 Agent Runtime。

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
→ important history / commitments / consequences / unresolved hooks

games/<game-id>/memory/
→ lossy context compression / retrieval aids

games/<game-id>/saves/
→ explicit recovery points

tools/
→ narrow deterministic support utilities

docs/
→ product / architecture / experiment truth
```

---

## 3. World Core v0.1｜Evidence-driven Thin Core

World Core 是 TW-01 Shared Foundation。

### 3.1 Game Entry / Continue

World Core 应能在 Session 开始时：

- 确认当前 game；
- 找到恢复入口；
- 读取最小 current state；
- 按需读取 unresolved story / recent memory；
- 提供当前 protagonist control mode；
- 注入少量高价值 GM / world semantics。

目标：

> 玩家说“继续这个游戏”时，Agent 不依赖旧聊天上下文也能恢复。

### 3.2 Durable Maintenance Discipline

Bare DSH 最终确认的核心失败：**长局后文件维护逐渐衰减，最后停止。**

因此 World Core 必须让 maintenance 成为稳定 lifecycle responsibility。

概念流程：

```text
GM response / world progression
↓
Durable Change Review
↓
本轮是否产生未来仍需成立的变化？
├─ No  → 不写
└─ Yes → 更新正确 Owner
```

候选 durable changes：

- 新 durable NPC / identity；
- 关系变化；
- 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情 / 能力；
- 任务长期状态；
- 地点变化；
- 势力 / 世界局势变化；
- 重大资源变化；
- unresolved consequence；
- 大幅时间推进后的 current world state。

禁止：

- 每回合机械 rewrite 所有文件；
- 为了“看起来完整”创建无意义记录；
- 把 maintenance 转嫁给玩家。

### 3.3 Dynamic Durable Identity

运行中产生的实体只要形成会影响未来判断的 durable fact，就进入 game-local state。

> **Importance controls attention, not existence.**

第一阶段不建设 Entity DB；只要求能稳定认出同一实体。

### 3.4 Knowledge / Exposure Boundary

World Core 持续提供：

> **GM / Source / System knows X != NPC knows X.**

概念上区分：

```text
A. GM / Total Repository Knowledge
B. Game Canonical Reality
C. Player / Character Known Information
D. NPC-local Knowledge
```

这些层级可以由同一个模型访问，但不能自动传播。

NPC 可使用知识来源：

- 亲历；
- 身份 / 职业渠道；
- 被告知；
- 传闻；
- 可观察事实；
- 合理推断；
- 显式系统 / 超自然权限。

第一版不建 Knowledge ACL / provenance DB。

### 3.5 Player Authorization Context

候选模式：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同规则：

> **Compress dead time; stop at meaningful choice.**

World Core 只提供当前授权上下文；不做通用 Action Approval Engine。

### 3.6 Pacing Elasticity

保留 Bare DSH 主动推进时间 / 世界的能力，同时提醒 GM 不要把游戏压缩成持续事件响应。

```text
World Loop
局势 → 事件 → 后果 → 时间推进

Life Loop
自由活动 → 日常 → 人物互动 → 关系 / 人格积累
```

World Core 只提供语义：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

不建设固定节奏 FSM。

---

## 4. Turn / Lifecycle Model

第一阶段继续依赖 DSH 正式 turn / step / session 基础，不另造 Formal Turn Engine。

目标生命周期：

```text
[Session Start / Continue]
World Core
→ game recovery
→ bounded context
→ control mode
→ core semantics

[Agent / GM]
→ 按需 read state / story / memory / source
→ 自由 adjudicate / create / narrate

[Player-facing Final]
→ 正常游戏文本

[Post-turn / Post-step Maintenance]
World Core responsibility
→ durable change review
→ selective write-back
→ memory / recovery metadata when needed
```

如果 DSH 不提供理想的 post-turn seam，TW-01 选择最薄的官方 / documented 可行替代，而不是 patch Agent internals。

---

## 5. Game Workspace

现行规范：[GAME_WORKSPACE_ARCHITECTURE_v0.2.md](GAME_WORKSPACE_ARCHITECTURE_v0.2.md)（v0.1 已归档至 docs/archive/）。

工作区同时服务三个消费者：**Agent 恢复世界 · 后台维护 · RPG UI 投影**。

```text
games/<game-id>/
├─ README.md
├─ COMPOSITION.md          # 玩家确认的配置（含存档策略）
├─ state/
│  ├─ CURRENT.md           # Resume Anchor：换 Session 立刻续幕所需的最小事实
│  ├─ PLAYER.md            # 玩家角色：身份/身体/装备/社会身份/知识边界
│  ├─ WORLD.md             # 按需：本局世界态势第一次偏离 Source 时建立
│  ├─ THREADS.md           # 悬而未决：承诺/后果/线索/债务/deadline（只装 open）
│  ├─ characters/          # 人物实体（扁平+frontmatter+INDEX，含 source 人物）
│  ├─ organizations/       # 按需：产生 game-local durable truth 才实例化
│  └─ places/              # 按需：同上
├─ mechanics/              # 本局机制运行状态（README 清单 + <机制>/STATE.md 按需）
├─ story/                  # LEDGER：重要历史与已归档线程
├─ memory/                 # RECENT：压缩记忆
└─ saves/                  # 恢复点（Persistent State ≠ Save Point）
```

核心约定：

- **Core 文件固定存在；实体与机制状态按需生成。**
- **一个事实只有一个 Owner。**
- **实体只存一次，分类全部变成属性；INDEX 是派生视图，可重建。**
- Expansion Pack 只声明「哪些事实值得长期记住」，存到哪里由 World Core 决定。
- 保持 Markdown-first；不建完整 Entity Schema / JSON DB / Universal Manifest。

## 6. Recovery Model

```text
game README
→ state/CURRENT
→ recent / unresolved memory
→ relevant story
→ necessary source
→ older history on demand
```

```text
Game History Growth != Agent Context Growth
```

Fresh-session recovery 是 Gate A 必测项。

最终 Save / Restore 需要避免：

> 文件回到 T2，但 Session / Agent context 仍在 T5。

---

## 7. Source / Game-local Separation

- `library/` 是 reusable Source；
- game runtime 新事实进入当前 game；
- Source 更新不自动覆盖已有 game；
- Source 只定义开始前事实 / 默认轨迹；
- `game-local reality > source default trajectory`；
- 已发生历史分叉不得静默修正回 Source。

Source Fidelity（正史 / 演义 / 混合 / 原创）后续按真实资产需求继续收敛。

---

## 8. RPG Experience / Mechanics Plugins

包括：

- RPG UI / Presentation；
- Map / Visualization；
- Combat；
- Politics；
- Economy；
- Character Progression；
- System / Quest；
- Inventory；
- world-specific expansions。

这些能力由**产品价值**驱动，不要求先证明模型失败。

### Chat + Persistent UI

> **Chat 展示机制事件；UI 承载机制当前状态。**

### UI Truth Boundary

```text
Canonical Game Workspace
        ↓
Plugin Projection
        ↓
RPG UI
```

UI 不是第二事实源。

### Agent Trace Presentation

> **隐藏工作噪音，不限制 Agent 工作能力。**

---

## 9. Host Reliability Boundary

Bare DSH Probe 还发现：偶发 reasoning / tool execution 已结束但没有 user-facing final response，玩家再次输入“输出”后恢复。

当前归类：

> **DSH Host / Turn Completion Reliability**

不是 World Core GM 语义。

如果上游长期未修，后续可做窄补救：检测 turn ended + no final assistant message，并提供 continue / emit-final recovery。

---

## 10. World Core Non-scope

TW-01 v0.1 不默认建设：

- independent Agent Runtime；
- narrative approval gate；
- typed mutation pipeline；
- universal schema / DSL；
- entity database；
- knowledge ACL database；
- prevent-all-errors validator；
- full world simulator；
- complete RPG UI；
- Map / Combat / Economy engine。

---

## 11. First Implementation Order

```text
1. Current DSH extension seam survey
2. Minimal World Core plugin skeleton
3. Game-mode context injection
4. Durable maintenance lifecycle hook
5. Real 三国 vertical test game
6. Reality Gate A stress test
```

详细执行见：`docs/TW-01_WORLD_CORE_PLAN.md`。

---

## 12. Reality Gate A

至少证明：

- Want to Continue；
- GM Quality Preserved；
- Persistence Does Not Decay；
- Dynamic Identity Survives；
- Epistemic Boundaries Hold；
- Cross-session Same World；
- Player Plays, Agent Maintains。

---

## 13. Architecture Decision

当前正式架构判断：

> **World Core 应该是小而持续的职责层，而不是大而严格的规则层。**

它要让 AI GM “按程序办事”的部分是：

- 进入 / 恢复游戏；
- 稳定维护 durable facts；
- 正确区分知识暴露；
- 遵守当前主角授权范围；
- 在长期节奏中保留生活与自由活动空间。

它不负责规定：

- 应该写什么剧情；
- NPC 必须做什么决定；
- 玩家只能做什么；
- 每一个世界事实必须通过程序审批。