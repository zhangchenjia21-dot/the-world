---
title: 生存需求与环境｜Expansion Pack
aliases:
  - EP-SURVIVAL
  - 生存需求与环境
  - 生存维持
  - Survival Needs and Environment
  - 乱世求生
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
  - "[[乱世求生_生存与康复_Expansion_Pack_v0.1]]"
hard_dependencies:
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
optional_integrations:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
dependency_role: survival-downstream
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - ExpansionPack
  - Survival
  - Nutrition
  - Hydration
  - Sleep
  - Environment
  - Exposure
  - Automation
  - Resource
  - 通用资产
  - 生存
skill: tavern-asset v0.5.2
---

# 生存需求与环境｜Expansion Pack v0.2

> [!abstract] 一句话定位
> **`EP-SURVIVAL｜生存需求与环境` 是一个可跨世界复用的可选下游 Expansion：统一管理角色维持正常生存所需的 Nutrition、Hydration、Sleep 等需求是否得到满足，正常生活如何自动处理，资源何时真实消费，以及环境暴露与持续活动何时形成需要交给 `EP-HEALTH-CORE` 的身体风险。**
>
> 它不再拥有伤势、疾病、疼痛、身体疲劳、治疗、康复、意识、HP 或死亡。
>
> 核心体验原则：
>
> **正常生活自动处理，异常生存才进入前台；需求不足先给出可理解反馈，真正身体后果统一交给 Health Core。**

> [!important] 重构说明
> 本文件是对旧 `《乱世求生：生存与康复》v0.1` 的 Major Rewrite。
>
> 旧版关于 Injury、Blood Loss、Pain、Physical Fatigue、Disease、Poison、Treatment、Recovery、Incapacitation、Life-threatening Condition 等 Ownership，现全部让位于：
>
> `[[身体状态核心_Expansion_Pack_v0.1]]`
>
> 本重构保留旧版真正独立且可复用的 Survival Gameplay：Needs、Routine Automation、Resource Consumption、Survival Load、Environmental Exposure、Intensity 与 Player Override。

---

# 0. Discussion Contract｜已确认方向

本轮已经确认：

1. Survival 仍有独立存在价值；
2. 它不再是 `Reusable Survival Core`，而是可选的通用下游 Expansion；
3. `Need != Health Condition`；
4. Survival 负责“维持正常生存的条件是否得到满足”；
5. Health Core 负责“身体实际因此变成什么”；
6. Survival Hard Depend `EP-HEALTH-CORE`；
7. Nutrition / Hydration / Sleep 可以有内部连续量化，但玩家默认只看到有决策意义的语义反馈；
8. Routine Survival Automation 在资源、时间与环境允许且玩家没有覆盖时自动工作；
9. 自动化必须真实消费 Resource；
10. Player Override 永远可以选择禁食、拒绝饮水、熬夜、强行赶路等；
11. 玩家持续不睡觉时，Survival 必须主动给出“已经明显疲惫、需要休息”等反馈；
12. 缺觉达到有意义阈值后必须 Handoff Health Core，由 Health 形成 Physical Fatigue / Weakness、Functional Effect、必要时 Consciousness 等正式身体后果；
13. Environmental Exposure Process 归 Survival，持续身体后果归 Health；
14. Survival Load 归 Survival，Physical Fatigue Condition 归 Health；
15. 保留 Light / Standard / Harsh，但只改变追踪粒度、自动化和风险进入前台的时机，不改写 World / Health Truth。

---

# 1. Scope Lock｜职责边界

## 1.1 本 Expansion 唯一回答的问题

> **“一个角色维持正常生存所需要的日常条件目前是否得到满足；如果没有，系统是否需要提醒玩家、消费或寻找真实资源、停止日常自动化，或把已经具有身体意义的风险交给 Health Core？”**

## 1.2 本 Expansion 必须负责

- Survival Needs；
- Nutrition Need；
- Hydration Need；
- Sleep Need / Sleep Deficit；
- Routine Survival Automation；
- Routine Resource Consumption；
- Player Override；
- Survival Intensity；
- Survival Load；
- Environmental Exposure Process；
- Shelter / Protection Availability 的消费性读取；
- Survival Feedback / Warning；
- Need → Health Handoff；
- Exposure → Health Handoff；
- Load → Health Handoff；
- World Time Integration；
- Resource / Inventory Interface；
- Player-safe Survival Projection；
- Save / Restore 语义；
- Creator / Runtime / asset-spec vNext Requirement。

## 1.3 本 Expansion 明确不负责

- HP / Health Reserve；
- Injury；
- Blood Loss；
- Pain；
- Physical Fatigue / Weakness Condition；
- Disease；
- Infection Condition；
- Poison / Toxic Condition；
- Dehydration 作为身体 Condition；
- Hypothermia / Heat Injury 等身体 Condition；
- Consciousness；
- Treatment；
- Recovery；
- Bodily Death；
- Character 长期 Attribute / Skill；
- Combat Outcome；
- Formation Fatigue；
- 食物 / 水 / 药品 / 衣物 / 住所的库存事实；
- 气候 / 温度 / 空气成分等 World Environment Truth；
- 社会粮食供给 / 市场 / 财政；
- RNG / Dice；
- Formal Outcome；
- Atomic Commit；
- Creator 正式 Schema；
- Runtime API。

---

# 2. Ownership Map｜唯一事实源

| 概念 | 唯一 Owner | Survival 如何使用 |
|---|---|---|
| Character 长期 Capability | EP-CHAR-CORE | Optional Query |
| Persistent Bodily State / HP | EP-HEALTH-CORE | Hard Dependency / Consumer |
| Nutrition / Hydration / Sleep Need | EP-SURVIVAL | 正式职责 |
| Routine Survival Automation | EP-SURVIVAL | 正式职责 |
| Survival Load | EP-SURVIVAL | 正式职责 |
| Environmental Exposure Process | EP-SURVIVAL | 正式职责 |
| Food / Water / Clothing / Shelter Resource | Inventory / Economy / Item Owner | 读取 / 正式消费 |
| Environment / Climate / Atmosphere | World / Environment Owner | 读取 |
| Combat Physical Impact | EP-COMBAT-CORE | 不拥有；如形成身体后果直接去 Health |
| Formation Fatigue | War Owner | 不复制 |
| Physical Fatigue / Weakness | EP-HEALTH-CORE | Survival 可产生 Cause / Handoff |
| Dehydration / Hypothermia 等身体结果 | EP-HEALTH-CORE | Survival 可产生 Cause / Handoff |
| Treatment / Recovery | EP-HEALTH-CORE | 不拥有 |
| RNG / Formal Outcome / Commit | Runtime | 执行 |

---

# 3. Core Separation｜Need、Exposure、Load 与 Health Condition

这是本 Expansion 最重要的分权。

## 3.1 Need != Condition

例如：

```text
Survival:
Hydration Need = 严重不足

Health:
Dehydration = 中等 / 恶化
Physical Weakness = 轻微
```

两者不重复。

Survival 保存的是：

> **正常维持条件与当前供给之间的缺口。**

Health 保存的是：

> **这个身体已经实际发生的持续状态。**

## 3.2 Exposure Process != Bodily Consequence

```text
World:
环境 = 严寒

Survival:
Cold Exposure = 持续 / 防护不足

Health:
体温异常 / 身体衰弱 / Consciousness change
```

## 3.3 Survival Load != Physical Fatigue

```text
Survival:
长距离负重行军 / 连续劳动 / 长时间保持清醒

Health:
Physical Fatigue / Weakness Condition
```

相同 Load 对不同 Character 可以形成不同 Health Outcome。

---

# 4. Survival Need Grammar｜生存需求通用骨架

每个 Survival Need 至少需要语义上回答：

- **Need Type**：Nutrition / Hydration / Sleep；
- **Current Satisfaction**：当前是否被正常满足；
- **Deficit Direction**：是否正在产生缺口；
- **Duration / Accumulation**：缺口持续了多久 / 累积到什么程度；
- **Available Source**：是否存在可访问资源 / 时间；
- **Routine Automation Eligibility**：是否允许自动处理；
- **Player Override**：玩家是否主动拒绝；
- **Feedback Level**：是否需要提醒玩家；
- **Health Handoff Threshold**：是否已经达到具有身体意义的程度。

这些是语义要求，不冻结 vNext 字段。

---

# 5. Need State｜玩家侧语义等级

不要求玩家长期查看精确：

```text
Hunger = 47
Hydration = 63
Sleep = 28
```

推荐玩家侧使用少量语义层：

```text
正常
轻度不足
明显不足
严重不足
极端缺乏
```

具体最终 enum：

> 等待 G9。

Runtime 内部可以为了 World Time 与自动化稳定运行使用连续量化，例如：

- Nutrition Deficit；
- Hydration Deficit；
- Sleep Deficit / Sleep Debt；

但：

> **内部量化不是新的玩家 HUD 血条，也不是 Health HP。**

---

# 6. Nutrition Need｜营养 / 进食需求

Nutrition 回答：

- 最近是否获得了足够的正常食物输入；
- 当前是否存在短期进食不足；
- 是否长期无法满足正常营养需求；
- Routine Meal 是否可以自动完成；
- 是否已有真实食物 Resource 可消费。

本 Expansion 不模拟：

- 每种维生素；
- 蛋白质克数；
- 卡路里百科；
- World-specific 食谱。

## 6.1 Nutrition → Health

当 Nutrition Deficit 达到有意义程度：

```text
EP-SURVIVAL
→ Nutrition Deficit Handoff
→ EP-HEALTH-CORE
→ physiological disturbance / weakness / other valid Condition
```

具体身体结果由：

- Body / Physiology；
- Duration；
- 当前 Health；
- World；
- 其他 Conditions；

共同决定。

Survival 不自己写：

> `HP -10`。

---

# 7. Hydration Need｜饮水需求

Hydration 回答：

- 当前饮水需求是否正常满足；
- 是否存在可访问、安全的饮水；
- Routine Water Intake 是否能够自动完成；
- 当前缺水是否已经需要玩家关注。

## 7.1 Water Safety

水源是否：

- 可饮用；
- 污染；
- 有毒；
- 魔法异常；

由 World / Item / Resource Owner 提供。

Survival 只消费：

> 是否可作为合法饮水来源。

## 7.2 Hydration → Health

长期缺水：

```text
Hydration Deficit
↓
Health Handoff
↓
Dehydration / Weakness / Consciousness risk
```

具体 Condition 与隐藏 HP：

> 只由 Health Core + Runtime 决定。

---

# 8. Sleep Need｜睡眠与休息需求

Sleep Need 回答：

- 最近是否获得足够睡眠；
- 睡眠是否被持续打断；
- 是否存在合理睡眠机会；
- 当前是否在主动保持清醒；
- Sleep Deficit 是否已达到需要反馈 / Health Handoff 的程度。

## 8.1 Routine Sleep

如果：

- 有合理休息地点；
- 有足够时间；
- 没有高优先级危险；
- 玩家没有主动拒绝；

Routine Automation 可以：

> 自动安排普通睡眠 / 休息。

## 8.2 Player Keeps Staying Awake｜持续熬夜

玩家可以明确选择：

> “今晚不睡。”
>
> “继续守夜。”
>
> “继续研究。”
>
> “继续赶路。”

系统不得因为健康理由在输入层禁止。

正确链：

```text
Player Override: Stay Awake
↓
Routine Sleep Automation disabled
↓
Sleep Deficit accumulates
↓
Survival Feedback
↓
必要时 Health Handoff
↓
EP-HEALTH-CORE
↓
Physical Fatigue / Weakness
+ Functional Effect
+ hidden HP change if justified
+ Consciousness consequence if justified
```

## 8.3 Survival Feedback Requirement

持续熬夜时，Survival 必须在玩家已经能够自然感知身体需求时给出明确反馈，例如：

> “你已经明显疲惫，注意力开始难以维持；如果继续保持清醒，需要尽快安排休息。”

或符合角色 / 世界语境的等价反馈。

反馈不是：

> 强制睡眠。

而是：

> **把角色理应知道的生存需求反馈给玩家。**

## 8.4 Debuff Ownership

玩家口语上可以称为：

> “熬夜 Debuff”。

正式 Ownership 必须是：

```text
Survival:
Sleep Deficit / Cause

Health:
Physical Fatigue / Weakness Condition
Functional Effect
Consciousness if relevant
Health Burden / HP if relevant
```

Survival 不拥有第二套：

- Fatigue；
- Accuracy penalty；
- Concentration penalty；
- HP damage。

## 8.5 Extreme Sleep Deprivation

极端缺觉可以触发 Health Resolution。

可能形成：

- Severe Physical Fatigue；
- Weakness；
- Consciousness impairment；
- 其他 World / Body-supported Condition。

不能固定：

> “48 小时必定昏迷”。

具体结果由正式 Program Resolution 处理。

---

# 9. Routine Survival Automation｜日常生存自动化

## 9.1 目标

自动处理：

> **没有真实决策价值的正常生存行为。**

包括：

- 正常进食；
- 正常饮水；
- 普通睡眠 / 休息。

## 9.2 Automation Eligibility

典型前提：

- Resource 可访问；
- Resource 合法可用；
- 时间允许；
- 当前环境允许；
- 当前没有更高优先级危险；
- 玩家没有明确 Override；
- 当前行为没有与 Routine Action 冲突。

## 9.3 Resource Must Be Real

Automation 不得：

> 默认角色吃饭，但库存永远不减少。

正式链：

```text
Resource / Inventory Owner
↓
Routine Consume Intent
↓
Program Validation
↓
Atomic Resource Commit
↓
Survival Need maintained
```

## 9.4 Automation Failure

如果：

- 没有食物；
- 没有饮水；
- 没有合理休息时间；
- 环境不允许睡眠；
- 资源被锁定；
- 玩家拒绝；

Automation：

> 自然失败 / 被覆盖。

然后：

> Need 开始形成 Deficit。

## 9.5 Player Override

玩家可以：

- 禁食；
- 拒绝饮水；
- 熬夜；
- 强行赶路；
- 拒绝 Routine Automation。

系统不替玩家决定。

但必须：

> 忠实处理后果并给出反馈。

---

# 10. Decision-value Gate｜什么时候停止自动化

Routine Automation 只处理低决策价值行为。

当以下因素出现时，应停止或降低自动化：

- 围城只剩有限食物；
- 饮水严重短缺；
- 多人争夺有限补给；
- 食物可能有毒；
- 玩家正在进行宗教 / 仪式性禁食；
- 睡眠地点存在明显危险；
- 是否休息会影响追击 / 逃亡；
- 资源分配具有政治 / 关系 / 战术意义。

原则：

> **一旦“吃不吃、喝不喝、睡不睡、资源给谁”本身成为真实选择，就不再把它当后台杂务。**

---

# 11. Survival Load｜持续活动负荷

Survival Load 表示：

> **角色近期承担了多少持续性的生存 / 体力负荷。**

典型来源：

- 长距离赶路；
- 负重行军；
- 重体力劳动；
- 长时间站岗；
- 持续保持清醒；
- 恶劣环境中行动；
- 连续缺少休息机会。

Survival Load 不等于：

> Physical Fatigue Condition。

## 11.1 Load Handoff

```text
Survival Load
+ Character Capability if available
+ Current Health
+ Environment
↓
EP-HEALTH-CORE
↓
Physical Fatigue / Weakness / other Condition
```

同样的：

> “负重行走 30 公里”

对不同角色可以产生完全不同身体结果。

---

# 12. Environmental Exposure Process｜环境暴露过程

Survival 可以持有：

> **角色是否正在持续暴露于某种具有生存风险的环境。**

例如：

- Cold Exposure；
- Heat Exposure；
- Water Immersion；
- Smoke / Hazardous Atmosphere；
- High-altitude / Low-oxygen Context；
- Radiation-like Exposure；
- Magic Environment；
- World-specific Exposure。

具体 Environment Truth：

> 来自 World / Environment Owner。

## 12.1 Exposure Inputs

可以读取：

- Environment intensity；
- Duration；
- Shelter；
- Clothing / Protection；
- Activity；
- World-specific protection；
- 当前可撤离条件。

## 12.2 Exposure → Health

```text
World Environment
↓
Survival Exposure Process
↓
meaningful bodily risk
↓
Health Handoff
↓
EP-HEALTH-CORE
↓
Persistent Bodily Condition
```

例如严寒：

```text
World: severe cold
+
Item: inadequate protection
+
Survival: prolonged cold exposure
↓
Health:
temperature disturbance / weakness / other valid condition
```

Survival 不直接拥有：

- Hypothermia；
- Frostbite；
- HP loss。

---

# 13. Shelter / Protection｜住所与防护只是输入

Survival 不拥有：

- 房屋；
- 帐篷；
- 衣服；
- 护具；
- 魔法防寒结界。

它只读取：

> 是否存在对当前 Need / Exposure 有效的保护。

具体 Item / Place：

> 由正式 Owner 保存。

---

# 14. Survival Intensity Profile｜体验强度

保留三档通用 Profile。

## 14.1 Light｜轻度 / Narrative

重点只把以下情况推到前台：

- 明显断粮 / 断水；
- 长期缺觉；
- 极端环境；
- 明显生存危机。

正常城市 / 住所生活：

> 高度自动化。

## 14.2 Standard｜标准【默认】

持续考虑：

- Nutrition；
- Hydration；
- Sleep；
- Travel / Load；
- Environment Exposure。

但：

> 正常条件下仍优先自动化。

## 14.3 Harsh｜严酷 / Survival-focused

更早把以下问题推到前台：

- 资源不足；
- 连续赶路；
- 防护；
- 暴露；
- 缺觉；
- Need Deficit；
- Routine Automation Failure。

## 14.4 Intensity 不改写世界真相

Intensity 只能调整：

- 追踪粒度；
- 自动化阈值；
- 反馈频率；
- 风险何时进入前台；
- 哪些低价值过程可以粗粒度处理。

不能：

> 把同一个 World / Body 的物理规律改掉。

Health Core 接收到相同真实 Cause 后：

> 不因为 UI Profile 是 Harsh 就凭空造成额外伤害。

---

# 15. Feedback Policy｜生存反馈策略

Survival 必须把角色**自然应该感知到**的 Need / Exposure 状态通过 Player-safe 方式反馈。

例如：

- 明显饥饿；
- 口渴；
- 睡意；
- 长时间保持清醒后的疲惫感；
- 寒冷；
- 炎热；
- 呼吸环境不适；
- Routine Automation 失败。

## 15.1 Feedback != Hidden Truth Leak

可以告诉玩家：

> “你已经非常口渴。”

不能因此自动告诉：

> “当前 Hydration Deficit = 72.8%”。

可以告诉玩家：

> “你已经明显疲惫，注意力很难维持。”

不能因此自动泄露：

> “Health HP = 61”。

## 15.2 Escalation

反馈可以随 Need / Exposure 升级：

```text
轻度提醒
→ 明显警告
→ 强烈生存警报
```

但永远：

> **不是 UI 输入禁令。**

玩家仍可继续尝试。

---

# 16. Health Core Handoff Contract｜与身体状态核心的正式接口

本 Expansion Hard Depend：

> `EP-HEALTH-CORE｜身体状态核心`

Survival 可以向 Health 提供：

- Nutrition Deficit Cause；
- Hydration Deficit Cause；
- Sleep Deficit Cause；
- Survival Load；
- Environmental Exposure；
- Need / Exposure Duration；
- Available Protection Context；
- relevant World / Resource provenance。

Health Core 负责：

- Condition Applicability；
- Severity；
- Trend；
- Functional Effect；
- Health Burden；
- hidden HP；
- Physical Fatigue / Weakness；
- Consciousness；
- Critical / Dying；
- Recovery。

## 16.1 不允许 direct HP

禁止：

```text
Sleep Deficit
→ HP -10

No Water
→ HP -20

Cold Exposure
→ HP -5 / hour
```

这些必须：

```text
Survival Cause
→ Health Resolution
→ Condition
→ Health Burden
→ HP
```

---

# 17. Health → Survival Readback｜身体状态反向影响生存过程

Survival 可以读取 Health 提供的正式身体状态，以判断：

- 当前是否仍能承担某种 Load；
- 是否需要更高休息需求；
- Routine Automation 是否需要特殊照护；
- 当前 Environment Exposure 是否更危险。

但：

> Health State 不由 Survival 改写。

例如：

> 严重 Physical Fatigue 可能让继续赶路形成更高风险。

Survival 可以把：

> “继续赶路”

作为新的 Load Handoff。

最终身体恶化仍由 Health Resolution 决定。

---

# 18. Capability Integration｜与人物能力的可选关系

`EP-SURVIVAL` 不 Hard Depend `EP-CHAR-CORE`。

若 Character Capability 可用，可以读取：

- 体魄；
- 相关 Experience；
- Specialty；
- World-specific survival skills；

作为：

- Load tolerance；
- Resource finding attempt；
- Shelter preparation；
- Exposure mitigation；

等 Resolution 输入。

Capability 不允许：

> 直接删除 Need。

“体魄很强”不代表：

> 永远不用喝水 / 睡觉。

---

# 19. Resource / Inventory Interface｜资源接口

Survival 不拥有：

- 食物库存；
- 饮水库存；
- 营地；
- 衣物；
- 帐篷；
- Fuel。

它通过正式 Owner：

> 查询与消费。

## 19.1 Missing Resource Owner

若当前游戏没有高精度 Inventory / Economy：

Survival 可以使用：

- 已确认的粗粒度 Resource Context；
- World / Scene 提供的可用性事实；

进行降级。

不能：

> 假装无限免费补给。

---

# 20. Open Attempt｜生存不禁止玩家冒险

允许玩家尝试：

- 长时间不睡；
- 不喝水；
- 禁食；
- 强行行军；
- 恶劣环境继续前进；
- 在危险地点睡觉；
- 资源不足时冒险寻找补给。

系统不得：

> 因“这是坏选择”而禁止输入。

确定性不可能行为：

> 可以直接失败，无需为了戏剧制造 Dice。

---

# 21. Time Integration｜时间是正式输入

Nutrition、Hydration、Sleep、Load、Exposure 都依赖：

> Authority World Time。

不允许：

> 模型凭“剧情感觉”随机宣布角色三天没睡。

Runtime 必须能知道：

- 有意义时间过去；
- Routine Automation 是否执行；
- 玩家是否 Override；
- 资源是否成功消费；
- Exposure 是否持续。

---

# 22. Program Authority

资产定义：

- Need Grammar；
- Automation Policy；
- Handoff；
- Feedback；
- Intensity；
- Resolution semantics。

Runtime 拥有：

- World Time 执行；
- Need 内部量化；
- 资源事务；
- Condition Handoff 时机；
- RNG / Dice；
- Formal Outcome；
- Atomic Commit。

模型可以：

- 理解自然语言；
- 生成符合已知状态的反馈；
- 提出语义 Candidate。

模型不能：

- 凭感觉把 Sleep Deficit 设成 87；
- 自己扣 HP；
- 自己决定 Dehydration Severity；
- 自己 Commit Resource。

---

# 23. Player-safe UI Contribution

推荐 UI 只显示有决策意义的 Survival 信息。

## 23.1 Survival Summary

可展示：

- Nutrition：正常 / 不足；
- Hydration：正常 / 不足；
- Sleep：正常 / 缺觉；
- 当前重要 Exposure；
- Routine Automation 是否正常。

## 23.2 Normal State

正常时：

> 折叠 / 弱化。

## 23.3 Warning State

异常时：

> 主动进入前台。

例如：

- “没有可用饮水，日常饮水自动处理已停止。”
- “你已经明显疲惫，需要尽快安排休息。”
- “当前防寒条件不足，继续停留正在增加暴露风险。”

## 23.4 UI 不执行状态

UI 不能：

- 手工把 Need 拉满；
- 删除 Exposure；
- 直接消耗资源；
- 直接让 Health 恢复。

UI 只发：

> Intent / Override / Setting。

---

# 24. Initialization｜初始化

## 24.1 普通开局

推荐：

- Nutrition 正常；
- Hydration 正常；
- Sleep 正常；
- 无特殊 Exposure；
- Routine Automation 可用。

不是强制。

## 24.2 特殊开局

World / Scenario 可以 Bootstrap：

- 已断粮；
- 已缺水；
- 连续数日未正常睡眠；
- 荒野暴露；
- 长途逃亡中的高 Load。

如果这些已经造成实际身体 Condition：

> 同时由 Health Bootstrap 提供正式 Health State。

---

# 25. Definition / Instance Boundary

必须区分：

```text
Survival Need Definition
≠
Current Need State
≠
Resource Definition
≠
Resource Instance
≠
Exposure Context
≠
Health Condition
```

游戏中的 Need / Exposure：

> 保存于 Game State。

不回写 Expansion Definition。

---

# 26. Save / Restore

需要恢复：

- Current Need State；
- internal deficit accumulation；
- Player Override；
- Routine Automation policy state；
- current Exposure；
- relevant Survival Load；
- 上次已提交的 Resource Consumption；
- 已产生 Health Handoff 的边界。

禁止读档后：

> 同一顿饭重复扣除；
> 同一个 Exposure 重复 Commit；
> 已处理的 Need Handoff 重新无条件叠加。

---

# 27. Standard Regression Scenarios｜20 个

## T-SUR-01｜正常城市生活

有食物、水、住所、休息时间。

期望：

- Routine Automation 正常；
- 真实消费 Resource；
- 玩家不需要反复点击吃喝睡；
- UI 保持低干扰。

## T-SUR-02｜自动饮水失败

没有可用水。

期望：

- Routine Water 自动化失败；
- 不凭空补水；
- Hydration Deficit 累积；
- 玩家收到原因反馈。

## T-SUR-03｜主动熬夜

玩家明确继续工作不睡。

期望：

- 输入允许；
- Routine Sleep 被 Override；
- Sleep Deficit 累积；
- 玩家收到逐步增强的疲劳 / 休息提示；
- 达到身体意义后 Handoff Health；
- Health 可以形成 Physical Fatigue / Functional Effect。

## T-SUR-04｜熬夜不直接扣血

Survival 发现严重 Sleep Deficit。

期望：

- Survival 不直接 `HP -X`；
- Health Resolution 决定 Condition / HP。

## T-SUR-05｜正常睡眠

有安全地点和时间，玩家未 Override。

期望：

- Routine Sleep 自动执行；
- Sleep Need 维持；
- 不要求玩家点击“睡觉”。

## T-SUR-06｜睡眠成为真实选择

追兵在后，停下睡觉会增加被追上风险。

期望：

- Routine Automation 停止；
- 睡不睡进入前台决策；
- 系统不替玩家选择。

## T-SUR-07｜围城有限粮食

资源不足。

期望：

- 不继续无脑 Routine Meal；
- 分配粮食成为真实选择。

## T-SUR-08｜缺食 → Health

Nutrition 长期不足。

期望：

- Survival 保存 Need Deficit；
- 到阈值产生 Health Handoff；
- Health 形成真实身体后果。

## T-SUR-09｜严寒暴露

World 提供严寒，防护不足。

期望：

- Survival 创建 / 更新 Cold Exposure Process；
- Health 负责身体 Condition；
- Survival 不拥有 Hypothermia。

## T-SUR-10｜有防护

同一环境下有有效防寒装备。

期望：

- Exposure 累积显著降低 / 不成立；
- Survival 读取 Item / World，不复制装备。

## T-SUR-11｜长途行军

角色持续负重赶路。

期望：

- Survival Load 上升；
- Health 决定 Physical Fatigue；
- 不建立第二 Fatigue State。

## T-SUR-12｜不同角色同一 Load

精锐士兵与久病老人走相同距离。

期望：

- Survival Load 可相同；
- Health Outcome 可以不同。

## T-SUR-13｜Health 反向影响继续赶路

角色已严重身体疲劳。

期望：

- Survival 读取 Health；
- 玩家仍可尝试继续赶路；
- 新 Load 可能导致进一步 Health Resolution。

## T-SUR-14｜Light 模式

正常旅行。

期望：

- 大量后台粗粒度处理；
- 重大缺水 / 极端暴露仍成立。

## T-SUR-15｜Harsh 模式

资源和暴露更早进入前台。

期望：

- 不修改相同 World / Body 的物理真相；
- 不凭难度额外扣 HP。

## T-SUR-16｜玩家禁食

玩家主动禁食。

期望：

- Meal Automation 不覆盖；
- Nutrition Deficit 正常推进。

## T-SUR-17｜危险水源

只有一个 World 标记为污染风险的水源。

期望：

- Survival 不擅自判定无毒；
- 玩家可以尝试饮用；
- 后续毒性 / Disease 由对应 Owner + Health 处理。

## T-SUR-18｜资源事务

自动吃饭。

期望：

- Resource 只消费一次；
- Save / Restore 不重复扣除。

## T-SUR-19｜无 Inventory 高精度模式

World 只提供“补给充足”。

期望：

- 可以粗粒度降级；
- 不编造具体 17 份食物；
- 不假装无限资源。

## T-SUR-20｜Survival Feedback 不泄露 Health Truth

玩家缺觉明显。

期望：

- 可以收到“疲惫 / 难以集中”的自然反馈；
- 不自动显示 hidden HP、精确 Condition Burden 或未知医学事实。

---

# 28. Host Requirements

| ID | Host 能力 | 必需性 | 缺失行为 |
|---|---|---|---|
| HR-SUR-01 | World Time | 必需 | Need / Exposure 无法稳定运行 |
| HR-SUR-02 | Persistent Need State | 必需 | 无法保存缺口 |
| HR-SUR-03 | Routine Automation | 推荐 | 可降级为手工 / 粗粒度 |
| HR-SUR-04 | Resource Consume Interface | 推荐 / 高精度必需 | 无法真实扣资源 |
| HR-SUR-05 | Environment Read | Exposure 必需 | Exposure 降级 |
| HR-SUR-06 | Health Handoff | 必需 | 无法形成身体后果 |
| HR-SUR-07 | Player Override | 必需 | Automation 会越权 |
| HR-SUR-08 | Survival Feedback | 必需 | 玩家无法感知需求异常 |
| HR-SUR-09 | Capability Query | 推荐 | Load tolerance 粗粒度 |
| HR-SUR-10 | Save / Restore | 必需 | Need 连续性丢失 |
| HR-SUR-11 | Atomic Commit / Idempotency | 必需 | 资源 / Handoff 重复提交 |
| HR-SUR-12 | Declarative UI Contribution | 推荐 | 聊天降级 |

---

# 29. Creator / asset-spec vNext Requirements

未来需要声明式支持：

- Survival Need Definition；
- Routine Automation Policy；
- Survival Intensity Profile；
- Resource Consume Reference；
- Player Override Policy；
- Survival Load；
- Environment Exposure Mapping；
- Health Handoff；
- Survival Feedback Projection；
- World Time integration；
- Save / Restore semantics。

不允许 Creator 编写：

- 任意 JS；
- 任意公式代码；
- 自建 Health Engine；
- 自建 Inventory Engine。

---

# 30. Migration From v0.1｜旧资产迁移

## 30.1 保留并重构

- Survival Intensity；
- Routine Survival Automation；
- Nutrition；
- Hydration；
- Sleep；
- Environment Exposure；
- Resource Consumption；
- Player Override；
- Open Attempt；
- World Time；
- Player-safe Feedback；
- Save / Restore。

## 30.2 移交 Health Core

以下从 Survival Ownership 移除：

- Current Physical Condition；
- Physical Fatigue；
- Injury；
- Blood Loss；
- Pain；
- Functional Limitation；
- Infection Condition；
- Disease；
- Poison；
- Incapacitation；
- Life-threatening Condition；
- Treatment；
- Recovery；
- Character Death from Health Condition。

## 30.3 接口改写

旧：

```text
War / Magic / Traveler
→ Survival Health Interface
```

新：

```text
Combat / Magic / Divine / Traveler Healing
→ EP-HEALTH-CORE
```

Survival 只在以下场景进入：

```text
Need / Resource / Sleep / Exposure / Survival Load
→ EP-SURVIVAL
→ EP-HEALTH-CORE
```

---

# 31. Quality Gate｜重构自检

| Gate | 结果 |
|---|---|
| Discussion / Authorization | PASS |
| Survival 独立价值 | PASS |
| Health Ownership Deduplication | PASS |
| Need != Condition | PASS |
| Exposure != Bodily Consequence | PASS |
| Load != Physical Fatigue | PASS |
| Sleep Feedback / Debuff Handoff | PASS |
| Routine Automation | PASS |
| Player Override | PASS |
| Resource Causality | PASS |
| Survival Intensity | PASS |
| Program Authority | PASS |
| Open Attempt | PASS |
| Knowledge / Player-safe | PASS |
| Definition / Instance | PASS |
| Creator Authorability | WARN — G9 binding pending |

---

# 32. Current State

```text
EP-SURVIVAL｜生存需求与环境
├─ Old v0.1 Review              COMPLETE
├─ Discussion Gate              COMPLETE
├─ Explicit Authorization       COMPLETE
├─ Major Ownership Refactor     COMPLETE
├─ Health Core Rebinding        COMPLETE
├─ Semantic Candidate v0.2      AUDITED CURRENT
├─ Creator / asset-spec vNext   PENDING G9
└─ Independent Cross-asset Audit PASS
```

---

# 33. Final Freeze｜最终冻结语句

> **Survival 管的是“正常生存条件是否得到满足”；Health 管的是“身体实际上因此变成什么”。**
>
> **Nutrition / Hydration / Sleep 是 Survival Need，不是 Health Condition。**
>
> **Environmental Exposure Process 和 Survival Load 归 Survival；它们产生的持续身体后果统一进入 Health Core。**
>
> **玩家可以禁食、缺水、熬夜、强行赶路；系统不能替玩家做价值选择，但必须忠实记录 Need Deficit、给出角色理应感知的反馈，并在达到身体意义时 Handoff Health Core。**
>
> **特别是持续不睡觉：Survival 必须提醒玩家已经疲惫、需要休息；真正的 Physical Fatigue / Weakness、Functional Effect、Consciousness 与 HP 变化由 Health Core + Runtime 统一裁定。**
>
> **正常生活自动处理，异常生存才进入前台。**


---

# 34. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Expansion：

- 不拥有一级 Extension Surface；
- 主要贡献 Player Status；
- 异常 Nutrition / Hydration / Sleep / Exposure 可贡献 Global Notice / Alert；
- Survival Intensity 与 Routine Automation 设置可贡献 Game Creation / Settings；
- 详细生存状态可进入 Player Character Detail；
- 身体 Debuff / Condition 仍由 Health Core 投影，不在 Survival UI 复制第二份。

**通用库独立审核：PASS。**
