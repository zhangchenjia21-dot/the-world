---
title: Future Standalone Backlog｜从 DSH 版 The World 积累的独立游戏需求
status: living-backlog
created: 2026-08-25
updated: 2026-08-25
source: real-playtest
---

# Future Standalone Backlog

这份文档不是当前 DSH 版 The World 的开发清单。

它记录一种更有价值的东西：**在 DSH 上真实开发、真实长局游玩后已经出现，但目前不值得为了宿主限制深度修补的问题。**

这些问题将成为未来独立 AI RPG 项目的需求证据。

当前定位：

> **DSH 版 The World 是 RPG 产品实验场和参考实现；未来独立项目继承的是经过真实游玩验证的产品原则、世界架构、失败经验与宿主需求，而不要求机械复用当前代码。**

判断标准：

> **不阻塞 The World 验证核心 RPG 假设的问题，原则上不为了 DSH 做深度优化。**

当前项目只优先修三类宿主问题：

1. 会损坏长期世界；
2. 会明显破坏正常游玩；
3. 会妨碍验证重要 RPG 假设。

---

## SD-01｜世界状态更新的 eventual consistency

### 真实现象

当前 Workspace 使用两层维护：

```text
每回合
→ CURRENT / DELTAS / 少量直接 Owner 更新

检查点
→ 模型 consolidation
→ 批量刷新 characters / mechanics / THREADS / RECENT / story 等 Owner
```

因此两次 consolidation 之间，部分 Owner 文件可能明显落后于当前剧情。

2026-08-25《乱世三国2》长期试玩中出现：

- CURRENT 已到 187 九月；
- RECENT 仍停在 186 十一月；
- 已入府人物仍在人物档中显示“未从”；
- 已完成合同与货币变化仍停留在 DELTAS，机制 Owner 尚未刷新。

### 当前 DSH 版处理

**接受。**

理由：

- DELTAS 从写入起就是 authoritative durable fact，事实没有丢；
- 更频繁 consolidation 会增加 token、maintenance 时间和玩家等待；
- 若为此建设 typed mutation / universal state engine，会把当前项目重新拖回基础设施；
- 当前项目更看重 GM 输出质量、沉浸感和玩家体验。

### 未来独立版目标

世界 durable mutation 应做到持续、增量、一致：

```text
世界事件 / durable mutation
↓
一次提交
↓
权威事实 + 对应 projection 同步更新
```

不再依赖模型每隔若干回合批量重新阅读并 edit 大量 Markdown 才让所有 Owner 收敛。

目标不是一定使用数据库，而是：**世界事实的权威写入与玩家/Agent 可读 projection 不应长期分离。**

---

## SD-02｜Save / Restore 延迟

### 真实现象

DSH 版 Save / Restore 已经可以正确工作，但 Restore 体感较慢。

当前恢复链路涉及：

```text
保护快照
→ 文件 snapshot replace
→ workspace watch / refresh
→ 创建 fresh DSH Session
→ 切换 Session
→ World Core recovery injection
```

### 当前 DSH 版处理

**接受。** Restore 是低频操作，正确性高于速度。

不继续为了减少几秒延迟引入 DSH 专属复杂兼容层。

### 未来独立版目标

Game State、Save Point、Session Context、Agent Runtime 和 UI 生命周期从一开始就是同一个游戏 Host 的原生概念。

Restore 应成为游戏生命周期原语，而不是跨文件系统与外部 Session Runtime 的组合动作。

---

## SD-03｜Game Session 与通用 Agent Session 不是同一个概念

### 真实现象

DSH Session 是 append-only Agent 对话历史；Restore 旧世界状态后不能继续使用包含未来历史的旧 Session，因此必须 fresh Session。

这在 DSH 上是正确边界，但暴露了宿主语义差异：

```text
通用 Agent Session
≠
RPG Game Timeline / Save Branch
```

### 当前 DSH 版处理

保持现有 fresh-session restore 规则，不篡改 DSH history。

### 未来独立版目标

独立 Host 原生理解：

- Game；
- Timeline；
- Save Point；
- Conversation Context；
- Branch / Restore 后的新上下文出生点。

让“回档”天然重建正确的 Agent context，而不是由 RPG 插件绕宿主 Session 语义。

---

## SD-04｜Agent trace 与 RPG 阅读流

### 真实现象

通用 Agent Harness 的 think/read/write/tool 对工程任务有价值，但 RPG 玩家主要需要叙事和游戏状态。

### 当前 DSH 版处理

> **隐藏工作噪音，不限制 Agent 工作能力。**

在宿主允许范围内做 projection / presentation cleanup，不重写 DSH Agent Runtime。

### 未来独立版目标

从 Host 层原生分开：

```text
玩家叙事流
后台世界维护流
debug / inspect 流
```

后台工具调用不应天然成为主游戏阅读流的一部分。

---

## SD-05｜RPG UI 不应受通用 Workspace IA 限制

### 真实现象

Workspace 必须按事实 Owner 组织，而玩家 UI 必须按玩家问题组织。The World Panel 已证明二者不是同一 IA。

### 当前 DSH 版处理

> **Workspace is organized for truth maintenance; UI is organized for player needs.**

通过插件做 projection，不让 UI 建第二事实源。

### 未来独立版目标

Host 从设计之初区分：

- canonical world ownership；
- player information architecture；
- debug / authoring information architecture。

不再让游戏插件承担全部“把工程 Workspace 翻译成玩家产品”的成本。

---

## SD-06｜地图与空间应成为原生游戏能力，但不是当前自动生成项目

### 当前证据

长期三国局已经跨越多个州郡、屯田区、战场与政治中心，仅用文字保持空间关系开始产生认知负担。

### 当前 DSH 版处理

先验证最薄的 Map v0.1：

- 世界包作者手工提供专属地图；
- 插件只负责展示、缩放/拖动、当前位置 projection；
- 不做自动生成、GIS、路径规划或世界空间 Runtime。

### 未来独立版目标

等多个世界的 authored map 真正玩过后，再决定独立游戏地图系统需要：

- 地图层级；
- 地点实体；
- 旅行与距离；
- 势力区域；
- 自动生成；
- 编辑工具。

**不在没有产品证据前预造地图引擎。**

---

## SD-07｜独立版应先选择成熟 Foundation，而不是从零造游戏外壳

### 当前证据

DSH 版 The World 的开发速度本身已经证明了“成熟宿主”的价值：通用 Agent loop、Provider、Session、Plugin Runtime 与基础 UI 不需要由项目重新发明，因此开发资源可以集中在真正未知的 RPG 产品问题上。

未来独立版当前产品假设也已明确：

- 2D 对话式 RPG / 互动小说为主；
- 增加角色立绘、地图、场景图等美术能力；
- 本地优先；
- 单人优先且长期单人；
- Mod / World Pack 为一级能力。

### 未来独立版目标

正式原则：

> **Commodity Foundation, Owned Game Semantics.**
>
> **通用基底尽量复用，游戏核心语义必须掌握在自己手里。**

独立项目正式大规模实现前必须经过 **Foundation Selection Gate**，使用真实 vertical spike 比较候选 Host，而不是凭品牌偏好直接选型。

当前第一研究候选为 Godot，Unity 为主要比较候选；适合 2D 对话式产品的成熟 App Foundation 保留为对照组；Unreal 在没有重 3D 需求前低优先级。

引擎负责渲染、2D、UI、输入、音频、资产管线、打包、调试等通用能力；我们自己拥有 Game / World / Timeline / Save / NPC / Knowledge / Relationship / Mechanics / Agent Orchestration / Mod 等核心 RPG 语义。

详细策略：`docs/FUTURE_STANDALONE_FOUNDATION_STRATEGY_v0.1.md`。

---

## 使用规则

新增条目时至少记录：

```text
问题
真实试玩证据
当前 DSH 版为什么接受 / 如何最小处理
未来独立版目标
```

不要把理论上的“宿主不完美”全部塞进这里。只有真实开发或真实游玩碰到过的问题，才值得成为未来独立项目的需求证据。
