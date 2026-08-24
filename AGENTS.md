# The World｜Agent 协作与仓库规则

状态：current  
适用范围：整个 `the-world` 仓库

## 1. 当前阶段

```text
Product Definition Gate PASS
↓
TW-00.5 Bare DSH Capability Probe   ✓ COMPLETE
↓
TW-01 Minimal World Core            ← CURRENT
↓
Reality Gate A
↓
RPG Experience / Mechanics Plugin
↓
Reality Gate B
```

Canonical stack：

```text
DeepSeek Harness
+
World Core RPG Game Mode
+
Persistent World Workspace
+
RPG Experience / Mechanics Plugins
```

The World 不重造独立 Agent Runtime，也不继承 SillyTavern 的重型 Runtime / DB / typed mutation 路线。

## 2. Current Product Principles

正式工作不得偏离：

- **DSH-native, not DSH-internal-coupled**；
- **Persistent World + Player Spotlight**；
- **Persistent != Fully Simulated**；
- **Importance controls attention, not existence**；
- **Player owns Attempt / World owns Consequence / GM owns Playability**；
- **Player Agency = Authorization Boundary**；
- **Configurable Protagonist Control**：Full / Light / Narrative Delegation；
- **Compress dead time; stop at meaningful choice**；
- **GM / Source / System knows X != NPC knows X**；
- **World Loop + Life Loop**：推进世界，同时保留自由活动、日常、关系和人格塑造空间；
- **Freedom Before Prevention**；
- **Prefer recovery over prevention**；
- **Player Plays, Agent Maintains**；
- **Chat 展示机制事件；UI 承载机制当前状态**；
- **UI 是 game truth projection，不是第二事实源**；
- **隐藏工作噪音，不限制 Agent read/write/tool 能力**。

产品事实以 `docs/PRODUCT_SPEC_CURRENT.md` 为准。

## 3. Bare DSH Probe Final Evidence

TW-00.5 已结束。

最终报告：

`docs/experiments/BARE_DSH_PROBE_FINAL_2026-08-23.md`

关键真实失败：

1. 长局后 **Persistence Maintenance Attrition**：文件维护逐渐衰减并最终停止；
2. Dynamic NPC / durable entity 易漏写；
3. NPC knowledge provenance 会泄漏；
4. 事件密度过高，缺少 downtime / life layer；
5. 主角自动推进需要可配置授权粒度；
6. DSH 偶发 reasoning 完成但没有 emit final，归 Host reliability。

禁止把 Bare DSH 偶然目录结构直接提升为正式架构。

## 4. TW-01 World Core Boundary

World Core 是**薄职责层**。

当前 Required Behaviors：

- game entry / continue / fresh-session recovery；
- player-confirmed game composition：新局的 World / Player Character / Expansion / Control Mode 由玩家确认并固化为 game 配置，Optional expansion 不得由 Agent 静默启用；
- bounded GM / world / workspace context；
- durable maintenance responsibility 不随长局消失；
- dynamic durable entity / relationship / commitment / consequence 写回；
- knowledge / exposure boundary；
- protagonist control authorization context；
- minimal pacing elasticity semantics；
- Source / game-local reality separation。

World Core 默认不应变成：

- narrative approval gate；
- typed mutation engine；
- universal schema / DSL；
- entity DB；
- knowledge ACL DB；
- 玩家行为白名单；
- 模型创作白名单；
- 每回合固定 rewrite 全部文件；
- 全世界逐实体模拟器。

详细计划：`docs/TW-01_WORLD_CORE_PLAN.md`。

## 5. Durable Maintenance Rule

Bare DSH 最关键失败是后期不再写游戏文件。

因此 TW-01 必须稳定执行：

> **本轮 / 本阶段是否产生未来仍需成立的变化？**

候选：

- 新 durable NPC；
- 关系 / 承诺 / 债务 / 仇恨；
- 同伴 / 敌对 / 雇佣；
- 持续伤情 / 能力；
- 任务长期状态；
- 地点 / 势力 / 世界变化；
- 重大资源变化；
- unresolved consequence；
- 大幅时间推进。

有变化 → 更新正确 Owner。  
无变化 → 不机械写文件。

玩家不负责提醒 Agent 保存。

## 6. Knowledge Boundary

概念上区分：

```text
GM / Total Repository Knowledge
Game Canonical Reality
Player / Character Knowledge
NPC-local Knowledge
```

同一个模型可以访问多个层，但不能自动传播。

NPC 使用信息必须有世界内来源；未来史实、系统私有信息、隐藏角色卡信息不能无来源借 NPC 的嘴说出。

第一阶段用薄 context semantics，禁止提前建设通用 ACL / provenance database。

## 7. Pacing Boundary

保留模型主动推进数月 / 数年的能力。

但：

> **推进世界，不等于持续往玩家脸上投事件。**

同时维护：

```text
World Loop
局势 / 事件 / 后果 / 时间推进

Life Loop
自由活动 / 日常 / 人物互动 / 关系与人格积累
```

不要用固定 N 回合节奏状态机。

## 8. Repository Ownership

- `docs/`：product / architecture / experiment truth；
- `plugins/`：World Core + RPG Experience / Mechanics Plugins；
- `library/`：reusable Source Assets；
- `games/<game-id>/state/`：current game-local canonical reality；
- `story/`：important history / commitments / consequences；
- `memory/`：lossy context compression / retrieval；
- `saves/`：explicit recovery points；
- `tools/`：narrow deterministic support。

## 9. Authority Order

发生冲突时：

1. 用户当前明确指令；
2. `docs/PRODUCT_SPEC_CURRENT.md`；
3. `docs/ARCHITECTURE_CURRENT.md`；
4. 当前 game canonical state；
5. story / memory；
6. `README.md`；
7. experiment evidence；
8. 跨项目方法论 / Skill；
9. 历史聊天 / 旧摘要。

## 10. Formal Task Reading Order

```text
README.md
→ AGENTS.md
→ docs/PRODUCT_SPEC_CURRENT.md
→ docs/ARCHITECTURE_CURRENT.md
→ docs/TW-01_WORLD_CORE_PLAN.md（TW-01 任务）
→ 当前 game / plugin / asset direct Owner
```

只读取最小充分工作集，不为“完整”全仓扫描。

## 11. Freshness & Writeback

正式开发前先核验 GitHub `main` current。

写回前重新取得目标文件 SHA，避免旧副本覆盖新修改。

用户在本聊天中已经明确：**不要自动写 GitHub；只有用户明确要求更新 / 提交时才执行写操作。**

## 12. Markdown-first

第一阶段：

- 人 / Agent 共同理解内容 → Markdown 优先；
- 真正需要机器计算 / 校验 → 再结构化；
- 真正需要查询 / 原子性 / 并发 / 性能 → 再考虑 DB / Service。

格式服务产品，不反过来定义产品。

## 13. Reality Gate A

至少证明：

- Want to Continue；
- GM Quality Preserved；
- Persistence Does Not Decay；
- Dynamic Identity Survives；
- Epistemic Boundaries Hold；
- Cross-session Same World；
- Player Plays, Agent Maintains。

Gate A 通过后再进入首个真正 RPG Experience / Mechanics Plugin。

## 14. Public Repository Safety

本仓库是 public。

禁止提交秘密、凭证、私密个人内容、私密聊天原文，以及无权公开的版权 / 保密材料。