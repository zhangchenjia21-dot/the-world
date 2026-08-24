# memory｜Agent 长期上下文

这里保存为了高质量恢复和控制上下文长度而生成的压缩层。

可按真实需要建立：

- `DELTAS.md` — 固定存在：每回合 durable facts 的捕获缓冲，检查点归并后清空（两层维护的第一层）；
- `recent.md` — 最近若干回合高密度摘要；
- `long-term.md` — 已稳定的长期背景；
- `retrieval-index.md` — 哪些主题应去哪里追溯；
- `characters/` — 重要人物的局部长期记忆（实体真相仍在 `state/characters/`）。

原则：

```text
Game History Growth != Context Growth
```

Memory 可以被压缩、合并和重写。

若 Memory 与 `state/` 冲突，以 `state/` current truth 为准，并修复 memory。