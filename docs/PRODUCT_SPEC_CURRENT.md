---
title: The World｜产品与实验总纲
status: current-canonical-product-spec
version: 0.4
updated: 2026-08-23
stage: TW-01 Minimal World Core
previous_stage: TW-00.5 Bare DSH Capability Probe COMPLETE
next: Reality Gate A
reference_host: DeepSeek Harness
---

# The World｜产品与实验总纲 CURRENT

## 0. Product Identity

### Primary Purpose / Job To Be Done

把 **DeepSeek Harness** 从通用 Agent Harness 变成长期 RPG 游戏环境：让优秀模型主持一个真实持续、可长期演化、可跨 Session 恢复的 AI 世界，并逐步通过 RPG 专用插件获得机制、可视化、状态查询与沉浸体验。

### Reference Host

The World 第一公民宿主固定为 **DeepSeek Harness（DSH）**。

DSH 负责：

- Agent loop；
- Provider / Model；
- 通用工具；
- Session；
- 插件生命周期；
- 通用 UI / editor / host foundation。

The World 负责：

- World Core RPG Game Mode；
- reusable RPG assets；
- game-local persistent world；
- state / story / memory / saves 语义；
- fresh-session recovery；
- RPG UI / Map / Mechanics / Expansion Plugins；
- 与 DSH 的薄集成层。

原则：

> **DSH-native, not DSH-internal-coupled.**

### Canonical Stack

```text
DeepSeek Harness
+
World Core RPG Game Mode
+
Persistent World Workspace
+
RPG Experience / Mechanics Plugins
```

---

## 1. Core Value

玩家选择 The World，而不是直接对通用 Agent 说“主持 RPG”，是为了得到：

- 一个真实持续、会积累历史的世界；
- 跨长上下文 / 跨全新 DSH Session 仍可继续；
- 持续存在的人物、地点、关系、势力、承诺与后果；
- 不明显牺牲优秀模型创造力、角色表现、主动性与自由度的 GM；
- 稳定的 durable world maintenance；
- 玩家级 Save / Undo / Restore；
- RPG UI / Map / Mechanics 带来的真正游戏化体验。

产品价值概括：

> **真实持续的 AI 世界 + 优秀自由的 AI GM + RPG 专用游戏化能力。**

### Simple Baseline

```text
DeepSeek Harness
+
同一 Provider / Model
+
简单长期 RPG 主持要求
+
允许 Agent 自己按需使用文件
```

The World 必须证明自己提供的是 **DSH 之外的长期 RPG 产品价值**。

---

## 2. Product Promise

玩家应进入一个：

- 世界主动发生事情；
- 时间可以自然推进数日、数月乃至数年；
- 世界不会因为玩家存在就放弃因果与合理性；
- 玩家可以自然语言尝试任何行动；
- NPC / 势力 / 地点 / 冲突拥有持续身份；
- 玩家行为产生可信、可延迟、可累积的后果；
- GM 主动把有意义的舞台组织到玩家身边；
- 但玩家不永远处于“被事件推着走”的状态；
- 大事件之间存在自由活动、日常、关系和人格塑造空间；
- 玩家可以选择主角操控粒度；
- Agent 自主维护后台文件；
- 全新 DSH Session 可以恢复为同一个世界；
- 长期机制状态可以通过 RPG UI 随时查看。

核心：

> **世界独立存在，叙事聚光灯照向玩家。**

> **世界产生历史，GM 从中为玩家组织故事。**

---

## 3. Core Player Journey

```text
选择世界 / 扩展内容
↓
选择或创建角色
↓
选择主角操控粒度（可随时调整）
↓
开始 / 继续游戏
↓
World Core 恢复并组装必要上下文
↓
GM 自由主持真实持续世界
↓
玩家行动 / 低价值过程可按授权托管
↓
世界给出后果并持续演化
↓
World Core 确保 durable changes 被维护
↓
必要时创建恢复点
↓
玩家离开
↓
全新 DSH Session
↓
恢复同一个世界继续
```

玩家不承担 `state / story / memory / saves` 手工维护。

---

## 4. World Semantics

### 4.1 Persistent World + Player Spotlight

```text
Persistent != Fully Simulated
World Independence + Player Spotlight
```

- 世界在玩家视野外保持因果连续；
- 不要求所有实体逐回合 tick；
- GM 根据时间、人物目标、势力、冲突与玩家相关性选择离屏变化；
- 世界不围绕玩家存在，但叙事注意力优先服务玩家体验。

### 4.2 Durable Identity vs Simulation Priority

> **重要性决定注意力与模拟资源，不决定已经形成 durable identity 的实体是否存在。**

一个运行中产生的 NPC / 地点 / 关系 / 承诺 / 冲突，一旦形成会影响未来判断的 durable fact，就应进入 game-local reality。

之后可以降低：

- retrieval priority；
- 离屏模拟频率；
- UI prominence；

但不能从世界中消失。

### 4.3 Unlimited Attempt, Consequence-bound World

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

玩家拥有尝试权，不拥有结果控制权。

### 4.4 Knowledge Provenance / Epistemic Boundary

> **GM / Source / System knows X != NPC knows X.**

NPC 可使用的信息应能由世界内来源解释，例如：

- 亲历；
- 身份 / 职业 / 社会渠道；
- 被告知；
- 传闻；
- 可观察事实；
- 合理推断；
- 显式系统 / 超自然权限。

默认不得泄漏：

- GM 后台计划；
- 玩家系统私有信息；
- 穿越者未公开知识；
- 尚未发生的未来史实；
- 角色卡隐藏信息；
- 其它人物私有事实。

第一阶段不建设通用 Knowledge ACL DB；优先用 World Core context semantics 解决。

### 4.5 Pacing Elasticity / Life Layer

Bare DSH 主动推进世界是正向能力，但事件密度过高会让玩家始终处于响应模式，NPC 退化成纯功能角色。

The World 同时承认：

```text
World Loop
局势 → 事件 → 后果 → 时间推进

Life Loop
自由活动 → 日常 → 人物互动 → 关系 / 人格积累
```

正式原则：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

不使用机械“每 N 个事件休息一次”的节奏状态机。

---

## 5. Player Agency & Control

### 5.1 Player Agency = Authorization Boundary

Player Agency 不等于每个动作都必须由玩家手操。

> **GM 不得把宽泛玩家意图自动扩大成未授权的重大承诺、路线、阵营、关系或不可逆选择。**

### 5.2 Configurable Protagonist Control

候选模式：

- **Full Control**：绝大多数主角行动由玩家明确决定；
- **Light Delegation**：GM 可按目标、角色卡、性格与计划处理低价值步骤；
- **Narrative Delegation**：玩家主要决定战略与重大抉择，GM 更积极代行过程行为。

共同原则：

> **Compress dead time; stop at meaningful choice.**

玩家自然语言可以临时扩大 / 缩小授权，并可随时接管。

---

## 6. Model Freedom & Recovery

正式原则：

> **Freedom Before Prevention.**

> **Prefer recovery over prevention.**

低成本错误优先：

```text
发现
→ Undo / Regenerate / 修正 / Restore
→ 继续游戏
```

确定性能力分两类：

1. **Product-value capability**：UI、Map、Combat、Politics、Economy、Character Progression 等，可由产品价值直接驱动；
2. **Preventive infrastructure**：validator、typed mutation、事务层等，必须由真实重复失败推动。

禁止因为理论风险重建第二版式重型 Runtime / Guardrail。

---

## 7. RPG UI Semantics

> **Chat 展示机制事件；UI 承载机制当前状态。**

Persistent RPG UI 典型 surface：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

> **UI is a projection of game truth, not a second truth source.**

### Agent Trace Presentation

> **隐藏工作噪音，不限制 Agent 工作能力。**

DSH `think/read/write/tool` 默认不应占据 RPG 主阅读流，但保留 debug / inspect 入口。

---

## 8. TW-00.5 Bare DSH Probe Result

**Status：COMPLETE（2026-08-23）**

最终报告：`docs/experiments/BARE_DSH_PROBE_FINAL_2026-08-23.md`。

### Positive Evidence

- GM 文笔、自由度与角色表现优秀；
- 会主动推进世界与时间；
- 能自发创建 workspace；
- 能维护 GM Authority；
- 自然语言机制能直接工作；
- 能创造动态人物并利用伏笔；
- Player Spotlight 有明显正向表现；
- 轻度主角托管有产品价值。

### Confirmed Core Gaps

1. **Persistence Maintenance Attrition**：长局后文件维护衰减并最终停止；
2. **Dynamic Durable Entity Persistence**：运行中产生的人物 / 关系易漏写；
3. **Epistemic Boundary Leak**：NPC 可无来源继承 GM / System / future knowledge；
4. **Pacing Elasticity / Downtime**：事件过密，缺少生活与关系塑造空间；
5. **Agency Granularity**：自动推进需要授权粒度，而不是简单禁止。

### Product / Host Gaps

- Agent trace noise；
- Persistent RPG UI；
- player-facing Save / Restore；
- DSH 偶发 reasoning 完成但不 emit final response。

---

## 9. Current Stage｜TW-01 Minimal World Core

TW-01 当前目标：

> **让 AI GM 保留 Bare DSH 的自由与创造力，同时稳定承担长期世界维护和关键语义边界。**

### Required Behaviors

1. Game mode entry / continue；
2. bounded GM / world / workspace context；
3. durable maintenance responsibility 不随长局消失；
4. dynamic durable entity / relationship / commitment / consequence 写回；
5. knowledge / exposure boundary；
6. protagonist control authorization context；
7. minimal pacing semantics；
8. fresh-session recovery；
9. Source 与 game-local reality 分离；
10. 为后续 UI / Map / Mechanics 保留清晰 Owner；
11. player-confirmed Game Composition：新局的 World / Player Character / Expansion / Control Mode 由玩家确认，Optional expansion 不得由 Agent 静默启用，确认组合固化为 game 配置并跨 Session 恢复。

详细计划：`docs/TW-01_WORLD_CORE_PLAN.md`。

### Non-scope

TW-01 不默认建设：

- 独立 Agent Runtime；
- typed mutation engine；
- narrative approval gate；
- universal entity schema；
- knowledge ACL database；
- 全量世界模拟器；
- 完整 RPG UI；
- Map / Combat / Economy engine。

---

## 10. Ownership

- `plugins/`：World Core + RPG Experience / Mechanics Plugins；
- `library/`：reusable Source Assets；
- `games/<game-id>/state/`：current game-local canonical reality；
- `story/`：important history / commitments / consequences；
- `memory/`：lossy context compression / retrieval；
- `saves/`：explicit recovery points；
- `tools/`：narrow deterministic support；
- `docs/`：product / architecture / experiment truth。

---

## 11. Reality Gate A

TW-01 至少证明：

1. **Want to Continue**；
2. **GM Quality Preserved**；
3. **Persistence Does Not Decay**；
4. **Dynamic Identity Survives**；
5. **Epistemic Boundaries Hold**；
6. **Cross-session Same World**；
7. **Player Plays, Agent Maintains**。

通过 Gate A 后，至少实现一个真正的 RPG Experience / Mechanics Plugin，验证 Gate B。

---

## 12. First Real Vertical

仍使用：

> **三国历史 / 题材 Source 初始条件 + 原创玩家角色。**

正式语义：

- Source 定义开始前的世界；
- 游戏开始后 `game-local reality > source default trajectory`；
- 玩家可以改变历史；
- 已发生分叉不得为了贴回 Source 被静默修正。

TW-01 不直接把 Bare DSH `TEST/save/` 的偶然目录结构提升为正式架构。

---

## 13. Open Questions / Non-blocking

- current DSH 最合适的 plugin / context / lifecycle seam；
- Save / Undo / Restore 第一版实现；
- protagonist control mode 最终 UI binding；
- Source Fidelity manifest 是否需要；
- 首个 Gate B 插件；
- DSH Developer Preview breaking-change 适配成本。

---

## 14. Decision Ledger

- **DEC-P01** Reference Host = DSH；不自建通用 Agent Runtime。
- **DEC-P02** 核心价值 = World Core + Persistent World + RPG Plugins。
- **DEC-P03** Persistent World + Player Spotlight。
- **DEC-P04** Freedom Before Prevention；Prefer Recovery over Prevention。
- **DEC-P05** Player owns Attempt；World owns Consequence；GM owns Playability。
- **DEC-P06** 开始 → 游玩 → 自动维护 → 离开 → 全新 Session 恢复。
- **DEC-P07** 三国 Source 初始条件；game-local reality 优先。
- **DEC-P08** Gate A 后再用 RPG Plugin 验证 Gate B。
- **DEC-P09** Importance controls attention, not existence。
- **DEC-P10** Chat 展示机制事件；UI 承载机制当前状态。
- **DEC-P11** 隐藏工作噪音，不限制 Agent 工作能力。
- **DEC-P12** Player Agency = Authorization Boundary；操控粒度可配置。
- **DEC-P13** Compress dead time; stop at meaningful choice。
- **DEC-P14** Baseline-first：先 Bare DSH Probe，再开发真实缺口。
- **DEC-P15** Knowledge Provenance：GM / Source / System knows X != NPC knows X。
- **DEC-P16** Pacing Elasticity：World Loop 与 Life Loop 同时存在，不用事件持续轰炸替代玩家生活。
- **DEC-P17** Persistence Maintenance Discipline：durable maintenance 是 World Core 稳定职责，不能随长局衰减消失。
- **DEC-P18** Game Composition = Player-Confirmed：新局组合（World / Player Character / Expansion / Control Mode）必须经玩家确认；世界包可带 Required / Recommended 内容，Optional expansion 默认关闭且只能由玩家明确启用；确认结果固化为 game 配置（`games/<game-id>/COMPOSITION.md`），Session 恢复继续使用；Source NPC / lore 等世界内部资产不要求逐项选择；组合确认完成前不进入正式叙事。

---

## 15. Current Decision

**Product Definition Gate：PASS。TW-00.5：COMPLETE。TW-01：CURRENT。**

当前正式工作：

> **先核验 current DeepSeek Harness extension seams，然后实现最小 World Core plugin skeleton；第一优先验证长期写回、动态实体、知识边界和 fresh-session recovery，同时保护 Bare DSH 已证明优秀的 GM 能力。**