---
title: Real Playtest Findings｜Risk Structure · NPC Agency · DSH Maintenance Debt
status: accepted-product-findings
date: 2026-08-25
source_game: games/luan-shi-sanguo-2
source_commit: 79058a244bcfdc05314c927bdd322731b9cc669e
---

# 2026-08-25 真实试玩结论

本记录来自《乱世三国2》长期真实试玩后的玩家人工体验判断。

总体结论：

> **当前 GM 输出质量、沉浸感、长期世界成长感继续表现优秀；下一阶段不应把主要精力重新拉回 DSH 基础设施，而应强化“行动方式差异”和“人物自主性”，同时进入 authored Map v0.1。**

---

## Finding 1｜失败会改变局面是对的，但行动路线的风险结构还不够不同

### 玩家反馈

当前“失败改变局面，而不是关闭游戏”的方向成立。

问题在于：不同 meaningful choice 虽然在叙事方向和结果上不同，但实际判定体验经常收敛成：

```text
选择一个行动方向
↓
掷 1d20
↓
对 DC 12 / 15 左右
↓
成功 / 失败
```

因此玩家还没有充分感到：

> “同一个目标，换一种做法会有显著不同的风险。”

### 产品结论

正式原则：

> **A meaningful choice should differ in risk structure, not only narrative direction.**
>
> **有意义的选择不仅结果方向不同，风险结构也应不同。**

一次行动的风险至少从四个轴判断：

```text
可行性：直接成立 / 需要检定 / 当前不成立
固有难度：DC
情境态势：优势 / 普通 / 劣势
失败代价：时间 / 资源 / 暴露 / 关系 / 身份 / 伤害 / 局势升级...
```

不同路线不要求四个轴全部不同，但不能默认只靠小幅 DC 浮动表现差异。

### 优势 / 劣势

当前 `tools/掷骰.mjs` 和《判定与检定》本来已经支持 DND 风格：

```text
优势：2d20 取高
劣势：2d20 取低
```

因此本次不是增加新的 RNG Runtime，而是强化**使用纪律**。

人格、关系历史、准备、情报和具体沟通方式，都可以成为优势/劣势来源。

### 失败语义

继续保留：

> **失败改变局面，而不是关闭游戏。**

同时补充：

> **行动方式决定失败把局面改变成什么样。**

偷听失败、公开交涉失败、花钱疏通失败、强攻失败，不应只是四种写法不同的“没成功”。

### 落地

已更新：

`library/mechanics/判定与检定_Expansion_Pack_v0.1.md`

本次属于现有 v0.1 裁定语义澄清，不改变骰子工具协议。

---

## Finding 2｜Consolidation 造成的文档滞后是 DSH 版已知缺陷，当前接受

### 真实现象

长局中观察到：

- 多数回合只更新 CURRENT / DELTAS / 少量 Owner；
- 到检查点再集中 edit 多个人物、机制、THREADS、RECENT、LEDGER；
- 因此部分 Owner 会比当前场景落后数月甚至更久。

这与当前两层维护设计一致：

```text
Tier 1：每回合 durable delta capture
Tier 2：checkpoint consolidation
```

### 玩家判断

当前 DSH 版游戏更看重：

1. GM 输出质量；
2. 角色表现；
3. 玩家沉浸与游玩体验；
4. 长期事实不丢。

只要 DELTAS 仍作为 durable truth 工作，Owner 文件的阶段性 eventual consistency **暂时可接受**。

### 产品决策

不为了提高 Owner freshness 立刻建设：

- typed mutation runtime；
- 通用状态数据库；
- 高频强制 consolidation；
- 第二套 universal schema；
- 大型同步机制。

原因：这些工作会提高维护延迟、token 成本与架构复杂度，却不一定增加当前玩家价值。

正式定位：

> **这是 DSH Host / architecture debt，不是当前产品 P0。**

未来独立版要求见：

`docs/FUTURE_STANDALONE_BACKLOG.md`

其中 SD-01 记录：未来世界 durable mutation 与 projection 应实现更持续的增量一致性。

---

## Finding 3｜NPC 的纸面人格已经不错，但实际自主性仍不够强

### 玩家反馈

当前不同 NPC 有不同口吻、背景与人物卡，但游玩时还没有足够强的：

> “我要针对这个人仔细想怎么相处。”

重要 NPC 容易出现共同模式：

```text
玩家提出方案
↓
聪明 NPC 分析风险
↓
提出一点补充
↓
大体同意
↓
成为玩家能力 Buff
```

人物差异因此更多停留在表达层，而不是进入真实玩法。

### 产品结论

正式原则：

> **An NPC is not a response surface. An NPC is an actor with a life that continues without the player.**
>
> **NPC 不是等待玩家交互的回应面，而是即使玩家不理他也会继续行动的人。**

重要 NPC 应至少在语义上保持五个锚点：

```text
Current Agenda
他现在真正想推动什么？

Fear / Cost
他最怕失去什么？

Red Line
什么事情他现在绝不会接受？

Obligation
他对谁、对什么负有责任？

Independent Next Move
玩家暂时不管他，他下一步自己会做什么？
```

这不是 universal schema，不要求所有 NPC 填表，也不建设逐回合 NPC 模拟器。

### NPC 与骰子

社交对象的人格应真实改变行动风险：

```text
人物人格 / 当前目标 / 关系历史 / 利益与义务
+
玩家采用的沟通方式与筹码
↓
是否可行
DC
优势 / 普通 / 劣势
失败代价
```

因此“见人说人话，见鬼说鬼话”应成为实际玩法，而不只是角色扮演文风。

同时：

> **Dice decides uncertainty. Dice does not erase character.**

如果玩家要求 NPC 直接跨越已经稳定成立的核心底线，通常属于当前“不成立”的意图，而不是给一个高 DC 后靠天然 20 让人物人格翻转。

### 中盘难度

长期成长后，不应主要靠突然提高敌人数值“平衡”玩家成功。

更有价值的难度来自：

- 优秀人才拥有彼此不同的立场；
- 忠诚与义务发生冲突；
- 势力规模增加组织成本；
- 盟友逐渐成长为独立政治中心；
- 成功本身制造新的利益与新的担忧。

即：

> **拥有很多真正厉害的人以后，如何让这些真正有主见的人继续待在同一条船上，本身就是中盘玩法。**

### 落地

新增：

`library/characters/NPC自主性与交互_GM指南_v0.1.md`

并由：

`library/characters/README.md`

列为重要人物主持原则。

---

## Finding 4｜地图仍是下一项正式插件任务

以上两项属于规则 / 资产 / GM 指南修订，不改变产品插件路线。

下一项正式 RPG Experience Plugin 仍是：

> **The World Map v0.1 — Authored World Map Projection**

当前边界：

- 世界包作者手工定制专属地图；
- 插件负责展示；
- 支持缩放 / 拖动；
- 根据 canonical 当前地点 projection “你在这里”；
- 定位不到时 fail soft，不猜坐标；
- 不做自动生成地图；
- 不做 GIS；
- 不做路径规划；
- 不做点击移动；
- 不做动态势力边界 / NPC marker / 战争态势图。

自动地图生成等世界核心能力稳定、多个 authored map 有真实使用证据以后再研究。

---

## Accepted Product Decisions

- **DEC-F01** Meaningful Choice Risk Structure：有意义选择不仅方向不同，风险结构也应不同。
- **DEC-F02** Failure Changes Situation：失败继续改变世界，但不同路线拥有不同失败 stakes。
- **DEC-F03** Advantage / Disadvantage Discipline：现有优势/劣势必须真实参与方法、人物与情境差异。
- **DEC-F04** Dice Does Not Erase Character：骰子不能击穿已经成立的人格底线。
- **DEC-F05** NPC as Actor：重要 NPC 有独立目标、义务、底线与离屏行动，不只是玩家回应面。
- **DEC-F06** DSH Eventual Consistency Accepted：只要 durable facts 不丢，Owner 文档阶段性滞后在 DSH 版暂时接受。
- **DEC-F07** Player Experience Priority on DSH：当前优先 GM 输出质量、沉浸与玩家价值，不为宿主完美度过度工程化。
- **DEC-F08** Map Next：下一项正式插件仍为 authored Map v0.1。

---

## Non-actions

本次明确**不**做：

- 新 NPC AI Runtime；
- universal personality schema；
- NPC 每回合 tick；
- 将全部社交行为数值化；
- 为 consolidation lag 新建数据库；
- 为 Owner freshness 提高每回合 maintenance 税；
- 为难度差异增加更多随机工具；
- 现在开始自动生成地图。
