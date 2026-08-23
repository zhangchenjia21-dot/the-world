# plugins｜The World RPG Plugins

`plugins/` 是 The World 面向 **DeepSeek Harness** 的 RPG 专用插件 Owner。

这里与 `tools/` 职责不同：

- `plugins/`：可以因为直接增加游戏价值、沉浸感、交互或机制深度而存在；
- `tools/`：主要承载窄而确定性的支持能力，尤其是由真实重复失败拉动的可靠性 / 校验工具。

当前阶段不是立即开发所有插件，而是用 TW-00.5 Bare DSH Probe 先确定：**什么是 DSH 已经天然做得很好、什么才值得插件化。**

---

## 1. Plugin Layers

### 1.1 World Core

TW-01 的 Shared Foundation。

当前目标职责已经被 Bare DSH 试玩进一步收窄：

- 进入 / 继续 The World 游戏模式；
- 提供必要且有界的 GM / world / workspace context；
- 帮助 Agent 在全新 Session 恢复 game-local reality；
- 帮助 Agent 识别并写回真正 durable 的动态人物、关系、承诺、后果与其它世界事实；
- 提供当前 protagonist control mode / authorization boundary；
- 保持 Persistent World、Player Spotlight、Player Agency、Model Freedom；
- 不把自然语言主持变成审批 / typed mutation 流水线。

World Core 具体采用哪个 DSH extension seam，在 TW-01 按当前 DSH 正式接口实现。

### 1.2 RPG Experience / Mechanics Plugins

未来包括但不限于：

- RPG UI / Presentation；
- Map / Visualization；
- Combat；
- Politics；
- Economy；
- Character Progression；
- System / Quest；
- Inventory；
- 世界专属扩展机制。

这些插件由**产品价值**驱动，不要求先证明模型犯错。

---

## 2. RPG UI Core Principle

Bare DSH 试玩已经形成正式产品原则：

> **Chat 展示机制事件；UI 承载机制当前状态。**

### Chat / Narrative Stream

适合展示：

- 机制为什么触发；
- 本次如何判定；
- NPC / GM 的即时表现；
- 叙事过程；
- 本轮后果；
- 世界刚刚发生的变化。

### Persistent RPG UI

适合持续查询：

- **System**：系统等级、货币、模块、成长；
- **Quest**：任务、目标、进度、奖励、完成 / 失败；
- **Character**：属性、技能、健康、装备、成长；
- **Relationship**：玩家实际结识的动态人物、关系、承诺；
- **Map**：当前位置、已知地点、路线、区域状态；
- **Faction / Reputation**：势力关系、声望与已知政治状态；
- **Inventory / Economy**：物品、资源、货币；
- **Save / Restore**：自动存档、恢复点、回档 / 分支；
- **Protagonist Control Mode**：主角操控粒度。

具体是统一 RPG Shell 由扩展贡献 panel，还是各机制独立提供 UI plugin，在 DSH capability survey 前暂不冻结。

---

## 3. UI Truth Boundary

RPG UI 必须是 game truth 的投影，而不是第二事实源：

```text
Game-local Canonical State
        ↓
Plugin projection / view model
        ↓
RPG UI
```

禁止形成：

```text
聊天一套状态
+
文件一套状态
+
UI 自己再保存一套长期状态
```

插件 runtime cache 只有在构成 durable game fact 时才写回对应 game Owner。

---

## 4. Dynamic Character / Relationship UI

未来 Character / Relationship UI 不应只显示：

- 初始角色卡；
- 历史名人；
- 预制 Source NPC。

还必须显示运行中真正进入玩家世界历史的 game-local NPC，例如：

- 姓名未知人物；
- 普通百姓；
- 士卒；
- 临时同伴；
- 敌人；
- 商人；
- 地方官吏；
- Agent 动态生成的原创 NPC；
- Source / 历史 / 题材人物在当前 game 中演化后的版本。

正式原则：

> **重要性决定 UI prominence 和模拟资源，不决定实体是否存在。**

例如玩家尚不知道某个 NPC 的名字时，UI 可以显示：

```text
老卒（姓名未知）
关系：信任倾向
状态：左腿旧伤
最后已知位置：……
```

但只能显示**玩家已知信息**，不能把后台隐藏事实直接泄露到 UI。

---

## 5. Agent Execution Trace Noise

Bare DSH 默认界面会把大量：

- `think`；
- `read`；
- `write`；
- tool execution；

混入玩家的主要阅读路径。

这些信息对通用 Agent 调试有价值，但会明显破坏 RPG 沉浸。

正式产品原则：

> **隐藏工作噪音，不限制 Agent 工作能力。**

未来 RPG UI / Presentation Plugin 应：

- 默认隐藏、折叠或降级 Agent 执行轨迹；
- 主视图优先呈现 GM 最终叙事、NPC、世界信息和游戏交互；
- 保留可选 debug / inspect 入口；
- 不因此限制 Agent 正常使用文件和工具。

---

## 6. Protagonist Control Mode

Bare DSH 试玩出现过一次明显的 action batching：玩家只表达“准备前往东线”，GM 却可能一次推进采购、出发、遭遇、招募 / 收服与抵达目标。

进一步产品讨论后，当前结论不是“禁止模型替玩家行动”，而是：

> **主角操控粒度应该成为可配置体验。**

候选 UI：

```text
主角操控模式
○ Full Control｜完全操控
● Light Delegation｜轻度托管
○ Narrative Delegation｜叙事托管
```

### Full Control

玩家亲自决定绝大多数主角行动与关键过程。

### Light Delegation

GM 可依据：

- 当前玩家目标；
- 角色卡；
- 已形成性格 / 信条；
- 明确计划；

自动推进赶路、休息、常规采购、例行应对等低价值步骤。

### Narrative Delegation

玩家主要做战略目标与重大选择，GM 可以更积极地代行符合角色人格的过程行为。

共同原则：

> **Compress dead time; stop at meaningful choice.**

玩家应可以随时：

- 手动接管；
- 临时要求“这段直接推进到 X”；
- 临时要求“这段我逐步操作”；
- 切换模式。

这项能力既可能由 RPG UI 提供设置，也需要 World Core 把当前授权上下文传给 GM；最终 seam 在实现阶段决定。

---

## 7. Save / Restore Surface

Bare DSH 当前 `save/` 更接近 latest-state workspace，不等于玩家级回档系统。

未来 Save / Restore UI 候选包括：

- Auto Save；
- named Save Point；
- Undo / Regenerate；
- Restore；
- 从旧节点 Branch。

恢复不能只回滚 Markdown 文件而让 Agent Session 仍记得未来时间线；需要保证恢复后的 GM 认知与 game state 对齐。

具体实现暂不冻结。

---

## 8. Host Boundary

默认：

> **DSH-native, not DSH-internal-coupled.**

优先使用 DSH documented extension points，不 fork / patch 通用 Agent Runtime。

DSH 处于 Developer Preview；integration layer 可以迁移，但长期 game data、世界资产和历史语义应尽量稳定、可移植。

---

## 9. Current Route

```text
Product Definition Gate PASS
↓
TW-00.5 Bare DSH Capability Probe   ← CURRENT
↓
Extract Real Gaps
↓
TW-01 Minimal World Core
↓
Reality Gate A
↓
RPG Experience / Mechanics Plugin
↓
Reality Gate B
```

不要用大量 UI / mechanics 掩盖基础长期世界问题；也不要因为某个机制未来会有 UI，就提前把自然语言机制全部程序化。
