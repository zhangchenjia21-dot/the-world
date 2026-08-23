---
title: 人物能力与技艺｜Expansion Pack
aliases:
  - EP-CHAR-CORE
  - Character Capability Core
  - 人物长期能力底座
created: 2026-08-15
updated: 2026-08-16
status: audited-current
version: 0.1.5
workflow_mode: light-asset
operation_mode: revise
asset_type: expansion-pack
skill: tavern-asset v0.5.2
output_profile: obsidian-markdown
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
generic_reuse_target: true
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Character
  - Capability
  - Growth
  - Skill
  - Experience
  - Specialty
  - Style
  - Creed
  - 通用资产
  - Obsidian
---

# 人物能力与技艺｜Expansion Pack v0.1.5

> [!abstract] 资产定位
> `EP-CHAR-CORE｜人物能力与技艺` 是一份**跨 World Pack 通用的人物长期能力基础 Expansion**。
>
> 它负责定义人物六层成长的共同运行语义：
>
> **属性 → 技能 → 经历 → 专长 → 风格 → 信条**
>
> 它不决定某个具体角色“是谁”，也不拥有伤势、关系、物品、法术、神术或世界规则。
>
> Character Card 提供某个角色的初始六层内容；本 Expansion 规定这些内容怎样成为可持续演进的能力结构；Game State 保存该角色实例当前真正处于什么状态；Runtime 最终决定行动是否成功。

> [!important] 当前可信状态
> **已审核语义稿 v0.1.5｜六层人物能力 Ownership 继续 PASS｜Combat Core Skill Contribution 接口收口复审通过｜Creator / asset-spec vNext 绑定前语义稿**
>
> 本稿冻结的是资产语义、Ownership、依赖与运行要求，不假装当前已经存在最终机器字段、JSON Schema 或正式 Runtime API。

---

# 0. Scope Lock｜资产职责边界

## 0.1 本 Expansion 唯一回答的问题

> **一个长期存在的人物，稳定地“能够做什么、学会了什么、经历过什么、形成了什么专长、通常怎样做事、长期相信什么”？**

它是人物长期 Capability 的共同事实源。

## 0.2 本 Expansion 必须负责

- 六层成长的正式语义；
- 六项通用基础属性；
- 通用 Skill Registry；
- 技能熟练度语义；
- 未掌握技能时的开放尝试边界；
- 经历的长期能力意义；
- 专长形成、保持与失效边界；
- 执行风格的长期连续性；
- 信条的长期连续性；
- 学习、训练、实践与成长；
- 技能退化与长期不用；
- Character Card 初始能力实例化；
- World Pack / 种族 / 年龄 / 背景事实对初始能力的合法输入；
- 其他 Expansion 向统一 Skill Registry 贡献领域技能的方式；
- 能力查询与 Runtime Resolution 的接口语义；
- 玩家安全能力投影；
- NPC 能力知识的来源、可信度与不确定性；
- 人物能力 UI Contribution 的声明需求；
- 长期人物能力与临时状态之间的隔离。

## 0.3 本 Expansion 明确不负责

- 某个具体角色的姓名、身份、人格故事或秘密；
- 角色当前所在 Region / Place / Scene；
- 伤势、疾病、疲劳、饥饿、中毒等短中期身体状态；
- HP、护甲、伤口严重度等 Health State；
- 关系、好感、忠诚、爱情或政治支持；
- Item、装备、所有权与 Placement；
- 魔法适应性、法术列表、魔力体系或施法 Resolution；
- 神性连接、神术与神职机制；
- 战争、经济、政治、经营等领域规则；
- Dice、RNG、Program Judge、Formal Outcome；
- 玩家输入授权；
- Character Knowledge 的全局事实源；
- World Pack 的种族、国家、历史或世界规则；
- Character Card 原始定义的写回；
- 总等级、统一 XP 条或万能战斗力评分。

## 0.4 越界处理

若其他资产需要“人物会不会做某事”的长期能力事实：

```text
其他 Expansion / Runtime
→ 查询 Character Capability Profile
→ 使用正式能力事实
→ 不建立第二套人物能力状态
```

若本 Expansion 发现某项变化其实属于伤势、关系、物品、法术或世界状态：

> **拒绝接管 Ownership，转交正式 Owner。**

---

# 1. Core Principle｜人物能力不是角色等级

本 Expansion 不建立：

- Lv.1 / Lv.20；
- 总经验值；
- 统一人物战斗力；
- 升级后自动提高全部能力；
- 每回合积累通用 XP；
- “等级不够所以不能尝试”的动作白名单。

人物成长必须来自：

- 学习；
- 训练；
- 实践；
- 职责；
- 长期工作；
- 真实事件；
- 失败与反思；
- 导师；
- 环境；
- 世界内合法变化。

> **能力的形成必须有因果来源。**

---

# 2. Canonical Character Growth｜六层人物成长

人物长期能力统一由六层组成：

```text
属性 Attributes
↓
技能 Skills
↓
经历 Experiences
↓
专长 Specialties
↓
执行风格 Styles
↓
信条 Creeds
```

这不是六个彼此孤立的列表。

它们回答不同问题。

| 层 | 回答的问题 | 典型变化速度 |
|---|---|---|
| 属性 | 这个人的基础能力条件怎样 | 最慢 |
| 技能 | 他具体训练过什么、掌握到什么程度 | 中等 |
| 经历 | 他真实做过、承受过、参与过什么 | 发生即留存 |
| 专长 | 哪些能力已经形成稳定、独特优势 | 慢 |
| 风格 | 他通常怎样执行行动 | 渐进 |
| 信条 | 哪些长期信念真正影响判断与行为 | 最慢，需重大因果 |

## 2.1 六层 Ownership

本 Expansion：

> 定义六层的运行语义、合法变化方式与互相作用。

Character Card：

> 提供某个角色的初始六层内容。

World Pack / Species / Background：

> 提供能够解释初始能力差异的世界事实。

其他 Expansion：

> 可以贡献领域 Skill Definition、专长模板或能力消费规则，但不能拥有第二套 Character Capability State。

Game State：

> 保存人物实例当前六层状态。

Runtime：

> 根据六层能力 + 当前状态 + 环境 + 规则确定 Formal Outcome。

---

# 3. Attributes｜六项通用基础属性

本 Expansion 默认采用六项跨题材通用属性：

1. **体魄**
2. **协调**
3. **感知**
4. **思维**
5. **意志**
6. **表达**

这些属性不是 D&D 六维的换名版本。

它们只描述能够长期影响行动能力的基础条件。

---

# 4. 体魄｜Body

体魄描述：

- 身体力量；
- 耐力；
- 身体承载能力；
- 长时间运动能力；
- 对身体负荷的基础耐受；
- 需要依靠整体身体能力完成行动时的基础条件。

体魄**不等于**：

- 当前 HP；
- 当前是否受伤；
- 是否疲劳；
- 体型本身；
- 战斗力；
- 武器技能。

例如：

> 一名体魄卓越但重伤的人，当前行动能力仍可能非常差。

伤势由其他正式状态 Owner 负责。

---

# 5. 协调｜Coordination

协调描述：

- 身体控制；
- 反应；
- 平衡；
- 手眼协调；
- 精细动作的基础能力；
- 复杂动作序列的身体执行条件。

协调**不等于**：

- 剑术；
- 开锁；
- 射击；
- 驾驶；
- 施法控制。

这些属于技能或领域机制。

协调只是它们可能消费的基础能力之一。

---

# 6. 感知｜Perception

感知描述：

- 对外界变化的觉察；
- 视觉、听觉等普通感官信息的处理基础；
- 对异常、细节与环境信号的发现能力；
- 在信息不完全时捕捉有效线索的基础条件。

感知**不自动包含**：

- 魔法感知；
- 位面感知；
- 超自然直觉；
- 读心；
- 预言。

这些特殊感知必须由对应 World Pack / Expansion 提供正式来源。

---

# 7. 思维｜Cognition

思维描述：

- 学习；
- 分析；
- 抽象推理；
- 模式识别；
- 理论理解；
- 复杂问题拆解；
- 长期知识体系构建的基础能力。

思维**不等于**：

- 已经拥有的知识；
- 魔法理论技能；
- 学历；
- 智慧或道德判断；
- “聪明所以什么都知道”。

知识必须有真实来源。

---

# 8. 意志｜Will

意志描述：

- 专注；
- 自控；
- 长期坚持；
- 承受精神压力；
- 在干扰下维持既定行动；
- 对自身冲动与恐惧的基础调节能力。

意志**不能被用于**：

> 替玩家决定“这个角色应该坚持什么”。

玩家角色的重大立场和选择仍由玩家决定。

意志只影响：

> 当玩家已经选择某个方向以后，角色在客观压力下能否稳定执行。

---

# 9. 表达｜Expression

表达描述：

- 将思想清晰传递给他人的基础能力；
- 语言组织；
- 非语言呈现；
- 临场表达；
- 沟通信息的清楚程度；
- 公开表达与表演的基础条件。

表达**不等于**：

- 魅力；
- 美貌；
- 权威；
- 社会地位；
- 好感；
- NPC 是否愿意服从；
- “表达高所以说服必定成功”。

社交结果仍必须考虑：

- 对方利益；
- 关系；
- 身份；
- 证据；
- 权力；
- 当前立场；
- 世界事实；
- 社交判定闸门。

---

# 10. Attribute Scale｜属性语义等级

本 Expansion 推荐使用有序自然语言等级，而不是 1–100 数值：

```text
薄弱
→ 偏弱
→ 常态
→ 良好
→ 优秀
→ 卓越
→ 超常
```

## 10.1 等级是语义，不是百分位

“优秀”表示实际能力表现达到稳定高水平。

它不表示：

> “这个角色一定比同种族 90% 的人强”。

World Pack 可以根据物种、身体结构与世界尺度提供校准背景，但不能重新定义六项属性的 Owner。

## 10.2 Runtime 可以内部映射

若 Runtime Resolution 需要数字权重，可以进行内部映射。

但是：

- 数值映射不成为资产作者的第二事实源；
- Character Card 不需要填写伪精确分数；
- UI 默认优先展示语义等级。

---

# 11. Skill Registry｜统一技能注册体系

人物技能只能进入一个正式 Registry。

```text
EP-CHAR-CORE
→ owns Skill Registry semantics

其他 Expansion
→ contributes Skill Definitions

Character Capability Profile
→ owns current skill mastery
```

其他 Expansion 不得建立：

> “自己的技能状态表”。

例如未来：

```text
基础魔法 Expansion
→ 贡献魔法理论 / 施法控制等技能定义

战争 Expansion
→ 贡献战术 / 统兵等技能定义

经济 Expansion
→ 贡献会计 / 商业估值等技能定义
```

人物最终仍只有一份统一 Skill Profile。

---

# 12. Core Seed Skills｜通用基础技能

本 Expansion 提供少量跨题材基础技能，以避免每个 World Pack 重复创造最基本的人类活动能力。

建议基础目录：

### 身体与动作

- **运动**：奔跑、跳跃、持续身体运动等训练性能力；
- **精细操作**：需要稳定、精确手部控制的通用操作；
- **隐匿**：减少自身被常规观察发现的训练能力。

### 感知与调查

- **观察**：主动注意环境与人物的可见细节；
- **搜寻**：系统寻找物件、痕迹、隐藏结构或异常；
- **追踪**：依据真实痕迹持续判断移动路线与活动迹象。

### 学习与认知

- **学习**：吸收并掌握新知识或技能的方法能力；
- **研究**：组织资料、验证来源、长期调查一个知识问题；
- **推理**：根据已有信息进行结构化判断。

### 社会表达

- **沟通**：准确理解并传递实际信息；
- **交涉**：围绕利益、条件和立场进行谈判；
- **欺瞒**：有意识地制造、维持或包装错误认知；
- **表演**：以预期形式向观众呈现声音、动作、角色或情绪。

这些技能不是完整技能表。

专业领域应由对应 Expansion 继续贡献。

---

# 13. Skill Proficiency｜技能熟练度

技能熟练度统一使用：

```text
未掌握
→ 初学
→ 基础
→ 熟练
→ 精通
→ 卓越
→ 顶尖
```

## 13.1 “未知”不是熟练度

NPC 玩家安全投影中可以出现：

> 技能：未知

但这是 Character Knowledge / Player Knowledge 的状态，不是 NPC 的真实技能水平。

后台真实角色可能已经达到精通，只是玩家不知道。

## 13.2 熟练度不是自动成功率

技能高只说明：

> 人物拥有更强的正式能力依据。

最终 Outcome 仍由 Runtime 决定。

---

# 14. Open Attempt｜技能目录不是行为白名单

硬规则：

> **没有某个技能，不代表不能尝试对应行动。**

例如：

- 不会游泳的人可以跳进水里尝试；
- 没学过开锁的人可以拿工具乱试；
- 没受过正式演讲训练的人仍可以发表讲话；
- 没学过专业追踪的人仍可以查看明显足迹。

但是：

> **能尝试 ≠ 有合理成功机会。**

Runtime 必须区分：

1. 可以直接成功的普通行为；
2. 可以尝试但存在真实不确定性的行为；
3. 当前条件下事实上不可能的行为。

## 14.1 形式资格例外

某些行动除了能力还需要：

- 法律资格；
- 正式知识；
- 特定工具；
- 特定身体结构；
- 神性连接；
- 魔法能力；
- 专业认证。

这种情况的失败原因是：

> 缺少真实 Capability / Requirement。

而不是：

> “技能表里没有按钮”。

---

# 15. Experience｜经历

经历回答：

> **这个人真实做过、参与过、承受过什么，以至于未来相关行动不能把他当作完全没有背景的人？**

经历不是 XP。

经历不使用统一等级。

典型经历：

- 在边境服役七年；
- 长期经营一家商铺；
- 参与过大型灾害救援；
- 主持过复杂学术项目；
- 长期照顾重病亲属；
- 曾担任外交使节；
- 在一次大型事故中生还；
- 在同一行业工作二十年。

## 15.1 经历必须是真实历史

经历必须拥有合法来源：

- Character Card 已确认背景；
- World Pack 合法角色背景；
- 已发生正式 Event；
- 长期 Game State 发展。

模型不能因为当前行动需要优势，就临时发明：

> “你其实以前干过这个。”

## 15.2 经历不是数值 Buff

禁止：

```text
边境老兵
→ 所有战斗 +5
```

正确语义：

> 当一个行动与真实边境服役经验相关时，该经历可以成为 Capability / Resolution 的正式证据之一。

---

# 16. Specialty｜专长

专长回答：

> **一个人是否已经在某个足够具体的能力领域形成稳定、可重复、能够被他人识别的独特优势？**

专长不是普通技能高一级的别名。

## 16.1 专长来源

专长通常来自组合：

```text
较高技能
+
长期相关经历
+
多次稳定表现
+
必要的训练 / 方法 / 身体条件
```

## 16.2 初始专长

Character Card 可以提供初始专长，但必须说明背景来源。

例如：

> 一名已经从业四十年的顶级修复师，可以开局拥有“精密古物修复”专长。

不能因为作者想让角色显得强，就列出十几个没有来源的专长。

## 16.3 专长应保持窄而真实

推荐：

> “复杂谈判中的条件拆解”

不推荐：

> “社交大师”

推荐：

> “高风险环境下的精细机械维修”

不推荐：

> “全能工匠”

---

# 17. Style｜执行风格

执行风格回答：

> **这个人通常怎样做事？**

例如：

- 谨慎验证；
- 快速决断；
- 重视准备；
- 偏好试探；
- 强调协作；
- 喜欢冒险；
- 重程序；
- 重经验；
- 重效率；
- 重隐蔽。

## 17.1 风格不是人格全文

风格不拥有：

- 爱谁；
- 恨谁；
- 当前情绪；
- 价值判断全文；
- 当前目标；
- 关系状态。

这些由 Character Definition / Game State / Relationship 等正式 Owner 负责。

## 17.2 玩家角色的 Agency 边界

玩家角色具有“谨慎验证”风格，不代表系统可以替玩家决定：

> “你决定不冒险。”

系统最多可以：

- 在建议行动中体现既有风格；
- 在玩家已经授权某个行动后，用风格解释执行方式；
- 让风格成为某些 Resolution 的方法依据。

不能用风格替玩家授权行动。

---

# 18. Creed｜信条

信条回答：

> **有哪些已经稳定到足以长期影响人物判断的核心信念？**

例如：

- 知识不应被血统垄断；
- 承诺一旦做出就必须履行；
- 家族利益高于个人荣誉；
- 任何权力都必须接受监督。

## 18.1 信条不是瞬时想法

不能因为角色一回合说：

> “这次我不相信他。”

就创建：

> “我永远不相信任何人。”

## 18.2 信条变化必须缓慢

NPC 的信条可以因：

- 长期经历；
- 重大背叛；
- 世界观被决定性证据推翻；
- 长期社会身份变化；
- 极端危机；
- 真正意义上的成长；

发生改变。

普通事件不能每回合重写信条。

## 18.3 玩家角色信条边界

对玩家控制角色：

> **信条不能替玩家决定重大价值选择。**

角色卡中的既有信条是初始历史与人格事实。

但游戏进行中：

- 是否继续坚持；
- 是否放弃；
- 是否背叛；
- 是否形成新核心信念；

必须尊重玩家明确选择和长期行为证据。

---

# 19. Growth｜成长机制

成长不由统一 XP 驱动。

合法成长来源包括：

- 正式学习；
- 训练；
- 导师指导；
- 实际工作；
- 高质量实践；
- 失败与复盘；
- 长期职责；
- 重大经历；
- 特殊世界能力合法影响。

## 19.1 成长不是“做一次就升级”

禁止：

> 成功挥剑一次 → 剑术升级。

禁止：

> 阅读一本书十分钟 → 研究能力从基础到精通。

能力提升必须与：

- 当前层级；
- 学习质量；
- 时间；
- 训练密度；
- 难度；
- 导师；
- 实践；
- 机会成本；

相匹配。

---

# 20. Growth Velocity｜不同层级的变化速度

推荐默认关系：

```text
属性
→ 最慢

技能
→ 可以持续成长

经历
→ 事件成立即保留

专长
→ 需要长期形成

风格
→ 渐进变化

信条
→ 只有重大因果才明显变化
```

## 20.1 属性成长

属性可以改变，但应非常谨慎。

例如：

- 长期高强度体能训练可能改善体魄；
- 长期精细训练可能改善协调；
- 年龄、身体改变或世界内合法改造也可能影响属性。

属性不能因为完成一个普通任务直接提高。

---

# 21. Skill Decay｜技能退化

部分技能允许退化。

典型条件：

- 长期不用；
- 身体结构发生重大变化；
- 长期缺乏维护性训练；
- 知识体系发生结构性变化；
- 世界内合法能力损失。

技能退化应：

- 渐进；
- 有时间依据；
- 不因短期休息发生；
- 不删除真实经历。

## 21.1 经历通常不退化

> “曾经做过”不会因为多年不用变成“从未做过”。

但是：

> 旧经历是否仍能有效支持当前行动，需要结合时效与世界变化判断。

---

# 22. Specialty Dormancy｜专长失活

专长一般不因普通时间流逝直接消失。

但是可能进入：

> **暂时无法充分发挥**

例如：

- 对应技能严重退化；
- 身体条件已经变化；
- 世界技术体系彻底改变；
- 缺少必要工具或资格。

专长的历史来源继续存在。

---

# 23. Character Bootstrap｜人物能力实例化

人物进入一局游戏时：

```text
Character Card
+
World Pack / Species / Background facts
+
Enabled Expansion definitions
→ Character Capability Bootstrap
→ Character State
```

## 23.1 Character Card 提供

- 初始属性建议；
- 已掌握技能；
- 重要经历；
- 初始专长；
- 执行风格；
- 信条；
- 对能力具有真实意义的背景事实。

## 23.2 World Pack 提供

- 种族 / 身体结构；
- 世界教育条件；
- 合法职业背景；
- 年龄与寿命语境；
- 社会制度；
- 世界特有能力来源。

## 23.3 Expansion 提供

- 领域技能 Definition；
- 能力依赖；
- 领域专长模板；
- 合法成长路径。

## 23.4 Game State 保存

实例化完成后的当前人物能力。

原 Character Card 不被回写。

---

# 24. Species / Age / Background｜种族、年龄与背景

硬规则：

> **种族和背景提供真实能力条件，不提供机械固定 +2 / -2 模板。**

例如：

> 一个长寿种族更有机会拥有数十年连续研究经历。

不等于：

> 所有该种族“思维 +2”。

又例如：

> 某位面来源种族对空间异常具有特殊生理感知。

这里必须拆分 Owner：

- World Pack 只拥有“该物种具有何种生理 / 世界事实”的 Definition；
- 若该特征需要领域专属运行规则，由对应领域 Expansion 定义规则语义；
- 角色实例实际具有何种长期基础属性 / 技能，仍写入本 Expansion 的 Character Capability State；
- 若它属于独立领域状态（例如未来魔法适应性），则由该领域 Expansion 单独拥有，不能复制到本 Expansion。

不应伪装成：

> “感知属性天然更高”。

## 24.1 年龄

年龄可以影响：

- 身体条件；
- 已有经历数量；
- 学习机会；
- 职业资格；
- 社会身份。

但年龄本身不能自动生成：

> “老 = 智慧高”

或：

> “年轻 = 一定体魄高”。

---

# 25. Domain Skill Contribution｜领域技能贡献

其他 Expansion 可以向 Skill Registry 提供技能 Definition。

要求：

1. 技能拥有明确领域含义；
2. 不重复已有技能；
3. 不用同义词建立第二份状态；
4. 说明它消费哪些基础属性或其他能力证据；
5. 说明未掌握时是否仍允许尝试；
6. 不直接规定 Formal Outcome；
7. 不拥有 Character State 的第二副本。

## 25.1 冲突处理

例如两个 Expansion 都试图定义：

> “战术”

Host / asset-spec vNext 应要求：

- 共享同一正式 Definition；
- 或明确两个技能为何业务含义不同。

不得静默同时安装两个同名但不同意义的技能。

---

# 26. Capability Query｜能力查询

其他机制不应直接读取本 Expansion 内部结构并自行计算“角色到底强不强”。

推荐语义：

```text
Action / Resolution Plan
→ 请求相关 Capability Evidence
→ EP-CHAR-CORE 提供正式人物能力事实
→ Runtime Judge 综合世界、状态、规则与风险
→ Formal Outcome
```

能力证据可以包括：

- 相关属性；
- 相关技能；
- 相关经历；
- 相关专长；
- 执行风格；
- 信条在当前行为中是否构成稳定约束；
- 特殊 World / Expansion Capability。

但本 Expansion：

> **不输出“成功 / 失败”作为世界事实。**

---

# 27. No Auto-Success｜高能力不等于自动成功

即使人物拥有：

- 卓越属性；
- 顶尖技能；
- 相关经历；
- 专长；

也不能突破：

- 世界物理规则；
- 当前权限；
- NPC 自主性；
- 资源条件；
- 法律条件；
- 必要工具；
- 正式 Resolution；
- 玩家 Agency。

例如：

> 顶尖交涉技能不能让一个 NPC 忘记自己的核心利益。

> 卓越体魄不能徒手举起世界规则上不可能移动的山峰。

---

# 28. Temporary State Separation｜长期能力与临时状态分离

人物长期能力不能被临时状态覆盖。

例如：

```text
长期体魄：优秀
当前状态：重伤
```

正确解释：

> 角色拥有优秀体魄，但当前重伤显著限制行动。

错误解释：

> 因为重伤，把体魄永久改成薄弱。

只有长期、真实且足够重大的身体变化，才可能正式修改属性。

---

# 29. Health Ownership Boundary｜与身体状态核心的边界

`EP-HEALTH-CORE｜身体状态核心 v0.1` 现已成为 Persistent Bodily / Physiological State 的正式 Owner，并 Hard Depend 本 Expansion 的 Character Capability。

本 Expansion 继续不拥有：

- HP / Health Reserve；
- 伤势；
- 疾病；
- 身体疲劳 / 衰弱；
- 恢复；
- 疼痛；
- 中毒；
- Consciousness；
- 长期残疾的医疗状态。

Health Core / Runtime 可以读取：

- 体魄；
- 经历；
- 相关技能；
- 合法长期身体事实；

作为 Health Resolution 依据。

健康状态不能反向私自重写长期能力。只有长期、真实且足够重大、并经过正式 Owner / Runtime 提交的身体变化，才可能进一步形成 Character Capability 的长期变化。

---

# 30. Relationship Ownership Boundary｜与关系系统的边界

本 Expansion 不拥有：

- 信任；
- 爱情；
- 敌意；
- 好感；
- 忠诚；
- 关系债务。

表达、沟通、交涉等能力可以影响某个社交尝试的执行质量。

但最终关系变化必须有：

- NPC 真实立场；
- 发生事件；
- 关系系统；
- 正式 Outcome。

---

# 31. Inventory Ownership Boundary｜与物品系统的边界

本 Expansion 可以说明：

> 某角色擅长使用一种工具。

但不拥有：

- 工具是否真的存在；
- 角色是否持有；
- 当前装备；
- 物品状态；
- Item Placement。

能力与物品必须通过正式 Runtime 组合。

---

# 32. Knowledge Boundary｜技能 ≠ 当前知道某事实

拥有：

> “历史研究：精通”

不代表角色自动知道：

> 某个从未接触过的秘密组织成员名单。

技能决定：

> 当角色有合法信息来源时，他处理这些信息的能力。

Character Knowledge 继续由正式知识系统拥有。

---

# 33. Player-Safe Projection｜玩家可见能力

## 33.1 玩家自己

玩家角色的长期能力默认高透明。

可以看到：

- 自己的属性；
- 技能；
- 经历；
- 专长；
- 风格；
- 信条；
- 当前合法成长进展。

但隐藏世界信息仍不能因为“能力面板”泄露。

## 33.2 NPC

NPC 后台拥有真实 Character Capability Profile。

玩家只能看到有依据知道的部分。

例如：

```text
剑术：精通
来源：多次亲眼观察
可信度：高

研究能力：优秀
来源：公开履历
可信度：中高

某特殊技能：未知
```

## 33.3 NPC 能力不是静态公开卡

不能因为 Character Card 中写了：

> “顶尖刺客”

就自动把所有隐藏技能发送给浏览器。

---

# 34. Capability Knowledge｜能力认知来源

玩家对 NPC 能力的认知可以来自：

- 直接观察；
- 共同经历；
- 正式考核；
- 公开履历；
- 可信他人陈述；
- 传闻；
- 文件；
- 专业鉴定；
- 特殊能力。

动态认知必须保留：

- 来源；
- 可信度；
- 最后确认时间；
- 是否可能过时。

这部分使用 World OS Character Knowledge 的权威结构，不另造一套玩家知识数据库。

---

# 35. UI Contribution｜人物能力界面需求

本 Expansion 未来应向 Runtime UI Host 声明安全的人物能力展示需求。

推荐玩家角色面板包括：

### 基础能力

- 体魄；
- 协调；
- 感知；
- 思维；
- 意志；
- 表达。

### 技能

按领域分组折叠展示。

### 经历

只展示真正长期相关的经历，不变成完整人生流水账。

### 专长

突出少量真正稳定优势。

### 风格

用自然语言标签显示。

### 信条

只展示已经足够稳定的重要信念。

## 35.1 NPC 面板

只展示 Player Knowledge 允许的安全投影。

## 35.2 UI 不拥有状态

UI：

> 只能发出 Action Intent / 查询。

不能：

- 点击“升级”直接增加技能；
- 修改属性；
- 写入经历；
- 创建专长；
- 改变信条。

---

# 36. Actions｜通用能力相关 Action Intent

本 Expansion 建议未来声明以下 Action Family：

- 学习；
- 训练；
- 练习；
- 研究某项技能；
- 向导师求教；
- 评估自身能力；
- 观察他人能力；
- 复盘实践；
- 维持技能熟练度。

这些 Action 只表达玩家意图。

是否能够：

- 找到导师；
- 获得教材；
- 完成训练；
- 提升能力；

仍由 Runtime / World State 决定。

---

# 37. Training & Study｜学习与训练

训练至少需要考虑：

- 当前能力水平；
- 目标能力；
- 可用时间；
- 教学质量；
- 训练方法；
- 环境；
- 工具；
- 身体 / 精神当前状态；
- 是否存在真实实践；
- 世界规则。

## 37.1 越高级，成长越困难

从：

> 初学 → 基础

与：

> 卓越 → 顶尖

不能拥有相同成长成本。

顶尖能力必须拥有显著的：

- 时间；
- 机会成本；
- 竞争；
- 稀缺知识；
- 导师；
- 真实高水平实践；

等来源。

---

# 38. Development Track｜成长进展

如果未来 Runtime 需要表达“正在学习但尚未升级”的过程，可以建立：

> **Development Track / 成长轨迹**

其语义是：

- 当前训练目标；
- 已完成的有效训练；
- 当前瓶颈；
- 必要下一步。

它不是：

> 通用 XP 银行。

成长轨迹不得成为第二套能力事实源。

最终能力仍由 Character Capability Profile 拥有。

---

# 39. Event Hooks｜能力变化事件挂点

本 Expansion 预期需要与正式 Event 体系协作记录至少以下类型的世界事实：

- 完成重要训练；
- 获得关键经历；
- 形成专长；
- 专长失活 / 恢复；
- 执行风格发生稳定变化；
- 信条发生重大变化；
- 技能发生正式提升；
- 技能发生长期退化；
- 属性发生长期变化。

Event 记录历史。

当前 Capability State 继续是当前事实。

---

# 40. Atomicity｜原子变化

如果一个长期能力变化同时要求：

- 更新技能；
- 添加经历；
- 形成专长；
- 写入 Event；

这些正式结果必须由 Runtime 在合法事务边界内原子提交。

不能出现：

> 叙事说“你学会了”，但技能状态没有更新。

也不能出现：

> 技能已经升级，但训练失败被 UI 显示为未完成。

---

# 41. Background Progression｜NPC 后台成长

NPC 可以在玩家不在场时继续：

- 工作；
- 学习；
- 训练；
- 研究；
- 长期承担职责；

并因此发生能力变化。

但后台成长必须有正式来源：

```text
NPC Goal / Plan / Duty
+
时间推进
+
可用资源
+
合法训练条件
→ Background Progression Candidate
→ Program Validation
→ Formal Capability Change
```

禁止：

> “为了让下一次见面更有挑战，NPC 突然变强。”

---

# 42. Player Character Agency｜玩家角色成长代理权

系统可以自动记录：

- 玩家真实完成的经历；
- 玩家明确进行的长期训练结果；
- 已经客观形成的技能变化。

但不能替玩家决定：

- 想成为怎样的人；
- 是否认同新信条；
- 是否放弃旧信条；
- 是否选择某个长期训练方向；
- 是否改变人生目标。

系统可以提出成长建议。

最终需要玩家选择的价值性成长仍属于玩家。

---

# 43. Character Card Binding｜人物卡创作接口

Character Card 在使用本 Expansion 时，应尽量提供：

## 43.1 必需语义

- 六项属性的初始描述；
- 重要技能及熟练度；
- 关键经历；
- 少量真正成立的专长；
- 主要执行风格；
- 稳定信条；
- 这些能力事实的背景来源。

## 43.2 不要求角色卡填满

一个角色不需要：

- 每个技能都有等级；
- 六层每层塞满十条；
- 为“完整”而虚构没有游戏价值的能力。

允许：

> 未定义 / 未特别突出

由角色真实背景决定。

## 43.3 角色卡不是运行状态

进入 Game Instance 后：

```text
Character Card Definition
→ instantiate
→ Character Capability State
```

游戏中变化不回写原 Character Card。

---

# 44. Integration｜与基础魔法 Expansion 的接口

`EP-MAGIC-CORE｜魔法基础` 应当：

### 贡献

- 魔法领域 Skill Definition；
- 魔法专长模板；
- 魔法特有 Capability Requirement。

### 消费

可能读取：

- 思维；
- 意志；
- 协调；
- 感知；
- 学习；
- 研究；
- 相关经历；
- 相关专长。

但基础魔法不得再创建：

- 第二套“智力”；
- 第二套“精神”；
- 第二套人物技能状态。

## 44.1 魔法资质不属于本 Expansion

“魔法适应性 / 魔力天赋”等**角色级魔法专属长期状态**：

> 由 `EP-MAGIC-CORE｜魔法基础` 单独拥有。

World Pack 可以定义与魔法有关的世界规律、物种生理事实、血统事实或环境事实，但不得同时保存某个角色的第二份“魔法资质状态”。

“魔法器官 / 灵魂结构”等如果首先是物种或世界本体事实，其 Definition 属于 World Pack；当这些事实需要参与施法时，由 `EP-MAGIC-CORE` 读取并解释其魔法意义。

本 Expansion 只提供并维护通用六层人物能力，且只消费上述合法领域结果，不复制魔法专属状态。

---

# 45. Integration｜与神术 Expansion 的接口

`EP-DIVINE-CORE｜神术与信仰` 可以贡献：

- 神学相关技能；
- 圣礼技能；
- 神术执行相关领域能力。

但是：

- 神性连接不是人物基础属性；
- 信仰对象不是本 Expansion 的 Relationship；
- 神术授权不由“意志高”自动获得；
- 大祭司身份不能由技能等级单独推导。

---

# 46. Integration｜与战争 / 政争 / 经济 Expansion 的接口

领域 Expansion 可以贡献：

- 战术；
- 统兵；
- 行政；
- 法律；
- 商业；
- 会计；
- 谈判；
- 工艺；
- 特定专业能力。

但每个领域应尽量复用现有技能，只有在业务语义真正不同的时候才新增。

禁止 Skill Registry 无限膨胀成：

> 一个 Action 一个技能。

---

# 47. Legendary Character Support｜传奇人物支持

本 Expansion 必须支持：

- 普通人；
- 专业人士；
- 大师；
- 世界级专家；
- 极少数传奇人物。

但不使用：

> “传奇等级”

统一解决。

传奇人物应该通过：

- 卓越 / 超常属性；
- 顶尖领域技能；
- 长期高价值经历；
- 极少数真正强大的专长；
- 稳定执行风格；
- 深刻信条；
- 其他 Expansion 特殊 Capability；

共同形成。

---

# 48. Social Safety｜社交能力安全边界

表达、沟通、交涉、欺瞒、表演等能力都不能：

- 自动让 NPC 爱上玩家；
- 自动改变 NPC 核心价值；
- 自动让对方忘记利益；
- 自动形成承诺；
- 自动产生忠诚；
- 绕过身份与证据；
- 替玩家决定说出什么关键内容。

Social Resolution 必须继续服从：

> 玩家表达保真 + NPC 自主性 + 社交判定闸门。

---

# 49. Information Safety｜能力展示与隐藏信息

能力系统不能因为方便展示而把：

- NPC 隐藏能力；
- 秘密专长；
- 未公开经历；
- 隐藏信条；
- 后台真实身份；

发送给浏览器。

玩家只能读取正式 Player-safe Projection。

---

# 50. Restore / Save｜存档与恢复要求

人物长期能力属于 authoritative state 的一部分。

Save / Restore 必须完整恢复：

- 属性；
- 技能；
- 经历；
- 专长；
- 风格；
- 信条；
- 必要成长轨迹；
- 相关正式历史边界。

Snapshot 只是恢复材料。

它不能成为第二套 live Character Capability State。

---

# 51. Host Requirements｜Runtime Host 需求

未来正式接入时，本 Expansion 至少要求 Host 能够提供：

- Character Definition → Character State 实例化；
- Character Capability 的唯一权威状态；
- Skill Registry / Definition Registry；
- Capability Query；
- Program Judge；
- Formal Outcome；
- Atomic Commit；
- Event；
- World Time；
- Background Progression；
- Character Knowledge；
- Player-safe Projection；
- Save / Restore；
- Runtime-extensible UI Host。

若未来正式 Host 不能表达其中某项，应在 G9 asset-spec vNext 阶段重新裁定具体机器 Contract。

---

# 52. Cross-World Reuse｜跨 World Pack 复用

本 Expansion 禁止硬编码：

- 埃瑟维亚；
- 维尔萨恩；
- 五强；
- 五神；
- 大断裂；
- 魔法；
- 某个历史时代；
- 某个具体种族；
- 固定职业。

它应能直接支持：

- 历史世界；
- 现代都市；
- 科幻；
- 武侠；
- 低魔奇幻；
- 高魔奇幻；
- 其他拥有“人物长期能力”需求的世界。

`诸界余辉`只是第一套正式消费者。

---

# 53. Authoring Guide｜角色能力创作指南

## 53.1 不要堆能力

优秀 Character Card 不需要：

- 六项属性全部卓越；
- 二十个精通技能；
- 十个专长；
- 五段重复经历。

一个可信人物应该：

- 有强项；
- 有普通领域；
- 有短板；
- 有来源；
- 有机会成本。

## 53.2 经历优于万能标签

不写：

> “经验丰富”。

更好：

> “过去十二年担任城市桥梁维护工程师，参与过三次大型结构事故修复。”

## 53.3 专长优于夸张总评

不写：

> “天才”。

更好：

> “能在极短时间内从大量结构图中发现应力异常。”

---

# 54. Example A｜普通专业人士

> [!example] 非正式示例，不是 Character Card

**角色：城市档案员**

属性：

- 体魄：常态；
- 协调：常态；
- 感知：良好；
- 思维：优秀；
- 意志：良好；
- 表达：良好。

技能：

- 研究：精通；
- 搜寻：熟练；
- 沟通：熟练；
- 推理：熟练。

经历：

- 在城市档案馆工作十五年；
- 负责过一次大型档案迁移。

专长：

- 破损文档交叉索引。

风格：

- 谨慎验证；
- 不轻信单一来源。

信条：

- 记录应该服务于事实，而不是权力。

这是一名强专业角色，但完全不需要“等级 12”。

---

# 55. Example B｜传奇专业人物

> [!example] 非正式示例

一名世界级专家可能拥有：

- 某两项属性达到卓越甚至超常；
- 一两个领域技能达到顶尖；
- 数十年极高价值经历；
- 两三个真正决定其独特性的专长；
- 非常稳定的执行风格；
- 经重大历史塑造的信条。

他不需要：

> 所有技能都顶尖。

这比“全属性 99”更能支持可信长期角色。

---

# 56. Example C｜与魔法资产的未来绑定

> [!example] 只说明 Ownership，不定义正式魔法内容

未来某法师 Character Card 可以拥有：

### EP-CHAR-CORE

- 思维：卓越；
- 意志：优秀；
- 研究：精通；
- 某些重要经历；
- 某个研究型专长。

### EP-MAGIC-CORE

- 魔法适应性；
- 魔法领域技能；
- 已掌握 Spell Definition；
- 施法相关特殊 Capability。

二者组合形成完整法师能力。

不得把全部魔法能力重新塞回 Character Card 的自由文本。

---

# 57. Invalid Patterns｜明确禁止的资产写法

## 57.1 第二套能力事实源

错误：

> 魔法 Expansion 自己维护“智力 8 / 精神 10”。

正确：

> 读取 EP-CHAR-CORE 的思维 / 意志，并只拥有魔法专属事实。

## 57.2 技能白名单

错误：

> 没有“攀爬技能”，所以角色无法爬墙。

正确：

> 可以尝试；是否需要判定、是否有成功可能由 Runtime 根据实际条件决定。

## 57.3 经验值银行

错误：

> 完成任务获得 1000 XP，自动升一级。

正确：

> 任务中真实发生的训练、实践与经历为对应能力成长提供因果来源。

## 57.4 临时状态污染长期能力

错误：

> 因为角色发烧，把体魄从优秀永久降成偏弱。

## 57.5 社交自动成功

错误：

> 表达卓越，所以 NPC 必须同意。

## 57.6 玩家信条自动执行

错误：

> 角色信条写着“忠于王国”，所以系统自动拒绝玩家叛国指令。

正确：

> 信条可以作为角色连续性信息，但玩家角色的重大选择最终属于玩家。

---

# 58. Validation Gate｜单资产审核清单

## 58.1 Ownership

- [x] 六层人物长期能力只有本 Expansion 一个机制 Owner；
- [x] Character Card 只提供初始内容；
- [x] Game State 保存实例当前状态；
- [x] 其他 Expansion 不复制人物属性 / 技能状态。

## 58.2 Open Attempt

- [x] 未掌握技能不自动禁止尝试；
- [x] 不可能行为仍允许 Program fail closed；
- [x] 技能目录不等于 Action 白名单。

## 58.3 Growth

- [x] 无总等级；
- [x] 无统一 XP；
- [x] 成长有时间、来源与机会成本；
- [x] 技能允许合理退化；
- [x] 经历不会因不用而被删除。

## 58.4 Agency

- [x] 风格不替玩家选行动；
- [x] 信条不替玩家做价值选择；
- [x] 表达 / 交涉不突破 NPC 自主性；
- [x] 能力系统不补写玩家未表达的关键台词。

## 58.5 Information

- [x] NPC 真实能力不自动发送浏览器；
- [x] “未知”属于知识状态而非能力值；
- [x] 技能不自动生成世界知识。

## 58.6 Definition / Instance

- [x] 游戏中成长不回写 Character Card；
- [x] World Pack 更新不静默覆盖已有 Character State；
- [x] Save / Restore 恢复完整当前 Capability State。

## 58.7 Cross-World

- [x] 不硬编码埃瑟维亚；
- [x] 不硬编码魔法；
- [x] 领域技能允许由其他 Expansion 贡献；
- [x] 通用 Skill Registry 不形成无限技能膨胀。

---

# 59. Regression Cases｜永久回归案例

## Case 01｜不会游泳

角色：

> 游泳相关训练不存在。

玩家：

> “我跳进河里游过去。”

必须：

- 允许尝试；
- Runtime 根据体魄、协调、水流、距离、装备等事实裁定；
- 不得因“没有技能”直接说玩家无法进入水中。

---

## Case 02｜重伤大师

角色长期体魄：

> 卓越

当前：

> 重伤

必须：

- 长期体魄仍为卓越；
- 当前 Resolution 受到伤势限制；
- 不永久污染属性。

---

## Case 03｜高表达说服失败

角色：

> 表达卓越、交涉精通。

对方：

> 核心利益与请求正面冲突。

必须允许：

> 交涉失败或只改变次级条件。

不得自动成功。

---

## Case 04｜NPC 隐藏技能

NPC 真实：

> 隐匿顶尖。

玩家从未见过。

UI 必须：

> 隐匿：未知

而不是泄露后台真相。

---

## Case 05｜经历不能临时补造

玩家试图驾驶一种复杂载具。

系统不能为了让其行动合理而突然补写：

> “你以前学过驾驶。”

如果角色没有相关经历和技能：

> 就按当前真实 Capability 处理。

---

## Case 06｜领域 Expansion 重复技能

两个 Expansion 都需要“研究”。

正确：

> 共同消费 Core `研究` 技能，或证明新领域技能确实不同。

错误：

> 创建“魔法研究”“政治研究”“遗迹研究”三套完全相同的人物长期能力。

---

## Case 07｜玩家违背既有信条

玩家角色初始信条：

> “绝不背叛自己的组织。”

玩家明确选择：

> “我背叛组织。”

系统不能替玩家取消行动。

应该：

- 允许玩家授权的尝试；
- 让世界产生真实后果；
- 后续根据重大选择重新评估角色信条是否已经发生变化。

---

# 60. Future Hooks｜未来能力挂点

本 v0.1 不提前建设：

- 完整训练模拟器；
- 教育机构管理系统；
- 复杂导师 AI；
- 全局人才市场；
- 人物总评分；
- 自动 Build 推荐；
- 职业树；
- 天赋树；
- 成就 XP；
- 多套世界并行属性系统。

未来如果真实玩法需要，应在不破坏本 Expansion Ownership 的前提下新增专门资产。

---

# 61. Integration Contract｜对现有消费者与未来 Provider 的接口

## Provider → Consumer｜对 `EP-MAGIC-CORE｜魔法基础`

必须：

- 复用六项基础属性；
- 通过 Skill Registry 贡献魔法领域技能；
- 魔法资质保持独立 Owner；
- 不再创建第二人物能力系统。

## Provider → Consumer｜对 `EP-DIVINE-CORE｜神术与信仰`

必须：

- 复用人物基础能力；
- 神性连接独立于属性；
- 神职身份不由技能自动推导。

## Provider → Consumer｜对 Character Card

必须：

- 使用六层结构提供初始人物能力；
- 能力拥有背景来源；
- 不把运行期变化写回定义。

## Handoff｜对 Runtime / asset-spec vNext

未来必须支持：

- 通用 Character Capability Profile；
- 可扩展 Skill Registry；
- Domain Expansion 的 Skill Contribution；
- Player-safe capability projection；
- Definition / Instance 分离；
- 统一能力查询而不是跨模块直接读内部状态。

---

# 62. Audit Revision｜v0.1.1 审核修订

本次独立审核未改变用户已批准的能力模型，只修正 Owner 表述歧义：

1. 明确 World Pack 只提供物种 / 世界事实，不与领域 Expansion 共同拥有角色长期状态；
2. 明确角色级“魔法适应性 / 魔力天赋”未来只能由 `EP-MAGIC-CORE` 单独拥有；
3. 明确物种魔法器官 / 灵魂结构等本体事实由 World Pack 定义，魔法意义由 `EP-MAGIC-CORE` 消费解释；
4. 独立 Ownership / 通用性审核状态改为 `PASS`。

---

# 63. 当前状态

```text
EP-CHAR-CORE｜人物能力与技艺

创作前讨论                 COMPLETE
用户裁定                   COMPLETE
用户授权                   COMPLETE
正式语义稿                 COMPLETE
Creator binding            PENDING
asset-spec vNext binding   PENDING
六层核心独立审核           PASS
核心资产族 Ownership 审核   PASS
v0.1.5 Combat Interface     PASS
```

> **独立审核已通过。当前该资产作为 `EP-COMBAT-CORE｜战斗核心 v0.1`、`EP-MAGIC-CORE｜魔法基础 v0.3`、`EP-MAGIC-COMBAT｜战斗魔法 v0.3`、`EP-DIVINE-CORE｜神术与信仰 v0.2.1` 与后续 Theme Expansion 的统一人物能力上游。**

---

# Related Notes

- [[通用拓展包资产库总蓝图_v0.1]]
- [[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]
- [[战斗核心_Expansion_Pack_v0.1]]
- [[身体状态核心_Expansion_Pack_v0.1]]
- [[魔法基础_Expansion_Pack_v0.3]]
- [[战斗魔法_Expansion_Pack_v0.3]]
- [[神术与信仰_Expansion_Pack_v0.2.1]]


---

# v0.1.2 接口修订说明

本 patch 不改变六层人物能力机制。

仅执行当前资产族接口闭环：

- 更新当前 Skill 版本；
- 更新 Blueprint / World Pack / 魔法基础 / 战斗魔法引用；
- 移除已取消的独立《传说魔法》Related Note；
- 明确 Legendary Spell 的存在不改变本资产 Ownership：Theme 仍只消费统一 Character Capability / Skill Registry，不把 Legendary Grade 写成人物第二套属性。


---

# v0.1.3 Divine Interface Closure

本 patch 不改变六层人物能力机制。

正式关闭 `EP-DIVINE-CORE` Handoff：

- 神学、圣礼、神性引导可以作为统一 Skill Registry 的领域 Skill Contribution；
- Divine Covenant、Authority Scope、Invocation Mastery、Channel Strain 均不属于本 Expansion；
- Church Office 不能由 Skill 自动推导；
- “意志高”不自动获得 Covenant 或神术授权；
- Character Card 后续可以同时消费统一人物 Capability 与 Divine Core Bootstrap。


---

# v0.1.4 Core Audit Closure

本 patch 不改变六层 Character Capability。

完成：

- 修正标题、版本、可信状态；
- 将已有接收方从 Handoff 改为 Provider → Consumer Integration；
- 保留 Runtime / asset-spec vNext 的真实 Handoff；
- 同步 Magic / Combat / Divine 当前版本；
- Divine Core 新增的 `战地神术` 与神学 / 圣礼 / 神性引导一样，只是 Skill Definition Contribution；
- Divine Practice Profile 不得写入六层 `Character Execution Style` 作为同义字段；
- 核心 Ownership / Dependency 总审核：PASS。

---

# v0.1.5 Combat Core Interface Closure

本 patch 不改变六层人物能力模型。

正式接入 `EP-COMBAT-CORE｜战斗核心 v0.1`。Combat Core 可以向统一 Skill Registry 贡献：

- 近战兵器；
- 远程兵器；
- 徒手格斗；
- 战术判断。

这些仍是**领域 Skill Contribution**；Canonical Skill State 继续由 `EP-CHAR-CORE` 的统一人物能力层承载。

Combat Core 不得创建第二套 Attributes、Skill State、Character Level 或 Character Class。

本轮集中接口复审确认：Combat Core 只贡献 Skill Definition；人物实例的 `近战兵器 / 远程兵器 / 徒手格斗 / 战术判断` 熟练度继续只存在于本 Expansion 的统一 Skill State。**v0.1.5 Combat Interface：PASS。**


---

# 57. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 是通用资产库的长期 Character Capability Owner。

G8 UI 意图：

- 不拥有独立一级 Extension Surface；
- 主要贡献 Player Character Detail；
- 可贡献 Person Detail；
- Player Status 只显示真正高频、玩家安全的能力摘要；
- 不要求游戏 Host 固定显示属性 / 等级 / XP。

诸界余辉等 World Pack 仅是 reference consumer，不构成当前依赖。

**通用库独立审核：PASS。**
