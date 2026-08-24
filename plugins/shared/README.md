# plugins/shared｜插件共享模块

The World 各 DSH 插件（`the-world-core`、`the-world-panel` 等）的共同依赖，按 DEC-B9 抽取，不复制实现。

- `游戏定位.js`：从会话 cwd 解析当前游戏目录（`resolveGame`），以及 COMPOSITION.md 状态 / 存档间隔 / CURRENT.md 字段的窄读取。Node 半专用（依赖 `node:fs`），不得进入浏览器 bundle。

部署时本目录随插件一起同步到 `<部署根>/plugins/shared/`，各插件以相对路径引用。
