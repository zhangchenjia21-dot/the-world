# The World｜Agent 协作与仓库规则

状态：current  
适用范围：整个 `the-world` 仓库

## 1. 项目定位

`the-world` 是一个以 **DeepSeek Harness（DSH）为 Reference Host** 的 Agent-native 长期 RPG 项目。

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

The World 默认不重造独立 Agent Runtime，也不得自动继承 SillyTavern 的 Runtime、数据库、typed mutation、协议或历史约束。

当前阶段：

```text
Product Definition Gate PASS
↓
TW-00.5 Bare DSH Capability Probe   ← CURRENT
↓
TW-01 Minimal World Core
↓
Reality Gate A
↓
RPG Experience / Mechanics Plugin
↓
Reality Gate B
```

## 2. 当前产品原则

正式工作不得偏离：

- **Persistent World + Player Spotlight**：世界独立存在，但 GM 主动把有意义的舞台组织到玩家身边；
- **Persistent != Fully Simulated**：不要求所有实体持续逐回合 tick；
- **Durable Identity**：重要性决定注意力 / 模拟资源，不决定已经形成 durable identity 的实体是否存在；
- **Unlimited Attempt, Consequence-bound World**：玩家可以尝试任何游戏内行为，世界负责可信后果；
- **Player Agency = Authorization Boundary**：GM 不得把宽泛意图扩大成未授权的重大承诺 / 路线 / 不可逆选择；
- **Configurable Protagonist Control**：允许 Full Control / Light Delegation / Narrative Delegation 等操控粒度；
- **Meaningful Choice Boundary**：`Compress dead time; stop at meaningful choice.`；
- **Model Freedom**：默认不因理论错误建设大规模审批、typed mutation 或严格状态机；
- **Recovery First**：低成本错误优先 Undo / Regenerate / 修正 / Restore；
- **Player Plays, Agent Maintains**：玩家主要负责玩，Agent 负责工作区维护；
- **Chat + UI**：Chat 展示机制事件，Persistent UI 承载机制当前状态；
- **UI Truth Boundary**：UI 是 game truth 投影，不成为第二事实源；
- **Hide Work Noise**：隐藏 Agent `think/read/write/tool` 噪音，但不限制 Agent 工作能力；
- **DSH-native, not DSH-internal-coupled**：利用 DSH 正式 extension seams，不把长期 game data 绑死到易变内部实现。

产品事实以 `docs/PRODUCT_SPEC_CURRENT.md` 为准。

## 3. 权威顺序

发生冲突时按：

1. 用户当前明确指令；
2. `docs/PRODUCT_SPEC_CURRENT.md`；
3. `docs/ARCHITECTURE_CURRENT.md`；
4. 当前 game 的 canonical state；
5. 当前 game 的 story / memory；
6. `README.md`；
7. Bare DSH experiment evidence（仅用于实验事实，不覆盖 canonical product decisions）；
8. 跨项目方法论 / Skill；
9. 历史聊天、旧摘要、旧附件与模型记忆。

通用方法论与本项目明确产品裁定冲突时，以本项目 current Product Spec 为准。

## 4. 正式任务前读取

只读取完成当前任务所需的最小充分工作集：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ 当前 game / plugin / asset 的直接 Owner
```

实验相关再读取：

`docs/experiments/BARE_DSH_CAPABILITY_PROBE.md`

不要为了“更完整”每次全仓读取。

## 5. Freshness 与写回

新的正式任务、Stage / Reality Gate、重要 game fact 修改、plugin 开发或正式 Agent Task 开始前，先核验 GitHub `main` current。

写回前重新取得目标文件当前 SHA；禁止用旧副本覆盖并行更新。

发现新产品 / 架构决策后，不只在聊天中记住，还要检查是否需要写回：

- Product Spec；
- Architecture；
- 正确 Owner；
- Experiment Evidence；
- README / roadmap。

但不要把单次实验偶然行为直接提升成 canonical architecture。

## 6. Folder Ownership

### `docs/`

项目级 current 产品、工作架构与实验事实。

### `plugins/`

The World 面向 DSH 的 RPG 专用插件 Owner：

- World Core；
- RPG UI；
- Map / Visualization；
- Mechanics / Expansion Plugins。

产品价值型插件不要求先出现模型错误。

### `library/`

可复用 Source Assets。默认不被单局游戏反向污染。

### `games/<game-id>/state/`

当局 current world reality 的 canonical Owner。

### `games/<game-id>/story/`

重要历史、转折、承诺、后果与 unresolved hooks。

不是 current state 第二副本。

### `games/<game-id>/memory/`

上下文压缩 / retrieval layer。可重写，不覆盖 current truth。

### `games/<game-id>/saves/`

明确恢复点 / branch / snapshot 的语义 Owner。

### `tools/`

窄而确定性的支持工具。

若主要用于防模型 / 文件错误，默认由真实重复失败驱动；若是游戏机制的一部分，可被 `plugins/` 消费。

## 7. World Core Boundary

World Core 是 TW-01 Shared Foundation。

Bare DSH Probe 后，World Core 默认从**薄协调层**出发，而不是大型 RPG Runtime。

当前真实候选职责：

- game entry / continue / fresh-session recovery；
- 必要 GM / world / workspace context；
- dynamic durable entity / relationship / commitment / consequence 识别与写回；
- current protagonist control mode / authorization context；
- context retrieval 入口；
- necessary recovery / save coordination。

World Core 默认不应变成：

- narrative approval gate；
- typed mutation 强制流水线；
- “程序批准后事实才能存在”的 Commit Engine；
- 玩家行为白名单；
- 模型创作白名单；
- 每回合固定写全部 Owner；
- 全世界逐实体模拟器。

如果真实失败证明需要约束，只增加最窄边界。

## 8. Source 与 Game-local 隔离

- `library/` 是可复用起点；
- 单局新增人物、地点、关系、历史分叉进入当前 game；
- Source 更新是否影响已有 game 必须显式决定；
- Source / history 只定义开始前的 canonical condition；
- 游戏开始后的 game-local reality 优先；
- 已发生分叉不得为了贴回 Source 被静默修正。

如果世界资产混合正史 / 演义 / 原创，优先从 World Pack / Source 语义明确口径；不要由模型自行假定“历史真实性”的标准。

## 9. Persistent World & Durable Identity

```text
Persistent != Fully Simulated
```

Agent 可以让玩家视野外 NPC、势力和事件继续演化，但不要求全世界逐实体 tick。

一个动态实体一旦产生会影响未来的 durable fact，例如：

- 关系变化；
- 承诺 / 债务；
- 同伴 / 敌对；
- 持续伤情；
- 未来 hook / consequence；
- 重要已知信息；

就应进入 game-local reality。

> **Importance controls attention, not existence.**

未命名不等于无身份。

## 10. Player Attempt & Agency

玩家可以尝试任何游戏内行为，程序不得仅因为其疯狂、愚蠢、危险或不符合推荐路线而拒绝。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

### Authorization Boundary

GM 不得从一个宽泛玩家意图，自动推导出未授权的：

- 阵营加入；
- 重大承诺；
- 招募 / 接受投效；
- 重大资源使用；
- 不可逆路线；
- 高风险暴露；
- 其它 meaningful choice。

但这不等于禁止 GM 替主角处理所有小动作。

### Configurable Control

允许：

- Full Control；
- Light Delegation；
- Narrative Delegation；
- 玩家自然语言临时扩大 / 缩小授权。

共同原则：

> **Compress dead time; stop at meaningful choice.**

玩家可随时接管。

## 11. Model Freedom & Recovery

默认优先：

```text
Freedom Before Prevention
Prefer Recovery over Prevention
```

单次可见、低成本错误优先：

- Undo；
- Regenerate；
- Agent / 人工修正；
- Restore；
- Save branch。

不要因为理论风险，把 GM 创意、世界主动性和玩家自由一起锁死。

## 12. Chat / UI Boundary

正式体验原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

Persistent UI 典型 surfaces：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

UI 从 canonical state 投影，不自行维护第二套长期事实。

DSH Agent execution traces 默认应由 RPG UI 折叠 / 隐藏，同时保留 debug 入口。

## 13. Product-value Capability vs Failure-driven Guardrail

### Product-value Capability

RPG UI、Map、Combat、Politics、Economy、Character Progression 等若直接增加游戏价值，可直接按产品路线开发。

### Failure-driven Guardrail

validator、typed mutation、atomic writer、schema checker、duplicate detector 等若主要用于防错，至少确认：

1. 真实失败已经发生；
2. 失败反复或代价明显；
3. Undo / 修正 / Agent 自检不够；
4. 最窄确定性方案能解决；
5. 不显著损害核心体验。

禁止从“以后可能出错”直接推导重型 Runtime / DB / Protocol。

## 14. Context Growth

```text
Game History Growth
!= Agent Context Growth
```

默认恢复：

```text
game README
→ state/CURRENT
→ recent / unresolved memory
→ 当前相关 story / state
→ 必要 source
→ older history on demand
```

World Core 每轮必读不等于每轮全仓读取。

## 15. Durable Change Propagation

重要变化后判断是否影响：

- current state；
- dynamic entity state；
- story；
- unresolved hook；
- memory；
- save。

只更新真正受影响的 Owner。

不要为了“看起来完整”机械改写全部文件。

## 16. Markdown-first

第一阶段：

- 人 / Agent 共同理解内容 → Markdown 优先；
- 真正需要机器计算 / 校验 → 再结构化；
- 真正需要查询 / 原子性 / 并发 / 性能 → 再考虑 DB / Service。

格式服务产品，不反过来定义产品。

## 17. 用户不是 QA Bot

Agent 应主动完成：

- 搜索与恢复；
- Owner / propagation 复查；
- current state / memory / story 明显一致性检查；
- dynamic durable entity 是否可恢复；
- 修改后的 focused validation。

用户主要负责玩家行动、主观体验和真正的产品裁定。

## 18. Reality Gates

### TW-00.5 Bare DSH Probe

当前先继续测出 Bare DSH 的自然上限，不在实验期间提醒 DSH 修我们已经发现的问题。

### Gate A — World Core Viability

至少证明：

- 玩家想继续玩；
- GM 质量没有明显下降；
- 全新 DSH Session 能恢复同一个世界；
- 动态人物 / 关系 / 承诺具有长期连续性；
- 玩家不用维护后台文件。

### Gate B — RPG Specialization Value

Gate A 后，至少一个 RPG 专用插件证明明显游戏化 / 沉浸 / 机制增益。

当前下一步：`继续 TW-00.5 → TW-01 Minimal World Core`。

## 19. Public Repository Safety

本仓库是 public。

禁止提交秘密、凭证、私密个人内容、私密聊天原文，以及无权公开的版权 / 保密材料。

## 20. 跨项目上游

开发方法论：`https://github.com/zhangchenjia21-dot/Vibe-Coding`

执行 Skill：`https://github.com/zhangchenjia21-dot/Skill`

读取其 `main` current，但不得让通用方法论覆盖 The World 已明确的产品裁定。

## 21. 结构扩展规则

当前优先 Owner：

```text
docs / plugins / library / games / tools
```

只有新职责无法合理归入现有 Owner 时才新增根目录。

> **迁移经过验证的方法论，不迁移与本项目目标无关的工程仪式。**
