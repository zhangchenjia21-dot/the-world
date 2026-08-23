---
title: 关系与恋爱核心｜Expansion Pack
aliases:
  - EP-RELATIONSHIP-ROMANCE-CORE
  - 关系与恋爱核心
  - Relationship and Romance Core
  - 人间情缘
created: 2026-08-16
updated: 2026-08-16
status: audited-current
version: 0.2
workflow_mode: light-asset
operation_mode: major-rewrite
asset_type: expansion-pack
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
output_profile: obsidian-markdown
reusability: cross-world
generic_reuse_target: true
discussion_contract: confirmed
supersedes:
  - "[[人间情缘_关系与恋爱_Expansion_Pack_v0.1.1]]"
optional_integrations:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
  - "[[战斗核心_Expansion_Pack_v0.1]]"
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
  - "[[生存需求与环境_Expansion_Pack_v0.2]]"
  - "[[穿越与系统_Expansion_Pack_v0.2]]"
dependency_role: relationship-romance-core
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - ExpansionPack
  - Relationship
  - Romance
  - Trust
  - Respect
  - Sentiment
  - Attachment
  - Relationship Commitment
  - Memory
  - Boundary
  - Agency
  - 通用核心
  - 恋爱
  - 关系
skill: tavern-asset v0.5.2
---

# 关系与恋爱核心｜Expansion Pack v0.2

> [!abstract] 一句话定位
> **`EP-RELATIONSHIP-ROMANCE-CORE｜关系与恋爱核心` 是跨世界通用的人际关系事实 Owner：统一维护人物之间持续存在的单向关系状态、共同关系事实、关系记忆、边界、约定，以及恋爱、吸引、婚约与婚姻等关系子域。**
>
> 恋爱不是独立于关系之外的第二系统，而是 Relationship Domain 中被游戏设计有意强化的一部分。
>
> 本 Core 拒绝万能“好感度”，强调：
>
> **关系是非对称的、历史驱动的、可矛盾的，并且必须服从人物人格与自主性。**

> [!important] 重构说明
> 本文件是对旧 `《人间情缘：关系与恋爱》v0.1.1` 的 Major Rewrite。
>
> 本次重构：
>
> - 从“汉末三国可选关系 / 恋爱包”提升为真正跨世界通用的 Relationship Core；
> - 不拆分 Romance Expansion；
> - 新增 `Sentiment / 情感倾向`，补足一般性的喜欢—反感轴；
> - 保留 Trust / Respect / Attachment / Relationship Commitment / Romantic Attraction；
> - 允许各 Directed Dimension 使用 Runtime 隐藏量化，但不冻结具体数值范围；
> - 不建立单一 Relationship Score；
> - 强化 Source Event → Relationship Interpretation → Relationship Memory；
> - 保留 Directed State 与 Shared Bond 的双层结构；
> - 保留 Romance Accessibility，但严格限制其只处理未冻结的兼容性空间；
> - 继续把 Character Agency Override / Mind Control 与普通关系机制分离。

---

# 0. Discussion Contract｜已确认设计方向

本轮已经确认：

1. “恋爱”不与“关系”拆包；
2. 正式名称升级为 `关系与恋爱核心`；
3. Relationship Core 可以承载友情、亲情、师徒、战友情、敌对、竞争、恋爱、婚姻等长期人际关系；
4. 恋爱只是 Relationship Domain 中权重更高、机制更丰富的一部分；
5. Core 不使用万能“好感度”；
6. Directed Relationship 至少包含六个基本维度：
   - Sentiment；
   - Trust；
   - Respect；
   - Attachment；
   - Relationship Commitment；
   - Romantic Attraction；
7. 六个 Dimension 可以拥有 Runtime 隐藏量化，以提高长期演化稳定性；
8. 当前不冻结数值区间；
9. 玩家默认不查看 NPC 精确隐藏数值；
10. 不允许把六个 Dimension 合并成单一 Relationship Score；
11. Relationship Memory 保存“人物如何把来源事件解释成关系意义”，而不是复制整个世界 Event；
12. A → B 与 B → A 完全独立；
13. Directed State 与 Shared Bond 完全分离；
14. Romance Accessibility 继续留在同一个 Core；
15. Accessibility 只影响未冻结的兼容性空间，不自动制造 Attraction / Love；
16. Relationship Core 本身不 Hard Depend EP-CHAR-CORE；
17. Character Definition / Personality 是重要 Provider，Capability 只是 Optional Integration；
18. 玩家决定关系尝试，NPC 决定自己的回应；
19. 普通 Relationship Mechanism 不拥有 Character Agency Override / Mind Control。

---

# 1. Scope Lock｜职责边界

## 1.1 本 Core 唯一回答的问题

> **“人物 A 与人物 B 之间，现在持续存在怎样的人际关系事实；这些关系为什么形成、彼此是否对称、双方是否建立了共同关系、各自有什么情感 / 信任 / 尊重 / 依恋 / 承诺 / 浪漫吸引，以及哪些边界和约定已经成立？”**

## 1.2 本 Core 必须负责

- Directed Relationship State；
- Shared Relationship Bond；
- Sentiment；
- Trust；
- Respect；
- Attachment；
- Relationship Commitment；
- Romantic Attraction；
- Relationship Memory；
- Relationship Interpretation；
- Relationship Preference；
- Personal Boundary；
- Relationship Agreement；
- Romance Accessibility；
- Lover / Engagement / Marriage 的人际关系事实；
- Friend / Close Friend / Mentor / Student / Rival / Enemy / Family Bond 等共同关系事实；
- Relationship Attempt Grammar；
- NPC Autonomous Relationship Response；
- NPC-NPC Relationship Progression；
- Relationship Knowledge；
- Player-safe Relationship Projection；
- Cross-expansion Relationship Event / Memory Handoff；
- Traveler / System Relationship Assistance Handoff；
- Creator / Runtime / asset-spec vNext Requirement。

## 1.3 本 Core 明确不负责

- Character Personality 本身；
- Character 长期能力；
- Combat Outcome；
- Health Truth；
- Survival Need；
- 政治联盟；
- 官职；
- 法律继承；
- 嫁资 / 财产转移；
- 血缘遗传；
- 怀孕 / 生育；
- 家谱引擎；
- World-specific 婚姻礼制；
- Mind Control；
- Direct Compulsion；
- Character Agency Override；
- RNG / Dice；
- Program Judge；
- Atomic Commit；
- Creator 最终 Schema / UI。

---

# 2. Ownership Map｜唯一事实源

| 概念 | 唯一 Owner | 本 Core 如何使用 |
|---|---|---|
| Character Personality / Value / Bias | Character Definition | 关系解释与回应输入 |
| Character Capability | EP-CHAR-CORE | Optional Integration |
| Current Relationship Truth | EP-RELATIONSHIP-ROMANCE-CORE | 正式职责 |
| Relationship Memory | EP-RELATIONSHIP-ROMANCE-CORE | 正式职责 |
| Shared Bond | EP-RELATIONSHIP-ROMANCE-CORE | 正式职责 |
| Romance / Attraction / Relationship Preference | EP-RELATIONSHIP-ROMANCE-CORE | 正式职责 |
| Marriage 的人际关系事实 | EP-RELATIONSHIP-ROMANCE-CORE | 正式职责 |
| Marriage 的政治意义 | Politics / Governance Owner | Context / Handoff |
| 嫁资 / 财产 | Economy / Resource Owner | Context / Handoff |
| 战争共同经历 | Combat / War Event | Relationship Memory 来源 |
| 照护 / 救命 | Health / Survival Event | Relationship Memory 来源 |
| 社会规范 | World Pack | Context |
| 当前社会后果 | Politics / Character / Runtime | 不重复拥有 |
| Agency Override / Mind Control | Future high-permission owner | 本 Core 明确排除 |
| RNG / Formal Outcome / Commit | Runtime | 执行 |

---

# 3. Core Philosophy｜关系不是好感条

## 3.1 拒绝单一 Relationship Score

禁止：

```text
好感度 = 87
```

作为 Relationship Truth。

因为同一个人物完全可以：

```text
Sentiment: 喜欢
Trust: 很低
Respect: 很高
Attachment: 很高
Relationship Commitment: 很低
Romantic Attraction: 中等
```

这种关系是真实可解释的。

## 3.2 关系允许矛盾

可以存在：

- 喜欢但不信任；
- 尊重但憎恨；
- 深度依恋但拒绝承诺；
- 强烈吸引但不尊重；
- 已婚但没有浪漫吸引；
- 仇敌但高度尊重；
- 分手后仍然关心；
- 背叛后仍保留依恋。

系统不能为了 UI 简化：

> 把这些关系压成一个“亲近 / 敌对”值。

---

# 4. Directed Relationship｜单向关系

A → B 与 B → A：

> **永远独立保存。**

例如：

```text
A → B:
Sentiment: 高度喜欢
Trust: 高
Attachment: 高
Romantic Attraction: 高

B → A:
Sentiment: 友好
Trust: 中等
Attachment: 中等
Romantic Attraction: 无 / 未形成
```

不能因为：

> A 爱 B

就自动创建：

> B 爱 A。

---

# 5. Six Directed Dimensions｜六个核心单向维度

## 5.1 Sentiment｜情感倾向

回答：

> **我整体上对你抱有什么方向性的感受？**

它用于表达：

- 喜爱；
- 亲近；
- 好感；
- 中性；
- 反感；
- 怨恨；
- 敌意。

Sentiment 不等于：

- Trust；
- Respect；
- Attachment；
- Romantic Attraction。

例如：

> “我讨厌你，但我非常尊重你的能力。”

是合法关系。

---

## 5.2 Trust｜信任

回答：

> **我是否相信你会诚实、可靠，并在重要事情上不轻易伤害 / 欺骗我？**

主要来源：

- 守诺；
- 欺骗；
- 保密；
- 背叛；
- 一致性；
- 对风险的处理。

Trust 不等于：

> 喜欢。

---

## 5.3 Respect｜尊重

回答：

> **我是否认可你的能力、品格、判断、地位或选择？**

一个角色可以：

> 极其憎恨另一个人，同时高度尊重其才能。

---

## 5.4 Attachment｜情感依恋

回答：

> **你在我的情感生活中有多重要？**

Attachment 可以存在于：

- 友情；
- 家庭；
- 师徒；
- 战友情；
- 恋爱；
- 长期敌对关系。

Attachment 高：

> 不等于 Romantic Attraction 高。

---

## 5.5 Relationship Commitment｜关系投入承诺倾向

回答：

> **我愿意为这段关系承担多少持续责任、义务、公开性、忠诚或长期投入？**

Relationship Commitment 与：

- 爱；
- Attraction；
- Marriage；

都不完全相同。

一个政治婚姻可以：

> Relationship Commitment 高，Romantic Attraction 低。

---

## 5.6 Romantic Attraction｜浪漫吸引

回答：

> **我是否在浪漫 / 伴侣意义上被你吸引？**

它受：

- Romantic Preference；
- Character Definition；
- Relationship History；
- 当前 Context；
- 互动；

影响。

不能由：

> 魅力 Skill 直接写入。

---

# 6. Hidden Quantitative Representation｜隐藏量化

Runtime 可以为：

- Sentiment；
- Trust；
- Respect；
- Attachment；
- Relationship Commitment；
- Romantic Attraction；

维护内部连续量化。

目标：

> 提高长期变化、阈值判断、回归测试与不同事件积累时的稳定性。

但当前不冻结：

- 0–100；
- -100～100；
- 1–5；
- 任何具体 Scale。

## 6.1 Hard Rules

1. 不存在总 Relationship Score；
2. 单个 Dimension 的量化不自动决定其他 Dimension；
3. 不允许 `Gift = Sentiment +10` 这种固定资产公式成为默认 Core 规则；
4. Runtime 必须结合 Character Definition / Memory / Context 正式解释；
5. 玩家默认看到语义投影，不看到 NPC 隐藏精确数值。

---

# 7. Relationship Interpretation｜关系解释层

## 7.1 Source Event != Relationship Memory

来源 Event 可以来自：

- Combat；
- Health；
- Survival；
- Politics；
- Economy；
- Dialogue；
- Travel；
- Quest；
- World Event。

本 Core 不复制完整 Event。

正确链：

```text
Source Event
↓
Character-specific Interpretation
↓
Relationship Meaning
↓
Relationship Memory
↓
Directed Relationship Change
```

## 7.2 同一事件可以产生不同解释

例如：

> A 违抗 B 的命令，把 B 从火场中拖走。

B 可能认为：

- “他救了我的命。”
- “他不尊重我的判断。”

因此同一个 Memory 可以同时影响：

- Sentiment ↑
- Attachment ↑
- Trust ↑ / 不确定
- Respect ↓

不同 Character：

> 可以得出完全不同结果。

---

# 8. Relationship Memory｜关系记忆

Relationship Memory 保存：

> **某个来源事件对这段关系具有怎样的长期解释意义。**

每条 Memory 至少应能语义上回答：

- Source Event；
- Participants；
- Time；
- Character Interpretation；
- Meaning；
- 是否仍具有长期影响；
- 是否公开 / 私密；
- 当前哪些参与者知道；
- 它主要影响哪些关系维度。

## 8.1 Memory 不是数值变化记录

不能：

```text
救命之恩 = Trust +20
```

而应该：

> 保存为什么这件事会影响关系。

## 8.2 混合 Memory

同一个 Memory 可以同时：

- 正向；
- 负向；
- 矛盾。

---

# 9. Shared Relationship Bond｜共同关系事实

Shared Bond 表示：

> **双方或当前世界已经正式成立的共同关系事实。**

例如：

- acquaintance；
- friend；
- close friend；
- mentor / student；
- sworn bond；
- rival；
- enemy；
- lover；
- engagement；
- marriage；
- family bond；
- secret relationship；
- other world-defined bond。

当前只是通用语义，不冻结最终 enum。

## 9.1 Directed State != Shared Bond

A → B 的 Attraction 很高：

> 不自动形成 Lover Bond。

Lover Bond 必须来自：

> 双方正式建立的关系事实。

## 9.2 Marriage != Love

可以成立：

```text
Shared Bond:
Marriage

A → B:
Romantic Attraction = 低
Relationship Commitment = 高

B → A:
Attachment = 低
Relationship Commitment = 高
```

关系仍然合法。

---

# 10. Relationship Agreement｜关系约定

Shared Bond 之外，还可以保存双方明确达成的 Agreement。

例如：

- 是否公开；
- 是否排他；
- 是否允许其他伴侣；
- 是否计划结婚；
- 是否保密；
- 是否共同生活；
- 特定家庭 / 政治条件；
- 其他 World-defined arrangement。

Agreement：

> 是双方正式达成的关系事实。

不是 Character Personality。

---

# 10A. World OS Commitment Boundary｜与正式承诺对象的边界

本 Core 中：

> **`Relationship Commitment / 关系投入承诺倾向` 是 Directed Relationship Dimension，表示一个人愿意为一段关系承担多少持续投入与责任。**

它不等于 World OS 的正式：

> **`Commitment｜承诺对象` = 谁明确答应了谁什么。**

同样，`Relationship Agreement` 只拥有：

- 排他 / 非排他；
- 是否公开；
- 是否保密；
- 共同生活安排；
- 关系结构；
- 其他双方已经成立的关系安排事实。

如果 Agreement 中出现明确、可履行、可违背、具有期限或责任的承诺，例如：

> “我答应三个月内与你完婚。”

则正确链为：

```text
Relationship Agreement / Conversation
→ explicit promise recognized
→ World OS Commitment
```

关系核心可以引用该 Commitment，并让履行 / 违背事件进一步形成 Relationship Memory。

不得建立第二套“关系承诺任务状态”。

---

# 11. Preference｜偏好

本 Core 可以拥有：

- Romantic Preference；
- Relationship Structure Preference；
- Intimacy Preference；
- other relationship compatibility preference。

Preference 不要求：

> 固定采用现代身份标签枚举。

可以使用：

> 开放但受控的语义标签 + Compatibility / Boundary。

## 11.1 Preference != Current Attraction

一个角色与玩家：

> Compatibility = yes

仍然可以：

> Romantic Attraction = none。

---

# 12. Boundary｜个人边界

Boundary 可以表达：

- 明确接受；
- 可讨论；
- 当前不愿；
- 明确拒绝；
- 仅在特定关系成立时接受。

Boundary 是：

> Character 的正式关系事实。

## 12.1 Boundary Violation

如果一方已经明确拒绝某种关系 / 亲密行为，而另一方继续尝试越过：

这不是普通：

> “恋爱判定失败”。

而应形成：

- Boundary Violation Event；
- Relationship Memory；
- Trust / Sentiment / Fear / Hostility 等后续变化候选；
- 必要时社会 / 政治后果。

普通 Relationship Core 不把：

> “尝试”

偷写成：

> “已经发生”。

---

# 13. Romance Accessibility Profile｜恋爱可达性

本 Core 保留三档通用 Romance Accessibility。

## 13.1 Natural｜自然写实

优先：

- Character Definition；
- World / Historical Evidence；
- 当前 Game State。

对于未定义 Romantic Preference：

> 保守自然初始化。

不保证主要 NPC 与玩家兼容。

## 13.2 Player-friendly｜玩家友好【默认】

如果某项 Preference：

- 没有被 Character Definition 冻结；
- 没有被 World Fact 冻结；
- 没有被当前 Game State 冻结；

则：

> **默认保留与玩家形成浪漫关系的可能空间。**

这只改变：

> compatibility possibility。

不直接产生：

- Attraction；
- Attachment；
- Love；
- Relationship Commitment。

## 13.3 Player-oriented｜玩家导向

在尚未冻结 Preference 的情况下：

> 更积极地初始化与玩家偏好兼容的关系空间。

仍然：

> Compatibility != Attraction。

## 13.4 Accessibility 不覆盖冻结事实

普通 Accessibility 不得强制改写：

> 已经正式冻结的 Character Relationship Preference。

更高权限改写：

> 只能来自 Traveler / System 等显式 Supernatural Capability。

---

# 14. Romance Is a Relationship Subdomain｜恋爱不拆包

Romance 继续存在于本 Core 内部。

它包括：

- Romantic Attraction；
- Romantic Preference；
- Intimacy Preference；
- Lover；
- Engagement；
- Marriage；
- Romance Accessibility；
- romance-specific Boundary；
- romance-specific Agreement。

但：

> 普通关系不需要实例化全部 Romance 字段。

例如：

> 师徒关系

可以只存在：

- Respect；
- Trust；
- Attachment；
- Mentor / Student Bond；
- Relationship Memory。

不要求系统为了 Schema 完整性写：

> `Romantic Attraction = 0`。

---

# 15. Player Attempt / NPC Response｜玩家尝试与 NPC 自主回应

## 15.1 玩家决定尝试

玩家可以：

- 结识；
- 示好；
- 倾诉；
- 赠礼；
- 道歉；
- 和解；
- 告白；
- 求婚；
- 提出关系；
- 提出秘密关系；
- 提出非排他关系；
- 分手；
- 疏远；
- 设置边界；
- 尝试亲密互动。

系统不得因：

- 关系阶段不足；
- 好感度不足；
- 身份不匹配；
- 社会不鼓励；

在输入层禁止尝试。

## 15.2 NPC 决定回应

NPC 是否：

- 接受；
- 拒绝；
- 犹豫；
- 退后；
- 生气；
- 改变话题；
-认真考虑；

必须读取：

```text
Character Definition
+
Directed Relationship
+
Shared Bond
+
Relationship Memory
+
Preference
+
Boundary
+
Agreement
+
World / Social Context
+
Current Situation
```

---

# 16. Capability Boundary｜能力不是感情控制

EP-CHAR-CORE 可以通过 Optional Integration 提供：

- 表达；
- 沟通；
- 交涉；
- 礼仪；
- 其他 World-specific social capability。

它们可以影响：

- 表达质量；
- 是否说清楚；
- 是否冒犯；
- 是否抓住重点；
- 是否形成良好第一印象；
- 对方是否理解玩家真实意图。

不能直接形成：

- Love；
- Attraction；
- Trust；
- Marriage。

---

# 17. Social Context｜社会规范产生后果，不默认禁令

World / Politics / Culture 可以提供：

- 身份；
- 门第；
- 家族；
- 性别角色；
- 婚姻礼制；
- 社会规范；
- 政治敌对；
- 宗教限制。

这些可以影响：

- 风险；
- 声誉；
- 承诺；
- 是否公开；
- 家庭压力；
- Political Cost。

不能自动删除：

> 玩家关系尝试。

---

# 18. Marriage Ownership Boundary｜婚姻分权

## Relationship Core owns

- 双方是否存在 Marriage Bond；
- 双方 Agreement；
- 双方 Directed Relationship；
- 婚姻相关 Relationship Memory。

## Politics owns

- 联盟；
- 政治承认；
- 官职；
- 合法性；
- 继承政治意义。

## Economy owns

- 嫁资；
- 财产；
- 土地；
- 家庭资源流动。

因此：

```text
Marriage
!= Political Alliance
!= Love
!= Economic Transfer
```

---

# 19. Cross-domain Relationship Memory Handoff｜跨机制关系记忆

其他资产可以提供：

> Source Event / Context。

例如：

## Combat

- 并肩作战；
- 战场救援；
- 抛弃；
- 违抗命令；
- 保护。

## Health

- 救命；
- 长期照护；
- 拒绝治疗；
- 无视身体边界。

## Survival

- 分享有限资源；
- 共患难；
- 守夜；
- 放弃补给；
- 长途同行。

## Politics

- 公开支持；
- 背叛；
- 联姻；
- 政治保护。

这些资产：

> 不直接修改 Trust / Attachment。

正确链：

```text
External Event
↓
Relationship Core Interpretation
↓
Relationship Memory
↓
Directed / Shared Relationship change
```

---

# 20. NPC-NPC Offscreen Progression｜离屏关系发展

NPC 不围绕玩家存在。

NPC 可以在玩家不在场时：

- 结识；
- 交友；
- 冲突；
- 形成敌对；
- 恋爱；
- 订婚；
- 结婚；
- 分手；
- 和解；
- 疏远。

前提：

> 必须存在接触、时间、Character Definition 与真实因果来源。

禁止：

> “为了制造剧情，所以两个 NPC 突然相爱。”

重要关系变化：

> 应产生正式 Event。

玩家不知道时：

> 不自动进入 Player Knowledge。

---

# 21. Relationship Knowledge｜关系真相与玩家知识分离

Runtime 可以知道：

- NPC 对玩家真实 Sentiment；
- Trust；
- Respect；
- Attachment；
- Relationship Commitment；
- Romantic Attraction；
- Preference；
- Boundary；
- Secret Bond。

玩家知道多少：

> 取决于合法信息来源。

## 21.1 不默认显示精确隐藏关系数值

禁止默认 UI：

```text
Trust = 73
Attraction = 64
Jealousy = 38
```

## 21.2 合法信息来源

包括：

- 对方明确表态；
- 行为；
- 长期共同经历；
- 信件；
- 第三方；
- 公开关系；
- System Appraisal；
- 其他合法 Knowledge Source。

## 21.3 误解允许存在

玩家可以：

> 误判 NPC。

NPC 也可以：

> 误判玩家。

---

# 22. Player-safe Relationship Projection｜玩家可见投影

默认推荐显示：

- Shared Bond；
- 可见关系描述；
- 玩家已知 Trust / Respect / Attachment 大致语义；
- 已知 Relationship Memory；
- 已知 Boundary；
- 已知 Agreement；
- 已明确表达的 Romantic Attraction / Preference。

### 沉浸模式

只显示：

> 自然语言关系描述。

### 辅助模式

可以显示：

```text
信任：较高
尊重：很高
情感依恋：明显
浪漫吸引：未知
```

但只显示：

> Player Knowledge 中已经合法获得的部分。

---

# 23. Relationship Assistance / Traveler System Handoff

Traveler / System 可以提供：

- Relationship Appraisal；
- Opportunity Assistance；
- Compatibility Expansion；
- Social Shield；
- Relationship Rewrite；
- Romance Sandbox。

但 Relationship Truth Owner：

> 仍然是本 Core。

正确链：

```text
System Capability
↓
Permission Scope
↓
Relationship Core Interface
↓
State Change Candidate
↓
Program Validation
↓
Atomic Commit
```

## 23.1 普通 Accessibility 与 System Rewrite 分离

```text
Relationship Accessibility
= 普通初始化 / 体验策略

System Relationship Rewrite
= 显式超常修改
```

不能混成隐形后门。

---

# 24. Agency Override / Mind Control Boundary

以下内容不属于本 Core：

> “让某 NPC 现在必须爱我。”

> “让 NPC 必须接受我的亲密行为。”

> “忽略对方当前意愿。”

这些属于：

> Character Agency Override / Mind Control

若未来存在：

- 必须显式启用；
- 必须声明权限；
- 必须单独审计；
- 不得伪装成魅力或普通 Relationship Bonus。

本 Core 只负责：

> Relationship Truth 与自主关系发展。

---

# 25. Relationship Action Grammar｜高频关系行为

可以提供通用高频结构：

- meet；
- converse；
- express appreciation；
- gift；
- share secret；
- confess；
- propose；
- establish agreement；
- intimate attempt；
- declare boundary；
- apologize；
- reconcile；
- distance；
- break relationship；
- make public；
- keep secret。

这些不是：

> 玩家关系行为白名单。

Open Attempt 继续成立。

---

# 26. Relationship Resolution Contract｜统一关系裁定链

推荐：

```text
Relationship Attempt / External Event
↓
Agency Authorization
↓
Current Directed State
↓
Shared Bond
↓
Relationship Memories
↓
Preference / Boundary / Agreement
↓
Character Definition
↓
Optional Capability
↓
World / Social Context
↓
Character-specific Interpretation
↓
必要时 Program Resolution
↓
Relationship Outcome Candidate
↓
Validation
↓
Atomic Commit
↓
Relationship Event / Memory
↓
Player-safe Feedback
```

---

# 27. Program Authority｜模型不能直接写关系真值

资产定义：

- Dimension；
- Memory Grammar；
- Bond Grammar；
- Boundary；
- Accessibility；
- Resolution semantics。

Runtime 拥有：

- 数值量化；
- RNG / Dice；
- Formal Outcome；
- State Mutation；
- Atomic Commit。

模型可以：

- 生成自然语言互动；
- 提出 Relationship Interpretation Candidate；
- 提议 Memory Meaning；
- 根据 Player-safe 状态生成叙事。

模型不能正式宣布：

- `Trust +20`；
- `Attraction = 87`；
- Marriage 已成立；
- Boundary 被覆盖；
- NPC 必须接受。

---

# 28. Dice / Necessity Gate｜不滥用随机

关系行为不是每次都要 Dice。

例如：

> NPC 已明确拒绝某段恋爱关系，Context 没有变化。

重复告白：

> 不需要为了“再给玩家机会”反复 Dice。

只有在：

- 结果真实不确定；
- Capability / Context 差异有意义；
- Character Response 存在多个合理分支；

时才需要 Program Resolution。

---

# 29. Age / Adult Intimacy Boundary

成人性化亲密玩法：

> 只对明确为成年人的 Character 开启。

未成年 Character：

- 可以拥有友情；
- 家庭；
- 师徒；
- 年龄适当的非性化情感关系；

但不进入成人性化亲密机制。

年龄不明：

> 在正式确认成年状态前，不启用成人亲密分支。

---

# 30. Definition / Instance Boundary

必须区分：

```text
Relationship Dimension Definition
≠
Relationship State Instance
≠
Relationship Memory
≠
Shared Bond
≠
Source Event
≠
Character Personality
```

游戏中的关系变化：

> 保存于 Game State。

不回写：

- Character Card；
- World Pack；
- Expansion Definition。

---

# 31. Save / Restore

需要恢复：

- Directed State；
- hidden quantitative representation；
- Shared Bond；
- Relationship Memory；
- Preference；
- Boundary；
- Agreement；
- Accessibility Profile；
- Player Knowledge；
- Relationship Event 边界。

读取旧档：

> 后续产生的恋爱 / 婚姻 / 分手不能污染旧时间点。

---

# 32. Standard Regression Scenarios｜24 个

## T-REL-01｜喜欢但不信任

期望：

- Sentiment 高；
- Trust 低；
- 不压成单一好感度。

## T-REL-02｜尊重的敌人

两人互为敌对 Bond。

A 对 B：

- Sentiment 很负面；
- Respect 很高。

期望：

> 合法。

## T-REL-03｜单向浪漫吸引

A 爱 B，B 只把 A 当朋友。

期望：

- Directed State 非对称；
- Lover Bond 不自动成立。

## T-REL-04｜已婚但无爱情

Marriage Bond 成立。

期望：

- Attraction / Attachment 独立；
- Politics / Economy 不由本 Core 自动生成。

## T-REL-05｜救命与违命共存

一个 Event 同时：

- 救命；
- 违背明确命令。

期望：

- 形成混合 Relationship Memory；
- 多 Dimension 可以不同方向变化。

## T-REL-06｜送礼不是固定加分

给清廉人物昂贵礼物。

期望可能：

- 喜欢；
- 不适；
- 怀疑；
- 拒绝；
- 视为贿赂。

不固定：

> Sentiment +10。

## T-REL-07｜第一次见面求婚

期望：

- 输入允许；
- NPC 自主回应；
- 不自动 Marriage。

## T-REL-08｜Capability 高仍被拒绝

社交能力很强。

NPC 有明确 Relationship Commitment / Value 冲突。

期望：

- 表达可以更好；
- 不覆盖 NPC 自主决定。

## T-REL-09｜玩家友好 Accessibility

Preference 未冻结。

期望：

- 保留兼容可能；
- 不自动产生 Attraction。

## T-REL-10｜冻结 Preference

Character Definition 已正式冻结 Preference。

期望：

- 普通 Accessibility 不改写。

## T-REL-11｜System Rewrite

Traveler/System 拥有合法 Relationship Rewrite。

期望：

- 经本 Core 接口修改；
- 普通 Core 不获得超常权限。

## T-REL-12｜没有 Agency Override

系统只有 Compatibility Rewrite。

玩家要求：

> “让 NPC 现在必须接受告白。”

期望：

> 拒绝该 System Capability；NPC 仍自主回应。

## T-REL-13｜Boundary Declared

NPC 明确拒绝某亲密行为。

期望：

- Boundary 保存为正式关系事实。

## T-REL-14｜Boundary Violation

玩家继续尝试越过明确拒绝。

期望：

- 尝试可以输入；
- 不把拒绝改写为接受；
- 产生 Violation / Memory / Relationship 后果。

## T-REL-15｜NPC-NPC 离屏恋爱

有时间、接触、历史。

期望：

- 可以发展；
- 无玩家时世界仍运行。

## T-REL-16｜无因果三角恋

Runtime 只因为“剧情需要”让两个陌生 NPC 恋爱。

期望：

> 不成立。

## T-REL-17｜Combat Memory

战斗中救援。

期望：

- Combat 提供 Event；
- Relationship Core 解释成 Memory；
- Combat 不直接修改 Trust。

## T-REL-18｜Health Care Memory

一方长期照护另一方。

期望：

- Health / Event 提供事实；
- Relationship Core 决定关系意义。

## T-REL-19｜Survival Shared Resource Memory

资源极少时分享饮水。

期望：

- Survival 提供 Event；
- Relationship Core 解释；
- 不固定 Attachment +X。

## T-REL-20｜隐藏 Attraction

NPC 有浪漫吸引，但未表露。

期望：

- Runtime Truth 存在；
- Player Knowledge 不自动知道。

## T-REL-21｜误判

玩家错误理解 NPC 行为。

期望：

- 玩家知识可以与真实 Relationship State 不同。

## T-REL-22｜Marriage / Politics Separation

婚姻成立。

期望：

- 不自动创建政治联盟。

## T-REL-23｜Save / Restore

婚后多年读回婚前存档。

期望：

- 旧关系状态完整恢复；
- 后续 Marriage 不污染旧档。

## T-REL-24｜无 Universal Score

六个 Dimension 长期变化。

期望：

- Runtime 不生成一个反向覆盖六维的权威好感值。

---

# 33. Host Requirements

| ID | Host 能力 | 必需性 | 缺失行为 |
|---|---|---|---|
| HR-REL-01 | Directed Pair State | 必需 | 无法表达 A→B / B→A |
| HR-REL-02 | Multi-dimension Relationship State | 必需 | 退化成单值 |
| HR-REL-03 | Hidden Quantitative Representation | 推荐 | 可降级为语义等级 |
| HR-REL-04 | Shared Bond | 必需 | 无法保存共同关系事实 |
| HR-REL-05 | Relationship Memory | 必需 | 关系退化成积分 |
| HR-REL-06 | Character-specific Interpretation | 必需 | 所有人对事件反应相同 |
| HR-REL-07 | Preference / Boundary / Agreement | 必需 | 恋爱与自主性降级 |
| HR-REL-08 | Accessibility Profile | 推荐 | 玩家友好策略降级 |
| HR-REL-09 | Knowledge-safe Projection | 必需 | 隐藏感情泄露 |
| HR-REL-10 | NPC-NPC Offscreen Progression | 推荐 | 世界围绕玩家 |
| HR-REL-11 | External Event Handoff | 推荐 | Combat / Health 等无法贡献 Memory |
| HR-REL-12 | Capability Query | 推荐 | 社交能力只能粗粒度 |
| HR-REL-13 | Relationship Rewrite Permission | Traveler/System 使用时必需 | 高权限接口失控 |
| HR-REL-14 | Save / Restore | 必需 | 长期关系丢失 |
| HR-REL-15 | Atomic Commit | 必需 | Bond / Memory 半提交 |
| HR-REL-16 | Declarative Relationship UI | 推荐 | 聊天降级 |

---

# 34. Creator / asset-spec vNext Requirements

未来需要声明式支持：

- Directed Relationship State；
- Six Relationship Dimensions；
- Hidden Quantitative Representation；
- Shared Bond；
- Relationship Memory；
- Relationship Interpretation；
- Preference；
- Boundary；
- Agreement；
- Accessibility Profile；
- Relationship Action；
- Relationship Knowledge Projection；
- External Event → Relationship Memory Handoff；
- Relationship Assistance / Rewrite Permission；
- NPC-NPC Progression Policy；
- Relationship UI Contribution。

Creator 不应：

- 编写任意 JS；
- 直接决定 NPC 爱谁；
- 直接提交 Marriage；
- 绕过 Boundary；
- 自建第二关系系统。

---

# 35. Dependency / Integration Matrix

| Provider / Asset | Relationship Core | Relation |
|---|---|---|
| Character Definition | Personality / Value / Relationship Style | Required Semantic Provider |
| EP-CHAR-CORE | Social Capability | Optional Integration |
| EP-COMBAT-CORE | Combat Event / Memory Source | Optional Integration |
| EP-HEALTH-CORE | Care / Rescue / Health Event | Optional Integration |
| EP-SURVIVAL | Shared hardship / Resource event | Optional Integration |
| World Pack | Social / Cultural Context | Provider |
| Politics | Political Context / Marriage consequence | Optional Integration |
| Economy | Gift / Marriage resource context | Optional Integration |
| Traveler/System | Relationship Assistance / Rewrite | Optional High-permission Integration |
| Runtime | Formal Outcome / Commit | Execution Owner |

## 35.1 No Hard Dependency Requirement

当前本 Core：

> **不 Hard Depend EP-CHAR-CORE、Combat、Health、Survival、Politics、Economy、Traveler/System。**

它可以在最小 Character Definition + Runtime 条件下独立运行。

---

# 36. Migration From v0.1.1｜旧资产迁移

## 36.1 保留

- Directed Relationship；
- Shared Bond；
- Trust；
- Respect；
- Attachment；
- Romantic Attraction；
- Relationship Commitment；
- Relationship Memory；
- Preference；
- Boundary；
- Accessibility；
- Agreement；
- NPC-NPC progression；
- Relationship Knowledge；
- Traveler Relationship Assistance；
- Player Attempt / NPC Response；
- Social Context separation；
- Open Attempt。

## 36.2 新增

- Sentiment；
- Hidden Quantitative Representation Contract；
- Relationship Interpretation Layer；
- Relationship Memory 的 Source Provenance 强化；
- Core-level cross-domain Event Handoff；
- Relationship Core 独立依赖策略。

## 36.3 删除 / 降级汉末专属绑定

原文件中的：

- 三国 politics_expansion；
- economy_expansion；
- war_expansion；
- history_expansion；
- asset_family_blueprint；

不再作为通用 Core 的正式依赖。

它们只可在汉末三国安装时：

> 作为 Adapter / Optional Integration。

---

# 37. Quality Gate｜重构自检

| Gate | 结果 |
|---|---|
| Discussion / Authorization | PASS |
| Generic Core Positioning | PASS |
| Romance kept inside Relationship | PASS |
| No Universal Affection Score | PASS |
| Sentiment Added | PASS |
| Directed Asymmetry | PASS |
| Shared Bond Separation | PASS |
| Relationship Memory | PASS |
| Character-specific Interpretation | PASS |
| Hidden Quantitative Representation | PASS |
| NPC Agency | PASS |
| Boundary | PASS |
| Accessibility | PASS |
| Capability != Emotion Control | PASS |
| Politics / Economy Separation | PASS |
| Traveler Rewrite Boundary | PASS |
| Agency Override Separation | PASS |
| Player-safe Knowledge | PASS |
| Program Authority | PASS |
| Definition / Instance | PASS |
| Creator Authorability | WARN — G9 binding pending |

---

# 38. Current State

```text
EP-RELATIONSHIP-ROMANCE-CORE｜关系与恋爱核心
├─ Old v0.1.1 Review             COMPLETE
├─ Discussion Gate               COMPLETE
├─ Explicit Authorization        COMPLETE
├─ Core Major Rewrite            COMPLETE
├─ Sentiment Dimension           ADDED
├─ Hidden Quantitative Contract  ADDED
├─ Generic Dependency Rebind     COMPLETE
├─ Semantic Candidate v0.2       AUDITED CURRENT
├─ Creator / asset-spec vNext    PENDING G9
└─ Independent Cross-asset Audit PASS
```

---

# 39. Final Freeze｜最终冻结语句

> **关系与恋爱核心拥有人物之间持续存在的人际关系事实。**
>
> **恋爱不是第二套系统，而是 Relationship Domain 中被游戏设计强化的一部分。**
>
> **A → B 与 B → A 永远独立；Directed State 与 Shared Bond 永远独立。**
>
> **六个核心 Directed Dimension 为 Sentiment、Trust、Respect、Attachment、Relationship Commitment、Romantic Attraction。**
>
> **各 Dimension 可以拥有 Runtime 隐藏量化，但不能合并成一个万能“好感度”，玩家也默认不能读取 NPC 精确隐藏数值。**
>
> **Relationship Memory 不是来源 Event 的复制，而是 Character 对该 Event 的关系意义解释。**
>
> **Capability 可以帮助表达和互动，但不能制造爱、信任或承诺。**
>
> **玩家拥有关系尝试自由，NPC 对自己的感情、边界、承诺和关系回应拥有自主权。**
>
> **Romance Accessibility 只处理未冻结兼容空间，不自动制造 Attraction；更强改写必须通过 Traveler / System 等显式高权限 Capability。**
>
> **普通 Relationship Core 不拥有 Character Agency Override / Mind Control。**


---

# 40. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 当前正式 UI 语义：

- **不拥有独立一级 Extension Surface；**
- 主要贡献到 Core `人物` Surface；
- 可贡献 Person Detail / Player Character Detail；
- Relationship Memory / 已知关系事实可通过玩家安全投影进入人物详情；
- 只有玩家合法知道的关系维度、Boundary、Agreement 与 Memory 才可展示；
- 精确隐藏量化默认不发送浏览器。

本 Core 与 World OS 的 `Task / Commitment / Event / Knowledge` 保持独立 Owner，只通过引用 / Handoff 交互。

**通用库独立审核：PASS。**
