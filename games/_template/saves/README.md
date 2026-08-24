# saves｜恢复点

明确的存档恢复点。语义：**玩家可以回滚到的历史快照**。

- Persistent State（state/、mechanics/、story/、memory/）由后台 maintenance 持续维护，与存档策略无关；
- Save Point（本目录）按 COMPOSITION.md「存档策略」建立。

## 快照格式

```text
SAVE-xxxx/
├─ META.md          # 回合数 / 游戏内日期 / 触发原因（auto-turn · auto-milestone · manual · archive）
├─ COMPOSITION.md
├─ state/
├─ mechanics/
├─ story/
└─ memory/
```

不要把 `saves/` 当成第二个 live state。
