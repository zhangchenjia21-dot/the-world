# the-world-panel｜The World 只读游戏面板

Gate B 首个 RPG 体验插件：DSH Web 侧边栏中的只读游戏面板（角色 / 人物 / 物品系统 / 任务四分页），以 `dsh-better-sidebar` 为宿主（`ctx.betterSidebar` 的 `registerTab` / `openTab`），数据经插件 Node 半从 game workspace 投影。

裁定全文：`Vibe-Coding/the-world/GateB_首个RPG体验插件与游戏面板裁定_v1.1_2026-08-24.md`（DEC-B1~B10）。

## 硬边界（DEC-B3）

- **永远只读**：面板到游戏文件之间不存在任何写调用，UI 无编辑 / 写回入口；
- 只投影活档案（`state/`、`mechanics/`、`COMPOSITION.md` 当前文件），不读 `saves/` 快照；
- 不为面板新增游戏数据文件或改变任何 Owner 文件格式。

## 结构

```text
lib/index.js          Node 半（手维护 ESM 源码）：/the-world/panel 前缀路由
                      ├─ state   GET → 四分页 JSON 投影
                      └─ events  GET → SSE（fs.watch 驱动，回合结束后刷新；无轮询）
src/client/index.jsx  浏览器半源码：唯一接触 ctx.betterSidebar 的适配模块 + 面板组件
lib/client.js         构建产物（tsdown，不提交；__ModuleLoader__ 惰性 CJS 格式）
```

共享依赖：`plugins/shared/游戏定位.js`（`resolveGame` 等，DEC-B9，与 the-world-core 共用，不复制实现）。

## 构建

```bash
# 仓库根（先 npm install 一次）
npm run build:panel
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
- Web-only（DEC-B8）；CLI 平面无 webServer，Node 半静默不注册路由。
