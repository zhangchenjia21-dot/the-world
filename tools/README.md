# tools｜失败驱动的确定性工具

第一阶段允许这里没有实际工具。

只有真实试玩反复暴露某类 Agent 不适合可靠承担的问题时，才增加程序化能力。

候选类型包括：

- deterministic dice / RNG；
- arithmetic / rule calculator；
- reference / link validator；
- duplicate identity detector；
- state consistency lint；
- save / snapshot helper。

新增工具前必须回答：

1. 已发生的真实失败是什么？
2. Agent 自检是否仍无法稳定解决？
3. 最窄工具是什么？
4. 它是否会接管故事创作或限制世界主动性？
5. 它是否真的降低维护成本？

> 工具保护可靠性，不负责决定故事应该怎么发展。