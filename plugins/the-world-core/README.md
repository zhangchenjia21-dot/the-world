# the-world-core｜The World TW-01 Minimal World Core

DSH 原生 RPG 游戏模式插件。让已经会当 GM 的模型，长期稳定履行游戏后台职责：
游戏恢复、两层 durable 维护协调（delta 捕获 + 检查点归并）、认知边界、操控粒度、节奏弹性。

不是完整 RPG Runtime。Brief 明确 Non-goal 的能力（ECS / 实体数据库 / typed mutation /
审批门 / 知识 ACL / 台词校验器等）一概不建。

## 安装与配置

本插件以 **agent preset** 方式挂载（DSH 官方的“每会话世界”组合机制），不触碰宿主 profile：

```text
~/.dsh/.agent-presets/the-world/
├─ preset.yml          # 显示名与描述
└─ agent.cordis.yml    # standard preset 全量工具栈 + GM persona + the-world-core 行
```

`agent.cordis.yml` 中的插件行：

```yaml
- id: the-world-core
  name: 'D:/AI/deepseekharness/plugins/the-world-core/lib/index.js'
  config:
    gamesDir: games              # 游戏根目录：相对会话 cwd 或绝对路径
    templateDir: games/_template # 新游戏模板（仅用于提示文案）
    maxFileChars: 12000          # 恢复注入单文件内联上限，超出截断
    maintenance: true            # 回合维护提醒总开关（对照实验时可关）
    consolidationInterval: 10    # 检查点归并节奏（玩家回合）；本局有自动存档策略时跟随其间隔
```

源码改动后无需重启：preset 组合在每次创建会话时重新读取；进行中的会话保持创建时的组合。

## 使用：启动一局 TW-01 测试游戏

1. 在 DSH Web GUI 新建会话，**Agent Preset 选择 `The World`**；
2. 会话工作目录选到含 `games/` 的目录（如 the-world 仓库根）；
3. 说“开始新游戏”：World Core 会引导模型走 **New Game Setup**——
   选择世界 → 确认拓展包（Required / Recommended / Optional 三级，Optional 默认关闭、只能玩家明确启用）
   → 世界起点 / 口径 → 创建或选择玩家角色 → 主角操控模式 → 存档策略（仅手动 / 每 5/10/20 玩家回合 /
   仅里程碑 / 里程碑 + 定期，默认推荐「里程碑 + 每 10 玩家回合」但由玩家可见选择）→ 展示完整配置 → 玩家明确确认后
   才创建 `games/<game-id>/` 并把组合写入 `COMPOSITION.md`（`- 确认状态: confirmed`）。
   确认前不建目录、不进入叙事。
4. 新会话继续同一世界时，同样用本 preset 建会话、同一工作目录：
   World Core 直接读取 `COMPOSITION.md` 与 `state/` 恢复，**不会重走新游戏流程**；
   若游戏目录存在但 COMPOSITION 未确认，会先要求补完最终确认再开局。

多游戏并存：在 `games/CURRENT_GAME` 写入当前游戏目录名（纯目录名，禁止路径分隔符）。

## 游戏识别规则（resolveGame）

按序判定，任一命中即用：

1. 会话 cwd 本身就是游戏目录（含 `state/CURRENT.md`）；
2. `games/CURRENT_GAME(.md)` 指针指向的游戏目录；
3. `games/` 下唯一非 `_template` 游戏目录。

多游戏无指针时**不猜**——恢复错游戏比不恢复更糟，此时注入开局/选择指引。

## 工作区约定

```text
games/<game-id>/
├─ README.md          # 身份 + 恢复阅读顺序
├─ state/CURRENT.md   # 现在真实是什么（第一 canonical 入口；含 Control mode 行）
├─ story/LEDGER.md    # 未来值得追溯的重要事件
├─ memory/DELTAS.md   # 待归并缓冲：每回合 durable facts 追加处（自写入起即为有效事实）
├─ memory/RECENT.md   # 恢复用压缩层（可重写；冲突时以 state 为准）
└─ saves/             # 明确恢复点
```

后台维护分两层（Game Workspace Architecture v0.2 §2.8）：

- **Tier 1 delta 捕获（每回合）**：只向 `memory/DELTAS.md` 追加 1–3 行本轮新产生的 durable facts，
  不重读旧文件、不逐 Owner 巡视；
- **Tier 2 检查点归并**：场景收束 / 时间大跳 / 每 N 玩家回合（N 取 COMPOSITION.md 自动存档间隔，
  手动存档时回落 `consolidationInterval`）把 DELTAS 逐条写回正确 Owner 并清空已归并条目；
  到达存档回合时先归并再做存档快照。

Save Policy v0.2 的执行簿记持久化在 `saves/POLICY_STATE.json`（machine-owned）：
真实玩家回合跨 Session 连续计数；策略指纹与当前 COMPOSITION.md 对齐，玩家改策略或 Restore 换策略时
重置间隔进度、保留总回合数；Restore 不回滚计数。里程碑由模型经 `world_mark_milestone(label)` 工具
发信号（高门槛、同回合 coalesce、不动世界文件、不建快照），快照仍由确定性代码在归并完成后的
second-stopping 安全 seam 建立；同回合 interval 与 milestone 同时触发只建一个 milestone 档。
自动档失败写入 POLICY_STATE 供 Panel 存档页显形，下一安全回合自动重试，不向 RPG Chat 注入工程通知。

程序只从 CURRENT.md 提取三个字段（均为 `- 字段: 值` 行，缺失即省略/回落默认）：

- `Current time / date:` → 动态上下文“世界当前时间”；
- `Current location:` → 动态上下文“主角当前位置”；
- `Control mode:`（或 `操控模式:`）→ `full-control` / `light-delegation`（默认）/ `narrative-delegation`。

## 使用的 DSH seams

| Seam | 用途 |
| --- | --- |
| `ctx.systemPrompt.section()` | 稳定游戏模式语义（order 40，persona 之后） |
| `ctx.systemPrompt.context()` | 每轮动态上下文：game id / 操控模式 / 时间位置 / 认知边界提醒 |
| `agent/session-start` + `Agent.inject()` | 新会话恢复注入（startup/resume/clear/compact 均注入；含未归并 DELTAS） |
| `agent/turn-stopping` + `Agent.steer()` | 回合结束维护提醒：普通回合 delta 捕获、间隔回合检查点归并；同一 turn 去重，无无限循环 |
| `ctx.get('tools')` + `tools.register()` | `world_mark_milestone` 里程碑信号工具（Save Policy v0.2；软取服务，无 tools 平面静默降级） |
| scoped plugin lifecycle（agent preset 挂载） | preset standing scope 注册一次，覆盖所有加入会话 |

未采用：`Agent.runMaintenance()`（维护需延续本轮叙事上下文，turn 内 steer 更贴切）、
`agent/pre-step`/`agent/request` waterfall（不改写模型请求）、host 平面 bundle（不引入 GUI 启动风险）。

## 测试与冒烟

```powershell
# focused tests（55 个，node:test；沙箱下需逐文件进程内运行）
cd plugins/the-world-core
node test/游戏定位测试.js; node test/提示文本测试.js; node test/事件接线冒烟测试.js

# 真实挂载冒烟：在部署根目录执行，真实组合 the-world preset 整个插件子树
cd D:\AI\deepseekharness
node plugins/the-world-core/scripts/验证挂载.mjs   # 期望输出 THE_WORLD_MOUNT_OK
```

## 回退

- 让某会话回到普通模式：新建会话时改选其它 preset（preset 是按会话挂载的，无全局状态）；
- 彻底移除：删除 `~/.dsh/.agent-presets/the-world/` 目录即可，不影响宿主与任何既有会话。

## 已知限制

1. **preset 是 standard 的快照复制**：DSH 升级 shipped `standard` 后需手工同步本 preset 的工具行。
2. **多游戏必须显式指针**：不猜最近修改的游戏（刻意决定）。
3. **恢复注入有界**：CURRENT.md / RECENT.md 超过 `maxFileChars` 截断并提示模型自行 read；
   超大 state 的完整恢复依赖模型按需深读（这是设计而非缺陷：Game History Growth != Context Growth）。
4. **字段提取是宽容正则**：CURRENT.md 行格式被模型改写为程序不认识的形式时，
   动态上下文退化为只含 game id 与默认模式，文件内容本身不受影响。
5. **维护提醒不强制写入质量**：程序保证 review 发生，写不写、写什么由模型判断（Brief §10 分工）。
6. **认知边界是提示语义而非程序强制**：未实现每条知识 ACL / 台词 validator（Brief 明确 Non-goal）。
7. **`node --test test/` 目录模式在 DSH 文件沙箱下因子进程管道 EPERM 失败**：逐文件运行即可；
   非沙箱环境两种方式均可用。
8. **里程碑判断由模型执行**：程序保证 signal → 安全 seam → 确定性快照的链路与失败可发现；
   「是不是里程碑」属语义判断，靠维护文案的高门槛指引约束，不做硬编码 detector（SAVE_POLICY v0.2 §4 分工）。
