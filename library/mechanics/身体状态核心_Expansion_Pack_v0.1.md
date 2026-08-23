---
title: 身体状态核心｜Expansion Pack
aliases:
  - EP-HEALTH-CORE
  - Health Core
  - 身体状态核心
  - Health / Condition Core
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
  - "[[战斗核心_Expansion_Pack_v0.1]]"
  - "[[魔法基础_Expansion_Pack_v0.3]]"
  - "[[神术与信仰_Expansion_Pack_v0.2.1]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
generic_reuse_target: true
dependency_role: health-condition-core
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Health
  - Condition
  - HP
  - Injury
  - Disease
  - Recovery
  - Core
  - 通用资产
  - Obsidian
---

# 身体状态核心｜Expansion Pack v0.1

> [!abstract] 一句话定位
> **`EP-HEALTH-CORE｜身体状态核心` 是所有持续性身体 / 生理状态的共同事实源：统一维护一个对象当前承受了什么身体 Condition、这些 Condition 怎样影响隐藏的 0–100 Health Reserve（HP）、身体功能怎样受限，以及状态怎样稳定、恶化、治疗和康复。**
>
> 它不是战斗伤害包，也不是医学模拟器。
>
> **Combat 决定发生了什么身体影响；Magic / Divine / World 等来源提供合法身体作用；Health Core 负责这些作用真正落到身体以后，持续状态变成什么。**

> [!important] 当前可信状态
> **已审核语义稿 v0.1｜Ownership / Dependency / HP-Condition / Program Authority / Health-Soul Boundary 总审核通过｜Creator / asset-spec vNext 绑定前语义稿。**
>
> 本稿冻结的是 Ownership、HP / Condition 共同语义、身体差异、治疗 / 康复、Critical / Bodily Death 边界、跨 Core Handoff 与 Runtime Requirement。
>
> 当前不伪造最终 JSON Schema、Runtime API、Creator 字段或代码 Primitive。

---

# 0. Discussion Contract｜已确认设计方向

本资产依据本轮正式 Discussion Gate 创作。

已确认核心方向：

1. Health / Condition Core 是跨 World Pack 可复用的**通用上游 Core**；
2. 它拥有 Persistent Bodily / Physiological State；
3. 默认采用隐藏 `0–100` 标准化 HP；
4. 所有对象的默认 Max HP 都是 `100`，表示**相对于该对象自身身体最大承受余量的 100%**，不是跨种族绝对身体强度；
5. 不同物种 / 身体结构的差异，不通过不同 Max HP 表达，而通过 Body / Physiology Facts、Condition Applicability、Severity、Health Burden、Functional Effect、Progression / Recovery 体现；
6. HP 不替代伤势、疾病、中毒、疼痛、疲劳等 Condition；
7. **Condition 是身体事实，HP 是 Condition 对整体身体承受余量的隐藏量化投影；**
8. Combat / Magic / Divine 等来源资产不得自行决定 `HP -X / +X`；
9. 来源资产提供合法 Impact / Treatment Effect，Health Core 统一解释为 Condition 变化；
10. Runtime 拥有最终数值计算、必要的 Program Resolution、RNG / Dice 与 Atomic Commit；
11. 模型不得临场决定 HP 数值；
12. Health Core 保持稳定轻量，不发展为医学模拟器；
13. 当前先行版完成本 Core 后，不因此自动生产疾病包、医学包、生命魔法包、生存包等下游资产。

---

# 1. Scope Lock｜职责边界

## 1.1 本 Core 唯一回答的问题

> **“一个有正式身体事实的角色 / 生物，现在身体实际上处于什么持续状态，这些状态对其整体身体承受余量与具体身体功能造成什么影响，以及它们如何随新的影响、治疗和时间发生变化？”**

## 1.2 本 Core 必须负责

- `Health Reserve / HP` 的统一语义；
- 默认 Max HP = 100 的标准化规则；
- 当前 HP 与 Condition Health Burden 的统一关系；
- Persistent Bodily Condition Grammar；
- Condition Family；
- Condition Severity；
- Condition Trend；
- Condition Health Burden；
- Body Scope / Physiological Scope；
- Functional Effect；
- Condition Cause / Provenance；
- Condition Progression；
- Condition Stabilization；
- Treatment Interaction；
- Natural Recovery；
- Rehabilitation / Functional Recovery；
- Consciousness State；
- Overall Health Band；
- Critical / Dying Gate；
- Bodily Death 的身体事实；
- Health Impact Handoff；
- Treatment Effect Handoff；
- Species / Body Structure 差异的 Health Interpretation；
- Player-safe Health Projection；
- Health Knowledge / Diagnosis Boundary；
- Character Card Bootstrap 需求；
- Runtime / Creator / asset-spec vNext Requirement；
- 下游 Health-focused Expansion 的 Extension Contract。

## 1.3 本 Core 明确不负责

- Combat 是否命中；
- 武器 / Armor Combat Resolution；
- Combat Relative Range / Reaction / Pressure；
- Spell 是否成功；
- Magic Aptitude / Spell Mastery / Magic Strain；
- Divine Covenant / Invocation / Channel Strain；
- 灵魂状态；
- 死后灵魂去向；
- Divine Sovereign Authority；
- 复活主权；
- 情绪、恐惧、悲伤、愤怒等一般心理状态；
- Relationship；
- Character Level / XP；
- 物品耐久；
- 建筑 / 装备损坏；
- 每种疾病的完整医学数据库；
- 每种毒物的完整药理数据库；
- 外科模拟器；
- 器官逐分钟模拟；
- 饥饿 / 生存资源本身；
- 食物 / 药物库存；
- RNG / Dice；
- Program Judge；
- Formal Outcome；
- Atomic Commit；
- 任意代码。

---

# 2. Ownership Map｜唯一事实源

```text
World Pack / Species / Character Definition
→ 身体结构、物种生理、个体长期身体事实

EP-CHAR-CORE
→ 长期 Character Capability
→ 体魄等通用能力事实

EP-COMBAT-CORE
→ Physical Impact Event

EP-MAGIC-CORE / Magic Theme
→ Magic-origin Health-relevant Effect / Backlash

EP-DIVINE-CORE
→ Divine Treatment / Bodily Effect Proposal

EP-HEALTH-CORE
→ HP / Health Reserve
→ Persistent Bodily Conditions
→ Consciousness
→ Functional bodily consequence
→ Stabilization / Progression / Recovery semantics
→ Bodily Death state

Game State
→ 当前实际 HP / Conditions / Consciousness / Health progression

Runtime
→ Program Resolution / 数值计算 / RNG / Dice / Formal Outcome / Atomic Commit
```

> **Health Core 是 Health Semantic Owner，不是 Program Authority Owner。**

---

# 3. Health-bearing Body｜什么对象可以拥有 Health State

Health Core 不默认所有 Character 都是人类身体。

一个对象只有在 World / Character / Species 已经提供合法的身体 / 生理存在事实时，才可以拥有 Health State。

可以包括：

- 人类；
- 瑟林；
- 赫姆拉；
- 界裔；
- 灵造民；
- 动物；
- 其他 World Pack 定义的健康承载生命 / 人格主体。

Health Core 不拥有：

- 物种身体设计；
- 器官列表；
- 血液存在性；
- 骨骼存在性；
- 灵造结构零件表。

这些来自正式 World / Character facts。

## 3.1 Pioneer Host Assumption｜先行版宿主假设

当前先行版将 Health State 绑定到**可作为 Character / Actor 实例化并能够提供 `EP-CHAR-CORE` 兼容 Capability Evidence 的有身体对象**。

因此：

- 人类、瑟林、赫姆拉、界裔、灵造民等人物实体可直接使用本 Core；
- 动物或其他生物若未来进入正式 Health Resolution，Host 需要将其表示为可提供相应 Character-like Capability Evidence 的 Actor；
- 本条不表示所有对象都必须拥有完整六层人物内容，也不把 Item / Structure 强行变成 Character；
- 如果未来 Runtime 出现不经过 Character Capability substrate 的独立生物实体模型，应在 G9 后重新评估本 Hard Dependency，而不是当前先行版预造第二套 Capability Owner。

---

# 4. Body / Physiology Facts｜身体差异怎样进入 Health

## 4.1 核心原则

> **Max HP 统一，不代表身体结构统一。**

所有 Health-bearing Body 默认：

```text
Max Health Reserve = 100
```

但相同外部事件作用于不同身体时，可以产生：

- 不同 Condition；
- 不同 Severity；
- 不同 Health Burden；
- 不同 Functional Effect；
- 不同 Progression；
- 不同 Treatment Requirement。

## 4.2 例子

同一钝性胸部冲击：

### 人类

可能形成：

- 胸廓创伤；
- 呼吸疼痛；
- 严重时产生缺氧风险。

### 赫姆拉

若 World Fact 证明其承力结构更能承受此类压缩：

- 可能形成更轻的结构损伤；
- Health Burden 更低。

### 灵造民

可能没有：

- 骨折；
- 失血；

而是：

- 外壳裂损；
- 内部承力结构偏移；
- 能量 / 控制通路异常。

若击中关键核心结构，反而可以形成更高 Health Burden。

## 4.3 不建立种族固定 HP 加值

禁止：

```text
人类 Max HP = 100
赫姆拉 Max HP = 120
灵造民 Max HP = 150
```

当前统一：

> **100 = 这个对象自身完整身体承受余量的 100%。**

物种差异进入 Condition Resolution，而不是 Max HP。

---

# 5. Health Reserve / HP｜隐藏量化层

## 5.1 定义

`HP / Health Reserve` 表示：

> **对象相对于自身完整身体基线，还剩多少整体身体 / 生理承受余量。**

默认：

```text
Max HP = 100
Min HP = 0
```

HP 是标准化百分比尺度。

## 5.2 HP 不是

- 当前“健康百分比”的全部真相；
- 战斗力百分比；
- 肢体功能百分比；
- 疼痛百分比；
- 精神状态；
- Magic Strain；
- Channel Strain；
- Combat Pressure；
- 灵魂完整度；
- 玩家必看的血条。

## 5.3 HP 默认隐藏

默认玩家安全投影：

> **不发送精确 HP 数值。**

玩家侧优先看到：

- 已知身体 Condition；
- 可观察症状；
- Functional Effect；
- Overall Health Description；
- 恢复 / 恶化趋势。

NPC 精确 HP 默认属于 private Game State。

玩家角色的精确 HP 是否未来允许显示，留给 Game UI / World / Host Policy 讨论，不在当前资产冻结。

---

# 6. Condition-first HP Rule｜HP 只能由 Condition 驱动

这是本 Core 的核心硬规则。

正式链：

```text
Cause / Impact / Treatment
↓
Condition Resolution
↓
Condition 创建 / 改变 / 稳定 / 移除
↓
Health Burden 变化
↓
HP 重新计算
```

禁止：

```text
Combat Spell → HP -20
Sword Attack → HP -15
Healing Invocation → HP +30
```

作为正式资产事实。

## 6.1 为什么

如果各来源资产自己决定 HP：

- Combat 会拥有一套伤害表；
- Magic 会拥有第二套；
- Poison 会拥有第三套；
- Divine Healing 会拥有第四套。

因此：

> **外部系统只能提供 Health-relevant Cause / Effect；Health Core 统一决定 Condition + HP。**

---

# 7. Canonical HP Derivation｜HP 与 Health Burden

## 7.1 Health Burden

每个 Active Condition 可以对整体 Health Reserve 产生：

> **Health Burden｜身体负担**

Health Burden 使用与 HP 同一 `0–100` 量化尺度。

它表示：

> 当前 Condition 对对象整体身体承受余量实际占用了多少。

## 7.2 HP 推荐语义

当前推荐：

```text
Current HP
=
100
-
Aggregate Active Health Burden
```

最终限制：

```text
0 <= Current HP <= 100
```

Runtime 可以缓存当前 HP 以提高执行效率。

但 Canonical 语义仍是：

> **HP 必须可由当前 Active Conditions 的正式 Health Burden 解释。**

不允许存在：

> “角色莫名其妙少了 17 HP，但没有任何身体原因。”

## 7.3 Aggregate 不等于无脑重复相加

Runtime 在 Health Resolution 时必须避免同一个生理后果被多个完全重复 Condition 重复计算。

例如：

- 创伤；
- 由创伤产生的失血；

如果二者确实分别影响身体，可以分别贡献 Burden。

但不能同时创建：

- “大量失血”；
- “血液减少”；
- “失血性衰弱”；

三条其实描述同一当前事实的状态，然后机械三次扣除。

> **Condition Distinctness Gate：只有具有独立因果、独立进展或独立玩法意义的身体状态才成为独立 Condition。**

---

# 8. Severity ≠ Health Burden｜严重度不等于扣血值

Condition 使用统一 Severity：

```text
轻微
→ 中等
→ 严重
→ 危重
```

但：

> **Severity 不直接等于固定 HP Burden。**

例如：

### 严重局部手部结构损伤

可能：

- Functional Effect 非常严重；
- 但整体生命承受余量损失有限。

### 中等系统性毒素作用

可能：

- 外表创伤不明显；
- 却对整体 Health Reserve 形成更高 Burden。

所以正式 Health Resolution 必须读取：

- Condition Type；
- Severity；
- Body Scope；
- Body / Physiology Facts；
- 当前其他 Conditions；
- Progression；
- Treatment；
- 真实因果；

共同决定 Health Burden。

---

# 9. HP Bands｜隐藏内部阈值

为保证 Runtime 具有稳定尺度，本 Core 定义少量内部语义区间：

| HP | Internal Band | 语义 |
|---:|---|---|
| 76–100 | 充足 | 整体身体承受余量仍较充足 |
| 51–75 | 受损 | 已存在明显身体负担 |
| 26–50 | 严重受损 | 生理余量明显不足，新的高强度负荷风险显著上升 |
| 1–25 | 危重 | 接近身体生命维持极限 |
| 0 | 承受余量耗尽 | 必须进入 Critical / Dying Resolution |

这些 Band：

- 主要给 Runtime 使用；
- 不是玩家血条；
- 不自动产生 Condition；
- 不自动禁止 Action；
- 不自动决定死亡。

---

# 10. Condition Grammar｜统一身体状态骨架

每个正式 Active Condition 至少需要能够回答：

- **Family**：属于哪类身体问题；
- **Identity**：具体是什么；
- **Cause / Provenance**：为什么产生；
- **Body / Physiological Scope**：影响哪里 / 什么身体功能；
- **Severity**：轻微 / 中等 / 严重 / 危重；
- **Trend**：改善 / 稳定 / 恶化；
- **Functional Effect**：具体限制什么；
- **Health Burden**：当前对 HP 的正式量化贡献；
- **Progression**：什么条件可能使其变化；
- **Recovery / Treatment Interaction**：什么类型的干预能够影响它。

这些是**语义要求**，不是冻结的 vNext 字段名。

---

# 11. Condition Family｜六类先行版身体状态

当前先行版只提供六个宽泛 Family。

## 11.1 Trauma｜创伤 / 结构损伤

处理：

- 切割；
- 穿刺；
- 挫伤；
- 承力结构损伤；
- 骨折（仅适用于存在对应结构的身体）；
- 烧灼；
- 压砸；
- 撕裂；
- 灵造结构破损；
- 其他真实身体结构损伤。

Combat `Physical Impact Event` 最常进入这一 Family。

## 11.2 Physiological Disturbance｜生理失衡

处理：

- 失血；
- 缺氧；
- 脱水；
- 体温异常；
- 生理性虚弱；
- 生命功能不稳定；
- 其他不必等同单一结构损伤的系统性身体异常。

例如：

> 深部创伤是 Trauma；由它造成的持续大量失血可以成为 Physiological Disturbance。

## 11.3 Disease｜疾病

处理：

- 感染；
- 急性疾病；
- 慢性疾病；
- 病理性身体状态；
- World-defined disease。

Core 不提供病原数据库。

## 11.4 Toxic / Exposure｜毒素与有害暴露

处理：

- 毒物；
- 有害炼金物；
- 环境污染；
- 某些魔法污染造成的持续生理作用；
- 其他明确 Exposure → Bodily Effect。

## 11.5 Fatigue / Weakness｜身体疲劳与衰弱

表示：

> 身体当前持续运动、力量输出与承担额外生理负荷的能力下降。

它不等于：

- Magic Strain；
- Channel Strain；
- Combat Pressure；
- “精神上不想继续”。

## 11.6 Pain｜疼痛

Pain 可以：

- 来自 Trauma；
- 来自 Disease；
- 来自 Toxic Effect；
- 独立形成有玩法意义的身体限制。

疼痛可以严重影响行动，但：

> **高 Pain 不必意味着低 HP。**

止痛也不等于修复创伤。

---

# 12. Functional Effect｜功能限制独立于 HP

Health Core 必须允许 Condition 声明：

> **它具体让什么身体功能变得困难、危险或暂时不可用。**

例如：

- 左手承重受限；
- 双手武器使用困难；
- 精细操作显著受限；
- 长距离奔跑能力下降；
- 呼吸负荷上升；
- 站立不稳；
- 说话困难；
- 视觉受限。

硬规则：

> **HP 85 不代表角色拥有 85% 战斗力。**

可以存在：

```text
HP = 86
左手严重结构损伤
→ 双手操作显著受限
```

也可以存在：

```text
HP = 39
无明显肢体结构损伤
严重中毒 + 全身衰弱
→ 四肢完整但无法承担剧烈行动
```

---

# 13. Body Scope｜支持身体部位，但不硬编码人类解剖

Health Core 支持：

- local body region；
- organ / structure；
- systemic physiology；
- special body subsystem；

但不提供固定“人类解剖枚举”作为全世界唯一身体表。

World / Species / Character Definition 提供：

> 这个身体真正具有什么结构。

Health Core 只解释：

> Condition 怎样作用于这些合法身体结构。

---

# 14. Trend｜改善 / 稳定 / 恶化

Condition Trend 使用：

```text
改善
稳定
恶化
```

“未知”属于 Character Knowledge，不是 Condition Trend。

## 14.1 Severity 与 Trend 分离

例如：

```text
严重 / 稳定
```

与：

```text
中等 / 恶化
```

是不同危险。

Runtime 不得只看 Severity 忽略 Trend。

---

# 15. Condition Progression｜不做每回合医学模拟

Condition 可以随：

- 有意义时间经过；
- 剧烈活动；
- 新身体影响；
- Treatment；
- 环境；
- 疾病自然过程；
- 毒素作用；
- 休息；

发生变化。

但本 Core 不要求每 Turn 自动计算全部身体状态。

## 15.1 Meaningful Progression Trigger

只有当：

- 足够时间过去；
- Condition 本身具有真实进展需求；
- 玩家 / NPC 进行了可能影响该 Condition 的行动；
- 外部环境发生重要变化；

才执行正式 Health Progression Resolution。

## 15.2 禁止固定 DoT 思维成为 Core

不默认：

```text
Bleeding → 每回合 -5 HP
```

而是：

```text
Bleeding: 中等 / 恶化
+ meaningful time / exertion
→ Health Progression Resolution
→ new Condition / Burden / HP
```

这样 Health 使用正式 World Time，而不是强行建立回合制医学计时器。

---

# 16. Secondary Condition Gate｜避免 Condition 爆炸

一个身体事实只有在满足至少一种情况时，才应升级成独立 Condition：

1. 它有独立 Progression；
2. 它需要独立 Treatment；
3. 它对 Function 有独立影响；
4. 它对 Health Burden 有独立意义；
5. 它会在后续玩法中被单独查询 / 交互。

例如：

> 轻微擦伤

不需要自动拆成：

- 皮肤损伤；
- 微量出血；
- 轻微疼痛；

三条 Condition。

但：

> 深部创伤 + 持续大量失血

由于失血具有独立恶化和止血玩法，可以成为两个 Condition。

---

# 17. Consciousness State｜意识是全局身体轴

Consciousness 不作为普通 Condition Family。

推荐全局状态：

```text
清醒
→ 意识受损
→ 无意识
```

来源可以是：

- 失血；
- 缺氧；
- 毒素；
- 创伤；
- 极端疲劳；
- 魔法事故；
- 其他身体事实。

## 17.1 HP 不自动决定意识

禁止：

```text
HP < 50 → 自动昏迷
```

正确：

```text
Current Conditions
+ HP Reserve
+ Body Facts
→ Health Resolution
→ Consciousness State
```

一个角色可以：

- HP 较低但仍清醒；
- HP 较高但因特殊毒素失去意识。

---

# 18. Treatment Grammar｜治疗不是“加血按钮”

所有 Treatment Source 必须先产生：

> **Health-relevant Treatment Effect**

然后由 Health Core 处理实际 Condition。

本 Core 提供四类轻量 Treatment Outcome。

## 18.1 Stabilize / Support｜稳定 / 支持

目标：

> 阻止 Condition 继续恶化，或提供必要生命支持。

例如：

- 止血；
- 固定结构；
- 维持呼吸；
- 隔离毒素继续吸收；
- 生命维持。

典型结果：

```text
恶化 → 稳定
```

不保证立即降低 Severity。

## 18.2 Relief｜缓解

目标：

> 降低某个症状 / Secondary Condition 的负担。

例如：

- 止痛；
- 缓解恶心；
- 降低部分生理不适。

它可以降低 Pain 或改善 Function，但不自动修复 Cause。

## 18.3 Repair / Treat｜治疗 / 修复

目标：

> 直接降低核心 Condition 的严重度 / Health Burden。

例如：

- 创伤修复；
- 抗感染治疗；
- 毒素中和；
- Divine tissue restoration；
- 合法生命魔法治疗。

## 18.4 Recover / Rehabilitate｜康复 / 复健

目标：

> 通过时间、活动与照护恢复身体功能，使已稳定 Condition 进一步改善或移除。

## 18.5 Treatment 不直接增加 HP

硬规则：

```text
Treatment
→ Condition change
→ Burden change
→ HP recompute
```

而不是：

```text
Treatment → HP +30
```

---

# 19. Natural Recovery｜自然恢复

身体可以在合法条件下自然恢复。

可能读取：

- Condition Type；
- Severity；
- Trend；
- Body Facts；
- 休息；
- 营养 / 环境（若已有合法 Provider）；
- 治疗；
- 时间；
- 相关 Character Capability。

但 Core 不规定：

> “睡一觉全部恢复”。

## 19.1 Recovery 不保证完全复原

可能结果：

- 完全恢复；
- Severity 下降；
- Trend 改善；
- Health Burden 降低；
- Function 恢复；
- 留下稳定长期 Condition；
- 形成永久或长期功能变化。

若长期身体变化已经足够稳定到影响 Character Capability：

> 可以进一步进入 Character / World 正式变更流程。

Health Core 不私自重写六项 Character Attribute。

---

# 20. Combat Handoff｜与战斗核心的接口

`EP-COMBAT-CORE` 不 Hard Depend Health Core。

关系：

> **Handoff / Optional Integration**

Combat Core 负责：

- Contact；
- Physical Impact Event；
- impact character；
- intensity；
- penetration / deflection；
- armor interaction；
- affected area（若合法成立）；
- Combat causal provenance。

Health Core 负责：

```text
Physical Impact Event
+ Body Facts
+ Current Conditions
↓
Health Resolution
↓
Condition changes
+ Health Burden
+ HP
+ Function
+ Consciousness if relevant
```

Combat Core 不直接写：

- 骨折；
- 出血；
- 感染；
- HP；
- 康复。

---

# 21. Magic Handoff｜与魔法基础的接口

`EP-MAGIC-CORE` 不 Hard Depend Health Core。

Magic 可以产生：

- Backlash；
- magical heat / cold / force；
- physiological overload；
- bodily transformation proposal；
- harmful exposure；
- recovery / support effect（若具体 Spell 合法拥有）。

Magic Core / Theme 负责：

> Spell 内部是什么效果、是否成立。

Health Core 负责：

> 这个效果作用于当前身体以后形成什么 Condition / HP 结果。

Magic Strain 永远保持：

> `Magic Strain != Bodily Fatigue`

若 Magic Strain 进一步造成真实身体后果：

> 通过 Health Handoff 新建 / 修改 Condition。

---

# 22. Divine Handoff｜与神术的接口

`EP-DIVINE-CORE` 不 Hard Depend Health Core。

Healing / Protection / Life Invocation 可以提出：

- Stabilize；
- Repair；
- Relief；
- Support；
- Recovery；

等 Health-relevant Effect。

Health Core 决定：

> 这些 Effect 对当前 Condition 真正产生什么身体结果。

因此：

> **Divine Healing 不是 `+HP`。**

并继续保持：

```text
Healing Invocation != Resurrection Authority
```

当对象已经 Bodily Death 且灵魂进入正式死亡主权问题：

> 必须继续服从 World / Divine Sovereign Authority / future Soul Owner。

Health Core 不通过高治疗数值绕过死神。

---

# 23. Character Core Integration｜与人物能力的接口

本 Core Hard Depend：

> `EP-CHAR-CORE｜人物能力与技艺`

可以读取：

- 体魄；
- 协调；
- 感知；
- 意志；
- 医疗相关 Skill（若未来正式贡献）；
- Experience；
- Specialty；
- 合法长期身体事实。

但 Health Core 不创建：

- 第二体魄；
- Constitution；
- Vitality Attribute；
- Health Level；
- Medical XP。

当前身体 Condition 也不得直接重写长期 Attribute。

---

# 24. Disease / Poison / Survival Future Extension｜未来下游

未来如果生产以下 Expansion：

- 医学；
- 疾病；
- 毒素；
- 生存；
- 生命与变形；
- 身体改造；

且其核心玩法必须创建 / 修改 Persistent Health State：

> 默认 Hard Depend `EP-HEALTH-CORE`。

这些资产可以贡献：

- Condition Definition；
- Progression Rule；
- Treatment Interaction；
- Body Response Rule；
- Health UI Contribution；

但不得建立第二份：

- HP；
- Condition State；
- Consciousness State；
- Recovery State。

当前先行版：

> **不自动生产这些 Expansion。**

---

# 25. Health-focused Extension Contract｜下游扩展合同

下游资产可以向本 Core 贡献：

- Condition Definition；
- Condition Family specialization；
- Body Response Rule；
- Progression Rule；
- Treatment Effect Definition；
- Recovery Interaction；
- Health Knowledge / Diagnosis Pattern；
- UI Contribution。

不得重新拥有：

- Current HP；
- Max HP；
- Active Condition State；
- Consciousness State；
- Health Progression Commit；
- Program Outcome。

---

# 26. Health Resolution Contract｜统一身体判定链

推荐语义：

```text
Health-relevant Event / Treatment
↓
Validate Cause / Target / Body Applicability
↓
Read Body / Physiology Facts
↓
Read Current Conditions
↓
Condition Create / Update / Stabilize / Resolve
↓
Assign / Recalculate Health Burden
↓
Recalculate HP
↓
Update Functional Effects
↓
Update Consciousness if relevant
↓
Critical Gate if relevant
↓
Runtime Formal Outcome
↓
Atomic Commit
```

Health Core 不固定一条万能数学公式。

但数值必须由 Program 根据正式规则产生。

---

# 27. Program Authority｜模型不得决定 HP

硬规则：

> **模型不得成为 HP / Condition 的正式数值 Owner。**

模型可以：

- 理解自然语言；
- 提出 Condition candidate；
- 提出身体影响语义；
- 生成叙事。

模型不能正式决定：

- `HP -17`；
- `HP +30`；
- Condition Severity；
- Health Burden；
- Bodily Death；
- Recovery Commit；

除非 Runtime 只把其输出当 Proposal 并重新由 Program 正式裁定。

Program owns：

- 数值计算；
- RNG；
- Dice；
- Health Judge；
- Formal Outcome；
- Atomic Commit。

---

# 28. Health Necessity Gate｜不是什么都要 Dice

与 Combat Necessity Gate 一致：

只有当：

1. 结果真实不确定；
2. 差异有重要身体后果；
3. 存在合理可变因素；
4. 正式 Resolution 有意义；

才需要 Program Resolution / RNG / Dice。

例如：

> 明确已经控制住的小擦伤经过足够时间正常恢复

不需要每次 Dice。

而：

> 危重中毒能否在治疗到来前稳定

可能需要正式 Resolution。

---

# 29. Critical / Dying Gate｜HP 0 不等于自动死亡

## 29.1 HP = 0 的含义

```text
HP = 0
```

表示：

> **当前整体身体承受余量已经耗尽。**

必须进入：

> `Critical / Dying Resolution`

但不是自动死亡。

## 29.2 Critical Resolution 读取

- Current Conditions；
- Body / Physiology Facts；
- 是否存在生命维持；
- 是否仍有自发维持能力；
- 是否持续恶化；
- 是否有合法 Treatment；
- World-specific body facts。

可能结果：

- 无意识；
- 极端不稳定；
- 暂时由外部支持维持；
- Condition 继续恶化；
- Bodily Death。

## 29.3 明确灾难性身体终止

如果 World / Body Fact 已经明确当前身体结构不可能继续维持生命，不需要为了 HP 机制强行拖延。

Runtime 可以直接形成：

> Bodily Death

同时 HP = 0。

---

# 30. Bodily Death｜身体死亡边界

Health Core 可以拥有：

> **身体生命功能已经正式终止**

这一身体事实。

但 Health Core 不拥有：

- 灵魂是否已经离体；
- 灵魂当前在哪里；
- 是否已经抵达死神；
- 能否召回灵魂；
- 死亡 Sovereign Authority；
- Resurrection Permission。

推荐边界：

```text
Health Core
→ Bodily Death

World / Soul / Divine
→ Soul Separation / Passage / Sovereign Death

合法 Resurrection / Return Authority
→ Health Core
→ 重新建立可维持生命的身体状态
```

Health Core 不自己创造 Resurrection 权限。

---

# 31. Consciousness / Player Agency Boundary

意识状态属于身体事实。

可以形成：

- 清醒；
- 意识受损；
- 无意识。

但 Health Core 不替玩家决定：

- 是否勇敢；
- 是否屈服；
- 是否原谅；
- 是否改变价值；
- 是否“因为痛苦所以选择放弃”。

Pain / Fatigue / Consciousness 可以真实限制身体执行条件。

不能替代玩家价值选择。

---

# 32. Condition Knowledge｜身体事实 ≠ 玩家知道

后台 Health State 可以包含：

- 内出血；
- 隐性感染；
- 未识别毒素；
- 潜伏疾病。

玩家角色不自动知道这些。

Player Knowledge 可能只有：

- 疼痛；
- 头晕；
- 出血；
- 发热；
- 医生诊断；
- 检测结果。

因此必须分开：

```text
Health Truth
!=
Character Knowledge
!=
Narrative Disclosure
```

Health Core 不另建第二套 Knowledge DB。

---

# 33. Diagnosis Boundary｜技能不是自动诊断

未来医学 / 神术 / Magic Diagnosis 可以产生 Health Knowledge。

但：

- Skill 高不等于自动知道全部 Condition；
- Player-safe UI 不得直接把后台真实疾病名泄露给玩家；
- NPC 的准确 HP 永远不因为“玩家看见他”就公开。

---

# 34. Player-safe Projection｜玩家界面需求

默认玩家角色 Health UI 推荐展示：

### Overall

- 身体总体描述；
- 是否稳定 / 恶化；
- 意识状态。

### Known Conditions

每条可展示：

- 玩家已知名称 / 描述；
- Severity 的玩家安全表达；
- Trend；
- Functional Effect；
- 已知 Treatment / Recovery 状态。

### 默认隐藏

- 精确 HP；
- 未知 Condition；
- 隐藏病因；
- 未确认内部损伤；
- NPC 精确 Health Burden。

## 34.1 UI 不拥有状态

UI 不能：

- 点击“治疗”直接加 HP；
- 手工删除伤势；
- 改 Condition Severity；
- 改 Consciousness。

UI 只能发出 Action Intent / 查询。

---

# 35. Character Card Binding｜人物卡接口

Character Card 只有在某个角色存在**开局稳定身体事实**时，才需要明确 Health Bootstrap。

例如：

- 慢性疾病；
- 稳定残疾；
- 长期结构替换；
- 旧伤造成的持续功能影响；
- 开局正在康复；
- 世界内合法身体改造。

普通健康角色：

> 不需要为了“完整”写一堆 `Healthy` Condition。

## 35.1 不机械增加依赖

一个 Character Card 只有在开局 Definition 真正依赖 Health State 时，才需要 Hard Depend Health Core。

不能因为：

> “角色未来可能受伤”

就让所有角色卡机械 Hard Depend Health Core。

---

# 36. Definition / Instance Boundary

必须区分：

```text
Condition Definition
!=
Condition Instance
!=
Health-relevant Event
!=
Treatment Effect
!=
Current HP
!=
Character long-term Capability
```

例如：

> “骨折 / 结构断裂”怎样工作

是 Definition Grammar。

> “阿德里安现在左前臂严重结构损伤”

是 Game State Condition Instance。

游戏中 Condition 变化不回写原 Character Card / Expansion Definition。

---

# 37. Atomicity｜HP 与 Condition 必须同事务

如果一次 Health Resolution 产生：

- 新 Condition；
- Severity 变化；
- Trend 变化；
- Burden 变化；
- HP 变化；
- Consciousness 变化；
- Event；

必须由 Runtime 原子提交。

禁止：

> HP 已经下降，但伤势没有写入。

也禁止：

> 伤势已经治疗，但 HP 仍保持旧数值。

---

# 38. Background Progression｜离场身体状态继续存在

角色离开玩家视野后：

- 疾病仍可能进展；
- 康复仍可能继续；
- 毒素仍可能作用；
- 伤势仍需要时间；
- Treatment 仍可能发生。

但不要求全世界每分钟模拟。

推荐：

```text
Relevant Background Time
+
Condition Progression Rule
+
available Treatment / Environment
→ Background Health Progression Candidate
→ Runtime Validation
→ Formal Health Change
```

---

# 39. Examples｜轻量统一模型示例

## 39.1 Combat 创伤

```text
Combat Core:
左前臂
cutting
沉重
明显穿透
↓
Health Core:
深部切创：严重 / 稳定
失血：中等 / 恶化
疼痛：严重 / 稳定
Health Burden Aggregate → HP 100 → 68
```

这只是语义示例，不冻结 `68` 为所有类似事件固定数值。

## 39.2 同一 Impact，不同身体

```text
same blunt impact
↓
Human body
→ 胸廓创伤 + 较高 Burden

Hemra body
→ 不同结构损伤 + 较低 Burden

Constructed body
→ 外壳 / 内部结构异常
→ Burden 取决于是否命中关键结构
```

Max HP 仍全部为 100。

## 39.3 止血

```text
Before:
失血：中等 / 恶化

Treatment:
Stabilize / bleeding control

After:
失血：中等 / 稳定

HP:
依据新的 Aggregate Burden 重新计算
```

创伤本身不自动消失。

## 39.4 止痛

```text
Pain：严重
→ Relief
→ Pain：轻微 / 稳定

Trauma：
不变
```

HP 可以小幅改善或保持近似不变，取决于真实 Burden。

## 39.5 Divine Healing

```text
Divine Invocation Formal Outcome
→ tissue repair / stabilization effect
↓
Health Core
→ Condition severity / trend / burden changes
↓
HP recompute
```

不是：

> `DIV spell = +30 HP`

---

# 40. Standard Regression Scenarios｜20 个

### TS-HLT-01｜Combat 不直接扣 HP

- Combat Core 输出 Physical Impact；
- Health Core 创建 Condition 并计算 Burden；
- Combat 资产没有 `damage = -X HP` 事实。

### TS-HLT-02｜同一 Impact 不同物种

- 相同 Physical Impact；
- Human / Hemra / Constructed Body 得到不同 Condition / Burden；
- Max HP 都是 100。

### TS-HLT-03｜Armor 成功偏转

- Combat Core 判定没有有效身体 Impact；
- Health Core 不凭攻击意图自动创建伤势。

### TS-HLT-04｜局部重伤但 HP 较高

- 严重手部结构损伤；
- HP 仍可 > 75；
- 双手 / 精细操作却显著受限。

### TS-HLT-05｜系统性中毒但无局部创伤

- 四肢完整；
- HP 可降到严重受损；
- 验证 HP != visible wound。

### TS-HLT-06｜Pain != HP

- Severe Pain；
- HP 仍较高；
- Relief 显著改善 Function，但不删除 Cause。

### TS-HLT-07｜Stabilize != Heal

- 止血后 Trend 恶化 → 稳定；
- 创伤 Severity 不自动降低。

### TS-HLT-08｜Treatment 不直接 +HP

- 神术 / 药物只产生 Treatment Effect；
- Health Core 修改 Condition；
- HP 由 Burden 重算。

### TS-HLT-09｜Magic Strain 分离

- Magic Strain 失稳；
- 没有身体后果时 Health 不变；
- 若 Backlash 形成身体影响，再进入 Health。

### TS-HLT-10｜Channel Strain 分离

- Channel Strain 过载；
- 不自动成为 Fatigue；
- 只有真实生理后果才创建 Health Condition。

### TS-HLT-11｜Disease Progression

- 疾病随有意义时间恶化；
- 不要求每 Turn 模拟。

### TS-HLT-12｜No Fixed DoT

- Bleeding 不自动每 Turn -5 HP；
- meaningful time / exertion 才触发 Health Progression。

### TS-HLT-13｜0 HP 不自动死亡

- HP = 0；
- 进入 Critical Gate；
- 可能被生命支持维持。

### TS-HLT-14｜明确 Bodily Death

- 身体结构已经不可维持生命；
- Runtime 可正式裁定 Bodily Death；
- 不强迫等待“下一回合”。

### TS-HLT-15｜Soul Boundary

- Bodily Death 已成立；
- Health Core 不决定灵魂去向 / Resurrection Permission。

### TS-HLT-16｜Consciousness 独立

- 特殊毒素可让 HP 仍高但无意识；
- HP 低也不自动无意识。

### TS-HLT-17｜NPC Hidden Condition

- NPC 存在隐性中毒；
- 玩家只看到可观察症状；
- UI 不泄露后台 Condition Name / HP。

### TS-HLT-18｜Character Card Dependency Minimal

- 健康普通 NPC 不因“可能受伤” Hard Depend Health；
- 慢性病角色可以合法 Hard Depend Health。

### TS-HLT-19｜No Condition Explosion

- 轻微擦伤不自动拆成 3–4 个微小状态；
- 只有独立玩法意义的次级状态进入 Condition List。

### TS-HLT-20｜Atomic Health Commit

- Condition / Burden / HP / Consciousness 同事务；
- 不出现半提交。

---

# 41. Creator / asset-spec vNext Requirements

未来需要声明式支持：

- Health-bearing Body；
- Condition Definition；
- Condition Family；
- Severity / Trend；
- Body Scope；
- Functional Effect；
- Health Burden；
- Body Response Rule；
- Progression Rule；
- Treatment Effect；
- Consciousness；
- Health Handoff；
- Player-safe Projection；
- Knowledge / Diagnosis Projection；
- Health-focused Extension Contribution。

不得要求 Creator 编写：

- JS；
- eval；
- 任意公式代码；
- 任意 Runtime Hook。

---

# 42. Runtime Requirements

Runtime 必须：

1. 保存权威 Active Conditions；
2. 根据合法 Health Burden 维护 / 校验 HP；
3. 强制 `0–100`；
4. 防止 direct external HP write；
5. 读取正式 Body / Species facts；
6. 执行 Health Resolution；
7. 只在必要时执行 RNG / Dice；
8. 管理 meaningful time progression；
9. 管理 Critical Gate；
10. 管理 Bodily Death formal result；
11. 原子提交 Condition / HP / Consciousness；
12. 只向浏览器发送 Player-safe Health Projection。

---

# 43. Dependency Matrix

| Provider | Consumer | Relation |
|---|---|---|
| EP-CHAR-CORE | EP-HEALTH-CORE | Hard Dependency |
| World / Species / Character Body Facts | EP-HEALTH-CORE | Provider → Consumer |
| EP-COMBAT-CORE | EP-HEALTH-CORE | Physical Impact Handoff / Optional Integration |
| EP-MAGIC-CORE / Theme | EP-HEALTH-CORE | Health Effect Handoff / Optional Integration |
| EP-DIVINE-CORE | EP-HEALTH-CORE | Treatment / Bodily Effect Handoff / Optional Integration |
| EP-HEALTH-CORE | Future Medical / Disease / Toxic / Life / Body-focused Expansion | Hard Dependency when Persistent Health State is core gameplay |
| Runtime | EP-HEALTH-CORE | Execution Owner |

## 43.1 No Hard Cycle

当前不存在：

```text
Health hard→ Combat
Combat hard→ Health
```

或：

```text
Health hard→ Magic
Magic hard→ Health
```

Health 与 Combat / Magic / Divine 保持 Handoff / Optional Integration。

---

# 44. Out of Scope for Pioneer Asset Family｜先行版止损

本 Core 完成后，不因为 Health 需求自动生产：

- 医学 Expansion；
- 疾病 Expansion；
- 毒素 Expansion；
- 生存 Expansion；
- 生命与变形 Theme；
- 炼金药理系统；
- 精神健康系统；
- 器官模拟；
- 生育系统；
- 大型 Condition Library。

这些只登记为 Future Extension 可能性。

当前先行资产族的目标是：

> 验证一个稳定、通用、可组合的 Health Owner。

---

# 45. Self Audit｜创作自检

| Gate | 结果 |
|---|---|
| Discussion / Authorization | PASS |
| Scope Lock | PASS |
| HP + Condition Coexistence | PASS |
| Max HP = 100 normalization | PASS |
| Species / Body Difference | PASS |
| Condition-first HP | PASS |
| No direct Combat HP | PASS |
| No direct Magic / Divine HP | PASS |
| Program Authority | PASS |
| Health / Soul Boundary | PASS |
| Definition / Instance | PASS |
| Dependency Minimalization | PASS |
| Player-safe Projection | PASS |
| Creator Authorability | WARN — G9 vNext binding pending；非当前语义 blocker |
| Obsidian Deliverable | PASS |

---

# 46. Current State

```text
EP-HEALTH-CORE｜身体状态核心
├─ Discussion Gate             COMPLETE
├─ Explicit Authorization      COMPLETE
├─ Semantic Candidate v0.1     AUDITED CURRENT
├─ Ownership / Dependency      PASS
├─ HP / Condition Contract     PASS
├─ Program Authority           PASS
├─ Health / Soul Boundary      PASS
├─ Creator / asset-spec vNext  PENDING G9
└─ Independent Audit           PASS
```

---

# 47. Final Freeze｜最终冻结语句

> **Health Core 拥有“身体现在实际上变成了什么状态”。**
>
> **Condition 是身体真实语义；HP 是由 Condition Health Burden 统一派生的隐藏 0–100 标准化身体承受余量。**
>
> **所有对象默认 Max HP = 100；不同身体的差异通过 Body Facts、Condition、Burden、Function 与 Progression 表达，而不是通过种族固定 Max HP。**
>
> **Combat / Magic / Divine 不直接扣血或回血；它们只提供合法身体影响 / Treatment Effect，Health Core + Runtime 统一形成 Condition 与 HP 结果。**
>
> **0 HP 是 Critical Gate，不自动等于死亡；Bodily Death 属于身体事实，灵魂、死后去向和复活主权继续由 World / Divine / future Soul Owner 处理。**
>
> **模型不能决定 HP 数值、正式 Condition Severity、Bodily Death 或 Commit。**
>
> **本 Core 保持轻量：不做医学模拟器，不做每回合 DoT，不做器官逐分钟模拟。**


---

# 48. Independent Audit Closure｜2026-08-16

本轮整体审核确认：

- Persistent Health State 的唯一 Owner 清晰；
- `Max HP = 100` 是相对自身最大承受余量的标准化尺度，不是物种绝对体质比较；
- Condition 是身体事实，HP 是由 Active Condition Health Burden 统一解释的隐藏量化层；
- Combat / Magic / Divine 不拥有 direct HP Damage / Healing；
- Health Core 与 Combat / Magic / Divine 没有 Hard Dependency Cycle；
- Bodily Death 与 Soul / Resurrection Sovereign Authority 边界清晰；
- Runtime 继续拥有数值计算、RNG / Dice、Formal Outcome 与 Atomic Commit；
- Character Card 不因“未来可能受伤”机械 Hard Depend Health Core；
- 先行版保持轻量，没有扩张为医学、疾病、毒素、生存或器官模拟系统。

**独立总审核：PASS。**


---

# 49. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 是 Persistent Bodily / Physiological State 唯一机制 Owner。

G8 UI 意图：

- 不拥有独立一级 Extension Surface；
- 主要贡献 Player Status；
- 详细 Condition / Recovery 进入 Player Character Detail / Person Detail；
- Treatment 可使用 Narrative Contextual Surface；
- Critical / dangerous condition 可使用 Global Notice / Alert；
- hidden HP 默认不因 UI 存在而公开。

文中的埃瑟维亚物种仅为 reference examples，不构成 Core dependency。

**通用库独立审核：PASS。**
