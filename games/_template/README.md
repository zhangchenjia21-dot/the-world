# Game Template（Game Workspace Architecture v0.2）

复制本目录建立一局新游戏。规范详见 `docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md`。

## Identity

- Game ID: `TODO`
- World / Campaign: `TODO`
- Player Character: `TODO`
- Created: `TODO`
- Source Assets: `TODO`

## Read First

开始或恢复本局时：

```text
README.md
→ COMPOSITION.md（玩家确认的配置与存档策略）
→ state/CURRENT.md（Resume Anchor）
→ state/THREADS.md（仍 open 的悬念）
→ memory/（若已有）
→ story/ 中与当前局势直接相关的内容
→ 必要的 library source
```

## Core 文件与按需文件

固定存在：`COMPOSITION.md`、`state/CURRENT.md`、`state/PLAYER.md`、`state/THREADS.md`、`state/characters/INDEX.md`、`mechanics/README.md`、`story/LEDGER.md`、`memory/RECENT.md`。

按需建立：`state/WORLD.md`（世界态势第一次偏离 Source 时）、`state/organizations/`、`state/places/`、`mechanics/<mechanic-id>/STATE.md`（机制第一次产生长期状态时）。

不为「看起来完整」建空文件。

## Game-local Rule

本目录内产生的世界演化只属于本局。不要为了记录本局变化直接修改 `library/` Source。

## Resume Note

在这里可以放极短的人类可读恢复说明；真正 current facts 仍以 `state/` 为准。
