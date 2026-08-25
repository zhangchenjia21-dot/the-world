---
title: Restore Reliability v0.2｜KimiCode Implementation Task
status: implementation-task
created: 2026-08-25
owner: KimiCode
reviewer: GPT
baseline: current main
priority: P0
---

# Restore Reliability v0.2｜KimiCode Implementation Task

## 0. 为什么现在做

真实试玩已出现两个玩家可见故障：

1. 「保存当前进度」成功，但点击「恢复到这里」后玩家感觉没有恢复；
2. 每次恢复尝试都会新增一份「恢复前保护」，短时间内大量堆积，存档页与 `saves/` 都变乱。

本任务必须先修复 Restore 可靠性，再继续其它 RPG 功能。

Save Policy v0.2 已完成，不是本任务重写对象。

---

# 1. 已确认的真实证据

当前真实档 `games/luan-shi-sanguo-2/saves/` 已经存在重复显示编号：

```text
SAVE-04_恢复前保护 · 东汉 · 中平元年（184 年）
SAVE-04_隶义兵籍入张庄共谋
```

两者 META 都声称自己是 `SAVE-04`，但内容、kind、时间点不同。

同时连续出现：

```text
SAVE-03_恢复前保护 ...
SAVE-04_恢复前保护 ...
SAVE-05_恢复前保护 ...
```

且这些 protection 的 `game_time` 基本相同，说明玩家重复尝试 Restore 时每次都先产生了保护快照。

当前 Panel Restore 协议只传 `saveId`（如 `SAVE-04`），服务端再按编号寻找目录。因此当历史目录中存在同编号多个快照时，服务端可能恢复错误目录。

这属于 CONFIRMED bug class，不允许继续“找到第一个就恢复”。

注意：真实重复目录可能来自旧 Session / 旧插件时代的模型直写 SAVE。不要自动改名或删除真实试玩档来“修数据”；代码必须能够安全兼容已有脏数据。

---

# 2. Read First

必须先阅读：

- `docs/PRODUCT_SPEC_CURRENT.md`
- `docs/ARCHITECTURE_CURRENT.md`
- `docs/SAVE_POLICY_v0.2.md`
- `docs/experiments/POST_GATE_B_PANEL_CLEANUP_SAVE_RESTORE_KIMICODE_TASK_2026-08-24.md`
- `plugins/shared/存档.js`
- `plugins/shared/存档测试.js`
- `plugins/the-world-panel/lib/index.js`
- `plugins/the-world-panel/src/client/index.jsx`
- `plugins/the-world-panel/scripts/smoke-render.mjs`

并检查当前 DSH 公开 client runtime 的 Session / Workspace API。优先以当前安装版源码为准；必要时对照 `deepseek-ai/deepseek-harness` 当前公开源码。

不要修改：

- `games/luan-shi-sanguo/`
- `games/luan-shi-sanguo-2/`

所有破坏性验证使用临时 fixture。

---

# 3. 核心原则

保持：

```text
Save snapshot
= 可回滚 world workspace snapshot

Pre-restore protection
= Restore 操作的系统安全工件

Save ID / label
= 玩家显示信息

Storage reference
= 服务端确定性定位具体快照的唯一引用
```

重点：

> 玩家显示编号不能再兼任存储主键。

不要引入数据库、UUID 服务、通用事务框架或新的 Runtime 层。

---

# 4. P0：Restore 必须使用精确快照引用

## 4.1 `/saves` 返回 exact ref

`GET /saves` 的每个可恢复快照增加一个服务端生成的精确引用，例如：

```js
{
  id: 'SAVE-04',
  ref: 'SAVE-04_隶义兵籍入张庄共谋',
  label: '隶义兵籍入张庄共谋',
  ...
}
```

`ref` 可以直接使用经过严格验证的目录 basename，或者使用等价的 opaque ref。

要求：

- ref 必须由服务端枚举产生；
- 客户端不得提交任意 filesystem path；
- ref 只能精确匹配 `saves/` 下服务端可枚举的 snapshot；
- 禁止 `../`、分隔符逃逸和任意绝对路径。

## 4.2 Restore 请求发送 ref，不再只发送 id

Panel：

```text
POST /restore
{ saveRef: ... }
```

服务端必须精确恢复该 ref 对应目录。

旧客户端若仍发送 `saveId`：

- 只有该 id 在当前目录中唯一时才允许兼容解析；
- 若存在多个匹配目录，返回稳定错误：

```text
save-id-ambiguous
```

绝不能“取第一个”。

## 4.3 React / UI identity 也使用 ref

存档卡：

- React key 使用 `save.ref`；
- confirm target 使用 `ref`；
- restore target 使用 `ref`。

不能再用可能重复的 `SAVE-04` 作为唯一 UI identity。

---

# 5. P0：未来不得再制造重复 SAVE-NN

当前 `nextSaveId()` 必须按 **所有 `saves/` 顶层目录名** 扫描 `SAVE-(\d+)` 前缀取最大值 + 1，而不是只扫描“能被当前 parser 正常识别”的快照。

即使目录：

- META 损坏；
- legacy；
- duplicated；
- 旧模型生成；
- 当前不可恢复；

只要名字占用了 `SAVE-37...`，新玩家存档就不能再生成 `SAVE-37`。

新增测试：

```text
SAVE-04_A
SAVE-04_B
SAVE-09_legacy
```

下一新档必须是 `SAVE-10`。

不要自动重命名现有重复目录。

---

# 6. P0：Pre-restore protection 不再污染玩家 SAVE 命名空间

当前 protection 用普通 `SAVE-NN_恢复前保护`，既占编号又出现在玩家主列表，真实试玩已证明不好。

从本版本开始改成系统 recovery namespace，例如：

```text
saves/
├─ POLICY_STATE.json
├─ SAVE-01_...
├─ SAVE-02_...
└─ recovery/
   ├─ PRE-RESTORE-20260825T103501-001/
   └─ PRE-RESTORE-20260825T103812-002/
```

具体命名可微调，但要求：

- 新 protection 不再使用 `SAVE-NN`；
- 不参与玩家 SAVE 编号；
- snapshot 内容仍与当前保护语义一致；
- `saves/recovery/` 不进入正常 world snapshot；
- 仍然可供异常时人工恢复。

不要迁移或删除已有 `SAVE-NN_恢复前保护`；兼容识别即可。

---

# 7. Protection 生命周期 / UI

## 7.1 默认不进入普通存档列表

玩家存档主列表默认显示：

- manual
- milestone
- auto-checkpoint
- legacy user save（若需要兼容显示）

`pre-restore` protection 不应与正常玩家存档平铺。

Panel 可以增加一个很轻的折叠区：

```text
恢复保护（系统）  2
```

默认收起。

说明一句：

> 恢复前自动建立的安全副本，仅用于回档异常时撤回。

不要把它做成新的复杂管理页。

## 7.2 Protection rotation

只保留最近 3 份成功 protection。

旧 `SAVE-NN_恢复前保护` 不强制自动清理；新的 `recovery/` 工件按最近 3 份滚动。

## 7.3 Restore 失败时

如果：

- protection 已创建；
- restore 中途失败；
- 自动 rollback **确认完整成功**；

则删除本次刚创建的 protection，避免失败重试制造垃圾。

如果 rollback 不完整或保留了 staging/backup：

- protection 必须保留；
- 不做 rotation 删除该次重要恢复材料；
- fail loud。

---

# 8. P0：恢复成功后立刻进入不可重复点击状态

当前真实体验是玩家觉得“没发生”，会再次点击，导致保护档堆积。

客户端收到 `/restore` 成功响应后，必须**立刻**：

1. 将 Restore UI 切换为全页成功中间态；
2. 隐藏/禁用所有 Restore 按钮；
3. 显示：

```text
世界已恢复至：<目标存档时间/名称>
正在进入恢复后的新会话……
```

然后才尝试 fresh-session switch。

即使 Session 切换需要数秒，玩家也必须知道 workspace restore 已经成功，不能通过重复点击再次执行 Restore。

---

# 9. 服务端 Restore 返回可验证结果

`POST /restore` 成功响应至少返回：

```js
{
  ok: true,
  restoredRef: '...',
  restoredId: 'SAVE-04',
  restoredLabel: '...',
  restoredGameTime: '...'
}
```

如果目标 META 没有 `gameTime`，可以返回 null，但 ref / label 必须明确。

不要仅返回模糊的 `restored: SAVE-04`。

这让客户端能明确告诉玩家“文件层已经恢复到哪一份”。

---

# 10. Fresh Session：重新验证真实 DSH seam

当前设计原则仍然正确：

> Restore 后不得继续使用包含未来历史的旧 Session。

但真实试玩出现“恢复无效”的体验，所以必须重新验证当前实际 DSH Web runtime 的 public API，而不是只依赖 mock。

检查：

- `sessions.create({ workspaceId })` 的真实返回值；
- `sessions.open(...)` 的真实参数；
- 当前 client plugin 如何可靠获得 `workspaceId`；
- `ctx.get('workspaces')` 是否是当前公开、可用的 client seam；
- 是否应该显式 inject/use `workspaces` service。

目标成功流程：

```text
POST /restore 成功
↓
UI 立即锁定为“世界已恢复”
↓
创建 restore 完成以后出生的新 Session
↓
open 新 Session
↓
World Core session-start 从 restored workspace 注入 recovery
```

如果自动切换失败：

```text
世界文件已经成功回档。
自动进入新会话失败；当前聊天仍含有回档后的“未来历史”，不能继续使用。
请在当前工作区新建会话后继续。
```

此 fallback 页面中不要再次提供 Restore 按钮。

不要为了自动切换成功而复用 restore 前出生的 blank session。

---

# 11. Server / client error semantics

增加或稳定化错误码：

- `invalid-save-ref`
- `save-ref-not-found`
- `save-id-ambiguous`
- `save-incompatible`
- `restore-failed`
- `agent-running`
- `busy`

玩家 UI 显示自然中文，不显示文件路径。

---

# 12. 兼容旧 protection / duplicate save

必须用 fixture 构造：

```text
SAVE-04_恢复前保护...
SAVE-04_隶义兵籍入张庄共谋
```

要求：

1. `/saves` 能同时枚举两者且 ref 不同；
2. React key / confirm target 不冲突；
3. 选择里程碑档时精确恢复里程碑档；
4. 旧 `saveId: SAVE-04` 请求返回 `save-id-ambiguous`，不猜；
5. 新建普通存档不得再次使用已占用编号。

不要通过“把 fixture 里的 protection 删掉”让测试变绿。

---

# 13. 测试要求

至少覆盖：

### Identity

1. duplicate `SAVE-04` 能被 exact ref 区分；
2. ambiguous id fail closed；
3. invalid ref/path traversal 被拒绝；
4. nextSaveId 扫描所有 SAVE 前缀目录。

### Protection

5. 新 protection 进入 `saves/recovery/`；
6. 不消耗 SAVE-NN；
7. 主列表默认不平铺 protection；
8. latest 3 rotation；
9. restore 失败且 rollback 完整时删除本次 protection；
10. rollback 不完整时保留 protection/recovery material。

### Restore

11. exact target 被恢复，不能误命中同 id 的另一目录；
12. server success payload 带 exact target 信息；
13. 客户端收到成功后立即禁止重复 Restore；
14. fresh-session success path；
15. fresh-session fallback path；
16. fallback 不再次暴露 Restore 按钮。

### Regression

17. manual save 正常；
18. Save Policy v0.2 interval/milestone tests 全绿；
19. Windows 中文路径 / CRLF 回归不退化；
20. `saves/` / recovery 不进入 world snapshot。

所有测试用临时 fixture。

---

# 14. 非目标

本轮不要：

- 改 World Workspace v0.2；
- 改 Save Policy v0.2 策略语义；
- 做删除存档 UI；
- 做存档缩略图；
- 做云存档；
- 做地图/战斗/关系新功能；
- 自动清理真实试玩档中的历史 protection；
- 新增数据库；
- 给模型重新开放直接创建 SAVE 的职责。

---

# 15. 版本与提交

这是玩家可见 Restore bug fix。

实现完成后同步：

- `plugins/the-world-panel/package.json`
- Panel README
- 必要时 shared README / architecture notes

World Core 只有在 fresh-session integration 真有必要时才改；不要无关 bump。

建议 2～4 个 commit：

```text
fix(save): make snapshot references unambiguous
fix(save): isolate restore protection snapshots
fix(panel): make restore completion explicit
 test(restore): cover duplicate ids and fresh-session flow
```

---

# 16. 最终报告

按此格式：

```text
RESULT
PASS / PASS WITH LIMITATION / FAIL

ROOT CAUSE
- duplicate SAVE id 是否确认
- fresh-session seam 是否另有问题

FIXED
- exact ref
- protection namespace / rotation
- restore success state
- fresh-session behavior

TESTS
- 命令 + 结果

REAL DSH SEAM FINDING
- 当前实际 create/open/workspaceId 用法

COMPATIBILITY
- 旧 duplicate / 旧 protection 如何处理

REMAINING RISKS
- 只列真实未解决问题

COMMITS
- sha + message
```

完成后自行 commit + push `main`。不要修改真实游戏档。
