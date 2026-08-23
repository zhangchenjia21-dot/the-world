---
title: 穿越与系统｜Expansion Pack
aliases:
  - EP-TRAVELER-SYSTEM
  - 穿越与系统
  - Traveler and System
  - 异世来客
  - 穿越者系统
created: 2026-08-16
updated: 2026-08-16
status: audited-current
version: 0.2
workflow_mode: light-asset
operation_mode: major-rewrite
asset_type: expansion-pack
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
output_profile: obsidian-markdown
reusability: cross-world
generic_reuse_target: true
discussion_contract: confirmed
supersedes:
  - "[[异世来客_穿越者系统_Expansion_Pack_v0.1.2]]"
optional_integrations:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
  - "[[战斗核心_Expansion_Pack_v0.1]]"
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
  - "[[生存需求与环境_Expansion_Pack_v0.2]]"
  - "[[关系与恋爱核心_Expansion_Pack_v0.2]]"
  - "[[魔法基础_Expansion_Pack_v0.3]]"
  - "[[神术与信仰_Expansion_Pack_v0.2.1]]"
dependency_role: traveler-system-framework
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - ExpansionPack
  - Traveler
  - System
  - PortalFantasy
  - CheatSystem
  - Quest
  - Shop
  - Lottery
  - Storage
  - Teleport
  - Appraisal
  - RelationshipAssistance
  - 通用拓展
  - 穿越
  - 系统流
skill: tavern-asset v0.5.2
---

# 穿越与系统｜Expansion Pack v0.2

> [!abstract] 一句话定位
> **`EP-TRAVELER-SYSTEM｜穿越与系统` 是一个跨世界可复用的“异世界来客 + 可配置系统流”玩法 Expansion。**
>
> 它把“是否存在穿越者”与“是否启用系统”作为同一资产内部两个可独立启停的一级 Feature：
>
> ```text
> Traveler Feature  ON / OFF
> ×
> System Feature    ON / OFF
> ```
>
> 因此可以自然支持：
>
> - 纯穿越；
> - 穿越 + 系统；
> - 本世界原住民获得系统；
> - 资产已安装但当前游戏不启用任何穿越 / 系统玩法。
>
> **系统不是未声明的 GM。任何超常修改能力都必须来自已启用 Module 的明确权限，并通过目标 Owner 与 Runtime 正式 Commit。**

> [!important] 重构说明
> 本文件是对旧 `《异世来客：穿越者系统》v0.1.2` 的 Major Rewrite。
>
> 本次重构不拆包，而是：
>
> - 正式重命名为 `穿越与系统`；
> - 将 Traveler 与 System 变成独立一级开关；
> - 保留二者统一的创作 / 安装 / 配置体验；
> - 把 Character、Health、Relationship、Magic、Divine、Combat 等依赖改为**具体 Module 启用时才成立的 Conditional Dependency**；
> - Healing / Regeneration / Health Appraisal 从旧 Survival Health Interface 改绑 `EP-HEALTH-CORE`；
> - Relationship Assistance 改绑 `EP-RELATIONSHIP-ROMANCE-CORE`；
> - 明确 Ultimate 可以是真正作弊体验，但 `World Rewrite / Resurrection / Character Agency Override` 等必须作为显式独立最高权限 Module；
> - 接入当前 G8 Runtime-extensible UI Host 思路，但不提前伪造 G9 asset-spec vNext Schema。

---

# 0. Discussion Contract｜已确认设计方向

当前已正式确认：

1. 本资产重命名为 `穿越与系统`；
2. 不拆分 Traveler 与 System 为两个独立 Expansion；
3. `Traveler Feature` 与 `System Feature` 可独立 ON / OFF；
4. 穿越者不必拥有系统；
5. 系统持有者不必是穿越者；
6. System Enabled 不等于拥有全部系统能力；
7. 系统能力必须由具体 Module 明确授权；
8. 包级尽量不 Hard Depend 其他 Domain Core；
9. 具体 Module 启用时才要求对应正式 Owner；
10. 这种关系当前称为 **Module Conditional Dependency**，是语义关系，不冻结 G9 机器字段；
11. Ultimate 可以保持真正作弊 / Sandbox 强度；
12. Runtime 不得以“平衡”为理由暗中削弱玩家明确选择的 Ultimate Module；
13. 但高权限能力必须显式 Module 化；
14. `Healing != Resurrection`；
15. `Relationship Rewrite != Character Agency Override`；
16. `Appraisal != 默认全知`；
17. `Teleport != World Rewrite`；
18. 模型不能自行决定系统奖励、RNG、正式世界变化或权限；
19. 当前只冻结语义、Ownership、Dependency、Permission 与 UI Host Requirement，不冻结 vNext Schema / Runtime API / Creator 字段。

---

# 1. Scope Lock｜本包负责什么

## 1.1 本包必须负责

### Traveler Feature

- Traveler Feature Enabled / Disabled；
- Traveler Identity；
- Origin World / Era；
- Origin Background；
- Body Transfer / Possession / Reincarnation；
- Host Identity Integration；
- Host Memory Integration；
- Host Capability Bootstrap Handoff；
- Host Health Bootstrap Handoff；
- Otherworld Knowledge Provenance；
- Traveler Disclosure；
- Traveler-specific initialization。

### System Feature

- System Feature Enabled / Disabled；
- System Profile；
- System Power Preset；
- Per-module Override；
- System Module Framework；
- System Permission Scope；
- System Quest Offer / Reward Contract；
- System Currency；
- System Shop；
- Lottery；
- Reward；
- System Storage；
- Appraisal / Knowledge Module；
- Character Enhancement Module interface；
- Healing / Regeneration Module interface；
- Relationship Assistance Module interface；
- Teleport Module；
- Resource / Item Generation Module；
- Optional high-permission Module；
- System UI / Extension Surface intent；
- Program Validation / Atomic Commit requirement。

## 1.2 本包明确不负责

- Character 六层长期能力的第二事实源；
- HP / Injury / Disease / Recovery 的第二事实源；
- Relationship / Attraction / Preference 的第二事实源；
- Spell / Magic Mastery 的第二事实源；
- Covenant / Invocation / Divine Authority 的第二事实源；
- Combat Outcome；
- Economy / Inventory 的第二 Resource Owner；
- World Position 的第二 Owner；
- Historical Truth；
- World Pack Truth；
- 任意 GM 权力；
- 任意代码执行；
- Runtime RNG；
- Dice；
- Program Judge；
- Formal Outcome；
- Atomic Commit；
- 最终 asset-spec vNext；
- Creator 正式机器字段。

---

# 2. Product Structure｜统一资产内部双 Feature

本包采用：

```text
Package Installed
↓
Traveler Feature      ON / OFF
System Feature        ON / OFF
↓
if System ON:
Power Preset
×
Module Selection
×
Per-module Override
×
Module Parameters
```

## 2.1 四种合法组合

| Traveler | System | 体验 |
|---|---|---|
| ON | OFF | 纯穿越 / 异世来客 |
| ON | ON | 穿越 + 系统流 |
| OFF | ON | 本世界人物获得系统 |
| OFF | OFF | 包已安装，但当前实例不启用相关玩法 |

## 2.2 OFF 必须真的关闭

如果 Traveler OFF：

- 不创建 Traveler Identity；
- 不生成 Origin World / Era；
- 不进行 Host Memory Integration；
- 不产生穿越身份知识。

如果 System OFF：

- 不创建 System Currency；
- 不发布 Quest；
- 不生成 Shop / Lottery；
- 不显示 System Surface；
- 不允许调用 System Module。

不能：

> “虽然关了系统，但模型偶尔还是发任务或奖励。”

---

# 3. Ownership Map｜单一事实源

| 概念 | 唯一 Owner | 本包职责 |
|---|---|---|
| Traveler Identity / Origin | EP-TRAVELER-SYSTEM | 正式职责 |
| Traveler Mode / Host Integration Policy | EP-TRAVELER-SYSTEM | 正式职责 |
| System Profile / Module State | EP-TRAVELER-SYSTEM | 正式职责 |
| System Currency | EP-TRAVELER-SYSTEM | 正式职责 |
| System Quest Offer / Reward Contract | EP-TRAVELER-SYSTEM | 正式职责 |
| Accepted Task / Objective | World OS Task / Objective Owner | System 只提供来源、目标条件、奖励合同与进度 Handoff |
| System Storage | EP-TRAVELER-SYSTEM | 正式职责 |
| Character Capability | EP-CHAR-CORE | Module 只能请求修改 |
| Health / HP / Condition | EP-HEALTH-CORE | Module 只能通过接口修改 / 读取 |
| Relationship Truth | EP-RELATIONSHIP-ROMANCE-CORE | Module 只能通过接口修改 / 读取 |
| Spell / Magic Strain | EP-MAGIC-CORE | Module 只能贡献授权效果 |
| Covenant / Invocation / Divine Authority | EP-DIVINE-CORE | Module 只能贡献授权效果 |
| Combat Outcome | EP-COMBAT-CORE | Module 不能偷写 |
| Food / Water / Survival Need | EP-SURVIVAL / Resource Owner | 仅相关 Module 交互 |
| 普通 Resource / Inventory | Economy / Inventory Owner | System 可合法注入 / 转移 |
| World Position | Runtime / World Position Owner | Teleport 请求修改 |
| Historical Reference | Historical Provider | 只读取 |
| RNG / Dice / Formal Outcome / Commit | Runtime | 执行 |

---

# 4. Traveler Feature｜穿越玩法

## 4.1 Traveler Identity

Traveler Identity 回答：

> **这个角色是否来自当前世界之外，以及其来源身份如何影响当前 Character Definition / Game State。**

可以保存：

- Origin World；
- Origin Era；
- Origin Culture；
- Origin Background；
- Traveler Mode；
- Arrival Context；
- Disclosure State。

## 4.2 Traveler Mode

### Body Transfer｜身穿

玩家：

- 原身体；
- 原人格；
- 原个人知识；

一起进入目标世界。

### Possession / Host Transfer｜魂穿 / 接管

玩家人格进入：

- 历史人物；
- 原创人物；
- 已存在 NPC；

的身体。

### Reincarnation｜转生

玩家以：

- 新身份；
- 较早年龄；
- 新身体；

在目标世界重新成长。

具体保留多少前世 / 异世界知识：

> 由 Traveler Profile 声明。

---

# 5. Host Integration｜魂穿 / 接管的分权

必须永久分离：

```text
Player Decision Subject
!=
Host Body
!=
Host Memory
!=
Host Capability
!=
Host Health
!=
Host Relationship History
```

## 5.1 玩家人格

默认：

> 玩家成为当前 Character 的主动决策主体。

如要支持：

- 共存人格；
- 原人格反抗；
- 双重人格；

必须显式启用相应玩法。

不能把它作为所有魂穿默认机制。

## 5.2 Host Body

身体事实属于：

> Character / Species / World + EP-HEALTH-CORE。

Traveler 只声明：

> 当前 Character 使用哪个 Host Body / Body Origin。

不维护第二份：

- Injury；
- Disease；
- HP；
- Body Condition。

## 5.3 Host Capability

宿主已有长期能力：

> 进入 EP-CHAR-CORE 的正式 Character Capability。

魂穿者是否能立即调用这些能力，取决于：

- 身体记忆；
- Host Integration；
- 玩家人格适应；
- Profile；
- Runtime Resolution。

不能简单：

> “魂穿关羽 = 立刻百分百掌握全部武艺”。

## 5.4 Host Memory

可以配置：

- none；
- fragmentary；
- partial；
- extensive。

Host Memory 进入：

> Character Knowledge / Memory source。

不把它伪装成 Traveler 自己亲身经历过的记忆。

---

# 6. Otherworld Knowledge｜异世界知识与能力分离

核心原则：

```text
Knowledge
!=
Capability
!=
Resource
!=
Successful Implementation
```

知道：

> 细菌会导致感染

不自动拥有：

> 医学 Skill。

知道：

> 火药原理

不自动获得：

- 原料；
- 工艺；
-设备；
- 安全生产条件。

正式链：

```text
Otherworld Knowledge
+
Character Capability
+
World Material / Tool / Time
↓
Actual Attempt
↓
Target Mechanism Resolution
```

只有显式 System Module：

> Fabrication / Resource Generation / World Rewrite

才可能合法绕过部分普通条件。

---

# 7. Traveler Disclosure｜穿越身份知识

Traveler Identity 是世界事实。

谁知道：

> 角色来自异世界

属于：

- Character Knowledge；
- Relationship / disclosure context；
- Event。

本包可以提供：

> Traveler Disclosure Event / Knowledge Handoff。

不能把：

> “系统知道我是穿越者”

自动传播为：

> “所有 NPC 都知道”。

---

# 8. System Feature｜系统框架

System Feature Enabled 后，才创建正式 System State。

System 本体拥有：

- System Profile；
- System Power Preset；
- Module Registry；
- Module Enabled State；
- Per-module Override；
- Permission Scope；
- System-owned Currency；
- System Quest Offer / Reward Contract State；
- Storage；
- System-owned Progression。

它不天然拥有：

- Heal；
- Teleport；
- Relationship Rewrite；
- World Rewrite；
- Resurrection；
- Character Enhancement。

这些必须来自：

> Enabled Module。

---

# 9. System Power Preset｜系统强度

保留三档快捷 Profile。

## 9.1 Initial / Growth｜初级成长型

核心体验：

> 系统主要提供机会与成长渠道。

典型：

- 基础任务；
- 少量系统币；
- 小型 Storage；
- 低级 Appraisal；
- 有限 Shop；
- 低频 Lottery；
- 低权限 Enhancement。

## 9.2 Privileged｜中级特权型

核心体验：

> 开局已明显拥有超常特权，但仍保留成长。

典型：

- 中型 Storage；
- 更强 Appraisal；
- Shop；
- Teleport；
- 中级 Healing；
- 较高 Enhancement；
- 更多 Resource / Reward。

## 9.3 Ultimate / Sandbox｜终极作弊型

核心体验：

> **明确允许不公平、极强甚至改变游戏结构的力量幻想。**

可以：

- 无限 / 极高 System Currency；
- 无限 Storage；
- 自由 Shop；
- 指定 Lottery；
- 高权限 Appraisal；
- 强 Character Enhancement；
- 强 Healing；
- 大规模 Teleport；
- 大量 Resource Generation；
- Relationship Rewrite；
- 其他显式启用的高权限 Module。

但：

> Ultimate != 未声明 GM。

---

# 10. Per-module Override｜模块独立覆盖

Power Preset 只是快捷模板。

允许：

```text
System Preset = Initial

Storage = Ultimate
Healing = OFF
Relationship Assistance = Privileged
Teleport = Initial
```

或：

```text
System Preset = Ultimate

Quest = OFF
Shop = OFF
Appraisal = Ultimate
Storage = Ultimate
```

Runtime 不得因为：

> 总体是初级

就偷偷削弱明确 Override 为 Ultimate 的单个 Module。

---

# 11. Module Definition Contract｜模块通用语义

每个 System Module 至少需要能够回答：

- Module Identity；
- Enabled；
- Power Level；
- Permission Scope；
- Target Owner；
- Inputs；
- Outputs；
- Cost；
- Cooldown / Usage Limit；
- Visibility；
- Target Eligibility；
- 是否超越普通 World Rule；
- 是否需要 RNG；
- 是否需要 Module Conditional Dependency；
- 是否拥有独立 UI View / Section；
- Validation Requirement。

这些是语义要求，不冻结 G9 Schema 字段名。

---

# 12. Module Conditional Dependency｜模块级条件依赖

这是本重构最重要的依赖原则。

> **整个 `EP-TRAVELER-SYSTEM` 不因为“理论上存在某模块”而 Hard Depend 所有 Domain Core。**
>
> **只有具体 Module Enabled 时，才要求对应 Provider。**

推荐语义：

```text
Module Enabled
+
Required Owner Present
→ Module Available

Module Enabled
+
Required Owner Missing
→ Composition / Preflight Failure
  or explicit Module Incompatible
```

不得：

> 缺 Owner 后由 Traveler 自己造第二套状态作为 fallback。

---

# 13. Module Dependency Matrix｜模块与正式 Owner

| Module | Conditional Dependency | 正式边界 |
|---|---|---|
| Character Enhancement | EP-CHAR-CORE | 修改 Canonical Capability |
| Health Appraisal | EP-HEALTH-CORE | 读取权限化 Health Projection |
| Healing / Regeneration | EP-HEALTH-CORE | Treatment / Condition Handoff |
| Resurrection | EP-HEALTH-CORE + World / Divine / Soul Authority as applicable | 独立最高权限 |
| Relationship Appraisal | EP-RELATIONSHIP-ROMANCE-CORE | 读取授权关系投影 |
| Relationship Assistance | EP-RELATIONSHIP-ROMANCE-CORE | Opportunity / Compatibility / Rewrite |
| Romance Sandbox | EP-RELATIONSHIP-ROMANCE-CORE | 高权限关系修改 |
| Spell Grant / Spell Learning | EP-MAGIC-CORE | 通过 Magic Owner |
| Invocation / Divine Grant | EP-DIVINE-CORE | 通过 Divine Owner |
| Combat Assistance | EP-COMBAT-CORE | 只提供合法 Combat Contribution |
| Survival Resource Assistance | EP-SURVIVAL + Resource Owner as applicable | 食水 / 防护 /生存资源 |
| Resource Generation | Resource / Inventory / Economy Owner | 正式注入 |
| Historical Assistance | Historical Reference Provider | 只读取 Reference |
| Teleport | World Position / Runtime Host | 正式 Position Mutation |
| World Rewrite | World / Runtime highest-permission host contract | 独立最高权限 |

当前表是语义关系，不是最终机器协议。

---

# 14. Quest Module｜系统任务提议 / 奖励合同

System 可以拥有：

- Quest Offer；
- Acceptance Requirement；
- System Reward Contract；
- System-specific Failure Contract；
- System provenance；
- Module unlock / reward linkage。

但 World OS 已经拥有正式：

> **Task / Objective｜玩家当前要完成什么。**

因此系统不得维护第二套“当前玩家目标真相”。

## 14.1 Offer → Task Handoff

正确链：

```text
System Quest Offer
↓
Player accepts / explicit rule trigger
↓
World OS Task / Objective
↓
System Quest Contract linked by provenance
```

玩家拒绝：

> 不创建正式 Task。

系统任务完成 / 失败：

> 由 World OS Task / Objective 的正式状态作为目标完成事实源；System 再根据关联 Contract 发放 Reward 或执行已声明后果。

## 14.2 系统任务不是玩家行为强制

系统可以提出：

> “三个月内夺下一座城。”

玩家仍可：

> 拒绝。

如果 Profile 存在明确失败惩罚：

> 必须在接受前可知，并通过正式 World / Health / other Owner 执行。

## 14.3 Ultimate

可以允许：

- 自动完成；
- 跳过；
- 自定义 Offer；
- 自定义 Reward Contract；
- 完全关闭 Quest Module。

若“自动完成”会直接改变世界：

> 必须拥有对应高权限 Module / Target Owner 权限，不能仅靠 Quest 状态把世界目标强行写成已完成。

# 15. System Currency / Shop｜系统货币与商城

## 15.1 System Currency 独立于普通 Economy

```text
System Currency
!=
World Currency
```

除非 Module 明确支持兑换。

## 15.2 Shop

可提供：

- Item；
- Resource；
- Capability Enhancement；
- System Module；
- Knowledge；
- Teleport Charge；
- 其他合法 Reward。

购买后：

> 必须把结果正式交给目标 Owner。

不能：

> 商城显示“已购买”，世界状态却没有获得对应物品 / 能力。

## 15.3 Ultimate Free Shop

玩家显式选择时：

> 可以 0 成本。

Runtime 不暗中添加“平衡价格”。

---

# 16. Lottery / Reward｜抽奖与奖励

## 16.1 Lottery 使用 Program RNG

抽奖不能由模型：

> “感觉这次该中 SSR”。

必须使用：

> Runtime RNG / Reward Table。

## 16.2 Reward Source

System Reward 可以成为：

> 合法超自然来源。

但 Reward 必须正式落到目标 Owner：

```text
Reward
→ Target Owner Candidate
→ Validation
→ Atomic Commit
```

## 16.3 Ultimate

可以允许：

- 指定结果；
- 无限抽；
- 锁稀有；
- 修改奖池；
- 自动获得全部。

仍然由 Program 正式 Commit。

---

# 17. System Storage｜系统空间

System Storage 可以由本包直接拥有，因为它是系统自身独立资源空间。

可以配置：

- Capacity；
- Living Entity Allowed；
- Time Flow；
- Preservation；
- Access Range；
- Shared Access；
- Permission。

普通 Inventory 与 System Storage：

> 是不同 Owner。

## 17.1 Transfer 必须正式提交

```text
World Inventory
↔
System Storage
```

之间转移：

> 必须通过正式 Transaction。

不能只改变 UI。

---

# 18. Appraisal / Knowledge Modules｜鉴定与知识

## 18.1 Appraisal 权限必须显式

系统能读什么：

> 由 Module Permission Scope 决定。

例如：

### Basic

- 可观察状态；
- 粗略 Character Capability；
- 基础 Item Information。

### Advanced

- 更高精度正式 Projection；
- 特定隐藏信息；
- Health / Relationship 等授权视图。

### Ultimate

可以更强。

但：

> **Ultimate Appraisal != 默认全知。**

如需 Omniscience：

> 必须单独启用对应高权限 Module / Permission。

## 18.2 Knowledge 来源

系统提供的信息进入：

> Character / Player Knowledge

并标记：

> system-sourced。

它不自动变成：

> 世界公开信息。

---

# 19. Character Enhancement Module｜人物强化

Conditional Dependency：

> `EP-CHAR-CORE`

正确链：

```text
System Enhancement
↓
Capability Enhancement Candidate
↓
EP-CHAR-CORE semantics
↓
Runtime Validation
↓
Canonical Capability Change
```

禁止只修改：

- 五维摘要；
- UI 武力值；
- 临时显示数字；

却不修改真实 Capability。

## 19.1 Ultimate Enhancement

可以允许：

- 快速学习；
- 直接提升；
- 超越普通种族上限。

但：

> 是否允许超常上限必须由 Module 明确。

---

# 20. Healing / Regeneration / Health Appraisal｜身体状态模块

旧版：

```text
Traveler Healing
→ Survival Health Interface
```

正式废止。

新链：

```text
System Healing / Regeneration
↓
EP-HEALTH-CORE
↓
Treatment Effect
↓
Condition Change
↓
Health Burden / hidden HP
```

Health Appraisal：

```text
System Permission
↓
EP-HEALTH-CORE Player-safe / privileged projection
```

## 20.1 Healing 不直接加 HP

系统 Module 不能正式写：

```text
HP +50
```

而应声明：

- Stabilize；
- Relief；
- Repair；
- Regenerate；
- Cure；
- other legal Treatment Effect。

Health Core 统一形成最终 Condition / HP 结果。

## 20.2 Ultimate Healing

可以允许：

- 瞬间重伤修复；
- 断肢再生；
- 疾病清除；
- 极强生命维持。

只要 Module 明确。

---

# 21. Resurrection Module｜复活必须独立

```text
Ultimate Healing
!=
Resurrection
```

若系统允许死亡逆转：

> 必须启用独立 Resurrection Capability。

并且继续遵守当前 World / Divine / Soul Boundary。

例如某世界规定：

> 已抵达死亡主权边界的灵魂需要 Sovereign Permission，

那么 System Resurrection 要么：

- 明确拥有足以合法绕过 / 取得该权限的 World-level Capability；
- 要么无法在该边界后直接复活。

不能把：

> “Healing 很强”

偷换成：

> “无条件复活”。

---

# 22. Relationship Assistance｜关系辅助

Conditional Dependency：

> `EP-RELATIONSHIP-ROMANCE-CORE`

Traveler/System 不维护第二套：

- Sentiment；
- Trust；
- Respect；
- Attachment；
- Commitment；
- Romantic Attraction；
- Preference；
- Boundary；
- Shared Bond。

## 22.1 Basic｜缘分辅助

允许：

- 分析已授权的兼容信息；
- 提示共同兴趣；
- 发现关系机会；
- 提供互动建议；
- 生成关系类 Quest / Reward；
- 提升自然相遇机会。

不修改：

> Relationship Truth。

## 22.2 Privileged｜亲和与适配

可以按权限提供：

- Compatibility Expansion；
- Affinity Facilitation；
- Social Shield；
- Opportunity Expansion。

但：

> Compatibility != Attraction。

## 22.3 Ultimate｜Relationship Rewrite / Romance Sandbox

可以显式授权修改：

- Relationship Accessibility；
- Romantic Preference；
- Relationship Structure Preference；
- 成年角色 Intimacy Preference；
- Attraction Potential；
- 允许的关系状态；
- 被明确授权的社会阻力。

正式链：

```text
System Permission
↓
Relationship Core Interface
↓
Relationship Mutation Candidate
↓
Validation
↓
Atomic Commit
```

NPC 之后：

> 依据修改后的自己继续自主行动。

---

# 23. Character Agency Override｜强制意志必须独立

以下能力：

- “让 NPC 现在必须爱我”；
- “让 NPC 必须接受告白”；
- “让 NPC 无视自己的边界”；
- “直接控制 NPC 当前选择”；

不属于：

> Relationship Assistance。

它们属于：

> **Character Agency Override / Mind Control**

如果未来允许，必须：

1. 作为独立最高权限 Module；
2. 显式启用；
3. 明确 Target / Scope / Duration；
4. 与 Relationship Truth 修改分离；
5. 不能伪装成魅力、好感或 Romance Sandbox；
6. 继续受 World OS Core、产品安全和 Program Validation 的正式边界约束。

当前 v0.2：

> 只冻结权限分离，不默认启用该 Module。

---

# 24. Teleport Module｜传送

Teleport 负责提供：

> 合法 Position Mutation Capability。

它不拥有：

- Region / Place / Scene；
- Combat Outcome；
- War Outcome。

正式链：

```text
Teleport Module
↓
Target Position
↓
World / Position Validation
↓
Atomic Position Commit
↓
downstream world consequences
```

## 24.1 Ultimate Teleport

若 Module 明确允许：

- 无冷却；
- 任意合法位置；
- 多人；
- 军队；
- 大量物资；

Runtime 不得因为：

> “这样太破坏平衡”

暗中限制。

但：

> Teleport != World Rewrite。

---

# 25. Resource / Item Generation｜资源与物品生成

系统可以作为：

> 合法超自然来源。

例如：

- Food；
- Water；
- Metal；
- Medicine；
- Equipment；
- Tool；
- other Resource / Item。

生成后：

> 必须交给正式 Resource / Inventory Owner。

如果生成食物 / 饮水：

> EP-SURVIVAL 可以消费这些正式资源。

System 不自己维护第二份 Survival Need。

---

# 26. Magic / Divine / Combat Optional Module Hooks

本包是跨世界通用资产，因此允许未来 Module 对不同 Domain Core 建立条件依赖。

## 26.1 Magic

例如：

- Spell Grant；
- Spell Learning Acceleration；
- Spell Appraisal；
- Magic Resource Grant。

必须：

> 通过 EP-MAGIC-CORE。

不建立第二 Spell Library / Mastery Owner。

## 26.2 Divine

例如：

- Invocation Grant；
- Covenant Assistance；
- Divine Appraisal。

必须：

> 通过 EP-DIVINE-CORE / World Authority。

不能让 System 随便冒充 God / Sovereign Authority。

## 26.3 Combat

例如：

- Aim Assist；
- Tactical Appraisal；
- Combat Prediction；
- protective combat capability。

必须：

> 通过 Combat Extension / Handoff。

System 不直接宣布 Combat Outcome。

---

# 27. World Rewrite Module｜最高权限世界改写

World Rewrite 不是 System 默认能力。

必须：

> 独立显式启用。

可用于例如：

- 创建 Place；
- 创建 Facility；
- 大规模 World Resource；
- 直接改变某些世界 Rule / State；
- 创造现代医院；
- 建立特殊区域；
- 其他 Sandbox Mutation。

正确链：

```text
Player Intent
↓
World Rewrite Module Enabled
↓
Permission Scope
↓
Target Owner / Runtime Host
↓
Mutation Candidate
↓
Validation
↓
Atomic Commit
```

当前只冻结：

> **这是独立最高权限 Capability。**

具体 World Rewrite Contract：

> 等待 G9 / Runtime 真实 Host 能力。

---

# 28. Runtime 不得暗中平衡

如果玩家明确选择：

- Ultimate Storage；
- Ultimate Teleport；
- Ultimate Healing；
- Unlimited Currency；
- Free Shop；
- Unlimited Resource Generation；

Runtime 不能因为：

> “这样会破坏历史 / 战争 / 经济平衡”

偷偷：

- 限量；
- 加价；
- 增冷却；
- 改掉目标；
- 降低效果。

正确行为：

> 让世界的 Economy / Politics / Combat / NPC / History 真实承受这些新事实。

---

# 29. Program Authority｜系统再强也不能绕过正式提交链

推荐总链：

```text
Player Intent
↓
Traveler / System Feature enabled?
↓
Module enabled?
↓
Module Permission
↓
Conditional Dependency available?
↓
Cost / Cooldown / Limit
↓
Target Owner Interface
↓
Program Resolution / RNG if needed
↓
State Change Candidate
↓
Validation
↓
Atomic Commit
↓
Event
↓
Player-safe Feedback
```

模型可以：

- 理解玩家请求；
- 生成 Quest 文案；
- 生成 Shop 描述；
- 生成 Appraisal 叙事；
- 提出 Reward Candidate；
- 提出 World Rewrite Candidate。

模型不能正式：

- 发放奖励；
- 改 Capability；
- Heal；
- Teleport；
- Rewrite Relationship；
- Rewrite World；
- 决定 Lottery；
- Commit State。

---

# 29A. Task / Objective Ownership Closure｜目标唯一 Owner

System Event 可以记录：

- QuestOffered；
- QuestAccepted；
- QuestRejected；
- SystemRewardGranted；

但：

- QuestAccepted 后的正式“正在进行目标”属于 World OS Task / Objective；
- QuestCompleted / QuestFailed 必须引用正式 Task Outcome；
- System 不从自己的内部计数反向覆盖 Core Task 状态；
- “系统任务”UI 是 Core Task / Objective 的 system-provenance projection + System Reward Contract，不是第二套 Quest DB。

---

# 30. Save / Restore｜系统状态与恢复

需要恢复的正式状态包括：

- Traveler Feature state；
- Traveler Identity；
- Host Integration state；
- System Feature state；
- System Profile；
- Module Enabled / Override；
- System Currency；
- System Quest Offer / Reward Contract；
- linked World OS Task / Objective references；
- Reward state；
- Storage；
- cooldown / usage state；
- 重要 Permission / Unlock；
- 相关 Knowledge；
- committed System Event。

Restore：

> 不重新调用模型猜系统当时是什么状态。

System State 必须跟随正式 Game State / Snapshot 恢复。

## 30.1 UI Preference 分离

以下纯 UI 状态：

- System Surface 排序；
- 某个二级 View 是否展开；
- 当前打开哪个 System Tab；

默认属于：

> UI Preference。

不属于 World Snapshot authority。

---

# 31. Runtime-extensible UI｜G8 Host 对接要求

当前 Game Host 已冻结：

- Core World Surfaces；
- Extension Surface；
- Surface Ownership / Contribution；
- Player ordering；
- Host layout authority；
- controlled secondary View / Section。

本包应按以下产品意图接入。

## 31.1 Traveler Feature UI

Traveler ON、System OFF 时：

> 不要求独立一级 Traveler Surface。

优先贡献到：

- Player Character Detail；
- Information；
- Game Creation / Settings；
- 必要 Global Notice。

例如：

- Traveler Origin；
- 已知穿越身份；
- 异世界知识来源；
- Disclosure。

## 31.2 System Feature UI

System ON 时，本包**建议请求一个独立一级 Extension Surface：**

> **系统**

因为 Quest、Shop、Lottery、Storage、Enhancement 等共同形成长期独立工作空间。

推荐二级结构：

```text
系统
├─ 概览
├─ 任务
├─ 商城
├─ 抽奖
├─ 仓库
├─ 强化
└─ 模块
```

实际显示哪些 View：

> 由 Enabled Module 决定。

## 31.3 System Surface Ownership

当前只冻结语义意图：

> 本包是“系统” Extension Surface 的唯一 Owner。

未来 G9 应把它编译成正式结构化 Ownership Request。

若另一独立资产也要求拥有同一唯一 Surface：

> 创建 Game Instance 前判定不兼容。

## 31.4 Conditional Surface Activation

当 System Feature OFF 时：

> “系统” Surface 不应作为空壳强制显示。

未来 Host / asset-spec 需要支持：

> Feature-enabled conditional activation。

当前只登记 Host Requirement，不冻结机器字段。

## 31.5 Host Authority

资产可以描述：

- View；
- Section；
- List；
- Card；
- Meter；
- Fact；
- Safe Action Intent。

资产不能：

- 注入 JS；
- React；
- DOM；
- eval；
- CSS；
- 固定像素布局。

Host 决定：

- 响应式；
- Accessibility；
- Tabs / Drawer；
- overflow；
- 视觉主题；
- Action → Intent。

---

# 32. Game Creation / Settings Contribution

创建游戏时，本包需要能够声明：

### Traveler

- ON / OFF；
- Traveler Mode；
- Origin；
- Host Integration；
- Knowledge retention。

### System

- ON / OFF；
- Power Preset；
- Module selection；
- Per-module override；
- permission-sensitive Module acknowledgement。

高权限 Module，例如：

- World Rewrite；
- Resurrection；
- Agency Override；

如果未来可用：

> 必须单独显式启用，不得因选择 Ultimate Preset 静默打开。

---

# 33. Preflight / Compatibility｜创建游戏前检查

如果：

```text
Module Enabled
+
Required Owner Missing
```

应在创建 Game Instance 前：

- 判定 Incompatible；
- 或要求关闭对应 Module。

不能：

> 进入游戏后才发现 Healing 没有 Health Owner，然后 Traveler 自己维护一套 HP。

同样：

- Spell Module 缺 Magic Core；
- Romance Module 缺 Relationship Core；
- Character Enhancement 缺 Character Core；

都应在 Preflight 关闭。

---

# 34. Open Attempt｜没有系统能力不等于玩家不能普通尝试

如果玩家没有：

> Teleport Module

只能说明：

> 系统无法替玩家传送。

不代表玩家不能通过当前世界普通方式尝试：

- 旅行；
- 魔法传送；
- 搭车；
- 寻找 Portal。

如果系统没有：

> Healing Module

也不代表：

> 玩家不能接受普通医学 / Divine / Magic Healing。

System Capability 与 World Capability 分离。

---

# 35. Knowledge Boundary｜系统信息也必须标来源

系统告诉玩家的信息：

> 可以成为 Player Knowledge。

但必须标记：

> system-sourced。

如果 Appraisal 没有读取权限：

> 不能因为模型知道后台状态就泄露。

如果 System Feature OFF：

> 系统不能作为信息来源存在。

---

# 36. Definition / Instance Boundary

必须区分：

```text
Traveler/System Expansion Definition
!=
Game System Configuration
!=
Traveler Identity Instance
!=
System Module State
!=
System Quest Offer / Contract Instance
!=
Reward Instance
!=
System Storage State
!=
Target Domain State
```

游戏中的：

- System Upgrade；
- Currency；
- System Quest Offer / Contract；
- linked Core Task / Objective；
- Module Unlock；

保存于 Game State。

不回写原 Expansion Definition。

---

# 37. Standard Regression Scenarios｜28 个

## T-TRV-01｜纯穿越

Traveler ON，System OFF。

期望：

- 有 Traveler Identity；
- 无 Quest / Shop / Currency / System Surface；
- 世界正常运行。

## T-TRV-02｜原住民系统

Traveler OFF，System ON。

期望：

- 没有异世界身份；
- System 正常运行。

## T-TRV-03｜双 OFF

期望：

- 本包不产生运行副作用。

## T-TRV-04｜穿越 + 系统

两个 Feature ON。

期望：

- 两套 Feature 正常组合；
- 不互相隐式强制。

## T-TRV-05｜魂穿分权

玩家接管历史人物。

期望：

- 玩家人格、Host Body、Host Memory、Host Capability 分开；
- 不自动获得全部宿主记忆 / 能力调用熟练度。

## T-TRV-06｜知识不等于能力

知道现代医学概念。

期望：

- Knowledge 存在；
- EP-CHAR-CORE Capability 不自动满级。

## T-TRV-07｜System ON 但无 Healing

玩家要求系统治疗。

期望：

> 没有 Healing Module，不执行。

## T-TRV-08｜Healing Module

Healing ON + Health Core present。

期望：

- 通过 Health Handoff；
- 不直接写 HP。

## T-TRV-09｜Healing 缺 Health Core

期望：

- Preflight 不兼容 / Module 必须关闭；
- 不创建第二 Health State。

## T-TRV-10｜Ultimate Heal 非 Resurrection

角色已经进入死亡主权边界。

只有 Ultimate Healing。

期望：

> 不能偷变成 Resurrection。

## T-TRV-11｜Resurrection Module

独立 Resurrection Capability 正式启用。

期望：

- 仍检查 World / Soul / Divine Authority；
- 按 Module Permission 正式处理。

## T-TRV-12｜Relationship Assistance

期望：

- 使用 Relationship Core；
- Traveler 不维护第二 Attraction / Trust。

## T-TRV-13｜Romance Sandbox

Ultimate Rewrite 已启用。

期望：

- 可以按权限修改允许的 Preference / Accessibility；
- NPC 后续自主回应。

## T-TRV-14｜无 Agency Override

只有 Romance Sandbox。

玩家要求 NPC 立即服从告白。

期望：

> 不允许直接强制当前回应。

## T-TRV-15｜Character Enhancement

期望：

- 修改 EP-CHAR-CORE Canonical Capability；
- 不只改 UI “武力”。

## T-TRV-16｜Lottery

期望：

- Program RNG；
- 模型不能随意指定普通抽奖结果。

## T-TRV-17｜Ultimate 指定 Lottery

Module 明确允许指定结果。

期望：

- Program 依据玩家选择正式 Commit；
- 不假装随机。

## T-TRV-18｜System Shop Resource

购买大量粮食。

期望：

- 正式进入 Resource Owner；
- Economy / Survival 可消费。

## T-TRV-19｜Infinite Storage

期望：

- System Storage Owner 独立；
- 取出时正式注入 World Inventory。

## T-TRV-20｜Ultimate Teleport

允许大规模人员传送。

期望：

- Runtime 不暗中限量；
- 正式 Position Commit；
- Combat / Politics 等真实响应。

## T-TRV-21｜Teleport 非 World Rewrite

期望：

- 只能改合法 Position；
- 不能因为 Teleport 权限就创造一座城市。

## T-TRV-22｜World Rewrite

显式启用。

期望：

- 走最高权限 Mutation Contract；
- 不由模型直接提交。

## T-TRV-23｜Ultimate 不等于 Omniscient

只有 Ultimate Appraisal 的某些权限。

期望：

- 未授权政治秘密仍不可读。

## T-TRV-24｜Per-module Override

Preset = Initial，Storage = Ultimate。

期望：

- Storage 按 Ultimate；
- 其他模块仍按 Initial。

## T-TRV-25｜System Surface

System ON。

期望：

- 请求“系统” Extension Surface；
- 只显示已启用 Module 的二级 View。

## T-TRV-26｜System OFF Surface

System OFF。

期望：

- 不显示系统一级 Surface；
- Traveler 信息贡献到已有 Core Surface。

## T-TRV-27｜Save / Restore

升级系统、获得 Currency / Quest / Storage 后存档。

读回旧档。

期望：

- 恢复当时 System State；
- 后续升级不污染旧档。

## T-TRV-28｜模型无权发奖励

Narrative 写：

> “系统奖励你一万金币。”

但没有正式 Reward Outcome。

期望：

- 不进入正式状态；
- No Phantom Reward。

---

## T-TRV-29｜系统任务不建立第二 Task Owner

System 发布任务，玩家接受。

期望：

- System 保留 Quest Offer / Reward Contract；
- 正式进行中目标进入 World OS Task / Objective；
- “目标” Core Surface 与“系统” Surface 可以引用同一 Task Projection；
- 完成 / 失败只有一个正式 Task Outcome。


# 38. Host Requirements

| ID | Host 能力 | 必需性 | 缺失行为 |
|---|---|---|---|
| HR-TRV-01 | Feature ON/OFF Configuration | 必需 | 无法支持纯穿越 / 原住民系统 |
| HR-TRV-02 | Traveler Bootstrap | Traveler ON 必需 | 无法初始化 |
| HR-TRV-03 | Host Body / Memory / Capability Integration | 魂穿必需 | 魂穿降级 |
| HR-TRV-04 | System Profile persistence | System ON 必需 | 系统状态丢失 |
| HR-TRV-05 | Module Registry / Permission | System ON 必需 | 系统退化成 GM |
| HR-TRV-06 | Module Conditional Dependency Preflight | 必需 | 缺 Owner 后运行期崩坏 |
| HR-TRV-07 | System Quest Contract + World OS Task Integration | Quest Module 必需 | 否则会形成第二套目标状态 |
| HR-TRV-08 | Program RNG | Lottery 必需 | 抽奖不可验证 |
| HR-TRV-09 | Target Owner Mutation Interface | Cross-owner Module 必需 | 无法安全提交 |
| HR-TRV-10 | Knowledge Source | Appraisal / DB 必需 | 信息不入 Knowledge |
| HR-TRV-11 | System Storage | Storage 必需 | 无法运行 |
| HR-TRV-12 | Position Mutation | Teleport 必需 | 无法正式移动 |
| HR-TRV-13 | Health Interface | Healing / Health Appraisal 必需 | 无法安全运行 |
| HR-TRV-14 | Relationship Interface | Relationship Module 必需 | 无法安全运行 |
| HR-TRV-15 | Character Capability Interface | Enhancement 必需 | 无法安全运行 |
| HR-TRV-16 | Resource Injection | Generation 必需 | 资源不能正式进入世界 |
| HR-TRV-17 | World Rewrite Contract | World Rewrite 必需 | 最高权限模块不可运行 |
| HR-TRV-18 | Save / Restore | 必需 | 长期系统不可用 |
| HR-TRV-19 | Atomic Commit / Idempotency | 必需 | 重复奖励 / 重复消费 |
| HR-TRV-20 | Extension Surface | System UI 推荐 | 聊天降级 |
| HR-TRV-21 | Conditional Surface Activation | 推荐 | System OFF 仍出现空 Surface |
| HR-TRV-22 | Player-safe UI Projection | 必需 | 隐藏状态泄露 |

---

# 39. Creator / asset-spec vNext Requirements

未来 Creator / vNext 需要能够表达：

- Traveler Feature ON / OFF；
- System Feature ON / OFF；
- Traveler Mode；
- Host Integration；
- System Power Preset；
- Module Definition；
- Per-module Override；
- Permission Scope；
- Module Conditional Dependency；
- System Quest Offer / Reward Contract；
- World OS Task / Objective Handoff；
- Reward；
- Currency；
- Shop；
- Lottery；
- Storage；
- Appraisal；
- Character Enhancement；
- Health Module；
- Relationship Assistance；
- Teleport；
- Resource Generation；
- High-permission Module；
- System Extension Surface Ownership Request；
- Conditional Surface Activation；
- secondary View / Section；
- Player-safe Projection。

不得依赖：

- 任意 JS；
- eval；
- Creator 自行执行 Reward；
- Creator 自行改 Game State；
- Creator 自行运行 RNG。

---

# 40. Migration From v0.1.2｜旧资产迁移

## 40.1 正式重命名

旧：

> `异世来客：穿越者系统`

新：

> `穿越与系统`

旧名称继续作为：

> alias / legacy reference。

## 40.2 保留

- 身穿 / 魂穿 / 转生；
- Origin Background；
- 现代知识；
- 三档 System Power；
- Module Override；
- Quest Offer / Contract；
- Shop；
- Lottery；
- Reward；
- Currency；
- Storage；
- Teleport；
- Appraisal；
- Character Enhancement；
- Resource Generation；
- Relationship Assistance；
- Romance Sandbox；
- Ultimate Cheat；
- Program Validation；
- Atomic Commit；
- Ultimate 不暗中平衡。

## 40.3 重构

旧：

```text
穿越方式
+
系统类型
```

新：

```text
Traveler Feature ON/OFF
×
System Feature ON/OFF
```

## 40.4 Health Rebind

旧：

```text
Healing / Health Appraisal
→ Survival Health Interface
```

新：

```text
Healing / Regeneration / Health Appraisal
→ EP-HEALTH-CORE
```

## 40.5 Relationship Rebind

旧：

```text
Relationship Assistance
→ 人间情缘：关系与恋爱
```

新：

```text
Relationship Assistance
→ EP-RELATIONSHIP-ROMANCE-CORE
```

## 40.6 Dependency Rebind

旧包级大量 Integration：

> 降级为 Module Conditional Dependency。

## 40.7 UI Rebind

旧 System Dashboard 的需求：

> 对接 G8 `Extension Surface` 语义。

System ON：

> 建议 owns 独立 `系统` Surface。

Traveler-only：

> 优先贡献已有 Core Surface，不新增一级 Traveler Surface。

---

# 41. Quality Gate｜重构自检

| Gate | 结果 |
|---|---|
| Discussion / Authorization | PASS |
| Rename to 穿越与系统 | PASS |
| Single Package / No Split | PASS |
| Traveler ON/OFF | PASS |
| System ON/OFF | PASS |
| Four Combination Modes | PASS |
| System != GM | PASS |
| Module Permission | PASS |
| Module Conditional Dependency | PASS |
| Character Ownership | PASS |
| Health Rebind | PASS |
| Relationship Rebind | PASS |
| Magic / Divine / Combat Boundary | PASS |
| Ultimate Freedom | PASS |
| Healing != Resurrection | PASS |
| Rewrite != Agency Override | PASS |
| Teleport != World Rewrite | PASS |
| Appraisal != Omniscience | PASS |
| Program RNG | PASS |
| Atomic Commit | PASS |
| Save / Restore | PASS |
| G8 UI Host Alignment | PASS |
| Definition / Instance | PASS |
| Creator Authorability | WARN — G9 binding pending |

---

# 42. Current State

```text
EP-TRAVELER-SYSTEM｜穿越与系统
├─ Old v0.1.2 Review               COMPLETE
├─ Discussion Gate                 COMPLETE
├─ Explicit Authorization          COMPLETE
├─ Rename / Product Reframe        COMPLETE
├─ Traveler / System Toggle        COMPLETE
├─ Module Conditional Dependency   COMPLETE
├─ Health Core Rebind              COMPLETE
├─ Relationship Core Rebind        COMPLETE
├─ G8 UI Host Alignment            COMPLETE
├─ Semantic Candidate v0.2         AUDITED CURRENT
├─ Creator / asset-spec vNext      PENDING G9
└─ Independent Cross-asset Audit   PASS
```

---

# 43. Final Freeze｜最终冻结语句

> **`穿越与系统` 是一个统一资产，不拆 Traveler 与 System。**
>
> **Traveler Feature 与 System Feature 可以独立开启 / 关闭，因此既支持纯穿越，也支持原住民系统流。**
>
> **系统本体没有未声明 GM 权力；一切能力来自具体 Enabled Module。**
>
> **依赖主要发生在 Module 层，而不是把整个包 Hard Depend Character / Health / Relationship / Magic / Divine / Combat。**
>
> **Module 启用但 Required Owner 不存在时，应在 Preflight 判定不兼容或要求关闭该 Module，绝不能创建第二事实源 fallback。**
>
> **Ultimate 可以是真正的作弊模式；Runtime 不暗中平衡。但 World Rewrite、Resurrection、Character Agency Override、Omniscience 等必须是显式独立高权限能力。**
>
> **Healing 通过 Health Core；Relationship Assistance 通过关系与恋爱核心；Character Enhancement 通过人物能力与技艺；其他 Domain Module 同理。**
>
> **模型可以解释、叙事和提出 Candidate，但系统奖励、抽奖、强化、治疗、关系改写、传送和世界改写最终都必须由 Program Validation + Atomic Commit 成立。**
>
> **System ON 时，本包建议拥有一个独立“系统”Extension Surface；资产描述信息架构，Host 拥有最终布局、安全与渲染。**


---

# 44. Generic Library Closure｜通用资产库收口

本包当前 Package-level Hard Dependency：

> **无。**

依赖主要通过：

> **Module Conditional Dependency**

建立。

G8 UI Host 当前正式意图：

- Traveler-only：不创建独立一级 Surface，贡献 `人物 / 信息 / 创建游戏与设置`；
- System ON：请求拥有一个独立 `系统` Extension Surface；
- Core `目标` Surface 可展示 System 来源的正式 Task / Objective；
- `系统 > 任务` View 只是同一 Task 的 system-provenance projection + Reward Contract；
- 资产描述 View / Section，Host 拥有布局、响应式、Accessibility 与安全渲染。

**通用库独立审核：PASS。**
