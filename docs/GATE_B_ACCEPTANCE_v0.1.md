---
title: The World｜Reality Gate B Acceptance
status: current
version: 0.1
updated: 2026-08-24
stage: Gate B / RPG Experience Validation
---

# Reality Gate B｜Acceptance v0.1

## 0. Question

Gate A 回答：

> **World Core 能不能让 DSH 成为可靠的长期 RPG？**

Gate B 回答另一个问题：

> **The World 的 RPG 专用插件，是否真的让玩家体验 materially better，而不是只是把工作区文件换一种方式显示出来？**

Gate B 不是 feature checklist，也不要求先做完整 RPG UI 套件。

---

## 1. Core Design Principle

> **Chat 展示机制事件；UI 承载机制当前状态。**

新增正式原则：

> **Workspace is organized for truth maintenance; UI is organized for player needs.**
>
> **工作区按事实归属组织，UI 按玩家需求组织。**

因此：

```text
Canonical Game Workspace
        ↓
Player-facing View Model / Projection
        ↓
RPG UI
```

而不是：

```text
Markdown Owner 文件
        ↓
一文件一页面的漂亮 Renderer
```

Player-facing View Model 不是第二事实源；它不持久化新事实，只把多个 canonical Owner 中的玩家可见事实重组为适合游玩的界面。

---

## 2. Gate B PASS Conditions

### B1｜Material RPG Value

真实试玩中，至少一个 RPG 专用插件带来明确、持续、玩家可感知的价值。

最直接的判断：

> **把插件拔掉以后，玩家会明显觉得游戏变差。**

价值可以来自状态查询、决策效率、沉浸感、机制可见性或操作减负；不能只来自“看起来更漂亮”。

### B2｜Canonical Truth Projection

UI 必须投影当前 game workspace truth：

- 状态文件变化后 UI 跟随变化；
- 新动态人物建档后 UI 能出现；
- mechanism state 改变后相关界面更新；
- fresh Session 后仍显示同一个当前世界；
- 不把 `saves/` 历史快照误当活状态；
- 不为了 UI 建立第二套长期事实。

必要的窄确定性写口可以存在，但必须满足：

1. 玩家明确触发；
2. 语义确定，不需要 GM 创作判断；
3. 对 canonical Owner 的变化可追溯；
4. 不把 UI 变成第二状态数据库。

### B3｜Player-facing Information Architecture

UI 的页面与视觉层级必须围绕玩家问题，而不是围绕文件路径。

玩家看到的应该是：

- 我是谁、现在怎么样；
- 我认识谁、和我什么关系；
- 我有什么；
- 当前机制状态是什么；
- 什么事情正在发生、需要我处理。

默认不暴露：

- file path；
- Owner 说明；
- source path；
- internal id；
- raw updated metadata；
- mechanic loader / implementation metadata。

开发信息可以保留在 debug / inspect 层，但不得占据 RPG 主界面。

### B4｜Does Not Damage the Game Loop

插件不能以“游戏化”为由破坏 Gate A 已证明的体验。

健康循环：

```text
玩家自然语言行动
↓
GM 自由主持
↓
世界发生变化
↓
后台维护 canonical truth
↓
UI 自然刷新
```

不应退化成：

```text
先操作多个 UI
↓
填字段 / 逐项确认
↓
GM 才能继续叙事
```

Persistent UI 应主要减少查询负担，而不是制造操作税。

### B5｜Not a Single-save Accident

插件至少需要证明它依赖稳定 Workspace Contract，而不是硬编码当前三国测试档。

轻量验证足够，例如第二 fixture / 极简游戏档应能证明：

- 没有 System 的世界不会出现空的 System 主界面；
- 不同玩家角色可以正常投影；
- 不同 characters / mechanics 内容不会因名称变化而崩；
- 没有 THREADS 时有正常空态；
- 不依赖 `张宸嘉`、`luan-shi-sanguo`、`traveler-system` 才能工作。

不要求为 Gate B 再完整游玩第二个长期世界。

---

## 3. Current Gate B Vertical｜the-world-panel

当前首个验证对象：`plugins/the-world-panel`。

它已经证明的技术基础包括：

- DSH Web RPG plugin 路线可行；
- `dsh-better-sidebar` 宿主集成可行；
- game workspace → Node projection → Web UI 可行；
- `fs.watch + SSE` 的实时刷新可行；
- 一个窄确定性 Thread 归档写口可行。

当前最重要的剩余问题不是继续增加页面，而是：

> **从 Workspace Inspector 的 RPG 皮肤，转成真正以玩家体验组织的信息界面。**

当前实现任务：`docs/experiments/GATE_B_PANEL_PLAYER_EXPERIENCE_REDESIGN_KIMICODE_TASK_2026-08-24.md`。

---

## 4. Non-blockers

以下能力不作为 Gate B PASS 前置：

- Map；
- Save / Restore UI；
- Relationship 独立页；
- Faction 独立页；
- Combat UI；
- 动画 / 音效；
- 完整移动端；
- 完整 Plugin SDK；
- 第二个 RPG 插件；
- 所有 UI 内容可编辑；
- 最终美术定稿。

Gate B 的任务是证明**RPG plugin 方向值得继续投资**，不是宣布整个游戏完成。

---

## 5. PASS Decision

Gate B 最终由真实试玩人工裁定。

推荐问题：

1. 我是否会自然打开并依赖这个 UI，而不是为了测试才打开？
2. 它是否明显减少我向 GM 反复询问已有状态？
3. 它是否让我更快理解当前局面并做决定？
4. 关掉它以后，我是否明显觉得少了一个真正的 RPG 界面？
5. 它是否仍然保持 Workspace truth 单一来源和自由的 Chat 游戏循环？

这些问题整体明确为“是”，且 B1–B5 没有 blocker，即可判定 **Reality Gate B PASS**。
