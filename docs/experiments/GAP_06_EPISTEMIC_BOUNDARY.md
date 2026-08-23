---
title: The World｜Gap 06｜Epistemic Boundary / Knowledge Provenance Leak
status: confirmed-experiment-gap
updated: 2026-08-23
experiment_branch: TEST
reference_host: DeepSeek Harness
---

# Gap 06｜Epistemic Boundary / Knowledge Provenance Leak

## 1. 现象

Bare DSH 真实试玩中，玩家报告最近一条输出让“徐元直”直接以 NPC 身份总结：

> “主公当前最该盯紧的，是毛玠、满宠、吕虔、许褚、李通这些人。他们都是曹操未来会招揽的人才。主公若能早一步，便是截胡。”

并进一步说：

> “至于诸葛亮、张辽、高顺，那是五年十年后的事，现在不必多想。”

该输出的问题不是普通历史知识误差，而是：

- NPC 直接知道未来人才流向；
- NPC 直接按未来历史时间线做规划；
- NPC 使用了类似“系统历史参考 / 玩家穿越知识 / GM 全局知识”的视角；
- 角色声音因此接近系统化身 / GM 旁白，而不是世界内角色。

当前 GitHub connector 在记录本文件时仍未同步到玩家最新 TEST head，因此最新 save / session diff 尚未直接核验；但资产级知识边界已经可以从已存在 TEST Source 直接核验。

## 2. Source 证据：该行为并非资产授权

`原始资产/拓展包/穿越与系统_Expansion_Pack_v0.2.md` 已明确规定：

```text
系统提供的信息
→ Character / Player Knowledge
→ 标记 system-sourced

不自动变成
→ 世界公开信息
```

同一资产还明确使用穿越身份作为知识传播示例：

```text
“系统知道我是穿越者”
!=
“所有 NPC 都知道”
```

并规定 `Historical Assistance` 只能读取 Historical Reference Provider，而不是把未来历史自动赋予所有角色。

因此这次输出可定性为：

> **GM / Model / System 可访问的知识被错误投射成了 NPC 自身知识。**

另外，当前已核验 TEST Source 人物卡列表中没有徐庶 / 徐元直人物卡，因此无法解释为某张预制人物卡显式赋予了未来视角。

## 3. 为什么严重

该问题会同时破坏：

- **Character Integrity**：NPC 不再像有有限认知的世界人物；
- **World Independence**：未来历史被当成当前世界可直接利用的攻略表；
- **Exploration**：人才、情报、关系网络和机遇不再需要发现；
- **Historical Divergence**：如果所有人都知道“曹操未来会招谁”，游戏很容易被固定历史未来反向支配；
- **System Ownership**：玩家 / 系统专属能力被无来源地转移给 NPC；
- **Immersion**：NPC 语言退化为 GM / 系统教程口吻。

这种失败即使只出现一次，也比普通文笔错误代价高，因为它会直接泄露未来信息并改变玩家决策。

## 4. 正式产品语义

冻结以下最小语义：

> **GM / Source / System knows X != NPC knows X.**

角色知识必须有合理 provenance。NPC 可以依据：

- 自身经历；
- 身份 / 职业 / 社会位置；
- 当前时代可获得的信息；
- 可观察事实；
- 他人明确告知；
- 合理推断；
- 显式拥有的超自然 / 系统能力；

形成判断。

NPC 不应无来源访问：

- GM 后台事实；
- 玩家系统私有信息；
- 玩家穿越者知识；
- 尚未发生的未来历史；
- 仅存在于 Source / Character Card 中但角色世界内不可能知道的信息；
- 其它角色未向其披露的隐私 / 秘密。

## 5. World Core 候选 Required Behavior

TW-01 最薄候选 guidance：

```text
在让 NPC 说出或据此行动前，先按世界内因果判断：
这个角色为什么会知道这件事？

如果没有合理来源：
不要把 GM / Source / System 知识借 NPC 的嘴说出。
```

目的不是建设：

- 复杂 ACL；
- 每条事实权限表；
- typed knowledge mutation；
- 全角色知识数据库；
- 每句台词 validator。

优先测试一条轻量 Epistemic Boundary guidance 是否已经足够。

若后续仍反复发生、难以靠轻量语义纠正，再升级为更明确的 Character Knowledge / Provenance persistence 或 retrieval 机制。

## 6. 与 Model Freedom 的关系

这不是限制 NPC 创造力。

模型仍可以让徐元直：

- 根据当下曹营结构判断哪些职位缺人；
- 根据士林、人脉和地方传闻推荐真实可知的人；
- 推断某些人才可能值得争取；
- 判断玩家目前渠道不足；
- 给出错误、片面甚至带偏见的建议。

真正需要阻止的是：

> 把模型自身对三国未来历史的训练知识 / GM 全局知识，伪装成角色在当前世界中的自然认知。

这仍符合：

```text
Freedom Before Prevention
+
World-local causality
+
Character Integrity
```

## 7. 后续验证

继续 Bare DSH Probe 时观察：

1. 是否还有 NPC 无来源知道未来历史；
2. NPC 是否读取玩家系统私有信息；
3. NPC 是否知道玩家未披露的穿越身份 / 系统存在；
4. 历史人物是否把 Source Character Card 的幕后设定直接当成自己能说出的事实；
5. 新 Session 恢复后知识边界是否进一步恶化；
6. 一条极薄 Epistemic Boundary guidance 能否稳定修复，而不损伤文笔与主动性。

当前状态：**Confirmed semantic gap；TW-01 World Core candidate required behavior；不引入重型 guardrail。**
