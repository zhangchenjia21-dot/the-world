# The World

> 一个以 **DeepSeek Harness + World Core + 持久世界工作区 + RPG 专用插件** 为核心的 Agent-native 长期 RPG 项目。

**TW-00.5 Bare DSH Capability Probe：COMPLETE**  
**TW-01 / Reality Gate A：PASS（2026-08-24）**  
**当前阶段：Reality Gate B / RPG Experience Validation**

The World 不重造独立 Agent Runtime。它以 **DeepSeek Harness（DSH）** 为 Reference Host，把通用 Agent 系统性地 RPG 化。

```text
DeepSeek Harness
+
World Core RPG Game Mode
+
Persistent World Workspace
+
RPG Experience / Mechanics Plugins
=
可长期游玩的 AI RPG 游戏环境
```

---

## 1. 当前项目结论

Bare DSH 真实试玩已经证明：

> **DSH + 强模型已经很会当 GM。The World 的价值不是重新教模型写故事，而是让这个优秀 GM 稳定运行在一个长期、可恢复、像游戏的世界里。**

World Core 与长期三国试玩随后通过 Reality Gate A，证明：

- GM 文笔、主动性与自由度可以保留；
- durable maintenance 不再自然衰减为 0；
- 动态人物 / 关系 / 承诺可以形成长期身份；
- `GM / Source / System knows X != NPC knows X` 可以作为稳定语义边界；
- 全新 DSH Session 可以恢复同一个世界；
- 玩家不需要充当文件管理员。

当前工作已经进入 **Gate B**：验证至少一个 RPG 专用插件是否真的让玩家体验 materially better。

核心文档：

- [产品总纲](docs/PRODUCT_SPEC_CURRENT.md)
- [当前架构](docs/ARCHITECTURE_CURRENT.md)
- [Game Workspace Architecture v0.2](docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md)
- [Gate A Final](docs/experiments/GATE_A_FINAL_2026-08-24.md)
- [Gate B Acceptance](docs/GATE_B_ACCEPTANCE_v0.1.md)

---

## 2. 产品原则

### Persistent World + Player Spotlight

> **世界独立存在，叙事聚光灯照向玩家。**

> **世界产生历史，GM 从中为玩家组织故事。**

### Freedom Before Prevention

> **Freedom Before Prevention. Prefer recovery over prevention.**

玩家可以尝试任何行动；世界解释后果；GM 让后果值得继续玩。

### Knowledge Provenance

> **GM / Source / System knows X != NPC knows X.**

NPC 的知识必须能由其世界内经历、身份、渠道、传闻、观察、推断或显式超自然权限解释。

### Player Agency

> **Player Agency = Authorization Boundary.**

> **Compress dead time; stop at meaningful choice.**

主角操控支持 Full / Light / Narrative Delegation，并允许玩家随时自然语言接管。

### RPG UI

> **Chat 展示机制事件；UI 承载机制当前状态。**

> **工作区按事实归属组织，UI 按玩家需求组织。**

UI 是 game truth 的投影，不是第二事实源；Owner Architecture 不等于 Player Information Architecture。

---

## 3. Current Stack

```text
DeepSeek Harness
↓
World Core 0.4.x
↓
Game Workspace Architecture v0.2
↓
DSH-native Source Assets
↓
RPG Experience / Mechanics Plugins
```

### World Core

当前职责：

- New Game Setup / Game Composition；
- fresh-session recovery；
- 两层 durable maintenance；
- dynamic durable identity；
- knowledge / exposure boundary；
- protagonist control context；
- pacing elasticity；
- Save Policy 协调。

后台维护：

```text
每回合
→ memory/DELTAS.md 捕获 1–3 条 durable facts

检查点
→ 归并到正确 Owner
→ 刷新 RECENT
→ 需要时建立 Save Point
```

### Persistent Game Workspace

```text
games/<game-id>/
├─ COMPOSITION.md
├─ state/
│  ├─ CURRENT.md
│  ├─ PLAYER.md
│  ├─ THREADS.md
│  ├─ WORLD.md            # 按需
│  ├─ characters/
│  ├─ organizations/      # 按需
│  └─ places/             # 按需
├─ mechanics/
├─ story/
├─ memory/
└─ saves/
```

核心约定：

- 一个事实只有一个 Owner；
- 实体只存一次，分类是属性；
- Source 与 game-local reality 分离；
- `game-local reality > source default trajectory`；
- Persistent State ≠ Save Point。

---

## 4. Current Gate B Vertical｜the-world-panel

首个 RPG Experience Plugin：[`plugins/the-world-panel`](plugins/the-world-panel)。

当前已经证明：

- DSH Web UI plugin 路线成立；
- `dsh-better-sidebar` 集成成立；
- game workspace → Node projection → Web UI 成立；
- `fs.watch + SSE` 自动刷新成立；
- Thread 归档这类窄确定性交互成立。

当前核心问题不是继续堆页面，而是：

> **把“Workspace Inspector 的 RPG 皮肤”重构成真正围绕玩家状态、关系、资源、机制和决策设计的 RPG 界面。**

当前实现任务：

- [Gate B Panel Player Experience Redesign｜KimiCode Task](docs/experiments/GATE_B_PANEL_PLAYER_EXPERIENCE_REDESIGN_KIMICODE_TASK_2026-08-24.md)

Gate B 不要求 Map、Combat、Save UI、Faction UI 等全部完成；只要求第一个 RPG 插件证明它值得玩家保留。

---

## 5. Source Assets

`library/` 保存可复用 Source，不保存单局当前事实。

```text
library/
├─ worlds/
├─ characters/
├─ mechanics/
└─ lore/
```

当前首个真实 vertical 仍是：

> **汉末三国 Source 初始条件 + 原创玩家角色 + 开放历史。**

游戏开始后，Source 只提供参考与开局前事实，不能把已经发生分叉的世界强行修回原历史。

---

## 6. Repository Architecture

```text
the-world/
├─ README.md
├─ AGENTS.md
├─ docs/
├─ plugins/
├─ library/
├─ games/
└─ tools/
```

- `plugins/`：World Core、RPG UI、Map、Mechanics；
- `library/`：可复用 Source Assets；
- `games/`：活的 game-local reality；
- `tools/`：窄而确定性的支持能力；
- `docs/`：产品、架构、实验与 Gate truth。

---

## 7. Current Development Route

```text
Product Definition Gate                 ✓ PASS
↓
TW-00.5 Bare DSH Capability Probe       ✓ COMPLETE
↓
TW-01 Minimal World Core                ✓
↓
Reality Gate A                          ✓ PASS
↓
Gate B first vertical: the-world-panel  ← CURRENT
↓
Player Experience Redesign
↓
Reality Gate B
↓
根据真实试玩决定下一批 RPG Plugins
```

当前不以“功能数量”代替阶段进展。

---

## 8. Public Repository Safety

本仓库是 public。

不得提交 API Key、Token、Cookie、密码、私钥、私密聊天原文、不希望公开的个人信息，以及无权公开的版权 / 保密材料。

---

## 9. Current Decision

**Gate A 已通过。现在的首要任务是让第一个 RPG UI 从“能读取工作区”跨到“真正为玩家服务”，并用真实试玩判断 Gate B 是否 PASS。**
