# plugins｜The World RPG Plugins

`plugins/` 是 The World 面向 **DeepSeek Harness** 的 RPG 专用插件 Owner。

- `plugins/`：直接增加 RPG 产品价值、游戏模式、交互或机制深度；
- `tools/`：窄而确定性的支持能力，尤其是由真实重复失败驱动的可靠性工具。

当前阶段：**TW-01 Minimal World Core**。

---

## 1. World Core｜CURRENT

World Core 是 TW-01 Shared Foundation，是一个 **薄职责层**，不是第二套 Agent Runtime。

Bare DSH Probe 最终把 World Core 的真实职责收敛到：

### Game Entry / Recovery

- 进入 / 继续 The World game；
- 找到当前 game workspace；
- 读取最小恢复入口；
- 在全新 DSH Session 恢复同一个世界；
- 只组装当前必要 context。

### New Game Setup / Game Composition

新局组合由玩家确认，不由 Agent 静默决定：

- 玩家至少确认 **World / Player Character / Expansion-Mechanics / Protagonist Control Mode** 后才进入正式叙事；
- 世界包内容分级：**Required** 随世界生效并明示；**Recommended** 默认预选、可取消；**Optional** 默认关闭，必须玩家明确启用；
- 确认结果固化为 `games/<game-id>/COMPOSITION.md`，是 game-local canonical 配置，Session 恢复继续使用；
- 局内变更组合是玩家可感知的正式修改，写回 COMPOSITION；
- Source NPC / lore 等世界内部资产不要求逐项选择。

```text
Asset Library（可用）!= Game Composition（本局启用）!= Runtime Relevant（当前相关）
```

### Durable Maintenance Discipline

Bare DSH 在长局后会逐渐停止修改游戏文件，因此 World Core 必须稳定承担：

> **本轮 / 本阶段是否产生未来仍需成立的变化？**

有 durable change → 更新正确 Owner。  
无变化 → 不机械写文件。

关注：

- dynamic NPC / identity；
- relationships；
- commitments / debts / hostility；
- persistent injuries / capabilities；
- locations / factions / world state；
- quest / mechanic state；
- unresolved consequences；
- major time progression。

### Dynamic Durable Identity

> **Importance controls attention, not existence.**

未命名、非 Source、低重要度不等于可以从世界中消失。

### Knowledge / Exposure Boundary

> **GM / Source / System knows X != NPC knows X.**

World Core 需要稳定提醒 NPC knowledge provenance；第一版不建设 Knowledge ACL DB。

### Player Authorization Context

候选模式：

- Full Control；
- Light Delegation；
- Narrative Delegation。

共同原则：

> **Compress dead time; stop at meaningful choice.**

### Pacing Elasticity

保留模型主动推进世界与年月的能力，同时保留自由探索、日常、关系与人格塑造空间。

```text
World Loop
局势 / 事件 / 后果 / 时间推进

Life Loop
自由活动 / 日常 / 人物互动 / 关系与人格积累
```

> **推进世界，但不要让玩家永远只能响应事件。**

World Core 不使用固定节奏 FSM。

详细计划：`docs/TW-01_WORLD_CORE_PLAN.md`。

---

## 2. World Core Non-scope

TW-01 v0.1 不默认建设：

- narrative approval gate；
- typed mutation engine；
- universal entity schema；
- knowledge ACL / provenance database；
- 玩家行为白名单；
- 模型创作白名单；
- 每回合全文件 rewrite；
- 全量世界逐实体模拟；
- 完整 RPG UI；
- Map / Combat / Economy engine。

核心原则：

> **Freedom Before Prevention. Prefer recovery over prevention.**

---

## 3. RPG Experience / Mechanics Plugins

Gate A 后优先验证至少一个真正 RPG 专用插件，例如：

- RPG UI / Presentation；
- Map / Visualization；
- Combat；
- Politics；
- Economy；
- Character Progression；
- System / Quest；
- Inventory；
- world-specific expansions。

这些插件由**产品价值**驱动，不要求先证明模型失败。

---

## 4. RPG UI Core Principle

> **Chat 展示机制事件；UI 承载机制当前状态。**

### Chat / Narrative Stream

适合：

- 机制触发；
- 判定过程；
- NPC / GM 即时表现；
- 本轮后果；
- 世界刚发生的变化。

### Persistent RPG UI

适合持续查询：

- System；
- Quest；
- Character / Relationship；
- Map；
- Faction / Reputation；
- Inventory / Economy；
- Save / Restore；
- Protagonist Control Mode。

---

## 5. UI Truth Boundary

```text
Game-local Canonical State
        ↓
Plugin projection / view model
        ↓
RPG UI
```

UI 不维护第二套长期事实。

---

## 6. Dynamic Character / Relationship UI

未来 UI 不应只显示历史名人和 Source NPC，还必须显示运行中形成 durable identity 的人物：

- 姓名未知人物；
- 普通百姓；
- 士卒；
- 同伴；
- 敌人；
- 商人；
- 地方官吏；
- Agent 动态生成的原创 NPC；
- Source 人物在当前 game 中演化后的版本。

UI 只能显示**玩家已知信息**，不能泄漏后台知识。

---

## 7. Agent Execution Trace Noise

Bare DSH `think/read/write/tool` 轨迹不适合作为 RPG 主阅读流。

> **隐藏工作噪音，不限制 Agent 工作能力。**

未来 Presentation Plugin 默认折叠 / 隐藏 execution traces，但保留 debug / inspect。

---

## 8. DSH Final Response Reliability

Bare DSH Probe 多次出现 reasoning / tools 已完成但没有 user-facing final response，输入“输出”后恢复。

当前归类：

> **Host / Agent Turn Completion Reliability**

不通过 RPG Prompt 修。

如果 DSH 上游长期未解决，可由宿主 / UI 做窄补救：检测 `turn ended + no final assistant message` 并提供 continue / emit-final recovery。

---

## 9. Save / Restore Surface

未来候选：

- Auto Save；
- named Save Point；
- Undo / Regenerate；
- Restore；
- Branch from Save。

恢复必须让 game files 与 Agent / Session 时间线一致。

---

## 10. Host Boundary

> **DSH-native, not DSH-internal-coupled.**

优先使用 DeepSeek Harness documented extension points，不 fork / patch 通用 Agent Runtime。

长期 game data、资产和历史语义应保持可迁移。

---

## 11. Current Route

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

当前第一开发任务：

> **核验 current DSH extension seams，然后实现最小 World Core plugin skeleton。**