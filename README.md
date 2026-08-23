# The World

> 一个以 **DeepSeek Harness + RPG 专用插件 + 持久世界工作区** 为核心的 Agent-native 长期 RPG 项目。

**当前状态：Stage 0 / Product Definition Gate PASS / TW-00.5 Bare DSH Capability Probe 进行中**  
**下一步：继续完成 Bare DSH 压力试玩 → 提炼最小真实缺口 → TW-01 Minimal World Core**

The World 不自己重造一套 Agent Runtime。它以 **DeepSeek Harness（DSH）** 为 Reference Host，利用 DSH 的 Agent、Provider、工具、Session、插件和 UI 扩展基础，把通用 Agent 系统性地游戏化。

产品核心不是“几个文件夹”，而是：

```text
DeepSeek Harness
+
World Core RPG Game Mode
+
Persistent World Workspace
+
RPG Experience / Mechanics Plugins
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
- World Core 稳定承载游戏模式、上下文恢复与长期世界维护；
- UI、地图、战斗、政治、经济、成长等 RPG 插件可以直接增强游戏价值。

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

## 2. 当前已验证成果｜Bare DSH Probe

当前实验分支：`TEST`。完整证据记录见 [`docs/experiments/BARE_DSH_CAPABILITY_PROBE.md`](docs/experiments/BARE_DSH_CAPABILITY_PROBE.md)。

### 已出现的正向能力

- **GM 文笔与自由度**：裸 DSH 的叙事表现明显比此前高限制方案更自然、更有发挥空间；
- **自发持久化**：没有 World Core 时，DSH 已能自行建立 `world_state / player_character / npc_relations / factions / locations / session_log` 等工作文件；
- **GM Authority**：玩家的主观判断不会自动变成世界事实，Agent 会独立裁定后果；
- **自然语言机制执行**：人物能力、交涉、成长等扩展资产已经能直接参与 adjudication；
- **玩家状态维护**：玩家技能、伤势、地点、成长等 durable state 已表现出较稳定写回；
- **Player Spotlight**：Agent 能把玩家表达的需求转译为世界内合理机会，而不必机械投放名人或标准答案；
- **动态角色创造**：Agent 能创造与当前时代、身份、剧情规模相称的原创人物，并利用前文伏笔形成连续叙事；
- **Source Character 利用潜力**：试玩已开始出现把低层级三国题材人物自然组织进当前剧情的能力，后续继续测试 Source Fidelity 与历史分叉。

### 已明确的真实缺口

1. **Agent Trace Noise**：`think/read/write/tool` 大量暴露，破坏 RPG 沉浸；
2. **Save / Rollback**：当前 workspace 主要保存 latest state，不等于玩家级 checkpoint / rollback；
3. **Persistent RPG UI**：系统、任务、人物、地图等长期状态不能只靠翻聊天记录；
4. **Dynamic Entity Persistence**：运行中生成并形成持续关系的 NPC 会被剧情使用，却可能没有进入长期 NPC state；
5. **Agency Granularity**：GM 有时会从一个宏观意图一次推进过多个本可玩的节点；这不应简单禁止，而应发展为可选择的主角操控粒度；
6. **Epistemic Boundary / Knowledge Provenance**：GM / Source / System 可访问的知识可能被错误投射为 NPC 自身知识，例如 NPC 无来源知道未来历史人才流向。正式语义：`GM / Source / System knows X != NPC knows X`。详见 [`docs/experiments/GAP_06_EPISTEMIC_BOUNDARY.md`](docs/experiments/GAP_06_EPISTEMIC_BOUNDARY.md)。

### 当前不急着修的观察项

- **Player Desire Accommodation Bias**：玩家表达“需要谋士/武将”等需求后，GM 是否会长期退化成“按需供货”；当前只观察，不加限制；
- **Source Fidelity**：正史 / 演义 / 原创素材边界如何声明与消费；等真实 Source 使用继续积累证据；
- **state / history 重叠**：玩家文件与 session log 是否会随长局产生重复膨胀；继续观察真实增长。

---

## 3. 核心游戏原则

### Persistent World + Player Spotlight

> **世界独立存在，叙事聚光灯照向玩家。**

世界不会因为玩家没有关注就停止存在，但 GM 应主动把有意义、有戏剧性的冲突、人物和机会尽量组织到玩家能够感知和参与的舞台上。

```text
Persistent != Fully Simulated
```

重要性决定叙事注意力与离屏模拟资源，不决定一个已经形成 durable identity 的人物或事实是否存在。

### Knowledge Provenance / Epistemic Boundary

> **GM / Source / System knows X != NPC knows X.**

NPC 的判断应来自世界内合理来源，例如自身经历、身份、可观察事实、被告知内容、传闻或合理推断。GM 后台事实、玩家系统私有信息、穿越者知识和尚未发生的未来历史，不能无来源地借 NPC 的嘴说出来。

这不是要求复杂权限系统；TW-01 优先测试一条极薄的知识边界 guidance 是否足够稳定。

### Unlimited Attempt, Consequence-bound World

玩家可以尝试任何游戏内行为。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

玩家拥有行动尝试权，不拥有结果控制权。

### Configurable Protagonist Control

Player Agency 不等于要求玩家操作每一个小动作。

The World 当前产品方向允许玩家选择主角操控粒度，例如：

- **完全操控**：关键与多数主角行动由玩家明确决定；
- **轻度托管**：GM 可依据玩家既定意图、角色卡和已形成性格自动处理低风险、低信息价值的小动作；
- **叙事托管**：玩家主要做战略与重大抉择，GM 可自动演绎更大段过程。

共同原则：

> **Compress dead time; stop at meaningful choice.**

玩家应能随时重新接管或临时扩大 / 缩小授权范围。

### Model Freedom + Cheap Reversibility

The World 默认不为了防止理论模型错误，预建审批器、typed mutation、重型状态机或大规模 Guardrail。

> **Freedom Before Prevention**  
> **Prefer recovery over prevention**

低成本错误优先通过 Undo、Regenerate、修正、Restore 解决。

---

## 4. RPG UI Product Direction

当前已经明确：

> **Chat 展示机制事件；UI 承载机制当前状态。**

聊天适合展示机制触发、判定、叙事过程和即时后果；长期 UI 应负责随时查看：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

UI 是 game truth 的投影，不应成为第二事实源。

同时：

> **隐藏工作噪音，不限制 Agent 工作能力。**

Agent 仍可自由 `read/write/tools`，只是 RPG 主界面默认不把这些执行轨迹混入叙事主流。

---

## 5. Repository Architecture

```text
the-world/
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ PRODUCT_SPEC_CURRENT.md
│  ├─ ARCHITECTURE_CURRENT.md
│  └─ experiments/
├─ plugins/
├─ library/
├─ games/
└─ tools/
```

- `plugins/`：World Core、RPG UI、Map、Mechanics；
- `library/`：可复用 Source Assets；
- `games/<game-id>/state/`：当前 game-local canonical reality；
- `story/`：重要历史、承诺、后果与 unresolved hooks；
- `memory/`：上下文压缩 / retrieval layer；
- `saves/`：明确可恢复的游戏现场；
- `tools/`：窄而确定性的支持能力。

完整 working architecture 见 [`docs/ARCHITECTURE_CURRENT.md`](docs/ARCHITECTURE_CURRENT.md)。

---

## 6. Current Development Route

```text
Product Definition Gate PASS
        ↓
TW-00.5 Bare DSH Capability Probe   ← 当前
        ↓
确认 DSH 天然能力 / 真实缺口
        ↓
TW-01 Minimal World Core
        ↓
Reality Gate A
        ↓
RPG UI / Map / Mechanics Plugin
        ↓
Reality Gate B
```

TW-00.5 不重新打开 Product Definition Gate。它的作用是避免在开发前凭想象建设 DSH 本来已经会做的能力。

下一批关键压力测试：

- 多场景长期连续性；
- 动态 NPC / 承诺 / 势力 / 地点的 durable persistence；
- NPC knowledge provenance / epistemic boundary；
- Source 角色卡消费；
- 三国题材 Source Fidelity；
- 历史事件与历史偏离；
- 全新 DSH Session 的无旧聊天恢复。

---

## 7. Reality Gates

### Gate A — World Core Viability

必须真实证明：

1. 玩家想继续玩；
2. World Core 不明显降低 Bare DSH 已表现出来的 GM 能力；
3. 全新 DSH Session 能恢复同一个世界；
4. 玩家行为、NPC 行动和离屏变化具有长期因果；
5. Agent 自主维护工作区，玩家主要负责玩。

### Gate B — RPG Specialization Value

Gate A 通过后，至少用一个 RPG 专用插件证明：

> DSH 插件体系可以让体验从“在 Agent 里玩 RPG”明显推进为“更像真正的 RPG”，而不用重造 Agent Runtime。

---

## 8. 当前明确不做

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

## 9. Project Truth & AI Collaboration

正式工作优先读取：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ docs/experiments/BARE_DSH_CAPABILITY_PROBE.md（实验相关）
→ 当前 game / plugin / asset 的直接 Owner
```

---

## 10. Current Decision

**Product Definition Gate：PASS（2026-08-23）**

当前不要提前收紧模型，也不要因为某次漂亮表现就宣布 World Core 不需要。

现在正在做的是：

> **继续 Bare DSH 真实试玩，尽可能完整测出强模型 + DSH 的自然上限；只把真实、影响体验且值得产品承担的缺口带入 TW-01。**
