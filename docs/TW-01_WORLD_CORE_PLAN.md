---
title: The World｜TW-01 Minimal World Core Plan
status: completed-stage-plan
updated: 2026-08-24
stage: TW-01
result: Reality Gate A PASS
reference_host: DeepSeek Harness
current_truth: PRODUCT_SPEC_CURRENT.md
final_report: experiments/GATE_A_FINAL_2026-08-24.md
---

# TW-01｜Minimal World Core｜COMPLETED

> **历史阶段计划。TW-01 / Reality Gate A 已于 2026-08-24 通过真实长局人工体验裁定。**
>
> 当前阶段与产品真相请读 `PRODUCT_SPEC_CURRENT.md`；Gate A 最终结论请读 `experiments/GATE_A_FINAL_2026-08-24.md`。本文件保留 TW-01 原始问题、职责边界和验收逻辑，不再作为当前开发路线。

---

## 0. Goal

TW-01 的目标不是制作完整 RPG Runtime，而是把 Bare DSH Probe 已经证明需要稳定承担的长期游戏职责做成一个 **DSH-native thin game-mode layer**。

成功标准：

> **AI GM 仍然像 Bare DSH 一样自由、会写、会主动推进，但不会随着长局继续而忘记维护世界，也不会把 GM / System / Source 私有知识随意塞进 NPC 脑中。**

最终结果：**PASS**。

---

## 1. Required Behaviors

### WC-01｜Game Mode Entry

启动 / 继续 The World game 时，World Core 负责：

- 确认当前 game workspace；
- 读取最小恢复入口；
- 装配当前必要 RPG context；
- 明确当前 protagonist control mode；
- 不要求玩家手工读取 / 整理文件。

### WC-02｜Durable Maintenance Discipline

核心判断：

> **本轮是否产生了未来仍需成立的变化？**

候选包括：

- 新 durable NPC / identity；
- 关系变化；
- 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情 / 能力；
- 任务 / thread 长期状态；
- 地点 / 势力 / 世界局势变化；
- 重大资源变化；
- unresolved consequence / hook；
- 大幅时间推进后的世界状态。

原始要求是“有变化写正确 Owner，无变化不机械写”。真实试玩后进一步演化为 Game Workspace Architecture v0.2 的两层维护：

```text
Tier 1｜每回合 DELTAS 捕获
↓
Tier 2｜检查点归并到正确 Owner
```

### WC-03｜Dynamic Durable Identity

> **Importance controls attention, not existence.**

运行中生成的实体不因“不是 Source 角色 / 不重要 / 尚未命名”而丢失。

TW-01 不建设大型 Entity DB；game-local state 只需稳定认出同一实体。

### WC-04｜Knowledge / Exposure Boundary

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

默认不泄漏：

- GM 后台计划；
- 玩家系统私有信息；
- 穿越者未公开知识；
- 尚未发生的未来史实；
- 角色卡隐藏信息；
- 其它 NPC 私有事实。

TW-01 优先使用 context semantics / prompt boundary，不建设通用 ACL / Knowledge DB。

### WC-05｜Player Authorization Context

World Core 向 GM 提供当前主角操控粒度：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同语义：

> **Compress dead time; stop at meaningful choice.**

玩家自然语言可以临时扩大 / 缩小授权。

### WC-06｜Pacing Elasticity

同时维护：

```text
World Loop
事件 / 局势 / 后果 / 时间推进

Life Loop
自由活动 / 日常 / 人物互动 / 关系与人格塑造
```

正式语义：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

不设置固定节奏 FSM。

### WC-07｜Fresh-session Recovery

完全没有旧聊天上下文的新 DSH Session 应能：

- 找到 game；
- 读取 Composition；
- 读取 current state；
- 读取未归并 durable facts / unresolved threads / recent memory；
- 按需读取 Source；
- 恢复当前地点、人物关系、承诺、局势和玩家控制模式；
- 继续游戏而不是重新开局。

### WC-08｜New Game Setup / Game Composition

正式语义：

> **Agent 不得静默决定本局启用哪些可选拓展包。**

玩家在正式进入游戏叙事前至少确认：

1. World；
2. Expansion / Mechanics；
3. 世界起点 / 口径；
4. Player Character；
5. Protagonist Control Mode；
6. Save Policy；
7. 最终配置确认。

确认结果固化为 `games/<game-id>/COMPOSITION.md`，跨 Session 恢复继续使用。

```text
Asset Library（已安装 / 可用）
!= Game Composition（本局启用组合）
!= Current Runtime Relevant（当前相关）
```

**Enabled != Installed**。

---

## 2. Workspace Evolution

TW-01 最初只要求 Markdown-first minimal workspace：

```text
games/<game-id>/
├─ COMPOSITION.md
├─ state/CURRENT.md
├─ story/LEDGER.md
└─ memory/RECENT.md
```

真实试玩证明需要更清晰 Owner 后，演化为 `GAME_WORKSPACE_ARCHITECTURE_v0.2.md`：

```text
games/<game-id>/
├─ COMPOSITION.md
├─ state/
│  ├─ CURRENT.md
│  ├─ PLAYER.md
│  ├─ THREADS.md
│  ├─ WORLD.md            # 按需
│  ├─ characters/
│  ├─ organizations/      # 按需
│  └─ places/             # 按需
├─ mechanics/
├─ story/
├─ memory/
│  ├─ DELTAS.md
│  └─ RECENT.md
└─ saves/
```

原则保持不变：

> **Owner 清晰优先于文件数量。**

> **一个事实只有一个 Owner。**

> **Core 文件固定存在；实体与机制状态按需生成。**

---

## 3. Turn Responsibilities｜Final TW-01 Shape

```text
[Session / Turn Start]
World Core
→ 确认 game + composition + control mode
→ 新 game：完成 Setup / Composition
→ 旧 game：恢复 workspace
→ 注入少量高价值语义

[Agent / GM]
→ 按需 read Source / state / story / memory
→ 自由主持 / 创造 / adjudicate

[Player-facing response]
→ 正常游戏文本先对玩家可见

[Post-turn maintenance]
→ 普通回合：DELTAS 捕获
→ 检查点：归并 Owner / 刷新 recovery
→ 存档条件：归并后建立 snapshot
→ maintenance 静默结束
```

关键决策：

> **Narrative first, maintenance in the background step while the player reads.**

---

## 4. Context Layers

至少概念上区分：

```text
A. GM / Total Repository Knowledge
B. Game Canonical Reality
C. Player / Character Known Information
D. NPC-local Knowledge
```

这些层级可以同时被模型访问，但**不能自动互相传播**。

World Core 的职责是持续提醒边界，而不是建立通用权限数据库。

---

## 5. What TW-01 Did NOT Build

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
- Economy engine。

这些能力只能由后续真实需求或 RPG 产品价值推动。

---

## 6. Reality Gate A｜PASS

TW-01 的正式验收项：

1. **Want to Continue**；
2. **GM Quality Preserved**；
3. **Persistence Does Not Decay**；
4. **Dynamic Identity Survives**；
5. **Epistemic Boundaries Hold**；
6. **Cross-session Same World**；
7. **Player Plays, Agent Maintains**。

**Result：PASS（2026-08-24）。**

详见 `experiments/GATE_A_FINAL_2026-08-24.md`。

---

## 7. Historical Route

```text
TW-00.5 Bare DSH Capability Probe   ✓ COMPLETE
↓
TW-01 Minimal World Core            ✓ COMPLETE
↓
Reality Gate A                      ✓ PASS
↓
Reality Gate B / RPG Experience     ← current，见 PRODUCT_SPEC_CURRENT.md
```

TW-01 到此关闭。后续不要继续把新 RPG UI / Map / Mechanics 产品能力吸收到 World Core，只因为 Core 已经存在。