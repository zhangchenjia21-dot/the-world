# The World｜Agent 协作与仓库规则

状态：current  
适用范围：整个 `the-world` 仓库

## 1. 项目定位

`the-world` 是一个 Agent-native 长期 AI 世界 / RPG 实验项目。

第一阶段的核心假设是：

> 现代 Agent 已经具备语言理解、规划、搜索和文件读写能力，因此应先验证“Agent + 简单文件系统”是否足以承担主持、长期状态与记忆维护；只有真实失败，才增加程序化能力。

本仓库不是 SillyTavern 的替代仓库，也不得自动继承其 Runtime、数据库、协议或历史约束。

## 2. 权威顺序

发生冲突时按以下顺序处理：

1. 用户当前明确指令；
2. `docs/PRODUCT_SPEC_CURRENT.md`；
3. `docs/ARCHITECTURE_CURRENT.md`；
4. 当前 game 的 `state/` canonical facts；
5. 当前 game 的 `story/` 与 `memory/`；
6. `README.md` 导航说明；
7. 跨项目 `Vibe-Coding` current 方法论；
8. `Skill` 仓库 current Skill；
9. 历史聊天、旧摘要与模型记忆。

README 是入口，不应成为与 current spec 并列的第二套产品事实源。

## 3. 正式任务前的读取顺序

默认只读取完成当前任务所需的最小充分工作集：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ 当前 game 的 README / state/CURRENT.md
→ 与当前任务直接相关的 story / memory / library 文件
```

普通任务初始工作集优先控制在 3–7 个入口；证据不足时再扩大。

禁止为了“更了解世界”无目的全仓读取。

## 4. Freshness 与写回

新的正式任务开始时，先确认目标仓库 `main` 当前状态。

写回前重新取得将修改文件的当前版本 / SHA。若目标文件在任务期间发生变化：

- 无关变化：吸收后继续；
- 改变产品、架构、目录 Owner 或目标事实：先重新评估任务；
- 禁止基于旧副本静默覆盖新 current。

## 5. Folder Ownership

### `library/`

可复用 Source Assets。默认只读，不被某一局游戏反向污染。

### `games/<game-id>/state/`

当局当前世界的主要 canonical owner。

如果一个事实回答“这局游戏现在真实是什么”，优先写这里。

### `games/<game-id>/story/`

重要剧情账本：时间线、关键事件、未决钩子、承诺与长期后果。

不是逐字聊天日志，也不是当前状态的第二副本。

### `games/<game-id>/memory/`

Agent 上下文压缩层。可包含 recent / long-term / NPC memory 和读取索引。

Memory 是辅助恢复层，不得反向覆盖 `state/` 的 current truth。

### `games/<game-id>/saves/`

恢复点 / 分支 / snapshot 的记录与产物。

### `tools/`

仅放经真实失败证明值得程序化的确定性工具。

## 6. Source 与 Game-local 隔离

游戏运行中：

- 不直接修改 `library/` 来表达单局演化；
- 新 NPC、新地点、新关系、新事实进入当前 `games/<game-id>/`；
- Source 更新是否影响已有 game，必须有明确决定，不得自动覆盖；
- 若需要从 Source 初始化 game，复制、引用或 overlay 的技术形式可以演化，但语义必须保持实例独立。

## 7. 一次事实变化的传播

重要 durable 变化出现后，Agent 应判断它是否同时影响：

- current state；
- story timeline / important event；
- unresolved hook；
- long-term memory；
- save checkpoint。

不是每次都全部更新；只更新受影响 Owner。

禁止：

```text
state 已改变
但 story / memory 仍长期保留相反旧口径
```

## 8. Player Agency

Agent 可以主动推进 NPC、世界、环境和事件，但不得替玩家：

- 做未输入的关键选择；
- 说未表达的话；
- 答应承诺；
- 执行不可逆行动。

世界主动性与玩家自主权必须同时保留。

## 9. Context Growth 原则

```text
Game History Growth
!= Agent Context Growth
```

长局优先通过：

```text
state/CURRENT
→ recent memory
→ long-term memory / unresolved hooks
→ 相关 story
→ 按需追溯 source / old events
```

不要每回合加载全部历史。

## 10. Failure-driven Tooling

任何新增数据库、Schema、validator、脚本、服务、协议或复杂自动化前，先回答：

1. 已经出现了什么真实失败？
2. 频率和影响是什么？
3. Agent 自我校验能否解决？
4. 更窄的小工具能否解决？
5. 该能力是否会损害主持自由度或增加维护成本？

没有真实证据时，默认不平台化。

## 11. Markdown-first

第一阶段默认：

- 人类与 Agent 共同理解的内容 → Markdown；
- 必须机器严格校验 / 计算的结构 → 再考虑 JSON / YAML；
- 真实需要事务、查询或规模能力 → 再考虑数据库。

文件格式服务任务，不反过来定义产品。

## 12. 用户不是 QA Bot

Agent 应主动负责：

- 找重复和冲突；
- 找旧值；
- 找断链；
- 检查当前状态与剧情记忆是否一致；
- 检查写入是否进入正确 Owner；
- 检查新结构是否造成第二事实源；
- 修改后自行复查。

用户主要负责：

- 玩家行动；
- 主观游玩体验；
- 产品方向；
- 真正不可由 Agent 代替的裁定。

## 13. Public Repository Safety

本仓库当前为 public。

禁止提交：

- 密码、Token、Cookie、API Key、私钥；
- 不希望公开的个人信息；
- 私密聊天原文；
- 无权公开的版权 / 保密资料。

发现疑似敏感信息时，优先停止写入而不是“先提交再删除”。

## 14. 跨项目上游

需要开发方法论时读取：

`https://github.com/zhangchenjia21-dot/Vibe-Coding`

需要 Skill 时读取：

`https://github.com/zhangchenjia21-dot/Skill`

以其 `main` current 为准，不在本仓库复制整套上游正文。

## 15. 结构扩展规则

新增根目录前先判断现有 Owner 是否已经足够。

优先扩展现有结构：

```text
docs / library / games / tools
```

只有新职责无法合理归入现有 Owner 时，才新增根目录。

原则：

> 迁移经过真实项目验证的方法论，不迁移与本项目目标无关的工程仪式。