# tools｜窄而确定性的支持能力

`tools/` 不等于 The World 的插件层。

- RPG 游戏模式、UI、地图、战斗、政治、经济等产品能力 → 优先归 `plugins/`；
- 窄而可复用的确定性支持能力 → 归 `tools/`。

## 1. 两类进入理由

### Product-value mechanic/tool

如果某个确定性能力本身就是游戏机制或体验的一部分，例如：

- dice / RNG；
- 距离计算；
- 战斗解析；
- 地图几何；

它可以被对应 RPG 插件消费，不需要先证明“模型犯错”。

### Failure-driven reliability tool

如果能力主要用于防止或修复模型 / 文件错误，例如：

- reference / link validator；
- duplicate identity detector；
- state consistency lint；
- atomic writer；
- schema checker；
- migration helper；

则默认只有真实试玩反复暴露问题后才增加。

新增这类工具前必须回答：

1. 已发生的真实失败是什么？
2. 失败是否反复、昂贵或难以察觉？
3. Undo / Regenerate / Restore / Agent 自检为什么不够？
4. 最窄确定性修复是什么？
5. 它是否会损害 GM 创意、世界主动性、玩家自由或游戏流畅度？

正确顺序：

```text
真实失败
→ 最窄工具
→ 再试玩
```

而不是：

```text
理论上可能出错
→ 提前建设完整 Guardrail / Runtime
```

> 工具服务游戏；不要让可靠性工具成为产品 Owner。

## 2. 当前工具

### 掷骰.mjs｜检定骰面唯一来源

配合《判定与检定》过渡包使用。模型自称的骰点不真随机且偏袒玩家，一切检定骰面只来自本工具输出：

```bash
node tools/掷骰.mjs 1d20+4        # 常规检定
node tools/掷骰.mjs 1d20+4 adv    # 优势：掷两次取高
node tools/掷骰.mjs 1d20+4 dis    # 劣势：掷两次取低
node tools/掷骰.mjs 3d6           # 多骰求和
```

- 骰式：`NdM±K`（N 1–100，M 2–1000）；`adv`/`dis` 仅限单骰检定；
- 随机源：`node:crypto` 真随机；非法输入非零退出并打印用法；
- 零依赖，Node 18+ 直接运行。