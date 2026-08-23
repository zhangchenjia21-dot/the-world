# plugins｜The World RPG Plugins

`plugins/` 是 The World 面向 **DeepSeek Harness** 的 RPG 专用插件 Owner。

这里与 `tools/` 职责不同：

- `plugins/`：可以因为直接增加游戏价值、沉浸感、交互或机制深度而存在；
- `tools/`：主要承载窄而确定性的支持能力，尤其是由真实重复失败拉动的可靠性 / 校验工具。

## 当前插件层级

### World Core

TW-01 的 Shared Foundation。

目标职责：

- 进入 / 继续 The World 游戏模式；
- 在游戏回合稳定提供必要且有界的 GM / world / workspace 上下文；
- 引导 Agent 按需读取 state / story / memory / source；
- 引导 Agent 在回合后维护必要 durable changes；
- 保持 Player Agency、Persistent World、Player Spotlight 与 Model Freedom；
- 不把自然语言主持变成审批 / typed mutation 流水线。

World Core 的具体 DSH extension seam、package shape 和配置方式在 TW-01 按当前 DSH 正式接口实现，不在 Stage 0 Product Definition 中提前冻结。

### Experience / Mechanics Plugins

未来可以包括：

- RPG UI；
- Map / Visualization；
- Combat；
- Politics；
- Economy；
- Character Progression；
- 世界专属扩展机制。

这些插件由产品价值驱动，不需要先证明模型犯错。

## Bare DSH 试玩已观察到的体验缺口

### RPG UI：Agent 执行轨迹噪音

来源：Bare DSH Capability Probe，TEST 分支，T1 实际试玩反馈（2026-08-23）。

当前 DeepSeek Harness 默认 Agent 交互界面在玩家提交游戏输入后，会在主要游戏阅读路径中出现大量 Agent 执行过程记录，例如：

- `think`；
- `read`；
- `write`；
- 其它工具 / 执行轨迹。

这些信息对通用 Agent 调试和工作透明度有价值，但在 RPG 主路径中会明显打断叙事连续性和沉浸感，使玩家感觉自己正在观看 Agent 执行任务，而不是直接经历游戏世界。

这不是 World Core 可靠性问题，也不应通过限制 Agent 少读 / 少写来解决。

未来 RPG UI / Presentation Plugin 应优先考虑：

- 默认把 Agent 执行轨迹从主要叙事流中隐藏、折叠或降级展示；
- 玩家主视图优先呈现 GM 的最终游戏输出、角色 / 世界信息和可交互游戏元素；
- 仍保留可选的展开 / 调试入口，使需要时能够查看 Agent 行为；
- 不因追求界面干净而削弱 Agent 正常使用 `read` / `write` / tools 的能力。

产品原则：

> **隐藏工作噪音，不限制 Agent 工作能力。**

当前状态：真实体验证据已出现，作为后续 Reality Gate B / RPG UI Plugin 的候选 Required Experience Improvement；具体 UI 形态暂不冻结。

## Host Boundary

默认原则：

> **DSH-native, not DSH-internal-coupled.**

优先使用 DeepSeek Harness documented extension points，不 fork / patch 通用 Agent Runtime。

DSH 目前处于 Developer Preview；集成层可以随上游迁移，但长期 game data、世界资产和历史语义应尽量保持稳定、可迁移。

## 当前阶段

```text
Product Definition Gate PASS
↓
TW-01: World Core minimal real vertical
↓
Reality Gate A
↓
至少一个 Experience / Mechanics Plugin
↓
Reality Gate B
```

不要在 World Core 尚未证明好玩、可恢复之前，用大量 UI 或机制插件掩盖基础 RPG 体验问题。