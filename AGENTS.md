# The World｜Agent 协作与仓库规则

状态：current  
适用范围：整个 `the-world` 仓库

## 1. 项目定位

`the-world` 是一个以 **DeepSeek Harness（DSH）为 Reference Host** 的 Agent-native 长期 RPG 项目。

当前产品方向已通过 Product Definition Gate：

```text
DeepSeek Harness
+
World Core 游戏模式
+
持久世界工作区
+
RPG 专用插件
```

The World 默认不重造独立 Agent Runtime，也不得自动继承 SillyTavern 的 Runtime、数据库、typed mutation、协议或历史约束。

## 2. 当前产品原则

正式工作不得偏离以下 current product decisions：

- **Persistent World + Player Spotlight**：世界独立存在，但 GM 主动把有意义的舞台组织到玩家身边；
- **Unlimited Attempt, Consequence-bound World**：玩家可以尝试任何游戏内行为，世界负责给出可信后果；
- **Player Agency**：Agent 不替玩家做未输入的关键选择、承诺或不可逆行动；
- **Model Freedom**：默认不以预防模型错误为理由建设大规模审批、权限、typed mutation 或严格状态机；
- **Recovery First**：低成本错误优先撤回、重答、修正、Restore；
- **Player Plays, Agent Maintains**：玩家主要负责玩，Agent 负责工作区维护；
- **DSH-native, not DSH-internal-coupled**：利用 DSH 正式插件 / capability seams，不把长期 game data 绑死到易变内部实现。

产品事实以 `docs/PRODUCT_SPEC_CURRENT.md` 为准。

## 3. 权威顺序

发生冲突时按：

1. 用户当前明确指令；
2. `docs/PRODUCT_SPEC_CURRENT.md`；
3. `docs/ARCHITECTURE_CURRENT.md`；
4. 当前 game 的 `state/` canonical facts；
5. 当前 game 的 `story/` 与 `memory/`；
6. `README.md`；
7. `Vibe-Coding` current；
8. `Skill` current；
9. 历史聊天、旧摘要、旧附件与模型记忆。

跨项目通用方法与本项目明确产品裁定冲突时，以本项目 current Product Spec 为准。

## 4. 正式任务前读取

只读取完成当前任务所需的最小充分工作集：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ 当前 game / plugin / asset 的直接 Owner
```

普通任务初始优先控制在 3–7 个入口，证据不足再扩大。

## 5. Freshness 与写回

新的正式任务、Stage / Reality Gate、重要 game fact 修改、plugin 开发或正式 Agent Task 开始前，先核验 GitHub `main` current。

写回前重新取得目标文件当前 SHA；禁止用旧副本覆盖并行更新。

发现新产品 / 架构决策后，不只“读到”，还要检查：

- Current Task；
- 正确 Owner；
- game-local propagation；
- Reality Gate；
- 下一步路线。

## 6. Folder Ownership

### `docs/`

项目级 current 产品与工作架构。

### `plugins/`

The World 面向 DeepSeek Harness 的 RPG 专用插件 Owner。

包括：

- World Core；
- RPG UI；
- Map / Visualization；
- Mechanics / Expansion plugins。

这些能力可以由**产品价值**直接驱动，不要求先出现模型错误。

### `library/`

可复用 Source Assets。默认不被单局游戏反向污染。

### `games/<game-id>/state/`

当局 current world reality 的主要 canonical owner。

### `games/<game-id>/story/`

重要历史、转折、承诺、后果与 unresolved hooks。

不是 current state 第二副本。

### `games/<game-id>/memory/`

上下文压缩 / retrieval layer。可重写，不覆盖 `state/` current truth。

### `games/<game-id>/saves/`

明确恢复点 / 分支 / snapshot 的语义 Owner。

### `tools/`

窄而确定性的支持工具。

若主要目的是修复模型 / 文件错误，默认由真实重复失败驱动；若是游戏机制的一部分，可被 `plugins/` 消费。

## 7. World Core Boundary

World Core 是 TW-01 Shared Foundation。

它可以：

- 在游戏模式中稳定提供每轮必要上下文；
- 提供 GM / 世界 / Player Agency 原则；
- 定义文件读取与 durable write 职责；
- 帮助 Agent 恢复游戏、选择相关上下文并维护工作区。

它默认不应变成：

- narrative approval gate；
- typed mutation 强制流水线；
- “程序批准后事实才能存在”的通用 Commit Engine；
- 玩家行为白名单；
- 模型创作范围白名单。

如果未来真实失败证明需要某种约束，只增加最窄边界。

## 8. Source 与 Game-local 隔离

- `library/` 是可复用起点；
- 单局新增人物、地点、关系、历史分叉进入当前 game；
- Source 更新是否影响已有 game 必须显式决定；
- 历史世界只定义起始 canonical condition，游戏开始后的 game-local reality 优先；
- 已发生的历史分叉不得为了贴回 Source 被静默修正。

## 9. Persistent World & Player Spotlight

```text
Persistent != Fully Simulated
```

Agent 可以让玩家视野外的 NPC、势力和事件继续演化，但不要求全世界逐实体 tick。

GM 应根据世界因果、人物目标、时间和玩家相关性判断哪些变化值得发生并重新进入玩家体验。

世界不围绕玩家存在；叙事注意力优先服务玩家的游戏体验。

## 10. Player Agency & Attempt

玩家可以尝试任何游戏内行为，程序不得仅因为其疯狂、愚蠢、危险或不符合推荐路线而拒绝。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

Agent 不得替玩家说话、答应承诺、做关键决定或执行未表达的不可逆玩家行动。

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

## 12. Product-value Capability vs Failure-driven Guardrail

新增程序化能力前先分类。

### Product-value Capability

例如 RPG UI、Map、Combat、Politics、Economy、Character Progression。

若它直接增加沉浸、交互、机制深度或传统 RPG 体验，可以按产品路线开发，不需要“先失败”。

### Failure-driven Guardrail

例如 consistency validator、typed mutation、atomic writer、schema checker、duplicate detector。

若主要目的是防止错误，至少确认：

1. 真实失败已经发生；
2. 失败反复或代价明显；
3. Undo / 修正 / Agent 自检不够；
4. 最窄确定性方案能解决；
5. 不显著损害核心游戏体验。

禁止从“以后可能出错”直接推导重型 Runtime / DB / Protocol。

## 13. Context Growth

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

## 14. Durable Change Propagation

重要变化后判断是否影响：

- state；
- story；
- unresolved hook；
- memory；
- save。

只更新真正受影响的 Owner。

禁止让 memory 长期把旧状态当 current，也禁止让 plugin cache 成为第二 game truth。

## 15. Markdown-first

第一阶段：

- 人 / Agent 共同理解内容 → Markdown 优先；
- 真正需要机器计算 / 校验 → 再结构化；
- 真正需要查询 / 原子性 / 并发 / 性能 → 再考虑 DB / Service。

格式服务产品，不反过来定义产品。

## 16. 用户不是 QA Bot

Agent 应主动完成：

- 搜索与恢复；
- 去重、旧值、断链检查；
- Owner / propagation 复查；
- current state / memory / story 的明显一致性检查；
- 修改后的 focused validation。

用户主要负责玩家行动、主观游戏体验和真正的产品裁定。

## 17. Reality Gates

### Gate A — World Core Viability

至少证明：

- 玩家想继续玩；
- GM 质量没有明显下降；
- 全新 DSH Session 能恢复同一个世界；
- 存在真实长期因果与离屏变化；
- 玩家不用维护后台文件。

### Gate B — RPG Specialization Value

Gate A 通过后，至少一个 RPG 专用插件证明明显的游戏化 / 沉浸 / 机制增益。

当前下一步：`TW-01 / First Real Vertical`。

## 18. Public Repository Safety

本仓库是 public。

禁止提交秘密、凭证、私密个人内容、私密聊天原文，以及无权公开的版权 / 保密材料。

## 19. 跨项目上游

开发方法论：`https://github.com/zhangchenjia21-dot/Vibe-Coding`

执行 Skill：`https://github.com/zhangchenjia21-dot/Skill`

使用时读取其 `main` current，但不得让通用方法论覆盖 The World 已明确的产品裁定。

## 20. 结构扩展规则

当前优先 Owner：

```text
docs / plugins / library / games / tools
```

只有新职责无法合理归入现有 Owner 时才新增根目录。

> 迁移经过验证的方法论，不迁移与本项目目标无关的工程仪式。