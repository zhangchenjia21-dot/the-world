---
title: The World｜Bare DSH RPG Capability Probe Final
status: closed-experiment
updated: 2026-08-23
experiment_branch: TEST
reference_host: DeepSeek Harness
result: COMPLETE
next: TW-01 Minimal World Core
---

# Bare DSH RPG Capability Probe｜最终结论

## 0. 结论

TW-00.5 Bare DSH Capability Probe 于 2026-08-23 停止继续试玩，进入正式开发阶段。

实验已经达到目的：证明了 **DeepSeek Harness + 强模型 + RPG 资产 + 极轻主持要求** 本身具有很强的 RPG 主持能力，同时暴露出一组长期 RPG 中稳定而具体的缺口。

因此项目正式从：

```text
TW-00.5 Bare DSH Capability Probe
```

切换为：

```text
TW-01 Minimal World Core
```

核心开发原则不变：

> **保留模型已经很强的主持能力，只把长期 RPG 必须稳定承担的后台职责与语义边界交给 World Core。**

> **Freedom Before Prevention. Prefer recovery over prevention.**

---

## 1. 实验形态

```text
DeepSeek Harness
+
优秀模型
+
三国题材 world / character / mechanics assets
+
极轻自然语言长期 RPG 主持要求
```

没有加入：

- World Core Plugin；
- The World state/story/memory/saves 强制规范；
- 每回合 checklist；
- schema / typed mutation；
- validator；
- The World RPG UI；
- 自定义 recovery runtime。

`TEST` 分支保留实验工作区与 checkpoint 历史，不直接作为正式产品架构。

说明：ChatGPT GitHub connector 在后半段长期滞后于用户实际 push，因此部分后期证据属于 **player-confirmed runtime evidence**，而不是 connector 直接读取到的最新 diff。用户最终明确确认：后期 DSH 已经停止继续修改游戏文件。

---

## 2. Bare DSH 已证明值得保留的能力

### P01｜优秀 GM 文笔与自由度

玩家持续反馈：裸 DSH 的叙事自然度、文笔、角色表现和自由感明显优于此前高约束方案。

产品含义：

> World Core 不能以可靠性为名把模型重新变成规则执行器。

### P02｜主动世界推进

DSH 会主动让世界事件发生，并能够推进数月甚至数年的时间跨度。

这是长期世界的重要正向能力，应保留。

### P03｜自发建立游戏工作区

开局时 DSH 自行建立过：

- `world_state.md`；
- `player_character.md`；
- `npc_relations.md`；
- `factions.md`；
- `locations.md`；
- `session_log.md`。

说明模型天然理解一部分 state / history 分工，不需要由 The World 从零教会。

### P04｜GM Authority

玩家的主观判断不会必然被当成世界事实；模型能够把它视为策略或推测，再独立裁定结果。

```text
Player owns Attempt
World owns Consequence
```

### P05｜自然语言机制资产可直接工作

人物能力、交涉、成长等机制资产已经能够直接参与模型 adjudication。

这支持：软性 RPG 机制优先自然语言化；只有真正需要确定性计算 / 可视化 /交互的部分再程序化。

### P06｜动态人物与伏笔组织能力

DSH 能创造符合当前时代、玩家身份和剧情规模的原创人物，并把人物与前文场景自然关联。

也能自然消费三国题材中的低层级人物，而不只调用名人。

### P07｜Player Spotlight

玩家表达“需要谋士”等方向时，模型能够组织出世界内合理机会，而不是机械召唤当前不可能接触的顶级名臣。

这一能力应保留，但长期仍需防止退化成“玩家点什么，世界立即供货什么”。目前不为此增加硬 Guardrail。

### P08｜可配置轻度代操具有产品价值

试玩发现 GM 自动处理赶路、采购、常规小动作等过程，能够显著降低玩家操作负担。

因此 Player Agency 的正确语义不是“GM 永远不能替玩家行动”，而是：

> **Player Agency = Authorization Boundary.**

候选操控粒度：Full Control / Light Delegation / Narrative Delegation。

---

## 3. Confirmed World Core Gaps

### Gap 01｜Persistence Maintenance Attrition｜长期持久化维护衰减

这是本次 Probe 最关键的最终发现。

早期 DSH 会积极创建并修改游戏文件；随着长局继续，文件维护逐渐减少。用户最终确认：**后期系统已经不再修改游戏文件。**

这意味着：

> **“模型知道应该有存档”不等于“模型会在几十小时游戏中持续承担持久化职责”。**

TW-01 必须让 durable maintenance 成为稳定的游戏模式职责，而不是依赖模型偶尔想起。

要求：

- 不要求每回合机械重写全部文件；
- 但每轮 / 重大阶段结束必须判断是否产生 durable change；
- 有变化则写回正确 Owner；
- 无变化则不写；
- 长局中该职责不能随上下文增长而自然消失。

### Gap 02｜Dynamic Durable Entity Persistence

运行中生成的人物会进入实际剧情、形成关系、伤情、承诺和未来后果，但可能长期不进入 NPC durable state。

正式原则：

> **Importance controls attention, not existence.**

未命名不等于不存在。

### Gap 03｜Epistemic Boundary / Knowledge Provenance Leak

实际出现 NPC 无来源获得系统 / GM / 历史未来知识的情况，例如 NPC 直接知道未来哪些人才会被曹操招募。

正式语义：

> **GM / Source / System knows X != NPC knows X.**

NPC 可使用的知识应能由世界内来源解释：

- 亲历；
- 身份 / 职业渠道；
- 被告知；
- 传闻；
- 可观察事实；
- 合理推断；
- 明确拥有的超自然 / 系统权限。

第一阶段不建设知识 ACL / 大型 provenance DB；先用薄语义与上下文分层解决。

### Gap 04｜Pacing Elasticity / Downtime Layer

DSH 主动推进世界是优点，但后期表现出事件密度过高：

```text
事件 → 事件 → 事件 → 事件
```

玩家缺少：

- 自由探索；
- 主动寻找目标；
- 日常生活；
- 休息；
- 与部下的非功能性交互；
- 人物关系和人格塑造空间。

结果是 NPC 容易退化为“谋士 / 武将 / 数据 / 功能”，而不像长期共同生活的人。

正式方向：

> **主动推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

可以同时存在：

```text
World Loop
世界局势 → 事件 → 后果 → 时间推进

Life Loop
自由活动 → 日常 → 人物互动 → 关系 / 人格积累
```

TW-01 只提供高层 GM pacing guidance，不构建机械“每 N 个事件休息一次”的状态机。

### Gap 05｜Agency Granularity / Meaningful Choice Boundary

GM 曾从“准备前往东线”一次推进到采购、出发、遭遇、自动接受投效、抵达目标。

最终结论不是禁止自动推进，而是：

> **Compress dead time; stop at meaningful choice.**

操控粒度由玩家模式和自然语言授权共同决定。

---

## 4. Product / UI / Recovery Gaps

这些不是第一版 World Core 必须全部完成，但属于已确认产品价值。

### UI-01｜Agent Execution Trace Noise

DSH 默认 `think/read/write/tool` 轨迹破坏 RPG 主阅读流。

原则：

> **隐藏工作噪音，不限制 Agent 工作能力。**

### UI-02｜Persistent RPG UI

长期机制状态不能只埋在聊天里。

> **Chat 展示机制事件；UI 承载机制当前状态。**

未来包括：Character / Relationship、Quest、System、Map、Faction、Inventory、Save / Restore、Control Mode 等。

### REC-01｜Player-facing Save / Rollback

Bare DSH workspace 是 mutable latest state，不是玩家级 checkpoint / restore system。

需要后续支持：Save / Undo / Regenerate / Restore / Branch。

---

## 5. Host Reliability Gap

### HOST-01｜Final Response Emission Failure

多次出现：DSH 完成 thinking / read / write 后没有输出玩家可见文本；玩家再次输入“输出”后才产生 final response。

当前判断：

> 更像 DSH Host / Agent turn completion reliability，而不是 GM 语义问题。

不应通过 RPG Prompt 强行修复。

后续若 DSH 上游仍存在，可由宿主/UI 做窄补救，例如检测“turn ended but no user-facing assistant message”并提供 continue / emit-final recovery。

---

## 6. Watch Items｜暂不做 Guardrail

### Player Desire Accommodation Bias

Player Spotlight 不应长期退化成按需供货，但单次合理满足属于优秀 GM 行为。

继续用真实体验判断，不建立人才稀缺状态机。

### Source Fidelity

需要以后明确正史 / 演义 / 混合 / 原创世界口径，但当前不建设复杂 provenance framework。

### Current State / History Duplication

未来继续观察 state / story / memory 长期增长；不因为可能重复就先引入 DB 或复杂 schema。

---

## 7. Final Product Interpretation

Bare DSH Probe 最终支持以下判断：

> **DSH + 强模型已经很会当 GM。The World 不应该主要负责“教模型怎么写故事”，而应该负责把优秀 GM 放进一个稳定的长期 RPG 游戏模式里。**

World Core 的价值集中在：

```text
Game Mode / Recovery Entry
+
Durable Maintenance Discipline
+
Knowledge / Exposure Boundary
+
Player Authorization Context
+
Minimal Pacing / World Semantics
```

而不是：

```text
Narrative Approval Engine
Typed Mutation Runtime
Heavy State Machine
Prevent-all-errors Guardrails
```

---

## 8. Transition to TW-01

TW-00.5：**COMPLETE**

下一阶段：

> **TW-01｜Minimal World Core**

TW-01 第一目标不是做 UI、地图、战斗或完整 Save 系统，而是验证：

1. World Core 能否持续要求 Agent 正确维护 durable game files；
2. 动态 NPC / 关系 / 承诺是否能可靠留下；
3. NPC knowledge boundary 是否稳定；
4. 世界仍保持 Bare DSH 的自由、文笔与主动性；
5. 长局 / 全新 Session 是否可以恢复同一个世界。

通过后进入 Reality Gate A，再开始第一个真正的 RPG Experience / Mechanics Plugin。