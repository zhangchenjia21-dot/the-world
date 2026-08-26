# The World

> 基于 **DeepSeek Harness + World Core + Persistent World + RPG Plugins** 的长期 AI RPG 参考实现与真实试玩实验仓库。

**Bare DSH Capability Probe：COMPLETE**  
**Reality Gate A：PASS**  
**Reality Gate B：PASS**  
**Player-facing Save / Restore：真实使用可用**  
**DSH 长局产品测试：2026-08-26 起基本完成，进入参考实现 / 经验库状态**

---

## 1. 当前项目定位

The World 已经完成它最重要的任务：

> **用真实长局验证“优秀模型 + 长期持续世界 + RPG 专用能力”是否能形成有沉浸感、值得继续玩的对话式 AI RPG。**

结论是：**可以。**

但长期试玩也确认 DSH 并不是最终游戏 Host。随着游戏推进多年、世界事实和人物增多，生成上下文、文件 edit、consolidation 与 Restore 等宿主边界越来越重；同时最后阶段暴露了比持久化更深的问题——**Persistent World 不自动等于 Autonomous Evolving World**。

因此当前正式方向不是继续把 DSH 改造成完整游戏引擎，而是：

- 保留 The World 作为可玩的参考实现；
- 保留真实长局与失败案例作为产品证据；
- 把已验证经验迁移到独立项目 [`my-world`](https://github.com/zhangchenjia21-dot/my-world)；
- 不迁移 DSH 宿主债务。

核心经验文档：

- **[DSH 游戏测试核心经验教训](docs/DSH_GAME_TEST_LESSONS_CORE.md)** ← 当前最重要的实验收口参考
- [产品总纲](docs/PRODUCT_SPEC_CURRENT.md)
- [当前架构](docs/ARCHITECTURE_CURRENT.md)
- [Game Workspace Architecture v0.2](docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md)
- [Gate A Final](docs/experiments/GATE_A_FINAL_2026-08-24.md)
- [Gate B Final](docs/experiments/GATE_B_FINAL_2026-08-24.md)

---

## 2. 已验证的核心价值

真实试玩已经证明：

- 强模型可以保留优秀 GM 文笔、主动性与创造力；
- 玩家可以用自然语言自由尝试，而不是被封闭选项树限制；
- 长期人物、关系、承诺、地点、势力与历史后果可以形成 durable reality；
- `GM / Source / System knows X != NPC knows X` 是必要且可用的知识边界；
- 新 Session 可以恢复同一世界；
- Save / Restore 语义成立；
- RPG UI / 机制 / 地图等游戏 Surface 有明确价值；
- 玩家不需要充当文件管理员；
- 真实长局是比纸面架构更有效的产品决策工具。

核心产品原则仍然成立：

> **世界独立存在，叙事聚光灯照向玩家。**

> **Player owns Attempt; World owns Consequence; GM owns Playability.**

> **Freedom Before Prevention. Prefer recovery over prevention.**

> **Compress dead time; stop at meaningful choice.**

> **UI is a projection of game truth, not a second truth source.**

---

## 3. 最后阶段最重要的新发现

### Persistent World != Autonomous Evolving World

The World 已经很会“记住世界”，但最后的三国长局暴露：

- 原历史 / Source 会继续推动大势；
- 玩家行动会改变世界；
- NPC 大多会回应玩家；
- 但 NPC ↔ NPC、Faction ↔ Faction、离屏行动、反事实传播仍然不足。

于是形成：

> **Protagonist Causal Monopoly｜主角因果垄断**

也就是玩家几乎成了世界唯一的新历史创造源。

本局中卢植、皇甫嵩的命运被大幅改写，但这种改变没有充分传播到 189 洛阳政局；很多历史事件仍高度接近原轨迹。这个案例最终确认：

> **玩家改变历史，但不能是唯一创造历史的人。**

> **Source provides inertia, actors create history.**
>
> **史料提供惯性，行动者创造历史。**

> **Off-screen != Inactive.**
>
> **离开镜头，不等于停止行动。**

未来独立版需要的是优先级 / 事件驱动的 World Evolution，而不是全世界逐 NPC tick。

完整分析见：[DSH 游戏测试核心经验教训](docs/DSH_GAME_TEST_LESSONS_CORE.md)。

---

## 4. DSH 实现中值得保留的经验

应继承的是产品语义：

- Source 与 game-local reality 分离；
- Dynamic durable identity；
- Knowledge provenance；
- Player authorization boundary；
- World Loop + Life Loop；
- Meaningful Choice 的不同风险结构；
- Advantage / Disadvantage；
- Dice decides uncertainty, not character；
- Narrative first, maintenance afterward；
- Persistent State ≠ Save Point；
- Timeline / Agent Context / Conversation 必须区分；
- 一个事实应有明确 canonical owner；
- 薄 Core + 窄确定性工具；
- World Pack / Mod；
- authored-first 地图方向。

---

## 5. 明确不作为下一代模板的 DSH 实现

以下保留为历史证据，不应直接搬入独立版：

- DSH Session workaround；
- Restore 后 fresh DSH Session seam；
- `fs.watch` Restore workaround；
- 周期性 model consolidation 作为主一致性机制；
- DELTAS + 批量 Markdown edit 作为 Runtime 数据层；
- Markdown 默认充当 gameplay database；
- DSH Plugin Lifecycle 充当 Game Lifecycle；
- 通用 Agent Workspace 的目录 IA 直接决定玩家 UI；
- Future Source history 长期作为 active context event checklist。

总原则：

> **迁移经验，不迁移宿主债务。**

---

## 6. Repository Architecture

```text
the-world/
├─ docs/        # 产品、架构、实验与最终经验
├─ plugins/     # DSH World Core / Panel / RPG plugins
├─ library/     # reusable Source Assets
├─ games/       # 真实试玩 game-local reality
└─ tools/       # 窄确定性支持工具
```

`games/luan-shi-sanguo-2/` 是最重要的长期真实试玩证据之一，不应为了仓库整洁随意重写或删除。

---

## 7. 下一代项目

独立项目：

[`zhangchenjia21-dot/my-world`](https://github.com/zhangchenjia21-dot/my-world)

目标形态：

- Godot 4.7.2 为第一 Foundation；
- 2D 对话式 AI RPG / 互动小说；
- 本地优先；
- 长期单人；
- 角色立绘 / 场景 / 地图 / RPG UI；
- World Pack / Mod 一级能力；
- 原生 Game / Timeline / Save / Agent Context；
- Autonomous Evolving World。

The World 此后主要为它提供**产品证据与经验**，而不是代码迁移模板。

---

## 8. Public Repository Safety

本仓库是 public。

不得提交 API Key、Token、Cookie、密码、私钥、私密聊天原文、不希望公开的个人信息，以及无权公开的版权 / 保密材料。
