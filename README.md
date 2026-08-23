# The World

> 一个以 **DeepSeek Harness + RPG 专用插件 + 持久世界工作区** 为核心的 Agent-native 长期 RPG 项目。

**当前状态：Stage 0 / Product Definition Gate PASS**  
**下一步：TW-01 / First Real Vertical**

The World 不自己重造一套 Agent Runtime。它以 **DeepSeek Harness（DSH）** 为 Reference Host，利用 DSH 的 Agent、Provider、工具、Session、插件和 UI 扩展基础，把通用 Agent 系统性地游戏化。

产品核心不是“几个文件夹”，而是：

```text
DeepSeek Harness
+
World Core 游戏模式
+
真实持续的世界
+
长期 state / story / memory / saves
+
RPG UI / Map / Mechanics 等专用插件
=
可长期游玩的 AI RPG 游戏环境
```

本项目与 SillyTavern 并行，不自动继承其 Runtime / DB / typed mutation / protocol 路线。

---

## 1. Product Core

### Primary Purpose

让 DeepSeek Harness 中的优秀模型成为一个能够长期主持、维护和恢复同一个持续世界的 AI GM，并通过 RPG 专用插件逐步获得传统游戏级的机制、可视化和沉浸体验。

### Core Value

- 真实持续、会积累历史的世界；
- 跨全新 Agent Session 仍能继续；
- 持续存在的人物、地点、关系、势力、承诺与后果；
- 不明显牺牲优秀模型原有的创造力、主动性和自由度；
- World Core 稳定承载游戏模式、上下文与工作区维护；
- UI、地图、战斗、政治、经济等 RPG 插件可以直接增强游戏价值。

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

The World 必须证明自己比这个基线更值得长期玩，而不是只证明 DSH 本身适合玩 RPG。

完整 current 产品事实见 [`docs/PRODUCT_SPEC_CURRENT.md`](docs/PRODUCT_SPEC_CURRENT.md)。

---

## 2. 核心游戏原则

### Persistent World + Player Spotlight

> **世界独立存在，叙事聚光灯照向玩家。**

世界不会因为玩家没有关注就停止存在，但 GM 应主动把有意义、有戏剧性的冲突、人物和机会尽量组织到玩家能够感知和参与的舞台上。

`Persistent != Fully Simulated`：不要求所有 NPC 和势力每回合机械 tick。

### Unlimited Attempt, Consequence-bound World

玩家可以尝试任何游戏内行为。

```text
玩家决定：我尝试什么
世界决定：产生什么后果
GM 负责：让后果尽可能继续值得玩
```

玩家拥有行动尝试权，不拥有结果控制权。

### Model Freedom + Cheap Reversibility

The World 默认不为了防止理论模型错误，预建审批器、typed mutation、重型状态机或大规模 Guardrail。

> **Freedom Before Prevention**  
> **Prefer recovery over prevention**

低成本错误优先通过撤回、重答、修正、Restore 解决。

World Core 提供稳定的游戏模式、必要上下文和文件职责，但不是限制 GM 创造力的控制流水线。

---

## 3. Repository Architecture

```text
the-world/
├─ README.md
├─ AGENTS.md
│
├─ docs/
│  ├─ PRODUCT_SPEC_CURRENT.md
│  └─ ARCHITECTURE_CURRENT.md
│
├─ plugins/
│  └─ README.md
│
├─ library/
│  ├─ worlds/
│  ├─ characters/
│  ├─ mechanics/
│  └─ lore/
│
├─ games/
│  ├─ README.md
│  └─ _template/
│     ├─ README.md
│     ├─ state/
│     ├─ story/
│     ├─ memory/
│     └─ saves/
│
└─ tools/
   └─ README.md
```

### `plugins/`

The World 面向 DeepSeek Harness 的 RPG 专用插件。

- World Core：TW-01 Shared Foundation；
- RPG UI / Map / Mechanics：后续产品体验层。

这些能力可以由**产品价值**直接驱动。

### `library/`

可复用 Source Assets。单局游戏不得反向污染。

### `games/<game-id>/state/`

回答“这局现在真实是什么”，是 game-local current truth 的主要 Owner。

### `story/`

重要历史、转折、承诺、后果和 unresolved hooks。

### `memory/`

上下文压缩 / retrieval layer，不是 current truth。

### `saves/`

明确可恢复的游戏现场。

### `tools/`

窄而确定性的支持工具。若主要用于防模型错误，默认由真实重复失败驱动；若是游戏机制本身，可被 RPG 插件消费。

完整 working architecture 见 [`docs/ARCHITECTURE_CURRENT.md`](docs/ARCHITECTURE_CURRENT.md)。

---

## 4. Core Player Journey

```text
选择世界 / 角色
↓
开始游戏
↓
World Core 进入游戏模式
↓
自由游玩
↓
Agent 后台维护必要世界事实
↓
离开
↓
开启没有旧聊天上下文的新 DSH Session
↓
继续游戏
↓
自动恢复同一个世界
```

玩家主要负责玩，不负责手工维护状态表、memory 或项目文件。

---

## 5. Stage 0 Reality Gates

### Gate A — World Core Viability

必须真实证明：

1. 玩家想继续玩；
2. World Core 不明显降低 GM 能力；
3. 全新 DSH Session 能恢复同一个世界；
4. 玩家行为、NPC 行动和离屏变化具有长期因果；
5. Agent 自主维护工作区，玩家不是 QA Bot。

### Gate B — RPG Specialization Value

Gate A 通过后，至少用一个 RPG 专用插件证明：

> DSH 插件体系可以让体验从“在 Agent 里聊 RPG”明显推进为“更像真正的 RPG”，而不用重造 Agent Runtime。

---

## 6. TW-01｜First Real Vertical

第一局采用：

> **184 年前后真实三国世界初始条件 + 原创玩家角色。**

历史资料只定义起始世界；游戏开始后的 game-local reality 优先。玩家可以改变历史，已经发生的分叉不得为了贴回史实被自动修正。

第一条纵向优先验证：

- 原创玩家 / NPC；
- 持续关系或承诺；
- 多地点；
- 离屏世界变化；
- 延迟后果；
- 历史分叉；
- 全新 Session 恢复。

这是语义压力，不是固定回合数 KPI。

---

## 7. 当前明确不做

Stage 0 不预先建设：

- 独立 Agent Runtime；
- 通用 Provider 层；
- 复制 SillyTavern Runtime；
- 万能 Schema / Asset DSL / Protocol；
- 数据库事务平台；
- 全量后台世界模拟；
- 为理论错误设计的大规模预防性 Guardrail；
- 为 DSH 内部实现做深 fork。

DeepSeek Harness 当前处于 Developer Preview。The World 采用 **DSH-native, not DSH-internal-coupled**：上游 API 可以迁移，长期世界与存档语义尽量保持稳定可移植。

---

## 8. Project Truth & AI Collaboration

正式工作优先读取：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ 当前 game / plugin / asset 的直接 Owner
```

跨项目方法论与 Skill 按需读取 current：

- [`zhangchenjia21-dot/Vibe-Coding`](https://github.com/zhangchenjia21-dot/Vibe-Coding)
- [`zhangchenjia21-dot/Skill`](https://github.com/zhangchenjia21-dot/Skill)

---

## 9. Public Repository Safety

本仓库当前是 **public**。

不得提交 API Key、Token、Cookie、密码、私钥、私密聊天原文、不希望公开的个人信息，以及无权公开的版权 / 保密材料。

---

## 10. Current Decision

**Product Definition Gate：PASS（2026-08-23）**

现在不再继续扩展抽象产品讨论或预设计平台能力。

下一步：

> **TW-01｜用 DeepSeek Harness + 最小 World Core + 三国原创玩家真实开玩。**