# the-world-panel｜The World 游戏面板

Gate B 首个 RPG 体验插件：DSH Web 侧边栏中的玩家信息界面，以 `dsh-better-sidebar` 为宿主（`ctx.betterSidebar` 的 `registerTab` / `openTab`），数据经插件 Node 半从 game workspace 投影。

## 信息架构（2026-08-24 玩家体验重构）

> Workspace is organized for truth maintenance; UI is organized for player decisions.
> 工作区按事实归属组织，UI 按玩家需求组织。

分页不再与 Owner 文件一一对应：

```text
概览    跨 Owner 瞬时聚合：我是谁 / 何时何地 / 当前身份 / 身体与资源 /
        当前危机 / 当前决策 / 当前事务 / 近期变化
角色    Character Sheet：核心身份与身体优先，知识边界/背景等低频信息折叠；
        装备节移交行囊，不再重复
人物    关系化人物视图：characters/INDEX.md 派生表 → 列表 + 分类过滤 + 展开档案
行囊    玩家装备 + 机制仓库类分节的跨 Owner 聚合
事务    THREADS 按 紧急/进行中/长期 分组 + 系统任务组，保留两步确认归档
系统    仅当本局存在长期机制时显示（机制显示名 + 状态 + 分节）
存档    Save / Restore + Save Policy v0.2 + Restore Reliability v0.2：手动快照 + 存档列表（类型/游戏内时点/
        兼容性，以服务端 exact ref 定位）+ 两步确认恢复；恢复成功立即锁定全页成功态，随后强制进入恢复后
        出生的全新 Session；恢复前保护档收进「恢复保护（系统）」折叠区；页首显示当前存档策略摘要，
        最近一次自动存档失败以非侵入式警告显形（不污染 RPG Chat）
```

玩家界面不出现 raw id / 文件路径 / Owner 说明 / `mechanic:` / `source:` 等开发元数据
（链接留显示名、`（→ path）` 引用整段剥离、`char-*` 映射为显示名、frontmatter 不进视图、
canonical 状态词如 `active/open` 在显示层本地化为中文）。

裁定与任务书：`Vibe-Coding/the-world/GateB_首个RPG体验插件与游戏面板裁定_v1.2_2026-08-24.md`（DEC-B1~B10）、
`docs/experiments/GATE_B_PANEL_PLAYER_EXPERIENCE_REDESIGN_KIMICODE_TASK_2026-08-24.md`。

## 硬边界（DEC-B3 v1.2 扩展）

- **投影只读 + 两个确定性写口**：
  - `/close-thread` 只做一件事——把指定线程块从 `state/THREADS.md` 移入 `story/LEDGER.md`
    （归档而非删除，内容可追溯），不经模型；
  - `/save`、`/restore` 只做一件事——`saves/` 下的确定性快照创建与恢复
    （`plugins/shared/存档.js`，不经模型）；
- view model 是瞬时投影：不落盘、不改 Owner 文件、不要求 World Core 为 UI 写额外字段；
- 投影只读活档案（`state/`、`mechanics/`、`COMPOSITION.md` 当前文件）；
  `saves/` 仅经 `/saves` 枚举元数据（不含真实路径 / source session 等内部字段）。

## Save / Restore v0.1 语义

- **快照内容**：`COMPOSITION.md` + `state/` `mechanics/` `story/` `memory/`；永不复制 `saves/`、`library/`；
- **可恢复判定（v0.2 结构）**：缺关键 Owner 文件的旧档仍可浏览，但标记「旧版归档」并禁用恢复，
  不偷偷补结构；
- **exact ref 定位（Restore Reliability v0.2）**：玩家显示编号（SAVE-NN）可能因历史脏数据重复，
  不再兼任存储主键；`/saves` 为每个快照给出服务端枚举的 exact ref（目录 basename），`/restore`
  按 ref 精确恢复；旧 `saveId` 请求只在编号唯一时兼容解析，duplicate 返回 `save-id-ambiguous` fail closed；
- **恢复前保护**：任何 restore 修改 live state 之前先自动建立保护档，放进 `saves/recovery/` 系统
  namespace（`PRE-RESTORE-*`，不占玩家 SAVE 编号、不进主列表，滚动保留最近 3 份）；保护档创建失败则
  整个 restore 失败、不动 live；restore 中途失败但回滚完整时删除本次保护档，回滚不完整则保留全部
  恢复材料并 fail loud（Restore Reliability v0.2）；
- **真正 snapshot 语义**：恢复是整体替换，不是“覆盖存档里有的文件”——存档时点之后才出现的
  live 文件会被移除；失败时从备份回滚并 fail loud；
- **idle 门槛**：Agent 生成中保存/恢复都被拒绝（client UX guard + host 侧 `agents` 状态权威检查）；
- **Windows 句柄防护**：面板 SSE 的 fs.watch 会持有 live 目录句柄（被监视目录 renameSync 必 EPERM），
  restore 期间先释放本进程监视器、结束后重挂并补发 refresh；rename 对瞬时 EPERM/EBUSY 小退避重试；
- **fresh-session 边界**：restore 成功响应带 exact target（restoredRef/Id/Label/GameTime），客户端
  立刻锁成全页「世界已恢复至…」成功态（不再暴露任何 Restore 按钮），随后用
  `ctx.sessions.create({ workspaceId })` 显式创建恢复后出生的全新 Session 并 `open` 切换；
  seam 不可用时进入显眼的「必须新建会话」态，绝不假装旧 Session 可继续（旧 Session 历史不改写、不删除）。

## 结构

```text
lib/index.js            Node 半（手维护 ESM 源码）：/the-world/panel 前缀路由
                        ├─ state        GET  → 分页 JSON 投影（含 CURRENT.md）
                        ├─ events       GET  → SSE（fs.watch 驱动，回合结束后刷新；无轮询）
                        ├─ close-thread POST → 线程归档（DEC-B3 v1.2 窄写口）
                        ├─ saves        GET  → 存档列表元数据（exact ref + 兼容性判定，无真实路径）
                        │                    + 恢复保护（系统）折叠区数据 + 当前存档策略中文摘要
                        │                    + 最近一次自动存档失败（若有）
                        ├─ save         POST → 手动确定性快照（label 清洗、编号扫描全部 SAVE 前缀目录生成）
                        └─ restore      POST → 快照回档（saveRef 精确定位 + 保护档先行 + 回滚安全 + fresh-session）
lib/线程归档.js          归档纯函数（THREADS 切块 / LEDGER 追加；CRLF 兼容）
src/client/viewmodel.js 玩家视图模型层（纯函数：跨 Owner 聚合 / 清洗 / 分组；无 react 依赖）
src/client/index.jsx    浏览器半：唯一接触 ctx.betterSidebar 的适配模块 + 渲染组件
lib/client.js           构建产物（tsdown，不提交；__ModuleLoader__ 惰性 CJS 格式）
test/                   node:test（归档语义 + 视图模型）
scripts/smoke-render.mjs 渲染冒烟（mini-react stub + 真实投影 + 存档/session 边界 + 第二 fixture）
```

共享依赖：`plugins/shared/游戏定位.js`（`resolveGame` 等，DEC-B9，与 the-world-core 共用，不复制实现）、
`plugins/shared/存档.js`（Save/Restore 文件语义：list/inspect/create/restore/锁/META 解析，纯 Node fs，可独立测试）。

## 构建

```bash
# 仓库根（先 npm install 一次）
npm run build:panel
```

## 验证

```bash
# 纯函数单元测试（不依赖宿主）：面板视图模型/归档 + 共享存档工具
node --test plugins/the-world-panel/test/*.js plugins/shared/存档测试.js

# 渲染冒烟（需要 DSH Web 在 3080 运行；含 AC-9 第二 fixture、存档页与 fresh-session 边界 mock）
node plugins/the-world-panel/scripts/smoke-render.mjs
```

## 部署（接入 D:\AI\deepseekharness）

```bash
node plugins/the-world-panel/scripts/deploy.mjs
```

脚本做的事（全部可重复、幂等）：

1. 构建 client bundle；
2. 同步 `plugins/the-world-core`、`plugins/shared`、`plugins/the-world-panel` 到 `<部署根>/plugins/`；
3. 同步 the-world preset（`preset/` → `~/.dsh/.agent-presets/the-world/`）；
4. 建立 `the-world-panel` 包名解析所需的 junction（web profile 与部署根的 `node_modules/`）——
   preset 行以包名注册，DSH client module 扫描以包名解析 `dsh.client` 声明。

部署后：重启 DSH Web → 打开 the-world preset 的游戏会话 → **刷新一次页面**（client bundle
随 preset 常驻挂载进入启动图，已打开页面不会自动获得新图行）→ 「世界」tab 自动打开。

## 已知限制

- preset 常驻挂载发生在首个 the-world 会话 attach 时；页面需在其后刷新一次才能加载面板 bundle；
- 自动打开使用带 `path` 的 content open（宿主约定：content open 必须落入视野，面板折叠时自动展开）；
  手动从 + 菜单打开的纯 type open 不强制展开面板；
- 面板只在 the-world preset 会话中呈现数据；standard preset 会话显示空闲提示（DEC-B1 / AC-6）；
- better-sidebar 未启用时本插件 fiber 永久等待其服务（cordis inject 语义）：不报错、不崩 DSH，
  面板静默缺席；
- 同一物品被多个 Owner 引用式描述时不做跨 Owner 去重（如「小件已入系统空间」与系统空间清单
  会各出现一次）——需要 truth 层提供物品实体标识才能可靠合并，列为 Remaining；
- Web-only（DEC-B8）；CLI 平面无 webServer，Node 半静默不注册路由。
