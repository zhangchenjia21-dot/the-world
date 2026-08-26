---
title: The World｜DSH 游戏测试核心经验教训
status: canonical-core-reference
version: 1.0
created: 2026-08-26
updated: 2026-08-26
experiment_status: DSH long-play test substantially complete
successor_project: https://github.com/zhangchenjia21-dot/my-world
---

# The World｜DSH 游戏测试核心经验教训

## 0. 文档定位

这份文档是 The World 在 DeepSeek Harness（DSH）上长期真实试玩阶段的核心复盘。

它不是新的 DSH 功能路线图，也不是要求继续把 DSH 改造成完整游戏引擎。它负责回答：

> **我们在真实长局里证明了什么、失败了什么、哪些设计原则值得继承、哪些 DSH 实现不应进入下一代独立项目。**

当前裁定：

> **DSH 测试阶段的主要产品探索使命已经完成。**

The World / DSH 此后主要作为：

- 可玩的参考实现；
- 真实长局证据库；
- 成功与失败设计的历史记录；
- `my world` 独立项目的前代实验场。

除非未来出现新的、只有 DSH 实测才能回答的重要产品问题，否则不再为了 DSH 宿主完美度继续扩大工程投入。

正式总原则：

> **迁移经验，不迁移宿主债务。**

---

# 1. 最重要的结论：核心产品方向成立

DSH 长局已经证明，下面这类体验不是纸面构想，而是可以成立的：

```text
优秀大模型作为 AI GM
+
玩家自然语言自由行动
+
长期持续世界
+
人物 / 势力 / 关系 / 历史后果持久存在
+
RPG 机制与 UI 辅助
+
跨 Session 恢复与 Save / Restore
```

真实试玩中已经出现了明显的沉浸感、长期经营感和“这是一局自己的历史”的体验。

因此下一代项目不需要重新证明：

> “对话式 AI RPG 到底有没有产品价值？”

真正需要继续解决的是：

> **怎样让这个价值长期稳定、高性能、原生地运行，并让世界本身比当前 DSH 版本更自主。**

---

# 2. 已被真实试玩验证、应长期保留的产品原则

## 2.1 自然语言自由行动优先

玩家不应被封闭菜单限制。

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

玩家可以尝试任何合理或不合理行动；世界不保证成功，但必须给出因果后果。

> **Freedom Before Prevention.**
>
> **Prefer recovery over prevention.**

低成本错误优先允许 Undo / Regenerate / Restore / 修正，而不是提前用大量 Guardrail 限制模型与玩家。

## 2.2 失败改变局面，而不是关闭游戏

失败不应等于：

```text
检定失败
→ 什么都没发生
→ 再选一次
```

更好的失败是：

```text
失败
→ 时间损失 / 暴露 / 关系改变 / 资源损耗 / 对手反应 / 新机会
→ 世界进入新的可玩状态
```

这一点在长期试玩中显著提高了故事连续性和“世界接住玩家”的感觉。

## 2.3 Meaningful Choice 必须有不同的风险结构

试玩暴露出：如果所有行动路线最终都只是类似的 `d20 + 修正 vs DC12/15`，那么选项虽然叙事方向不同，玩家仍会觉得“反正都只是掷一个骰子”。

因此正式原则是：

> **A meaningful choice should differ in risk structure, not only narrative direction.**
>
> **有意义的选择不仅结果方向不同，风险结构也应不同。**

一个行动方案至少可能在以下轴上不同：

```text
可行性：自动成立 / 需要检定 / 当前不可成立
固有难度：DC
情境态势：优势 / 普通 / 劣势
失败代价：时间 / 钱 / 暴露 / 身份 / 关系 / 伤害 / 局势升级
```

优势 / 劣势机制是有效的轻量工具：同时掷两个 d20，优势取高，劣势取低。

人物性格、关系历史、准备、证据、沟通方式都可以成为优势 / 劣势的来源。

同时必须守住：

> **Dice decides uncertainty. Dice does not erase character.**
>
> **骰子裁定不确定性，不抹除人物。**

稳定人物底线不能因为一次天然 20 被随意击穿。

## 2.4 玩家授权边界成立

主角操控粒度可配置是正确方向：

- Full Control；
- Light Delegation；
- Narrative Delegation。

核心不是“所有动作必须手操”，而是：

> **GM 不得把宽泛意图扩展成未授权的重大承诺、路线、关系、阵营或不可逆行为。**

节奏原则保持：

> **Compress dead time; stop at meaningful choice.**
>
> **压缩无意义时间，停在有意义选择。**

## 2.5 Narrative First，维护在后台

真实试玩确认：先输出玩家可读叙事，再在玩家阅读时进行后台维护，主观体验明显优于先维护后叙事。

因此：

> **Narrative first; maintenance afterward.**

后台维护完成通常不需要额外打断玩家。

## 2.6 知识边界非常重要

> **GM / Source / System knows X != NPC knows X.**

人物知识必须有世界内来源：亲历、身份渠道、被告知、传闻、观察、合理推断或显式超自然权限。

穿越者未来知识、系统私有信息、GM 计划和其它人物秘密不能因为模型知道就自动泄漏给 NPC。

这是长期沉浸感的重要底座。

## 2.7 Source 与 Game-local Reality 必须分离

Source / World Pack 负责：

> 游戏开始前，世界是什么样。

游戏开始后：

> **game-local reality > source default trajectory**

已经发生的战争、死亡、关系、职位、制度、历史分叉必须成为本局现实；Source 更新不能静默改写已有历史。

> **过去可以被继承，未来必须重新发生。**

## 2.8 UI 是世界真相的投影，不是第二真相

> **UI is a projection of game truth, not a second truth source.**

角色面板、地图、任务、关系、机制状态都应从权威世界状态投影，不应各自维护第二套独立游戏事实。

地图的 DSH 阶段设计也得到一个稳定结论：第一代地图应优先采用 **World Pack 作者定制地图 + 通用展示/当前位置标记**，而不是过早建设自动地图生成、GIS、寻路或世界地理数据库。

## 2.9 薄 Core + 窄确定性工具是有效方向

DSH 版最成功的确定性工具都位于真正需要程序保证的窄边界，例如：

- 真随机骰子；
- Save Snapshot；
- Restore；
- Save Policy；
- 路径与快照安全。

模型继续负责：

- 叙事；
- 内容创造；
- 语义判断；
- 人物表达；
- 复杂开放世界推理。

长期应保留：

> **Model authors candidates; Program / Domain Owner commits reality.**

但不要从这句话推导出“所有世界行为都必须先结构化成大型 Schema”。

---

# 3. Persistence / Save / Restore 的关键经验

## 3.1 Persistent State ≠ Save Point

这是 DSH 阶段最重要的语义发现之一。

```text
Persistent World State
= 现在这局实际是什么样

Save Point
= 某个可回退的时间线恢复点
```

两者不能混为一谈。

## 3.2 Restore 必须恢复“世界 + Agent 认知时间线”

DSH 真实故障证明：

> 文件恢复到 T2，但继续使用已经经历 T5 的 Agent Session，不是真正 Restore。

独立版必须从第一天把这些概念拆开：

- Game；
- Timeline；
- Save Point；
- World State；
- Agent Context；
- Conversation History。

Restore 成功标准应是：

```text
恢复世界状态
+
恢复 / 重建与该时间点一致的 Agent Context
+
被回滚的未来不能继续污染当前游戏
```

## 3.3 Save 身份必须是精确存储身份

DSH 阶段真实出现过多个目录共享 `SAVE-04` 展示 ID，导致 Restore 目标歧义。

经验：

> **玩家展示 ID 不能自动等于存储 Primary Key。**

未来任何 Save / Timeline 实现都要拥有稳定、唯一、不可歧义的内部 identity。

## 3.4 Restore 前保护是正确需求，但不应污染玩家存档列表

恢复前保护属于系统 recovery artifact，不是普通玩家 Save。

未来应该有清楚的：

```text
Player Save Namespace
!= Recovery / Protection Namespace
```

## 3.5 Save / Restore 正确性已验证，但 DSH 性能不可作为未来标准

DSH 版最终真实可用，但读取 / 恢复较慢。

当前项目接受它，是因为性能不是继续验证 RPG 产品假设的 blocker。

独立版应把原生快速 Save / Restore 当作设计目标，而不是继承 DSH 的文件替换 + Session 重建流程。

---

# 4. DSH Persistence 架构的价值与局限

## 4.1 Markdown-first Workspace 成功验证了语义

DSH Workspace 证明了这些概念值得存在：

- 当前场景 Resume Anchor；
- 玩家状态；
- 世界 / 人物 / 组织 / 地点；
- Mechanic State；
- Threads；
- Story Ledger；
- Recent Memory；
- Durable Changes；
- Save Snapshot。

同时证明：

> **一个事实应有明确 Owner。**

## 4.2 DELTAS + consolidation 是 DSH 上可接受的折中，不是未来 Runtime

DSH 上采用：

```text
每回合少量 durable DELTAS
↓
若干回合 / 场景后 consolidation
↓
批量更新 Owner projection
```

它成功避免每回合重写大量文件，但长期试玩确认了 eventual consistency：CURRENT / DELTAS 往往已经很新，而人物、THREADS、RECENT、机制 Owner 可能滞后数个回合。

用户接受这一点，是因为 DSH 版优先追求输出质量和玩家体验。

但独立版不应继承：

- 周期性大批量模型 consolidation；
- Markdown 作为主要 Runtime Database；
- 同一事实长时间等待归并才更新正式 projection。

独立版目标应是：

```text
Durable Mutation
↓
一次可靠提交
↓
Authoritative State 即时一致
↓
UI / Context / Save 从同一真相派生
```

具体数据库 / Event Log / Snapshot 技术由独立版实测决定，不在本复盘提前冻结。

---

# 5. 长局性能：DSH 的明确宿主债务

随着游戏从 184 推进到 199，出现明显：

- 上下文越来越重；
- 生成速度下降；
- edit 文件越来越慢；
- consolidation 越来越重；
- 长期 Owner 文档越来越大。

这不是继续优化 DSH 的高价值方向，而是独立版必须从架构层解决的要求。

未来至少需要：

- bounded context assembly；
- 只检索当前相关事实；
- 长期历史与当前工作集分离；
- 不把完整 transcript / 全部实体长期塞给模型；
- incremental authoritative mutation；
- 可压缩、可重建的 projection；
- 长局性能作为真实 UAT Gate，而不是短 Demo 成功就算完成。

---

# 6. NPC Agency：纸面人格不等于真实自主性

DSH 试玩中出现了明确模式：

```text
玩家提出方案
↓
聪明 NPC 分析风险
↓
指出一点问题
↓
总体同意
↓
帮助玩家执行
```

于是不同人物容易退化成：

> **不同说话风格的高级 Buff。**

人物卡里有性格、经历和立场，不足以保证自主性。

重要人物至少需要持续存在的运动向量：

```text
Current Agenda
Fear / Cost
Red Line
Obligation
Independent Next Move
```

尤其关键的是：

> **玩家不与这个人交互时，他下一步会自己做什么？**

NPC 可以主动：

- 调查；
- 写信；
- 交易；
- 结盟；
- 反对；
- 拖延；
- 隐瞒；
- 帮助；
- 处理自己的危机；
- 与第三方建立关系；
- 因自己的义务与玩家发生冲突。

好关系不等于永远同意。

真正有价值的中盘难度往往不是“敌人 DC 更高”，而是：

> **玩家成功以后，越来越多有真实利益、责任和立场的人开始互相冲突。**

---

# 7. 最重要的新失败：Persistent World 不等于 Autonomous Evolving World

这是 DSH 最后阶段最重要的发现。

The World 已经能做到：

- 世界状态长期存在；
- 历史事件持续记录；
- 原历史大势继续推进；
- 玩家行动产生长期后果。

但真实长局暴露：

> **玩家几乎成为世界唯一的“新历史创造源”。**

世界变化主要来自：

```text
A. Source / 原历史继续播放
B. 玩家行动 → 世界回应
```

缺少的是：

```text
C. NPC / Faction 在改变后的世界里，根据自己的目标主动做出新决策
```

## 7.1 Protagonist Causal Monopoly｜主角因果垄断

典型症状：

```text
Player
→ 可以改变世界

NPC
→ 可以回应玩家

Source History
→ 可以推动世界

NPC ↔ NPC
Faction ↔ Faction
Changed Fact → Distant Consequences
→ 明显偏弱
```

因此出现体验：

> **被玩家改变的历史，只有在玩家身边才真正发生改变。**

## 7.2 卢植 / 皇甫嵩是关键实证

本局中：

- 卢植避开原历史失势，破广宗、生擒张角、拜尚书；
- 皇甫嵩凉州全胜、长期在位、后来拜太尉；
- 两人的人物档都明确认为这会成为 189 政局重大变量。

但实际 189 的董卓政变链条仍高度接近原历史：何进死、宦官被诛、董卓入京、吕布杀丁原、废少帝、立献帝。

两位被玩家救下的重量级人物没有产生足够强的因果传播，最后又主要被吸回玩家势力。

这说明当前系统记住了：

> “人物被救了。”

却没有充分重新求解：

> “因为这个人物还在而且更强，其他所有人接下来会怎么改变自己的判断？”

## 7.3 Counterfactual Propagation｜反事实传播必须成为一等能力

当一个关键历史前提改变：

```text
Changed Fact
↓
Affected Actors / Factions
↓
他们的新 Belief / Opportunity / Threat
↓
他们自己的新行动
↓
行动碰撞
↓
新的世界结果
```

例如皇甫嵩和卢植更强，不意味着董卓一定失败。

正确目标是：

> **如果董卓仍然成功，他必须在一个已经改变的新棋盘上重新成功一次。**

不能让历史结果先存在，再倒补理由。

## 7.4 Source provides inertia, actors create history

未来正式原则：

> **Source provides inertia, actors create history.**
>
> **史料提供惯性，行动者创造历史。**

以及：

> **玩家改变历史，但不是唯一创造历史的人。**

> **Off-screen != Inactive.**
>
> **离开镜头，不等于停止行动。**

## 7.5 历史参考不应变成 Context Completion Anchor

DSH Workspace 曾在 active THREADS 中保存类似：

```text
未来（玩家知识，参考非剧本）：
某人将败亡 / 某事件将发生
```

虽然文字标明“参考非剧本”，但对语言模型而言，这仍然是强 completion anchor。

长期应避免把未来史实以“下一节点清单”的方式持续放进 GM 当前工作上下文。

更好的做法是：

- Source 作为可检索参考；
- 只有当前需要比较历史惯性时才读取；
- 当前世界状态与 Actor 动机优先；
- Future history 永远不能成为 event scheduler。

---

# 8. 自主世界不等于全世界逐 Tick 模拟

不要从上面的失败得出：

> “需要给每个 NPC 每回合跑一次 AI。”

那会产生不可控成本和复杂度。

长期方向仍是：

> **Persistent != Fully Simulated.**

但需要一个优先级 / 事件驱动的 World Evolution 层：

```text
时间推进 / 重大世界变化
↓
选择当前高影响 Actors / Factions / Fronts
↓
读取其 Goal / Belief / Resources / Relationships / Obligations / Threats
↓
生成或裁定各自下一步行动
↓
让行动互相碰撞
↓
提交 World Events / Durable Mutations
↓
GM 再决定哪些结果进入玩家叙事
```

> **世界先产生历史，GM 再从中组织玩家故事。**

---

# 9. 世界“反抗”玩家的正确含义

不要通过以下方式机械制造难度：

- 人为抬高 DC；
- 因为玩家变强就直接给敌人加数值；
- 无原因的逆风事件；
- 强行历史修正力。

真正的世界阻力来自：

- 别人的利益；
- 别人的责任；
- 别人的恐惧；
- 资源稀缺；
- 信息不对称；
- 制度与地理；
- 玩家成功引发的新联盟与防范；
- 被玩家帮助过的人也可能因自己的底线反对玩家。

甚至自主世界有时会主动帮助玩家。

世界是否“活着”的标准不是：

> “它是否经常惩罚玩家？”

而是：

> **“它是否会在没有玩家推动时，由自己的 Actor 继续产生合理的新事实？”**

---

# 10. DSH Host Debt｜明确不迁移

以下是 DSH 阶段的宿主适配或实验性实现，未来独立版默认不直接继承：

- DSH Session = RPG Timeline 的假设；
- Restore 后必须新建 DSH Session 的 workaround；
- `fs.watch` / Panel / Host 边界补丁；
- 周期性 consolidation 作为主一致性机制；
- DELTAS + 批量 Markdown edit 作为 Runtime 数据层；
- Markdown 作为默认权威 Gameplay Database；
- 通用 Agent Workspace 的 Owner IA 直接等于 Player UI IA；
- DSH plugin lifecycle 作为游戏生命周期；
- 为解决 DSH 局部限制而产生的临时兼容层。

这些实现可以保留为历史证据，但不构成下一代架构默认方案。

---

# 11. 独立版必须继承的测试方法

真实游玩是 The World 最有效的决策引擎。

下一代不能只靠 unit test / fixture / 短 Demo。

至少应保留以下产品 Gate：

## 11.1 Same-model Baseline Test

使用同一优秀模型比较：

```text
my world
vs
简单聊天 / DSH reference
```

新系统在核心 GM 质量、自由度、沉浸感上不能因为工程结构更漂亮而明显退步。

## 11.2 Long-session Performance Test

不是跑 10 回合，而是长时间推进：

- 多年游戏时间；
- 大量 NPC；
- 多势力；
- 大量历史事实。

观察：

- 生成速度；
- Context 大小；
- 状态提交耗时；
- Save / Restore；
- UI 响应；
- 世界一致性。

## 11.3 Restore Future-memory Isolation Test

Save → 继续产生未来 → Restore。

恢复后模型不得知道被回滚的未来。

## 11.4 Player Absence Test

把玩家置于偏远地点或让玩家一年不干预天下大势。

世界仍应发生由 NPC / Faction 自己推动的变化，而且不能只是 Source 时间表播放。

## 11.5 Counterfactual Propagation Test

人为改变一个重要历史前提，例如：

```text
卢植没有失势
皇甫嵩持续掌权
```

玩家不介入后续中央政治。

如果数年后世界仍只是按原历史节点换措辞：FAIL。

如果其他 Actor 的判断、联盟、战略和结果发生可解释变化：PASS。

## 11.6 Independent Actor Test

选择一个重要 NPC，问：

> 玩家一年不与他接触，他自己准备做什么？

未来推进后，其行动应与自己的目标和世界变化一致；除非中途新事实迫使其调整。

---

# 12. 对下一代项目的最终交接

The World / DSH 最大的价值不是提供一套应被复制的代码，而是已经用真实游戏回答了大量产品问题。

长期应保留：

```text
Natural-language freedom
Persistent game-local reality
Knowledge boundaries
Player authorization boundary
Meaningful-choice risk structure
Failure creates new situation
NPC actor semantics
World / Life dual loop
Narrative-first maintenance
Save / Timeline semantics
UI as projection
World Pack / Mod source separation
Thin deterministic seams
Real-playtest-driven development
```

长期必须重新设计：

```text
Authoritative persistence
Timeline / Agent Context
Context assembly
Long-session performance
World evolution
Counterfactual propagation
NPC / Faction autonomous action
Save / Restore lifecycle
Game-native UI lifecycle
```

长期明确丢弃：

```text
DSH host workarounds
Periodic model consolidation as runtime consistency
Markdown runtime database assumption
Source-future as active event schedule
Protagonist causal monopoly
```

最后把这次 DSH 实验压缩成四句话：

> **Persistent World 证明是必要的，但 Persistent World 不等于 Autonomous Evolving World。**

> **玩家可以改变历史，但不能成为唯一创造历史的人。**

> **史料提供惯性，行动者创造历史。**

> **世界独立存在，叙事聚光灯照向玩家。**
