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