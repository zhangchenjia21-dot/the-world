---
title: The World｜DSH-native RPG 工作架构
status: current-experimental-architecture
version: 0.6
updated: 2026-08-24
canonical_product_spec: PRODUCT_SPEC_CURRENT.md
reference_host: DeepSeek Harness
current_stage: Reality Gate B / RPG Experience Validation
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

TW-00.5 Bare DSH Probe 已结束，TW-01 / Reality Gate A 已于 2026-08-24 通过真实长局人工体验裁定。

实验最终证明：

- DSH + 强模型本身非常会主持 RPG；
- 主要长期缺口不在“不会写故事”，而在**长期维护职责会衰减、动态实体易漏写、知识边界会泄漏、节奏缺少生活层，以及宿主/UI 游戏化不足**；
- World Core 可以用薄职责层补足这些长期缺口，而不需要重建第二套 Agent Runtime；
- 当前架构重点已从“证明长期世界能成立”推进到“证明 RPG 专用插件能 materially improve 玩家体验”。

正式原则：

> **只程序化稳定职责与边界，不程序化叙事本身。**

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
- player-confirmed game composition（新局组合确认与固化）；
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

games/<game-id>/COMPOSITION.md
→ player-confirmed game composition（World / Player Character / Expansion / Control Mode / Save Policy），本局 canonical 配置

games/<game-id>/state/
→ current game-local canonical reality

games/<game-id>/mechanics/
→ enabled mechanics 的本局当前状态

games/<game-id>/story/
→ important history / resolved threads / consequences

games/<game-id>/memory/
→ pending durable deltas + lossy context compression / retrieval aids

games/<game-id>/saves/
→ explicit recovery points

tools/
→ narrow deterministic support utilities

docs/
→ product / architecture / experiment truth
```

---

## 3. World Core｜Evidence-driven Thin Core

World Core 是 The World Shared Foundation，不是第二套 Runtime。

### 3.1 Game Entry / Continue

World Core 应能在 Session 开始时：

- 确认当前 game；
- 新 game：先执行 Game Composition 确认，未确认完成不进入正式叙事；
- 旧 game：读取玩家已确认的本局组合配置，继续使用而不是重新决定；
- 找到恢复入口；
- 读取最小 current state；
- 读取未归并 DELTAS；
- 按需读取 unresolved threads / recent memory；
- 提供当前 protagonist control mode；
- 注入少量高价值 GM / world semantics。

目标：

> 玩家说“继续这个游戏”时，Agent 不依赖旧聊天上下文也能恢复。

### 3.2 Durable Maintenance Discipline

Bare DSH 最终确认的核心失败：**长局后文件维护逐渐衰减，最后停止。**

当前采用 Game Workspace Architecture v0.2 的两层维护：

```text
[Player-facing narrative]
↓
Tier 1｜Delta Capture（每玩家回合）
→ 只捕获本轮 1–3 条新的 durable facts
→ 追加 memory/DELTAS.md
→ 条目自写入起即为有效 game-local fact
↓
Tier 2｜Checkpoint Consolidation
→ 场景收束 / 时间大跳 / 每 N 玩家回合 / 存档前
→ 将 DELTAS 逐条归并到正确 Owner
→ 清除已归并条目
→ 刷新 RECENT / recovery metadata
→ 需要时建立 Save Point
```

这解决两个相反压力：

- durable fact 必须每回合及时捕获，不能等模型“以后记得”；
- 不应每回合重读和重写整个 workspace。

候选 durable changes：

- 新 durable NPC / identity；
- 关系变化；
- 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情 / 能力；
- 线程长期状态；
- 地点变化；
- 势力 / 世界局势变化；
- 重大资源变化；
- unresolved consequence；
- 大幅时间推进后的 current world state；
- enabled mechanics 的长期状态变化。

禁止：

- 每回合机械 rewrite 所有文件；
- 为了“看起来完整”创建无意义记录；
- 把 maintenance 转嫁给玩家。

### 3.3 Dynamic Durable Identity

运行中产生的实体只要形成会影响未来判断的 durable fact，就进入 game-local state。

> **Importance controls attention, not existence.**

当前仍不建设通用 Entity DB；实体文件只要求稳定 identity 与足够的 game-local事实。

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

当前不建 Knowledge ACL / provenance DB。

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

继续依赖 DSH 正式 turn / step / session 基础，不另造 Formal Turn Engine。

当前生命周期：

```text
[Session Start / Continue]
World Core
→ game recovery
→ bounded context
→ unresolved DELTAS
→ control mode
→ core semantics

[Agent / GM]
→ 按需 read state / story / memory / source
→ 自由 adjudicate / create / narrate

[Player-facing Final]
→ 正常游戏文本先对玩家可见

[Post-turn Maintenance]
→ 普通回合：Tier 1 delta capture
→ 检查点回合：Tier 2 consolidation
→ 到存档条件：归并后建立 snapshot
→ maintenance completion 不输出玩家可见通知
```

关键体验决策：

> **Narrative first, maintenance in the background step while the player reads.**

不把 maintenance 前置到玩家可见叙事之前，以免增加感知延迟。

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
├─ memory/
│  ├─ DELTAS.md            # 待归并 durable facts；写入即生效
│  └─ RECENT.md            # 恢复用压缩记忆
└─ saves/                  # 恢复点（Persistent State != Save Point）
```

核心约定：

- **Core 文件固定存在；实体与机制状态按需生成。**
- **一个事实只有一个 Owner。**
- **实体只存一次，分类全部变成属性；INDEX 是派生视图，可重建。**
- Expansion Pack 只声明「哪些事实值得长期记住」，存到哪里由 World Core 决定。
- 保持 Markdown-first；不建完整 Entity Schema / JSON DB / Universal Manifest。

### Save Policy

Persistent State 与 Save Point 明确分离：

- 无论玩家选择哪种存档策略，活 workspace 都持续维护；
- Save 是显式可回滚 snapshot；
- 自动存档策略在 New Game Setup 中由玩家确认并写入 `COMPOSITION.md`；
- 自动档可滚动保留，手动档不自动删除；
- 执行簿记（跨 Session 回合计数 / pending milestone / 最近自动存档失败）存于
  `saves/POLICY_STATE.json`：machine-owned，不进 snapshot，Restore 不回滚，
  策略指纹始终与当前 `COMPOSITION.md` 对齐（Save Policy v0.2）；
- 里程碑信号由模型经 `world_mark_milestone` 发出，快照由确定性代码在归并完成后的
  安全 seam 建立；同回合定期 + 里程碑同时触发只建一个 milestone 档（Save Policy v0.2）；
- snapshot 默认覆盖 `COMPOSITION.md + state/ + mechanics/ + story/ + memory/`，不递归保存 `saves/`。

---

## 6. Recovery Model

```text
game README
→ state/CURRENT
→ memory/DELTAS（未归并事实）
→ RECENT / THREADS
→ relevant story
→ necessary source
→ older history on demand
```

```text
Game History Growth != Agent Context Growth
```

Fresh-session recovery 已通过 Reality Gate A 的真实试玩验证。

最终 Restore 仍需要避免：

> 文件回到 T2，但 Session / Agent context 仍在 T5。

因此完整 player-facing Restore Surface 仍属于后续产品能力。

---

## 7. Source / Game-local Separation

- `library/` 是 reusable Source；
- game runtime 新事实进入当前 game；
- Source 更新不自动覆盖已有 game；
- Source 只定义开始前事实 / 默认轨迹；
- `game-local reality > source default trajectory`；
- 已发生历史分叉不得静默修正回 Source。

DSH-native 资产创作规范进一步明确：资产写世界 / 人物 / 机制语义，不声明具体 workspace 路径、Runtime loader、机器依赖图或 UI binding。

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

### 8.1 Chat + Persistent UI

> **Chat 展示机制事件；UI 承载机制当前状态。**

### 8.2 UI Truth Boundary

```text
Canonical Game Workspace
        ↓
Player-facing View Model / Projection
        ↓
RPG UI
```

UI 不是第二事实源。

Player-facing View Model 可以跨多个 Owner 聚合玩家已知事实，但不持久化另一套 truth。

### 8.3 Owner Architecture != Player Information Architecture

Gate B 真实 UI 试玩暴露了新的重要边界：

> **Workspace is organized for truth maintenance; UI is organized for player needs.**
>
> **工作区按事实归属组织，UI 按玩家需求组织。**

因此：

- `PLAYER.md` 不等于“角色页”；
- `characters/` 不等于“把 INDEX.md 漂亮地列出来”；
- `mechanics/<id>/STATE.md` 不等于“系统页原样渲染”；
- `THREADS.md` 不等于必须把所有 open thread 叫做传统 Quest。

UI 应回答玩家问题，例如：

```text
我是谁、现在怎么样？
我认识谁、和我什么关系？
我有什么？
当前机制状态是什么？
现在有什么事情值得我关注或处理？
```

默认开发信息——file path、Owner 说明、source path、internal id、raw updated metadata——属于 debug / inspect，不属于 RPG 主界面。

### 8.4 Current Gate B Vertical｜the-world-panel

`plugins/the-world-panel` 已证明：

- DSH Web UI plugin 路线可行；
- better-sidebar integration 可行；
- workspace → Node projection → Web UI 可行；
- `fs.watch + SSE` 的无轮询刷新可行；
- 窄确定性 Thread 归档写口可行；
- 确定性 Save / Restore v0.1 可行：`saves/` 快照的浏览 / 手动创建 / 真正 snapshot 恢复
  （恢复前自动建立 pre-restore 保护档，失败回滚 fail loud）；
- Restore fresh-session 边界可行：恢复完成后经 `ctx.sessions.create({ workspaceId })` + `open`
  进入恢复后出生的全新 Session；seam 缺失时降级为显眼的人工新建会话提示，不假装旧 Session 可继续。

当前重点不是继续增加页面，而是完成 Player Experience Redesign：从“Workspace Inspector 的 RPG 皮肤”转成真正以玩家状态、关系、资源、机制和决策为中心的 RPG 界面。

Gate B 验收见：`docs/GATE_B_ACCEPTANCE_v0.1.md`。

### 8.5 Agent Trace Presentation

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

World Core 不默认建设：

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

## 11. Current Implementation Order

```text
TW-00.5 Bare DSH Probe                       ✓ COMPLETE
↓
TW-01 World Core + persistent workspace      ✓
↓
Reality Gate A                               ✓ PASS
↓
Gate B first vertical: the-world-panel       ← CURRENT
↓
Player Experience Redesign
↓
真实试玩 Gate B
↓
根据真实价值决定下一批 RPG plugins
```

当前不以新增更多机制 / 页面作为进度替代品。

---

## 12. Reality Gates

### Reality Gate A｜PASS

已证明：

- Want to Continue；
- GM Quality Preserved；
- Persistence Does Not Decay；
- Dynamic Identity Survives；
- Epistemic Boundaries Hold；
- Cross-session Same World；
- Player Plays, Agent Maintains。

正式裁定：`docs/experiments/GATE_A_FINAL_2026-08-24.md`。

### Reality Gate B｜CURRENT

当前至少要求：

- Material RPG Value；
- Canonical Truth Projection；
- Player-facing Information Architecture；
- Does Not Damage the Game Loop；
- Not a Single-save Accident。

详细验收：`docs/GATE_B_ACCEPTANCE_v0.1.md`。

---

## 13. Architecture Decision

当前正式架构判断：

> **World Core 应该是小而持续的职责层，而不是大而严格的规则层。**

> **Workspace 按事实归属组织；UI 按玩家需求组织。**

World Core 要让 AI GM “按程序办事”的部分是：

- 进入 / 恢复游戏；
- 稳定捕获 durable facts；
- 在检查点归并到正确 Owner；
- 正确区分知识暴露；
- 遵守当前主角授权范围；
- 在长期节奏中保留生活与自由活动空间。

它不负责规定：

- 应该写什么剧情；
- NPC 必须做什么决定；
- 玩家只能做什么；
- 每一个世界事实必须通过程序审批。

RPG UI 负责把 canonical truth 组织成玩家真正有用的界面，但不拥有另一套长期真相。