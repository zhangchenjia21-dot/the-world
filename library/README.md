# library｜可复用源资产

这里保存开始一局游戏之前就存在、可以跨 game 复用的 Source Assets。

建议按需要建立：

```text
library/
├─ worlds/       # 世界包、时代、地理、世界锚点
├─ characters/   # 角色卡、可复用人物
├─ mechanics/    # 规则、机制、判定说明
└─ lore/         # 资料库、知识、设定条目
```

## 规则

- 不要求第一天统一成一个万能 Schema；
- Markdown 优先，但资产可以使用适合自身的格式；
- 每份资产应让 Agent 能判断其类型、用途和关键边界；
- 单局游戏中的演化不得反写这里；
- 如果某个 Source 在 game 中发生变化，把 game-local 版本写入 `games/<game-id>/`；
- 新建标准 manifest / compiler / importer 前，先证明真实资产已经因为缺少它而受阻。

> Source 是可复用起点，不是某一局运行中的 live truth。