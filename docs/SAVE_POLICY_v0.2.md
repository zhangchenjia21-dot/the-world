---
title: The World｜Save Policy v0.2
status: current-save-policy-design
version: 0.2
updated: 2026-08-25
scope: post-Gate-B save policy semantics
---

# The World｜Save Policy v0.2

## 0. 目标

Save Policy v0.2 解决两个已经由真实试玩 / Codex 审计证明的问题：

1. `每 N 玩家回合` 的计数不能随 DSH Session 重置；
2. `里程碑自动存档` 必须成为真实可执行策略，而不是只写在 `COMPOSITION.md` 里的愿望。

核心原则：

> **玩家选择的存档策略，必须和系统真实执行的存档策略一致。**

继续保持：

> **Persistent State != Save Point.**

无论玩家选择哪种 Save Policy，World Core 的 durable maintenance 都持续发生。

---

## 1. 正式支持的 Save Policy

Save Policy v0.2 支持以下策略族：

1. **仅手动**
   - 系统不主动建立普通恢复点；
   - 玩家始终可以在 Panel 手动保存。

2. **每 5 玩家回合**

3. **每 10 玩家回合**

4. **每 20 玩家回合**

5. **仅里程碑**

6. **里程碑 + 每 N 玩家回合**
   - `N` 第一版只允许 `5 / 10 / 20`；
   - 两种触发共享同一个自动恢复点体系；
   - 如果同一时点同时满足里程碑和定期触发，只建立 **一个** snapshot，里程碑语义优先。

Setup 仍然只增加一个“存档策略”阶段；若玩家选择“里程碑 + 定期”，再条件式询问一次 `5 / 10 / 20`，不为其它玩家增加额外步骤。

推荐默认可以是：

> **里程碑 + 每 10 玩家回合**

但默认必须在 GUI 中可见、可改，不能静默替玩家决定。

---

## 2. 玩家回合定义

Canonical 定义不变：

```text
player turn
=
一次玩家输入
→
一次正常 GM 玩家可见回复
```

以下不计玩家回合：

- World Core maintenance step；
- consolidation step；
- Save / Restore 文件操作；
- setup continuation；
- Panel UI 操作。

---

## 3. Game-level Durable Counter

### 3.1 为什么必须持久化

`每 N 玩家回合` 是 **game-level policy**，不能依赖当前 DSH Session 的 `WeakMap`。

错误行为：

```text
Session A 玩 4 回合
→ 新 Session
→ 计数归零
→ Session B 再玩 4 回合
→ 仍然没有“每 5 回合”自动档
```

正确行为：

```text
同一个 game 的玩家回合进度跨 Session 连续
```

### 3.2 Owner

Save Policy 的机器计数属于 **Save subsystem**，不属于世界事实。

建议稳定 Owner：

```text
games/<game-id>/saves/POLICY_STATE.json
```

它：

- 由确定性代码独占读写；
- 模型不得维护；
- 不进入 snapshot；
- Restore 不直接回滚它；
- 不作为 RPG UI 第二事实源；
- 可以被 Panel 读取为存档系统状态。

第一版只需要很薄的数据：

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

字段可以按实现需要微调，但不要发展成通用 Runtime Schema。

### 3.3 Policy 改变 / Restore

`COMPOSITION.md` 仍然是玩家确认过的 Save Policy 真相源。

`POLICY_STATE.json` 只保存执行进度。

当：

- 玩家显式修改 Save Policy；或
- Restore 回一个带不同 `COMPOSITION.md` 的旧快照；

Core 发现当前 policy fingerprint 与 state 不一致时：

- 以恢复后的 / 当前的 `COMPOSITION.md` 为准；
- 重置 `intervalProgress`；
- 不重置 `totalPlayerTurns`；
- 清除不再适用的 pending milestone。

---

## 4. 里程碑语义

### 4.1 什么是里程碑

里程碑不是“每个场景结束”。

它指玩家之后很可能会认为“这是一个值得回来的阶段边界”的高价值 durable transition，例如：

- 主角身份 / 官职 / 阵营 / 组织归属发生实质跃迁；
- 一组重要 THREADS 被结算，游戏进入明显的新阶段；
- 一场重大行动 / 战役 / 冲突完成并改变后续局势；
- 重大时间跳跃后进入新阶段；
- 主角长期活动区域 / 基地发生阶段性迁移；
- 重要系统 / 机制进入新的长期阶段（不是普通加点或购物）。

通常 **不是** 里程碑：

- 普通场景收束；
- 一次普通谈话；
- 日常休息 / 购物 / 旅行；
- 小幅关系变化；
- 新增一个普通 Thread；
- 一场低风险常规战斗。

判断原则：

> **高门槛、低频率、阶段切换。**

### 4.2 谁判断，谁执行

“这是不是里程碑”是语义判断，交给模型。

“创建什么 SAVE、何时创建、怎么回滚、怎么 rotation”是确定性行为，交给 Core / shared save service。

所以正式分工：

```text
GM / maintenance
→ 识别 milestone
→ 发出窄 milestone signal（附简短玩家可见 label）

World Core
→ 确保 maintenance / consolidation 到达安全边界
→ deterministic createSnapshot(kind = milestone)
```

禁止：

- 让模型自己 mkdir / copy 形成 SAVE；
- 用 diff / 正则猜“身份变化 = milestone”；
- 为每一种机制写硬编码 milestone detector；
- 把 milestone 做成大型事件总线。

### 4.3 Signal seam

优先使用一个 **DSH-native、极窄、无世界文件副作用** 的 model-facing signal，例如：

```text
world_mark_milestone(label)
```

其职责仅为：

- 验证当前是 confirmed The World game；
- 验证当前 policy 包含 milestone；
- 清洗 / 截断 label；
- 把 pending milestone 记录到 save policy state；
- 不创建 snapshot；
- 不推进剧情；
- 不改任何 `state/ story/ memory/ mechanics/`。

如果当前公开 DSH plugin API 不适合干净实现该 signal，允许使用等价的最薄 DSH-native seam；不要为此绑定 DSH 私有内部实现。

---

## 5. Maintenance → Snapshot 顺序

### 5.1 定期自动档

```text
第 N 个 player turn 正常 GM 回复结束
↓
Core 发现 interval due
↓
steer checkpoint consolidation
↓
maintenance / consolidation step 完成
↓
同一 turn 的安全 stopping seam
↓
deterministic snapshot
```

### 5.2 里程碑自动档

里程碑可能在正常 GM step 或 maintenance review 中被识别。

只要 Core 收到 pending milestone：

- 本 turn 必须至少完成 durable maintenance；
- 若尚未 consolidation，可把该 turn 升级为 checkpoint consolidation；
- snapshot 必须发生在对应 maintenance step 完成之后。

### 5.3 Hybrid 同时触发

同一 turn 同时满足：

- interval due；
- milestone pending；

只创建一个：

```text
kind: milestone
label: <milestone label>
```

并视为该次定期安全点也已满足：

- `intervalProgress` 重置；
- 不再额外生成第二个 `auto-checkpoint`。

---

## 6. Rotation

第一版保持简单：

- `auto-checkpoint`：只保留最近 5 个；
- `milestone`：不参与 interval rotation；
- `manual`：永不自动删除；
- `pre-restore`：不参与 interval rotation。

Milestone 理论上会累积，但它们应低频且高价值。若未来真实长局证明需要管理，再做玩家可见删除 / 保留策略；现在不提前建设。

---

## 7. 自动存档失败

成功的后台 autosave 保持静默。

失败不能永远只存在 logger。

第一版建议：

- Core 把最近一次自动存档失败写入 Save Policy State；
- Panel「存档」页显示一个非侵入式警告；
- 下一次自动存档成功后清除该警告。

不要在正常 RPG Chat 里插入存档工程通知。

---

## 8. Backward Compatibility

已有 `COMPOSITION.md` 不强制迁移。

解析器应宽容识别至少：

- `手动存档` / `仅手动`；
- `每 N 玩家回合`；
- `里程碑` / `重大阶段切换`；
- 同时包含 `里程碑 + 每 N 玩家回合` 的混合描述。

新游戏应写统一、自然语言但可稳定解析的存档策略段落。

---

## 9. 非目标

Save Policy v0.2 不做：

- Save 删除 UI；
- 云存档；
- 分支时间线 UI；
- diff save / 增量 save；
- 数据库；
- 通用事件系统；
- 机制专用 milestone detector；
- 重做 Panel Save / Restore UI。

目标只有一个：

> **让玩家已经选择的 Save Policy，在跨 Session 的长期 RPG 中真实、可靠地被执行。**
