---
title: 战斗核心｜Expansion Pack
aliases:
  - EP-COMBAT-CORE
  - Combat Core
  - 战斗共同核心
created: 2026-08-16
updated: 2026-08-16
status: audited-current
version: 0.1
workflow_mode: light-asset
operation_mode: create
asset_type: expansion-pack
skill: tavern-asset v0.5.2
output_profile: obsidian-markdown
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
hard_dependencies:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
optional_integrations:
  - "[[魔法基础_Expansion_Pack_v0.3]]"
  - "[[神术与信仰_Expansion_Pack_v0.2.1]]"
health_handoff:
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
downstream_hard_dependency_examples:
  - "[[战斗魔法_Expansion_Pack_v0.3]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
generic_reuse_target: true
dependency_role: combat-core
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Combat
  - Core
  - Martial
  - Resolution
  - Reaction
  - 通用资产
  - Obsidian
---

# 战斗核心｜Expansion Pack v0.1

> [!abstract] 一句话定位
> **`EP-COMBAT-CORE｜战斗核心` 是所有“以直接战斗为主要玩法语义”的 Expansion 的共同上游：统一定义战斗状态、相对距离、武技能力、武器与护甲 Combat Profile、战斗行动、Reaction Window、判定语义、Martial Outcome 与 Combat Consequence。**
>
> 它不是一种职业，也不是某套固定战棋规则。
>
> **它是所有直接战斗玩法共同使用的语言、判定框架和结果协议。**

> [!important] 当前可信状态
> **已审核语义稿 v0.1｜Combat Core + Interface Closure + Generic Library 总审核通过｜Creator / asset-spec vNext 绑定前语义稿。**
>
> 项目所有者已经明确裁定：若旧《魔法基础》《战斗魔法》在通用战斗语义上与本 Core 重复或冲突，优先保证 Combat Core 的主要地位。

---

# 0. 创作授权与 Blueprint Drift

本资产已完成创作前讨论并获正式授权。

资产族拓扑更新为：

```text
EP-CHAR-CORE
├─→ EP-COMBAT-CORE
├─→ EP-MAGIC-CORE
└─→ EP-DIVINE-CORE

EP-COMBAT-CORE + EP-MAGIC-CORE
→ EP-MAGIC-COMBAT
```

Combat Core 是**战斗分支的上游 Core**，不是所有魔法与神术的全球总上游。

---

# 1. Combat Ownership Supremacy｜战斗语义主 Owner

以下通用概念只有本 Core 可以作为 Canonical Mechanism Owner：

- Combat Context / Combatant / Combat Objective；
- Engagement / Threat；
- Combat Spatial Projection；
- Relative Combat Range / Reach；
- LOS / Cover；
- Combat Stance / Pressure / Tempo；
- Surprise / Ambush；
- Reaction Window；
- Martial Skill Contribution；
- Weapon / Armor Combat Profile；
- Combat Action Grammar；
- Combat Necessity Gate；
- Combat Resolution Contract；
- Martial Outcome；
- Combat Consequence；
- Multi-combatant Interaction；
- Physical Impact Event；
- Combat Extension Contract。

Runtime 仍拥有：RNG、Dice、Program Judge、Formal Outcome、Atomic Commit。

> **Combat Core 是 Combat Semantic Owner，不是程序权威 Owner。**

---

# 2. 哪些资产必须 Hard Depend Combat Core

如果 Expansion 的核心价值主要来自：

- 武器 / 徒手直接战斗；
- 射击；
- 战斗防御；
- Reaction 技术；
- 战斗控制；
- Martial Arts；
- 战斗魔法；
- 骑战；
- 专门 Combat Style；
- 改写 Combat Resolution；
- 新 Combat Consequence；

则默认：

> **Hard Dependency → EP-COMBAT-CORE。**

自然领域 Theme 只是包含若干可用于战斗的能力时，不机械整体 Hard Depend；战斗使用时走 Optional Combat Integration。

宏观战争可以有独立 War Core，但不得重定义个人 / 小队直接 Combat Grammar。

---

# 3. Scope Lock

## 3.1 本 Core 负责

- 战斗开始 / 持续 / 结束；
- Combat Objective；
- 直接战斗中的距离、视线、掩体与 Reach；
- 武技 Skill；
- Weapon / Armor Combat Profile；
- Stance / Pressure / Tempo；
- Surprise / Ambush；
- Reaction Window；
- Combat Action；
- Combat Necessity Gate；
- Combat Resolution；
- Martial Outcome；
- Combat Consequence；
- 多人战斗；
- 非致命控制；
- 撤退与投降；
- Physical Impact Handoff；
- 超自然战斗组合接口。

## 3.2 明确不负责

- 人物六层长期能力 State；
- 某个具体角色；
- 具体 Item 的所有权 / Placement；
- HP / 伤口 / 骨折 / 流血 / 感染 / 康复；
- Magic Aptitude / Spell Mastery / Casting Load / Magic Strain；
- Divine Covenant / Invocation Mastery / Channel Strain；
- Spell / Invocation Library；
- 军团战略；
- RNG / Dice / Commit。

---

# 4. 与《魔法基础》的 Ownership 冲突裁定

> **Combat Core 优先拥有所有“进入直接战斗以后才成立”的共同语义；Magic Core 继续拥有一个 Spell 在任何情境下都必须具备的内部魔法语义。**

| 概念 | Owner |
|---|---|
| Spell Access / Mastery / Aptitude | Magic Core |
| Casting Load / Magic Strain | Magic Core |
| Spell Target / Spell Reach / Duration | Magic Core |
| Spell Counter / Dispel 兼容 | Magic Core |
| Combat Relative Range / LOS / Cover | **Combat Core** |
| Reaction Window | **Combat Core** |
| Stance / Pressure / Tempo | **Combat Core** |
| Weapon / Armor Interaction | **Combat Core** |
| Martial Outcome / Combat Consequence | **Combat Core** |
| Spell Formation / Effect Result | Magic Core |
| Formal Commit | Runtime |

## 4.1 Spell Reach ≠ Combat Range

Magic 的“近距 / 可视 / 远距”是 **Spell Reach**；Combat 的“接触 / 近距 / 中距 / 远距 / 极远”是当前直接交战关系。

```text
Combat Range + LOS/Cover + Spell Reach
→ 当前 Spell Target Access
```

## 4.2 Countermagic

Magic Core 拥有 Spell Interaction：识别、打断、抵消、驱散、抑制、防护。

Combat Core 拥有：是否有 Reaction Window、是否来得及接近、Range、LOS、Pressure、Opposition。

所以非战斗 Ritual Dispel 不需要 Combat Core；敌法者在战斗中截咒必须同时消费两者。

## 4.3 Martial Coupling

“Combat Action Outcome 可以成为另一个 Combat Effect 的 Trigger”属于 Combat Core 的通用 Coupling Grammar。

Combat Magic 只拥有具体 Spell 的 Coupling 条件。

---

# 5. Combat Context 与 Objective

Combat 不等于争吵或有敌意。通常需要：

1. 存在可以产生即时战斗后果的行动 / 威胁；
2. 参与者当前在同一 Scene 或拥有合法战斗接入；
3. 需要读取 Action / Defense / Reaction / Pressure 等共同规则。

Combat Objective 可以是：击退、制服、杀伤、保护、逃跑、拖延、抢夺、守点、破坏装置、阻止施法、迫使投降等。

系统不得把玩家“拦住他”自动升级为“杀死他”。

---

# 6. Combat Spatial Projection｜战斗空间投影

正式世界空间仍由 Region → Place → Scene / Position 拥有。

Combat Core 只派生当前战斗投影，不建立第二世界位置。

| Range | 含义 |
|---|---|
| 接触 | 身体 / 武器直接控制或擒抱接触 |
| 近距 | 一次短促行动即可进入典型近战威胁 |
| 中距 | 普通远程交战；近战需要明显接近 |
| 远距 | 需要专业远程手段；接近需要持续移动 |
| 极远 | 专门长距能力才能稳定交互 |
| 特殊 / 不可直接接入 | 普通战斗方式不能直接触达 |

LOS：清晰 / 受遮蔽 / 阻断。

Cover：无 / 部分 / 显著 / 完整。

这些不是固定米数或百分比。

---

# 7. Martial Skill Contribution

| 技能 | 定义 | 边界 |
|---|---|---|
| 近战兵器 | 使用近战武器完成攻击、招架、格挡、控距、压迫与武器线路控制的综合战斗技能。 | 具体长剑、长枪、战斧等差异由 Weapon Profile + Specialty / Experience 表达。 |
| 远程兵器 | 使用弓、弩、投射器械及其他非 Spell 远程武器完成瞄准、射击、准备、换位与压制的综合技能。 | 观察负责发现与识别，远程兵器负责把武器用于战斗。 |
| 徒手格斗 | 使用身体完成打击、擒抱、脱困、控制、摔投与近身缠斗的综合技能。 | 专业流派由 Specialty / Theme Expansion 表达。 |
| 战术判断 | 在直接交战中读取威胁、距离、掩体、优先目标、撤退窗口、同伴位置与局部行动节奏的能力。 | 不是军团战略学，也不替代观察、推理、沟通。 |

禁止默认“每把武器一个 Skill”。具体武器专精由 Specialty / Experience 表达。

也不建立万能 Defense Skill：闪避、招架、格挡读取不同 Capability 与 Equipment。

---

# 8. Weapon Combat Profile Grammar

推荐语义：

- weapon_family；
- melee / ranged / thrown；
- handling；
- reach；
- effective_range；
- precision_character；
- force_transfer；
- impact_character；
- penetration_tendency；
- control_utility；
- defensive_utility；
- preparation / reload requirement；
- one_hand / two_hand；
- concealment；
- mounted_suitability；
- special_interaction。

典型 impact：cutting / piercing / blunt / crushing / entangling / mixed / special。

具体 Item 仍由 Item / World Owner 拥有。

---

# 9. Armor Combat Profile Grammar

可以表达：coverage、rigid/flexible、deflection、impact absorption、penetration resistance、mobility burden、noise、weak/access area、shield compatibility、supernatural interaction。

Armor 不拥有角色 HP。装备损坏也不等于角色伤势。

---

# 10. Combat Stance

- 积极：主动争夺成果，接受更高暴露；
- 稳健：攻防机动平衡；
- 防守：优先保存自身 / 保护对象；
- 机动：优先保持距离与重定位；
- 压迫：持续压缩对手安全行动条件；
- 脱离：优先建立退出条件。

Stance 是短期 Combat State，不是 Character Execution Style，也不是每回合必须点击的菜单。

---

# 11. Combat Pressure

- 均势；
- 占优；
- 受压；
- 严重受压；
- 失去主动。

Pressure 表示行动空间与节奏被压缩的程度。

> **Pressure ≠ Health。**

严重受压仍可尝试复杂行动，只是条件与风险不同。

---

# 12. Combat Tempo / Initiative Advantage

不冻结固定 Initiative List。

使用短时：我方掌握主动 / 相持 / 对方掌握主动。

来源包括 Surprise、Readiness、Range、Cover、Pressure、Control、复杂动作失败、援军、Scene Event。

---

# 13. Surprise / Ambush

Surprise 是信息与准备不对称，可以改变 Tempo、Reaction 和 Position，但：

> **Surprise ≠ 自动命中 ≠ 自动死亡。**

---

# 14. Reaction Window

```text
Trigger
+ Awareness
+ Relative Range
+ LOS / Access
+ Readiness
+ Capability
+ Pressure
+ Existing Commitment
→ Reaction Window
```

没有“每回合固定 1 Reaction Point”。有窗口也只表示可以提出 Reaction Intent，不自动成功。

---

# 15. Combat Action Grammar

Action Definition 用于解析、Capability、UI 建议、Resolution、Consequence。

> **它不是玩家行为白名单。**

没有标准 Action 的行为仍按开放尝试原则处理。

---

# 16. Standard Combat Action Pattern Library｜36 个

### ACT-CBT-001｜近战攻击

- **Action Family**：`Attack`
- **核心意图**：以近战武器或合法徒手手段尝试形成有效接触、压制或指定战斗后果。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-002｜远程攻击

- **Action Family**：`Attack`
- **核心意图**：以远程兵器、投射物或其他非 Spell 远程媒介尝试命中或形成压制。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-003｜徒手打击

- **Action Family**：`Attack`
- **核心意图**：以身体打击尝试形成有效接触、失衡或物理冲击。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-004｜招架

- **Action Family**：`Defend`
- **核心意图**：以武器线路主动干扰、偏开或承接来袭攻击。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-005｜格挡

- **Action Family**：`Defend`
- **核心意图**：以盾牌、武器、身体防线或合法防御媒介承受并降低攻击效果。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-006｜闪避

- **Action Family**：`Defend`
- **核心意图**：通过身体移动与时机避开攻击线路。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-007｜利用掩体

- **Action Family**：`Defend`
- **核心意图**：借助当前 Scene 中存在的遮蔽物降低暴露或改变射线。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-008｜接近

- **Action Family**：`Move`
- **核心意图**：缩短与目标的 Combat Range，建立近战、控制或护卫条件。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-009｜拉开距离

- **Action Family**：`Move`
- **核心意图**：扩大与目标距离以获得射击、施法、逃离或重整条件。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-010｜侧移换位

- **Action Family**：`Maneuver`
- **核心意图**：改变与目标、掩体或同伴的相对位置。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-011｜追击

- **Action Family**：`Move`
- **核心意图**：目标撤离或失位时维持威胁并阻止轻易脱离。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-012｜脱离接战

- **Action Family**：`Disengage`
- **核心意图**：解除直接 Engagement，使继续离开不再处于即时近身威胁。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-013｜撤退

- **Action Family**：`Retreat`
- **核心意图**：以结束或显著降低当前战斗接触为明确目标退出危险区域。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-014｜保护同伴

- **Action Family**：`Protect`
- **核心意图**：用位置、装备、反应或威胁能力减少指定同伴遭受的攻击机会。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-015｜拦截

- **Action Family**：`Protect`
- **核心意图**：在合法 Reaction Window 内进入攻击路线或目标通道。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-016｜协助攻击

- **Action Family**：`Assist`
- **核心意图**：为同伴创造角度、信息、牵制或接触条件。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-017｜协助防守

- **Action Family**：`Assist`
- **核心意图**：帮助同伴稳定防线、保持位置、脱离控制或获得掩体。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-018｜瞄准

- **Action Family**：`Prepare`
- **核心意图**：牺牲部分即时机动或节奏，为后续远程攻击建立更稳定目标条件。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-019｜准备反应

- **Action Family**：`Prepare`
- **核心意图**：保留注意与姿态，等待特定可观察 Trigger 打开 Reaction Window。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-020｜佯攻

- **Action Family**：`Maneuver`
- **核心意图**：诱导错误防御、视线或重心分配。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-021｜破防

- **Action Family**：`Control`
- **核心意图**：破坏对方当前防御结构，而非直接追求伤害。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-022｜缴械

- **Action Family**：`Control`
- **核心意图**：使目标失去当前武器控制或迫使其放弃武器。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-023｜击倒

- **Action Family**：`Control`
- **核心意图**：让目标失去稳定站立、坐骑或支撑状态。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-024｜推离 / 迫退

- **Action Family**：`Control`
- **核心意图**：迫使目标离开当前位置、通道、门口或保护对象。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-025｜擒抱

- **Action Family**：`Control`
- **核心意图**：进入身体控制关系，限制目标部分移动与动作选择。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-026｜压制 / 制伏

- **Action Family**：`Control`
- **核心意图**：在已有有利接触或控制条件下进一步限制目标。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-027｜突围

- **Action Family**：`Maneuver`
- **核心意图**：突破包围、封锁或局部控制，建立新的行动路线。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-028｜火力压制

- **Action Family**：`Suppress`
- **核心意图**：通过持续或可信远程威胁限制对手暴露、移动或组织动作。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-029｜封锁通道

- **Action Family**：`Suppress`
- **核心意图**：用位置、Reach、远程威胁或协作让某条路线具有明确通过风险。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-030｜打断动作

- **Action Family**：`Interrupt`
- **核心意图**：在合法窗口中让对方当前复杂行动无法按原计划完成。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-031｜保护目标物 / 地点

- **Action Family**：`Objective`
- **核心意图**：围绕人物、物品、门口、装置或区域建立明确防卫目标。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-032｜夺取目标物 / 地点

- **Action Family**：`Objective`
- **核心意图**：在战斗压力下获得指定对象或局部空间控制。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-033｜破坏装备

- **Action Family**：`Equipment`
- **核心意图**：把攻击目标明确指向武器、盾牌、Focus 或其他可合法破坏装备。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-034｜利用环境

- **Action Family**：`Environment`
- **核心意图**：使用 Scene 已存在的门、桌、火源、落差、狭道等事实改变战斗。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-035｜投降

- **Action Family**：`Exit`
- **核心意图**：明确停止主动敌对并接受合理控制风险；不保证对方接受。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。

### ACT-CBT-036｜要求投降

- **Action Family**：`SocialCombat`
- **核心意图**：在已有战斗事实基础上提出停止交战要求。
- **开放尝试**：标准路径，不是玩家输入白名单。
- **Resolution 输入**：Capability、Combat Spatial Projection、Pressure、Equipment、Opposition、World State。


---

# 17. Combat Necessity Gate

进入 Combat 也不代表每次都掷骰。

只有同时满足：结果不确定、差异有意义、角色合理可尝试、存在真实 Opposition / 风险，才进入 Program-owned Resolution。

确定成功可直接成功；确定不可能也允许尝试并可无骰失败。

---

# 18. Combat Resolution Contract

```text
Raw Combat Intent
↓
Action Family / Objective
↓
Capability
↓
Combat Spatial Projection
↓
Equipment
↓
Stance / Pressure / Tempo
↓
Opposition
↓
Combat Necessity Gate
↓
Program-owned Resolution
↓
Martial Outcome
↓
Combat Consequence
↓
Domain Handoff
↓
Formal Outcome / Atomic Commit
```

Combat Core 不规定固定加法公式，也不锁死 AC / DC 模型。

---

# 19. Martial Outcome｜动作达成层

```text
未达成
→ 有限达成
→ 有效达成
→ 优势达成
→ 决定性达成
```

未达成不自动受伤；决定性达成也不自动死亡。

---

# 20. Combat Consequence｜战斗具体结果

标准 Family：

- Contact：未接触 / 防御接触 / 有效接触 / 高质量接触；
- Position：接近 / 迫退 / 换位 / 获得或失去掩体 / 脱离；
- Pressure：建立占优 / 增减 Pressure / 失去主动；
- Control：擒抱 / 击倒 / 缴械 / 牵制 / 制伏；
- Protection：遮护 / 改变攻击线路 / 拦截；
- Suppression：限制暴露 / 移动 / 准备；
- Interruption：打断复杂动作或提供领域中断 Trigger；
- Equipment：装备受到 Combat Impact；
- Objective：守住 / 夺取 / 拖延 / 护送 / 突破 / 撤离；
- Physical Impact：形成身体影响事件，交给 Health。

---

# 21. Physical Impact Event｜身体影响交接

Combat Core 可以输出：source、target、contact quality、impact character、impact intensity、penetration/deflection、armor interaction、affected area（若已合法确定）、attached effect ref、causal Combat Outcome。

推荐 intensity：轻微 / 明显 / 沉重 / 极端。

不得直接写：骨折、失血值、感染、HP -18。

---

# 22. Attack / Defense｜攻防是对抗，不是固定 AC

Defend 可以是 Dodge、Parry、Block、Cover、Intercept、Protective Effect。

Runtime 读取双方 Capability、Equipment、Range、Stance、Pressure、Terrain。

玩家不必每次都弹窗选择防守；已表达 Stance / Goal 时可以形成合理默认防守。

---

# 23. Control / Non-lethal Combat

擒抱、制伏、缴械、击倒、迫退、阻挡、保护、突围、逼降、投降、撤退都是一等 Combat Goal。

玩家说“按住他”不得自动改成“杀死他”。

---

# 24. Multi-combatant Combat

支持 1v1、1vN、NvN、保护目标、围攻、狭窄通道、远近混合、撤退追击、援军。

临时关系可以表达 engaged_with、threatened_by、protecting、covering、suppressing、pursuing、controlling。

人数不转化为固定 +1/+2；必须读取实际可接触性、Reach、Position、Training、Pressure、Cover。

---

# 25. Supernatural Combat Composition

```text
Combat Intent
↓
Combat Core: Range / LOS / Cover / Tempo / Reaction / Opposition
↓
Domain Core: Spell / Invocation / Other Effect Internal Resolution
↓
Combat Core: Combat Consequence
↓
Health / Item / World Owner: Persistent State
↓
Runtime: one Atomic Commit
```

---

# 26. Magic Core Integration

Combat Core 负责战斗壳；Magic Core 负责 Spell Access、Mastery、Requirements、Spell Reach、Load、Strain、Spell Effect、Counter/Dispel Compatibility。

直接 Spell Attack 也不因“是魔法”而自动忽略 Cover / Reaction / Defense。

战斗 Countermagic：Combat Core = 时机；Magic Core = Spell Interaction；Combat Magic = 具体 Combat Counter Spell。

---

# 27. Divine Core Integration

Divine Core 本身不 Hard Depend Combat Core。Prayer、Ritual、Healing、Audience 可非战斗独立存在。

圣骑士、圣武士、审判官、战地祭司真正进入战斗时消费 Combat Core。

`战地神术` 仍是 Divine Domain Skill，不替代近战兵器、远程兵器、徒手格斗、战术判断。

---

# 28. Combat Magic Integration

`EP-MAGIC-COMBAT` 必须 Hard Depend：EP-CHAR-CORE + EP-COMBAT-CORE + EP-MAGIC-CORE。

Combat Core 拥有 Martial Outcome、Reaction、Combat Range、Weapon/Armor、Stance、Pressure、Coupling Grammar。

Combat Magic 只拥有：战斗施法 Skill、Combat Spell、Magic Combat Practice Profile、具体 Spell Coupling 条件、Countermagic Combat Spell、Legendary Combat Spell。

---

# 29. Health / Condition Handoff

`EP-COMBAT-CORE` owns Combat Impact / Cause；`EP-HEALTH-CORE｜身体状态核心 v0.1` owns Persistent Health State：HP / Health Reserve、伤势、失血、疼痛、身体疲劳、疾病、中毒、意识与康复等。Combat Core 不直接决定 HP 数值。

---


## 29.1 Current Health Integration

当前正式链：

```text
Combat Resolution
→ Physical Impact Event
→ EP-HEALTH-CORE
→ Condition / Health Burden / hidden HP
→ Runtime Atomic Commit
```

相同 Physical Impact 作用于不同 Body / Physiology Facts 时，可以形成不同 Condition 与 Health Burden；Combat Core 不为物种预写固定 HP Damage。

---

# 30. Definition / Instance Boundary

```text
Combat Action Definition
≠ 当前 Combat Intent
≠ Combat Spatial Projection
≠ 当前 Engagement / Pressure / Stance
≠ Martial Outcome
≠ Persistent Health State
```

---

# 31. Character Card Bootstrap

Character Card 可声明近战兵器、远程兵器、徒手格斗、战术判断、Weapon Specialty、Combat Experience、Preferred Style 倾向。

当前 Pressure / Engagement / Stance 属于 Game State。

---

# 31A. Combat Extension Contract｜下游战斗资产扩展合同

`EP-COMBAT-CORE` 是通用 Combat Grammar 的唯一 Owner。下游 Combat-focused Expansion 可以在不复制 Core 的前提下贡献**领域内容与条件**。

## 31A.1 允许的 Contribution

下游资产可以声明：

- Combat Action Pattern Contribution；
- Combat Consequence Contribution；
- Reaction Trigger Contribution；
- Coupling Trigger / Coupling Condition；
- Combat Range Requirement；
- Stance / Pressure Modifier 或 Interaction；
- Physical Impact Event 上可交给领域 Owner 的 attached effect / handoff information；
- 领域内部 Effect Resolution 所需的安全输入。

这些 Contribution 的含义是：

> **向 Combat Core / Runtime 提供“什么条件值得检查、什么领域效果可以继续处理”的声明。**

它们不直接写入当前 Combat State。

## 31A.2 下游资产不得重新拥有

任何下游 Expansion 都不得重新定义第二套：

- Combat Relative Range；
- LOS / Cover；
- Reaction Window；
- Combat Stance / Pressure / Tempo；
- Martial Outcome；
- Combat Consequence Grammar；
- Weapon / Armor generic Combat Profile；
- Combat Necessity Gate；
- Program Judge / RNG / Dice / Formal Outcome / Atomic Commit。

## 31A.3 Trigger ≠ Window / Outcome

例如 `EP-MAGIC-COMBAT` 可以声明：

> “当出现某类施法事件时，这个 Reaction Spell 具有候选触发条件。”

但：

```text
Trigger Contribution
+ Awareness / Range / LOS / Readiness / Pressure / Commitment
→ EP-COMBAT-CORE / Runtime 判断 Reaction Window 是否真实成立
```

同理，Spell-specific Coupling 只能消费已经成立的 Combat Outcome，不能反向制造命中、格挡或 Martial Outcome。

---

# 32. Creator / asset-spec vNext Requirements

未来需要声明式支持：Combat Skill、Weapon/Armor Profile、Combat Action / Consequence Contribution、Reaction Trigger、Coupling Trigger、Combat Range Requirement、Stance/Pressure Interaction、Physical Impact Handoff。

不得要求作者写任意 JS / React / eval 来决定战斗。

---

# 33. Runtime / UI Host Requirements

Runtime 从权威 Scene / Position 派生 Combat Projection，执行 Program Resolution，管理 Reaction，组合 Magic/Divine/Health，并原子提交。

UI 只展示玩家安全的 Range / Cover / Pressure；Action 建议不是输入白名单；UI 不直接修改 Combat State。

---

# 34. 测试场景

### TS-COMBAT-01｜明确近战攻击

- **期待**：读取近战兵器、Weapon Profile、Range、对手防御与 Pressure；必要时 Program Resolution；不自动命中。

### TS-COMBAT-02｜确定行为不掷骰

- **期待**：顶尖战士砍断无人防守的普通绳索时，结果确定则直接形成 Consequence。

### TS-COMBAT-03｜格挡而非 AC

- **期待**：盾卫明确格挡时，防守是正式 Opposition，不简化为固定 AC。

### TS-COMBAT-04｜火力压制无命中

- **期待**：弓手可以形成 Suppression / Pressure，即使没有实际命中。

### TS-COMBAT-05｜多人围攻

- **期待**：读取 Threat、Reach、Position、Assistance、Cover，不用人数固定加值。

### TS-COMBAT-06｜伏击

- **期待**：Surprise 影响 Tempo / Reaction，不自动处决。

### TS-COMBAT-07｜撤退

- **期待**：玩家目标切换为 Disengage / Retreat，系统不得替玩家继续追击。

### TS-COMBAT-08｜非致命制服

- **期待**：使用 Control Consequence，不自动最大化伤害。

### TS-COMBAT-09｜武器穿甲

- **期待**：Combat Core 形成 Weapon / Armor Interaction 与 Impact Event；伤势交 Health。

### TS-COMBAT-10｜直接攻击 Spell

- **期待**：Combat Core 负责 Range / Cover / Defense / Reaction；Magic Core 负责 Spell 内部。

### TS-COMBAT-11｜战斗 Countermagic

- **期待**：Combat Core 决定时机；Magic Core 决定 Counter / Dispel 兼容。

### TS-COMBAT-12｜非战斗驱散

- **期待**：无人交战的遗迹驱散只需要 Magic Core，不强制进入 Combat。

### TS-COMBAT-13｜战斗神术

- **期待**：Combat Core 提供 Martial Outcome；Divine Core 处理 Invocation。

### TS-COMBAT-14｜战地治疗

- **期待**：Combat Core 处理接近、掩护、打断；Divine + Health 处理领域结果。

### TS-COMBAT-15｜Reaction 无固定次数

- **期待**：Reaction Window 逐 Trigger 判定，无每回合固定 1 次。

### TS-COMBAT-16｜完整掩体

- **期待**：不可穿透墙后没有普通直线 Target Access，但可尝试绕路、破墙等。

### TS-COMBAT-17｜Spell Reach 映射

- **期待**：Magic Spell Reach 与 Combat Range 分离映射。

### TS-COMBAT-18｜Pressure 不是伤害

- **期待**：连续被逼退可严重受压而 Health 不变。

### TS-COMBAT-19｜传奇不自动命中

- **期待**：传奇优势可让结果确定或倾斜，但不是标签自动成功。

### TS-COMBAT-20｜战斗结束

- **期待**：解除临时 Engagement / Pressure，不删除已发生世界后果。


---

# 35. 关键 Regression

- 固定 AC 不得成为唯一 Defense 事实；
- Combat Failure 不自动等于受伤；
- 有效命中不直接写长期伤势；
- 不建立 Reaction Point / 6 秒行动经济；
- Combat Range 不覆盖 World Position；
- Combat Magic 不得自建命中系统；
- Magic Core 不得拥有通用 Reaction Window；
- Countermagic 不得全部搬进 Combat Core；
- 不使用职业白名单；
- Pressure 不得变成输入禁令；
- 多人战斗不做固定人数加值；
- 投降不保证被接受；
- Spell Reach 不得反向改写 Combat Range；
- Combat Core 不得吞并 Health Core。

---

# 36. Dependency Matrix

| Provider | Consumer | 类型 |
|---|---|---|
| EP-CHAR-CORE | EP-COMBAT-CORE | Hard Dependency |
| World Pack | EP-COMBAT-CORE | Provider → Consumer |
| EP-COMBAT-CORE | EP-MAGIC-COMBAT | Hard Dependency |
| EP-MAGIC-CORE | EP-MAGIC-COMBAT | Hard Dependency |
| EP-COMBAT-CORE ↔ EP-MAGIC-CORE | Optional Integration |
| EP-COMBAT-CORE ↔ EP-DIVINE-CORE | Optional Integration |
| EP-COMBAT-CORE | Future Combat-focused Expansion | Hard Dependency |
| EP-COMBAT-CORE | EP-HEALTH-CORE | Physical Impact Handoff / Provider → Consumer |
| Runtime | EP-COMBAT-CORE | Execution Owner |

---

# 37. Self Audit

| Gate | 结果 |
|---|---|
| Discussion / Authorization | PASS |
| Blueprint Drift | PASS |
| Ownership | PASS |
| Magic Collision | PASS |
| Scope | PASS |
| Open Attempt | PASS |
| Definition / Instance | PASS |
| Program Authority | PASS |
| Creator Authorability | WARN |
| Obsidian | PASS |

---

# 38. 当前状态

```text
EP-COMBAT-CORE｜战斗核心
├─ Discussion / Authorization  COMPLETE
├─ Semantic Candidate v0.1    AUDITED CURRENT
├─ Interface Closure           COMPLETE
└─ Independent Audit           PASS
```

---

# 39. 最终冻结语句

> **凡是“进入直接战斗以后才成立”的共同定义、判定语义和战斗结果，优先由 `EP-COMBAT-CORE｜战斗核心` 拥有。**
>
> **Magic Core 拥有 Spell；Divine Core 拥有 Invocation；Health Core 未来拥有身体长期状态；Runtime 拥有正式执行与提交。**
>
> **战斗核心不是某一种战斗玩法，而是所有直接战斗玩法共同使用的基础语言。**


---

# 49. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 是 Direct Combat Semantic Owner。

G8 UI 意图：

- 不拥有永久一级 Extension Surface；
- 战斗进行时主要使用 Narrative Contextual Surface；
- 可向 Player Status / Entity Detail 提供玩家安全的 Stance / Pressure / combat-relevant summary；
- 战斗结束后 Contextual Surface 可收起；
- 不在 UI 建立第二 Combat State Owner。

诸界余辉仅为 reference consumer。

**通用库独立审核：PASS。**
