---
title: 神术与信仰｜Expansion Pack
aliases:
  - EP-DIVINE-CORE
  - Divine Core
  - Faith and Divine Invocation
created: 2026-08-16
updated: 2026-08-16
status: audited-current
version: 0.2.1
workflow_mode: light-asset
operation_mode: create
asset_type: expansion-pack
skill: tavern-asset v0.5.2
output_profile: obsidian-markdown
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
hard_dependencies:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
parallel_magic_core:
  - "[[魔法基础_Expansion_Pack_v0.3]]"
combat_integration:
  - "[[战斗魔法_Expansion_Pack_v0.3]]"
combat_core_optional:
  - "[[战斗核心_Expansion_Pack_v0.1]]"
health_core_optional:
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
generic_reuse_target: true
dependency_role: divine-core
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Divine
  - Faith
  - Covenant
  - 神术
  - 神迹
  - 神性锚点
  - 通用资产
  - Obsidian
---

# 神术与信仰｜Expansion Pack v0.2.1

> [!abstract] 一句话定位
> **《神术与信仰》定义凡人与真实神性存在怎样建立互惠神契、获得有限授权、稳定调用神术、形成神性锚点、请求觐见与面对神性主权边界。**
>
> 它不是“法术换皮包”，也不是“虔诚积分系统”。
>
> **神术**是凡人在已经获得的 Authorization Scope 内，依靠神契与自身承载能力相对稳定地调用神性力量。
>
> **神迹**则是神本人作为独立 Actor 主动实施的直接干预。
>
> 两者必须严格分离。

> [!important] 当前可信状态
> **已审核语义稿 v0.2.1｜Combat / Health Optional Integration + Generic Library 总审核通过。**
>
> 本稿冻结语义 Ownership、Covenant / Authority / Invocation / Audience / Miracle 等共同机制，以及与 World Pack、Spell Magic、Character Capability 和 Runtime 的接口。
>
> 不伪造未来正式 Schema、神明 ID、权限枚举或 Runtime API。

---

# 0. 创作摘要

本资产依据已经完成并获项目所有者接受的 Discussion Contract 创作。

## 0.1 已确认方向

1. 本 Expansion 为跨 World Pack 可复用 Divine Core；
2. 具体神、权柄、教会、神域与世界宗教事实由 World Pack 提供；
3. 神凡关系以 `Divine Covenant｜神契` 为核心；
4. 神授予有限 `Authority Scope`，而不是逐次批准每次神术；
5. 神术拥有独立 `Divine Invocation Grammar`，不继承 Spell Grammar；
6. 不设 Faith / Divine Mana 数值池；
7. 采用简单 `Channel Strain｜神性承载负荷`；
8. 神术拥有独立 Invocation Mastery；
9. Personal / Sanctuary / Faith Anchor 为类型化条件，不做线性“信仰点”；
10. Church Office、Divine Covenant、Divine Authorization 三者严格分离；
11. Covenant 变化由真实事件驱动，不由每日虔诚积分驱动；
12. 允许 Multi-Covenant，但每条 Covenant 独立；
13. Divine Invocation 与 Miracle 严格分离；
14. Divine Audience 是特殊 Process，不保证神回应；
15. 神是独立 Actor，拥有沉默、拒绝、谈判和主动回应的自主权；
16. 使用 `Sovereign Divine Authority` 表达特定神权领域的最终主权边界；
17. Spell Magic 与 Divine Invocation 通过显式 Interaction Profile 对接；
18. 神职实践采用开放 Style，而不是职业锁；
19. 神职成长来自 Character Capability、Invocation Mastery 与 Covenant Deepening；
20. “虔诚”不直接等于力量。

---

# 1. Scope Lock

## 1.1 本 Expansion 必须负责

- Divine Covenant；
- Covenant Connection State；
- Covenant Obligation / Permission；
- Authority Scope；
- Divine Invocation Definition；
- Invocation Mastery；
- Channel Strain；
- Personal Anchor；
- Sanctuary Anchor；
- Faith Anchor；
- Multi-Covenant；
- Church / God Authority Separation；
- Covenant Deepening / Tension / Severance；
- Divine Audience；
- Miracle Request；
- Miracle / Direct Divine Intervention 边界；
- Sovereign Divine Authority；
- Spell ↔ Divine Interaction Profile；
- Divine Practice Style；
- 神术学习、授职、直接呼召等多种接入方式；
- 大型通用 Invocation Library；
- Divine Practice Profile 与方向覆盖矩阵；
- Invocation 适用方向 / 类型标签体系；
- Character Card Bootstrap；
- Player-safe Divine Knowledge；
- Runtime / Creator / asset-spec vNext Requirement；
- 与 World Pack、人物能力、魔法基础、战斗魔法的正式接口。

## 1.2 本 Expansion 明确不负责

- 某个世界实际有哪些神；
- 某位神的真实人格；
- 某神具体教义；
- 某教会的国家制度；
- 某神域具体地理；
- 某个世界的死后世界真相；
- 某个角色当前是否虔诚；
- 当前 Game State；
- Church Office 的完整政治晋升机制；
- 神本人最终是否回应；
- Miracle 的最终 Outcome；
- 法术型 Spell Mastery；
- Magic Aptitude；
- Magic Strain；
- 人物六层通用能力；
- 伤势 / 健康 State；
- GM 权限；
- 任意代码。

---

# 2. Owner Map

```text
World Pack
→ 神存在什么、拥有何种 Authority、神域 / 教会 / 世界神权事实

EP-CHAR-CORE
→ 凡人的通用 Character Capability

EP-DIVINE-CORE
→ 神契、授权、神术调用、神性承载、锚点、觐见、神术交互

Character Card
→ 某角色开局拥有什么 Covenant / Authorization / Invocation

Game State
→ 当前 Covenant 状态、当前 Channel Strain、当前已掌握 Invocation、当前锚点与事件

Divine Actor / Runtime
→ 神是否回应、是否扩大 / 撤销授权、是否实施 Miracle、正式 Outcome / Commit
```

---

# 3. Divine Actor｜神不是资源池

本 Core 假设目标 World Pack 可以定义：

> **真实存在并具有自主性的 Divine Actor。**

神不是：

- Mana Battery；
- 自动奖励系统；
- 教会后台服务器；
- 万能 GM 指令；
- 虔诚值兑换商店。

神可以：

- 拥有目标；
- 拥有利益；
- 拥有知识边界；
- 拥有判断；
- 误判；
- 被欺骗；
- 沉默；
- 拒绝；
- 接受交易；
- 调整授权；
- 主动干预。

World Pack 决定神的实际人格与能力。

本 Core 只要求：

> 神性互动必须保护 Divine Actor 自主性。

---

# 4. Divine Covenant｜神契

## 4.1 定义

`Divine Covenant` 是凡人与某个 Divine Actor 之间真实成立的互惠关系。

最小语义：

```text
Mortal Party
+
Divine Party
+
Obligations
+
Granted Authority Scope
+
Anchor Role
+
Covenant State
```

## 4.2 神契不是加入教会

以下三者必须分开：

```text
Church Membership / Office
≠
Divine Covenant
≠
Divine Authorization
```

因此可以存在：

- 没有神契的神学家；
- 没有正式教会职位却被神直接选中的凡人；
- 被教会革职但 Covenant 仍稳定的神职者；
- 身居高位却只拥有有限 Divine Authorization 的主教。

## 4.3 建立神契的可能路径

Core 不规定唯一入口。

合法路径可以包括：

- 正式授职；
- 私人祈祷与回应；
- 神主动呼召；
- 圣地仪式；
- 重大事件；
- 直接觐见；
- 某种世界认可的继承仪式；
- 其他 World Pack 定义方式。

无论路径如何：

> **最终都必须由 Divine Actor 接受，才能产生真实 Covenant。**

教会不能单方面替神创建连接。

---

# 5. Covenant State｜连接状态

推荐保持低复杂度：

```text
稳定
→ 紧张
→ 沉寂
→ 断绝
```

“未知”属于 Character Knowledge，不是 Covenant State。

## 5.1 稳定

双方的 Covenant 仍正常成立。

已授权 Invocation 可以按规则调用。

## 5.2 紧张

真实矛盾已经影响 Covenant。

可能表现为：

- 部分 Audience 更难获得；
- 某些高阶授权需要重新确认；
- 神职者明确感受到关系压力。

不能自动推导：

> 全部神术关闭。

## 5.3 沉寂

连接没有被正式断绝，但 Divine Actor 长期不回应：

- Prayer；
- Audience；
- 授权调整请求。

已明确授予的稳定 Invocation 是否仍可使用：

> 由具体 Covenant / World Pack 决定。

Core 不自动把“沉默”解释为“断契”。

## 5.4 断绝

Covenant 不再成立。

凡人失去依赖该 Covenant 的未来调用资格。

已存在的独立 Spell Effect / World Effect 是否立即消失：

> 由其 Definition 与 Runtime 决定。

---

# 6. Covenant Change｜关系变化

Covenant 不使用：

> Faith +1 / -5

变化必须来自真实事件。

典型来源：

- 长期履行核心义务；
- 完成重大共同目标；
- 公然违背 Covenant 核心条款；
- 利用神性力量反复进行 Divine Actor 明确反对的行为；
- 神主动扩大授权；
- 神主动撤销授权；
- 凡人主动提出修改或断契；
- Divine Actor 状态发生变化；
- 多重 Covenant 发生真实冲突；
- Divine Audience 中重新谈判。

---

# 7. Covenant Deepening｜深化而非升级条

本 Core 不建立：

> 神契等级 1–10。

“关系深化”表现为实际事实变化：

- 新增 Authority Scope；
- 某个大神术获得授权；
- 减少某类 Ritual Requirement；
- 获得更直接 Audience Access；
- 获得新的义务；
- 神将更重要任务交给该角色；
- Personal Anchor 重要性提高。

这些都是：

> **具体 Covenant Fact。**

不是统一经验条。

---

# 8. Authority Scope｜神性授权范围

## 8.1 核心定义

神拥有自己的 Divine Authority。

凡人从 Covenant 中获得的不是“神的全部力量”，而是：

> **有限 Authorization Scope。**

例如某个 World Pack 可以定义一个神拥有：

- life；
- healing；
- growth；
- renewal。

某个神职者只被授权：

> healing + protection_of_life

另一个人可能额外获得：

> growth。

## 8.2 Authority Scope 决定

- 哪类 Invocation 可以合法调用；
- 哪些大神术可进入学习；
- 哪些 Audience 请求具有契约依据；
- 哪些神性 Effect Interaction 可以被该角色提出。

## 8.3 Authority Scope 不决定

- 自动成功；
- 自动获得 Invocation Mastery；
- 自动知道全部礼仪；
- 自动获得 Church Office；
- 自动获得神全部知识。

---

# 9. Authority Tag Taxonomy｜通用权柄标签

Core 允许 World Pack 使用开放式 Authority Tag。

推荐通用语义包括但不限于：

- protection
- order
- oath
- judgment
- mercy
- life
- healing
- growth
- renewal
- knowledge
- revelation
- truth
- prophecy
- soul
- death
- passage
- rest
- boundary
- travel
- change
- purification
- sanctuary
- presence

这些不是宇宙唯一正式神权列表。

World Pack 可以新增领域。

Creator 不应把所有世界的神强行塞进固定二十项枚举。

---

# 10. Divine Invocation Grammar｜神术定义

## 10.1 Divine Invocation 与 Spell 分离

```text
Spell
→ 依靠法术知识 / Spell Grammar 构筑世界效应

Divine Invocation
→ 依靠 Covenant + Authorization 调用神性力量
```

二者可以在世界本体上同源。

但实践体系：

> **不同。**

## 10.2 Invocation Definition 最小语义

每个 Divine Invocation 至少需要表达：

- identity；
- invocation_grade；
- required_authority；
- core_effect；
- target；
- range / context；
- duration；
- channel_load；
- invocation_requirements；
- interaction_profile；
- sovereign_boundary_check；
- failure / strain notes。

这些是语义要求，不是未来冻结字段名。

---

# 11. Invocation Grade｜神术层级

采用三层：

```text
常规神术
→ 高阶神术
→ 大神术
```

然后发生质变：

```text
大神术
────────
Miracle｜神迹
```

## 11.1 常规神术

可作为成熟神职者的常用稳定 Invocation。

## 11.2 高阶神术

需要更深 Authorization、Mastery 或 Anchor Context。

## 11.3 大神术

凡人依然是调用者，但通常需要：

- 高深 Invocation Mastery；
- 强 Authority Scope；
- Sanctuary；
- Ritual；
- 多人协作；
- 极高 Channel Load；

中的若干项。

## 11.4 神迹不是第四级神术

Miracle：

> **由 Divine Actor 本人主动实施。**

凡人可以：

- 祈求；
- 建立 Audience；
- 提供理由；
- 交易；
- 请求。

不能：

> “学会神迹并每天释放一次。”

---

# 12. Invocation Mastery｜神术掌握

神术学习与 Divine Authorization 分开。

推荐阶段：

```text
未习得
→ 受教
→ 稳定掌握
→ 熟练
→ 深谙
```

## 12.1 未习得

即使拥有对应 Authority，也不会自动知道如何稳定 Invocation。

## 12.2 受教

已经学习礼仪与调用结构，可以在良好条件下尝试。

## 12.3 稳定掌握

可以在正常条件下可靠使用。

## 12.4 熟练

可以：

- 更快组织 Invocation；
- 处理普通干扰；
- 更好利用 Anchor Context；
- 更准确地控制已授权效果。

## 12.5 深谙

拥有足够深入的实践理解，可以：

- 教授对应礼仪；
- 组织大型仪式；
- 在恶劣条件下维持调用；
- 参与大神术；
- 帮助他人建立稳定实践路径。

Mastery：

> 不等于 Authorization。

---

# 13. 神术学习

## 13.1 学习来源

可以来自：

- 教会教育；
- 私人导师；
- 圣典；
- 仪式传统；
- Divine Audience；
- 神直接启示；
- 实践训练；
- 其他合法世界来源。

## 13.2 知道 ≠ 有权

一个神学家可以知道完整 Invocation Ritual。

但没有对应 Covenant / Authority：

> 不能因此获得正式神性调用权限。

## 13.3 有权 ≠ 会用

被神直接呼召的人可能获得 Authority。

但仍需要：

- 学习；
- 实践；
- 熟悉 Channel；
- 掌握 Invocation。

这允许真正不同的神职成长路径。

---

# 14. Channel Strain｜神性承载负荷

## 14.1 定义

`Channel Strain` 表示：

> **凡人作为神性力量接口时，当前身体、精神与灵魂承受神性通道的压力。**

它不是：

- Faith；
- Divine Mana；
- 神还剩多少力量；
- Covenant 好感度。

## 14.2 推荐状态

```text
平稳
→ 承压
→ 紧绷
→ 过载
```

## 14.3 典型来源

- 连续高阶 Invocation；
- 大神术；
- 弱 Anchor Context；
- 使用自己并不熟练的 Invocation；
- 神性冲突；
- 特殊世界环境；
- 多 Covenant 同时调用；
- Divine Interaction 反噬。

## 14.4 典型影响

- Invocation 更难稳定；
- 高阶调用条件变严；
- 需要更强 Anchor 支撑；
- Divine Interaction 更容易失败；
- 继续强行调用可能转化为 Health / Soul / Condition 后果。

## 14.5 与 Magic Strain 分离

```text
Magic Strain
≠
Channel Strain
```

一个人同时是法师和神职者时：

> 两种当前状态可以同时存在。

不得为了简化而合并成万能“精神负荷”。

---

# 15. Anchor System｜神性锚点

本 Core 定义三类 Anchor。

## 15.1 Personal Anchor

真正建立 Covenant 的凡人。

功能：

- Divine Actor 在物质世界的主动精确接口；
- Invocation 的基础接入路径；
- Audience 的潜在入口；
- Divine Projection 的个人锚点。

## 15.2 Sanctuary Anchor

例如：

- 神殿；
- 圣地；
- 祭坛；
- 圣物；
- 特殊建筑。

可能提供：

- 更稳定 Invocation；
- 大型 Ritual；
- 大神术；
- Audience；
- 多人神性协作。

## 15.3 Faith Anchor

由长期、真实、集体信仰形成的广域社会神性基础。

它可以影响：

- Divine Projection 的广度；
- 某地区神性存在稳定度；
- Sanctuary Network 背景。

但：

> 不做“信徒人数 × 系数 = 神力”。

## 15.4 Anchor 是条件，不是三根资源条

Runtime 应读取实际：

- 人；
- 地点；
-组织；
- 历史；
- 信仰；
- 神性事实。

而不是维护：

> Personal Anchor 82 / Sanctuary 55 / Faith 91。

---

# 16. Church / God Authority Separation

必须永久区分：

```text
Church Office
≠
Covenant
≠
Authorization Scope
```

因此：

- Church 可以革职；
- Church 可以处分；
- Church 可以宣布异端；
- Church 可以剥夺组织资源；

但不能自动：

> 删除 Divine Covenant。

反过来：

- 神可以撤销 Covenant；
- 神可以缩小 Authorization；

但这不自动：

> 改写国家法律或撤销某人现实中的教会职位。

这些变化需要各自 Owner 的正式机制处理。

---

# 17. Multi-Covenant｜多神契

一个凡人可以在 World Pack 允许时拥有多条 Covenant。

每条分别维护：

- Divine Party；
- Obligations；
- Authority Scope；
- Connection State；
- Invocation Access；
- Audience Context。

## 17.1 不合并

不得：

> 把两位神的 Authority 合并成一个 Divine Mana Pool。

## 17.2 冲突来源

冲突可能来自：

- 两神关系；
- Authority 冲突；
- Covenant 义务；
- 角色实际行为；
- Sanctuary 限制；
- 世界宗教政治。

## 17.3 Multi-Covenant 是选择成本

更多 Covenant 不是纯收益。

可能意味着：

- 更多义务；
- 更多政治问题；
- 更多神性冲突；
- 更复杂 Audience；
- 更高 Channel Strain 风险。

---

# 18. Divine Practice Profile｜神职实践方向

本 Expansion 不建立固定职业树。

“圣骑士、圣武士、审判官、祭司”等名称在 Core 中只表示：

> **一组常见实践取向、技能组合与 Invocation 使用偏好。**

World Pack 可以：

- 改名；
- 合并；
- 拆分；
- 赋予组织身份；
- 决定某种头衔是否真实存在。

Character Card 也可以跨 Profile 学习。

Profile：

> **不是职业锁，不是 Character State，不是六层成长中的“执行风格”。**

为了避免与 `EP-CHAR-CORE` 的 Canonical `Character Execution Style` 混淆，本包统一称：

> **Divine Practice Profile｜神职实践方向**

## 18.1 圣骑士｜誓约护卫型近战神职

核心幻想：

> 以誓约、守护、近战武艺和神性庇护承担“站在危险与被保护者之间”的角色。

常见能力组合：

- 近战 Martial Skill；
- 神性引导；
- 战地神术；
- 庇护 / 誓约 / 圣武 Invocation；
- 反应式防御；
- 同伴保护；
- 有限机动。

不强制：

- 骑马；
- 贵族身份；
- 某一具体宗教；
- 必须穿重甲。

## 18.2 圣武士｜进攻型近战神职

核心幻想：

> 把 Divine Invocation 与纯粹武技结合，形成更强调破阵、近身压迫、异常目标净化和个人战斗爆发的圣武路线。

与圣骑士区别：

- 圣骑士更偏护卫 / 誓约 / 阵线；
- 圣武士更偏近身打击 / 破坏 / 自强化。

两者可以高度重叠。

## 18.3 审判官｜远程追猎 / 反制型战斗神职

核心幻想：

> 依靠远程武器、神性标记、追迹、辨识、破障、仪式干扰与高精度 Invocation 对危险超自然目标进行追猎和压制。

“审判官”在 Core 中**不自动意味着宗教司法机关**。

尤其不能推导：

> 教会认定异端 → 目标自动成为合法神术伤害对象。

实际合法目标仍由：

- World Pack；
- Authority Scope；
- Covenant；
- Runtime Fact；

共同决定。

## 18.4 战地祭司｜小队支援 / 战场救护型

核心幻想：

> 在直接交战中保持治疗、净化、群体庇护、阵线保护与紧急撤离能力。

它是：

- Combat Support；
- Field Medic；
- Ritual Support；

的神术路线。

## 18.5 祭司｜圣礼 / 圣所 / 社群型

核心幻想：

> 管理礼仪、圣所、公共祝祷、葬仪、社群服务、大型 Ritual 与大神术组织。

祭司并不一定弱于战斗神职。

其优势更多体现在：

- 群体规模；
- Ritual；
- Sanctuary；
- 长期公共影响；
- Audience Preparation。

## 18.6 神医｜治疗 / 康复 / 生命型

核心幻想：

> 把 Divine Invocation 用于医疗、生命维持、疾病、再生、康复与大型灾害医疗。

神医不是：

> 自动复活职业。

死亡主权仍受 Sovereign Divine Authority 限制。

## 18.7 神谕者｜启示 / 预兆 / 信息型

核心幻想：

> 使用 Revelation、Truth、Prophecy 类 Authority 获取有限真实信息、条件性未来、因果结构与神性启示。

神谕者：

> 不拥有全知。

## 18.8 渡魂者 / 驱邪者｜灵魂 / 净化 / 渡界型

核心幻想：

> 处理亡者、残魂、外来附着、异常灵体、葬仪、渡界和灵魂保护。

“驱邪”不能机械等同：

> 与本教会不同 = 邪恶。

必须存在真实：

- 异常附着；
- 非法侵害；
- 世界认可的危险超自然状态；
- 对应 Authority。

## 18.9 隐修者 / 朝圣者｜旅途 / 圣地 / 私人神契型

核心幻想：

> 降低对正式教会机构的依赖，以私人 Covenant、圣地、远行、修行、临时祈所和直接 Audience 为主。

适合：

- 旅途；
- 探索；
- 荒野；
- 神秘体验；
- 第五神等非标准 Divine Actor。

## 18.10 圣契官 / 裁约者｜誓约 / 法理 / 调停型

核心幻想：

> 专注 Covenant、Oath、Truth、公共见证、协议解释、圣所法理和神凡契约的专业实践者。

它不是：

> “神术法官自动判定真相”。

只在实际 Authority、证据和参与者许可范围内工作。

## 18.11 Profile 混合

一个角色可以同时：

- 圣骑士 + 战地祭司；
- 审判官 + 神谕者；
- 渡魂者 + 祭司；
- 神医 + 隐修者；
- 圣武士 + 审判官。

Core 不提供：

> “转职”或“多职业惩罚”。

真正成本来自：

- 学习时间；
- Invocation Mastery；
- Skill；
- Authority Scope；
- Covenant 义务；
- 人生机会成本。

---

# 19. Divine Audience｜神性觐见

## 19.1 Audience 不是普通菜单技能

它是特殊 Process。

```text
Audience Intent
↓
Access Conditions
↓
Covenant / Anchor / World Boundary
↓
建立合法接触路径
↓
Divine Actor Autonomous Adjudication
↓
沉默 / 拒绝 / 回应 / 谈判 / 条件 / 其他
```

## 19.2 满足条件 ≠ 神必须回答

Audience Process 只保证：

> 尝试具有合法世界路径。

不保证：

> Divine Actor 必须出现。

## 19.3 World Pack 定义具体觐见方式

Core 不定义：

- 死神一定在什么地方；
- 哪位神通过梦境；
- 哪位神通过圣约；
- 哪位神必须进入神域。

这些由 World Pack 提供。

---

# 20. Miracle｜神迹

## 20.1 定义

Miracle 是：

> **Divine Actor 主动实施、超出凡人常规 Authorization Invocation 的直接世界干预。**

## 20.2 凡人能做什么

凡人可以：

- 祈求；
- 觐见；
- 谈判；
- 提供代价；
- 建立条件；
- 提出请求。

## 20.3 凡人不能做什么

不能：

- 学会 Miracle；
- 把 Miracle 放入 Learned Invocation List；
- 强制 Divine Actor 释放；
- 用 Church Office 自动调用；
- 用 Faith Meter 兑换。

## 20.4 Miracle Permission Scope｜神迹权限范围

> **神迹不是 GM 权限。**

Divine Actor 即使亲自行动，也必须存在明确世界内合法来源。

最小链：

```text
Divine Actor
↓
World Pack Defined Authority / Explicit Capability
↓
Miracle Intent
↓
Permission Scope Validation
↓
Canonical Owner / Player Agency / Sovereign Boundary Check
↓
Runtime Resolution
↓
Atomic Commit
```

因此：

- 生命神不能仅凭“神迹”自动取得死后灵魂最终去留权；
- 死亡神不能仅凭“神很强”获得知识神式全知；
- 未拥有相关 Authority 的神不能任意重写其他 Canonical Owner；
- 神迹不能默认改写玩家角色的爱恨、价值选择、忠诚、原谅、承诺或其他受 Player Agency 保护的未来决定；
- Divine Actor 可以非常强，但“神”本身不是 `GM1–GM3`；
- 如果 Miracle 需要多个互不隶属的 Sovereign Authority，应由多个合法来源共同参与，而不是一个神越权代办。

## 20.5 Miracle Outcome

属于：

> Divine Actor + Runtime Formal Outcome。

Expansion：

> 只定义合法 Proposal / Permission / Interaction 边界。

不是 Expansion 或模型直接 Commit。

---

# 21. Sovereign Divine Authority｜神权主权边界

## 21.1 定义

World Pack 可以声明：

> 某一特定世界领域、边界或终极去留问题，由某个 Divine Authority 拥有 Sovereign Authority。

这表示：

> 普通 Divine Invocation 不能凭自身调用权限越过该主权边界。

## 21.2 典型用途

可以用于：

- 死亡完成后的灵魂去留；
- 某个神域核心进入权；
- 世界级誓约最终裁定；
- 特定命运主权；
- 其他世界专属神性边界。

## 21.3 触碰 Sovereign Boundary 时

Invocation Resolution 必须转换为：

```text
Invocation 无独立主权
↓
Audience / Request / Bargain
↓
Sovereign Divine Actor Adjudication
```

## 21.4 埃瑟维亚的死亡用法

由 World Pack 声明：

> 所有真正死亡的凡人灵魂最终抵达死神领域。

灵魂抵达之后：

> 复活不再是单纯 Invocation Capability 问题。

必须：

> 与死神交涉。

本 Core 只提供这种“主权转交”机制。

---

# 22. Spell ↔ Divine Interaction Profile

法术与神术可以同源，但不共享完整运行体系。

每个 Invocation / Divine Effect 可以声明 Interaction Profile。

## 22.1 `open`

形成的神性效果可以被一般魔法：

- 感知；
- 分析；
- 尝试驱散 / 干扰；

但仍按正式 Resolution 处理。

## 22.2 `resistant`

普通 Spell Counter 可以：

- 影响；
- 削弱；
- 干扰；

但神性结构具有额外稳定性或 Authority 支撑。

## 22.3 `authority_bound`

法术可以干扰：

- mortal channel；
- visible effect；
- Anchor interface；

但不能通过普通 Countermagic：

> 撤销神与凡人的 Authorization。

## 22.4 `sovereign`

涉及：

- Sovereign Authority；
- Divine Audience Gate；
- 神直接主权。

普通法术 Countermagic 不具备取消其主权的默认权限。

## 22.5 Miracle

Divine Actor 直接实施的 Miracle：

> 不默认进入普通 Dispel / Counterspell。

若某 World Pack 或未来机制明确存在 anti-divine / rival-divine 交互：

> 由对应 Owner 提供。

---

# 23. 与《魔法基础》的关系

```text
Spell Magic
↔
Divine Invocation
```

共有：

- 世界超自然因果；
- Runtime Resolution；
- Effect Interaction；
- Program Authority。

不共有：

- Magic Aptitude；
- Spell Mastery；
- Casting Load；
- Magic Strain；
- Spell Learning；
- Spell Variant Grammar。

神术不因“本体同源”而变成 Spell Skin。

---

# 24. 与《战斗魔法》的关系

《战斗魔法》的敌法者可以：

- 识别部分 Divine Effect；
- 干扰某些 mortal channel；
- 尝试对 `open / resistant / authority_bound` Effect 进行合法 Counter Interaction。

但是：

- 不能用普通反魔法删除 Covenant；
- 不能删除 Authority Scope；
- 不能把 Miracle 当普通 Spell 自动驱散；
- 不能越过 Sovereign Divine Authority。

这关闭了此前《战斗魔法》的 Handoff。

---


# 24A. 与《战斗核心》的关系

`EP-DIVINE-CORE` 本身不 Hard Depend `EP-COMBAT-CORE`，因为 Prayer / Ritual / Healing / Audience 可以非战斗独立成立。

圣骑士、圣武士、审判官、战地祭司一旦进入直接交战，消费 Combat Core 的 Combat Range、LOS/Cover、Reaction、Pressure、Martial Outcome、Combat Consequence、Weapon/Armor Profile。

`战地神术` 仍属于 Divine Core，表示在 Combat Pressure 下稳定完成 Invocation；它不拥有近战命中、远程命中、格挡或 Reaction Window。

Invocation 的 `Range / Context` 描述 Invocation 自身可达 / 仪式条件，不是 Combat Position。

```text
Combat Core Outcome / Trigger
+ Divine Invocation Internal Resolution
→ Runtime Composite Formal Outcome
```

---

# 24B. 与《身体状态核心》的关系

`EP-DIVINE-CORE` 不 Hard Depend `EP-HEALTH-CORE`。

Healing / Life / Recovery Invocation 可以提供：

- Stabilize；
- Relief；
- Repair；
- Support；
- Recover；

等 Health-relevant Treatment Effect。

正式身体结果统一进入：

```text
Divine Invocation Formal Outcome
→ Treatment / Bodily Effect
→ EP-HEALTH-CORE
→ Condition / Health Burden / hidden HP
```

Divine Core 不直接宣布 `HP +X`，也不因治疗成功删除未被实际修复的 Condition。

Bodily Death 之后若涉及灵魂返回，继续服从 Sovereign Divine Authority；Health Core 不扩大 Invocation 的 Resurrection 权限。

---

# 25. Character Capability Contribution

本 Expansion 复用 `EP-CHAR-CORE` 的统一 Skill Registry。

领域技能只在确有跨 Invocation 迁移价值时新增。

## 25.1 神学

**适用方向：**

> 祭司 / 神谕者 / 圣契官 / 审判官 / 渡魂者 / 隐修者

理解：

- 神性传统；
- 权柄；
- 教义；
- 宗教史；
- Divine Covenant 理论；
- 神性制度与礼仪背景。

它不提供：

- Divine Authorization；
- 神的真实私密知识；
- 自动 Audience。

## 25.2 圣礼

**适用方向：**

> 祭司 / 神医 / 神谕者 / 渡魂者 / 圣契官 / 战地祭司

组织：

- Ritual；
- Sanctuary；
- 群体 Invocation；
- 葬仪；
- 奠基；
- Covenant Ceremony；
- 公共祝祷。

## 25.3 神性引导

**适用方向：全部 Divine Practice Profile。**

表示：

> 在身体、精神与灵魂中稳定引导**已经授权**的 Divine Power。

它影响：

- Invocation 稳定性；
- Channel Strain 承受；
- 高阶 Invocation；
- Anchor 使用。

它不等于：

> Authorization 本身。

## 25.4 战地神术

**适用方向：**

> 圣骑士 / 圣武士 / 审判官 / 战地祭司

表示：

> 在 `EP-COMBAT-CORE` 提供的高速移动、近身压迫、远程交火、受击风险和 Reaction Window 中稳定完成 Divine Invocation 的训练。

它类似于 Spell Magic 中的“战斗施法”：

- 不替代近战兵器；
- 不替代远程兵器；
- 不替代徒手格斗；
- 不替代战术判断；
- 不替代移动；
- 不自动命中；
- 不建立第二套 Combat System；实际战斗由 `EP-COMBAT-CORE` 提供。

## 25.5 不创建

本 Core 不创建：

- 虔诚技能；
- 神力属性；
- Divine Intelligence；
- 教会等级属性；
- 圣骑士等级；
- 审判官等级；
- 一个 Invocation 一个 Skill。

---

# 26. Character Card Bootstrap

Character Card 可以合法提供：

- 初始 Covenant；
- Covenant 来源；
- Authority Scope；
- 初始 Invocation；
- Invocation Mastery；
- Divine Practice Profile 倾向；
- Church Office；
- 相关信条 / 经历。

但必须区分：

```text
Character Card
→ 开局 Definition / Bootstrap

Game State
→ 之后 Covenant、Authorization、Mastery、Channel Strain 的实际变化
```

---

# 27. Player Knowledge

## 27.1 玩家自己

玩家角色通常知道：

- 自己与谁建立 Covenant；
- 自己当前明确被授予什么 Authority；
- 自己掌握哪些 Invocation；
- 当前 Channel Strain 大体状态；
- 自己知道的 Covenant Obligation。

## 27.2 NPC

不得自动显示：

- NPC 全部 Divine Authorization；
- 隐藏 Covenant；
- 神真正为何选择此人；
- 神对该 NPC 的真实评价；
- 未公开 Multi-Covenant。

通过：

- 观察；
- 圣职档案；
- 宗教调查；
- 共同仪式；
- Divine Revelation；

逐渐形成 Character Knowledge。

---

# 28. Runtime Flow｜神术调用流程

```text
Invocation Intent
↓
Covenant Exists?
↓
Authority Scope?
↓
Invocation Knowledge / Mastery?
↓
Anchor Context?
↓
Channel Strain?
↓
Sovereign Boundary?
↓
Interaction / Target Conditions
↓
Runtime Resolution
↓
Formal Outcome
↓
State Commit
```

如果触及 Sovereign Boundary：

```text
Invocation Resolution
→ 停止独立主权路径
→ Audience / Request
```

---

# 29. Prayer / Audience / Miracle 分离

必须区分：

```text
Prayer
= 凡人的表达 / 请求

Divine Audience
= 建立与 Divine Actor 的正式直接交流过程

Divine Invocation
= 已授权范围内的凡人稳定调用

Miracle
= Divine Actor 本人直接干预
```

祈祷本身：

> 不需要成为强制机制按钮。

任何人都可以祈祷。

但：

> Prayer ≠ God Response。

---

# 30. Invocation Library Contract｜标签与方向平衡

本 Core 的 Invocation Library 同时承担两种标签语义。

## 30.1 适用实践方向标签

回答：

> **“哪些 Divine Practice Profile 通常最适合使用这个 Invocation？”**

例如：

- 圣骑士；
- 圣武士；
- 审判官；
- 战地祭司；
- 祭司；
- 神医；
- 神谕者；
- 渡魂者；
- 隐修者；
- 圣契官。

标签：

> 是 Creator / Character Card 组合参考，不是学习资格白名单。

一个没有“圣骑士”标签的 Invocation：

> 仍然可以被圣骑士学习，只要真实 Authority、Mastery 与条件成立。

## 30.2 神术类型标签

回答：

> **“这个 Invocation 在玩法上主要做什么？”**

当前常见类型包括：

- 近战；
- 远程；
- 攻击；
- 防御；
- 反应；
- 治疗；
- 支援；
- 群体；
- 控制；
- 净化；
- 反制；
- 追踪；
- 启示；
- 信息；
- 灵魂；
- 渡界；
- 通行；
- 机动；
- 圣所；
- 誓约；
- 仪式；
- 公共服务；
- 觐见。

它们不是封闭 enum。

未来可以新增真正有价值的类型标签。

## 30.3 Authority Tag 与功能标签必须分开

例如：

```text
Authority Requirement:
judgment / truth

Invocation Type:
远程 / 追踪 / 攻击
```

`judgment` 回答：

> 哪种神权可以授权。

`远程 / 攻击` 回答：

> 玩家拿它来做什么。

不得混成一套标签。

## 30.4 平衡原则

“平衡”不表示：

> 每个 Practice Profile 必须拥有完全相同数量的神术。

而是确保：

1. 每个正式 Profile 都有足够的常规神术用于建立玩法身份；
2. 每个正式 Profile 都有高阶成长路线；
3. 每个正式 Profile 至少能够接触大神术；
4. 战斗型 Profile 不因神术包偏向仪式 / 治疗而内容贫乏；
5. 祭司 / 神医 / 神谕等非战斗 Profile 也不被战斗内容吞没；
6. 同一个 Invocation 可以服务多个 Profile，避免人为制造同效果重复技能。

## 30.5 v0.2 Practice Coverage Matrix

| Practice Profile | 可用 Invocation | 常规 | 高阶 | 大神术 |
|---|---:|---:|---:|---:|
| 圣骑士｜誓约护卫型近战神职 | 26 | 9 | 13 | 4 |
| 圣武士｜进攻型近战神职 | 18 | 3 | 12 | 3 |
| 审判官｜远程追猎 / 反制型战斗神职 | 19 | 5 | 12 | 2 |
| 战地祭司｜小队支援 / 战场救护型 | 35 | 11 | 16 | 8 |
| 祭司｜圣礼 / 圣所 / 社群型 | 49 | 20 | 13 | 16 |
| 神医｜治疗 / 康复 / 生命型 | 26 | 9 | 10 | 7 |
| 神谕者｜启示 / 预兆 / 信息型 | 15 | 5 | 7 | 3 |
| 渡魂者 / 驱邪者｜灵魂 / 净化 / 渡界型 | 21 | 7 | 10 | 4 |
| 隐修者 / 朝圣者｜旅途 / 圣地 / 私人神契型 | 20 | 10 | 8 | 2 |
| 圣契官 / 裁约者｜誓约 / 法理 / 调停型 | 15 | 3 | 7 | 5 |

该矩阵只是当前 Library 的**创作覆盖检查**。

它不是 Runtime 职业技能表。

## 30.6 v0.2 Grade Distribution

```text
常规神术：26
高阶神术：38
大神术：20

总计：84
```

重点修正：

- 圣骑士：26 项；
- 圣武士：18 项；
- 审判官：19 项；
- 战地祭司：35 项。

因此近战、远程与战地神职不再只依赖少数通用祝福。

---

# 31. 通用 Divine Invocation Library｜84 个

> [!note] Library 定位
> 这些是通用 Canonical Invocation Pattern。
>
> World Pack 通过 Divine Authority Scope 决定：
>
> - 哪些神可以授权它们；
> - 哪些组织实际掌握礼仪；
> - 哪些 Invocation 在该世界不存在；
> - 哪些被重新命名或拥有地方礼仪表现。
>
> 因此 Library 是可复用机制内容，不是埃瑟维亚五神的第二事实表。
>
> 每条 Invocation 同时带有：
>
> - **适用实践方向**；
> - **神术类型标签**；
> - Authority Requirement；
> - Interaction Profile。
>
> 这些标签用于 Creator / Character Card / UI 组织，不产生职业锁。

### DIV-001｜庇护祝福

- **层级**：常规
- **Invocation Family**：庇护
- **适用实践方向**：`圣骑士 / 圣武士 / 战地祭司 / 祭司`
- **神术类型标签**：`防御 / 支援`
- **典型 Authority Requirement**：`protection / mercy / order`
- **Channel Load**：轻
- **核心效果**：在单个对象上建立短时神性庇护，使其更能承受符合该神授权范围的危险或冲击。
- **Target**：creature
- **Range / Context**：接触 / 近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是无条件免疫；实际保护方向必须与授予 Authority 一致。

### DIV-002｜誓言见证

- **层级**：常规
- **Invocation Family**：誓约
- **适用实践方向**：`圣骑士 / 祭司 / 圣契官`
- **神术类型标签**：`誓约 / 仪式 / 支援`
- **典型 Authority Requirement**：`oath / order / truth`
- **Channel Load**：轻
- **核心效果**：在自愿宣告的誓言或契约上建立神性见证，使参与者与知情观察者更容易确认该誓言确实被正式立下。
- **Target**：persons / covenant
- **Range / Context**：接触 / 仪式范围
- **Duration**：长期证据
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：只证明誓言被立下，不强迫任何人履约，也不读取其内心真实意愿。

### DIV-003｜安宁祷仪

- **层级**：常规
- **Invocation Family**：安宁
- **适用实践方向**：`祭司 / 神医 / 渡魂者 / 隐修者`
- **神术类型标签**：`支援 / 安宁`
- **典型 Authority Requirement**：`mercy / rest / soul`
- **Channel Load**：轻
- **核心效果**：缓和对象在悲恸、恐惧、临终或葬仪中的强烈精神扰动，提供神性安抚。
- **Target**：creature / funeral
- **Range / Context**：近距
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不是心灵控制；不能把合理悲伤、拒绝或恐惧强行抹除。

### DIV-004｜警示圣印

- **层级**：常规
- **Invocation Family**：警戒
- **适用实践方向**：`审判官 / 战地祭司 / 祭司 / 隐修者`
- **神术类型标签**：`警戒 / 支援`
- **典型 Authority Requirement**：`protection / revelation`
- **Channel Load**：轻
- **核心效果**：在小范围设置与特定危险类别相关的神性警示，一旦满足已声明条件便向授权对象发出信号。
- **Target**：area
- **Range / Context**：接触
- **Duration**：定时 / 触发式
- **Spell ↔ Divine Interaction**：`open`
- **边界**：只能监测被授权与可表达的条件，不是全知预警。

### DIV-005｜圣言传达

- **层级**：常规
- **Invocation Family**：交流
- **适用实践方向**：`祭司 / 神谕者 / 圣契官`
- **神术类型标签**：`通讯 / 支援`
- **典型 Authority Requirement**：`revelation / knowledge / oath`
- **Channel Load**：轻
- **核心效果**：向已建立明确宗教联系且处于合理距离或圣所网络内的对象传达一段简短、清晰的神职讯息。
- **Target**：creature
- **Range / Context**：远距 / anchor-dependent
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不是跨世界无限通讯；是否可达取决于 Anchor Context 与 World Pack。

### DIV-006｜抚创

- **层级**：常规
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司 / 祭司`
- **神术类型标签**：`治疗 / 支援`
- **典型 Authority Requirement**：`healing / life / mercy`
- **Channel Load**：轻
- **核心效果**：促进轻中度创伤的正常恢复，稳定出血、疼痛或组织状态，并为正式医疗创造更好条件。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：瞬时 / 短暂
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不直接覆盖 Health Owner；真实伤势变化必须由正式 Health / Runtime Outcome 提交。

### DIV-007｜复元

- **层级**：高阶
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司`
- **神术类型标签**：`治疗`
- **典型 Authority Requirement**：`healing / life / renewal`
- **Channel Load**：中
- **核心效果**：对较严重损伤进行更深层的生命恢复，帮助组织重新建立正常结构与功能。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：短暂 / 仪式
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不能无视缺失组织、死亡边界或世界生命法则；实际恢复程度由 Runtime 裁定。

### DIV-008｜祛病礼

- **层级**：高阶
- **Invocation Family**：净化
- **适用实践方向**：`神医 / 祭司 / 渡魂者`
- **神术类型标签**：`治疗 / 净化 / 仪式`
- **典型 Authority Requirement**：`healing / purification / life`
- **Channel Load**：中
- **核心效果**：针对已识别疾病、感染或异常生命过程进行神性干预，提升机体恢复或移除可被该 Authority 处理的病理影响。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是任何疾病都能瞬间清除；未知病因、神性病变与特殊诅咒可能需要额外条件。

### DIV-009｜生机灌注

- **层级**：高阶
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 祭司 / 隐修者`
- **神术类型标签**：`生命 / 恢复`
- **典型 Authority Requirement**：`life / growth / renewal`
- **Channel Load**：中
- **核心效果**：在有限对象或小范围生态中强化生命活性与恢复能力，帮助植物、生物或土地从严重衰败中恢复。
- **Target**：creature / small_area
- **Range / Context**：近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不凭空创造完整生态，不允许绕过食物、环境和物种条件。

### DIV-010｜大治愈礼

- **层级**：大神术
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司 / 祭司`
- **神术类型标签**：`治疗 / 大神术 / 仪式`
- **典型 Authority Requirement**：`healing / life / renewal`
- **Channel Load**：重
- **核心效果**：通过高强度神性通道处理多重重伤、复杂组织损害或多人医疗危机，形成远超普通神术的综合恢复。
- **Target**：one_or_many_creatures
- **Range / Context**：仪式范围
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：仍不能跨越 Sovereign Death Boundary；死亡完成后的复活不属于本 Invocation 可自动完成的结果。

### DIV-011｜启示之问

- **层级**：常规
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 祭司 / 隐修者`
- **神术类型标签**：`启示 / 信息`
- **典型 Authority Requirement**：`knowledge / revelation`
- **Channel Load**：轻
- **核心效果**：围绕一个清晰问题请求有限神性启示，获得与 Authority 相关的线索、象征、事实片段或方向。
- **Target**：self / authorized_group
- **Range / Context**：自身 / 圣所
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：神术不是全知 API；答案受神自身知识、授权、信息边界和问题质量限制。

### DIV-012｜真伪辨见

- **层级**：高阶
- **Invocation Family**：真理
- **适用实践方向**：`审判官 / 神谕者 / 圣契官`
- **神术类型标签**：`启示 / 辨识`
- **典型 Authority Requirement**：`truth / knowledge / oath`
- **Channel Load**：中
- **核心效果**：检查一个明确陈述、文件、誓言或可观察证据中是否存在与神性 Authority 可识别的明显矛盾、伪造或破坏。
- **Target**：statement / document / covenant
- **Range / Context**：近距
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动读取说话者内心，也不能把复杂事实压缩成绝对真 / 假。

### DIV-013｜记忆澄明

- **层级**：常规
- **Invocation Family**：知识
- **适用实践方向**：`神谕者 / 神医 / 隐修者`
- **神术类型标签**：`支援 / 知识`
- **典型 Authority Requirement**：`knowledge / revelation / mercy`
- **Channel Load**：轻
- **核心效果**：帮助自愿对象整理自身已有记忆与认知片段，降低混乱、遗忘干扰或强烈情绪造成的提取困难。
- **Target**：self / consenting_creature
- **Range / Context**：接触
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不能创造不存在的记忆，也不能绕过目标同意读取私密内容。

### DIV-014｜远兆观照

- **层级**：高阶
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 审判官 / 隐修者`
- **神术类型标签**：`启示 / 预兆`
- **典型 Authority Requirement**：`revelation / prophecy / knowledge`
- **Channel Load**：中
- **核心效果**：围绕特定事件或近期走向获得条件性征兆与高概率趋势，而非固定未来。
- **Target**：event / self
- **Range / Context**：仪式 / anchor-dependent
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：未来仍开放；信息可模糊、条件化或受神性噪声影响。

### DIV-015｜大神谕

- **层级**：大神术
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 祭司`
- **神术类型标签**：`启示 / 大神术 / 仪式`
- **典型 Authority Requirement**：`revelation / prophecy / knowledge`
- **Channel Load**：重
- **核心效果**：通过大型仪式请求高重要度的神性启示，可涉及国家、文明或长期因果趋势，但仍由神的知识、意愿与 Authority 决定回应内容。
- **Target**：authorized_group / major_question
- **Range / Context**：Sanctuary / ritual
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是强制神回答，更不是固定剧本生成器；可以沉默、拒绝或给出条件性答案。

### DIV-016｜安魂礼

- **层级**：常规
- **Invocation Family**：死亡与灵魂
- **适用实践方向**：`渡魂者 / 祭司 / 隐修者`
- **神术类型标签**：`灵魂 / 仪式 / 安魂`
- **典型 Authority Requirement**：`death / passage / rest / soul`
- **Channel Load**：轻
- **核心效果**：稳定刚死亡者或葬仪中的灵魂过渡，减少异常滞留、惊扰或外部低阶干涉。
- **Target**：dead / funeral
- **Range / Context**：接触 / 仪式范围
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不拥有灵魂，不强迫灵魂放弃合理意愿；具体死后秩序由 World Pack 的 Sovereign Authority 决定。

### DIV-017｜护魂

- **层级**：高阶
- **Invocation Family**：死亡与灵魂
- **适用实践方向**：`渡魂者 / 圣骑士 / 战地祭司 / 圣武士`
- **神术类型标签**：`灵魂 / 防御`
- **典型 Authority Requirement**：`soul / protection / passage`
- **Channel Load**：中
- **核心效果**：在活体、濒死者或尚未完成渡界的灵魂上建立有限神性保护，抵抗可被该 Authority 识别的灵魂侵害。
- **Target**：creature / soul_in_transition
- **Range / Context**：近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不能永久阻止世界既定死亡秩序。

### DIV-018｜引渡亡魂

- **层级**：高阶
- **Invocation Family**：死亡与灵魂
- **适用实践方向**：`渡魂者 / 祭司`
- **神术类型标签**：`灵魂 / 渡界 / 仪式`
- **典型 Authority Requirement**：`death / passage / rest`
- **Channel Load**：中
- **核心效果**：帮助异常滞留、迷失或愿意离开的死者灵魂重新进入世界认可的死亡 / 渡界路径。
- **Target**：soul
- **Range / Context**：近距 / ritual
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：需要目标确属可引渡状态；不能把完整人格灵魂当作无主物强制处置。

### DIV-019｜遗响问答

- **层级**：高阶
- **Invocation Family**：死亡与灵魂
- **适用实践方向**：`渡魂者 / 神谕者 / 祭司`
- **神术类型标签**：`灵魂 / 信息`
- **典型 Authority Requirement**：`soul / knowledge / death`
- **Channel Load**：中
- **核心效果**：在世界允许的前提下，与死者残留的真实灵魂、残响或记忆印记建立短暂有限交流。
- **Target**：dead_trace / soul
- **Range / Context**：接触 / ritual
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不得把残魂、记忆残响和完整人格混为一谈；所获信息受来源实际知识限制。

### DIV-020｜魂归召回

- **层级**：大神术
- **Invocation Family**：死亡与灵魂
- **适用实践方向**：`渡魂者 / 神医 / 祭司`
- **神术类型标签**：`灵魂 / 复活 / 大神术 / 仪式`
- **典型 Authority Requirement**：`life / soul / restoration / passage`
- **Channel Load**：重
- **核心效果**：在灵魂尚未跨越对应世界 Sovereign Death Boundary 时，尝试重新建立灵魂与可承载生命结构之间的联系。
- **Target**：recently_dead
- **Range / Context**：仪式
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：一旦灵魂已进入拥有最终死亡主权的神性领域，本 Invocation 自动失去独立完成复活的权限，只能转入 Divine Audience / Request。

### DIV-021｜圣门

- **层级**：高阶
- **Invocation Family**：边界与通行
- **适用实践方向**：`圣骑士 / 审判官 / 祭司 / 隐修者 / 圣武士`
- **神术类型标签**：`通行 / 机动`
- **典型 Authority Requirement**：`boundary / passage / travel`
- **Channel Load**：中
- **核心效果**：在两个世界内合法可达且已建立神性联系的地点之间形成短时受控通路或通过窗口。
- **Target**：two_points
- **Range / Context**：anchor-dependent
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是任意跨位面传送；跨位面能力由 World Pack 与 Authority 明确开放。

### DIV-022｜越界庇护

- **层级**：高阶
- **Invocation Family**：边界与通行
- **适用实践方向**：`圣骑士 / 祭司 / 隐修者`
- **神术类型标签**：`通行 / 防御`
- **典型 Authority Requirement**：`boundary / protection / travel`
- **Channel Load**：中
- **核心效果**：为穿越危险边界、圣域门槛或特殊环境的对象提供有限神性稳定与保护。
- **Target**：creature / group
- **Range / Context**：近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：只降低与对应 Authority 相符的风险，不让角色忽略所有环境法则。

### DIV-023｜归途指引

- **层级**：常规
- **Invocation Family**：边界与通行
- **适用实践方向**：`隐修者 / 祭司 / 圣骑士`
- **神术类型标签**：`通行 / 导航 / 支援`
- **典型 Authority Requirement**：`passage / travel / revelation`
- **Channel Load**：轻
- **核心效果**：在已知目标、神性锚点或真实归属关系存在时提供方向性引导，帮助对象寻找返回路径。
- **Target**：self / group
- **Range / Context**：自身
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不能凭空知道从未定义过的安全路线，也不能替代导航和地理事实。

### DIV-024｜变迁祝福

- **层级**：高阶
- **Invocation Family**：变化
- **适用实践方向**：`祭司 / 圣契官 / 隐修者`
- **神术类型标签**：`变化 / 仪式 / 支援`
- **典型 Authority Requirement**：`change / renewal / transition`
- **Channel Load**：中
- **核心效果**：在一个已经真实发生、且符合对应 Authority 的重大身份、生命阶段或社会转变上提供神性稳定与祝福。
- **Target**：creature / covenant / transition
- **Range / Context**：仪式
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：祝福变化，不替玩家决定要不要结婚、出家、继位、变形或改变人生目标。

### DIV-025｜净化仪式

- **层级**：常规
- **Invocation Family**：净化
- **适用实践方向**：`渡魂者 / 神医 / 祭司 / 审判官 / 圣武士`
- **神术类型标签**：`净化 / 仪式`
- **典型 Authority Requirement**：`purification / protection / mercy`
- **Channel Load**：轻
- **核心效果**：从对象或小范围环境中移除可被神性 Authority 明确认定为异常附着、污染或有害超自然残留。
- **Target**：creature / object / area
- **Range / Context**：接触
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不把文化上“不喜欢”的对象自动定义为污染；需有真实可处理对象。

### DIV-026｜大净礼

- **层级**：大神术
- **Invocation Family**：净化
- **适用实践方向**：`祭司 / 渡魂者 / 战地祭司`
- **神术类型标签**：`净化 / 大神术 / 仪式`
- **典型 Authority Requirement**：`purification / protection / order`
- **Channel Load**：重
- **核心效果**：针对大型区域、复杂污染或多重超自然附着执行高强度神性净化。
- **Target**：large_area / structure
- **Range / Context**：Sanctuary / ritual
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不能用“净化”作为删除人物、思想、文化或合法异见的万能权限。

### DIV-027｜异质驱逐

- **层级**：高阶
- **Invocation Family**：驱逐
- **适用实践方向**：`审判官 / 渡魂者 / 圣武士`
- **神术类型标签**：`净化 / 驱逐 / 控制`
- **典型 Authority Requirement**：`boundary / purification / judgment`
- **Channel Load**：中
- **核心效果**：把不属于当前合法存在边界、且确实可被该 Authority 驱逐的超自然实体或效应向其原本可达状态推回。
- **Target**：entity / effect
- **Range / Context**：近距
- **Duration**：瞬时 / ritual
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：必须存在真实边界依据；不能仅因“不是我方”就驱逐普通人或合法本地存在。

### DIV-028｜圣武灌注

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 圣武士 / 战地祭司`
- **神术类型标签**：`近战 / 攻击 / 强化`
- **典型 Authority Requirement**：`protection / judgment / oath`
- **Channel Load**：中
- **核心效果**：在武器、盾牌或身体战斗姿态上建立短时神性灌注，使其在对应 Authority 的合法目标与情境中获得额外神性作用。
- **Target**：weapon / self
- **Range / Context**：接触
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动命中，也不允许用神性授权绕过 Martial Outcome。

### DIV-029｜同伴代祷

- **层级**：高阶
- **Invocation Family**：庇护
- **适用实践方向**：`圣骑士 / 战地祭司 / 神医 / 圣武士`
- **神术类型标签**：`防御 / 反应 / 支援`
- **典型 Authority Requirement**：`mercy / protection / healing`
- **Channel Load**：中
- **核心效果**：在短反应窗口中为附近同伴提供一次神性介入尝试，削弱其正在承受的可合法干预负面效应。
- **Target**：ally
- **Range / Context**：近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是替同伴自动做决定，也不保证消除所有伤害或 Spell。

### DIV-030｜群体庇护礼

- **层级**：大神术
- **Invocation Family**：庇护
- **适用实践方向**：`圣骑士 / 战地祭司 / 祭司 / 圣武士`
- **神术类型标签**：`防御 / 大神术 / 仪式`
- **典型 Authority Requirement**：`protection / order / mercy`
- **Channel Load**：重
- **核心效果**：通过圣所或大型仪式为一群人、建筑群或公共避难区域建立持续神性庇护。
- **Target**：group / structure / area
- **Range / Context**：Sanctuary
- **Duration**：大型仪式 / 长期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：保护对象与持续范围必须明确；不等于无敌城市结界。

### DIV-031｜圣所奠定

- **层级**：大神术
- **Invocation Family**：圣所
- **适用实践方向**：`祭司 / 圣契官`
- **神术类型标签**：`圣所 / 大神术 / 仪式`
- **典型 Authority Requirement**：`sanctuary / oath / protection / presence`
- **Channel Load**：重
- **核心效果**：在符合神明与 World Pack 条件的地点举行大型奠基仪式，向神提出把该处确立为 Sanctuary Anchor 的正式请求。
- **Target**：place
- **Range / Context**：local ritual
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`sovereign`
- **边界**：完成仪式只产生候选与请求；是否真正形成 Sanctuary Anchor 需要 Divine Actor / World Authority 接受。

### DIV-032｜觐见门槛

- **层级**：大神术
- **Invocation Family**：觐见
- **适用实践方向**：`祭司 / 神谕者 / 隐修者 / 圣契官`
- **神术类型标签**：`觐见 / 大神术 / 仪式`
- **典型 Authority Requirement**：`audience / revelation / boundary`
- **Channel Load**：重
- **核心效果**：在满足特定 Covenant、Anchor 与世界条件时建立 Divine Audience 的合法接触路径。
- **Target**：self / group
- **Range / Context**：Sanctuary / special
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`sovereign`
- **边界**：只打开觐见可能性；神是否回应、以何种形式回应、是否允许交涉完全由 Divine Actor 自主裁定。

### DIV-033｜神锋灌注

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 圣武士 / 战地祭司`
- **神术类型标签**：`近战 / 攻击 / 强化`
- **典型 Authority Requirement**：`judgment / protection / oath`
- **Channel Load**：中
- **核心效果**：在近战武器或徒手打击媒介上建立短时神性灌注，使有效命中能够附带与授权 Authority 一致的额外神性作用。
- **Target**：weapon / self
- **Range / Context**：接触
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动命中；不得把“神性”解释为对所有目标额外伤害。

### DIV-034｜守誓格挡

- **层级**：常规
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 圣武士 / 战地祭司`
- **神术类型标签**：`近战 / 防御 / 反应`
- **典型 Authority Requirement**：`protection / oath / order`
- **Channel Load**：轻
- **核心效果**：在一次明确的近身防守动作中短暂强化武器、盾牌或身体防线，使其更适合承受与 Covenant 保护对象相关的攻击。
- **Target**：self / protected_ally
- **Range / Context**：自身 / 近距
- **Duration**：反应式
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：必须存在真实防守窗口；不提供自动格挡。

### DIV-035｜神威震击

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣武士 / 圣骑士`
- **神术类型标签**：`近战 / 控制 / 攻击`
- **典型 Authority Requirement**：`judgment / protection / order`
- **Channel Load**：中
- **核心效果**：把一次有效近战接触转化为短促神性震击，用于击退、打断姿态或破坏明显敌对的近身压迫。
- **Target**：martial_contact
- **Range / Context**：近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：效果依赖真实接触和 Authority；不自动造成致命伤害。

### DIV-036｜誓卫冲锋

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 圣武士 / 战地祭司`
- **神术类型标签**：`近战 / 机动 / 防御`
- **典型 Authority Requirement**：`oath / protection / passage`
- **Channel Load**：中
- **核心效果**：在保护明确对象、地点或誓约目标的前提下强化一次突进或拦截，使施术者更快进入防线或敌我之间。
- **Target**：self
- **Range / Context**：自身
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是瞬移；必须存在可通过路径，且誓约保护对象需真实存在。

### DIV-037｜圣盾回响

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 战地祭司`
- **神术类型标签**：`防御 / 反应 / 支援`
- **典型 Authority Requirement**：`protection / order`
- **Channel Load**：中
- **核心效果**：当神性防护成功承受显著冲击后，把部分结构稳定转化为一次短暂反制震荡或队友庇护。
- **Target**：self / ally
- **Range / Context**：近距
- **Duration**：触发式
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：只有防护真实承受攻击后才可触发；不复制原攻击伤害。

### DIV-038｜破秽重击

- **层级**：高阶
- **Invocation Family**：圣武
- **适用实践方向**：`圣武士 / 圣骑士 / 渡魂者`
- **神术类型标签**：`近战 / 攻击 / 净化`
- **典型 Authority Requirement**：`purification / judgment / death`
- **Channel Load**：中
- **核心效果**：针对已被合法识别为异常附着、亡灵驱动、腐化结构或可净化超自然目标的对象，将一次近战命中转化为高强度净化冲击。
- **Target**：martial_contact / supernatural_effect
- **Range / Context**：近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不能把文化异端、政治敌人或普通生命自动标记为“秽”。

### DIV-039｜誓约战旗

- **层级**：大神术
- **Invocation Family**：圣武
- **适用实践方向**：`圣骑士 / 战地祭司 / 祭司`
- **神术类型标签**：`防御 / 支援 / 群体 / 大神术`
- **典型 Authority Requirement**：`oath / protection / order`
- **Channel Load**：重
- **核心效果**：以施术者、旗帜、圣徽或其他合法媒介为核心建立有限战斗庇护域，使自愿加入同一明确防卫誓约的同伴更稳定地维持阵线与神性保护。
- **Target**：group / area
- **Range / Context**：近距 / 仪式范围
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不控制同伴意志；成员可随时退出，且域不能把誓约扩张到未授权目标。

### DIV-040｜不屈圣躯

- **层级**：大神术
- **Invocation Family**：圣武
- **适用实践方向**：`圣武士 / 圣骑士 / 战地祭司`
- **神术类型标签**：`近战 / 防御 / 自强化 / 大神术`
- **典型 Authority Requirement**：`protection / life / oath`
- **Channel Load**：重
- **核心效果**：在短时间内把高强度神性保护集中于施术者，使其能够在严重冲击、疼痛或恶劣环境下维持行动与 Covenant 任务。
- **Target**：self
- **Range / Context**：自身
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不抹除真实伤势，也不使身体免于后果；持续结束后仍需 Health Owner 处理累积损伤。

### DIV-041｜裁断圣矢

- **层级**：常规
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 圣骑士 / 战地祭司`
- **神术类型标签**：`远程 / 攻击`
- **典型 Authority Requirement**：`judgment / truth / protection`
- **Channel Load**：轻
- **核心效果**：将一枚箭矢、弩矢、投枪或神性投射物调谐为针对已明确授权目标的远程神性打击。
- **Target**：projectile / target
- **Range / Context**：可视
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动命中，也不因“审判”标签获得识别善恶的能力。

### DIV-042｜显迹圣印

- **层级**：常规
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 神谕者 / 渡魂者`
- **神术类型标签**：`远程 / 标记 / 追踪 / 辨识`
- **典型 Authority Requirement**：`truth / revelation / judgment`
- **Channel Load**：轻
- **核心效果**：在已观察目标或区域上建立短期标记，使其明显的神性、魔法、伪装或异常行为痕迹更容易被授权观察者追踪。
- **Target**：creature / area
- **Range / Context**：近距 / 可视
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：只增强对真实可观测痕迹的识别，不读取思想或罪责。

### DIV-043｜追迹裁印

- **层级**：高阶
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 神谕者 / 隐修者`
- **神术类型标签**：`远程 / 追踪 / 信息`
- **典型 Authority Requirement**：`truth / judgment / revelation`
- **Channel Load**：中
- **核心效果**：对已经合法识别并存在持续追踪依据的目标建立更稳定的神性追迹关系，帮助施术者在复杂环境中维持方向判断。
- **Target**：creature / trace
- **Range / Context**：远距 / anchor-dependent
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不跨位面无限追踪；目标可通过真实遮蔽、边界或神性反制摆脱。

### DIV-044｜穿障圣矢

- **层级**：高阶
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 圣武士`
- **神术类型标签**：`远程 / 攻击 / 破障`
- **典型 Authority Requirement**：`judgment / protection / purification`
- **Channel Load**：中
- **核心效果**：使一次远程攻击专门调谐为对可合法交互的屏障、附着式防护或异常神性结构产生额外破坏。
- **Target**：projectile / barrier
- **Range / Context**：可视
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动穿透实体墙体或 Sovereign Effect；命中与破障分别裁定。

### DIV-045｜远距驱附

- **层级**：高阶
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 渡魂者 / 战地祭司`
- **神术类型标签**：`远程 / 净化 / 反制`
- **典型 Authority Requirement**：`purification / judgment / protection`
- **Channel Load**：中
- **核心效果**：通过可视或已标定目标，尝试从远距离削弱或驱散一个可被对应 Authority 处理的附着式超自然 Effect。
- **Target**：spell_or_divine_effect
- **Range / Context**：可视
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不能删除 Covenant、Authority Scope 或不可驱散的世界事实。

### DIV-046｜禁制瞄定

- **层级**：高阶
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 圣契官`
- **神术类型标签**：`远程 / 控制 / 标记`
- **典型 Authority Requirement**：`judgment / oath / truth`
- **Channel Load**：中
- **核心效果**：在已识别敌对行动模式上建立短时神性禁制标记，使目标重复执行某类明确行为时更容易暴露或受到相应神性反应。
- **Target**：creature
- **Range / Context**：可视
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不能禁止玩家输入或强制目标停止行动；它只改变后续可合法产生的神性反应条件。

### DIV-047｜断仪圣击

- **层级**：高阶
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 渡魂者 / 战地祭司`
- **神术类型标签**：`远程 / 反制 / 攻击`
- **典型 Authority Requirement**：`judgment / order / purification`
- **Channel Load**：中
- **核心效果**：向正在进行的公开仪式、Invocation Channel 或可识别 Ritual Node 发出远程神性冲击，尝试破坏其稳定与节奏。
- **Target**：ritual_node / channel
- **Range / Context**：可视
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动取消大神术或 Miracle；只作用于可交互的凡人通道或结构。

### DIV-048｜审迹之网

- **层级**：大神术
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 祭司 / 圣契官`
- **神术类型标签**：`远程 / 侦察 / 区域 / 大神术`
- **典型 Authority Requirement**：`truth / revelation / judgment`
- **Channel Load**：重
- **核心效果**：在有限区域建立持续神性检视网络，使明显超自然痕迹、伪造仪式、违约行为证据或可识别异常更难在区域内长期隐藏。
- **Target**：area
- **Range / Context**：Sanctuary / prepared_area
- **Duration**：定时 / 长期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不读取思想、不自动判定罪责，也不把政治异议视为异常。

### DIV-049｜战地止血

- **层级**：常规
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 神医 / 圣骑士`
- **神术类型标签**：`治疗 / 战地 / 支援`
- **典型 Authority Requirement**：`healing / mercy / life`
- **Channel Load**：轻
- **核心效果**：在战斗压力下迅速稳定明显出血与休克风险，为后续正式医疗争取时间。
- **Target**：creature
- **Range / Context**：接触 / 近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不是完整治愈；真实伤势仍由 Health Owner 维护。

### DIV-050｜战地复元

- **层级**：高阶
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 神医`
- **神术类型标签**：`治疗 / 战地 / 支援`
- **典型 Authority Requirement**：`healing / life / protection`
- **Channel Load**：中
- **核心效果**：在短时间内提升受伤同伴维持行动与恢复的能力，并处理若干可被授权影响的战斗性创伤。
- **Target**：creature
- **Range / Context**：近距
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不抹除严重伤势或透支后果。

### DIV-051｜同袍守护

- **层级**：常规
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 圣骑士 / 祭司`
- **神术类型标签**：`支援 / 防御 / 群体`
- **典型 Authority Requirement**：`protection / oath / mercy`
- **Channel Load**：轻
- **核心效果**：在两个或数个自愿同伴之间建立短时互助庇护，使明显针对其中一人的神性防护更容易得到队友支援。
- **Target**：small_group
- **Range / Context**：近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不自动分担伤害，也不强制任何人承担风险。

### DIV-052｜应急净化

- **层级**：常规
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 神医 / 渡魂者`
- **神术类型标签**：`净化 / 战地 / 支援`
- **典型 Authority Requirement**：`purification / healing / protection`
- **Channel Load**：轻
- **核心效果**：快速处理战场上可识别的轻度毒素、污染、附着或神性异常，为脱离危险创造条件。
- **Target**：creature / object
- **Range / Context**：接触 / 近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不替代完整净化仪式，也不能处理 Sovereign Effect。

### DIV-053｜阵线祷壁

- **层级**：高阶
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 圣骑士`
- **神术类型标签**：`防御 / 群体 / 战地`
- **典型 Authority Requirement**：`protection / order / oath`
- **Channel Load**：中
- **核心效果**：沿明确阵线建立短时定向神性防护，帮助小队承受来自一个主要方向的冲击、投射或超自然压力。
- **Target**：line / group
- **Range / Context**：近距
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不是全向无敌屏障；需要成员真实维持阵线。

### DIV-054｜退敌圣波

- **层级**：高阶
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 圣武士 / 圣骑士`
- **神术类型标签**：`控制 / 战地 / 防御`
- **典型 Authority Requirement**：`protection / judgment / order`
- **Channel Load**：中
- **核心效果**：释放短距神性冲击，用于迫退逼近者、打断包围或给伤员撤离创造空间。
- **Target**：area
- **Range / Context**：近距
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：主要是位移与压迫，不自动造成致命伤害。

### DIV-055｜救护通路

- **层级**：高阶
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 神医 / 圣骑士`
- **神术类型标签**：`机动 / 支援 / 防御`
- **典型 Authority Requirement**：`protection / passage / mercy`
- **Channel Load**：中
- **核心效果**：在短时间内标定一条撤离或救护路径，为沿该路线移动的自愿对象提供有限庇护与方向引导。
- **Target**：path / group
- **Range / Context**：近距
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不创造不存在的道路，也不能穿越封闭障碍。

### DIV-056｜战地圣域

- **层级**：大神术
- **Invocation Family**：战地
- **适用实践方向**：`战地祭司 / 祭司 / 神医`
- **神术类型标签**：`圣所 / 治疗 / 防御 / 大神术`
- **典型 Authority Requirement**：`protection / healing / sanctuary`
- **Channel Load**：重
- **核心效果**：在准备充分的小范围战场建立临时神性救护与防卫区域，使治疗、净化与庇护 Invocation 更容易稳定。
- **Target**：area
- **Range / Context**：prepared_area
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是永久 Sanctuary Anchor，也不会让敌对行动自动失效。

### DIV-057｜群体祝祷

- **层级**：常规
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 战地祭司 / 圣契官`
- **神术类型标签**：`仪式 / 群体 / 支援`
- **典型 Authority Requirement**：`mercy / protection / order / life`
- **Channel Load**：轻
- **核心效果**：通过短时集体仪式为自愿参与者提供与对应 Authority 相符的共同祝福与精神准备。
- **Target**：group
- **Range / Context**：仪式范围
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不强制统一思想，不把参加仪式等同于建立 Covenant。

### DIV-058｜祭坛共鸣

- **层级**：高阶
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 神谕者 / 圣契官`
- **神术类型标签**：`仪式 / 圣所 / 支援`
- **典型 Authority Requirement**：`sanctuary / presence / revelation`
- **Channel Load**：中
- **核心效果**：在合法祭坛或圣所设施中提升 Invocation 的组织稳定性，并帮助识别 Anchor Context 是否真实存在。
- **Target**：sanctuary_structure
- **Range / Context**：接触 / 圣所
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不能把普通建筑自动变成 Sanctuary Anchor。

### DIV-059｜圣所巡礼

- **层级**：常规
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 隐修者 / 渡魂者`
- **神术类型标签**：`仪式 / 圣所 / 维护`
- **典型 Authority Requirement**：`sanctuary / passage / revelation`
- **Channel Load**：轻
- **核心效果**：围绕已存在的 Sanctuary Anchor 进行周期性维护与检视，识别明显损坏、污染或 Covenant 网络异常。
- **Target**：sanctuary
- **Range / Context**：圣所
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：维护不等于神必然继续承认该圣所；重大变化仍需 Divine Actor / World Fact。

### DIV-060｜丰饶祝礼

- **层级**：高阶
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 神医 / 隐修者`
- **神术类型标签**：`公共服务 / 生命 / 仪式`
- **典型 Authority Requirement**：`life / growth / renewal`
- **Channel Load**：中
- **核心效果**：为农田、牧群、园圃或小型社区生产活动提供周期性生命与恢复支持。
- **Target**：area / community
- **Range / Context**：仪式范围
- **Duration**：长期
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不能凭空创造食物，也不绕过季节、土壤、劳动和生态条件。

### DIV-061｜旅途祝礼

- **层级**：常规
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 隐修者 / 圣骑士`
- **神术类型标签**：`通行 / 支援 / 仪式`
- **典型 Authority Requirement**：`passage / protection / mercy`
- **Channel Load**：轻
- **核心效果**：为即将启程的自愿旅队建立短时神性祝福，帮助抵抗旅途中与 Authority 相关的常见风险。
- **Target**：group
- **Range / Context**：仪式范围
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不提供地图全知或免疫事故。

### DIV-062｜公共安宁礼

- **层级**：高阶
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 渡魂者 / 圣契官`
- **神术类型标签**：`公共服务 / 安宁 / 仪式`
- **典型 Authority Requirement**：`mercy / rest / order`
- **Channel Load**：中
- **核心效果**：在葬礼、灾后、重大公共危机或长期恐慌环境中，通过集体仪式稳定社区情绪与公共秩序。
- **Target**：community / area
- **Range / Context**：仪式范围
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不压制异议、不删除悲伤，也不强迫人群接受宗教立场。

### DIV-063｜食水净礼

- **层级**：常规
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 神医 / 战地祭司`
- **神术类型标签**：`公共服务 / 净化 / 支援`
- **典型 Authority Requirement**：`purification / life / mercy`
- **Channel Load**：轻
- **核心效果**：净化有限批次的饮水、食物或器具中可被对应 Authority 处理的普通污染与病原风险。
- **Target**：food / water / tools
- **Range / Context**：接触 / 仪式范围
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不处理未知剧毒、神性污染或完全腐败物质，除非有额外 Authority 与条件。

### DIV-064｜大祝圣礼

- **层级**：大神术
- **Invocation Family**：祭仪
- **适用实践方向**：`祭司 / 圣契官 / 渡魂者`
- **神术类型标签**：`圣所 / 仪式 / 大神术`
- **典型 Authority Requirement**：`sanctuary / presence / oath / protection`
- **Channel Load**：重
- **核心效果**：为大型公共设施、神殿、墓园、救护所或重要仪式场所提出长期神性祝圣，使其具备成为稳定神性活动节点的条件。
- **Target**：structure / place
- **Range / Context**：大型仪式
- **Duration**：长期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：祝圣不自动等于 Sanctuary Anchor；真正 Anchor 仍需对应神性接受。

### DIV-065｜生命维持

- **层级**：高阶
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司`
- **神术类型标签**：`治疗 / 维持 / 支援`
- **典型 Authority Requirement**：`life / healing / mercy`
- **Channel Load**：中
- **核心效果**：在对象生命功能濒临崩溃时维持关键生理过程，为治疗、撤离或手术争取时间。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不等于治愈，也不能无限阻止已完成死亡。

### DIV-066｜毒素分离

- **层级**：高阶
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司`
- **神术类型标签**：`治疗 / 净化`
- **典型 Authority Requirement**：`healing / purification / life`
- **Channel Load**：中
- **核心效果**：帮助身体识别、局部隔离并排出一种已经明确识别的毒素或有害代谢物。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：未知毒素与神性毒害可能超出授权范围。

### DIV-067｜再生礼

- **层级**：大神术
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 祭司`
- **神术类型标签**：`治疗 / 再生 / 大神术`
- **典型 Authority Requirement**：`healing / life / renewal`
- **Channel Load**：重
- **核心效果**：在充分条件下促进严重缺损组织或肢体的长期再生过程，使身体重新建立结构与功能。
- **Target**：creature
- **Range / Context**：大型仪式 / 长期护理
- **Duration**：长期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是瞬时长肢；需要身体基础、时间、营养与 Health Owner 协同。

### DIV-068｜病域隔离

- **层级**：高阶
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 祭司 / 战地祭司`
- **神术类型标签**：`治疗 / 防御 / 区域`
- **典型 Authority Requirement**：`healing / purification / protection`
- **Channel Load**：中
- **核心效果**：在小范围建立针对已识别疾病传播路径的神性隔离，降低传播并支持医疗处置。
- **Target**：area / group
- **Range / Context**：近距 / 仪式
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不自动治愈患者，也不能替代现实隔离与卫生条件。

### DIV-069｜痛觉缓和

- **层级**：常规
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司 / 祭司`
- **神术类型标签**：`治疗 / 安宁 / 支援`
- **典型 Authority Requirement**：`mercy / healing`
- **Channel Load**：轻
- **核心效果**：在自愿对象上降低不必要的疼痛与紧张，使治疗、休息或撤离更容易。
- **Target**：creature
- **Range / Context**：接触
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不能用来强制受刑、消除警戒或掩盖危险伤势而不产生后果。

### DIV-070｜复健祝祷

- **层级**：常规
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 祭司`
- **神术类型标签**：`治疗 / 康复 / 长期`
- **典型 Authority Requirement**：`healing / renewal / mercy`
- **Channel Load**：轻
- **核心效果**：长期辅助康复训练，使身体更稳定地重新学习受伤后失去的正常动作与功能。
- **Target**：creature
- **Range / Context**：接触 / 周期仪式
- **Duration**：长期
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不替代训练、时间和身体结构条件。

### DIV-071｜群体生命守护

- **层级**：大神术
- **Invocation Family**：生命
- **适用实践方向**：`神医 / 战地祭司 / 祭司`
- **神术类型标签**：`治疗 / 防御 / 群体 / 大神术`
- **典型 Authority Requirement**：`life / protection / healing`
- **Channel Load**：重
- **核心效果**：在大型灾害或医疗危机中，为一群生命建立临时神性生命守护，降低快速恶化与二次伤害风险。
- **Target**：group / area
- **Range / Context**：仪式范围
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不自动治愈所有人，也不能跨越完成死亡的 Sovereign Boundary。

### DIV-072｜生机重塑

- **层级**：大神术
- **Invocation Family**：生命
- **适用实践方向**：`神医`
- **神术类型标签**：`治疗 / 重塑 / 大神术`
- **典型 Authority Requirement**：`life / renewal / healing`
- **Channel Load**：重
- **核心效果**：在极严格条件下重整复杂但仍属于活体可恢复范围的组织结构，处理普通治疗无法解决的严重畸变、错位或损毁。
- **Target**：creature
- **Range / Context**：大型仪式
- **Duration**：长期 / 分阶段
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不能把任意形态改造包装成治疗，也不能越过人物自主性或物种 World Fact。

### DIV-073｜梦兆求问

- **层级**：常规
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 隐修者 / 祭司`
- **神术类型标签**：`启示 / 梦境 / 信息`
- **典型 Authority Requirement**：`revelation / prophecy / knowledge`
- **Channel Load**：轻
- **核心效果**：在睡眠或冥想前建立神性提问结构，使授权对象可能通过梦兆获得有限、象征性的启示。
- **Target**：self / consenting_creature
- **Range / Context**：自身
- **Duration**：睡眠周期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不保证神回应，也不把梦境自动当作无误真相。

### DIV-074｜因果寻迹

- **层级**：高阶
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 审判官 / 圣契官`
- **神术类型标签**：`启示 / 信息 / 调查`
- **典型 Authority Requirement**：`revelation / truth / prophecy`
- **Channel Load**：中
- **核心效果**：围绕已发生事件追踪若干重要因果联系，帮助区分主要诱因、后果与仍在延续的趋势。
- **Target**：event / evidence
- **Range / Context**：仪式 / anchor-dependent
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是全知历史回放；受神的知识、证据与 Authority 限制。

### DIV-075｜驱附礼

- **层级**：常规
- **Invocation Family**：渡魂
- **适用实践方向**：`渡魂者 / 祭司 / 审判官`
- **神术类型标签**：`净化 / 灵魂 / 驱逐`
- **典型 Authority Requirement**：`purification / soul / protection`
- **Channel Load**：轻
- **核心效果**：从自愿或失去正常自主能力的对象上尝试移除可被识别为外来附着的低阶灵体、残响或神性污染。
- **Target**：creature / object
- **Range / Context**：接触
- **Duration**：仪式
- **Spell ↔ Divine Interaction**：`resistant`
- **边界**：不能把人格、记忆、文化身份或合法 Covenant 当作“附身”删除。

### DIV-076｜灵障驱离

- **层级**：高阶
- **Invocation Family**：渡魂
- **适用实践方向**：`渡魂者 / 审判官 / 圣武士`
- **神术类型标签**：`灵魂 / 驱逐 / 区域`
- **典型 Authority Requirement**：`soul / passage / purification / death`
- **Channel Load**：中
- **核心效果**：在有限区域迫使不应长期滞留且可被对应 Authority 处理的异常灵体离开当前附着位置或重新进入合法去向。
- **Target**：area / spirit
- **Range / Context**：近距 / 仪式
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：完整人格灵魂仍拥有自主性与世界权利；不能用此术任意驱逐合法存在。

### DIV-077｜亡者安息域

- **层级**：大神术
- **Invocation Family**：渡魂
- **适用实践方向**：`渡魂者 / 祭司`
- **神术类型标签**：`灵魂 / 安魂 / 区域 / 大神术`
- **典型 Authority Requirement**：`death / rest / passage / sanctuary`
- **Channel Load**：重
- **核心效果**：在墓园、灾难现场或大规模死亡地点建立临时安魂领域，稳定大量死者过渡并压制异常残留。
- **Target**：area
- **Range / Context**：大型仪式
- **Duration**：定时 / 长期
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不夺取灵魂所有权；真正死后去向由 World Pack Sovereign Authority 决定。

### DIV-078｜朝圣坚忍

- **层级**：常规
- **Invocation Family**：隐修
- **适用实践方向**：`隐修者 / 祭司 / 圣骑士`
- **神术类型标签**：`支援 / 通行 / 自强化`
- **典型 Authority Requirement**：`passage / mercy / protection`
- **Channel Load**：轻
- **核心效果**：在长期旅途、苦修或恶劣自然环境中提供有限身体与精神稳定，帮助施术者保持清醒、节制与方向。
- **Target**：self
- **Range / Context**：自身
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`open`
- **边界**：不消除饥渴、疲劳或伤病事实，只降低其对持续行动的部分干扰。

### DIV-079｜荒野祈所

- **层级**：高阶
- **Invocation Family**：隐修
- **适用实践方向**：`隐修者 / 祭司 / 神谕者`
- **神术类型标签**：`圣所 / 通行 / 仪式`
- **典型 Authority Requirement**：`sanctuary / protection / passage`
- **Channel Load**：中
- **核心效果**：在没有正式神殿的偏远地点建立短期临时祈所，为少量 Invocation、休息与 Audience Request 提供更稳定的 Anchor Context。
- **Target**：small_area
- **Range / Context**：接触 / 仪式
- **Duration**：定时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不自动形成永久 Sanctuary Anchor。

### DIV-080｜契约澄清礼

- **层级**：高阶
- **Invocation Family**：圣契
- **适用实践方向**：`圣契官 / 祭司 / 审判官`
- **神术类型标签**：`誓约 / 仪式 / 信息`
- **典型 Authority Requirement**：`oath / truth / order`
- **Channel Load**：中
- **核心效果**：在所有相关方自愿参与时，对复杂誓约或 Covenant 条款进行神性澄清，使各方更准确理解已经明示的义务、边界与冲突。
- **Target**：covenant / participants
- **Range / Context**：仪式范围
- **Duration**：短暂
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不代替当事人作出承诺，不创造未同意条款，也不把解释权变成强制思想。

### DIV-081｜远裁神枪

- **层级**：大神术
- **Invocation Family**：审判
- **适用实践方向**：`审判官 / 战地祭司`
- **神术类型标签**：`远程 / 攻击 / 破障 / 大神术`
- **典型 Authority Requirement**：`judgment / truth / protection`
- **Channel Load**：重
- **核心效果**：在充分标定、视野或神性追迹条件下凝聚一次长距离高强度神性投射，用于打击关键远程目标、破坏大型可交互防护或迫使强敌改变阵位。
- **Target**：target / barrier
- **Range / Context**：远距 / mark-dependent
- **Duration**：瞬时
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是神罚自动命中；需要真实目标接入、攻击 Resolution 和 Authority 合法性，也不能跨越 Sovereign Boundary。

### DIV-082｜圣武化身

- **层级**：大神术
- **Invocation Family**：圣武
- **适用实践方向**：`圣武士 / 圣骑士`
- **神术类型标签**：`近战 / 自强化 / 防御 / 大神术`
- **典型 Authority Requirement**：`protection / oath / judgment`
- **Channel Load**：重
- **核心效果**：在有限时间内把施术者已经掌握的一组圣武 Invocation 统合为高度稳定的个人战斗通道，使近战、防守、护卫与神性反应之间切换更迅速。
- **Target**：self
- **Range / Context**：自身
- **Duration**：维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不授予未掌握 Invocation，不自动命中，也不覆盖 Health / Martial Outcome；高 Channel Strain 风险持续存在。

### DIV-083｜群星神谕图

- **层级**：大神术
- **Invocation Family**：启示
- **适用实践方向**：`神谕者 / 祭司 / 圣契官`
- **神术类型标签**：`启示 / 信息 / 大神术 / 仪式`
- **典型 Authority Requirement**：`revelation / prophecy / knowledge`
- **Channel Load**：重
- **核心效果**：把多个已获授权的征兆、历史事实、当前观测与神性启示整理为一幅长期因果图，帮助团队理解一个复杂重大问题的可能分支与汇聚点。
- **Target**：major_question / group
- **Range / Context**：Sanctuary / large_ritual
- **Duration**：大型仪式
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不固定未来，不提供神不知道的信息，也不能替参与者做决定。

### DIV-084｜行旅圣域

- **层级**：大神术
- **Invocation Family**：隐修
- **适用实践方向**：`隐修者 / 祭司 / 神医`
- **神术类型标签**：`圣所 / 通行 / 支援 / 大神术`
- **典型 Authority Requirement**：`sanctuary / passage / protection / mercy`
- **Channel Load**：重
- **核心效果**：在长途远征、荒野探索或缺乏正式神殿的环境中建立可随队伍缓慢迁移的临时神性庇护网络，为休息、疗愈、祈祷与有限 Audience Request 提供稳定背景。
- **Target**：traveling_group / route
- **Range / Context**：group / journey
- **Duration**：长期维持
- **Spell ↔ Divine Interaction**：`authority_bound`
- **边界**：不是永久 Sanctuary Anchor，也不能无视补给、地形、天气或世界边界。

# 32. Invocation Library 使用规则

## 32.1 World Pack 可以做什么

World Pack 可以声明：

> 某 Divine Actor 拥有与某 Invocation Requirement 匹配的 Authority。

例如：

```text
God A
→ protection + oath

因此理论上可以授权：
- 庇护祝福
- 誓言见证
- 群体庇护礼
```

但：

> World Pack 不复制 Invocation 机制正文。

## 32.2 Character Card 可以做什么

Character Card 可以声明：

> 某角色开局稳定掌握 DIV-001、DIV-002。

但不能自行改写这些 Invocation 的 Core Effect。

## 32.3 Game State

游戏中可以：

- 新学 Invocation；
- Mastery 提升；
- Authority Scope 改变；
- Covenant 断绝；
- Channel Strain 上升。

均不得回写资产。

---

# 33. 大神术不是神迹

Library 中的：

- 大治愈礼；
- 大神谕；
- 魂归召回；
- 大净礼；
- 群体庇护礼；
- 圣所奠定；
- 觐见门槛；

依然是：

> **凡人 Invocation。**

它们可以极强。

但必须：

- 在 Authorization 内；
- 承担 Channel Load；
- 满足 Ritual / Anchor；
- 接受 Runtime Resolution。

神迹不受凡人“学会”控制。

---

# 34. “虔诚”与力量

虔诚可以是：

- Character Belief；
- Covenant 背景；
- Roleplay Fact；
- 宗教身份；
- 关系证据。

但不能建立：

```text
piety = 95
→ automatic power +30%
```

一个极度虔诚者可以神术平凡。

一个经常与神争论的人，也可能拥有：

> 深厚、真实、稳定的 Covenant。

力量来自：

- Authorization；
- Capability；
- Mastery；
- Anchor；
- Current State；
- Runtime Conditions。

---

# 35. Creator Authorability Summary

## 35.1 Creator Primitives Required

未来 Creator 至少需要能够编辑：

- Divine Actor Reference；
- Covenant Definition；
- Covenant Obligation；
- Authority Scope；
- Invocation Definition；
- Invocation Mastery Bootstrap；
- Channel Strain Definition；
- Anchor Contribution；
- Multi-Covenant；
- Audience Process；
- Sovereign Authority Boundary；
- Divine Interaction Profile；
- Miracle Request / Divine Response Event；
- UI Contribution；
- Dependency / Handoff。

## 35.2 asset-spec vNext Requirements

需要未来正式表达：

- 安全 Divine Actor Reference；
- Authority Tag / Scope；
- Covenant 关系；
- Authorization 与 Mastery 分离；
- Sovereign Boundary；
- Invocation → Audience 转换；
- Cross-System Effect Interaction；
- Divine Actor Autonomous Response；
- Church Office / Covenant 分离；
- Multi-Covenant；
- Anchor Context。

## 35.3 Runtime / UI Host Requirements

Runtime 必须拥有：

- God autonomous adjudication；
- Covenant change Outcome；
- Invocation Resolution；
- Channel Strain Commit；
- Audience Response；
- Miracle Outcome；
- Sovereign Boundary enforcement；
- Save / Restore；
- Knowledge-safe Projection。

UI Host 需要：

- Covenant 状态；
- Authority Scope；
- Learned Invocation；
- Channel Strain；
- Player-known Anchor；
- Audience / Prayer 结果；
- Miracle 记录。

## 35.4 Unresolved Declarative Gaps

当前主要 G9 需求：

1. Divine Actor Reference 与自主响应；
2. Sovereign Authority Boundary；
3. Invocation → Audience 的安全主权转交；
4. Spell ↔ Divine Cross-System Interaction；
5. Anchor Context 的声明式读取。

这些不能通过任意脚本或 Creator 自建 Runtime 解决。

Creator Authorability：

> **PASS WITH G9 REQUIREMENTS / WARN**

---

# 36. 机制测试场景

## TS-DIV-01｜正式授职成功建立 Covenant

教会完成仪式，Divine Actor 接受。

期待：

- 创建 Covenant；
- 获得有限 Authority Scope；
- Church Office 与 Covenant 分别记录。

## TS-DIV-02｜教会单方面授职但神不接受

期待：

- Church Office 可以成立；
- Divine Covenant 不成立；
- 不自动获得 Invocation。

## TS-DIV-03｜被教会革职但神契仍在

期待：

- Church Office 变化；
- Covenant 不自动变化；
- 已授权 Invocation 不自动消失。

## TS-DIV-04｜神主动断契

期待：

- Covenant 正式变化；
- Church Office 不自动被 Runtime 删除；
- 组织政治后果由对应 Owner 处理。

## TS-DIV-05｜虔诚信徒没有授权

角色非常虔诚但无 Covenant。

期待：

- 可以 Prayer；
- 不能凭虔诚自动调用 Invocation。

## TS-DIV-06｜文盲但被神直接选中

角色拥有 Covenant / Authority，但缺少 Invocation Knowledge。

期待：

- 连接真实；
- 仍需学习或神直接教授 Invocation。

## TS-DIV-07｜Multi-Covenant 兼容

两个神契义务兼容。

期待：

- 两条独立存在；
- Authorization 不合并；
- Invocation 分别归属。

## TS-DIV-08｜Multi-Covenant 冲突

两条 Covenant 产生实际义务冲突。

期待：

- 形成真实决策压力；
- 不由系统自动替玩家选神。

## TS-DIV-09｜Channel Strain 过载

连续大神术。

期待：

- Divine Actor 不被解释为“没蓝”；
- 凡人接口出现负荷；
- 可能转交 Health / Soul 后果。

## TS-DIV-10｜Prayer 不获回应

期待：

- Prayer 真实发生；
- 神可以沉默；
- 不自动判定 Covenant 断绝。

## TS-DIV-11｜Audience 条件满足但神拒绝

期待：

- Audience Process 成功建立接触可能；
- Divine Actor 可以拒绝谈判。

## TS-DIV-12｜请求 Miracle

玩家请求神直接拯救城市。

期待：

- 不生成“Miracle Skill Check”；
- 进入 Divine Actor Autonomous Adjudication；
- 可以拒绝、提出代价或直接干预。

## TS-DIV-13｜普通 Countermagic 对 open Invocation

期待：

- 可以进入 Spell ↔ Divine Interaction；
- 不自动成功；
- Covenant / Authorization 不受普通 Dispel 删除。

## TS-DIV-14｜敌法者尝试驱散 Miracle

期待：

- 普通 Countermagic 不拥有默认取消权限；
- Attempt 可以发生；
- 可以确定失败或转入其他正式 Interaction。

## TS-DIV-15｜魂归召回：灵魂尚未跨 Sovereign Boundary

期待：

- 可以进入大神术 Resolution；
- 仍需要身体、生命等合法条件。

## TS-DIV-16｜魂归召回：灵魂已跨 Sovereign Boundary

期待：

- Invocation 不能强行复活；
- 自动转入 Audience / Request；
- 由 Sovereign Divine Actor 决定是否交还。

## TS-DIV-17｜圣所奠定

完成大型仪式。

期待：

- 只产生 Sanctuary Anchor Request；
- 神接受后才正式建立；
- 教会建筑本身不等于神性锚点。

## TS-DIV-18｜玩家自由尝试越权神术

角色尝试调用未授权 Invocation。

期待：

- Attempt 允许；
- Authorization 缺失时正式效果失败或转化为 Prayer / Appeal；
- 不因为 Action 不在列表就拒绝输入。

---

# 37. Regression Cases

## RC-DIV-01｜加入教会自动会神术

错误：

> 成为牧师 → 自动获得神术。

正确：

> Church Office、Covenant、Authorization、Invocation Mastery 分离。

## RC-DIV-02｜Faith Meter

错误：

> 虔诚 80 就能放大神术。

正确：

> Covenant Fact + Authority + Mastery + Anchor + Current State。

## RC-DIV-03｜每次施术神审批

错误：

> 每放一次治疗术都让神决定允不允许。

正确：

> Covenant 已授予的 Authorization 范围内由凡人稳定调用；神不用逐次审批。

## RC-DIV-04｜神是无限电池

错误：

> 只要神无限强，祭司就能无限调用。

正确：

> 凡人受到 Channel Strain、Mastery 与条件限制。

## RC-DIV-05｜教会开除 = 神术关闭

错误：

> 宗教法庭开除某人后直接删除 Covenant。

正确：

> 组织权力和神权分离。

## RC-DIV-06｜神迹作为可学习神术

错误：

> “神迹”成为技能树第四级。

正确：

> Miracle 是 Divine Actor 直接行动。

## RC-DIV-07｜神必须回应 Audience

错误：

> 满足仪式条件就强制召唤神。

正确：

> 条件只建立合法接触路径；神可沉默、拒绝、谈判。

## RC-DIV-08｜普通驱散删除神契

错误：

> 敌法者 Dispel 成功 → 祭司失去神。

正确：

> Countermagic 最多影响 channel / effect；Authorization 由 Covenant Owner 处理。

## RC-DIV-09｜同源 = 换皮 Spell

错误：

> 神术直接复用 Magic Aptitude、Spell Mastery 和 Magic Strain。

正确：

> 独立 Divine Invocation Grammar 与 Channel Strain。

## RC-DIV-10｜Sovereign Authority 被大神术越权

错误：

> 祭司因为足够强就无条件突破死神、命运神或神域主权。

正确：

> 触及 Sovereign Boundary 后必须转入 Audience / Request。

## RC-DIV-11｜多神契合并资源

错误：

> 两个神契给角色双倍 Divine Mana。

正确：

> 每条 Covenant 独立；收益、义务和冲突分别处理。

## RC-DIV-12｜虔诚自动等于力量

错误：

> 更虔诚的人一定神术更强。

正确：

> 虔诚是 Character / Covenant Fact，不是直接战斗数值。

---

# 38. 越界内容与交接建议

| 内容 | 推荐 Owner | 当前最小接口 | 关系 |
|---|---|---|---|
| 实际神明、权柄、神域、教会 | World Pack | Divine Actor / Authority Definition | Provider → Consumer |
| 人物通用能力 | EP-CHAR-CORE | Skill / Capability | Hard Dependency |
| Spell Magic | EP-MAGIC-CORE | Effect Interaction | Parallel Integration |
| Direct Combat | EP-COMBAT-CORE | Range / LOS-Cover / Reaction / Pressure / Martial Outcome / Combat Consequence | Optional Integration |
| 敌法者反神术 | EP-MAGIC-COMBAT | Divine Interaction Profile | Provider → Consumer |
| 教会职位政治晋升 | 政争 / 组织机制 | Church Office | Optional Integration |
| Health / Injury / Recovery | EP-HEALTH-CORE v0.1 | Treatment / Bodily Effect Handoff | Optional Integration |
| Miracle 最终行为 | Divine Actor + Runtime | Formal Outcome | Runtime Owner |
| 死后世界主权 | World Pack | Sovereign Divine Authority | Provider → Consumer |
| 当前 Covenant / Strain | Game State | Instance State | Runtime Owner |

---

# 39. 审核结果

| Gate | 结果 | 说明 | 是否阻塞 |
|---|---|---|---|
| Prior Audit Skill Source | HISTORICAL PASS | v0.2 阶段使用 tavern-asset v0.5.1；当前 v0.2.1 受 tavern-asset v0.5.2 约束 | 否 |
| Discussion / Authorization | PASS | 20 项方向已确认并获正式授权 | 否 |
| 资产职责归属 | PASS | 神、教会、Covenant、Invocation、Miracle Owner 分离 | 否 |
| Scope | PASS | 未吞并 World Pack、组织政治或 Runtime | 否 |
| 语义完整性 | PASS | Covenant / 10 Practice Profile / 84 Invocation / Audience / Miracle 闭合 | 否 |
| World OS Core | PASS | Divine Actor 自主性与玩家代理权受保护 | 否 |
| Open Attempt | PASS | 未授权调用仍允许 Attempt，不保证 Effect | 否 |
| Information Boundary | PASS | 神与 NPC 后台信息不自动泄露 | 否 |
| Definition / Instance | PASS | Covenant / Invocation Definition 与当前 State 分离 | 否 |
| 程序与资产安全 | PASS | Miracle 已增加显式 Authority / Permission Scope；无任意代码、无直接 Commit | 否 |
| 跨资产一致性 | PASS | 与 World / Character / Magic / Combat 边界清晰 | 否 |
| Reusable Expansion | PASS | 不硬编码埃瑟维亚五神 | 否 |
| Creator Authorability | WARN | Sovereign Boundary / Divine Actor Response 等待 G9 正式 Primitive | 否 |
| Obsidian Deliverable | PASS | 独立 `.md` 文件 | 否 |
| Creator 准备度 | PASS WITH FUTURE BINDING | 语义完整，机器绑定待 G9 | 否 |

---

# 39.5 v0.2 内容扩展与审核修订摘要

本版在保持 v0.1 Covenant / Authority / Invocation Core 不变的前提下完成：

- Divine Practice Profile 从 5 个宽泛方向扩展为 10 个可用于 Character Card 的实践方向；
- 明确区分：
  - `Character Execution Style`
  - `Divine Practice Profile`
- 新增战斗神职领域 Skill：
  - `战地神术`
- Invocation Library 从 32 扩展为 **84**；
- 每条 Invocation 新增：
  - 适用实践方向标签；
  - 神术类型标签；
- 新增 Practice Coverage Matrix；
- 大幅补强：
  - 圣骑士；
  - 圣武士；
  - 审判官；
  - 战地祭司；
- 增加远程神术、近战神术、神性 Martial Coupling 语义、战地医疗、远程反制、群体防护、公共祭仪、康复、灵魂与巡礼内容；
- Miracle 增加显式 Permission Scope，关闭“神迹 = GM 权限”的高权限漏洞；
- 接受核心资产总审核 A01–A05 修订要求；
- 本版随核心资产重审通过后进入 `已审核语义稿` 状态。

---

# 40. 当前状态

```text
EP-DIVINE-CORE｜神术与信仰
│
├─ 创作前讨论                    COMPLETE
├─ 用户裁定                      COMPLETE
├─ 用户正式创作授权              COMPLETE
├─ Prior Audited Draft v0.2       PASS / BASELINE
├─ Current Candidate v0.2.1       INTERFACE AUDIT PASS
│
├─ Core Ownership Audit          PASS
├─ Combat Optional Integration   PASS
├─ Health Optional Integration   PASS
├─ Creator Binding               PENDING
└─ asset-spec vNext Binding      PENDING
```

---

# 41. 最终冻结语句

> **神术不是“神每次替凡人施法”，而是神在真实 Covenant 中授予有限 Authority，让凡人在授权范围内稳定调用神性力量。**
>
> **教会不能替神创造、删除或恢复 Covenant；神也不能仅凭神性关系自动改写现实组织职位。**
>
> **Invocation 是凡人调用，Miracle 是神本人行动。**
>
> **大神术依然属于凡人能力；触及 Sovereign Divine Authority 后，凡人必须从“施术”转入“觐见、请求与交易”。**
>
> **神不是资源池，而是拥有自主性、利益、知识边界与拒绝能力的高位 Actor。**
>
> **神职实践可以形成圣骑士、圣武士、审判官、战地祭司、祭司、神医、神谕者、渡魂者、隐修者与圣契官等不同路线，但这些都是开放 Profile，不是职业锁。**

---

# v0.2.1 Combat Core Optional Integration Patch

不改变 Covenant、Authority、Invocation Mastery、Channel Strain、84 个 Invocation Core Effect。只明确：战斗神职在直接战斗中消费 Combat Core；Invocation Range 不是 Combat Position；Combat Outcome 统一归 Combat Core。

当前：`v0.2.1 candidate / INTERFACE RE-AUDIT PASS`。


---

# 44. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 是 Covenant / Divine Authority / Invocation 的通用语义 Owner。

G8 UI 意图：

- 当 Divine / Faith 机制启用时，本 Core **请求拥有一个独立“信仰 / 神术”Extension Surface**；
- Covenant、Authority、Invocation、Anchor、Audience 等可进入受控 View / Section；
- Channel Strain 可贡献 Player Status；
- Divine Audience / Miracle 等临时过程可使用 Narrative Contextual Surface；
- 其他 Divine Theme 只能 contribute，不得重复 owns 该 Surface。

埃瑟维亚五神 / 第五神相关内容只作为 reference consumer / example，不构成通用 Core 依赖。

**通用库独立审核：PASS。**
