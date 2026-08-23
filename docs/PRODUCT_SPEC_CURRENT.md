---
title: The World｜产品与实验总纲
status: current-canonical-product-spec
version: 0.3
updated: 2026-08-23
stage: Stage 0 / Product Definition Gate PASS / TW-00.5 Bare DSH Capability Probe IN PROGRESS
next: Complete Bare DSH Probe -> TW-01 Minimal World Core
reference_host: DeepSeek Harness
---

# The World｜产品与实验总纲 CURRENT

## 0. Product Identity

### Primary Purpose / Job To Be Done

把 **DeepSeek Harness** 从一个通用 Agent Harness，变成一个专门面向长期 RPG 的游戏环境：让优秀模型能够主持一个真实持续、可长期演化、可跨 Session 恢复的 AI 世界，同时通过 RPG 专用插件获得更强的游戏机制、可视化、可查询状态与沉浸式体验。

### Reference Host

The World 第一公民宿主固定为 **DeepSeek Harness（DSH）**。

DSH 负责：

- Agent loop；
- Provider / Model；
- 通用工具；
- Session；
- 插件生命周期；
- 通用 UI / editor / host 基础。

The World 负责：

- World Core RPG Game Mode；
- 世界 / 角色 / 机制 / lore 资产；
- game-local 持久世界；
- state / story / memory / saves 语义；
- 长期世界恢复；
- RPG UI / Map / Mechanics / Expansion Plugins；
- 与 DSH 的薄集成层。

正式原则：

> **DSH-native, not DSH-internal-coupled.**

### Product Core

The World 的核心不是“几个文件夹”，也不是“给 Agent 加一个记忆模块”。

核心产品是：

> **RPG-specialized DeepSeek Harness experience。**

当前 canonical stack：

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

玩家选择 The World，而不是直接对通用 Agent 说“主持一局 RPG”，是为了得到：

- 一个真实持续、会积累历史的世界；
- 跨长上下文 / 跨全新 Agent Session 仍能继续的长期游戏；
- 持续存在的人物、地点、关系、势力、承诺与后果；
- 不明显牺牲优秀模型原有创造力、角色表现、主动性和自然语言自由度的 GM；
- 由 World Core 稳定承载的游戏模式、恢复入口与 durable world maintenance；
- 玩家级 Save / Undo / Restore 等低成本恢复能力；
- 由 RPG UI、Map、Mechanics 等插件带来的“真正游戏”体验。

产品价值概括为：

> **真实持续的 AI 世界 + 优秀自由的 AI GM + RPG 专用游戏化能力。**

### Simple Baseline

现实基线固定为：

```text
DeepSeek Harness
+
同一 Provider / Model
+
一个简单长期 RPG 主持要求
+
允许 Agent 自己按需使用文件
```

The World 必须证明自己提供 DSH 本身之外的 RPG 产品价值，而不是只证明 DSH 很适合玩 RPG。

---

## 2. Target User

Stage 0 唯一必须服务好的用户：**Project Owner / 实际玩家**。

第一阶段允许玩家直接在 DSH 环境中游玩；未来 RPG UI / Launcher 可降低入口成本，但不要求在 World Core 前先完成完整消费者产品包装。

---

## 3. Product Promise

玩家应进入一个：

- 世界会主动发生事情；
- NPC、势力、地点和冲突拥有持续身份；
- 玩家可以用自然语言尝试任何行动；
- 世界不会因为玩家存在就放弃因果和合理性；
- 玩家行为产生可信、可延迟、可累积的后果；
- GM 主动把有意义、有戏剧性的舞台尽量带到玩家身边；
- 失败也尽量形成新的处境、选择和值得继续玩的内容；
- 跨 Session 后仍能恢复为“同一个世界”；
- 工作区主要由 Agent 维护；
- 玩家可以选择自己愿意亲自操控主角到什么粒度；
- 长期机制状态可以通过 RPG UI 随时查询，而不是只能翻聊天历史。

核心原则：

> **世界独立存在，叙事聚光灯照向玩家。**

> **世界产生历史，GM 从中为玩家组织故事。**

---

## 4. Core Experience / Core User Journey

标准路径：

```text
选择世界 / 扩展内容
↓
选择或创建角色
↓
选择主角操控粒度（可随时调整）
↓
开始游戏
↓
World Core 恢复 / 组装必要上下文
↓
GM 主持真实持续世界
↓
玩家自由行动 / 必要时委托低价值过程
↓
世界给出后果并继续演化
↓
Agent 后台维护 durable world facts
↓
必要时自动 / 手动创建恢复点
↓
玩家离开
↓
全新 DSH Session 选择继续游戏
↓
从工作区恢复同一个世界
```

玩家不应被要求理解或手工维护 `state/`、`story/`、`memory/` 等内部工作区。

---

## 5. World & Player Semantics

### 5.1 Persistent World + Player Spotlight

The World 是 **Persistent World RPG**，不是即时故事生成器，也不是逐实体持续 tick 的全量模拟器。

- 世界在玩家视野之外保持因果连续；
- NPC、势力、地点与冲突不会因为玩家没有关注就失去存在；
- GM 根据时间、因果、人物目标和世界局势选择值得推进的离屏变化；
- 不要求计算所有无关细节；
- GM 应主动寻找能与玩家形成选择、冲突、机会和后果的精彩舞台。

正式原则：

```text
Persistent != Fully Simulated
World Independence + Player Spotlight
```

### 5.2 Durable Identity vs Simulation Priority

Bare DSH Probe 已经证明一个重要语义需要明确区分：

> **重要性决定注意力与模拟资源，不决定实体是否存在。**

一个运行中产生的 NPC / 地点 / 关系 / 承诺 / 冲突，一旦形成会影响未来判断的 durable fact，就必须能够进入 game-local reality。

之后它可以：

- 降低 context retrieval priority；
- 降低离屏模拟频率；
- 在 UI 中降为次要人物；
- 进入 archival / dormant 状态；

但不能因为不是名人、不是 Source 角色或暂时不重要而从世界中蒸发。

### 5.3 Unlimited Attempt, Consequence-bound World

玩家拥有**行动尝试权**，不是结果控制权。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

理性、疯狂、愚蠢、冲动、高风险行为都不应因为“不符合推荐路线”而被产品层直接拒绝。

### 5.4 Player Agency = Authorization Boundary

Player Agency 的核心不是要求玩家手动操作每个小动作，而是：

> **GM 不得把一个宽泛意图自动扩大成玩家没有授权的重大选择、承诺或不可逆路线。**

GM 可以主动推进：

- NPC 行动；
- 世界事件；
- 环境变化；
- 玩家视野外的因果；
- 在授权范围内的低价值过程动作。

遇到会明显改变玩家：

- 目标；
- 阵营；
- 承诺；
- 关系；
- 路线；
- 重大资源；
- 风险暴露；
- 身份；

的 meaningful choice 时，默认应把控制权交还玩家，除非玩家当前操控模式或明确自然语言指令已经扩大授权。

### 5.5 Configurable Protagonist Control

The World 将主角操控粒度视为**产品能力**，而不是单一硬规则。

候选模式：

#### Full Control｜完全操控

玩家亲自决定绝大多数主角行动、对话与关键过程。

#### Light Delegation｜轻度托管

GM 可以依据：

- 玩家已表达目标；
- 角色卡；
- 已形成的性格 / 信条；
- 明确的当前计划；

自动处理赶路、常规采购、休息、低风险应对等低价值步骤；遇到 meaningful choice 时停下。

#### Narrative Delegation｜叙事托管

玩家主要决定战略目标与重大抉择；GM 可以更积极地代行符合角色人格与既定目标的过程行动。

所有模式共同遵循：

> **Compress dead time; stop at meaningful choice.**

玩家可以随时：

- 接管；
- 临时要求“这段直接推进到 X”；
- 临时要求“这次谈判每一步我自己来”；
- 切换操控模式。

---

## 6. Model Freedom & Recovery Philosophy

The World 默认信任模型承担主持、世界推进、上下文理解和工作区维护，不针对“理论上可能犯错”预建大规模审批、权限门、typed mutation、严格状态机或强制校验体系。

正式原则：

> **Freedom Before Prevention.**

> **Prefer recovery over prevention.**

低成本、可感知、可恢复错误优先：

```text
发现
→ Undo / Regenerate / 修正 / Restore
→ 继续游戏
```

未来确定性能力分两类：

1. **Product-value capability**：UI、Map、Combat、Politics、Economy、Character Progression 等；可由产品价值直接驱动。
2. **Preventive guardrail / infrastructure**：validator、typed mutation、事务层等；默认由真实重复失败驱动。

---

## 7. RPG UI Semantics

Bare DSH Probe 已经明确：聊天主流不能承担全部长期游戏信息。

正式产品原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

Chat / Narrative Stream 适合：

- 机制触发；
- 判定过程；
- 即时叙事；
- 本轮变化；
- NPC 表现；
- GM 世界推进。

Persistent RPG UI 适合：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode；
- 其它扩展包的长期状态。

UI 必须遵守：

> **UI is a projection of game truth, not a second truth source.**

### Agent Trace Presentation

DSH 默认 `think/read/write/tool` 轨迹对通用 Agent 有价值，但 RPG 主路径中会破坏沉浸。

正式方向：

> **隐藏工作噪音，不限制 Agent 工作能力。**

执行轨迹默认折叠 / 降级，同时保留可选 debug / inspect 入口。

---

## 8. Functional Requirements

TW-01 / Gate A 至少需要：

1. 在 DSH 中进入明确的 The World 游戏模式；
2. 提供必要且有界的 GM / world / workspace context；
3. 读取可复用 world / character / mechanics / lore Source；
4. 建立独立 game-local world reality；
5. 允许 Agent 主动主持世界；
6. 允许玩家用自然语言尝试任意游戏内行动；
7. 稳定识别并写回动态产生的 durable entities / relationships / commitments / consequences；
8. 持久化未来仍有价值的 state / story / memory；
9. 创建或利用明确恢复点；
10. 在全新 DSH Session 中恢复并继续同一个游戏；
11. 保持 Repository Total Knowledge 与 Current Turn Context 分离；
12. 支持 Player Agency authorization boundary，并为可配置 protagonist control 保留产品接口；
13. 为 RPG UI / Map / Mechanics 等插件保留清晰 Owner，而不自建第二套 Agent Runtime。

Gate B / RPG specialization 重点验证：

- Persistent RPG UI；
- Agent trace noise reduction；
- Map / Visualization；
- Mechanics / expansion value。

---

## 9. Non-functional Requirements

- **GM Quality**：不得长期明显降低 Bare DSH 已表现出来的创造力、角色表现、主动性、自由度和剧情节奏；
- **Play-first**：玩家不应成为文件 / 状态管理员；
- **Recoverability**：单次模型错误优先可以廉价撤回、重答、修正或恢复；
- **Long-session Context**：Game History Growth != Agent Context Growth；
- **World Continuity**：原创人物、动态人物、关系、承诺与历史分叉必须可长期恢复；
- **Agency Flexibility**：玩家可以选择主角操控粒度，而不是只有“全手动”或“全自动”；
- **UI Truth Boundary**：UI 不成为第二事实源；
- **Host Boundary**：DSH-native，但 game data 不绑定易变内部实现；
- **Public Repo Safety**：公开仓库不得提交秘密、私密个人内容或无权公开材料。

---

## 10. Domain Semantics & Ownership

### DeepSeek Harness Host

通用 Agent Host / Plugin Runtime。

### RPG Plugin

Owner：`plugins/`。

包括：

- World Core；
- RPG UI；
- Map / Visualization；
- Mechanics / Expansion capabilities。

### Source Asset

Owner：`library/`。

开始一局前存在、可跨 game 复用；单局演化不得静默反向污染 Source。

### Game-local Canonical State

Owner：`games/<game-id>/state/`。

回答：**这局现在真实是什么。**

### Story Ledger

Owner：`games/<game-id>/story/`。

回答：**发生过哪些未来值得追溯的事情。**

### Agent Memory

Owner：`games/<game-id>/memory/`。

上下文压缩 / retrieval layer，不覆盖 current truth。

### Save

Owner：`games/<game-id>/saves/`。

一个明确可恢复到的游戏现场。

### Deterministic Support Tool

Owner：`tools/`。

窄、可复用的确定性支持能力；可靠性工具默认由真实失败驱动。

---

## 11. TW-00.5｜Bare DSH Capability Probe

### Purpose

在开发 World Core 前，先测出：

```text
DeepSeek Harness
+
优秀模型
+
RPG 内容资产
+
极轻自然语言主持要求
```

本身能够做到什么。

TW-00.5 不重新打开 Product Definition Gate；它用于防止我们开发 DSH / 模型已经天然处理好的能力。

### Current Positive Evidence

截至 2026-08-23 已出现：

- GM 文笔与自由度明显正向；
- 自发建立持久工作区；
- 玩家主观断言不会自动成为世界事实；
- 自然语言机制资产可直接参与 adjudication；
- 玩家自身 durable state 写回较稳定；
- 能创造符合当前阶段的原创角色，并用既有剧情伏笔承接；
- 能把玩家需求组织成世界内机会，而不是机械投放标准答案；
- 已开始出现低层级三国题材 Source Character 被自然组织进剧情的能力。

### Confirmed Gaps

- Agent execution trace noise；
- player-facing save / rollback 缺失；
- persistent mechanism UI 缺失；
- dynamic NPC / durable entity persistence 不稳定；
- protagonist action batching / agency granularity 需要产品化，而不是简单禁止代操。

### Watch Items

- Player Desire Accommodation Bias；
- Source Fidelity：正史 / 演义 / 原创边界；
- current state 与 history 是否随长局产生重复膨胀；
- 地点 / 势力 / 任务 / 承诺是否也存在 selective persistence bias。

### Remaining Stress Tests

- 多场景长期连续性；
- Source 角色卡真实消费；
- 真实历史事件 / 题材事件接入；
- history divergence；
- off-screen world evolution；
- delayed consequences；
- 完全全新 DSH Session 的恢复继续。

实验事实以 `docs/experiments/BARE_DSH_CAPABILITY_PROBE.md` 为准。

---

## 12. Stage 0 Scope & Route

当前正式路线：

```text
Product Definition Gate PASS
        ↓
TW-00.5 Bare DSH Capability Probe
        ↓
建立 Baseline Evidence
        ↓
只提炼裸 DSH 的真实缺口
        ↓
TW-01 Minimal World Core
        ↓
Reality Gate A
        ↓
至少一个 RPG Experience / Mechanics Plugin
        ↓
Reality Gate B
```

### Gate A — World Core Viability

- Reference Host = DSH；
- 最小 World Core；
- Source 与 Game-local Reality 分离；
- dynamic durable entity persistence；
- 真实持续试玩；
- 至少一次全新 DSH Session 恢复；
- 与 Bare DSH baseline 对比。

### Gate B — RPG Specialization Value

至少验证一个真正的 RPG 专用体验 / 机制插件，使体验从“Agent RPG”向“真正 RPG”明显移动。

### First Spike Non-scope

- 自建独立 Agent Runtime；
- 通用 Provider 层；
- SillyTavern Runtime clone；
- 万能 Schema / DSL / Protocol；
- 数据库事务平台；
- 全世界逐实体自动模拟；
- 为理论错误预建大规模 Guardrail。

---

## 13. First Real Vertical｜TW-01

TW-01 仍采用：

> **三国历史 / 题材世界初始条件 + 原创玩家角色。**

此前推荐起点约 184 年；Bare DSH Probe 当前实际资产 / 游戏可能采用其它起点。Probe 的任务是测试 Agent 能力，不要求为了旧建议强行改回 184。

正式语义：

- Source 定义开始前的世界事实；
- 游戏开始后 `game-local reality > source default trajectory`；
- 玩家可以改变历史；
- 已发生分叉不得为了贴回 Source 被静默修正。

TW-01 只实现 Bare DSH Probe 证明真正需要的最小 World Core，不把 Probe 中偶然出现的目录结构直接冻结成产品架构。

---

## 14. Product Reality Acceptance

### Gate A

1. **Want to Continue**：玩家实际想继续玩；
2. **GM Quality Preserved**：World Core 不把 Bare DSH 的优秀表现变机械；
3. **Cross-session Same World**：全新 Session 恢复同一世界；
4. **Persistent Causality**：动态人物、关系、承诺、势力与后果长期成立；
5. **Player Plays, Agent Maintains**：玩家不充当状态管理员。

### Gate B

至少一个 RPG Plugin 证明：

> The World 能把“在 Agent 里玩 RPG”明显推进为“更像真正游戏的 RPG”。

单次、低成本、可撤回的模型错误不构成失败；反复破坏核心体验的系统性问题才推动新的工程约束。

---

## 15. Open Questions / Non-blocking

当前无 Product Definition blocker。

继续通过 TW-00.5 / TW-01 收敛：

- Provider / Model；
- World Core 最合适的 DSH extension seam；
- Save / Undo / Regenerate / Restore 第一版实现；
- protagonist control mode 的最终 UI / prompt binding；
- 首个 Gate B 插件；
- Source Fidelity manifest 是否需要；
- DSH Developer Preview breaking changes 的适配成本。

---

## 16. Decision Ledger

- **DEC-P01｜Product Identity**：Reference Host = DSH；不自建独立 Agent Runtime。
- **DEC-P02｜Core Value**：World Core + Persistent World + RPG Plugins 系统性游戏化 DSH。
- **DEC-P03｜World vs Story**：Persistent World + Player Spotlight。
- **DEC-P04｜Model Freedom**：Freedom Before Prevention；Prefer Recovery over Prevention。
- **DEC-P05｜Player Attempt**：玩家拥有尝试权；世界拥有结果解释权；GM 负责后果可玩性。
- **DEC-P06｜Core Journey**：开始 → 自由游玩 → 自动持久化 → 离开 → 全新 Session 恢复 → 继续。
- **DEC-P07｜First Vertical**：三国 Source 初始条件 + 原创玩家；游戏现实优先于默认历史轨迹。
- **DEC-P08｜Reality Acceptance**：先 Gate A，再用 RPG Plugin 证明 Gate B。
- **DEC-P09｜Dynamic Durable Identity**：重要性决定模拟 / 注意力资源，不决定已形成 durable identity 的实体是否存在。
- **DEC-P10｜RPG UI Semantics**：Chat 展示机制事件；UI 承载机制当前状态；UI 不成为第二事实源。
- **DEC-P11｜Agent Trace Presentation**：隐藏工作噪音，不限制 Agent read/write/tool 能力。
- **DEC-P12｜Agency Granularity**：主角操控粒度可配置；Player Agency 是授权边界，不是强制逐动作手操。
- **DEC-P13｜Meaningful Choice Boundary**：Compress dead time; stop at meaningful choice；授权范围可由模式和玩家自然语言动态调整。
- **DEC-P14｜Baseline-first Development**：Product Gate 后先执行 TW-00.5 Bare DSH Probe，再从真实缺口提炼 TW-01。

---

## 17. Product Definition Gate Result

**PASS — 2026-08-23**

Product Definition Gate 不因 TW-00.5 重新打开。

当前正式工作：

> **继续 Bare DSH Capability Probe，完成多场景、Source、历史偏离和全新 Session 恢复压力测试；随后仅根据真实证据实现 TW-01 Minimal World Core。**

`docs/ARCHITECTURE_CURRENT.md` 仍是可被真实试玩修正的 working architecture。
