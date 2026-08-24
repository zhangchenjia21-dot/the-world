---
title: KimiCode Task｜Post-Gate-B Panel Cleanup + Save / Restore v0.1
status: ready-for-implementation
date: 2026-08-24
owner: The World
implementation_target: plugins/the-world-panel + minimal shared save utility
baseline: main >= 278845e994add1cfff417a8dd2750988ca7e4391
gate_b: PASS
---

# KimiCode Task｜Panel 收边 + Player-facing Save / Restore v0.1

## 0. 任务结论先行

Reality Gate B 已由玩家人工裁定 **PASS**。

本任务不是继续证明 Gate B，也不是继续扩张 RPG UI 功能面，而是进入 Gate B 之后的正常产品迭代：

1. 对 `the-world-panel 0.2.x` 做一轮很小的玩家界面收边；
2. 在同一个 Panel 中实现第一版真正的 **Player-facing Save / Restore**；
3. Restore 必须同时解决 **workspace 回档 + DSH Session 上下文边界**，不能只复制文件。

核心语义：

> **Persistent State ≠ Save Point。**

> **恢复文件到 T2，但继续使用已经经历 T5 的 Session，不算真正 Restore。**

> **恢复后必须进入一个在恢复完成之后新创建的 DSH Session。**

不要在本任务里做 Map / Combat / Relationship / Faction / Save Timeline 动画等额外功能。

---

# 1. 开始前必须做的事

## 1.1 Git

先：

```text
git pull --rebase origin main
```

当前 main 已包含 GPT 更新的 canonical docs 与 Gate B PASS 记录。不要回退这些文档。

## 1.2 Read First

至少读取：

- `docs/PRODUCT_SPEC_CURRENT.md`
- `docs/ARCHITECTURE_CURRENT.md`
- `docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md`
- `docs/GATE_B_ACCEPTANCE_v0.1.md`
- `docs/experiments/GATE_B_FINAL_2026-08-24.md`
- `docs/experiments/GATE_B_PANEL_PLAYER_EXPERIENCE_REDESIGN_KIMICODE_TASK_2026-08-24.md`
- `plugins/the-world-panel/README.md`
- `plugins/the-world-panel/lib/index.js`
- `plugins/the-world-panel/src/client/index.jsx`
- `plugins/the-world-panel/src/client/viewmodel.js`
- `plugins/the-world-core/lib/index.js`
- `plugins/the-world-core/lib/提示文本.js`
- `plugins/shared/游戏定位.js`
- `games/luan-shi-sanguo/saves/README.md`
- 至少检查 `SAVE-01` 与 `SAVE-04` 的目录形态 / META。

## 1.3 DSH Session Seam Survey（先查当前安装版，再编码）

必须检查当前本地安装的 DeepSeek Harness 公共 client / host API，至少确认：

- Client `SessionRuntime.create` / `sessions.create` 的真实签名；
- 如何把一个新 session 切到当前 UI stage / open；
- WorkspaceRuntime / workspaces service 如何取得当前 workspace；
- Host `session.create({ workspaceId })` 的当前契约；
- Agent `status` / 当前 session running 状态如何读取。

官方当前设计语义可作为方向参考，但**以本地安装版真实 API 为准**：

- `session.create({ workspaceId })` = Host 创建 Session + Agent + cwd 的正式入口；
- `WorkspaceRuntime.connectWorkspace(workspaceId)` 可能复用已有 blank session；
- `SessionRuntime.create` 可以显式创建新 session；
- Host 侧不要直接用 `ctx.sessions.create()` 冒充完整 Agent 创建流程。

### Restore 特别注意

**Restore 后不能使用 `connectWorkspace()` 的 blank reuse 作为默认方案。**

原因：一个 restore 之前就已经存在的 blank session，其 `agent/session-start` 可能已经读取了旧 workspace；即使它尚无玩家消息，也不保证是“恢复后的新上下文”。

Restore 成功后需要：

> **显式创建一个 restore 完成之后才出生的全新 Session。**

优先使用当前安装版公开的 `SessionRuntime.create({ workspaceId })` / 等价正式 client API，再 open / stage 它。

如果当前安装版确实没有可安全使用的公开 client seam：

- 不要发明 DSH 内部私有调用；
- Restore 文件操作仍可完成；
- 返回 `requiresNewSession: true`；
- UI 必须显眼告知「恢复完成；当前聊天包含未来历史，不能继续，请创建全新 Session」；
- 但在最终报告中把“无法自动切新 Session”列为明确 Remaining，不能假装完整闭环。

---

# 2. 本任务不可改变的架构边界

## 2.1 Workspace truth 不为 UI 改 Schema

继续遵守：

> **Workspace is organized for truth maintenance; UI is organized for player needs.**

不要因为 Save UI 或 Panel cleanup 去改变：

- `state/PLAYER.md`
- `state/CURRENT.md`
- `state/THREADS.md`
- `characters/`
- `mechanics/`

的 Owner 语义。

## 2.2 UI 不是第二事实源

Save 列表、玩家显示名、兼容性判断都是瞬时投影。

不要新增长期 UI DB / JSON state store。

## 2.3 Save / Restore 是窄确定性能力

创建快照、列出快照、恢复快照不需要模型创作判断。

因此：

> **不要让模型来复制文件、解释是否成功或执行回档。**

使用 Node 侧确定性实现。

## 2.4 不碰 DSH internals

使用公开服务 / RPC / Client Runtime seam。

不要 patch：

- Agent Loop internals；
- Session event log；
- persistence backend 文件；
- DSH Web 私有 DOM；
- 未公开内部 store。

---

# 3. Part A｜Panel 0.2.x 玩家界面收边

这部分是小修，不重新设计 UI。

## A1｜彻底清掉残余开发信息

当前截图仍能出现：

- `char-tianshi`
- `char-mengdai`
- `char-bingcaoyuan`
- `PLAYER.md`
- `LEDGER`
- 其它裸 `.md` / internal id 引用。

要求：

### Character id

当玩家文本里出现 `char-*` 时：

1. 如果能从当前 characters INDEX / view model 找到对应人物显示名：显示人物名；
2. 找不到映射：不要把 internal id 显示给玩家，隐藏该 id；
3. 不改 canonical 文件原文。

例如：

```text
田石（char-tianshi）
→
田石
```

### File refs

`详见 PLAYER.md 与 LEDGER`、`见 xxx.md` 等开发者引用不进入玩家主界面。

只清理 presentation；不要重写 Owner 文件。

## A2｜角色页与行囊去重复

独立「行囊」已经存在后：

- `角色`页不再完整渲染装备 / 携带物分节；
- `行囊`成为装备、随身物品、系统空间、仓储类内容的玩家界面 Owner；
- `角色`页集中于身份 / 社会身份 / 身体 / 能力（如有）/ 背景与知识边界（低频折叠）。

不要为了去重删除 PLAYER.md 中的装备事实；只改变 UI 投影。

## A3｜Hero 摘要压缩

当前 Hero 仍可能把完整军籍 / 晋升过程 / 警语塞成多行长文。

目标：Hero 只承担快速识别。

建议视觉语义：

```text
张宸嘉
暂署屯长 · 巨鹿郡兵曹
23 岁 · 男 · 现代穿越者
```

不要硬编码这些字段；从现有身份 / 社会身份语义里提取最值得第一眼看的 1–2 行。

详细晋升过程、太守原话、公开口径继续留在角色页正文 / 近期变化，不塞 Hero。

## A4｜玩家显示层本地化

Canonical 文件可以继续用稳定英文状态词。

UI 显示层做映射，例如：

```text
active     → 当前 / 活跃（按语境）
open       → 进行中
deadline   → 时限
dormant    → 暂离 / 休眠（按语境）
```

不要把 canonical truth 改成中文字段来服务 UI。

## A5｜不要过度 polish

本轮不重做配色、字体、布局体系。

只修上面四项。

---

# 4. Part B｜Player-facing Save / Restore v0.1

## B1｜新增「存档」页

Panel 主分页变成：

```text
概览 / 角色 / 人物 / 行囊 / 事务 / 系统（按需） / 存档
```

`存档`对 confirmed game 始终可见。

玩家页只显示：

- 存档名称；
- 游戏内时间（能读取时）；
- 类型：手动 / 自动回合 / 里程碑 / 恢复前保护 / 旧存档；
- 创建时间（能读取时）；
- 是否可恢复；
- `恢复到这里` 操作。

不要显示真实目录路径。

顶部提供：

> **保存当前进度**

可允许玩家输入一个简短存档名；没有输入时自动生成友好名称。

---

# 5. Save 列表与兼容性

## B2｜兼容现有 saves

当前仓库已有历史存档：

- `SAVE-01_架构v0.1迁移前`：归档意义优先，可能不是 v0.2 可恢复结构；
- `SAVE-02...SAVE-04`：检查真实结构后判断兼容性。

不要因为旧 META 格式不同就崩。

每个 save 投影：

```text
id
label
type
gameTime
createdAt
restorable
reasonIfNotRestorable
```

这是 view model，不另建数据库。

## B3｜v0.2 可恢复结构判定

第一版不要做复杂 schema version migration。

一个 save 至少要有当前恢复所需的结构，例如：

```text
COMPOSITION.md
state/CURRENT.md
state/PLAYER.md
state/THREADS.md
state/characters/INDEX.md
mechanics/README.md
story/LEDGER.md
memory/DELTAS.md
memory/RECENT.md
```

缺失关键 v0.2 Owner：

- 仍可在列表显示；
- 标记「旧版归档 / 当前版本不可直接恢复」；
- 禁用 Restore；
- 不偷偷补结构后恢复。

`WORLD.md`、organizations、places、具体 mechanic STATE 都是按需，不作为必需项。

---

# 6. Manual Save｜确定性创建快照

## B4｜快照内容

严格遵守 Workspace v0.2：

```text
SAVE-xxxx_友好名称/
├─ META.md
├─ COMPOSITION.md
├─ state/
├─ mechanics/
├─ story/
└─ memory/
```

不复制：

```text
saves/
library/
```

## B5｜新 META 最小格式

保持 Markdown-first，可以使用很薄的 frontmatter，例如：

```yaml
---
save_id: SAVE-05
kind: manual
workspace_schema: 0.2
created_at: 2026-08-24T22:30:00+08:00
game_time: 中平元年三月初十夜
label: 暗查内坊开局
source_session: <session-id，可选，仅用于追溯>
---
```

只用于存档自身身份 / 恢复判断。

不要发展成通用 Save Manifest DSL。

## B6｜目录名安全

玩家输入的 label 不能直接成为任意路径。

- 目录编号由服务端生成；
- label 做最小文件名清洗 / 截断；
- 不允许 `..`、绝对路径、分隔符逃逸；
- API 选择存档只接受服务端枚举出的 save id / 安全相对标识，不接受任意路径。

## B7｜DELTAS 语义

Manual Save 不需要为了“看起来干净”强制模型先做一次归并。

原因：

> `memory/DELTAS.md` 从写入起就是 canonical durable facts；快照包含它就不会丢事实。

自动检查点仍按现有 World Core 语义尽量「归并后存档」。本任务不要重写整个自动存档 lifecycle。

---

# 7. Restore｜真正回档

## B8｜Restore 前置确认

`恢复到这里`必须至少两步确认。

玩家要明确看到：

> 恢复会把当前世界状态替换为该存档；当前聊天历史不会被改写，因此恢复后必须进入全新 Session 才能继续。

不要一个误触就回档。

## B9｜只允许 idle 时 Save / Restore

当前 Agent 正在生成 / maintenance / tool execution 时：

- Save 按钮禁用或等待；
- Restore 必须拒绝。

Client 做 UX guard；Host/Node 侧也应利用当前 DSH 公开 `agents` / session status 能力做一次权威检查，防止直接 POST 绕过前端。

不要在正在写 workspace 的 turn 中间做 Restore。

## B10｜Restore 前自动建立保护存档

任何正式 Restore 在修改 live workspace 前：

1. 先创建一个当前 live state 快照；
2. `kind: pre-restore`；
3. label 类似：`恢复前保护 · <当前游戏时间>`；
4. 此类存档视为玩家保护点，**不参加自动档滚动删除**。

如果保护存档创建失败：

> Restore 直接失败，不修改 live workspace。

遵守：**Prefer recovery over prevention。**

## B11｜恢复内容

选择的 save 只恢复：

```text
COMPOSITION.md
state/
mechanics/
story/
memory/
```

永远不覆盖：

```text
saves/
library/
```

这意味着：

- 玩家回到过去世界状态；
- 但所有存档（包括刚建立的 pre-restore）继续存在。

## B12｜替换语义必须是真正 snapshot restore

Restore 不是“把存档里有的文件覆盖一遍”。

如果 live workspace 在 T5 多了一个人物 / mechanic / place，而 T2 save 里没有：

> 回到 T2 后这些 T5-only live 文件也必须消失。

因此对 `state/ mechanics/ story/ memory/` 要按 snapshot 语义**整体替换**，而不是 merge copy。

## B13｜失败安全

第一版至少做到：

- restore 源完整验证在任何 live mutation 之前完成；
- 先建立 pre-restore save；
- 使用 staging / sibling temp 方案，避免直接从 save 一边读一边破坏 live；
- 发生中途错误时 fail loud，并尽可能保持 / 恢复原 live state；
- 不允许留下“半个 T2 + 半个 T5”的成功响应。

不要求建设重型事务引擎，但 Restore 是高风险窄写口，必须比普通 UI 写操作更谨慎。

## B14｜同一 game 的写操作串行

同一个 game 同时只允许一个：

- manual save；
- restore；
- 其它未来 save mutation。

使用简单进程内 per-game lock / mutex 即可，防止双击并发。

不要建设分布式锁。

---

# 8. Restore 后的 DSH Session 边界（最高优先级）

## B15｜绝不能在旧 Session 继续

DSH Session 自身保存已经发生过的对话历史。

因此：

```text
旧 Session：经历到 T5
↓
workspace Restore 到 T2
↓
继续在旧 Session 发消息
```

是错误状态。

模型会同时看到：

- restored T2 workspace；
- Session 中 T3–T5 的未来对话历史。

这破坏知识边界与世界因果。

## B16｜成功路径：恢复后显式创建全新 Session

顺序必须是：

```text
1. 当前 Agent idle
2. pre-restore protection save
3. restore workspace 完成
4. 服务端返回成功
5. 客户端在同一个 DSH Workspace 下显式 create 一个全新 Session
6. open / stage 新 Session
7. World Core 的 agent/session-start 从 restored workspace 做 recovery
8. 玩家继续
```

### 关键：不要 reuse restore 前出生的 blank session

优先：

```text
SessionRuntime.create({ workspaceId })
```

或当前安装版真实等价公开 API。

不要默认使用可能复用旧 blank 的 `connectWorkspace()`。

## B17｜不要改写 / 删除旧 Session 历史

Restore 世界 ≠ 删除聊天记录。

旧 Session 留作历史 / 调试即可。

本任务不要自动删除它，也不要试图篡改其 append-only log。

如果未来需要“回档后隐藏未来 Session”，另做产品决策。

## B18｜自动切换做不到时的安全 fallback

若本地 DSH 当前版本没有公开、安全的 client create + open seam：

- Restore 文件层仍可 PASS；
- UI 必须进入明显的 `RESTORE COMPLETE / NEW SESSION REQUIRED` 状态；
- 不得显示成“恢复完成，可继续聊天”；
- 最终报告标记自动新 Session 为 Remaining。

但实现前要认真检查当前 `sessions` / `workspaces` client service，不要因为没第一眼找到就直接放弃。

---

# 9. Save UI 建议体验

保持当前卷轴 / 卡片风格，但围绕玩家操作。

## 当前状态

页首可以是：

```text
当前进度
中平元年三月初十 · 夜
[保存当前进度]
```

## 存档卡

例如：

```text
暗查内坊开局
中平元年三月初十 · 夜
手动存档 · 今天 22:31

[恢复到这里]
```

自动档：

```text
第 15 回合自动存档
中平元年三月十一 · 清晨
自动存档
```

旧版不可恢复档：

```text
架构 v0.1 迁移前
旧版归档
当前版本不可直接恢复
```

不要把：

- SAVE 真实目录名；
- META 路径；
- workspace schema；
- source session id

默认展示给玩家。

这些只用于内部 / debug。

---

# 10. API Surface 建议

可以沿用 Panel 自有前缀，建议但不强制具体名字：

```text
GET  /the-world/panel/saves
POST /the-world/panel/save
POST /the-world/panel/restore
```

现有：

```text
GET  /state
GET  /events
POST /close-thread
```

继续保留。

要求：

- request body 有界；
- 返回稳定错误码；
- 错误必须在 UI 显形；
- 不吞异常；
- 不接受任意 filesystem path；
- 选中的 game 必须继续走现有 `resolveGame` / session cwd 权限边界。

---

# 11. Shared Utility Ownership

Save / Restore 的文件语义不应只埋在 React 组件里。

推荐新增一个很薄的 Node-only 共享模块，例如：

```text
plugins/shared/存档.js
```

负责：

- list / inspect save；
- create snapshot；
- compatibility validation；
- restore snapshot；
- label / id safety；
- 最小 META 解析。

`the-world-panel` 负责：

- HTTP / UI；
- 玩家确认；
- DSH session switch。

未来 World Core 如果需要把自动存档改成 deterministic snapshot，也可以复用同一个 helper；**本任务先不要顺手重构 World Core 自动存档，除非当前实现明确必须共用才能保证一致。**

---

# 12. Tests｜必须覆盖

## 12.1 Panel cleanup

至少：

- `char-tianshi` → `田石`；
- 未知 `char-*` 不直接泄漏；
- `PLAYER.md / LEDGER / xxx.md` 引用不进入玩家正文；
- 角色页不再完整重复行囊；
- `active/open/deadline` 玩家显示层转换；
- Hero 不再塞完整社会身份长段。

## 12.2 Save utility

使用临时 fixture，不污染真实游戏档：

1. 列出现有 compatible / legacy save；
2. manual snapshot 内容完整；
3. `saves/` 不递归复制进 save；
4. label path traversal 被拒绝 / 清洗；
5. incompatible save restore fail before mutation；
6. restore 前生成 pre-restore protection save；
7. snapshot restore 会删除 T5-only live 文件；
8. saves/ 本身在 restore 后原样保留；
9. 并发第二个 restore/save 被拒绝或排队，不交错写；
10. Windows path / CRLF 不导致识别失败。

## 12.3 Session boundary

至少用 mock / client fixture 验证：

- Restore 成功前不会 create 新 session；
- Restore 成功后 create 的是**全新 session**；
- 不调用 blank-reuse path 作为 restore 默认；
- 新 session 的 cwd / workspace 与当前游戏一致；
- 自动切换 seam 不可用时返回 / 显示 `requiresNewSession`；
- 当前 agent running 时 restore 被拒绝。

## 12.4 Render smoke

继续保持现有 smoke；新增：

- `存档` tab；
- compatible save 显示 Restore；
- legacy save Restore disabled；
- manual save 成功刷新列表；
- restore 两步确认；
- error 显形。

---

# 13. Acceptance Criteria

## AC-1｜Panel cleanup

玩家主界面不再出现明显 `char-* / PLAYER.md / LEDGER / raw .md` 开发信息。

## AC-2｜Information ownership

角色与行囊不再完整重复同一装备清单；Hero 更像 RPG 摘要而不是文档摘录。

## AC-3｜Save List

当前 v0.2 saves 与 legacy saves 均可浏览；兼容性明确；不显示真实路径。

## AC-4｜Manual Save

玩家在 idle 状态可以一键创建可恢复完整快照；不经过模型。

## AC-5｜Pre-restore Recovery

任何 restore 修改 live state 之前一定先生成保护存档；保护失败则不 restore。

## AC-6｜Snapshot Restore

恢复后 live `COMPOSITION/state/mechanics/story/memory` 与目标 save 一致；T5-only 文件不会残留；`saves/` 保留。

## AC-7｜Session Coherence

Restore 后不能继续使用 restore 前的 Session。

最佳结果：自动显式创建并切换到**恢复后出生的全新 DSH Session**。

安全 fallback：明确 `requiresNewSession`，绝不假装旧 Session 可继续。

## AC-8｜No DSH Internal Coupling

不 patch DSH internals，不直接改 session persistence 文件，不把 `ctx.sessions.create()` 当完整 Agent 创建路径。

## AC-9｜Regression

- 原有概览 / 角色 / 人物 / 行囊 / 事务 / 系统工作；
- Thread 归档仍工作；
- SSE 刷新仍工作；
- second fixture 仍工作；
- standard preset / better-sidebar 缺失时行为不退化。

## AC-10｜Tests Green

新增单测 + 当前测试 + smoke 全部通过。

---

# 14. 明确 Non-scope

本任务不要实现：

- 删除存档；
- 云存档；
- 分支时间线可视化；
- Session log 回滚；
- 把旧 Session truncate 到过去；
- 自动 archive 旧 Session；
- 跨游戏导入 save；
- save schema migration engine；
- diff save；
- Map；
- Combat；
- Relationship / Faction 新页；
- 复杂动画；
- World Core 大重构。

如果过程中发现这些“以后会需要”，写进 Remaining，不扩 scope。

---

# 15. Versioning / Docs

完成后：

- `the-world-panel` 做合理 minor bump（预计 `0.3.0`，因为新增 Save / Restore 玩家能力）；
- README 同步新分页与 Save / Restore 语义；
- 更新相关 canonical docs，只记录已经实现的事实；
- 不把仍未实现的自动新 Session fallback 写成已完成。

不要改资产仓库。

---

# 16. 提交建议

建议拆成可审阅的 commits：

```text
fix(panel): finish player-facing cleanup
feat(save): add deterministic save snapshot service
feat(panel): add save restore player flow
fix(restore): enforce fresh-session boundary
chore(panel): bump version and sync docs
```

不强制 commit 数量，但不要把所有改动揉成一个不可审阅提交。

---

# 17. 最终报告格式

完成后回复：

```text
Result
PASS / PARTIAL / BLOCKED

Panel Cleanup
- ...

Save
- ...

Restore
- ...

Fresh Session Boundary
- 使用的 DSH public seam：...
- 是否自动切新 Session：YES / NO
- 若 NO，安全 fallback：...

Compatibility
- SAVE-01: ...
- SAVE-02...: ...

Tests
- unit: x/x
- smoke: x/x

Files Changed
- ...

Commits
- ...

Remaining
- ...
```

如果 Restore 文件层成功但自动 fresh-session seam 没有闭环，最终 Result 不要报完整 PASS，应至少标记 `PARTIAL`，并明确原因。
