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

每局至少包含：

```text
README.md
state/
story/
memory/
saves/
```

核心规则：

- Game-local truth 不反写 `library/`；
- `state/` 是 current reality 的主要 Owner；
- `story/` 保存重要历史，不替代 current state；
- `memory/` 用于上下文压缩，不替代 canonical facts；
- `saves/` 保存明确恢复点；
- 一局可以自然长出 Source 中不存在的新人物、地点、势力与关系。