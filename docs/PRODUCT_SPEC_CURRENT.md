---
title: The World｜产品与实验总纲
status: current-canonical-product-spec
version: 0.7
updated: 2026-08-25
stage: Post-Save-Restore / Authored Map v0.1
previous_stage: Reality Gate B PASS + Player-facing Save / Restore
next: The World Map v0.1 — Authored World Map Projection
reference_host: DeepSeek Harness
---

# The World｜产品与实验总纲 CURRENT

## 0. Product Identity

### Primary Purpose / Job To Be Done

把 **DeepSeek Harness** 从通用 Agent Harness 变成长期 RPG 游戏环境：让优秀模型主持一个真实持续、可长期演化、可跨 Session 恢复的 AI 世界，并逐步通过 RPG 专用插件获得机制、可视化、状态查询与沉浸体验。

### Reference Host

The World 第一公民宿主固定为 **DeepSeek Harness（DSH）**。

DSH 负责：

- Agent loop；
- Provider / Model；
- 通用工具；
- Session；
- 插件生命周期；
- 通用 UI / editor / host foundation。

The World 负责：

- World Core RPG Game Mode；
- reusable RPG assets；
- game-local persistent world；
- state / story / memory / saves 语义；
- fresh-session recovery；
- RPG UI / Map / Mechanics / Expansion Plugins；
- 与 DSH 的薄集成层。

原则：

> **DSH-native, not DSH-internal-coupled.**

### Canonical Stack

```text
DeepSeek Harness
+
World Core RPG Game Mode
+
Persistent World Workspace
+
RPG Experience / Mechanics Plugins
```

---

## 1. Core Value

玩家选择 The World，而不是直接对通用 Agent 说“主持 RPG”，是为了得到：

- 一个真实持续、会积累历史的世界；
- 跨长上下文 / 跨全新 DSH Session 仍可继续；
- 持续存在的人物、地点、关系、势力、承诺与后果；
- 不明显牺牲优秀模型创造力、角色表现、主动性与自由度的 GM；
- 稳定的 durable world maintenance；
- 玩家级 Save / Undo / Restore；
- RPG UI / Map / Mechanics 带来的真正游戏化体验。

产品价值概括：

> **真实持续的 AI 世界 + 优秀自由的 AI GM + RPG 专用游戏化能力。**

### Simple Baseline

```text
DeepSeek Harness
+
同一 Provider / Model
+
简单长期 RPG 主持要求
+
允许 Agent 自己按需使用文件
```

The World 必须证明自己提供的是 **DSH 之外的长期 RPG 产品价值**。

---

## 2. Product Promise

玩家应进入一个：

- 世界主动发生事情；
- 时间可以自然推进数日、数月乃至数年；
- 世界不会因为玩家存在就放弃因果与合理性；
- 玩家可以自然语言尝试任何行动；
- NPC / 势力 / 地点 / 冲突拥有持续身份；
- **重要 NPC 拥有自己的目标、义务、底线与离屏行动，不只是等待玩家交互的回应面；**
- 玩家行为产生可信、可延迟、可累积的后果；
- GM 主动把有意义的舞台组织到玩家身边；
- 但玩家不永远处于“被事件推着走”的状态；
- 大事件之间存在自由活动、日常、关系和人格塑造空间；
- 玩家可以选择主角操控粒度；
- Agent 自主维护后台文件；
- 全新 DSH Session 可以恢复为同一个世界；
- 长期机制状态可以通过 RPG UI 随时查看。

核心：

> **世界独立存在，叙事聚光灯照向玩家。**

> **世界产生历史，GM 从中为玩家组织故事。**

---

## 3. Core Player Journey

```text
选择世界 / 扩展内容
↓
选择或创建角色
↓
选择主角操控粒度（可随时调整）
↓
选择存档策略
↓
开始 / 继续游戏
↓
World Core 恢复并组装必要上下文
↓
GM 自由主持真实持续世界
↓
玩家行动 / 低价值过程可按授权托管
↓
世界给出后果并持续演化
↓
World Core 捕获 durable changes 并在检查点归并
↓
按策略建立恢复点
↓
玩家离开
↓
全新 DSH Session
↓
恢复同一个世界继续
```

玩家不承担 `state / story / memory / saves` 手工维护。

---

## 4. World Semantics

### 4.1 Persistent World + Player Spotlight

```text
Persistent != Fully Simulated
World Independence + Player Spotlight
```

- 世界在玩家视野外保持因果连续；
- 不要求所有实体逐回合 tick；
- GM 根据时间、人物目标、势力、冲突与玩家相关性选择离屏变化；
- 世界不围绕玩家存在，但叙事注意力优先服务玩家体验。

### 4.2 Durable Identity vs Simulation Priority

> **重要性决定注意力与模拟资源，不决定已经形成 durable identity 的实体是否存在。**

一个运行中产生的 NPC / 地点 / 关系 / 承诺 / 冲突，一旦形成会影响未来判断的 durable fact，就应进入 game-local reality。

之后可以降低：

- retrieval priority；
- 离屏模拟频率；
- UI prominence；

但不能从世界中消失。

### 4.3 Unlimited Attempt, Consequence-bound World

```text
Player owns Attempt
World owns Consequence
GM owns Playability of the Consequence
```

玩家拥有尝试权，不拥有结果控制权。

### 4.4 Knowledge Provenance / Epistemic Boundary

> **GM / Source / System knows X != NPC knows X.**

NPC 可使用的信息应能由世界内来源解释，例如：

- 亲历；
- 身份 / 职业 / 社会渠道；
- 被告知；
- 传闻；
- 可观察事实；
- 合理推断；
- 显式系统 / 超自然权限。

默认不得泄漏：

- GM 后台计划；
- 玩家系统私有信息；
- 穿越者未公开知识；
- 尚未发生的未来史实；
- 角色卡隐藏信息；
- 其它人物私有事实。

第一阶段不建设通用 Knowledge ACL DB；优先用 World Core context semantics 解决。

### 4.5 Pacing Elasticity / Life Layer

Bare DSH 主动推进世界是正向能力，但事件密度过高会让玩家始终处于响应模式，NPC 退化成纯功能角色。

The World 同时承认：

```text
World Loop
局势 → 事件 → 后果 → 时间推进

Life Loop
自由活动 → 日常 → 人物互动 → 关系 / 人格积累
```

正式原则：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

不使用机械“每 N 个事件休息一次”的节奏状态机。

### 4.6 NPC Agency｜NPC 是行动者，不是回应面

2026-08-25《乱世三国2》真实试玩确认：人物卡的纸面人格差异已经存在，但实际 GM 容易把重要 NPC 演成“不同口吻的高级 Buff”——玩家提出方案，NPC 分析风险后大体同意并帮助执行。

正式原则：

> **An NPC is not a response surface. An NPC is an actor with a life that continues without the player.**
>
> **NPC 不是等待玩家交互的回应面，而是即使玩家不理他也会继续行动的人。**

重要 NPC 应按需维持以下自然语言锚点，而不是统一机器 Schema：

```text
Current Agenda       他现在真正想推动什么？
Fear / Cost          他最怕失去什么？
Red Line             什么事情他现在绝不会接受？
Obligation           他对谁、对什么负有责任？
Independent Next Move 玩家暂时不管他，他下一步自己会做什么？
```

NPC 可以主动：调查、写信、交易、反对、帮助、拖延、行动、处理自己的危机、与第三方建立关系。

好关系不等于永远同意。玩家势力越成功，人物之间不同的利益、义务与政治立场越可以成为新的中盘玩法，而不是通过人工提高敌人数值来“平衡成功”。

人物自主性仍严格遵守知识边界，并继续遵循：

> **重要性决定注意力与模拟资源。**

不建设全世界逐回合 NPC 模拟器。

通用指南：`library/characters/NPC自主性与交互_GM指南_v0.1.md`。

---

## 5. Player Agency & Control

### 5.1 Player Agency = Authorization Boundary

Player Agency 不等于每个动作都必须由玩家手操。

> **GM 不得把宽泛玩家意图自动扩大成未授权的重大承诺、路线、阵营、关系或不可逆选择。**

### 5.2 Configurable Protagonist Control

候选模式：

- **Full Control**：绝大多数主角行动由玩家明确决定；
- **Light Delegation**：GM 可按目标、角色卡、性格与计划处理低价值步骤；
- **Narrative Delegation**：玩家主要决定目标和重大选择；GM 可按角色人格代行更多过程行为，但重大决策与不可逆行为仍应停下。

共同原则：

> **Compress dead time; stop at meaningful choice.**

玩家自然语言可以临时扩大 / 缩小授权，并可随时接管。

### 5.3 Meaningful Choice = Different Risk Structure

真实试玩确认：只让选项拥有不同叙事方向，而最后都落成相似的 `d20 + 修正 vs DC12/15`，会削弱玩家对“选择方法”的感受。

正式原则：

> **A meaningful choice should differ in risk structure, not only narrative direction.**
>
> **有意义的选择不仅结果方向不同，风险结构也应不同。**

行动路线的风险可以同时来自：

```text
可行性：直接成立 / 需要检定 / 当前不成立
固有难度：DC
情境态势：优势 / 普通 / 劣势
失败代价：时间 / 资源 / 暴露 / 关系 / 身份 / 伤害 / 局势升级
```

“失败改变局面，而不是关闭游戏”继续成立，但不同做法应让失败把局面推向不同方向。

优势 / 劣势不是装饰机制。人物人格、关系历史、准备、情报与沟通方式都可以真实改变一次行动的风险。

同时：

> **Dice decides uncertainty. Dice does not erase character.**
>
> **骰子裁定不确定性，不抹除人物。**

已稳定成立的人物底线不能因为一次天然 20 被随意击穿。

裁定细则见：`library/mechanics/判定与检定_Expansion_Pack_v0.1.md`。

---

## 6. Model Freedom & Recovery

正式原则：

> **Freedom Before Prevention.**

> **Prefer recovery over prevention.**

低成本错误优先：

```text
发现
→ Undo / Regenerate / 修正 / Restore
→ 继续游戏
```

确定性能力分两类：

1. **Product-value capability**：UI、Map、Combat、Politics、Economy、Character Progression 等，可由产品价值直接驱动；
2. **Preventive infrastructure**：validator、typed mutation、事务层等，必须由真实重复失败推动。

禁止因为理论风险重建第二版式重型 Runtime / Guardrail。

### 6.1 DSH Host Debt｜输出质量优先于宿主完美度

长期试玩确认当前两层维护天然存在 eventual consistency：DELTAS / CURRENT 可以比 characters / mechanics / THREADS / RECENT 更早反映最新世界事实，后者在 checkpoint consolidation 时集中收敛。

只要：

- durable facts 没有丢；
- DELTAS 继续是写入即生效的 authoritative facts；
- CURRENT 足够支撑当前场景；
- 新 Session 恢复没有明显错误；

当前 DSH 版允许部分 Owner 阶段性滞后。

不为此立即建设 typed mutation、通用状态数据库或高频 consolidation。

当前优先级：

> **GM 输出质量 / 角色表现 / 沉浸 / 玩家体验 > 为 DSH 消除所有内部状态滞后。**

这类问题记录到 `docs/FUTURE_STANDALONE_BACKLOG.md`，作为未来独立游戏 Host 的需求证据。

---

## 7. RPG UI Semantics

> **Chat 展示机制事件；UI 承载机制当前状态。**

Persistent RPG UI 典型 surface：

- System；
- Quest / Threads；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

> **UI is a projection of game truth, not a second truth source.**

Gate B 新增正式原则：

> **Workspace is organized for truth maintenance; UI is organized for player needs.**
>
> **工作区按事实归属组织，UI 按玩家需求组织。**

因此 Owner 文件与 UI 页面不是一一对应关系。RPG UI 可以跨 `CURRENT / PLAYER / characters / mechanics / THREADS` 聚合玩家可见事实，但不得把聚合结果持久化为第二套长期状态。

默认玩家界面不展示 file path、Owner 说明、source path、internal id、raw updated metadata 等开发信息；这些只属于 debug / inspect 层。

### Agent Trace Presentation

> **隐藏工作噪音，不限制 Agent 工作能力。**

DSH `think/read/write/tool` 默认不应占据 RPG 主阅读流，但保留 debug / inspect 入口。

---

## 8. TW-00.5 Bare DSH Probe Result

**Status：COMPLETE（2026-08-23）**

最终报告：`docs/experiments/BARE_DSH_PROBE_FINAL_2026-08-23.md`。

### Positive Evidence

- GM 文笔、自由度与角色表现优秀；
- 会主动推进世界与时间；
- 能自发创建 workspace；
- 能维护 GM Authority；
- 自然语言机制能直接工作；
- 能创造动态人物并利用伏笔；
- Player Spotlight 有明显正向表现；
- 轻度主角托管有产品价值。

### Confirmed Core Gaps

1. **Persistence Maintenance Attrition**：长局后文件维护衰减并最终停止；
2. **Dynamic Durable Entity Persistence**：运行中产生的人物 / 关系易漏写；
3. **Epistemic Boundary Leak**：NPC 可无来源继承 GM / System / future knowledge；
4. **Pacing Elasticity / Downtime**：事件过密，缺少生活与关系塑造空间；
5. **Agency Granularity**：自动推进需要授权粒度，而不是简单禁止。

### Product / Host Gaps

- Agent trace noise；
- Persistent RPG UI；
- player-facing Save / Restore；
- DSH 偶发 reasoning 完成但不 emit final response。

---

## 9. TW-01 Result｜Reality Gate A PASS

TW-01 的目标是：

> **让 AI GM 保留 Bare DSH 的自由与创造力，同时稳定承担长期世界维护和关键语义边界。**

截至 2026-08-24，基于长期三国真实试玩与玩家人工体验，Reality Gate A 正式 **PASS**。

正式裁定：`docs/experiments/GATE_A_FINAL_2026-08-24.md`。

TW-01 已形成的实际基础包括：

- World Core 0.4.x 薄职责层；
- Game Workspace Architecture v0.2；
- 两层 durable maintenance：每回合 DELTAS 捕获 + 检查点归并；
- dynamic durable identity；
- knowledge / exposure boundary；
- protagonist control authorization context；
- pacing elasticity；
- fresh-session recovery；
- Source 与 game-local reality 分离；
- player-confirmed Game Composition；
- 自动 / 手动 Save Policy。

TW-01 仍然不把以下内容吸收进 Core：

- 独立 Agent Runtime；
- typed mutation engine；
- narrative approval gate；
- universal entity schema；
- knowledge ACL database；
- 全量世界模拟器；
- Map / Combat / Economy engine。

---

## 10. Ownership

- `plugins/`：World Core + RPG Experience / Mechanics Plugins；
- `library/`：reusable Source Assets；
- `games/<game-id>/state/`：current game-local canonical reality；
- `mechanics/`：本局机制当前状态；
- `story/`：important history / commitments / consequences；
- `memory/`：DELTAS + lossy context compression / retrieval；
- `saves/`：explicit recovery points；
- `tools/`：narrow deterministic support；
- `docs/`：product / architecture / experiment truth。

---

## 11. Reality Gates

### Reality Gate A｜PASS

验收项：

1. **Want to Continue**；
2. **GM Quality Preserved**；
3. **Persistence Does Not Decay**；
4. **Dynamic Identity Survives**；
5. **Epistemic Boundaries Hold**；
6. **Cross-session Same World**；
7. **Player Plays, Agent Maintains**。

结果：**PASS（2026-08-24）**。

### Reality Gate B｜PASS

Gate B 问：

> **至少一个 RPG Experience / Mechanics Plugin 是否在真实游戏中 materially improve 玩家体验。**

结果：**PASS（2026-08-24）**。

正式裁定：`docs/experiments/GATE_B_FINAL_2026-08-24.md`。  
验收基线：`docs/GATE_B_ACCEPTANCE_v0.1.md`。

已验证：

1. **Material RPG Value**：Player Experience Redesign 后，玩家人工确认 Panel 已形成明显 RPG 玩家价值；
2. **Canonical Truth Projection**：UI 投影 workspace truth，不建立第二事实源；
3. **Player-facing Information Architecture**：页面围绕玩家问题，而不是围绕 Owner 文件；
4. **Does Not Damage the Game Loop**：不增加明显操作税，不损害 Gate A 已证明的自由 GM 循环；
5. **Not a Single-save Accident**：第二 fixture 证明不是当前三国测试档硬编码。

首个成功 RPG Experience vertical：`plugins/the-world-panel`。

---

## 12. First Real Vertical

仍使用：

> **三国历史 / 题材 Source 初始条件 + 原创玩家角色。**

正式语义：

- Source 定义开始前的世界；
- 游戏开始后 `game-local reality > source default trajectory`；
- 玩家可以改变历史；
- 已发生分叉不得为了贴回 Source 被静默修正。

`games/luan-shi-sanguo/` 已完成 Gate A 长局验证与 Gate B UI vertical 验证。  
`games/luan-shi-sanguo-2/` 继续承担 Post-Gate-B 长期真实试玩，已经验证：跨年时间压缩、自立路线、战争/治理/人物班底联动、Save/Restore 实用性，并暴露风险结构、NPC 自主性和 DSH consolidation eventual consistency 等新的产品证据。

---

## 13. Open Questions / Non-blocking

- **The World Map v0.1**：authored world map + current-location projection 是否 materially improve 长局空间认知；
- NPC Agency 指南能否让重要人物从“不同口吻的 Buff”变成真正需要区别相处的行动者；
- 现有优势/劣势与 risk-structure 纪律能否让不同方案产生明显不同的风险体验；
- protagonist control mode 最终 UI binding；
- Relationship / Faction 等后续 RPG plugin 的真实优先级；
- 当前过渡判定层是否最终演化为正式判定机制插件；
- DSH Developer Preview breaking-change 适配成本；
- consolidation eventual consistency、Restore latency 等宿主债务何时只记录而不再继续优化。

已不再作为当前阻塞项：

- player-facing Save / Restore 基础闭环；
- Restore fresh-session correctness；
- 为 DSH 消除所有 Owner 文件更新滞后。

---

## 14. Decision Ledger

- **DEC-P01** Reference Host = DSH；不自建通用 Agent Runtime。
- **DEC-P02** 核心价值 = World Core + Persistent World + RPG Plugins。
- **DEC-P03** Persistent World + Player Spotlight。
- **DEC-P04** Freedom Before Prevention；Prefer Recovery over Prevention。
- **DEC-P05** Player owns Attempt；World owns Consequence；GM owns Playability。
- **DEC-P06** 开始 → 游玩 → 自动维护 → 离开 → 全新 Session 恢复。
- **DEC-P07** 三国 Source 初始条件；game-local reality 优先。
- **DEC-P08** Gate A 后用 RPG Plugin 验证 Gate B。
- **DEC-P09** Importance controls attention, not existence。
- **DEC-P10** Chat 展示机制事件；UI 承载机制当前状态。
- **DEC-P11** 隐藏工作噪音，不限制 Agent 工作能力。
- **DEC-P12** Player Agency = Authorization Boundary；操控粒度可配置。
- **DEC-P13** Compress dead time; stop at meaningful choice。
- **DEC-P14** Baseline-first：先 Bare DSH Probe，再开发真实缺口。
- **DEC-P15** Knowledge Provenance：GM / Source / System knows X != NPC knows X。
- **DEC-P16** Pacing Elasticity：World Loop 与 Life Loop 同时存在，不用事件持续轰炸替代玩家生活。
- **DEC-P17** Persistence Maintenance Discipline：durable maintenance 是 World Core 稳定职责，不能随长局衰减消失。
- **DEC-P18** Game Composition = Player-Confirmed：新局组合必须经玩家确认，确认结果固化为 game-local canonical 配置并跨 Session 恢复。
- **DEC-P19** Reality Gate A = PASS（2026-08-24，真实长局人工体验裁定）。
- **DEC-P20** Workspace for Truth, UI for Player Needs：Owner Architecture != Player Information Architecture。
- **DEC-P21** Gate B = Material RPG Value Gate：插件必须真实改善玩家体验，不以功能数量或技术可行为 PASS 标准。
- **DEC-P22** Reality Gate B = PASS（2026-08-24，`the-world-panel` Player Experience Redesign 后人工裁定）。
- **DEC-P23** Restore Requires Fresh Session：恢复 workspace 后，不能继续使用包含未来历史的旧 DSH Session；必须进入恢复完成后新创建的 Session，或明确要求玩家新建 Session。
- **DEC-P24** Meaningful Choice Risk Structure：有意义的选择不仅叙事方向不同，还应在可行性、DC、优势/劣势或失败 stakes 上形成真实差异。
- **DEC-P25** Dice Does Not Erase Character：骰子裁定真实不确定性，不击穿已经成立的人物人格与底线。
- **DEC-P26** NPC as Actor：重要 NPC 是有独立目标、义务、底线和离屏下一步的行动者，不是等待玩家交互的回应面。
- **DEC-P27** DSH Eventual Consistency Accepted：只要 durable facts 不丢，Owner 文档阶段性滞后在当前 DSH 版可接受；GM 输出质量与玩家体验优先，宿主债务进入 Future Standalone Backlog。
- **DEC-P28** Authored Map First：地图初版由世界包作者定制，插件只负责展示与 canonical current-location projection；自动地图生成不是当前任务。

---

## 15. Current Decision

**Product Definition Gate：PASS。TW-00.5：COMPLETE。TW-01 / Reality Gate A：PASS。Reality Gate B：PASS。Player-facing Save / Restore：可用并进入维护期。**

Save / Restore 当前已验证：

- manual save；
- interval / milestone save policy；
- exact-target Restore；
- pre-restore recovery namespace；
- fresh-session boundary；
- Windows `fs.watch` / rename 冲突修复；
- 玩家真实恢复可用。

已知但接受：Restore 读取/切换较慢，记录为 DSH host debt，不继续作为当前产品主线。

2026-08-25 长局试玩新增产品结论：

- 强化 meaningful choice 的风险结构差异；
- 使用现有 advantage / disadvantage 表现方法与人物差异；
- 强化重要 NPC 自主性与独立行动；
- 接受 DSH consolidation 带来的 Owner eventual consistency；
- 当前优先 GM 输出质量、沉浸和真实玩家价值。

正式记录：`docs/experiments/PLAYTEST_FINDINGS_2026-08-25_RISK_NPC_AGENCY_DSH_DEBT.md`。

**下一项正式插件任务：**

> **The World Map v0.1 — Authored World Map Projection**

目标：世界包提供人工定制地图，地图插件负责展示、缩放/拖动，并根据 canonical 当前地点标注玩家位置。初版不做自动地图生成、GIS、路径规划、点击移动、动态 NPC / 势力态势。
