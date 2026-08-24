# games｜长期游戏实例

每个子目录是一局彼此独立的长期世界。

从 `_template/` 复制建立新 game，然后填写该局 README 与 `state/CURRENT.md`。

推荐命名：

```text
<world-or-campaign>_<short-id>
```

例如：

```text
three-kingdoms_liubei-001/
```

工作区结构遵循 Game Workspace Architecture v0.2（见 `docs/GAME_WORKSPACE_ARCHITECTURE_v0.2.md`）：

```text
README.md
COMPOSITION.md      # 玩家确认的配置（含存档策略）
state/              # CURRENT（恢复锚点）· PLAYER · THREADS · characters/（+按需 WORLD/organizations/places）
mechanics/          # 本局机制运行状态（按需建档）
story/
memory/
saves/
```

核心规则：

- Game-local truth 不反写 `library/`；
- 一个事实只有一个 Owner；Core 文件固定存在，实体与机制状态按需生成；
- `state/` 是 current reality；`story/` 保存重要历史，不替代 current state；
- `memory/` 用于上下文压缩，不替代 canonical facts；
- `saves/` 保存明确恢复点（Persistent State ≠ Save Point）；
- 人物实体只存一次、分类全部变成属性；INDEX 是派生视图；
- 一局可以自然长出 Source 中不存在的新人物、地点、势力与关系。