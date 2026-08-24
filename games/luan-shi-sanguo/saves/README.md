# saves｜恢复点

明确的存档恢复点。语义：**玩家可以回滚到的历史快照**。

## 与 Persistent State 的区别

- Persistent State（state/、mechanics/、story/、memory/）：世界实时保持真实，由后台 maintenance 持续维护，**与存档策略无关**——即使玩家选择永远手动存档，后台维护也照常发生。
- Save Point（本目录）：玩家可回滚的快照，按 COMPOSITION.md 的存档策略建立。

## 本局政策（详见 COMPOSITION.md「存档策略」）

- 每 5 玩家回合自动存档；重大阶段切换兜底自动存档
- 自动存档保留最近 5 个；手动存档永不自动删除
- 快照内容：COMPOSITION.md + state/ + mechanics/ + story/ + memory/ 全量复制

## 现有存档

- SAVE-00 开局点: 即旧 state/CURRENT.md 初始版本（184 年二月末 · 穿越落地瞬间）
- [SAVE-01 架构v0.1迁移前](SAVE-01_架构v0.1迁移前/META.md): 旧结构归档快照（184 年三月初四 · 傍晚）
