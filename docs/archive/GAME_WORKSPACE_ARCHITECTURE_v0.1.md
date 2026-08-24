---
title: Game Workspace Architecture v0.1（已归档）
status: archived
version: 0.1
archived: 2026-08-24
superseded_by: ../GAME_WORKSPACE_ARCHITECTURE_v0.2.md
origin: 本文原为 ARCHITECTURE_CURRENT.md（v0.4）第 5 节「Game Workspace」
---

> 本文件是 Game Workspace Architecture v0.1 的历史留档，仅供追溯。
> 现行版本见 [GAME_WORKSPACE_ARCHITECTURE_v0.2.md](../GAME_WORKSPACE_ARCHITECTURE_v0.2.md)。

## 5. Game Workspace

建议第一版保持 Markdown-first：

```text
games/<game-id>/
├─ README.md
├─ state/
│  └─ CURRENT.md
├─ story/
│  └─ LEDGER.md
├─ memory/
│  └─ RECENT.md
└─ saves/
```

达到真实规模压力后再拆 characters / factions / locations / quests / mechanics。

### `state/`

回答：**这局现在真实是什么。**

### `story/`

回答：**发生过哪些未来值得追溯的事情。**

不是 current state 第二副本。

### `memory/`

回答：**下一次高质量主持最值得恢复什么。**

允许压缩和重写，不覆盖 current truth。

### `saves/`

语义：**明确可恢复到的游戏现场。**

第一版具体实现仍开放。

---
