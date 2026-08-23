# The World

> 一个以 **Agent + 文件系统** 为核心的长期 AI 世界 / RPG 实验项目。

**当前状态：Stage 0 / Experimental Spike**  
**当前目标：先证明最小方案是否真的能长期玩，再决定要不要继续产品化。**

`the-world` 的出发点很简单：如果现代 Agent 已经能够读取、搜索、编辑本地文件，并自行维护长期任务上下文，那么一个长期 AI 世界未必需要先建设完整的数据库 Runtime、复杂协议、重型状态机和大量中间层。

这个仓库将验证另一条路线：

```text
优秀 Agent 主持能力
+
清晰的文件夹职责
+
长期状态 / 剧情 / 记忆 / 存档
+
少量真正必要的确定性工具
=
可持续游玩的长期 AI 世界
```

本项目不是当前 SillyTavern 项目的替代品。SillyTavern 继续沿原路线验证完整游戏产品；`the-world` 是一条并行、轻量、可证伪的 Agent-native 路线。

---

## 1. Primary Purpose

让一个具备文件读写能力的通用 Agent 能够：

- 读取世界包、角色卡、机制与资料；
- 主动主持游戏，而不是等待玩家自己编剧情；
- 长期维护人物、场景、势力、物品、关系和世界变化；
- 记录关键剧情、未决线索与长期记忆；
- 在长会话和跨会话后恢复到正确的游戏现场；
- 在需要时保存、恢复和分叉一局游戏；
- 只在 Agent 明显不可靠的地方引入小型确定性工具。

### Simple Baseline

本项目最重要的现实基线是：

> 直接让一个优秀通用 AI 说“请主持一场长期 RPG”。

`the-world` 只有在**不明显损害主持质量、创意、主动性与自由度**的前提下，提供更好的长期连续性，才算有价值。

---

## 2. 核心设计原则

### 2.1 Agent 是主持人与主要 Orchestrator

项目不预设必须自己重建一个低配 Agent Runtime。

默认：

```text
Agent
= GM + Planner + Context Reader + State Maintainer
```

程序只负责 Agent 不适合可靠承担的窄职责，例如确定性随机数、严格数值计算、格式校验、快照或一致性检查。

### 2.2 文件系统是第一版长期记忆层

Markdown 优先；只有当机器校验或计算真正需要时才引入 JSON / YAML / 脚本。

不要因为“以后可能复杂”就提前引入数据库。

### 2.3 Source 与 Game-local Reality 分离

`library/` 是可复用源资产；单局游戏不得反向污染它。

游戏中的新增人物、地点、关系和演化结果属于 `games/<game-id>/`。

### 2.4 一个事实只设一个主要 Owner

- 当前世界事实 → `state/`
- 重要剧情与节点 → `story/`
- 上下文压缩与长期记忆 → `memory/`
- 恢复点 → `saves/`

允许上层文件做摘要，但不得形成互相漂移的第二套权威事实。

### 2.5 失败驱动工具化

先让 Agent 做。

只有真实试玩证明某类错误持续发生，才增加工具或约束：

```text
真实失败
→ 分类根因
→ 最窄工具 / 校验器
→ 再试玩
```

而不是先假设所有风险，再建设完整 Runtime。

### 2.6 用户不是 QA Bot

Agent 应主动完成搜索、去重、旧值检查、状态传播与一致性复查；用户主要负责角色行动、游戏体验以及真正需要人类裁定的产品方向。

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
├─ library/
│  └─ README.md
│     # 逻辑分类：worlds / characters / mechanics / lore
│
├─ games/
│  ├─ README.md
│  └─ _template/
│     ├─ README.md
│     ├─ state/
│     │  └─ CURRENT.md
│     ├─ story/
│     │  └─ README.md
│     ├─ memory/
│     │  └─ README.md
│     └─ saves/
│        └─ README.md
│
└─ tools/
   └─ README.md
```

### `library/` — 可复用源资产

逻辑上分为：

- `worlds/`：世界包、时代背景、地理与世界锚点；
- `characters/`：角色卡与可复用人物定义；
- `mechanics/`：复杂机制、规则、判定说明；
- `lore/`：资料库、设定、知识条目。

这里保存“开始一局游戏之前就存在的源内容”。默认只读。

### `games/<game-id>/state/` — 当局 Canonical State

保存“这局游戏现在真实是什么样”。

典型内容包括：

- 当前角色与关系；
- 当前场景与地点；
- 当前势力状态；
- 物品、资源、承诺、任务；
- 已正式进入本局世界的新实体；
- 当前时间与其它持续状态。

### `games/<game-id>/story/` — 重要剧情与节点

保存：

- timeline；
- important events；
- unresolved hooks；
- promises / consequences；
- 需要长期追踪的剧情节点。

它不是逐字聊天日志，而是高价值剧情账本。

### `games/<game-id>/memory/` — Agent 长期记忆

保存为了跨长上下文恢复而形成的压缩记忆，例如：

- recent summary；
- long-term summary；
- NPC-specific memory；
- 当前最值得重新加载的上下文索引。

原则：**Game history growth != 每回合上下文增长。**

### `games/<game-id>/saves/` — 恢复点

保存明确的游戏恢复点、分支或快照元数据。

第一阶段不预设具体实现必须是复制目录、Git tag、Git branch 还是脚本快照；先用真实试玩决定。

### `tools/` — 窄而可靠的确定性能力

只放经过真实失败证明值得程序化的工具。

第一阶段允许这里几乎为空。

---

## 4. 一局游戏的最小工作循环

```text
1. 选择 / 读取 library 中相关资产
2. 从 games/_template 建立新 game
3. Agent 读取当局 CURRENT + 必要 story / memory
4. Agent 主持世界并响应玩家
5. 产生 durable 变化时更新 state
6. 出现重要剧情时更新 story
7. 上下文开始变长时更新 memory
8. 到重要恢复点时创建 save
9. 下一回合按需读取，而不是全仓重载
```

一个普通回合不要求每次重写所有文件。只更新真正发生变化的 Owner。

---

## 5. 当前不做什么

Stage 0 / First Spike 默认不建设：

- 完整 Web 游戏 Host；
- 通用数据库 Runtime；
- 复杂 typed mutation pipeline；
- 插件协议 / Asset DSL；
- 完整 Schema 平台；
- 后台自主世界模拟；
- 为所有潜在错误预建 Guardrail；
- 为尚未出现的规模问题做平台化。

这些能力以后可以出现，但必须由真实需求或失败证据拉动。

---

## 6. 第一轮验证路线

### TW-00 — Repository Bootstrap

- 建立仓库规则、产品总纲、最小目录职责与游戏模板。

### TW-01 — First Real Vertical

- 导入一个真实世界包；
- 导入一个真实主角 / 角色；
- 建立第一局游戏；
- 直接让 Agent 主持，不借助重型 Runtime。

### TW-02 — Long-session Reality Check

目标不是“文件都写对”，而是连续真实游玩后检查：

- 主持体验是否仍然自然、有创意、主动；
- 重要人物与关系是否还能正确恢复；
- 关键承诺与后果是否会丢；
- 场景 / 势力 / 世界状态是否漂移；
- 记忆压缩是否真的控制上下文；
- Save / Restore 是否足够可靠。

### TW-03 — Failure-driven Tooling

只针对 TW-02 真实暴露的重复失败增加工具、格式或校验。

### TW-04 — Productization Decision

基于真实体验决定：

- 继续保持纯 Agent workspace；
- 增加薄 UI / Launcher；
- 增加少量本地服务；
- 或证明某些 Runtime 能力确实不可替代。

---

## 7. Project Truth & AI Collaboration

正式工作优先读取：

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ 当前 game 的 README / state
→ 当前任务直接相关文件
```

跨项目开发方法、Skill 与 AI 协作规范不复制进本仓库作为第二事实源；需要时读取其 GitHub `main` 当前版本：

- [`zhangchenjia21-dot/Vibe-Coding`](https://github.com/zhangchenjia21-dot/Vibe-Coding)
- [`zhangchenjia21-dot/Skill`](https://github.com/zhangchenjia21-dot/Skill)

详细仓库级规则见 [`AGENTS.md`](AGENTS.md)。

---

## 8. Public Repository Safety

本仓库当前是 **public**。

不得提交：

- API Key、Token、Cookie、密码或私钥；
- 私密聊天原文；
- 不希望公开的个人信息；
- 受版权、保密或访问权限限制且无权公开的原始资料。

真实游戏内容在进入仓库前，也应先确认其适合公开。

---

## 9. 当前判断

`the-world` 现在不是一套已经证明正确的新架构，而是一个需要尽快被真实游玩证伪或证实的实验。

最重要的原则只有一句：

> **先让 Agent 和简单文件系统证明自己能不能把世界长期玩起来；只有真实失败，才有资格要求更多架构。**
