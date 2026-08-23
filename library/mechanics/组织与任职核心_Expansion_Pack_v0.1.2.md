---
title: 组织与任职核心｜Expansion Pack
aliases:
  - EP-ORG-CORE
  - Organization Core
  - 组织核心
version: 0.1.2
status: audited-current
created: 2026-08-17
updated: 2026-08-18
asset_type: expansion-pack
asset_family: 通用拓展包资产库
reusability: cross-world
dependency_role: organization-core
hard_dependencies: []
creator_binding: pending-g9
asset_spec_binding: pending-g9
skill: tavern-asset v0.8.0
supersedes:
  - 组织与任职核心_Expansion_Pack_v0.1.1
---

# 组织与任职核心｜Expansion Pack v0.1.2

> [!abstract]
> `EP-ORG-CORE` 是跨 World Pack 通用的持续组织结构事实 Owner。
>
> 它维护 Organization Identity、Membership、Formal Affiliation、Role、Rank、Branch、Internal Authority、任职生命周期，以及组织间正式关系生命周期骨架。
>
> 它不拥有私人关系、政治权力、法律状态、经济资源、战争 Formation 或人物能力。
>
> v0.1.2 不改变 Canonical Ownership；本 Patch 只把 v0.1.1 的 Runtime Context Contract 对齐 Pattern v0.2，补齐 State-mandatory / Downstream Activation 与 Contract 内 Information Boundary。

# 1. Canonical Scope

## 负责

- Organization Definition；
- Organization Instance；
- Membership；
- Formal Affiliation；
- Role Definition；
- Role Holding；
- Rank / Grade；
- Branch / Department Structure；
- Internal Authority；
- Appointment / Removal / Resignation；
- Generic Role Succession skeleton；
- Formal Inter-Organization Relation lifecycle skeleton。

## 不负责

- Character Capability → EP-CHAR-CORE；
- Trust / Respect / Attachment → Relationship Core；
- Reputation → Reputation Core；
- Political Authority / Recognition / Control → Politics Core；
- Resources → Economy Core；
- Formation / Campaign → War Core；
- Legal Procedure → Law；
- Formal Outcome / Commit → Runtime。

# 2. Core Invariants

1. Organization != Faction Score。
2. Membership != Relationship。
3. Role != Rank。
4. Role Holding != Public Authority。
5. Internal Authority != Political Authority。
6. Standing Organization != Operational Formation。
7. Organization Relation lifecycle != Domain-specific Relation meaning。
8. Enabled ORG != ORG always visible to model。
9. ORG Dependency != full ORG prompt inclusion。

# 3. Definition → Instance

```text
Organization Definition
↓ instantiate
Named Organization Instance
↓
Runtime Membership / Role / Structure State
```

Definition 更新不得静默覆盖 Instance。

# 4. Membership

Membership 表示正式成员关系；一个 Character 可以同时拥有多个 Membership。

Formal Affiliation 用于客卿、门客、长期顾问、合同关系、受保护对象等正式持续关系，但不等于 Membership，也不得替代 Relationship。

# 5. Role / Rank

Role：当前承担的正式职能。

Rank：组织内部等级 / 资序。

```text
Rank: 二代弟子
Role: 执法堂副堂主
```

两者独立存在。

# 6. Internal Authority

Internal Authority 描述组织内部正式权限：任命内部职位、管理成员、分配组织任务、执行组织规则。

不得推出国家行政权、法律效力或战争 operational command。

# 7. Organization Relation Skeleton

ORG 提供组织间正式关系生命周期骨架：参与组织、生效状态、起止时间、来源事件。

具体语义由 Domain Contribution 提供，例如 Politics 的外交关系、Jianghu 的盟约 / 互保、Commerce 的长期合作。

# 8. Open Attempt

身份和权限限制 Formal Effect，不限制 Attempt。

```text
普通弟子宣布自己成为掌门
↓
Attempt 成立
↓
无合法任命 / 继承
↓
Role Holding 不成立
```

Context Router 未命中 ORG 也不能据此判定玩家关于组织的自由表达非法。

# 9. Information Boundary

组织真实状态 != 玩家知识。

秘密成员、隐藏分支、内部协议必须经过 Knowledge / Clue / Event 才进入玩家安全投影。

# 10. Runtime Activation / Context Contract

## 10.1 Routing Profile

```text
ID: EP-ORG-CORE
Name: 组织与任职核心
Scope: 组织身份、成员关系、任职、等级、分支、内部权限、任命/辞任与正式组织关系生命周期
Typical semantics: 加入 / 退出组织、任职 / 撤职、职位 / 等级、内部命令、分支结构、组织间正式关系
```

## 10.2 Immediate Activation

典型 immediate activation：加入 / 退出组织、任职 / 撤任 / 辞任、查询或使用 Role / Rank、内部权限、组织结构变化、建立 / 终止正式组织关系。

其他 Domain 只需要读取一个确定性 Organization Fact 时，可以只请求 bounded projection，不要求模型理解 ORG 全部语义。

## 10.3 State-mandatory Activation

Membership / Role 仅仅存在**不会**让 ORG 常驻模型上下文。

但若 Runtime 已存在一个明确的 active organization operation，例如：

- 正在处理任命 / 辞任 / 撤职流程；
- 当前 action 明确引用“按我现有权限继续执行”的 Internal Authority；
- 当前 formal organization-relation lifecycle 正在完成 / 终止；

即使玩家输入使用省略表达，Program 可以根据 authoritative active state 补充 ORG 为 Runtime Relevant。

仍然只读取当前操作相关 projection。

## 10.4 Downstream Activation

Router 不需要预判所有 Organization 后果。

例如：

```text
Politics / War / Law Formal Event
↓
role / membership / organization-relation change candidate
↓ Typed Handoff
ORG downstream activation
```

反过来，ORG 的任职 / 退出等正式 Event 若可能影响 Reputation / Politics，也由 Event Handoff 激活下游；不在 ORG 当前 Prompt 中一次性加载这些 Domain。

## 10.5 No-load Conditions

通常不加载 ORG 详细 Context：与组织无关的私人闲聊、普通 Combat、单纯 Health / Survival、普通移动 /观察 /物品操作、仅需一个确定性 ORG Fact 的其它 Domain。

## 10.6 Minimal Read Set

只读取 target Organization、相关 Membership / Formal Affiliation、相关 Role / Rank、相关 Branch、相关 Internal Authority、直接相关组织关系与必要来源 Event / effective state。

不得为了局部任职问题加载全部组织、全部成员或完整组织历史。

## 10.7 Model-needed Semantics

模型主要用于理解加入、辞任、任命、冒充、内部命令等自由语言意图；解释非标准组织互动；在有歧义时提出 Candidate / clarification；生成 NPC 对组织行为的语义回应候选。

## 10.8 Program-owned Logic

Program 负责 Ref / Organization identity、Membership / Role 当前状态、任职存在性、Internal Authority 确定性范围、正式 lifecycle、Formal Outcome、Atomic Commit、Save / Restore。

模型不得直接写 Membership / Role Holding。

## 10.9 Output Candidate

模型最多提出 organization intent、candidate membership / affiliation change、candidate appointment / resignation / removal、candidate organization relation action、candidate internal-authority use、clarification need。

## 10.10 Handoff / Information Boundary

ORG 向 Politics / War / Reputation / Law / Relationship 提供 bounded Organization / Role Context；不修改这些 Domain 的 authoritative state。

秘密成员、隐藏分支、内部协议、未被角色得知的任职真相不自动进入 Router / Narrative / Player Context。

Handoff 不要求把 ORG 完整正文放入对方模型上下文。

## 10.11 Context Cost

```text
Enabled ORG != ORG always in model context
Full ORG Definition != Turn-level ORG Projection
All members / branches != current relevant organization slice
```

组织数量与成员数量增长 5–10 倍时，普通无关 Turn 的 Model Working Set 应保持基本稳定。

# 11. Migration Boundary

未来 Han Politics Genericization：Faction organization skeleton、staff / retainer、Office Role skeleton、Office Holding 基础任职事实迁出到 ORG；Public Authority / Jurisdiction / Recognition / Political Control / Political Claim 留在 Politics。

# 12. G8 / G9 Boundary

当前冻结 Semantic Ownership 与 Runtime Context Contract 语义。

G8 仍在 Final Host Convergence；G9 machine Schema / Router API / Context Compiler / token budget / Creator machine fields 在 G8 Exit 前不冻结。
