---
title: Game Workspace Architecture v0.2
status: current
version: 0.2
updated: 2026-08-24
supersedes: archive/GAME_WORKSPACE_ARCHITECTURE_v0.1.md
parent: ARCHITECTURE_CURRENT.md
---

# Game Workspace Architecture v0.2

> v0.1（单一 CURRENT.md + npcs/）证明了「能持久化」，但真实试玩里 CURRENT.md 同时塞进了时间、世界态势、玩家状态、系统状态、NPC 名录、未解决后果、场景锚点七种职责。v0.2 把 workspace 从「能持久化」推进到「稳定的数据层」。

## 0. 服务三个消费者

```text
Agent 恢复世界  →  后台维护  →  RPG UI 投影
```

原则（不变）：

- **薄 Core**：稳定目录 + 明确 Owner + 很薄的索引约定；
- **Core 文件固定存在；实体与机制状态按需生成**——不为「看起来完整」建空文件；
- **一个事实只有一个 Owner**；
- **Freedom Before Prevention**：不做完整 Entity Schema、JSON 数据库、Universal Manifest、几十字段的类型定义；等第一个 RPG UI 插件真实读取时，再由真实需求决定哪些字段必须稳定。

## 1. 目录骨架

```text
games/<game-id>/
├─ README.md
├─ COMPOSITION.md
│
├─ state/
│  ├─ CURRENT.md           # Core
│  ├─ PLAYER.md            # Core
│  ├─ THREADS.md           # Core
│  ├─ WORLD.md             # 按需
│  ├─ characters/
│  │  ├─ INDEX.md          # Core（派生视图）
│  │  └─ <character-id>.md
│  ├─ organizations/       # 按需
│  │  ├─ INDEX.md
│  │  └─ <organization-id>.md
│  └─ places/              # 按需
│     ├─ INDEX.md
│     └─ <place-id>.md
│
├─ mechanics/
│  ├─ README.md            # Core（启用清单）
│  └─ <mechanic-id>/
│     └─ STATE.md          # 按需
│
├─ story/
│  └─ LEDGER.md
├─ memory/
│  ├─ DELTAS.md            # Core（待归并缓冲）
│  └─ RECENT.md
└─ saves/
   ├─ README.md
   └─ SAVE-xxxx/
```

## 2. 文件职责与 Owner

### 2.1 state/CURRENT.md — Resume Anchor

只回答一个问题：

> **如果现在换一个全新的 Session，它首先需要知道什么，才能立刻继续这一幕？**

包含：时间；当前位置与场景；玩家眼前的人；刚刚发生什么；当前最直接的问题/选择；本场景相关文档链接；公开大势摘要（几行，细节指向 Source）。

不包含：玩家完整状态、机制数值、人物详情、未解决后果清单——那些各有 Owner。检验标准：一条信息如果新 Session 第一回合用不上，就不该在 CURRENT 里。

### 2.2 state/PLAYER.md

玩家角色事实：身份与真实来历；社会身份（军籍、保人、师承、公开口径）；身体基本事实；装备/携带物；**知识边界**（角色本人知道什么）；不属于任何 Expansion 的长期角色事实。

不归 PLAYER：**时间与当前地点归 CURRENT.md**（场景属性，不是人物属性）；系统货币、关系值、能力成长、生存数值归 mechanics/。

### 2.3 state/WORLD.md（按需）

World Pack 是世界原始 Source；WORLD.md 是「这一局已经变成什么样了」：已偏离 Source 的重大事实、地区控制变化、重大公开事件、世界级进行中的冲突。**不复制世界包常识。**

建立触发条件：本局世界态势**第一次偏离 Source**。在此之前，CURRENT 里保留几行公开大势摘要即可。

### 2.4 state/THREADS.md

悬而未决的一切：未兑现承诺、未解决后果、玩家主动目标、未调查线索、债务、约定、deadline、关系悬念。

> 不叫 QUESTS——The World 里不是所有的事情都是任务。

约定：

- 每条线程有稳定 ID（T-xx）、`状态: open/closed`、挂起时间、相关方（引用 character id）、deadline（可选）；
- **THREADS 只装 open 线程**；closed 线程归档进 story/LEDGER.md，不留在 THREADS 里；
- UI 天然投影为 Journal / 当前事务。

### 2.5 state/characters/（原 npcs/）

**统一 Character Entity**：Source 历史人物（library/characters 角色卡）与本局原创 NPC 是同一存储体系，只用 frontmatter `来源: source | runtime-generated` 区分。

- **实体只存一次，分类全部变成属性。** 不按时间/阵营/地点建目录——NPC 会移动、变节、被俘、失踪、跨年份活很久，没有任何单一维度配当「文件真实位置」；
- 文件扁平存放，文件名 = `<character-id>.md`；id 稳定且可读（如 `char-mengdai`），显示名、状态、位置都可变，id 永不变；
- frontmatter 最小字段：`id / 姓名 / 状态(active·dormant·传闻·已故) / 当前位置 / 所属 / 来源 / 初次出现 / 最后确认 / 与主角关系`；
- `INDEX.md` 是**派生视图**：从各文件 frontmatter 汇总，可重新生成；Character 文件才是真相。检索与 UI 过滤全部走属性，不移动文件。

### 2.6 state/organizations/ 与 state/places/（按需）

只有当一个势力/地点在本局产生了 **game-local durable truth** 时才实例化——**不复制世界包里的州郡与势力清单**。各自带 INDEX.md，同样按 frontmatter 属性检索。

### 2.7 mechanics/

两层必须分清：

- `library/mechanics/` = **规则源**（不可变资产，规定机制怎么运作）；
- `games/<id>/mechanics/` = **本局运行状态**（规定这局里这个机制现在是什么）。

架构边界（必须守住）：

> **Expansion Pack 声明「哪些事实值得长期记住」；World Core 决定「这些事实存到哪里」。**
> Expansion 不声明具体文件路径、字段位置或存储格式。

- `mechanics/README.md` 固定存在：本局启用清单（机制 + 版本 + 状态档案链接/未建档原因）；
- `mechanics/<mechanic-id>/STATE.md` **按需建立**：机制第一次产生长期状态时建档；只增加裁定方式、没有长期状态的机制永不建档。

### 2.8 story/ 与 memory/

职责不变：story/ 回答「发生过哪些未来值得追溯的事」（LEDGER + 归档的 closed 线程）；memory/ 回答「下一次高质量主持最值得恢复什么」。两者都不替代 state/ 的 current truth。

memory/ 下有两个固定文件，对应后台维护的两层：

- `memory/DELTAS.md` — **Tier 1 捕获缓冲**：每回合后台维护只把本轮新产生的 durable facts 追加 1–3 行（谁 / 什么 / 变成什么样，可附建议 Owner），不逐 Owner 巡视、不重读重写旧文件。**条目自写入起即为有效事实**，恢复注入与存档都不得忽略；
- `memory/RECENT.md` — 压缩记忆，在 **Tier 2 检查点归并**时刷新：归并发生在场景收束 / 时间大跳 / 每 N 玩家回合（N 跟随 COMPOSITION.md 的自动存档间隔，无自动存档时由 World Core 默认节奏兜底），把 DELTAS 逐条写回正确 Owner 后移除已归并条目。

拆分理由：归并可延迟，捕获不可延迟——同回合捕获保证崩溃安全（写下的就是事实），批量归并保证每回合维护足够轻。

## 3. Saves：Persistent State ≠ Save Point

- **Persistent State**：世界实时保持真实，由后台 maintenance 持续维护（state/、mechanics/、story/、memory/），**与存档策略无关**。即使玩家选择永远手动存档，后台维护照常发生。
- **Save Point**：玩家可以回滚的历史快照。

### 3.1 Save Policy（开局 Setup 玩家选择，写入 COMPOSITION.md）

Setup 顺序：世界 → 拓展包 → 世界起点 → 玩家角色 → 操控模式 → **存档策略** → 最终确认。

可选档位：手动存档／每 5／10／20 玩家回合自动存档（默认推荐每 10）。

配套规则：

- **player turn = 一次玩家输入 → 一次 GM 正常回复**；后台 maintenance step 不计回合；
- **归并先于存档**：到达自动存档回合时，先把 memory/DELTAS.md 归并到各 Owner，再做存档快照（快照里不应残留大量未归并缓冲）；
- **里程碑兜底**：重大阶段切换（THREADS 大批量结算、势力归属变化、主角身份跃迁）时，无论回合计数都自动建立存档；
- 自动存档保留最近 5 个，超出滚动删除；**手动 SAVE 永不自动删除**。

### 3.2 快照内容

不要聪明，全量复制：

```text
saves/SAVE-xxxx/
├─ META.md          # 回合数 / 游戏内日期 / 触发原因（auto-turn·auto-milestone·manual·archive）
├─ COMPOSITION.md
├─ state/
├─ mechanics/
├─ story/
└─ memory/
```

不保存：saves/（自身）与 library/（共享 Source）。Markdown 体积很小，先完整复制最稳；证明太大再优化。

## 4. UI 投影映射（设计目标）

```text
角色 HUD        ← state/PLAYER.md
顶部时间/地点   ← state/CURRENT.md
Journal         ← state/THREADS.md
人物图鉴        ← state/characters/
势力界面        ← state/organizations/
地图            ← Source World Pack + state/places/
系统面板        ← mechanics/traveler-system/
人物能力        ← mechanics/capabilities/
关系界面        ← mechanics/relationships/
生存 HUD        ← mechanics/survival/
历史时间线      ← story/LEDGER.md
存档界面        ← saves/
```

UI 插件读 frontmatter 与 INDEX，不解析叙事正文；约定（路径稳定 + 单一 Owner + 稳定 id + 少量检索字段）写进 `games/_template/`，新游戏开局自动继承。

## 5. 迁移规则（v0.1 → v0.2）

1. 迁移前先建立归档 SAVE 快照（旧结构全量留档）；
2. npcs/ → characters/ 时**全仓重写链接**（CURRENT/LEDGER/README 等所有引用）；
3. 旧 CURRENT.md 按 Owner 拆分：场景锚点留下，玩家状态 → PLAYER.md，未解决后果 → THREADS.md（分 open/closed，closed 归 LEDGER），系统状态 → mechanics/traveler-system/STATE.md；
4. WORLD.md 不强行建立——世界态势第一次偏离 Source 时才建；
5. 后台 maintenance 分两层执行：每回合只做 Tier 1 delta 捕获（追加 memory/DELTAS.md），Tier 2 检查点归并时才按 Owner 批量写回对应文档——既不再一股脑写 CURRENT，也不再每回合逐 Owner 巡视。

首个迁移实例：`games/luan-shi-sanguo`（2026-08-24，归档快照 SAVE-01）。
