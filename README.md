# The World

> 一个以 **DeepSeek Harness + World Core + 持久世界工作区 + RPG 专用插件** 为核心的 Agent-native 长期 RPG 项目。

**当前状态：TW-00.5 Bare DSH Capability Probe COMPLETE**  
**当前阶段：TW-01 / Minimal World Core**

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

Bare DSH 真实试玩已经完成。最终结论不是“DSH 不适合 RPG”，恰恰相反：

> **DSH + 强模型已经很会当 GM。The World 的价值不是重新教模型写故事，而是让这个优秀 GM 稳定运行在一个长期、可恢复、像游戏的世界里。**

Probe 最终报告：[`docs/experiments/BARE_DSH_PROBE_FINAL_2026-08-23.md`](docs/experiments/BARE_DSH_PROBE_FINAL_2026-08-23.md)

TW-01 实施计划：[`docs/TW-01_WORLD_CORE_PLAN.md`](docs/TW-01_WORLD_CORE_PLAN.md)

---

## 2. Bare DSH 已证明值得保留的能力

- **GM 文笔与自由度**：叙事自然、主动、角色表现强；
- **主动世界推进**：会让时间按月甚至按年推进，让历史持续发生；
- **动态人物创造**：能生成符合时代、身份与当前规模的人物，并与前文形成伏笔呼应；
- **GM Authority**：玩家推测不会自动成为世界事实；
- **自然语言机制 adjudication**：人物能力、交涉、成长等资产可直接参与判断；
- **Player Spotlight**：能把玩家方向组织成世界内合理机会；
- **轻度主角托管**：自动处理低价值小事具有明显减负价值。

这些能力是后续开发必须保护的 baseline。

---

## 3. Bare DSH 已确认的核心缺口

### 3.1 Persistence Maintenance Attrition

开局时 DSH 会主动建立并维护游戏文件，但长局后维护逐渐衰减。Probe 最终由玩家确认：**后期系统已经不再修改游戏文件。**

因此 TW-01 第一职责是：

> **把 durable world maintenance 从“模型偶尔想起的行为”变成稳定的 Game Mode responsibility。**

### 3.2 Dynamic Durable Identity

运行中产生的人物、关系、承诺、伤情和后果会被剧情使用，却可能没有进入长期状态。

> **Importance controls attention, not existence.**

未命名、非历史名人、低重要度都不是不保存 durable identity 的理由。

### 3.3 Epistemic Boundary / Knowledge Provenance

曾出现 NPC 无来源继承 GM / System / 未来历史知识。

> **GM / Source / System knows X != NPC knows X.**

NPC 的知识应来自其世界内经历、身份、被告知内容、传闻、观察、推断或显式超自然权限。

### 3.4 Pacing Elasticity / Downtime

DSH 主动推进事件是优点，但会出现：

```text
事件 → 事件 → 事件 → 事件
```

导致缺少自由探索、日常生活、关系互动、人物塑造与放松空间。

正式方向：

> **推进世界，但不要让玩家永远只能响应事件。**

> **不是所有有价值的场景都必须推动主线。**

### 3.5 Agency Granularity

Player Agency 不等于每个小动作都必须手操。

候选模式：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同语义：

> **Compress dead time; stop at meaningful choice.**

---

## 4. 已确认的产品 / 宿主缺口

- **Agent Trace Noise**：`think/read/write/tool` 不应占据 RPG 主阅读流；
- **Persistent RPG UI**：Chat 展示机制事件，UI 承载机制当前状态；
- **Player-facing Save / Restore**：当前 mutable workspace 不等于真正回档系统；
- **DSH Final Response Emission**：曾多次出现 reasoning 完成但没有最终玩家文本，输入“输出”后恢复；当前归类为 Host reliability，不用 RPG Prompt 修。

---

## 5. TW-01｜Minimal World Core

World Core 是一个 **薄协调层**，不是第二套 Agent Runtime。

第一版只聚焦：

```text
Game Entry / Fresh-session Recovery
+
Durable Maintenance Discipline
+
Dynamic Durable Identity
+
Knowledge / Exposure Boundary
+
Player Authorization Context
+
Minimal Pacing Semantics
```

它明确不默认建设：

- narrative approval engine；
- typed mutation pipeline；
- universal schema；
- knowledge ACL database；
- 全量世界逐实体模拟；
- 每回合全文件 rewrite。

核心原则：

> **Freedom Before Prevention.**

> **Prefer recovery over prevention.**

---

## 6. Repository Architecture

```text
the-world/
├─ README.md
├─ AGENTS.md
├─ docs/
│  ├─ PRODUCT_SPEC_CURRENT.md
│  ├─ ARCHITECTURE_CURRENT.md
│  ├─ TW-01_WORLD_CORE_PLAN.md
│  └─ experiments/
├─ plugins/
├─ library/
├─ games/
└─ tools/
```

- `plugins/`：World Core、RPG UI、Map、Mechanics；
- `library/`：可复用 Source Assets；
- `games/<game-id>/state/`：当前 game-local canonical reality；
- `story/`：重要历史、承诺、后果与 unresolved hooks；
- `memory/`：上下文压缩 / retrieval layer；
- `saves/`：明确恢复点；
- `tools/`：窄而确定性的支持能力。

---

## 7. Current Development Route

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

TW-01 第一实施顺序：

1. 核验 current DSH plugin / context / lifecycle seams；
2. 建最小 World Core plugin skeleton；
3. 注入高价值 Game Mode semantics；
4. 加 durable-change maintenance hook；
5. 新开一局真实三国 vertical；
6. 重测长期写回、动态 NPC、知识边界、节奏和 fresh-session recovery。

---

## 8. Reality Gate A

TW-01 至少证明：

1. **Want to Continue**；
2. **GM Quality Preserved**；
3. **Persistence Does Not Decay**；
4. **Dynamic Identity Survives**；
5. **Epistemic Boundaries Hold**；
6. **Cross-session Same World**；
7. **Player Plays, Agent Maintains**。

---

## 9. Public Repository Safety

本仓库是 public。

不得提交 API Key、Token、Cookie、密码、私钥、私密聊天原文、不希望公开的个人信息，以及无权公开的版权 / 保密材料。

---

## 10. Current Decision

**TW-00.5 已结束。现在正式开始 TW-01。**

第一份代码应是：

> **一个最小 DSH World Core plugin skeleton，能稳定注入 Game Mode context，并在合适生命周期点承担 durable maintenance responsibility。**

在写代码前先完成一次 current DeepSeek Harness extension seam survey。