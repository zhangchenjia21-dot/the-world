---
title: Future Standalone Foundation Strategy
status: current-strategy
version: 0.1
created: 2026-08-25
updated: 2026-08-25
scope: future-standalone-project
---

# Future Standalone Foundation Strategy v0.1

这份文档记录 The World 团队对未来独立 AI RPG 项目的基础工程策略。它**不是当前 DSH 版 The World 的迁移计划，也不是现在就启动新项目的决定**。

它来自当前项目的直接经验：The World 能快速进入真实长局，是因为 DeepSeek Harness 已经承担了 Agent loop、Provider、Session、Plugin Runtime、通用 UI 等大量通用工程；我们把开发资源留给了长期世界、GM、NPC、机制、Save/Restore 与 RPG UI 等真正需要验证的产品问题。

未来独立游戏应继承这种方法，而不是因为“独立”就从零重造全部基础设施。

---

## 1. 正式原则

> **Commodity Foundation, Owned Game Semantics.**
>
> **通用基底尽量复用，游戏核心语义必须掌握在自己手里。**

新项目启动前，优先寻找经过产业实践、大量项目和多版本迭代验证的成熟基础设施。只有以下两类内容优先自行建设：

1. 直接构成产品差异化核心、现成方案不能表达的能力；
2. 成熟方案与我们的核心语义长期冲突，继续适配的代价已经高于自建。

“自己写得更多”不是独立性的目标。真正需要独立的是**产品语义、游戏体验与关键技术边界**。

---

## 2. 当前已明确的未来产品形态

截至 2026-08-25，未来独立版的方向假设已经比较清楚：

- **2D 对话式 RPG / 互动小说体验为主**，不是自由移动 3D RPG；
- 在对话与文本之外逐步加入**角色立绘、地图、场景图、UI 动效等美术表现**；
- **本地优先**：第一阶段不以远程服务器架构作为前置条件；
- **单人优先，且长期单人**：多人网络同步不是第一代设计约束；
- **Mod / World Pack 是一级能力**：未来应允许不同世界、人物、机制与美术资产以内容包形式扩展游戏。

因此，未来 Host 的首要价值不是 AAA 3D 渲染，而是：

- 高质量 2D/UI/Text；
- 图片、立绘、地图、场景等资产管线；
- 本地文件 / 数据库 / 网络请求能力；
- AI 流式输出与后台任务；
- 可扩展内容包与 Mod；
- 桌面端打包、更新、调试与性能工具；
- 足够开放，允许我们拥有自己的 RPG Runtime。

---

## 3. 引擎负责什么，我们自己负责什么

### 3.1 优先交给成熟引擎 / 基础设施

这些能力已有成熟工程答案，原则上不应成为我们的差异化研发重点：

```text
Window / Platform
Rendering
2D Canvas
Input
Audio
Font / Text Rendering
Animation
Image / Asset Pipeline
Scene / UI Foundation
Localization Foundation
Packaging / Distribution
Profiler / Debug Tooling
Crash / Log Foundation
```

未来遇到数据库、语音、更新器、本地模型 Runtime、Provider SDK 等基础设施，也沿用同一判断：**先评估成熟方案，再决定是否自建。**

### 3.2 The World Runtime 必须拥有的游戏语义

以下概念不能为了迎合某个引擎而被错误地等同于 Scene Tree、UI Node 或通用 Session：

```text
Game
World
Timeline
Save Point
Conversation Context
Player Turn / AI Turn
World Event
NPC
Knowledge Provenance
Relationship
Faction / Organization
Quest / Thread
Mechanic State
Persistent World State
Context Assembly
Agent / Model Orchestration
World Pack / Mod Semantics
```

这些属于我们的产品定义。

引擎可以承载它们，但不应反过来定义它们。

正式原则：

> **Engine-native, not engine-semantic-coupled.**
>
> **充分利用引擎能力，但不把核心 RPG 语义焊死在引擎内部概念上。**

这延续当前 DSH 版已经验证过的：

> **DSH-native, not DSH-internal-coupled.**

---

## 4. 当前候选方向

### 4.1 Godot：第一优先研究候选，不是现在的最终选型

基于当前产品形态，Godot 暂列未来 Foundation Gate 的第一研究候选，原因包括：

- 2D 与 UI 是核心使用场景之一；
- 对文本、图片、地图、场景类游戏表现足够自然；
- 桌面本地应用能力与游戏能力在同一 Host 中；
- 开放性较高，便于未来深入定制 AI RPG Runtime 与内容工具；
- 对一个以本地、单人、2D、内容包为主的第一代独立版本，复杂度与需求较匹配。

**这不是“未来确定使用 Godot”的决定。** 在真正独立项目启动前仍必须通过 vertical spike 验证。

### 4.2 Unity：保留为主要比较候选

Unity 的价值在于成熟生态、C# 工程体系、工具与资产丰富、跨平台经验广。若未来 UI、美术表现、第三方插件或团队生态需求明显扩大，应认真比较。

### 4.3 Unreal：当前低优先级

未来产品目前不是 3D 开放世界或高端实时渲染导向，因此 Unreal 的优势与我们第一代独立版需求不完全匹配。除非后续产品方向发生明显变化，否则不作为首轮主要候选。

### 4.4 非传统 Game Engine / App Foundation：保留为对照组

如果未来真实验证发现 90% 体验仍是：

```text
Narrative
+ Character Portrait
+ Map
+ Scene Art
+ RPG UI
```

而几乎没有传统实时游戏场景，那么成熟桌面 App Foundation + 专用 2D 渲染层仍值得作为对照组参与 Foundation Gate。

我们从产品需求选 Host，不从“它被叫做游戏引擎”选 Host。

---

## 5. Foundation Selection Gate

未来独立项目进入大规模实现前，必须先经过一个独立的 **Foundation Selection Gate**。

不凭品牌偏好、教程数量或官网 Feature List 直接拍板。

### 5.1 候选 Host 必须做真实 vertical spike

每个主要候选只实现一组对 The World 最关键的 seam：

1. AI 文本流式输出；
2. 后台 Agent / world-maintenance 工作不阻塞玩家阅读；
3. 本地持久世界状态；
4. Save / Restore / 新 timeline context；
5. 高质量长文本与 RPG UI；
6. 角色立绘与场景图片；
7. authored map + marker overlay；
8. World Pack / Mod 加载；
9. 本地 Provider / API Key / Local Model 的基本接入；
10. Windows 桌面打包与调试。

### 5.2 Gate 真正要回答的问题

不是：

> “哪个引擎功能最多？”

而是：

> **“把我们已经验证过的 AI RPG 核心语义放进这个 Host 后，是自然的，还是每天都在和 Host 打架？”**

重点观察：

- 是否强迫我们扭曲 Game / Timeline / Save / NPC 等语义；
- AI 流式与后台任务是否容易组织；
- 本地数据访问是否自然；
- UI/Text 是否成为高成本逆风项；
- Mod / World Pack 是否能形成清晰、安全、可维护的加载边界；
- 是否为了一个普通能力需要大量 Host-specific hack；
- Debug、打包、升级与长期维护成本是否可接受。

---

## 6. 本地优先的第一代架构约束

第一代独立版暂不以服务器为中心设计。

概念上更接近：

```text
Desktop Game Host
+
The World Runtime
+
Local Game State / Save / Assets
+
Provider Adapter
    ├─ Remote Model API（玩家配置）
    └─ Local Model（未来按需）
```

本地优先不意味着永远拒绝服务器，而是：

> **不要为尚未存在的规模问题，提前支付远程服务、账户系统、同步、运维和分布式一致性的复杂度。**

如果未来产品证据要求服务器能力，再作为后续阶段引入。

---

## 7. 单人优先

第一代独立版至少长期保持单人游戏假设。

因此以下内容当前不作为基础架构前置要求：

- 多人实时同步；
- authoritative multiplayer server；
- 玩家间世界状态冲突解决；
- 多人 Save / Restore 一致性；
- MMO 式 persistent shared world。

单人并不等于世界简单。我们优先把复杂度用在：

- NPC 自主性；
- 长期世界；
- 世界分歧；
- 人物关系；
- AI GM；
- 内容与 Mod；
- 玩家体验。

---

## 8. Mod / World Pack 是一级设计约束

未来独立版应把 World Pack / Mod 当作产品结构，而不是发布之后再补的文件替换机制。

长期目标至少包括：

- 世界包声明世界 Source 与 authored assets；
- 人物卡、机制包、地图、立绘、场景等可组合；
- game-local reality 与 Source 内容继续分离；
- Mod 不需要理解内部所有 Runtime 细节才能创作；
- 内容包升级不应静默改写已经发生的游戏历史；
- 引擎资源格式与 The World 内容语义之间保持适配层。

具体 Manifest、沙箱、脚本权限、编辑器等现在不预造；等未来 Foundation Gate 和真实 Mod vertical 再决定。

---

## 9. 与当前 DSH 项目的关系

当前 DSH 版继续承担两种价值：

1. **RPG 产品实验场**：验证什么东西真的好玩；
2. **未来独立版需求采集器**：记录 DSH 上真实遇到但不值得为宿主深修的问题。

当前不因为未来有独立版计划就提前抽象“可迁移 Runtime”，也不要求现有代码能直接搬过去。

未来真正要继承的是：

```text
经过真实试玩验证的产品原则
+ 游戏语义
+ 数据 ownership 经验
+ 失败过的方案
+ DSH Host Debt 清单
+ 可复用的 Source Assets / 创作规范（按实际兼容性处理）
```

而不是为了代码复用牺牲现在的开发速度。

---

## 10. 当前结论

截至 2026-08-25：

> **未来独立版不从零造“游戏外壳”。优先基于成熟 Foundation / Game Engine 建立自己的 AI RPG Runtime。**

当前第一研究候选：**Godot**。  
主要比较候选：**Unity**。  
对照候选：**适合 2D 对话式产品的成熟 App Foundation**。  
Unreal：除非未来转向重 3D，否则低优先级。

但最终技术栈必须由 Foundation Selection Gate 的真实 vertical spike 决定。

本策略在当前 The World DSH 主线中只作为未来架构约束，不改变当前下一任务：

> **The World Map v0.1 — Authored World Map Projection**
