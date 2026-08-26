# The World｜Agent 协作与仓库规则

状态：current  
适用范围：整个 `the-world` 仓库

## 1. 当前项目状态

The World / DSH 长期真实试玩阶段已基本完成。

```text
Bare DSH Probe            ✓ COMPLETE
Reality Gate A            ✓ PASS
Reality Gate B            ✓ PASS
Save / Restore            ✓ real-use usable
Long-play DSH experiment  ✓ substantially complete
↓
Reference implementation / evidence archive
↓
Lessons feed successor project: my-world
```

当前默认目标不是继续扩建 DSH 游戏引擎，而是：

- 保留可玩的参考实现；
- 保留真实长局、失败案例与工程证据；
- 维护必要文档；
- 只有用户明确提出新的 DSH 实验或维护任务时才继续实现。

不要因为看到旧 Roadmap / Gate 文档而自动恢复已经结束的阶段任务。

## 2. Authority Order

发生冲突时按以下顺序：

1. 用户当前明确指令；
2. `docs/DSH_GAME_TEST_LESSONS_CORE.md` — DSH 长局实验最终核心经验；
3. `docs/PRODUCT_SPEC_CURRENT.md` — 最后活跃阶段的产品规格与稳定产品语义；
4. `docs/ARCHITECTURE_CURRENT.md`；
5. 当前 game canonical state；
6. 当前代码 / tests / plugin implementation；
7. experiment evidence；
8. README；
9. 历史聊天 / 旧摘要 / superseded 任务。

如果任务是为 `my-world` 提取经验，优先使用 `docs/DSH_GAME_TEST_LESSONS_CORE.md`，不要从旧实现形态反推新架构。

## 3. 最终稳定产品原则

长期参考应保留：

- **世界独立存在，叙事聚光灯照向玩家**；
- **Persistent != Fully Simulated**；
- **Player owns Attempt / World owns Consequence / GM owns Playability**；
- **Freedom Before Prevention / Prefer recovery over prevention**；
- **Player Agency = Authorization Boundary**；
- **Compress dead time; stop at meaningful choice**；
- **GM / Source / System knows X != NPC knows X**；
- **World Loop + Life Loop**；
- **Importance controls attention, not existence**；
- **UI is a projection of game truth, not a second truth source**；
- **Source 与 game-local reality 分离**；
- **game-local reality > source default trajectory**；
- **Meaningful Choice 应有不同 risk profile**；
- **Dice decides uncertainty. Dice does not erase character**；
- **NPC 是 Actor，不是 response surface**；
- **Narrative first; maintenance afterward**；
- **Persistent State != Save Point**；
- **Model authors candidates; Program / Domain Owner commits reality**。

最后阶段新增的最高优先级原则：

> **Persistent World != Autonomous Evolving World.**

> **玩家改变历史，但不是唯一创造历史的人。**

> **Source provides inertia, actors create history.**

> **Off-screen != Inactive.**

## 4. 最终最重要失败：Protagonist Causal Monopoly

长期三国试玩确认：当前 DSH 版虽然能维持持久世界，但容易形成：

```text
Source History → 推动世界
Player → 改变世界
NPC → 回应 Player
```

而以下链条偏弱：

```text
NPC ↔ NPC
Faction ↔ Faction
Changed Fact → Distant Consequences
Off-screen Actor → Independent Action
```

卢植 / 皇甫嵩被玩家大幅改变但 189 洛阳政局仍高度靠近原历史，是关键实证。

以后分析任何历史沙盒或自主世界问题，必须区分：

- Persistent World；
- Autonomous Evolving World；
- Counterfactual Propagation；
- Player Spotlight；
- Full Simulation。

不要把解决方案误写成“全世界每个 NPC 每回合 tick”。

## 5. DSH 实现的最终边界

DSH 版可继续保留：

- World Core；
- Workspace；
- Save / Restore；
- deterministic dice；
- Panel / RPG projection；
- Source library；
- 真实 games evidence。

但以下是 Host Debt / experiment implementation，不是下一代默认架构：

- DSH Session workaround；
- fresh-session Restore seam；
- `fs.watch` Restore workaround；
- periodic model consolidation 作为主一致性；
- DELTAS + bulk Markdown edit Runtime；
- Markdown gameplay database assumption；
- DSH plugin lifecycle = game lifecycle；
- generic Agent Workspace IA = Player IA；
- Future Source history 作为 active event checklist。

## 6. Repository Ownership

- `docs/`：产品、架构、实验、最终经验；
- `plugins/`：DSH 参考实现；
- `library/`：reusable Source assets；
- `games/`：真实 game-local reality / playtest evidence；
- `tools/`：窄确定性支持能力。

真实试玩档尤其 `games/luan-shi-sanguo-2/` 是证据，不因“清理仓库”随意改写、压平或删除。

历史 protection saves 也是 recovery evidence；除非用户明确要求且风险已评估，不自动删除。

## 7. Formal Task Reading Order

普通 DSH 维护 / 复盘：

```text
README.md
→ AGENTS.md
→ docs/DSH_GAME_TEST_LESSONS_CORE.md
→ 与本任务直接相关的 current code / game / experiment
```

若任务需要最后活跃阶段的细节，再读：

```text
docs/PRODUCT_SPEC_CURRENT.md
docs/ARCHITECTURE_CURRENT.md
```

不要默认阅读整个仓库。

## 8. Future my-world Handoff

独立项目：

`https://github.com/zhangchenjia21-dot/my-world`

迁移原则：

> **迁移经验，不迁移宿主债务。**

The World 只能作为：

- 产品证据；
- 失败案例；
- 语义参考；
- UAT baseline。

不得把当前 DSH 目录、Session、Markdown consolidation、Plugin Lifecycle 直接当成 `my-world` 的架构模板。

## 9. Freshness & Writeback

正式修改前先核验 GitHub `main` current。

写回前重新取得目标文件 SHA，避免旧副本覆盖新修改。

用户已明确授权：完成的仓库修改可自行 commit 并 push 到 `main`，无需逐次请示。仍应只修改明确相关路径，不覆盖未知并行改动。

## 10. Public Repository Safety

本仓库是 public。

禁止提交秘密、凭证、私密个人内容、私密聊天原文，以及无权公开的版权 / 保密材料。
