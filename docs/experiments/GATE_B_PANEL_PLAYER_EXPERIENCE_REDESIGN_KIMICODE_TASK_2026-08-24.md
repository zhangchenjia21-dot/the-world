---
title: Gate B｜the-world-panel 玩家体验重构｜KimiCode Task
status: active-task
updated: 2026-08-24
owner: the-world-panel
stage: Gate B
---

# Gate B｜the-world-panel 玩家体验重构｜KimiCode Task

## 0. 任务目标

当前 `the-world-panel` 已经证明：

- DSH Web / better-sidebar 插件路线成立；
- game workspace → UI 实时投影成立；
- 角色 / 人物 / 物品 / 系统 / 线程可以进入持久 UI；
- fs.watch + SSE 刷新成立；
- `/close-thread` 作为唯一窄写口可成立。

但当前 Panel 的核心问题不是“美术不够漂亮”，而是**信息架构仍然围绕文件 Owner，而不是围绕玩家体验**。

目前整体更像：

```text
PLAYER.md → 角色页
characters/ → 人物页
mechanics/STATE.md → 系统页
THREADS.md → 任务页
```

也就是“Game Workspace Inspector 的 RPG 皮肤版”。

本轮目标：

> **把 Panel 从“展示架构文档”重构为“成熟 RPG 的玩家信息界面”。**

正式原则：

> **Workspace is organized for truth maintenance; UI is organized for player decisions.**
>
> **工作区按事实归属组织，UI 按玩家需求组织。**

继续遵守既有原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**
>
> **UI is a projection of game truth, not a second truth source.**

---

# 1. Read First

实施前重新读取 current：

1. `docs/PRODUCT_SPEC_CURRENT.md`
2. `docs/ARCHITECTURE_CURRENT.md`
3. `docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md`
4. `plugins/the-world-panel/README.md`
5. `plugins/the-world-panel/lib/index.js`
6. `plugins/the-world-panel/src/client/index.jsx`
7. `games/luan-shi-sanguo/state/PLAYER.md`
8. `games/luan-shi-sanguo/state/CURRENT.md`
9. `games/luan-shi-sanguo/state/THREADS.md`
10. `games/luan-shi-sanguo/state/characters/INDEX.md`
11. `games/luan-shi-sanguo/mechanics/README.md`
12. `games/luan-shi-sanguo/mechanics/traveler-system/STATE.md`

当前真实游戏档 `games/luan-shi-sanguo` 是本轮主要 UX fixture，但实现不得硬编码这局的姓名、世界、机制或栏目。

---

# 2. 本轮最重要的架构裁定

## 2.1 UI 页面不再与 Owner 文件一一对应

允许一个玩家页面同时组合多个 canonical Owner 的事实。

例如“角色概览”可以来自：

```text
CURRENT.md
+ PLAYER.md
+ mechanics/*/STATE.md
+ THREADS.md
+ characters/
```

这不是第二事实源。

Panel 的 view model 是**瞬时投影**：

```text
Canonical Game Workspace
        ↓
Player-facing View Model
        ↓
RPG UI
```

不得把 view model 持久化为新的 game truth 文件。

## 2.2 玩家 UI 不展示开发者元数据

默认玩家视图中清除以下内容：

- raw id，例如 `player-zhangchenjia` / `char-mengdai`；
- `mechanic:`；
- `source:`；
- 文件路径；
- `updated` 原始字段；
- “本文件 Owner / 不归本文件”说明；
- Markdown 数据来源解释；
- 架构术语；
- 仅用于内部检索的 frontmatter 字段。

这些信息可以保留在内部数据模型 / debug 中，但不要进入普通玩家界面。

## 2.3 视觉权重必须体现“玩家现在最需要知道什么”

不要把所有 Markdown 分节等权平铺。

优先级大致是：

```text
当前状态 / 当前身份 / 当前危机 / 当前目标
>
人物关系 / 装备 / 资源 / 机制状态
>
背景 / 知识边界 / 历史细节 /低频说明
```

低频长内容可以折叠 / 展开，不要占据首屏。

---

# 3. 目标玩家信息架构

本轮建议最终导航：

```text
概览
角色
人物
行囊
事务
系统（有长期系统机制时才显示）
```

如果在真实实现中有更自然的命名，可以小幅调整，但必须保持玩家语义，不得退回文件名语义。

不要在本轮新增 Map / Faction / Save / Relationship 独立大页面；这些属于后续产品迭代。

---

# 4. 必做页面

## 4.1 概览｜新增

这是本轮最高优先级。

玩家打开「世界」Panel 后，应在 5 秒内知道：

- 我是谁；
- 我现在在哪里、什么时间；
- 我的当前关键身份；
- 当前最重要的身体 / 资源 / 机制状态；
- 当前最紧迫的局面；
- 当前最重要的事务；
- 最近有什么重要变化。

以当前三国档为例，合理的玩家体验接近：

```text
张宸嘉
暂署屯长 · 巨鹿郡兵曹
中平元年三月初十 · 夜
巨鹿郡城 · 兵曹后院

健康：良好
系统币：87

当前危机
绎幕黄巾约三五日攻城

当前事务
暗查内坊

近期变化
暂署屯长
暗查班子成立
查坊章程已定
```

以上只是信息层级示例，不要求逐字照抄，也不要硬编码三国字段。

概览必须是**聚合视图**，不能简单渲染某一个 Markdown 文件全文。

---

## 4.2 角色

从当前“PLAYER.md 美化渲染”改成真正的 Character Sheet。

顶部优先显示：

- 角色名；
- 当前核心身份；
- 基本身份摘要；
- 当前身体 / 状态摘要；
- 当前社会身份 / 组织位置。

正文按玩家价值分组，例如：

- 身份；
- 状态；
- 装备摘要；
- 社会关系 / 组织身份；
- 能力 / 长期特征；
- 背景与认知（低频，可折叠）。

“知识边界”仍然有价值，但不应和“当前身份 / 身体 / 装备”争夺首屏视觉权重。

不得显示 Owner 说明、文件路径、raw id 等开发信息。

---

## 4.3 人物

当前人物页接近 `characters/INDEX.md` 的视觉列表，需要从“通讯录”升级为“玩家已知人物界面”。

列表项至少应尽可能呈现：

- 显示名；
- 玩家可理解的身份 / 所属；
- 与主角关系；
- 状态；
- 最近确认地点 / 最近互动信息（有则显示）。

不要把 `char-xxx` 作为主要 UI 信息。

点击 / 展开人物时，应优先组织：

- 这个人是谁；
- 我与他的关系；
- 我知道他的哪些重要事实；
- 最近互动；
- 相关承诺 / 事务（如果可以从现有 truth 安全投影）。

可以提供轻量过滤，如：

```text
全部 / 身边 / 同伴 / 友好 / 中立 / 敌对 / 失联
```

但不要为了过滤修改 `characters/` 存储结构；分类全部仍是属性 / view。

必须继续遵守玩家知识边界：UI 不得因为文件里存在 GM 私有事实就自动展示。

---

## 4.4 行囊（原“物品”）

目标是让玩家看到“我拥有什么”，而不是“这些信息存在哪个 Owner”。

从多个 Owner 聚合后按玩家语义组织，例如：

```text
装备
随身
系统空间 / 背包 / 仓库
钱财 / 关键资源
```

不得显示：

- `→ ../mechanics/...`；
- source path；
- Owner 信息。

同一物品若被多个 Owner 以引用方式描述，不要因为投影聚合而重复显示两次；优先保持 canonical owner 内容，避免制造第二事实。

---

## 4.5 系统

只有本局存在适合作为玩家系统面板呈现的长期机制时显示。

当前 traveler-system 是主要 fixture。

目标：让玩家感觉“我拥有一个系统”，不是“我在读机制状态 Markdown”。

优先呈现：

- 系统名称 / 状态；
- 关键资源（如系统币）；
- 已解锁 / 未解锁模块；
- 商城；
- 鉴定 / 能力使用状态；
- 系统任务（如已有长期状态）。

隐藏：

- `mechanic:`；
- `source:`；
- holder raw id；
- updated raw metadata；
- 其它架构字段。

不得硬编码 traveler-system 的具体名称和字段才能正常工作；没有类似机制时本页自然隐藏。

---

## 4.6 事务（原“任务”）

当前这一页是现版本里最接近成熟 RPG UI 的部分，应以保留优点为主，不要推倒重做。

改名建议：**事务**。

原因：`THREADS.md` 不是 Quest DB，它还包含：

- 危机；
- 线索；
- 承诺；
- 债务；
- 玩家目标；
- deadline；
- 关系悬念。

建议玩家分类：

```text
紧急
进行中
长期
系统任务（若存在）
```

保留现有：

- 紧急 / 普通 / 长期排序能力；
- 两步确认归档；
- `/close-thread` 唯一窄写口。

不要扩大写权限。

---

# 5. Player-facing View Model

当前 client 已经通过标题正则把 Markdown 分节猜成 Inventory / Quest 等类型。这可以继续作为兼容手段，但本轮应该明确一层玩家视图转换。

目标不是建立 Universal Schema。

只要求在 Panel 内形成清晰边界：

```text
raw workspace projection
↓
player-facing selectors / view-model shaping
↓
render components
```

原则：

- View Model 不落盘；
- 不改变 Owner 文件；
- 不要求 World Core 为 UI 写额外字段；
- 不要求 Expansion 声明 UI contract；
- 对缺失字段宽容降级；
- 真实 workspace 中有信息就展示，没有就自然省略；
- 不为了让 UI“完整”编造数据。

如果现有 Markdown 写法确实无法可靠区分某项玩家信息，请记录为 `Remaining`，不要本轮直接升级成重 Schema。

---

# 6. 视觉与交互方向

当前卷轴 / 汉风视觉可以保留，它不是问题核心。

本轮重点是**信息层级与可扫描性**。

要求：

- 首屏减少大段说明文字；
- 高频信息使用清晰的数字 / badge / summary；
- 详情信息分层；
- 卡片不应每一块都拥有同等重量；
- 列表项应让玩家一眼区分“重要人物 / 当前危机 / 关键资源”；
- 侧栏宽度下仍然易扫读；
- 不要为了“像游戏”加入无信息价值的动画或装饰。

允许在现有 UI 风格上自行发挥，不要求复刻任何具体商业 RPG。

---

# 7. 硬边界 / Non-goals

本轮禁止借机建设：

1. 新 Game Workspace Schema；
2. JSON Entity DB；
3. Universal Manifest；
4. 额外长期 UI truth 文件；
5. 为 UI 修改 World Core maintenance 逻辑；
6. 为 UI 修改现有 Source Asset 格式；
7. Map；
8. Faction 大系统；
9. Save / Restore UI；
10. Combat UI；
11. 关系数据库；
12. 更多面板写权限。

`/close-thread` 仍是当前唯一允许的窄写口。

如果发现当前 workspace 真有阻塞 UX 的数据缺口，先在最终报告列为建议，不直接扩大架构。

---

# 8. Gate B 本轮验收

这轮不是要求 Gate B 自动 PASS，但它应把 Panel 推到可以进行玩家人工验收的状态。

完成后至少满足：

### AC-1｜不再像文件查看器

普通玩家界面不出现 raw Owner / path / id / source / mechanic metadata。

### AC-2｜有真正 Overview

打开 Panel 首屏能迅速回答“我是谁 / 我在哪 / 当前发生什么 / 最重要的事是什么”。

### AC-3｜UI 与 Owner 解耦

至少 Overview / 行囊 / 系统中存在真实跨 Owner 聚合，而不是一页对应一个文件。

### AC-4｜角色页有玩家信息层级

核心状态优先，背景 / 认知等低频信息退居次层。

### AC-5｜人物页从 ID 名册变为关系化人物视图

玩家不用理解 `char-*` 即可使用。

### AC-6｜事务页保留成熟部分

线程排序与归档能力不退化。

### AC-7｜Truth Boundary 不破坏

UI 不产生第二长期事实源；刷新后仍完全由 workspace 重建。

### AC-8｜不损伤 Gate A 游戏循环

Panel 是随时可看的辅助界面，不把游戏变成必须操作 UI 才能继续的流程。

### AC-9｜非三国特化

用一个最小第二 fixture / 空机制场景验证：

- 没有 system 时系统页自然隐藏；
- 没有 THREADS 时正常空态；
- 不同 character 名称 / 世界内容不崩；
- 不依赖“张宸嘉 / 三国 / traveler-system”硬编码。

---

# 9. 测试要求

继续保留并通过现有：

- `node --test plugins/the-world-panel/test/*.js`
- `scripts/smoke-render.mjs`

本轮应补足最小测试 / fixture，至少覆盖：

- 玩家技术元数据不会进入主要 view model；
- system absent 时页面隐藏；
- Overview 在部分 Owner 缺失时仍可降级渲染；
- THREAD 归档现有行为不回归；
- CRLF 兼容不回归。

不要为了测试搭大型 UI 测试框架。

---

# 10. 代码范围建议

主要修改：

```text
plugins/the-world-panel/src/client/index.jsx
plugins/the-world-panel/lib/index.js   # 仅在 projection / view-data 需要时
plugins/the-world-panel/test/
plugins/the-world-panel/scripts/
plugins/the-world-panel/README.md
plugins/the-world-panel/package.json   # 若按当前版本规范需要 minor bump
```

尽量不修改：

```text
plugins/the-world-core/
games/_template/
docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md
library/
```

除非发现现有代码中的明显同步文档漂移，可顺手修正 Panel 自身 README / package description。

---

# 11. 实施策略

优先顺序：

```text
1. Player-facing View Model 边界
2. Overview
3. 清除所有开发者元数据
4. Character UX
5. People UX
6. Inventory UX
7. System UX
8. Threads → Affairs 文案与保留归档
9. 跨场景 fixture / smoke
10. 文档同步
```

不要先做视觉微调再补信息架构。

本轮质量判断：

> **玩家体验 > 文件结构映射完整度 > 装饰性美术。**

---

# 12. 完成报告

KimiCode 完成后请给出：

1. 修改文件；
2. 新的信息架构；
3. Overview 聚合了哪些 canonical Owner；
4. 删除 / 隐藏了哪些开发者信息；
5. 人物 / 行囊 / 系统 / 事务分别如何从“文件视图”转成“玩家视图”；
6. 是否修改任何 workspace / Core（原则上应为否）；
7. 测试与 smoke 结果；
8. 第二 fixture / system-absent 验证结果；
9. Remaining：哪些体验问题因为当前 truth 数据不足而没有强行解决；
10. 最终 commit SHA。

完成后停下，不继续自行扩 Map / Save / Faction / Combat 等功能。

---

# 13. 一句话成功标准

> **玩家打开“世界”侧栏时，看到的是自己的角色、人物、行囊、系统与正在发生的事，而不是仓库里的 PLAYER.md、characters/、mechanics/ 和 THREADS.md。**
