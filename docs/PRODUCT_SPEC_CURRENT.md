---
title: The World｜产品与实验总纲
status: current-canonical-product-spec
version: 0.2
updated: 2026-08-23
stage: Stage 0 / Product Definition Gate PASS
next: TW-01 / First Real Vertical
reference_host: DeepSeek Harness
---

# The World｜产品与实验总纲 CURRENT

## 0. Product Identity

### Primary Purpose / Job To Be Done

把 **DeepSeek Harness** 从一个通用 Agent Harness，变成一个专门面向长期 RPG 的游戏环境：让优秀模型能够主持一个真实持续、可长期演化、可跨 Session 恢复的 AI 世界，同时逐步通过 RPG 专用插件获得更强的游戏机制、可视化与沉浸式体验。

### Reference Host

The World 第一公民宿主固定为 **DeepSeek Harness（DSH）**。

DSH 负责通用 Agent 基础设施，包括其现有的 Agent loop、Provider / Model 接入、通用工具、Session、插件生命周期和 UI 扩展基础；The World 默认不重新实现一套独立 Agent Runtime。

The World 负责 RPG 特有的：

- World Core 游戏模式；
- 世界 / 角色 / 机制 / lore 资产；
- game-local 持久世界；
- state / story / memory / saves；
- GM 行为与长期世界维护规范；
- RPG UI、地图、机制等专用插件能力。

### Product Core

The World 的核心不是“几个文件夹”，也不是“给 Agent 加一个记忆模块”。

核心产品是：

> **RPG-specialized DeepSeek Harness experience。**

文件系统是长期世界的持久化基础；DSH 插件体系是把通用 Agent 游戏化的主要扩展载体。

---

## 1. Core Value

玩家选择 The World，而不是直接对一个通用 Agent 说“主持一局 RPG”，是为了得到：

- 一个真实持续、会积累历史的世界；
- 跨长上下文 / 跨全新 Agent Session 仍能继续的长期游戏；
- 持续存在的人物、地点、关系、势力、承诺与后果；
- 不明显牺牲优秀模型原有创造力、角色表现、主动性和自然语言自由度的 GM；
- 由 World Core 稳定承载的游戏流程、上下文恢复与文件管理职责；
- 未来由 UI、地图、战斗、政治、经济、成长等 RPG 专用插件带来的更强“游戏感”和沉浸感。

产品价值可以概括为：

> **真实持续的 AI 世界 + 优秀自由的 AI GM + RPG 专用游戏化能力。**

### Simple Baseline

现实基线不是“没有文件能力的普通聊天 AI”，而是：

```text
DeepSeek Harness
+
同一 Provider / Model
+
一个简单长期 RPG 主持要求
+
允许 Agent 自己按需使用文件
```

The World 若长期在继续游玩欲望、创造力、角色表现、场景推进、世界主动性或玩家自由度上明显劣于这个基线，则即使状态更整齐、工程更复杂也不能宣布成功。

The World 还必须证明自己提供了 DSH 本身之外的 RPG 产品价值，而不仅仅证明“DSH 很适合玩 RPG”。

---

## 2. Target User

Stage 0 唯一必须服务好的用户：**Project Owner / 实际玩家**。

第一阶段接受玩家直接在 DeepSeek Harness 环境中游玩，不假设必须先满足普通 Steam / 手机玩家的零技术门槛。

未来可以通过 RPG UI / Launcher 等插件降低入口成本，但它们建立在 The World Core 已经成立的前提上。

---

## 3. Product Promise

玩家应进入一个：

- 世界会主动发生事情；
- NPC 和势力拥有独立行动与持续身份；
- 玩家可以用自然语言尝试任何行动；
- 世界不会为了玩家自动放弃自身因果和合理性；
- 玩家行为会产生可信、可延迟、可累积的后果；
- GM 会主动把有意义、有戏剧性的舞台尽量带到玩家身边；
- 失败也尽量产生新的处境、选择和值得继续玩的内容；
- 跨 Session 后仍能恢复为“同一个世界”，而不是重新生成一个相似故事；
- 工作区主要由 Agent 自主管理，玩家主要负责玩。

核心叙事原则：

> **世界独立存在，叙事聚光灯照向玩家。**

> **世界产生历史，GM 从中为玩家组织故事。**

---

## 4. Core Experience / Core User Journey

标准玩家路径：

```text
选择世界 / 扩展内容
↓
选择或创建角色
↓
开始游戏
↓
World Core 进入游戏模式并恢复 / 组装必要上下文
↓
GM 主持真实持续世界
↓
玩家自由行动
↓
世界给出后果并继续演化
↓
Agent 在后台维护必要 state / story / memory / saves
↓
玩家离开
↓
在没有旧聊天上下文的全新 DSH Session 中选择继续游戏
↓
World Core 从工作区恢复现场
↓
继续同一个世界
```

玩家不应被要求理解或手工维护 `state/`、`story/`、`memory/` 等内部工作区。

新游戏应尽快进入一个可互动、有张力的现场，不用大量配置问题或背景说明阻塞开玩。

---

## 5. World & Player Semantics

### 5.1 Persistent World + Player Spotlight

The World 是 **Persistent World RPG**，不是即时故事生成器，也不是必须逐实体持续 tick 的全量世界模拟器。

- 世界在玩家视野之外仍保持因果连续；
- NPC、势力、地点与冲突不会因为玩家没有关注就失去存在；
- GM 根据时间、因果、人物目标和世界局势判断哪些离屏变化应当发生；
- 不要求计算所有无关细节；
- GM 应主动寻找能与玩家形成选择、冲突、机会和后果的精彩舞台。

正式原则：

```text
Persistent != Fully Simulated
World Independence + Player Spotlight
```

### 5.2 Unlimited Attempt, Consequence-bound World

玩家拥有**行动尝试权**，而不是结果控制权。

理性、疯狂、愚蠢、冲动、荒诞或高风险行为都不应因为“不符合预设玩法”而被产品层直接拒绝。

```text
玩家决定：我尝试做什么
世界决定：这会产生什么后果
GM 负责：让后果尽可能继续产生值得玩的内容
```

GM 不需要保护玩家计划成功，但应尽量保护游戏的继续价值。

### 5.3 Player Agency

Agent 可以主动推进 NPC、世界、环境和事件，但不得替玩家：

- 做未输入的关键选择；
- 说未表达的话；
- 答应承诺；
- 执行玩家未决定的不可逆行为。

世界主动性与玩家自主权必须同时成立。

---

## 6. Model Freedom & Recovery Philosophy

The World 默认信任模型承担主持、世界推进、上下文理解和游戏工作区维护，不针对“模型理论上可能犯错”预先建设大规模审批、权限门、typed mutation、严格状态机或强制校验体系。

低成本、可感知、可恢复的模型错误默认采用：

```text
发现
→ 撤回 / 修正 / 重新生成 / Restore
→ 继续游戏
```

一级原则：

> **Freedom Before Prevention.**

> **Prefer recovery over prevention.**

World Core 可以稳定提供游戏模式、每轮必要上下文、GM 原则和文件职责，但它的目的首先是**协调和帮助模型高质量主持**，不是把模型变成被审批流水线控制的执行器。

未来确定性能力可以存在，但必须区分两种来源：

1. **Product-value capability**：本身让游戏更好玩、更沉浸或提供新机制，例如 RPG UI、地图、骰子、战斗、政治系统；可以由产品价值直接驱动。
2. **Preventive guardrail / infrastructure**：主要为了防止模型出错，例如 validator、typed mutation、事务层；默认必须由真实重复失败驱动。

---

## 7. Functional Requirements

Stage 0 / First Vertical 必须能够：

1. 在 DeepSeek Harness 中进入明确的 The World 游戏模式；
2. 由 World Core 为游戏回合提供稳定的必要上下文、GM 行为和工作区职责；
3. 读取可复用世界 / 角色 / 机制 / lore Source；
4. 建立独立 game-local world reality；
5. 让 Agent 主动主持世界，而不是等待玩家自行编剧情；
6. 允许玩家用自然语言尝试任意游戏内行动，并由世界产生后果；
7. 持久化未来仍有价值的 state / story / memory；
8. 创建或利用明确的恢复点语义；
9. 在全新 DSH Session 中恢复并继续同一个游戏；
10. 保持 Repository Total Knowledge 与 Current Turn Context 分离；
11. 为后续 RPG UI / Map / Mechanics 等插件保留清晰扩展 Owner，而不自建第二套 Agent Runtime。

---

## 8. Non-functional Requirements

- **GM Quality**：The World 不得长期明显降低基线模型的创造力、角色表现、主动性、响应自由度和剧情节奏。
- **Play-first**：内部工作区维护应尽量对玩家不可见；玩家不应成为状态管理员。
- **Recoverability**：单次模型错误应优先能够廉价撤回、重答、修正或恢复。
- **Long-session Context**：游戏历史增长不等于每轮上下文增长。
- **World Continuity**：原创人物、关系、承诺和偏离 Source 的历史必须能跨 Session 继续。
- **Host Boundary**：DSH-native，但尽量不把长期 game data 绑定到 DSH 易变化的内部实现细节。
- **Public Repo Safety**：公开仓库不得写入秘密、私密个人内容或无权公开材料。

DeepSeek Harness 当前处于 Developer Preview 且官方明确提示可能发生兼容性破坏，因此 DSH 集成层可以适配上游变化，但长期世界资产和 game-local truth 应尽量使用稳定、可迁移的产品语义。

---

## 9. Domain Semantics & Ownership

### DeepSeek Harness Host

通用 Agent Host / Plugin Runtime。The World 的 Reference Host，不属于 The World game truth。

### RPG Plugin

为 DSH 提供 The World 专用行为或体验的插件。

Owner：`plugins/`。

包括：

- World Core；
- RPG UI；
- Map / Visualization；
- Mechanics / Expansion capabilities。

### Source Asset

开始一局前存在、可跨 game 复用的世界、角色、机制、资料。

Owner：`library/`。

### Game-local Canonical State

只属于某一局、会随游戏正式演化的当前世界事实。

Owner：`games/<game-id>/state/`。

### Story Ledger

值得长期追溯的历史、承诺、重要后果和 unresolved hooks。

Owner：`games/<game-id>/story/`。

### Agent Memory

为了高质量恢复上下文而生成的 lossy compression / retrieval layer，不是 current world truth。

Owner：`games/<game-id>/memory/`。

### Save

一个明确可恢复到的游戏现场。

Owner：`games/<game-id>/saves/`。

### Deterministic Support Tool

窄、可复用的确定性支持能力。若主要目的是修复模型错误，则遵循 Failure-driven Tooling；若它是某个 RPG 机制的一部分，可由对应插件消费。

Owner：`tools/`。

---

## 10. Stage 0 Scope

### Must Have / Gate A — World Core Viability

- DeepSeek Harness 作为实际 Reference Host；
- 最小可用 World Core 游戏模式；
- 清晰 repository / folder ownership；
- Source 与 Game-local Reality 分离；
- 第一套真实 game workspace；
- 真实持续试玩；
- 至少一次完全全新 DSH Session 的恢复继续；
- 与裸 DSH RPG baseline 的实际体验比较。

### Gate B — RPG Specialization Value

在 Gate A 成立后，至少验证一个真正的 RPG 专用体验 / 机制插件，证明 DSH 插件体系可以在不重造 Agent Runtime 的情况下明显增强：

- 游戏化；
- 沉浸感；
- 可视化；
- 机制深度；
- 或传统 RPG 交互体验。

### Deferred from TW-01, not from Product Direction

- 完整 RPG UI；
- 地图与复杂可视化；
- 深战斗 / 政治 / 经济 / 成长机制；
- 扩展包生态；
- 通用创作工具与自动导入。

这些不是因为“失败”才允许存在，而是等待 World Core 最小纵向先证明核心体验。

### Non-scope for First Spike

- 自建独立 Agent Runtime；
- 自建通用 Provider 层；
- 复制 SillyTavern Runtime；
- 为所有未来资产冻结万能 Schema / DSL / Protocol；
- 提前建设数据库事务平台；
- 自动连续后台全世界模拟；
- 为理论模型错误预建大规模 Guardrail；
- 用工程测试替代真实游玩判断。

---

## 11. First Real Vertical｜TW-01

第一条真实纵向采用：

> **真实三国历史世界初始条件 + 原创玩家角色。**

推荐时间点：184 年黄巾起义前后。

原因：该世界天然包含多 NPC、多地点、多势力、政治、战争、旅行、长期关系与世界事件，同时原创玩家经历无法依赖模型训练记忆伪装成持久化成功。

正式语义：

- 历史 / Source 只定义游戏开始时的 canonical starting condition；
- 游戏开始后，game-local reality 优先于历史资料；
- 玩家可以改变历史；
- 已发生的分叉不得为了贴回史实被自动“修正”。

第一条 Vertical 应尽快自然覆盖：

- 原创玩家；
- 原创 NPC；
- 持续关系或承诺；
- 至少两个地点；
- 一次离屏世界变化；
- 一次延迟后果；
- 一次明显历史分叉；
- 一次全新 Session 恢复。

这是语义压力清单，不是固定回合数 KPI。

---

## 12. Product Reality Acceptance

### Gate A — World Core Viability

核心成立至少需要真实证明：

1. **Want to Continue**：玩家实际产生继续游玩的欲望；
2. **GM Quality Preserved**：World Core 不使优秀模型明显变机械、保守或无趣；
3. **Cross-session Same World**：全新 Session 能恢复为同一个持续世界；
4. **Persistent Causality**：玩家行为、NPC 行动和离屏变化能形成可信长期因果；
5. **Player Plays, Agent Maintains**：玩家不需要长期充当文件 / 状态管理员。

### Baseline Comparison

使用同一 DSH、同一 Provider / Model、同等级内容进行裸 DSH RPG 与 The World 比较。

关键问题不是打分表是否漂亮，而是：

> **哪个更让实际玩家愿意继续玩？为什么？**

同时检查 The World 是否获得更强连续性，却牺牲了自由度、创造性或戏剧性。

### Gate B — RPG Specialization Value

至少一个 RPG 专用插件应证明：

> The World 可以利用 DSH 插件体系，把“在 Agent 聊天框里玩 RPG”明显推进为“更像真正 RPG 的体验”。

单次、低成本、可撤回 / 重答 / 恢复的模型错误不构成产品失败；反复破坏核心体验的系统性问题才推动新的工程约束。

---

## 13. Open Questions / Blockers

### Blocking

**None.**

当前没有会实质改变 Primary Purpose、主玩家路径、Reference Host、Folder Ownership、世界语义或 Stage 0 验收方法的 unresolved blocker。

### Non-blocking / Resolve During TW-01+

- TW-01 使用的具体 Provider / Model；
- World Core 在当前 DSH 版本中采用的最合适正式 extension seam；
- World Core 最小插件包结构与配置方式；
- Save / Undo / Regenerate / Restore 的第一版具体实现；
- Gate B 首个体验插件选择 RPG UI、Map 还是其它机制；
- 资产何时需要最小 manifest；
- DSH Developer Preview breaking changes 的实际适配成本。

这些问题通过真实实现与试玩收敛，不阻塞 Product Definition Gate。

---

## 14. Decision Ledger｜Stage 0 Product Closure

- **DEC-P01｜Product Identity**：选择 Agent-native 路线 A；Reference Host = DeepSeek Harness；不自建独立 Agent Runtime。
- **DEC-P02｜Core Value**：通过 DSH 专用 RPG 插件把通用 Agent 系统性游戏化；World Core / UI / Map / Mechanics 是主要扩展方向。
- **DEC-P03｜World vs Story**：Persistent World + Player Spotlight；世界独立存在，GM 把聚光灯照向玩家。
- **DEC-P04｜Model Freedom**：Freedom Before Prevention；优先 Cheap Reversibility，而不是预防性束缚模型。
- **DEC-P05｜Player Attempt**：玩家可以尝试任何游戏内行为；世界提供可信后果；GM 尽量让后果值得继续玩。
- **DEC-P06｜Core Journey**：开始 → 自由游玩 → 自动持久化 → 离开 → 全新 Session 自动恢复 → 继续。
- **DEC-P07｜First Vertical**：三国真实世界初始条件 + 原创玩家；历史是起点，不是剧本。
- **DEC-P08｜Reality Acceptance**：先证明 World Core Viability，再证明至少一个 RPG Specialization Plugin 的增益。

---

## 15. Product Definition Gate Result

**PASS — 2026-08-23**

当前产品核心、主用户路径、Simple Baseline、Stage 0 Scope、关键语义、硬约束、Success / Acceptance 与最早 Reality Check 已足够明确。

下一步不再继续扩展产品讨论或预设计平台能力，正式进入：

> **TW-01｜First Real Vertical**

`docs/ARCHITECTURE_CURRENT.md` 仍是可被真实试玩修改的 working architecture；Product Definition Gate PASS 不等于技术架构已经被证明。