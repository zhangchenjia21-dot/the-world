# saves｜恢复点与分支

这里保存明确可恢复的游戏现场或其元数据。

Stage 0 不冻结具体实现。

可能的未来方式：

- snapshot 目录；
- Git commit / tag；
- Git branch；
- 专用 snapshot helper。

每个 save 至少应能回答：

- 它对应哪个 game；
- 何时创建；
- 为什么值得保存；
- 如何恢复；
- 恢复后哪些文件构成 current state。

不要把 `saves/` 当成第二个 live state。