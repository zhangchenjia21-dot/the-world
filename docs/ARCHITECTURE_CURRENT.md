---
title: The World｜Agent-native 文件工作区架构
status: current-experimental-architecture
version: 0.1
updated: 2026-08-23
canonical_product_spec: PRODUCT_SPEC_CURRENT.md
---

# The World｜Agent-native 文件工作区架构 CURRENT

## 0. Architecture Thesis

第一阶段默认：

```text
Agent = GM + Orchestrator + Context Reader + State Maintainer
Filesystem = Durable Workspace / Memory Substrate
Small Tools = Deterministic Guardrails only when proven necessary
```

目标不是证明“文件系统永远足够”，而是用最简单可运行方案测出真正的缺口。

## 1. Top-level Ownership

```text
library/
→ reusable source assets

games/<game-id>/state/
→ current game-local canonical reality

games/<game-id>/story/
→ important historical narrative ledger

games/<game-id>/memory/
→ context compression / retrieval aids

games/<game-id>/saves/
→ explicit recovery points

tools/
→ narrow deterministic utilities
```

`docs/` 只定义项目产品与架构，不存某一局游戏事实。

## 2. Library

建议逻辑分类：

```text
library/
├─ worlds/
├─ characters/
├─ mechanics/
└─ lore/
```

第一阶段不冻结统一资产 Schema。

允许：

- Markdown；
- JSON / YAML；
- 图片 / 地图 / 表格等合法资料；
- 资产自带的局部说明。

要求只有两个：

1. Agent 能知道它是什么；
2. Source 不被单局运行反向污染。

如果未来真实导入失败证明需要标准 manifest，再设计最小 manifest。

## 3. Game Workspace

每局 game 自包含：

```text
games/<game-id>/
├─ README.md
├─ state/
├─ story/
├─ memory/
└─ saves/
```

### 3.1 `state/`

回答：**现在是什么。**

第一版提供 `CURRENT.md` 作为恢复入口。

当文件增长后，可以按领域拆分：

```text
state/
├─ CURRENT.md
├─ characters/
├─ scenes/
├─ factions/
├─ items/
└─ world/
```

但只有达到真实复杂度时再拆；不要为了目录漂亮提前创建几十个空层级。

### 3.2 `story/`

回答：**发生过哪些值得长期追踪的事。**

后续可按需要演化为：

```text
story/
├─ timeline.md
├─ important-events.md
├─ unresolved-hooks.md
└─ commitments.md
```

允许同一事件的最小摘要出现在 `state/CURRENT.md`，但完整历史 Owner 仍是 story。

### 3.3 `memory/`

回答：**为了下一次高质量主持，现在最值得加载什么。**

建议未来按真实需要形成：

```text
memory/
├─ recent.md
├─ long-term.md
├─ retrieval-index.md
└─ npcs/
```

Memory 可以压缩和重写；不能把历史摘要当作比 `state/` 更高权威的事实源。

### 3.4 `saves/`

第一阶段只冻结语义：

> save 是一个明确可恢复到的游戏现场。

实现可以是：

- 目录 snapshot；
- Git commit / tag；
- 脚本复制；
- 未来专用 snapshot 工具。

不在真实需要前冻结技术方案。

## 4. Turn / Interaction Model

第一阶段不引入 Formal Turn Engine。

普通交互：

```text
Agent 读取当前现场
+
必要 Source / Story / Memory
↓
主持世界 + 响应玩家
↓
识别 durable changes
↓
更新正确 Owner
↓
检查是否需要 story / memory / save propagation
↓
继续游戏
```

世界可以主动行动；玩家本人行为必须来自玩家表达。

## 5. Write Semantics

### 5.1 Current State

只有会影响后续世界判断、互动、恢复或规则的 durable fact 才需要进入 state。

氛围、一次性措辞和无持续身份的局部纹理无需全部持久化。

### 5.2 Story

只有未来值得追溯的剧情节点进入 story；不要保存逐字聊天导致历史无限膨胀。

### 5.3 Memory

Memory 是 lossy compression，允许重新整理。

关键事实丢失风险由 `state + story` 提供可追溯底座。

## 6. Read / Context Strategy

默认恢复路径：

```text
当前 game README
→ state/CURRENT.md
→ recent / unresolved memory（若存在）
→ 本回合直接相关 state / story
→ 必要 source asset
→ 更旧历史按需追溯
```

原则：

```text
Repository Total Knowledge
!= Current Turn Context
```

## 7. Consistency Model

第一阶段不追求数据库级事务模型，但必须避免明显第二事实源。

Agent 每次重要批量写入后至少检查：

- 当前状态是否自相矛盾；
- story 是否仍残留与 current 相反的“当前”描述；
- memory 是否把旧状态误当 current；
- 新实体是否只存在于叙事而完全无法恢复；
- library 是否被误写成 game-local 演化。

若这些错误频繁发生，再引入 validator / atomic writer。

## 8. Tool Boundary

工具只在以下条件下进入关键路径：

1. 失败重复出现；
2. 错误可以被确定性程序可靠识别 / 防止；
3. 工具比增加 Prompt 规则更简单；
4. 工具不会接管故事创作和世界主动性。

潜在工具示例：

- dice / RNG；
- arithmetic；
- link / reference validator；
- duplicate ID detector；
- snapshot helper；
- state consistency lint。

这些都不是 Stage 0 必须交付。

## 9. Evolution Triggers

只有真实证据触发升级：

### Trigger A — 文件拆分

`state/CURRENT.md` 过大、冲突频繁或检索变差。

### Trigger B — 结构化数据

某类数据需要高频精确计算 / 校验，Markdown 变成主要错误源。

### Trigger C — Validator

Agent 自检仍反复遗漏相同一致性问题。

### Trigger D — Database / Service

真实出现跨文件原子性、复杂查询、大规模索引、并发或性能问题。

### Trigger E — UI

Agent 工作区已经证明产品价值，UI 能明显降低用户使用成本，而不是用 UI 掩盖核心体验未成立。

## 10. Architecture Non-goals

第一阶段明确不追求：

- 通用世界操作系统；
- 完整 ECS / game engine；
- universal asset protocol；
- 统一 DSL；
- 预先枚举所有 entity type；
- 自动连续后台模拟；
- 多租户 / 云服务；
- 为理论并发设计事务平台。

## 11. Architecture Success

架构是否成功，不由“目录和规则是否完整”决定。

真正的 Gate：

> 一个优秀 Agent 是否可以利用这套工作区，在真实长局中继续像优秀 GM 一样主持，同时比无工作区基线更稳定地维持长期世界。