---
title: 政治与公共权力核心｜Expansion Pack
aliases:
  - EP-POLITICS-CORE
  - Politics and Public Authority Core
  - 政治核心
  - 公共权力核心
created: 2026-08-19
updated: 2026-08-19
status: audited-current
version: 0.1
asset_type: expansion-pack
asset_family: 通用拓展包资产库
reusability: cross-world
dependency_role: politics-core
hard_dependencies:
  - EP-ORG-CORE
optional_integrations:
  - EP-KINSHIP-CORE
  - EP-REPUTATION-CORE
  - EP-RELATIONSHIP-ROMANCE-CORE
  - EP-CHAR-CORE
  - EP-HEALTH-CORE
creator_binding: pending-g9-03
asset_spec_binding: pending-g9-03
runtime_context_contract: embedded
context_pattern: 通用资产库_RuntimeContextContract模式_v0.5
skill: tavern-asset v0.9
language: zh-CN
tags:
  - Expansion-Pack
  - Generic-Core
  - Politics
  - Public-Authority
  - Regime
  - Recognition
  - Claim
  - Political-Control
  - Jurisdiction
  - 政治
  - 公共权力
  - 政权
  - 通用资产
---

# 政治与公共权力核心｜Expansion Pack v0.1

> [!abstract] 一句话定位
> **`EP-POLITICS-CORE｜政治与公共权力核心` 是跨世界通用的公共政治权力事实唯一归属者：维护政权 / 政治秩序、公共权力及其来源与作用范围、政治主张、政治承认、实际政治控制、政治议题与正式政治立场、政治协议、授权 / 代行以及公共权力结构的成立、转移、分裂、转型和终结。**
>
> 它不把“政治”做成万能势力包：组织、成员、官职与任职仍属于 ORG；家族与谱系属于 Kinship；私人关系属于 Relationship；社会评价属于 Reputation；军事占领属于 War；经济资源属于 Economy；法律资格与程序判断留给未来 Law。

> [!important] 设计核心
> **Politics 维护公共权力结构，而不是维护“谁更像政治人物”的数值。**
>
> 通用核心拒绝万能“忠诚度 / 合法性 / 控制度 / 稳定度”。政治现实优先由明确的权力、主张、承认、控制、议题、协议与来源事实构成；需要摘要时再由这些事实生成可重算的派生结论。

---

# 0. 已确认设计方向

本 v0.1 冻结以下方向：

1. 正式中文名称为 **政治与公共权力核心**；稳定资产 ID 为 `EP-POLITICS-CORE`。
2. Politics 的核心问题是“公共权力怎样被主张、承认、取得、行使、委托、争夺和失去”，不是“所有政治场景中的事实都归 Politics”。
3. `EP-ORG-CORE` 是 Hard Dependency：Organization、Membership、Role、Rank、Role Holding、Internal Authority 不在 Politics 建第二份状态。
4. 政权 / 政治秩序可以成为 Politics 自己拥有的长期世界对象；政府机构、官署、党团、派系组织仍是 ORG 对象。
5. “职位 / 任职”属于 ORG；某职位在某政治秩序下产生的公共政治权力属于 Politics。
6. 公共权力必须能回答：谁拥有、能产生什么正式政治效果、作用于什么范围、从哪里来、是否被委托 / 代行。
7. `政治主张 != 政治承认 != 实际政治控制 != 军事占领 != 管辖权`。
8. Political Recognition 是有方向、有对象、有具体内容的政治事实，不建立全球唯一 Legitimacy Score。
9. 政治控制不是“地图 owner 字段”；同一区域可以同时存在不同主体的主张、承认、局部控制与军事占领。
10. Politics 只保存已经具备政治意义的正式支持 / 反对 / 背书，不保存人物全部私下好恶和心理倾向。
11. 长期、多主体政治争议可以物化为 Political Issue；一次性意见不强制创建议题对象。
12. 政治协议属于 Politics；协议中的具体可履行 Promise / Commitment 由 World OS Commitment 追踪，不复制第二套履约状态。
13. 外交关系的政治语义属于 Politics；参与者为 Organization 时必须复用 / 对齐 ORG 正式组织关系生命周期，不建立互相漂移的第二套成员或组织关系事实。
14. 政治宣言首先产生 Claim；Claim 不自动创建权力、承认、控制或正式政权。
15. 持续、可寻址、会继续影响世界的政权一旦正式成立，必须成为稳定 Game-local 政权对象，不允许 Narrative-only 幽灵政权。
16. 政权具有生命周期；改名不自动等于新政权，终结也不删除历史身份。
17. 公共权力可以委托 / 代行；被授权者代行不等于永久取得权力本身。
18. 摄政优先表达为权力代行安排，而不是另造第二套统治者系统。
19. 继承、选举、政变、革命、废立、禅让、篡位、和平交接共享“公共权力结构变更”底层语义，再由当前世界事实解释具体政治意义。
20. Kinship 只提供谱系事实；Law 未来提供制度资格 / 法律程序；ORG 提供职位与任职；Politics 拥有政治主张、承认与公共权力实际转移结果。
21. 政权 / Politics 只修改自己的政治事实；组织、战争、经济、关系、名望等后果通过正式 Event / Handoff 交给对应 Owner。
22. Politics 允许政治秩序本身演化，例如君主制转共和、中央集权转联邦、建立摄政或自治安排；具体法律条文和程序留给 Law。
23. 不建立通用合法性、稳定度、控制度、忠诚度等万能数值；若世界需要摘要指标，只能作为可重算 Projection。
24. Politics 定义政治事实、政治候选和政治变化语义，不拥有统一“政治成功率公式”；Formal Outcome、RNG、Atomic Commit 归 Program / Runtime。
25. 真实政治状态、公开政治状态、玩家已知政治状态必须分离；秘密政治安排不得因模型上下文或 UI 自动泄漏。
26. Political Claim 必须已经产生政治意义；人物仅仅“想称帝 / 想上台”的私人愿望仍属于 Character / Narrative intention。
27. Politics 保存当前状态和必要来源引用，不复制完整世界 Event History。
28. 大型政治关系图由 Program 先选择当前问题需要的政治子图，再向模型提供 player-safe、owner-preserving 的有界上下文。
29. 确定性的授权到期、协议期限、已知结构查询等后台变化不自动调用模型。
30. Generic Politics 不冻结“势力 / 政务”等特定世界一级 UI；只声明可贡献的政治信息语义与交互意图。

---

# 1. 职责边界

## 1.1 本 Core 唯一回答的问题

> **“当前世界中有哪些持续存在的政治秩序；谁基于什么来源拥有哪种公共权力、作用于哪些对象 / 地域 / 事项；谁提出了哪些政治主张；哪些政治主体承认什么；谁实际控制哪些政治范围；哪些政治议题、协议与权力转移正在成立或变化？”**

## 1.2 本 Core 负责

- Regime / Political Order 的长期身份与生命周期；
- 政权名称、历史名称、成立 / 转型 / 分裂 / 终结来源；
- Public Authority；
- Authority Source / Grant / Delegation；
- Jurisdiction / Scope；
- Political Claim；
- Political Recognition；
- Political Control；
- Territorial / Status / Succession / Representation Claim 的政治主张语义；
- Political Issue；
- 针对明确政治对象 / 议题的正式支持、反对、背书、中立或条件立场；
- Political Agreement / domain-specific diplomatic relation；
- 政治授权、委托、代行、撤销与摄政安排；
- 公共权力结构变更；
- 政权形成、连续、改名、转型、分裂、被取代与终结；
- political player-safe projection；
- Politics 与 ORG / Kinship / Reputation / Relationship / Commitment / Economy / War / Law 的 typed handoff 语义。

## 1.3 本 Core 明确不负责

- Organization Definition / Membership / Formal Affiliation / Role / Rank / Role Holding / Internal Authority；
- 普通组织领导结构与部门结构；
- Character Personality / Desire / Value / Capability State；
- Sentiment / Trust / Respect / Attachment / Romantic Attraction；
- Marriage Bond；
- Family / Lineage / Parentage / Adoption / Genealogy Truth；
- Public Social Reputation / 群体评价；
- 普通传闻、全局知识与每个角色知道什么的完整知识图；
- Treasury / Tax Outcome / Market / Production / Population / Resource；
- Formation / Campaign / Battle / Military Occupation；
- Health / Injury / Incapacitation truth；
- 法律条文、程序合法性、法定继承资格、司法裁决；
- Promise / Commitment 的 pending / fulfilled / broken lifecycle；
- RNG / Dice / Program Judge / Formal Outcome / Atomic Commit / Save / Restore authority；
- G9-03 尚未冻结的 final machine schema、Compiler、Creator machine fields、任意查询 DSL。

---

# 2. Ownership Map｜唯一事实源

| 概念 | 唯一 Owner | Politics 如何使用 |
|---|---|---|
| Organization / Membership / Role / Office Holding | EP-ORG-CORE | Hard Provider；读取组织与任职事实 |
| Internal Authority | EP-ORG-CORE | 不等于 Public Political Authority |
| Family / Kinship / Genealogy | EP-KINSHIP-CORE | Optional Provider；继承 / 王室主张所需谱系切片 |
| Private Relationship / Marriage | EP-RELATIONSHIP-ROMANCE-CORE | Optional Provider / Event Handoff |
| Public Social Reputation | EP-REPUTATION-CORE | Optional Provider；不等于正式政治承认 |
| Character Capability | EP-CHAR-CORE | Optional Provider；能力不强制政治结果 |
| Bodily Availability | EP-HEALTH-CORE | Optional Provider；可触发履职 / 摄政压力 |
| Regime / Political Order | EP-POLITICS-CORE | 正式职责 |
| Public Authority / Jurisdiction | EP-POLITICS-CORE | 正式职责 |
| Political Claim | EP-POLITICS-CORE | 正式职责 |
| Political Recognition | EP-POLITICS-CORE | 正式职责 |
| Political Control | EP-POLITICS-CORE | 正式职责 |
| Political Issue / Formal Political Stance | EP-POLITICS-CORE | 正式职责 |
| Political Agreement | EP-POLITICS-CORE | 正式职责；具体 Promise 外交接 |
| Explicit Promise / Commitment | World OS / Runtime Commitment | Politics 只引用履约结果 |
| Military Occupation | future EP-WAR-CORE | Politics 可读取，不直接复制 |
| Economy / Treasury / Tax Outcome | future EP-ECONOMY-CORE | Politics 可发政策 / 权力 Handoff |
| Legal Eligibility / Procedure | future Law | Politics 读取制度判断，不成为第二 Law Owner |
| Formal Outcome / Commit | Runtime / World OS | 执行权威 |

---

# 3. 政权 / 政治秩序 vs 政府组织

## 3.1 政权是 Politics 对象

当一个公共统治秩序需要跨回合、跨地点持续存在时，可以建立 Regime / Political Order，例如：

- 王国 / 帝国当前统治秩序；
- 共和国政府所代表的公共政治秩序；
- 城邦政权；
- 革命政府；
- 神权统治秩序；
- 地方自治政权；
- 双重政权中的一个持续政治秩序。

政权对象是政治事实锚点，不是国家全部数据的容器。

## 3.2 政府机构是 ORG 对象

```text
政治秩序 / 政权
→ Politics

中央政府 / 官署 / 议会 / 政党 / 州府 / 委员会
→ ORG
```

一个政权可以关联多个政府组织；组织解散不自动等于政权终结，政权更替也可能暂时沿用旧组织。

## 3.3 Political Faction 不再成为第二 Organization

Generic Politics 不创建带 Membership / Role / Rank 的第二“政治势力实体”。

若“某派系 / 党团 / 军阀集团”具有成员、领导、内部职位：

> 它首先是 ORG。

Politics 只记录这个 Organization 对公共权力、政权、议题、主张和承认的政治关系。

---

# 4. 公共权力模型

## 4.1 公共权力不是人物数值

禁止：

```text
authority = 82
political_power = 95
```

公共权力至少需要回答：

```text
谁拥有 / 代行
+ 能让什么政治效果正式成立
+ 对哪些对象 / 地域 / 事项有效
+ 权力来源是什么
+ 当前是否仍有效
```

## 4.2 权力来源

权力来源可以引用：

- ORG Role / Office Holding；
- 当前 Political Order 的正式结构；
- 已提交的政治授权 / 委托；
- 正式公共决议；
- 经承认的权力转移结果；
- 当前世界其它已确认来源。

“很有威望”“军队很强”“大家都怕他”不能自动成为公共 Authority。

## 4.3 Internal Authority != Public Authority

ORG 的 Internal Authority 回答组织内部正式权限。

Politics 的 Public Authority 回答公共政治秩序中能让什么政治效果正式成立。

同一人物可以在一个组织内部权力很高，但没有相应国家公共权力；反之亦可。

---

# 5. 管辖与作用范围

Jurisdiction / Scope 不只表示地图。

至少允许按以下维度限定：

- 地域；
- 对象；
- 事项 / 权力种类；
- 组织 / 政权边界；
- 时间；
- 条件。

例如：

> 某州官员可以在本州范围内任命某类地方职位。

不自动意味着他能：征税、宣战、改国号或任命其它州职位。

---

# 6. Claim / Recognition / Control / Occupation 分层

## 6.1 Political Claim｜政治主张

Claim 是已经产生政治意义的正式 / 有效政治表达，例如：

- 对统治身份的主张；
- 对继承的主张；
- 对某公共职位 / 身份的主张；
- 对地域的政治主张；
- 对政权连续性的主张；
- 独立 / 建国 / 称帝 / 改制主张。

Claim 可以公开，也可以在有限政治参与者之间秘密传播。

```text
私人野心
!= Political Claim
```

## 6.2 Political Recognition｜政治承认

承认必须明确：

```text
谁承认
→ 谁 / 什么政治对象
→ 承认哪一项政治状态或主张
```

允许单向、条件性、局部、公开或秘密。

禁止把所有主体的承认压成：

> `legitimacy = 73`

## 6.3 Political Control｜实际政治控制

Political Control 表示某政治主体当前能在指定范围内维持公共统治、行政决策或政治秩序的事实。

它不等于：

- Territorial Claim；
- Recognition；
- Office Jurisdiction；
- Military Occupation。

## 6.4 Military Occupation｜军事占领

军事占领属于 War。

```text
War: Military Occupation
↓ possible handoff
Politics: Political takeover / control candidate
```

占领一个城市不会自动使当地政治控制、行政系统、承认关系全部改写。

---

# 7. 政治议题与正式政治立场

## 7.1 Political Issue｜政治议题

只有当一个政治命题需要长期、多主体、多轮追踪时，才创建稳定议题，例如：

- 是否承认某人为新君；
- 是否加入某政治联盟；
- 是否支持独立；
- 是否接受某次制度改革。

普通一次性表达不强制创建 Issue。

## 7.2 Formal Political Stance｜正式政治立场

Politics 可以保存某政治主体 / 被授权代表针对明确 Issue / Claim / Regime 的：

- 支持；
- 反对；
- 背书；
- 拒绝承认；
- 条件性支持；
- 正式中立 / 未表态（仅在确有政治意义时）。

它不回答“这个人私人喜欢谁”。

## 7.3 不建立 Loyalty Score

一个人物可以：

```text
Relationship：私人信任很高
Politics：公开反对对方称帝
```

也可以私人关系恶劣但出于利益正式支持同一政治主张。

---

# 8. Political Agreement 与 Commitment

## 8.1 Politics owns Political Agreement

Politics 可以表达：

- 政治联盟；
- 相互承认；
- 臣属 / 宗主政治安排；
- 不干涉；
- 停止政治敌对；
- 联合政治目标；
- 外交关系正常化；
- 其它持续政治协议。

## 8.2 Promise lifecycle 不归 Politics

如果协议包含：

> 三个月后提供粮食；遭受攻击时派兵；按期释放某人。

具体承诺进入 Commitment。

```text
Political Agreement established
+
Explicit Promise extracted
→ Commitment
```

Politics 之后只消费履行 / 违背 Event，决定协议是否因此变化。

## 8.3 与 ORG 正式关系骨架

参与方为 Organization 时，Politics 必须复用 / 对齐 ORG 的正式组织关系生命周期骨架；Politics 只拥有政治领域语义，不复制 Organization identity、Membership 或第二套互相漂移的关系生命周期。

若参与方包含 Regime 等 Politics-owned 对象，则 Politics 可以拥有其政治关系实例，但仍只引用参与 Organization 的稳定 ORG ref。

---

# 9. 授权、委托与摄政

## 9.1 Delegation｜授权 / 委托

公共权力允许在明确范围内被授权代行。

语义上至少需要：

- 原权力来源；
- 授权者；
- 被授权者；
- 被代行的权力内容；
- 地域 / 对象 / 事项范围；
- 有效时间 / 条件；
- 是否可撤销；
- 是否允许再授权（若世界规则支持）。

## 9.2 委托 != 永久转移

被授权者代行某项权力，不意味着原权力持有人自动失去它，也不意味着被授权者获得永久政治身份。

## 9.3 Regency｜摄政

摄政优先表达为一组受政治秩序承认的权力代行安排：

```text
原统治身份保持
+
摄政者代行指定公共权力
```

允许完全摄政、部分摄政、多人 / 委员会摄政、名义摄政、争议摄政与越权。

---

# 10. 公共权力结构变更

继承、选举、政变、革命、废立、禅让、篡位、和平交接等共享：

```text
现有政治权力结构
↓
Attempt / Claim / Process
↓
相关 ORG / Kinship / Recognition / Control / Agreement / War facts
↓
Formal Political Outcome
↓
Public Authority structure change
↓
Typed handoffs to other Owners
```

## 10.1 Succession｜继承

```text
Kinship → 谱系事实
ORG → 职位 / 任职 / 空缺
Law future → 法定资格 / 程序
Politics → 继承主张、支持 / 反对、承认与公共权力最终转移
```

指定继承人不等于自动继承成功。

## 10.2 Coup / Revolution / Deposition

政变、革命、废立等不是四套独立数据库。

它们根据实际改变的是：

- 某个统治者；
- 某项公共权力；
- 整个政治秩序；
- 政府组织；
- 控制与承认关系；

再由世界语义解释其名称和后果。

---

# 11. 政权生命周期

政权可以经历：

```text
形成
→ 延续
→ 改名 / 改制
→ 分裂 / 合并安排 / 转型
→ 被取代
→ 终结
```

## 11.1 Rename != New Regime

仅改名称、国号或对外称呼不自动创建新政治身份。

## 11.2 Revolution != Database Rename

如果公共权力秩序、权力来源和政治连续性实质断裂，可以建立新的 Regime Identity，并保留与旧政权的历史来源关系。

## 11.3 Ended Regime 不删除

政权终结后仍保留历史身份，供旧官职、旧承认、历史事件和政治来源引用。

---

# 12. 政治秩序改革

Politics 允许政治秩序本身发生长期变化，例如：

- 君主制 → 共和国；
- 中央集权 → 联邦 / 地方自治；
- 单人统治 → 议会制；
- 建立 / 取消摄政；
- 权力在多个公共机构间重新分配。

Politics 负责当前公共权力结构变化；未来 Law 负责详细法律条文、程序合法性与法定规则。

---

# 13. Open Attempt｜开放政治尝试

身份、Role、Authority、Recognition、Control 都不能成为玩家自然语言输入白名单。

玩家仍可尝试：

- 自称统治者；
- 宣布独立；
- 伪造诏令；
- 冒名代表；
- 越权任命；
- 策反；
- 政治勒索；
- 私下拉拢；
- 拒绝承认；
- 提出联盟 / 臣属 / 改制条件；
- 试图发动政变或革命。

无权只意味着对应“正式公共效果”不能自动成立，不意味着 Attempt 不存在。

---

# 14. 政治裁定链

```text
Player / NPC Political Attempt
↓
Semantic interpretation
↓
当前政治对象 / Issue / Claim / Authority candidate
↓
Program structural validation
↓
JIT bounded owner projections
↓
必要开放式政治语义 / NPC choice
↓
Program Formal Outcome
↓
Atomic political commit
↓
Event / Handoff
↓
player-safe realization
```

Politics 不定义万能成功率公式。

以下通常可确定处理：

- 明确没有 Authority 却要求合法命令自动成立；
- 已到期的授权；
- 已成立的确定性协议状态读取；
- 确定的 Recognition / Claim / Control 图查询。

只有真正存在不确定、开放式角色决策或需要语义解释时才使用模型 / Program Resolution。

---

# 15. 信息边界

必须区分：

```text
Authoritative Political Truth
!= Public Political State
!= Player-known Political State
```

例如：

```text
真实：A 已秘密支持政变
公开：A 宣布中立
玩家知识：只知道公开中立
```

Politics 可以保存秘密政治事实及公开程度，但不承担“每个角色知道哪些事实”的完整知识系统。

秘密主张、秘密外交、隐蔽授权、私下政治交易不能因 Router / Context / UI 自动泄漏。

---

# 16. 政治对象物化

## 16.1 Claim 可以先于 Regime

口号、宣言、建国提案首先可以只是 Claim。

## 16.2 Durable Regime 必须有稳定引用

当一个政治秩序已经成为：

- 持续存在；
- 可被承认 / 反对；
- 可控制地区；
- 有组织基础；
- 会在后续剧情继续被引用；

则必须 materialize 为稳定 Game-local Regime，不允许只存在于 Narrative 文本。

## 16.3 政权对象保持轻量

Regime 只作为政治事实锚点，不吞：

- 全部官员；
- 全部军队；
- 全部财政；
- 全部人口；
- 全部法律；
- 全部人物关系。

这些继续由各自 Owner 持有。

---

# 17. Character Capability Integration｜可选人物能力接口

Politics 可以向 Character Skill Registry 贡献通用政治领域能力定义，例如：

- 外交；
- 辩说 / 公共论证；
- 政局判断 / 政治分析；
- 公共制度理解（不吞未来法律专业能力）。

`EP-CHAR-CORE` 继续拥有人物 Skill mastery。

高能力不允许：

- 强迫 NPC 背叛；
- 强迫政权投降；
- 越过不存在的 Authority；
- 创造不存在的资源；
- 自动取得政治承认。

---

# 18. Cross-domain Handoff｜跨域交接

## 18.1 Politics ↔ ORG

ORG → Politics：Organization identity、Role Holding、Rank、Internal Authority、formal organization relation skeleton。

Politics → ORG：公共政治结果成立后可能产生任命 / 撤职 / 政府组织变更 candidate。

Politics 不直接写 Role Holding。

## 18.2 Politics ↔ Kinship

Kinship → Politics：当前政治问题所需的 bounded genealogy / lineage facts。

Politics → Kinship：通常只产生政治后果，不改写亲缘真相。

## 18.3 Politics ↔ Relationship

Relationship → Politics：Marriage Bond、必要人际背景。

Politics → Relationship：背书、背叛、任命、政治冲突等正式 Event 可成为 Relationship Memory 来源。

## 18.4 Politics ↔ Reputation

Reputation → Politics：相关社会评价 / 群体态度，仅作输入。

Politics → Reputation：公开称帝、背书、政变、失政等 Event 可以引发社会评价变化。

`Public Reputation != Political Recognition`。

## 18.5 Politics ↔ Commitment

Political Agreement 中的具体 Promise → Commitment。

Commitment fulfilled / broken → Politics 决定 Agreement / Relation 后果。

## 18.6 Politics ↔ Economy / War

Politics → Economy：政策、征收权限、公共决策 Handoff；Economy 决定实际资源与经济结果。

Politics → War：战争目标、外交政治状态、指挥政治来源；War 决定 Formation / Campaign / Military Occupation。

War → Politics：军事占领、投降、战役结果形成 Political Control / Recognition / Agreement candidate。

---

# 19. Runtime Context Contract｜内建 v0.5

## 19.1 Routing Profile

```text
ID: EP-POLITICS-CORE
Name: 政治与公共权力核心
Scope: 政权、公共权力、政治主张、承认、控制、政治议题、政治协议、授权与公共权力结构变更
Typical semantics: 称帝 / 建国 / 承认 / 不承认 / 控制地区 / 公共授权 / 摄政 / 继承争议 / 政变 / 外交政治协议 / 政治支持反对
```

## 19.2 Immediate Activation

玩家当前直接处理政权、公共权力、承认、主张、控制、政治议题、政治协议、授权 / 代行或政治权力转移时激活。

普通组织任职、私人关系、普通战斗、普通经济行为不会因为“可能有政治后果”就提前激活完整 Politics。

## 19.3 State-mandatory Activation

若 Runtime 已存在当前正在完成的政治授权、政权转移、政治协议建立 / 终止、政治控制接管等 active operation，Program 可根据 authoritative state 补入 Politics。

## 19.4 Downstream Activation

```text
Political Formal Outcome / Event
→ typed handoff
→ ORG / Relationship / Reputation / Economy / War / Commitment 等按结果激活
```

不提前加载所有可能下游。

## 19.5 No-load Conditions

通常不加载 Politics 详细上下文：

- 与公共权力无关的私人闲聊；
- 普通移动 / 观察；
- 普通战斗；
- 普通角色关系互动；
- 只需一个确定性政治 Fact 的其它 Domain；
- 仅仅因为本局安装 Politics。

## 19.6 Minimal Read Set

按当前问题只读取：

- 当前政治主体 / Regime；
- 相关 ORG Role / Organization projection；
- 直接相关 Authority / source / scope；
- 当前 Claim / Recognition / Control / Issue / Agreement；
- 必要的 player-safe 来源摘要；
- 只有当前问题需要时才读取 Kinship / Reputation / Relationship / Economy / War 的 bounded projection。

禁止默认加载全国全部政权、全部官职、全部承认网络、完整外交史或世界事件历史。

## 19.7 Model-needed Semantics

模型主要用于：

- 理解开放式政治意图；
- 解析谈判 / 主张 / 支持 / 反对 / 冒充 / 策反等自然语言；
- 解释争议政治语义；
- NPC 开放式政治选择；
- 生成结构化 Candidate / clarification need。

## 19.8 Program-owned Logic

Program 负责：

- stable ref；
- enabled module / identity validation；
- current canonical political state；
- 确定性 Authority / scope existence；
- 确定性图查询；
- authorization expiry / deterministic lifecycle；
- Formal Outcome；
- Atomic Commit；
- Save / Restore / Branch / Recovery。

## 19.9 Output Candidate

模型最多提出：

- political intent；
- Claim candidate；
- Recognition candidate；
- Political Stance candidate；
- Agreement / delegation / transition candidate；
- clarification / ambiguity。

不能直接写正式政治状态。

## 19.10 Handoff / Information Boundary

每次跨 Owner 只传当前结果所需的 bounded typed payload / refs。秘密 Politics truth 不自动进入其它 Owner 的 Model Context。

## 19.11 Context Cost / Bounded Strategy

大型政治世界采用：

```text
Whole Political Graph
→ current target / question
→ Program deterministic relevant subgraph selection
→ player-safe bounded political slice
→ Model if semantic explanation is needed
```

政治对象、历史与关系数量增长不能让普通 Turn 上下文线性增长。

## 19.12 Feature / Module Activation Hierarchy

未来 Package / Feature / Module 具体机器划分等待 G9-03；语义上关闭的政治能力不进入 Router Directory，也不产生条件依赖。

## 19.13 Background Program Progression

授权到期、确定性协议期限、已知状态的时间推进等可以 Program-only：

```text
Background deterministic political progression
!= Model Activation
```

## 19.14 Definition Registry / Library Projection

Politics 不假定需要大型固定 Definition Registry。若某世界提供政体 / 权力定义库，也只能检索当前政治秩序需要的 Definition，不全量 Prompt。

## 19.15 Bounded Sufficiency / Anti-Starvation

有界不等于删掉决定政治语义的关键事实。当前授权问题至少要包含：主体身份、来源、权力内容、作用范围、当前有效状态和目标。

## 19.16 Narrative Affordance / Runtime Referent

具体政权、政治议题、协议、持续 Claim 一旦被呈现为可持续交互 / 查询对象，必须解析到 stable Game-local referent。Generic “某势力 / 某政权”占位符不能长期冒充正式政治对象。

## 19.17 Cross-Owner Projection Join

例如继承争议：

```text
current succession question
→ ORG current office / vacancy projection
+ Kinship relevant lineage path
+ Politics current claims / recognition / authority
(+ Reputation only if public evaluation matters)
→ owner-preserving bounded join
```

不能把 ORG / Kinship / Reputation 全量状态递归展开。

## 19.18 Outcome-Gated Continuation Activation

例如：

```text
外交提案
→ 当前 Politics negotiation
→ Agreement NOT established
   → 不激活承诺履行 / War / Economy continuation
→ Agreement established
   → 提取 explicit Commitment
   → 后续 Economy / War 只在具体承诺或结果真正需要时激活
```

同理，军事占领只有产生正式政治接管 candidate 时才进入 Political Control continuation。

---

# 20. 大型政治图查询策略

Politics 是继 Kinship 之后第二个明确的大型关系图领域。

长期保存规范政治事实：

- Regime；
- Authority 与来源；
- Claim；
- Recognition；
- Control；
- Issue / Stance；
- Agreement；
- Delegation；
- lifecycle refs。

不为所有可能的“谁更合法 / 谁的综合势力更强 / 谁对谁忠诚”生成成对持久状态。

典型查询：

```text
“谁实际控制洛阳？”
→ 洛阳 + 直接 Control / Claim / Occupation refs

“谁能代表这个政权谈判？”
→ Regime + relevant ORG roles + delegation / authority

“哪些政治主体承认新君？”
→ target political status + direct Recognition edges

“谁更可能在继承争议中获胜？”
→ 先取 relevant claims / recognition / control / bounded Kinship / ORG facts
→ 再进行开放式政治语义判断
```

---

# 21. 派生指标与 UI

## 21.1 派生指标

允许世界 / Product 根据 canonical facts 生成：

- “政治局势稳定 / 动荡”；
- “承认范围广 / 窄”；
- “控制存在争议”；
- 其它摘要。

这些必须可重算、不可反写 Canonical Political Truth。

## 21.2 UI Contribution

Generic Politics 不拥有固定中文一级 Surface 名称。

可以语义贡献：

- 已知政权；
- 玩家当前公共政治身份 / 授权；
- 公开 Claim / Recognition；
- 当前重要 Political Issue；
- player-known Political Control；
- 地图上的 Claim / Control overlay intent；
- 当前可执行政治 Action Intent。

具体叫“政治 / 势力 / 政务 / 国家 / 阵营”由 Product / World composition 决定。

---

# 22. 初始化、保存与恢复

T0 / World composition 可以建立 Game-local：

- Regime；
- Authority / scope；
- Claim；
- Recognition；
- Political Control；
- Political Issue / Stance；
- Agreement；
- delegation / regency；
- source refs。

不得复制 ORG Role Holding、Kinship truth、Relationship truth、Economy / War state。

Save / Restore / Branch / Recovery 必须恢复政治 canonical state 与 revision / refs；Restore 不重新调用模型决定谁是统治者，也不让现实历史覆盖旧 Save。

---

# 23. 标准回归场景

## T-POL-GEN-01｜职位与公共权力分离

某人担任地方官职。

期望：Role Holding → ORG；公共政治权限 → Politics；不存在第二 Office Holding。

## T-POL-GEN-02｜内部权限 != 公共权力

某组织首领内部权限极高，但无国家公共授权。

期望：ORG authority 不自动产生 Politics authority。

## T-POL-GEN-03｜越权任命

无公共权力者宣布任命高级官员。

期望：Attempt 成立；正式效果不自动成立；可形成 Claim / fraud / political event。

## T-POL-GEN-04｜Claim != Recognition

地方人物公开称帝。

期望：Claim 成立；无人自动承认；不自动扩大 Control。

## T-POL-GEN-05｜Recognition 方向性

A 承认 X，B 不承认 X。

期望：两条状态并存，不产生单一 legitimacy score。

## T-POL-GEN-06｜Claim != Control

A 声称拥有地区 R，B 实际控制 R。

期望：两种事实并存。

## T-POL-GEN-07｜Occupation != Control

War 占领城市。

期望：Military Occupation 不自动写 Political Control。

## T-POL-GEN-08｜私人关系 != 政治立场

A 私人高度信任 B，但公开反对 B 的政治主张。

期望：Relationship 与 Politics 各自成立。

## T-POL-GEN-09｜Public Reputation != Recognition

民众高度支持某人，但政治机构不承认其统治身份。

期望：Reputation 与 Politics 不互相覆盖。

## T-POL-GEN-10｜Kinship != Succession Outcome

某人是最近血亲。

期望：Kinship 提供谱系；Politics 不因血缘自动转移公共权力。

## T-POL-GEN-11｜Agreement + Commitment

政治联盟包含未来出兵承诺。

期望：Alliance / Agreement → Politics；Promise → Commitment。

## T-POL-GEN-12｜授权代行

统治者授权使者谈判。

期望：使者获得限定代行权；原权力不被永久转移。

## T-POL-GEN-13｜摄政

统治者失能，摄政者被正式授权代行部分权力。

期望：原统治身份保留；delegation / regency 成立。

## T-POL-GEN-14｜政变

一方控制核心政府组织，但外部政治主体尚未承认。

期望：ORG / Control / Recognition 分层；不一步写成全球新政权事实。

## T-POL-GEN-15｜政权改名

政权只改变国号。

期望：stable Regime Identity 保持。

## T-POL-GEN-16｜革命建新政权

旧政治秩序断裂，新秩序形成持续政治主体。

期望：新 Regime materialize；旧 Regime 历史身份保留。

## T-POL-GEN-17｜秘密政治支持

A 私下加入政变支持。

期望：authoritative state 可存在；玩家无来源时不泄漏。

## T-POL-GEN-18｜Political Issue

多方持续争论是否承认新君。

期望：可创建 durable Issue；各方 Stance 指向该 Issue，而不是人物 pairwise loyalty。

## T-POL-GEN-19｜Large Political Graph

20 Regime、80 Organization、500 political actors、1000 Recognition / Claim / Control / Issue edges。

玩家只问某城控制权。

期望：只读取该 Place 及直接相关政治子图；普通 Prompt 不展开世界政治全图。

## T-POL-GEN-20｜Cross-owner succession join

继承争议需要 ORG + Kinship + Politics。

期望：只读取当前职位 / 空缺、必要谱系路径、当前 Claim / Recognition；不存在全 ORG / 全家谱 / 全 Reputation 展开。

## T-POL-GEN-21｜Outcome-gated diplomacy

联盟谈判失败。

期望：不提前激活后续出兵 / 运粮履约链。

## T-POL-GEN-22｜Deterministic expiry

授权到期。

期望：Program 更新状态，不需要模型调用。

## T-POL-GEN-23｜Unknown political object

玩家提出建立“自由共和国”。

期望：先形成 Claim；未正式成立前不生成虚假的 durable Regime。

## T-POL-GEN-24｜Durable regime materialization

新政治秩序已持续控制地区并被多方持续引用。

期望：stable Game-local Regime 存在，Narrative 不使用无引用幽灵政权。

---

# 24. Future Explosion Review

必须证明：

```text
Regime count 5 → 50
Organization count 20 → 200
Political actors 100 → 2000
Political graph edges 200 → 5000
Session history ↑↑↑

ordinary unrelated Turn context ≈ stable
local political query context ≈ bounded by current subgraph
```

禁止通过：

- 全世界政治状态常驻 Prompt；
- pairwise loyalty matrix；
- 单一 legitimacy / control score；
- 递归加载 ORG / Kinship / Reputation 全状态；
- 把所有潜在 War / Economy 后果提前加入 Context；

来模拟政治复杂度。

---

# 25. G9 / Creator / asset-spec Boundary

当前 G9 已证明 Source → Game-local revision 与 Built-in Domain Module Host / JIT Projection shared foundation；Politics 可以按这些能力设计语义合同。

但 G9-03 仍未授权，因此本 v0.1 不冻结：

- final JSON 字段；
- Regime / Authority / Claim / Recognition machine shape；
- Router API；
- query DSL；
- Compiler；
- Creator machine controls；
- 固定 token budget；
- 固定 UI Surface ID。

---

# 26. 回归禁区

不得：

- 创建第二套 Organization / Faction Membership；
- 在 Politics 保存 Office Holding；
- 用姓氏 / 家系直接推出政治权力；
- 建立万能 loyalty / legitimacy / stability / control score；
- 把 Public Reputation 当 Political Recognition；
- 把 Claim 当 Recognition 或 Control；
- 把 Military Occupation 当 Political Control；
- 把 delegated authority 当永久权力转移；
- 把摄政做成第二统治者数据库；
- 让高政治技能强迫 NPC 或政权接受不可能条件；
- 复制 Commitment lifecycle；
- 让秘密政治事实自动出现在玩家 Context；
- 把完整世界政治图放进模型；
- 让 Politics 直接修改 ORG / Kinship / Economy / War / Relationship canonical state；
- 在 G9-03 前发明 final machine schema。

---

# 27. 当前状态

```text
EP-POLITICS-CORE｜政治与公共权力核心 v0.1
├─ Scope / Product Discussion               COMPLETE
├─ Canonical Ownership                      FROZEN
├─ Regime vs ORG Boundary                   FROZEN
├─ Authority / Scope Model                  FROZEN
├─ Claim / Recognition / Control            FROZEN
├─ Issue / Stance / Agreement               FROZEN
├─ Delegation / Regency                     FROZEN
├─ Political Transition                     FROZEN
├─ Information Boundary                     FROZEN
├─ Large Political Graph Strategy           FROZEN
├─ Runtime Context Contract                 EMBEDDED
├─ Semantic Asset Audit                     PASS
├─ Boundary Cluster Audit                   PASS
├─ Han Migration                            PLANNED / NOT YET EXECUTED
├─ Creator Binding                          PENDING G9-03
└─ asset-spec Machine Binding               PENDING G9-03
```

> **政治与公共权力核心保存“公共权力为什么成立、谁承认什么、谁实际控制什么”，而不是把组织、家族、军队、财政、社会评价和私人忠诚重新塞进一个‘势力系统’。**
