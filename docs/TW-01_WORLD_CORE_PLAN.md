---
title: The World｜TW-01 Minimal World Core Plan
status: current-stage-plan
updated: 2026-08-23
stage: TW-01
reference_host: DeepSeek Harness
---

# TW-01｜Minimal World Core

## 0. Goal

TW-01 的目标不是制作完整 RPG Runtime，而是把 Bare DSH Probe 已经证明需要稳定承担的长期游戏职责做成一个 **DSH-native thin game-mode layer**。

成功标准：

> **AI GM 仍然像 Bare DSH 一样自由、会写、会主动推进，但不会随着长局继续而忘记维护世界，也不会把 GM / System / Source 私有知识随意塞进 NPC 脑中。**

---

## 1. World Core v0.1 Required Behaviors

### WC-01｜Game Mode Entry

启动 / 继续 The World game 时，World Core 能够：

- 确认当前 game workspace；
- 读取最小恢复入口；
- 装配当前必要 RPG context；
- 明确当前 protagonist control mode；
- 不要求玩家手工读取 / 整理文件。

### WC-02｜Durable Maintenance Discipline

每次 turn / 重大阶段结束时，Agent 必须执行一个很薄的判断：

> **本轮是否产生了未来仍需成立的变化？**

候选包括：

- 新 durable NPC / identity；
- 关系变化；
- 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情 / 能力；
- 任务长期状态；
- 地点 / 势力 / 世界局势变化；
- 重大资源变化；
- unresolved consequence / hook；
- 大幅时间推进后的世界状态。

有变化：写回正确 Owner。

无变化：不机械写文件。

关键验收：**长局中维护职责不能自然衰减为 0。**

### WC-03｜Dynamic Durable Identity

运行中生成的实体不因“不是 Source 角色 / 不重要 / 尚未命名”而丢失。

> **Importance controls attention, not existence.**

第一阶段不做大型 Entity DB；只要求 game-local state 能稳定认出同一实体。

### WC-04｜Knowledge / Exposure Boundary

World Core 必须稳定提供：

> **GM / Source / System knows X != NPC knows X.**

NPC 使用信息时，应符合其世界内知识来源。

允许来源：

- 亲身经历；
- 身份 / 职业 / 社会渠道；
- 被告知；
- 传闻；
- 可观察事实；
- 合理推断；
- 明确授权的超自然 / 系统能力。

禁止默认泄漏：

- GM 后台计划；
- 玩家系统私有信息；
- 穿越者未公开知识；
- 尚未发生的未来史实；
- 角色卡隐藏信息；
- 其它 NPC 私有事实。

第一版优先用 context semantics / prompt boundary，而不是 ACL / Knowledge DB。

### WC-05｜Player Authorization Context

World Core 向 GM 提供当前主角操控粒度：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同语义：

> **Compress dead time; stop at meaningful choice.**

玩家自然语言可以临时扩大 / 缩小授权。

### WC-06｜Pacing Elasticity

World Core 不限制世界主动推进，但应提醒 GM 同时维护：

```text
World Loop
事件 / 局势 / 后果 / 时间推进

Life Loop
自由活动 / 日常 / 人物互动 / 关系与人格塑造
```

正式语义：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

不设置“每 N 个事件必须休息”之类机械节奏状态机。

### WC-07｜Fresh-session Recovery

从完全没有旧聊天上下文的新 DSH Session 启动时，World Core 应能：

- 找到 game；
- 读取本局 Composition 配置（见 WC-08），继续使用已确认组合而不是重新询问或重新决定；
- 读取 current state；
- 读取必要 unresolved story / memory；
- 按需读取 Source；
- 恢复当前地点、人物关系、承诺、局势和玩家控制模式；
- 继续游戏而不是重新开局。

### WC-08｜New Game Setup / Game Composition

新开一局时，World Core 必须提供 **Game Composition** 流程。正式语义：

> **Agent 不得静默决定本局启用哪些可选拓展包。**

玩家在正式进入游戏叙事前，至少确认：

1. **World**：本局使用哪个世界包；
2. **Player Character**：使用哪张人物卡 / 原创主角；
3. **Expansion / Mechanics**：本局启用哪些拓展包 / 机制模块；
4. **Protagonist Control Mode**：Full / Light / Narrative Delegation（见 WC-05）。

世界包 / 资产可以声明内容分级：

- **Required**：世界定义的必要组成部分，随世界包生效，向玩家明示但不需要逐项选择；
- **Recommended**：世界作者推荐项，作为玩家确认时的默认预选，玩家可取消；
- **Optional**：默认不启用，**必须经玩家明确选择**；Agent 推荐可以，代替玩家勾选不行。

边界：

- Source NPC / lore / 其它世界内部资产不要求玩家逐项选择；Game Composition 是**包 / 模块级**确认，不是资产级清点；
- 玩家确认后的最终组合固化为本 game 的正式配置（`games/<game-id>/COMPOSITION.md`），是 game-local canonical 事实，不是 UI preference；
- 后续 Session 恢复（WC-07）继续使用该配置，不因换 Session 而丢失或重置；
- 局内变更组合（启用 / 停用拓展）是一次玩家可感知的正式修改，写回 COMPOSITION，不允许 Agent 静默执行；
- **Composition 未确认完成前，不进入正式游戏叙事。**

形式化层级：

```text
Asset Library（已安装 / 可用）
!= Game Composition（本局启用组合）
!= Current Runtime Relevant（当前相关）
```

**Enabled != Installed**；启用集合来自玩家确认，不来自 Agent 默认。

实现（v0.1）：DSH 插件 `the-world-core`——开局向导为提示语义（模型用 ask_user_question 逐项确认），
程序化确认门只有一处：session-start 检测 `COMPOSITION.md` 的「确认状态」，
未确认的游戏目录走“补完确认”注入而不是正常恢复（`readCompositionStatus`）。

---

## 2. Minimal Workspace Contract

第一版保持 Markdown-first。

建议继续使用项目已有抽象：

```text
games/<game-id>/
├─ README.md
├─ state/
├─ story/
├─ memory/
└─ saves/
```

但 TW-01 不需要一开始就拆几十个文件。

### Minimum viable files

```text
games/<game-id>/
├─ README.md
├─ COMPOSITION.md      ← WC-08：玩家确认的本局组合配置（canonical）
├─ state/
│  └─ CURRENT.md
├─ story/
│  └─ LEDGER.md
└─ memory/
   └─ RECENT.md
```

根据真实压力再拆：

- characters；
- factions；
- locations；
- inventory；
- quests；
- mechanics state。

原则：

> **Owner 清晰优先于文件数量。**

---

## 3. Turn Responsibilities

概念流程：

```text
[Session / Turn Start]
World Core
→ 确认 game + composition + control mode
→ 新 game：先完成 WC-08 Game Composition 确认，未确认不进入叙事
→ 旧 game：按已确认 COMPOSITION 恢复，不重新决定启用组合
→ 注入少量 GM / world / knowledge-boundary semantics
→ 提供恢复入口

[Agent / GM]
→ 按需 read Source / state / story / memory
→ 自由主持、自由创造、自由 adjudicate

[Player-facing response]
→ 正常游戏文本

[Post-turn maintenance — Tier 1（每回合）]
→ 判断 durable changes
→ 只向 memory/DELTAS.md 追加 1–3 行（自写入起即为有效事实）

[Checkpoint consolidation — Tier 2（场景收束 / 时间大跳 / 每 N 玩家回合）]
→ 把 DELTAS 逐条归并到受影响 Owner
→ 移除已归并条目，刷新 recent memory / recovery metadata
→ 到达存档回合时先归并再做存档快照
```

重点：

- 不做 narrative approval；
- 不要求模型先提交 typed proposal；
- 不要求每回合全仓读取；
- 不要求每回合全文件 rewrite；
- 每回合维护只做轻量捕获，批量归并推迟到检查点；
- maintenance 是 Agent 的游戏后台职责，而不是玩家任务。

---

## 4. Context Layers

第一版至少概念上区分四类知识：

```text
A. GM / Total Repository Knowledge
B. Game Canonical Reality
C. Player / Character Known Information
D. NPC-local Knowledge
```

这些层级可以同时被模型访问，但**不能自动互相传播**。

World Core 的职责是持续提醒边界，而不是建立通用权限数据库。

---

## 5. What TW-01 Does NOT Build

- 独立 Agent Runtime；
- 通用 Provider layer；
- typed mutation engine；
- narrative validator；
- universal entity schema；
- knowledge ACL database；
- 全量 world simulator；
- 完整 RPG UI；
- Map；
- Combat engine；
- Economy engine；
- 完整 player-facing Save UI。

这些只能由后续真实需求或 Gate B 产品价值推动。

---

## 6. First Implementation Order

### Step 1｜DSH Capability / Extension Seam Survey

先核验 DeepSeek Harness current：

- 插件 package 结构；
- systemPrompt / context injection seam；
- session start / turn / agent-loop hooks；
- tool registration；
- workspace / cwd handling；
- session recovery / fork ability；
- UI extension seam。

目标不是设计产品，而是找到最薄、最 DSH-native 的挂接点。

### Step 2｜World Core v0.1 Game-mode Context

只实现：

- 进入 / 继续游戏；
- GM high-value semantics；
- knowledge boundary；
- protagonist control mode；
- recovery entry instructions。

先不实现复杂工具。

### Step 3｜Durable Maintenance Hook

在合适的 post-turn / agent step seam 中，稳定触发：

> durable change review

让 Agent 自主决定哪些文件需更新。

第一版不要求 machine schema。

### Step 4｜Migrate / Start a Real Test Game

用三国资产启动一局新的 TW-01 test game，避免直接拿 Bare DSH 的偶然 `save/` 结构当正式架构。

### Step 5｜Reality Gate A Stress Test

重点重测 Bare DSH 已失败的项目：

1. 连续多场景后是否仍写 durable state；
2. 动态 NPC 是否稳定留下；
3. NPC 是否还会泄漏系统 / 未来历史知识；
4. 时间推进后 world state 是否同步；
5. 是否保留自由探索 / downtime；
6. World Core 是否损害文笔和主动性；
7. 全新 DSH Session 是否恢复同一世界。

---

## 7. Gate A Acceptance

TW-01 通过 Gate A 至少需要：

- **Want to Continue**：玩家仍想继续玩；
- **GM Quality Preserved**：相对 Bare DSH 不明显变机械；
- **Persistence Does Not Decay**：长局中 durable maintenance 不消失；
- **Dynamic Identity Survives**：动态人物 / 关系 / 承诺可恢复；
- **Epistemic Boundaries Hold**：NPC 不无来源继承 GM / System / future knowledge；
- **Cross-session Same World**：全新 Session 可恢复；
- **Player Plays, Agent Maintains**：玩家不用充当文件管理员。

---

## 8. First Coding Task Recommendation

真正第一份代码不应该是 Save UI 或 Entity DB，而应该是：

> **一个最小 DSH World Core plugin skeleton，能够在游戏 Session 中稳定注入 World Core context，并在合适生命周期点触发 durable maintenance responsibility。**

在写这份代码之前，只需要完成一次 current DSH seam survey。

这将是 TW-01 的第一个 vertical spike。