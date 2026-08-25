---
title: Save Policy v0.2｜KimiCode Implementation Task
status: implementation-task
created: 2026-08-25
owner: KimiCode
reviewer: GPT
baseline: current main
---

# Save Policy v0.2｜KimiCode Implementation Task

## 0. 任务目标

在当前 `the-world/main` 基线上实现 **Save Policy v0.2**。

本任务不是重写 Save / Restore，也不是扩 RPG UI。

只解决：

1. `每 N 玩家回合` 自动存档必须跨 DSH Session 连续计数；
2. `里程碑` 必须成为真实可执行的自动存档策略；
3. Setup 中玩家选择的 Save Policy 必须与实际执行一致；
4. 自动存档失败必须可发现，但不要污染 RPG Chat。

Read First：

- `docs/SAVE_POLICY_v0.2.md` —— **本任务语义权威**
- `docs/PRODUCT_SPEC_CURRENT.md`
- `docs/ARCHITECTURE_CURRENT.md`
- `plugins/shared/存档.js`
- `plugins/shared/存档测试.js`
- `plugins/shared/游戏定位.js`
- `plugins/the-world-core/lib/index.js`
- `plugins/the-world-core/lib/提示文本.js`
- `plugins/the-world-core/test/事件接线冒烟测试.js`
- `plugins/the-world-panel/lib/index.js`
- `plugins/the-world-panel/src/client/index.jsx`

不要修改真实试玩档：

- `games/luan-shi-sanguo/`
- `games/luan-shi-sanguo-2/`

所有测试使用临时 fixture。

---

# 1. 硬边界

保持：

```text
COMPOSITION.md
= 玩家确认过的 Save Policy 真相源

Save Policy runtime state
= deterministic execution bookkeeping

state/story/memory/mechanics
= game-local world truth
```

不要：

- 把计数器塞进 `state/CURRENT.md`；
- 让模型维护 player turn counter；
- 让模型自己创建 / 删除 SAVE 目录；
- 用 diff / 正则硬猜“这个世界变化是不是 milestone”；
- 创建数据库；
- 创建通用事件总线；
- 重构整个 World Core；
- 改 Workspace v0.2；
- 重做 Panel Save UI；
- 修改资产。

---

# 2. 正式 Save Policy

实现并兼容：

1. `manual`
2. `interval: 5`
3. `interval: 10`
4. `interval: 20`
5. `milestone`
6. `milestone + interval: N`，N ∈ `5 / 10 / 20`

建议内部使用一个很薄的解析结果：

```js
{
  manual: true,
  milestone: boolean,
  interval: 5 | 10 | 20 | null
}
```

具体字段名可调整，不要发展成大型 schema。

### Backward compatibility

现有 `COMPOSITION.md` 必须继续工作。

至少宽容识别：

- `手动存档` / `仅手动`
- `每 N 玩家回合`
- `里程碑`
- `重大阶段切换`
- 同时出现 `里程碑` + `每 N 玩家回合`

特别验证当前真实存档语义：

`games/luan-shi-sanguo-2/COMPOSITION.md`

其中：

> 仅重大阶段切换（里程碑）自动存档 + 玩家随时手动存档

必须解析成：

```text
milestone = true
interval = null
```

测试只能复制相关文本到 fixture，不能改真实档。

---

# 3. Setup GUI

保持当前 Setup 顺序：

```text
世界
→ 拓展包
→ 世界起点 / 口径
→ 玩家角色
→ 主角操控模式
→ 存档策略
→ 最终确认
```

存档策略使用原生 `ask_user_question`。

第一问提供：

- 仅手动
- 每 5 玩家回合
- 每 10 玩家回合
- 每 20 玩家回合
- 仅里程碑
- 里程碑 + 定期

若选择：

`里程碑 + 定期`

再条件式用 GUI 询问：

- 5
- 10
- 20

不要给其它策略增加额外 Setup step。

推荐默认可以显示：

`里程碑 + 每 10 玩家回合`

但必须可见、可改，不能静默启用。

最终 `COMPOSITION.md` 写成自然中文、可稳定解析的统一表达。

例如：

```text
## 存档策略
- 策略: 里程碑 + 每 10 玩家回合自动存档；玩家可随时手动存档
```

不要为了这一个配置发明通用 manifest。

---

# 4. Durable Save Policy State

建立 Save subsystem 自己的 machine-owned state：

```text
games/<game-id>/saves/POLICY_STATE.json
```

建议最小内容：

```json
{
  "version": 1,
  "policyFingerprint": "...",
  "totalPlayerTurns": 0,
  "intervalProgress": 0,
  "pendingMilestone": null,
  "lastAutoSaveError": null
}
```

字段可以微调，但要求：

- deterministic code 独占读写；
- Agent / 模型不直接维护；
- 不进入 snapshot；
- Restore 不直接回滚；
- 不影响 canonical world truth；
- 文件缺失时可从当前 `COMPOSITION.md` 安全初始化；
- 文件损坏时 fail-safe，不得让 World Core 崩溃或污染世界文件。

### Policy fingerprint

当当前 `COMPOSITION.md` Save Policy 与 state fingerprint 不一致：

- 当前 / 恢复后的 `COMPOSITION.md` 为准；
- `intervalProgress = 0`；
- `totalPlayerTurns` 保留；
- 不适用于新 policy 的 pending milestone 清除；
- 更新 fingerprint。

这样 Restore 到旧 policy 后也能自然切回旧策略。

---

# 5. Cross-session Player Turn Counter

当前 `WeakMap playerTurnCounts` 不能再作为 Save Policy 的权威计数。

要求：

- 每个 **真实 player turn** 只增加一次；
- maintenance second stopping 不增加；
- setup continuation 不增加；
- aborted turn 不增加；
- 新 DSH Session 继续同一个 game 时，从 `POLICY_STATE.json` 延续；
- Restore 不因 workspace 回档自动把执行计数回滚。

### Interval Progress

使用 `intervalProgress` 决定 interval autosave。

当：

```text
intervalProgress >= policy.interval
```

该 turn 为 interval due。

成功创建对应自动 snapshot 后重置 progress。

如果 snapshot 失败：

- 不得假装成功；
- 不得清零 progress；
- 下一安全 player turn 应继续重试；
- 记录 `lastAutoSaveError`。

---

# 6. Milestone Signal

## 6.1 语义

Milestone 判断交给模型，snapshot 执行交给确定性代码。

参考 `docs/SAVE_POLICY_v0.2.md §4`。

高门槛例子：

- 主角官职 / 身份 / 阵营实质跃迁；
- 重要阶段 THREADS 批量结算；
- 重大行动 / 战役结束；
- 重大时间跳跃；
- 阶段性迁移；
- 重要系统长期阶段突破。

普通场景结束、购物、休息、小关系变化不算。

## 6.2 DSH-native seam

优先调查当前安装 DSH 的公开 plugin tool API。

如果有干净的公开 seam，实现一个极窄 model-facing signal，例如：

```text
world_mark_milestone(label)
```

它只能：

1. 定位当前 confirmed game；
2. 读取 Save Policy；
3. policy 不含 milestone 时 no-op / 明确 ignored；
4. 清洗 label（玩家可见，建议 <= 48 chars）；
5. 把 pending milestone 写入 `POLICY_STATE.json`；
6. 不建立 snapshot；
7. 不修改 `state/story/memory/mechanics`；
8. 不调用 `ask_user_question`；
9. 不推进剧情。

多次 mark 同一 turn 应 coalesce，不生成多个 SAVE。

如果公开 DSH tool seam 不适合干净实现：

- 使用等价的最薄 DSH-native signaling seam；
- 最终报告为什么；
- 不要绑定 DSH 私有内部对象；
- 不要退回“模型 mkdir SAVE”。

---

# 7. Maintenance / Milestone Prompt

只有 policy 包含 milestone 时，World Core maintenance guidance 才增加里程碑判断。

要求模型：

- 高门槛判断；
- 识别到 milestone 时确保本 turn durable changes 已得到完整 maintenance；
- 必要时把本回合升级成 checkpoint consolidation；
- maintenance 完成后发出 milestone signal；
- label 简短、玩家可读，例如：
  - `升任屯长 · 暗查内坊`
  - `绎幕侦巡完成`
  - `加入刘备义军`

不要输出任何玩家可见 maintenance 通知。

---

# 8. Snapshot 时序

## 8.1 interval

继续使用 Codex 已验证的 seam：

```text
player-visible step
↓
first agent/turn-stopping
↓
checkpoint consolidation steer
↓
maintenance step 完成
↓
second stopping
↓
createSnapshot()
```

## 8.2 milestone

如果 pending milestone 在 first stopping 前已经存在：

- 本 turn steer checkpoint consolidation；
- second stopping 创建 milestone snapshot。

如果 milestone 是 maintenance review 中才识别并 signal：

- second stopping 读取 pending milestone；
- 只在 maintenance step 已完成后 snapshot。

不要在 signal tool 内直接 save。

## 8.3 hybrid

同一个 player turn 同时：

- interval due
- milestone pending

只建立一个：

```text
kind = milestone
label = milestone label
```

并：

- 视为 interval safety point 已满足；
- `intervalProgress` 重置；
- 不额外创建 `auto-checkpoint`。

---

# 9. Rotation

保持当前确定性规则：

- `auto-checkpoint` 最近 5 个；
- `manual` 不自动删；
- `milestone` 不参与 interval rotation；
- `pre-restore` 不参与 interval rotation。

不要因为本任务增加 Save 删除 UI。

---

# 10. Auto-save Failure Visibility

当前 autosave failure 只有 logger，不够。

要求：

- 自动 snapshot 成功：静默；
- 自动 snapshot 失败：写入 `POLICY_STATE.json.lastAutoSaveError`；
- 下次自动 snapshot 成功：清除该错误；
- Panel `存档` 页显示一个简短、非侵入式警告，例如：

> 最近一次自动存档失败：游戏工作区不完整。后台维护仍在继续。

不要向 RPG Chat 注入工程通知。

Panel 不需要展示 raw JSON、counter 或 policy fingerprint。

可选：在“当前进度”下以玩家语言显示当前策略，但不要重做页面。

---

# 11. Restore Interaction

`POLICY_STATE.json` 位于 `saves/`，因此不随 snapshot replace 回滚。

恢复后：

1. live `COMPOSITION.md` 已回到目标 save；
2. fresh Session 启动；
3. 下一次 policy state sync 以恢复后的 `COMPOSITION.md` 为准；
4. policy 变化则重置 interval progress；
5. total player turns 仍作为真实玩家交互计数继续。

不要修改已经通过审计的 fresh-session restore 设计。

---

# 12. 测试

必须扩充临时 fixture 测试，至少覆盖：

### Policy parsing

1. manual
2. interval 5 / 10 / 20
3. milestone only
4. milestone + interval
5. 当前 `乱世三国2` 文本被解析为 milestone-only

### Cross-session

6. Session A 4 回合 + Session B 1 回合，在 `每 5` policy 下产生自动档
7. maintenance second stopping 不重复计数
8. aborted 不计数

### Interval

9. due 前不 snapshot
10. consolidation 完成后才 snapshot
11. snapshot 成功重置 progress
12. snapshot 失败不重置，下一安全回合重试

### Milestone

13. milestone policy 下 signal → maintenance safe boundary → `kind: milestone`
14. manual / interval-only policy 下 milestone signal 不产生 milestone save
15. milestone label 清洗
16. 同 turn 多次 signal 不重复建档

### Hybrid

17. interval + milestone 同 turn 只生成一个 milestone snapshot
18. hybrid milestone snapshot 同时重置 interval progress

### Policy change / Restore

19. policy fingerprint 变化重置 interval progress
20. totalPlayerTurns 不因 policy change / restore reset

### Rotation

21. auto-checkpoint 仍只留最近 5 个
22. milestone/manual/pre-restore 不被 interval rotation 删除

### UI failure

23. lastAutoSaveError 能在 Panel 存档页显示
24. 成功后错误清除

现有 Save / Restore、Panel、World Core 测试必须继续通过。

---

# 13. 实现范围建议

预计只需要触碰：

```text
plugins/shared/存档.js
plugins/shared/游戏定位.js（或把 policy parser 迁到更合适的 shared save 模块）
plugins/the-world-core/lib/index.js
plugins/the-world-core/lib/提示文本.js
plugins/the-world-core/test/...
plugins/the-world-panel/lib/index.js
plugins/the-world-panel/src/client/index.jsx
相关 test / README / package version
```

如果实现 milestone signal 需要一个很小的新 shared 文件，可以增加。

不要修改：

```text
games/*
library/*
tools/*
```

---

# 14. 验收标准

完成后必须成立：

```text
玩家选“仅手动”
→ 永不自动 snapshot

玩家选“每 5”
→ 跨 Session 第 5 个真实玩家回合自动 snapshot

玩家选“仅里程碑”
→ 普通回合不自动存
→ 重大阶段切换产生 milestone snapshot

玩家选“里程碑 + 每 10”
→ 两种条件都可触发
→ 同 turn 不重复建档
```

并保持：

```text
Persistent State != Save Point
```

Save Policy v0.2 的目标不是增加更多存档功能，而是：

> **玩家已经选择的策略，在长期跨 Session 世界里被真实、可靠、可解释地执行。**

---

# 15. 提交与报告

建议 2–4 个清晰 commit，例如：

```text
feat(save): persist game-level save policy state
feat(core): support milestone and cross-session autosave
fix(panel): surface autosave policy failures
test(save): cover Save Policy v0.2 semantics
```

最终报告：

```text
RESULT

IMPLEMENTED

MILESTONE SIGNAL SEAM
- 使用了什么 DSH public seam
- 为什么不耦合内部实现

TURN COUNTER
- 如何跨 Session
- Restore 后如何处理

TESTS

COMPATIBILITY
- 旧 COMPOSITION 解析
- 当前 luan-shi-sanguo-2 milestone-only 解析

LIMITATIONS

COMMITS
```

完成后停止，不自行继续 Map / Relationship / Combat / Save 删除 UI 等下一阶段功能。
