---
title: 名望与社会评价核心｜Expansion Pack
aliases:
  - EP-REPUTATION-CORE
  - Reputation Core
  - 名望核心
version: 0.1
status: audited-current
created: 2026-08-18
updated: 2026-08-18
asset_type: expansion-pack
asset_family: 通用拓展包资产库
reusability: cross-world
dependency_role: reputation-core
hard_dependencies: []
optional_integrations:
  - EP-ORG-CORE
  - EP-RELATIONSHIP-ROMANCE-CORE
  - EP-CHAR-CORE
  - future EP-POLITICS-CORE
  - future Law / Enforcement
creator_binding: pending-g9
asset_spec_binding: pending-g9
skill: tavern-asset v0.8.0
reference_implementation:
  - runtime-context-contract-v0.1
---

# 名望与社会评价核心｜Expansion Pack v0.1

> [!abstract] 一句话定位
> **`EP-REPUTATION-CORE｜名望与社会评价核心` 是跨世界通用的公共社会评价事实 Owner：维护某个 Target 在某个 Audience / Social Scope 中，因为哪些可追溯来源而被怎样公开看待，以及这种评价的传播、显著性、争议、时效与社会名号。**
>
> 本 Core 不使用单一“声望值”，不把 Reputation 当世界真相，不把群体评价等同于个人关系，也不因为资产被启用就让全部 Reputation State 常驻模型上下文。

---

# 0. Discussion Contract｜已确认方向

本版本冻结以下方向：

1. Reputation 是“公共社会评价事实”，不是统一积分 / Fame Score；
2. v0.1 正式验证 Target：Character + Organization；Place / Item 只保留轻量兼容位；
3. Audience 是一等语义；不存在脱离 Audience 的唯一社会形象；
4. 单个具体人的评价默认属于 Relationship，不作为 Reputation Audience；
5. Evaluation 可以多维、矛盾、并存；不预设统一善恶 / 威望 / 恐惧四轴；
6. Runtime 可使用隐藏量化维持传播和长期演化，但不冻结数值范围，不产生单一 Reputation Score；
7. Reputation Claim / Evaluation != Authoritative World Truth；虚假、误传、宣传、争议内容可以形成真实的 Reputation State；
8. Reputation 不拥有具体 Character Knowledge；群体层社会传播 != 某个角色已知；
9. Social Epithet / Informal Public Title 归 Reputation；正式职位 / 爵位 / 官号仍归 ORG / Politics；
10. Reputation 不自动改变 Relationship / Politics / Law / ORG / Character Capability；只作为 Context 或 Handoff 来源；
11. 不拥有独立一级 Extension Surface；优先贡献 Entity Detail / Information / Contextual Surface；
12. 本资产从出生即遵守 `tavern-asset v0.8.0` Runtime Activation / Context Contract。

---

# 1. Canonical Scope

## 1.1 唯一回答的问题

> **“Target 在一个明确的社会 Audience 中，现在因什么来源而被怎样公开评价；这种评价传播多广、是否显著、是否被质疑、是否仍然有效，以及是否形成了被社会采用的非正式名号？”**

## 1.2 本 Core 负责

- Reputation Target reference；
- Reputation Audience / Social Scope；
- Reputation Evaluation Record；
- Reputation Dimension Registry / Contribution Point；
- Provenance / Source reference；
- Spread / Reach；
- Salience；
- Perceived Credibility / Contest；
- Persistence / Currentness；
- Reinforcement / Weakening / Contest / Decay / Retirement lifecycle；
- Cross-audience Reputation Propagation semantics；
- Social Epithet / Informal Public Title；
- Reputation Interpretation；
- Player-safe Reputation Projection；
- Reputation-related Intent / Candidate / Event Handoff；
- Runtime Activation / Context Contract。

## 1.3 本 Core 明确不负责

- Character Capability / actual skill → EP-CHAR-CORE；
- Directed Sentiment / Trust / Respect / Attachment → Relationship Core；
- Membership / Role / Rank / Internal Authority → EP-ORG-CORE；
- Political Recognition / Legitimacy / Claim / Public Authority → Politics；
- Legal Case / Wanted / Conviction / Warrant → Law / Enforcement；
- 某个角色是否知道某条 Reputation → Knowledge Owner / World OS；
- Event / Statement / Rumor 的 Authoritative Truth → World OS / Event / Information Owner；
- RNG / Dice / Program Judge / Formal Outcome / Atomic Commit → Runtime；
- 自动决定 NPC 好恶、投票、任命、抓捕、交易成功等下游结果。

---

# 2. Core Invariants

1. `Reputation != World Truth`。
2. `Reputation != Relationship`。
3. `Reputation != Knowledge`。
4. `Reputation != Organization Rank / Role`。
5. `Reputation != Political Recognition`。
6. `Reputation != Legal Status`。
7. `Reputation != Character Capability`。
8. `Awareness / Spread != Positive Evaluation`。
9. 同一 Target 在不同 Audience 可以拥有相互冲突的 Reputation。
10. 同一 Audience 对同一 Target 可以同时存在多个相互矛盾的 Evaluation。
11. Reputation 不建立全局单一总分。
12. Enabled Reputation Core != Reputation always visible to model。
13. Reputation dependency / integration != full Reputation prompt inclusion。

---

# 3. Target Model

## 3.1 v0.1 正式验证 Target

### Character

例如：

- “江南武林普遍认为沈砚剑术卓绝”；
- “青河县百姓把他视为救命恩人”；
- “盐帮认为他是危险的破坏者”。

### Organization

例如：

- “振威镖局以十年少有失镖而闻名”；
- “某门派在江湖中以护短著称”；
- “某商号在河运商人中被视为信誉极差”。

ORG 只拥有 Organization Identity / Membership / Role 等结构事实；Organization Reputation 仍由本 Core Own。

## 3.2 轻量兼容 Target

Place / Item 可以作为 Reputation Target reference，但 v0.1 不为其建立专门复杂子系统。

例如：

- 某渡口“匪患严重”的社会口碑；
- 某把刀“克主”的传说性评价。

若未来 Place / Item Reputation 出现多个独立消费者，再做专门 Consumer Stress Test；当前不扩大 Scope。

---

# 4. Audience｜社会评价必须有“谁在这样看”

## 4.1 Audience 是一等语义

禁止只保存：

```text
Target: 沈砚
Reputation: 很高
```

应表达：

```text
Target: 沈砚
Audience: 江南武林
Evaluation: 剑术卓绝
Spread: 广泛
```

同一 Target 可同时存在：

```text
江南武林 → 剑术卓绝
青河县百姓 → 曾救助本地灾民
盐帮 → 危险且屡坏利益
京师中央官场 → 基本无显著评价
```

## 4.2 Audience 不是单纯 Region

Audience 可以由当前世界已有的社会 / 地理 / 组织 Context 限定，例如：

- 江南武林；
- 京师官场；
- 本县百姓；
- 河运商人；
- 某组织成员群体；
- 边军将士；
- 某宗教群体。

Reputation Core 不拥有 Region / Organization / Social Category 的 authoritative identity；只引用合法 Scope。

## 4.3 单个具体人不是默认 Reputation Audience

如果“张三认为李四可靠 / 可敬 / 可恨”，属于：

> Relationship Directed State。

只有达到群体 / 社会圈层层级的公共评价，才属于 Reputation。

---

# 5. Evaluation｜拒绝统一声望轴

## 5.1 Evaluation Record

Reputation Canonical State 以可并存 Evaluation 为中心，例如：

- 剑术卓绝；
- 医术高明；
- 守诺；
- 嗜杀；
- 清廉；
- 贪财；
- 护短；
- 轻视官府；
- 商业可靠；
- 政治投机；
- 正统 / 异端（作为社会评价时）。

## 5.2 Reputation Dimension Registry

Core 提供通用 Registry / Grammar；具体世界或 Domain 可以贡献 Dimension Definition。

例如：

- 江湖 Theme → 武艺声名、侠义、门派正统性社会评价；
- 商业 Theme → 履约信誉、货品口碑；
- Politics → 可贡献民望 / 政治声誉的评价维度，但不能把 Political Recognition 迁入 Reputation。

`Definition Contributor != Reputation State Owner`。

## 5.3 不建立统一 Reputation Score

禁止把：

- Fame；
- Honor；
- Fear；
- Trustworthiness；
- Awareness；

压成单一总值。

Runtime 可以在单个 Record / Dimension 内使用隐藏量化帮助长期演化，但：

- 当前不冻结数值范围；
- 玩家默认不看精确隐藏值；
- 数值不是跨维度统一货币；
- Derived Summary 不得反写 Canonical Evaluation Records。

---

# 6. Awareness / Spread 与 Evaluation 分离

一个人可以：

- 很出名但评价中性；
- 在当地鲜为人知但被少数知情圈层极度恐惧；
- 恶名传播很广但真实性高度争议；
- 实力极强但社会几乎不知道。

因此：

```text
Awareness / Spread
!= Evaluation Valence
!= Credibility
```

Spread 只描述社会评价在相关 Audience 中的传播 / 覆盖程度，不代表赞同。

---

# 7. Provenance 与 Truth Boundary

## 7.1 Reputation 可以由真实或虚假来源形成

来源可以引用：

- Formal Event；
- Public Statement；
- Institutional Notice；
- 目击 / 公开行为；
- 传闻 / rumor；
- 宣传 / smear；
- 错误归因；
- 多次重复叙述。

## 7.2 Reputation 不复制 World Truth

禁止：

```text
reputation.truth = true / false
```

作为第二世界事实源。

本 Core 只记录：

> 该社会评价依据哪些来源被形成 / 传播 / 相信 / 争议。

来源本身是真是假，由其正式 Owner 决定。

因此完全允许：

```text
Authoritative Event: 沈砚没有弑师
Reputation: 江湖中仍有大量人相信“沈砚弑师”
```

或者：

```text
Law: 已正式判无罪
Reputation: 当地社会仍普遍怀疑其有罪
```

---

# 8. Reputation Lifecycle

最小生命周期：

```text
Source Event / Claim / Statement
↓
Audience Exposure
↓
Social Interpretation
↓
Create / Reinforce / Weaken / Contest Reputation Record
↓
Cross-audience Spread or Local Persistence
↓
Decay / Historical / Retire
```

## 8.1 Reinforcement

新来源可以强化已有 Evaluation，但不要求每次都新建第二条同义记录。

## 8.2 Contest

相互矛盾的评价可以同时存在；“争议”不是自动平均成中间值。

## 8.3 Decay / Currentness

长期缺乏强化的社会评价可以降低显著性 / 时效；具体衰减速度不在 Semantic Asset 阶段冻结统一公式。

某些历史性名号 / 重大恶名可以长期保留，仍需由 Runtime / World Context 判断。

---

# 9. Social Epithet / Informal Public Title

本 Core Own 社会形成的非正式名号，例如：

- “青衣剑”；
- “北地刀王”；
- “活阎罗”；
- “江左第一侠”。

必须区分：

```text
北地刀王 → Reputation Social Epithet
执法堂堂主 → ORG Role
刑部尚书 → ORG Role + Politics Public Authority
靖北侯 → formal political / legal title owner
```

Epithet 允许 Audience-specific adoption，同一人物可在不同圈层拥有不同称呼。

Character legal name / stable alias identity 不迁入 Reputation。

---

# 10. Cross-domain Boundary

## 10.1 Relationship

公共“人人敬重他”不等于具体 NPC 的 Respect。

```text
Reputation
→ Relationship interpretation context
→ NPC 根据 Personality / Relationship 自主回应
```

Reputation 不直接写 Trust / Respect / Sentiment。

## 10.2 ORG

```text
Rank / Role / Membership → ORG
门内普遍认为某长老公正严明 → Reputation
掌门本人不信任该长老 → Relationship
```

Reputation 不产生任职、晋升、撤职或 Internal Authority。

## 10.3 Politics

```text
民间普遍认为太子无德 → Reputation
正式册立太子 → Politics / ORG role semantics
其他政治主体正式承认某人为君主 → Politics Recognition
```

Popular Reputation != Political Recognition / Claim / Control。

## 10.4 Law

```text
正式通缉 / 定罪 → Law
社会普遍认为某人是罪犯 / 英雄 → Reputation
```

二者允许矛盾。

## 10.5 Character Capability

“被认为剑术天下第一”属于 Reputation；实际 Capability / Skill 归 Character Core。

Reputation 可以高估、低估或误判实际能力。

---

# 11. Knowledge / Information Boundary

```text
Reputation exists in world
!= Player knows it
```

Reputation Core Own 群体层社会传播事实；具体 Character 是否已经听说 / 知道，仍由 Knowledge Owner 维护。

Player-safe UI 只能显示玩家已知或合理可见的社会评价投影。

不得因为某条 Reputation 在后台存在，就把秘密评价、隐藏名号、秘密污名或未知圈层看法直接展示给玩家。

---

# 12. Open Attempt / Agency

Reputation 不能成为玩家输入白名单。

玩家可以：

- 冒充某个有名人物；
- 自称某个社会名号；
- 试图利用恶名恐吓；
- 否认既有恶名；
- 散布自我宣传；
- 污蔑他人；
- 公开洗白；
- 在无人认识自己的地方假装“天下皆知”。

Attempt 可以成立；正式社会效果由当前 Reputation、Audience、证据、传播条件、NPC / Runtime 决定。

---

# 13. UI / Surface

本 Core 默认：

> **不拥有一级 Extension Surface。**

优先贡献：

- Person Detail；
- Organization / future Entity Detail；
- Information Surface；
- Narrative Contextual；
- 必要的 Badge / qualitative summary。

未来江湖类资产若拥有 `江湖 / 武林` 长期 Workspace，本 Core只作为 Contributor。

Player-safe Projection 应优先使用定性表达，例如：

- “在江南武林中已广为人知”；
- “恶名主要限于本地”；
- “这一说法流传甚广，但争议很大”。

不默认显示隐藏精确数值。

---

# 14. Definition → Instance

World / Domain / Theme 可以贡献：

- Reputation Dimension Definition；
- Audience category / social-context definition reference；
- T0 Reputation bootstrap candidate；
- T0 Social Epithet bootstrap candidate。

运行时：

```text
Definition / Bootstrap
↓ instantiate
Game Reputation State
↓ Event / Handoff evolution
Current Reputation Records
```

资产版本更新不得静默覆盖已经演化的 Reputation State。

---

# 15. Runtime Activation / Context Contract｜Reference Implementation

## 15.1 Routing Profile

Router 级最小描述：

```text
ID: EP-REPUTATION-CORE
Name: 名望与社会评价核心
Scope: 群体 / 社会圈层对人物或组织的公共评价、名望、恶名、社会名号、传播与争议
Typical semantics: 名声 / 风评 / 口碑 / 恶名 / 威名 / 侠名 / 众人怎么看 / 社会评价 / 名号 / 自我宣传 / 污名 / 洗白
```

Routing Profile 是极小语义目录，不替代完整资产正文。

## 15.2 Immediate Activation

典型由 Router 直接激活的输入：

- 玩家询问某人 / 某组织“在某圈子名声如何”；
- 玩家主动利用自己的名声 / 恶名 / 名号进行社会互动；
- 玩家试图公开塑造、宣传、洗白、污名化某 Target；
- 玩家传播或挑战某个社会评价；
- 玩家询问 / 使用某个 Social Epithet；
- 当前行动的核心目标就是改变公众看法，而不是只产生一个可能被社会看到的普通 Event。

## 15.3 Downstream Activation｜不要求 Router 预测

公开决斗、犯罪、救灾、背叛、政治事件等**不因为“可能影响声誉”就要求第一轮 Router 必须加载 Reputation**。

正确链：

```text
Combat / Law / Politics / World Event
↓ Formal Event / State Change
Handoff: socially observable / reputation-relevant candidate
↓
Reputation downstream activation
```

Router 只判断当前 Input 的 immediate relevance。

## 15.4 No-load Conditions

以下普通场景通常不应因为本局启用了 Reputation 就加载 Reputation 详细上下文：

- 私人闲聊，且没有人在讨论公共名声；
- 普通移动 / 物品操作；
- 纯 Health / Survival 更新；
- 普通 Character-scale Combat 的动作解析阶段；
- 组织内部任职变更本身；
- 任何只需要一个已确定 Reputation Fact 的场景，可由 Runtime 提供最小 projection，不加载完整 Reputation grammar。

## 15.5 Minimal Read Set

根据当前 Intent，只读取：

- 当前 Target；
- 当前相关 Audience / Social Scope；
- 与本次问题直接相关的 Evaluation Records；
- 必要的 Spread / Salience / Contest / Currentness；
- 直接相关 Provenance 摘要；
- 相关 Social Epithet；
- 玩家可安全获知的投影边界。

不得为了询问“本县人怎么看我”加载：

- 所有 Region；
- 所有 Audience；
- Target 全部 Reputation 历史；
- 所有 source Events；
- 全部组织成员或关系网络。

## 15.6 Model-needed Semantics

模型主要负责：

- 从自然语言识别 Reputation Intent / Audience / Target；
- 在非确定性场景中解释某来源对某 Audience 可能形成什么社会意义；
- 生成 candidate Evaluation / Contest / Epithet；
- 理解宣传、污名、误传、洗白等开放式社会行为；
- 在多个矛盾 Reputation Record 中生成符合 player-safe context 的自然语言摘要。

## 15.7 Program-owned Logic

Program / Runtime 负责：

- ID / Ref / Enabled asset validation；
- Authoritative Reputation State 存储；
- Audience / Target 引用合法性；
- source ref existence；
- 时间戳 / active / retired / current lifecycle bookkeeping；
- deterministic state merge / persistence；
- Formal Outcome / Atomic Commit；
- Save / Restore；
- player-safe projection authorization。

如果某个 Reputation change 可以由明确规则 deterministic 推导，优先 Program 处理；不为了“规则写在资产里”重复交给模型。

## 15.8 Output Candidate

模型最多提出：

- candidate reputation evaluation create / reinforce / weaken / contest；
- candidate audience / propagation target；
- candidate social epithet adoption / retirement；
- candidate public-perception interpretation；
- clarification need。

模型不得直接提交 Reputation State。

## 15.9 Handoff

### Incoming

- Event / Information → socially observable reputation-relevant candidate；
- ORG → target / audience organization context；
- Character Capability → actual capability context（只读，actual != reputation）；
- Politics / Law → formal public act / declaration context，但不转移其正式状态。

### Outgoing

Reputation 只提供 Context / read projection 给：

- Relationship / NPC response；
- Politics；
- Law；
- Commerce / negotiation；
- Jianghu Ecology；
- Narrative。

禁止直接写这些 Domain 的 authoritative state。

## 15.10 Information Boundary

Model Working Set 只包含当前模型职责允许看到的 Reputation projection。

后台存在的 Reputation Records 不自动进入：

- Player Knowledge；
- Narrative Context；
- NPC Knowledge；
- 当前 Router Context。

## 15.11 Context Cost / Bounded Strategy

正式原则：

```text
Enabled Reputation
!= Reputation always in model context
```

```text
All Reputation Records
!= Current Reputation Context Slice
```

```text
All source history
!= Current Provenance Summary
```

大量人物、组织、Audience、历史事件累积时，普通无关 Turn 的模型上下文应保持基本稳定。

当前不冻结统一 token budget；G9 / G11 用真实 Provider 做 Context Composition Stress Test 后再确定可执行 Budget。

---

# 16. Context Composition Reference Scenarios

## Scenario A｜私人叙旧

Enabled：ORG + Reputation + Relationship。

玩家与旧友私下聊天，不谈公众看法。

期望：Relationship / Character context 可相关；Reputation 不因 Enabled 自动加载。

## Scenario B｜辞去门派职位

玩家明确辞任执法堂副堂主。

Immediate：ORG。

Reputation：不自动参与；若辞任成为公开事件并在门内形成评价，再由 Event Handoff 激活。

## Scenario C｜公开决斗

Immediate：Combat / Character / Martial domain。

Reputation：不参与战斗 Formal Resolution；决斗结果成为公开 Event 后，再产生 Reputation Candidate。

## Scenario D｜利用恶名恐吓

玩家：“告诉他们我就是‘黑水阎罗’，让他们识相点。”

Immediate：Reputation + 当前社交 /关系 Context。

Reputation 只提供相关 Audience 是否听说、怎样评价；NPC 最终反应仍由 NPC / Relationship / Runtime 决定。

## Scenario E｜官府通缉但江湖称侠

Law：正式 Wanted / Case。

Reputation：某些 Audience 认为其“替天行道”。

允许二者同时成立，不建立统一善恶结论。

---

# 17. Creator / G9 Requirement

Creator / asset-spec vNext 至少需要支持：

- Reputation Dimension contribution；
- Target / Audience reference semantics；
- Social Epithet definition / bootstrap；
- Routing Profile；
- Runtime Activation / Context Contract；
- player-safe projection intent；
- Handoff declaration；
- Context Composition validation hook。

当前不冻结最终 JSON 字段、Router API、token budget 或 Runtime 数据结构。

---

# 18. Related Notes

- `[[组织与任职核心_Expansion_Pack_v0.1.1]]`
- `[[关系与恋爱核心_Expansion_Pack_v0.2]]`
- `[[通用资产库_RuntimeContextContract模式_v0.1]]`
- `[[通用资产库_Shared_Foundation架构规划_v0.3]]`
- `[[EP-REPUTATION-CORE_v0.1_单资产审核_2026-08-18]]`
- `[[ORG-Reputation_Context_Cluster收敛审核_2026-08-18]]`
