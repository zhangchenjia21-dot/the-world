---
title: 魔法基础｜Expansion Pack
aliases:
  - EP-MAGIC-CORE
  - Magic Core
  - 法术型魔法核心
  - Spell Magic Core
created: 2026-08-16
updated: 2026-08-16
status: audited-current
version: 0.3
workflow_mode: light-asset
operation_mode: revise
asset_type: expansion-pack
skill: tavern-asset v0.5.2
output_profile: obsidian-markdown
asset_family: 通用拓展包资产库
blueprint: "[[通用拓展包资产库总蓝图_v0.1]]"
hard_dependencies:
  - "[[人物能力与技艺_Expansion_Pack_v0.1.5]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
combat_core_integration:
  - "[[战斗核心_Expansion_Pack_v0.1]]"
health_core_optional:
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
generic_reuse_target: true
dependency_role: spell-magic-core
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Magic
  - Spell
  - Core
  - 声明式资产
  - 通用资产
  - Obsidian
---

# 魔法基础｜Expansion Pack v0.3

> [!abstract] 资产定位
> `EP-MAGIC-CORE｜魔法基础` 是所有**法术型魔法 Expansion** 的共同核心前置资产。
>
> 它不只是“一包低阶法术”，而负责定义整个法术型魔法体系的公共运行语义：
>
> **法术是什么 → 怎样学习 → 怎样掌握 → 怎样施展 → 怎样承受负荷 → 怎样变体 → 怎样中断 / 驱散 → 怎样由 Runtime 正式裁定。**
>
> 后续空间、预言、元素、灵魂、心灵、生命等主题魔法 Expansion 应优先采用**声明式 Contribution**：引用本 Core 已定义的 Spell Grammar，只声明本领域新增的标签、特殊要求、少量领域规则和 Spell Definition，不得复制一套平行施法系统。
>
> 本资产同时提供一批跨世界可复用的基础标准法术，使只安装本 Core 的游戏也具备实际可玩的基础法术体验。

> [!important] 当前可信状态
> **已审核语义稿 v0.3｜Combat Core Ownership Refactor + Interface Closure + Generic Library 总审核通过。**
>
> 本稿冻结的是资产语义、Ownership、依赖、声明式 Grammar 与运行要求，不假装当前已经存在最终 JSON Schema、字段名或 Runtime API。

---

# 0. Scope Lock｜资产职责边界

## 0.1 本 Expansion 唯一回答的问题

> **“法术型魔法”这一整类能力，在不同世界与不同主题魔法包之间共同遵守什么基础语法与运行规则？**

它是法术型魔法的公共 Core。

## 0.2 本 Expansion 必须负责

- 法术型魔法的共同底层逻辑；
- Spell Definition 的统一声明语义；
- 魔法适性；
- 魔法领域 Skill Contribution；
- 具体 Spell Mastery；
- 法术学习与教授；
- 施法过程；
- 统一施法负荷；
- Magic Strain / 魔法失衡；
- 少量可选特殊 Requirement；
- Spell Target / Reach / Duration 等基础声明语义；
- 法术可变轴与不可变核心；
- 维持、中断、取消；
- 通用 Countermagic / Dispel；
- 协同施法与基础 Ritual 语义；
- 失败与反噬的因果边界；
- Spell Tag Taxonomy；
- Theme Expansion 的正式 Extension Point；
- Runtime Resolution 的共同接口语义；
- Character Card 的初始法术 Bootstrap；
- Player-safe 法术知识投影；
- 基础 Spell Library；
- Creator 创作主题法术时可复用的公共 Authoring Grammar。

## 0.3 本 Expansion 明确不负责

- 某个世界为什么存在魔法；
- 某个世界有哪些国家、学院、传统或魔法法律；
- 某个种族的世界观与文化；
- 某个角色是谁；
- 人物六层通用属性 / 技能 / 经历 / 专长 / 风格 / 信条；
- 伤势、疾病、疲劳、饥饿、中毒等 Health / Condition State；
- 神性连接、神术、圣礼、神职或神域；
- 制造、维修、附魔魔具的完整工艺流程；
- 真正创造新永久法术的研究流程；
- 各 Theme Expansion 的具体高阶 / 传说级 Spell Library；
- 空间、预言、灵魂、心灵、元素、生命等主题领域的完整 Spell Library；
- Dice、RNG、Program Judge 或 Formal Outcome；
- Game State Commit；
- 把游戏过程写回原始 Expansion；
- 统一 MP / Mana 数值池；
- 角色总等级、法师等级或万能战斗力；
- Combatant / Engagement；
- Combat Relative Range；
- LOS / Cover；
- Combat Stance / Pressure / Tempo；
- Reaction Window；
- Weapon / Armor Combat Profile；
- Martial Outcome；
- Combat Consequence；
- 其他由 `EP-COMBAT-CORE｜战斗核心` 拥有的通用战斗语义。

## 0.4 上游依赖

本 Expansion 消费：

> `EP-CHAR-CORE｜人物能力与技艺`

它可以向统一 Skill Registry 贡献魔法领域技能，但不得重建第二套人物 Attributes / Skills State。

## 0.5 下游强依赖

以下类型资产默认必须声明对本 Expansion 的前置依赖：

- 空间与位面魔法；
- 预言与命运；
- 元素与毁灭；
- 心灵与幻象；
- 灵魂、亡灵与死亡魔法；
- 生命与变形；
- 召唤与契约；
- 其他以“Spell”作为主要能力定义的主题 Expansion；
- 法术研究与创造。

> **主题包可以扩展 Core，但不能重定义 Core。**

## 0.6 神术例外

`EP-DIVINE-CORE｜神术与信仰` 不默认作为本 Expansion 的下游。

世界可以规定：

> 法术与神术本体同源。

但这不表示神术必须继承：

- Spell Mastery；
- Magic Aptitude；
- Casting Load；
- Magic Strain；
- Spell Learning；

等法术型机制。

二者通过 `EP-DIVINE-CORE｜神术与信仰 v0.2.1` 已定义的 **Spell ↔ Divine Interaction Profile** 对接：

- `open`
- `resistant`
- `authority_bound`
- `sovereign`
- Miracle direct intervention

法术可以在合法 Profile 下：

- 检测；
- 防御；
- 驱散；
- 对抗；
- 干扰；

但不能通过普通 Countermagic：

- 删除 Divine Covenant；
- 删除 Authority Scope；
- 取消 Sovereign Divine Authority；
- 默认驱散 Miracle。

这保持了“本体同源、实践分流”。

---


## 0.7 Combat Core Integration｜战斗语义所有权

`EP-MAGIC-CORE` 与 `EP-COMBAT-CORE` 是两个并列 Core。Magic Core 不 Hard Depend Combat Core，因为研究、生活、仪式、非战斗驱散等可以独立成立。

一旦 Spell 进入直接战斗，Combat Core 对以下概念拥有优先 Ownership：

- Relative Combat Range；
- LOS / Cover；
- Engagement；
- Reaction Window；
- Combat Defense；
- Combat Pressure / Tempo；
- Martial Outcome / Combat Consequence。

### 0.7.1 Spell Reach ≠ Combat Range

Magic Core 只定义 Spell 本身能触达什么范围；Combat Core 定义当前双方在战斗中的相对距离。

### 0.7.2 Spell Counter ≠ Combat Reaction

Magic Core 定义 Identify / Interrupt / Counter / Dispel / Suppress / Protect 的 Spell Interaction；Combat Core 定义战斗中是否存在合法时机与接入。

### 0.7.3 一次 Formal Outcome

```text
Combat Shell + Spell Internal Resolution
→ Runtime Composite Formal Outcome / Atomic Commit
```

---

# 1. Core Philosophy｜玩家简单，资产统一

本 Expansion 采用两条同时成立的设计原则。

## 1.1 玩家侧保持低认知负担

玩家不需要理解十几种隐藏魔法参数。

常规游玩只需要理解几个高存在感概念：

1. **魔法适性**：这个人学习与适应法术型魔法的大体天赋；
2. **魔法领域技能**：这个人在魔法理论、控制等可迁移能力上练到什么程度；
3. **具体法术掌握**：这个人到底会不会、熟不熟某个 Spell；
4. **施法负荷**：这个法术此刻对施术者有多吃力；
5. **魔法失衡**：连续或超负荷施法后，当前魔法运转是否开始不稳定；
6. **特殊条件**：少数复杂法术额外需要什么。

## 1.2 Creator 侧保持统一 Grammar

复杂度不通过“再增加玩家属性”解决。

而通过统一的 Spell Grammar、Tag、Requirement 与 Extension Point 解决。

后续 Theme Expansion 应尽可能薄：

```text
引用 EP-MAGIC-CORE
→ 声明 Domain / Tag
→ 声明真正必要的领域规则
→ 声明 Spell Definitions
→ 完成
```

而不是：

```text
主题包 A 自己实现施法
主题包 B 自己实现熟练度
主题包 C 自己实现反制
主题包 D 自己实现负荷
```

---

# 2. Magic Aptitude｜魔法适性

## 2.1 设计目标

魔法资质需要真实存在，但不能成为一个玩家必须精细管理的复杂子系统。

因此本 Expansion 只定义一个角色级长期领域状态：

> **魔法适性 / Magic Aptitude**

它不是人物六项通用属性，也不是 Mana。

## 2.2 推荐语义等级

```text
受限
→ 普通
→ 良好
→ 优异
→ 卓越
```

“未知”不是适性等级，而是观察者的 Character Knowledge 状态。

## 2.3 魔法适性主要影响

- 初次接触法术型魔法的难易；
- 学习新 Spell 的平均速度；
- 适应较高施法负荷的难易；
- 某些高阶训练的进入门槛；
- 在长期训练中能够达到怎样的稳定施法效率。

## 2.4 魔法适性不直接决定

- 是否聪明；
- 是否意志坚定；
- 是否拥有高阶魔法知识；
- 是否熟练掌握某个 Spell；
- 是否一定能够成为大法师；
- 是否战斗力更高；
- 是否拥有特殊血统能力。

可以存在：

> 魔法适性卓越，但从未认真学习魔法的人。

也可以存在：

> 魔法适性普通，却经过四十年训练成为著名法师的人。

## 2.5 成长与改变

魔法适性拥有先天基础，但并非绝对不可改变。

普通训练：

> 更容易提高技能与 Spell Mastery，而不是直接提高适性。

真正改变适性通常需要：

- 长期针对性训练；
- 身体或灵魂结构变化；
- 特殊世界事件；
- 极少见的仪式；
- 合法的血统 / 种族 / 世界机制；
- 其他拥有正式 Ownership 的机制。

适性变化应：

- 缓慢；
- 有来源；
- 有代价；
- 不通过普通升级点直接购买。

## 2.6 World Pack / 种族边界

World Pack 可以声明：

> 某种族、血统或世界现象会影响魔法适性形成。

但人物实例中的 `Magic Aptitude` 由本 Expansion 拥有。

World Pack 不建立第二份角色级魔法适性 State。

---

# 3. Magic Skill Contribution｜魔法领域技能

本 Expansion 不建立第二套技能系统。

它向 `EP-CHAR-CORE` 的统一 Skill Registry 贡献少量真正可迁移的魔法领域技能。

## 3.1 Core 推荐技能

### 魔法理论

回答：

> 是否理解法术结构、基本规律、术式关系与常见魔法现象。

### 术式控制

回答：

> 能否稳定地塑形、维持、调整已经理解的法术结构。

### 魔法感知

回答：

> 能否主动识别、分辨和追踪魔法现象。

### 仪式学

回答：

> 是否理解多人施法、长期准备、法阵、媒介与仪式组织的一般原则。

## 3.2 不建议无限增加 Core Skills

Theme Expansion 可以贡献真正必要的新领域 Skill Definition。

但不得把每个 Spell 都变成 Skill。

例如：

> “空间学”可以在空间主题包中成为领域技能。

但：

> “短距闪现术技能”
> “空间锚技能”
> “传送门技能”

通常不应各自进入统一 Skill Registry。

这些由 Spell Mastery 表达。

---

# 4. Spell Definition｜标准法术定义

## 4.1 Canonical Spell

正式资产中的法术以：

> **Creator 预设的 Canonical Spell Definition**

为主体。

Runtime 不应在玩家每次说一句自然语言时临时发明一个新的正式 Spell Definition。

## 4.2 Spell Definition 与玩家行动不同

Spell Definition 不是动作白名单。

角色掌握某个 Spell 后，仍可以尝试：

- 缩小范围；
- 降低强度；
- 改变目标数量；
- 调整持续方式；
- 延长施法准备；
- 改变释放时机；
- 在允许的轴上调整形态。

能否成立：

> 由 Spell Definition + 能力 + 当前状态 + 环境 + Runtime Resolution 共同决定。

## 4.3 Spell Definition 的最小语义

每个 Spell 至少需要能够回答：

- `identity`：它是什么；
- `grade`：它大体属于什么复杂度 / 社会能力层级；
- `domain_tags`：它涉及哪些魔法领域；
- `function_tags`：它主要做什么；
- `target_profile`：它作用于什么；
- `range_profile`：它在什么距离关系下工作；
- `duration_profile`：效果以什么时间形态存在；
- `casting_load`：基础施法负荷；
- `core_effect`：不可任意改变的核心效果；
- `variant_axes`：允许调整什么；
- `special_requirements`：若有，额外需要什么；
- `risk_notes`：在什么条件下可能产生显著风险；
- `dispel_profile`：能否、怎样进入通用反制框架。

这些是**语义要求**，不是冻结的未来 JSON 字段名。

---

# 5. Spell Grade｜法术等级语言

本 Expansion 为所有法术型 Expansion 提供统一的自然语言等级。

```text
日常
基础
正式
高阶
大师
传说
```

## 5.1 等级不是角色等级

它表达的是：

> 一个 Spell 对知识、控制、负荷、条件和社会稀有度的大体要求。

不能推导：

> “角色达到 20 级才能学高阶魔法。”

## 5.2 Core 自带法术范围

《魔法基础》自身的 Spell Library 主要覆盖：

- 日常；
- 基础；
- 少量正式级通用法术。

高阶、大师与传说级 Spell 主要由具体 Theme Expansion 拥有。

Core 不需要为了证明“传说存在”而集中收容所有传奇 Spell。

## 5.3 传说

`传说` 是统一 Spell Grade 的最高常规层级，而**不是一个独立魔法主题**。

因此：

> **“传说”回答这个 Spell 跨到了多高的能力层级；Theme 回答这个 Spell 到底在做什么。**

例如：

- 大预言术应由预言 / 命运 Theme 拥有，并标记为 `传说`；
- 位面传送应由空间 / 位面 Theme 拥有，并标记为 `传说`；
- 传奇战斗术式应由战斗魔法 Theme 拥有，并标记为 `传说`。

具体 Legendary Spell 不进入一个独立“传说魔法仓库”。

---

# 6. Spell Mastery｜具体法术掌握

每个角色对某个具体 Spell 的长期掌握状态由本 Expansion 拥有。

它与人物通用 Skill 分离。

## 6.1 推荐掌握阶段

```text
未掌握
→ 学习中
→ 稳定掌握
→ 熟练运用
→ 深度掌握
```

## 6.2 各阶段语义

### 未掌握

没有形成可靠施法能力。

角色仍可以：

- 观察；
- 研究；
- 模仿；
- 尝试实验；

但不能因为“玩家说了法术名”就自动获得正式施法能力。

### 学习中

已经理解部分结构并能够在教学、准备或理想条件下尝试。

通常：

- 成功率不稳定；
- 需要更高集中；
- 更难自由变体。

### 稳定掌握

能够在法术正常要求下可靠施展。

这是“真正学会一个 Spell”的最低稳定状态。

### 熟练运用

能够：

- 更快准备；
- 更稳地处理普通干扰；
- 使用常见变体；
- 更好地控制释放。

### 深度掌握

对 Spell 本身拥有长期、深入、可迁移的理解。

可能允许：

- 更复杂的合法变体；
- 教授他人；
- 在恶劣条件下保持稳定；
- 为未来法术研究提供真实依据。

## 6.3 Spell Mastery 不是经验条

不存在：

> 火球术 537 / 1000 XP。

Mastery 的变化必须来自：

- 学习；
- 使用；
- 训练；
- 失败；
- 指导；
- 研究；
- 长期实践。

---

# 7. Casting Load｜统一施法负荷

## 7.1 核心原则

本 Expansion 不使用十几种资源条。

所有 Spell 都只有一个必需的公共成本描述：

> **施法负荷 / Casting Load**

它表示：

> **在正常条件下，完成这个 Spell 对施术者当前魔法运转造成多大压力。**

## 7.2 推荐语义等级

```text
轻微
常规
较重
沉重
极限
```

## 7.3 Casting Load 不是 Mana 消耗

不能解释为：

> 轻微 = 5 MP
> 沉重 = 40 MP

同一个“沉重” Spell 对不同角色实际意味着完全不同的难度。

Runtime 应结合：

- 魔法适性；
- 相关人物能力；
- 魔法领域技能；
- Spell Mastery；
- 当前 Magic Strain；
- 环境；
- Spell Requirement；
- 伤势 / 疲劳等外部正式状态；

共同判断。

## 7.4 为什么只保留一个公共负荷

因为玩家真正关心的是：

> “我现在继续施这个法术，会不会开始撑不住？”

而不是管理一张：

> 精神 17 / 肉体 23 / 魔力 41 / 灵魂压力 12 / 环境借能 8

的复杂表格。

---

# 8. Magic Strain｜魔法失衡

## 8.1 定位

Magic Strain 表示：

> **连续施法、超负荷施法或异常施法使施术者当前魔法运转逐渐失去稳定的程度。**

它不是 Mana。

## 8.2 推荐语义状态

```text
平稳
→ 累积
→ 紧绷
→ 失稳
→ 过载
```

## 8.3 常见来源

- 连续使用较重以上 Spell；
- 强行施展明显超出当前能力的 Spell；
- 在恶劣魔法环境中施法；
- 维持多个复杂法术；
- 遭受魔法干扰；
- Spell Backlash；
- 某些 Theme Expansion 的特殊机制。

## 8.4 常见影响

随着 Strain 上升，可能：

- 更难精确控制 Spell；
- 更难维持复杂效果；
- 变体空间缩小；
- 被干扰时更容易中断；
- Backlash 风险上升；
- 暂时无法承担高负荷 Spell。

## 8.5 与健康状态隔离

Magic Strain 本身不等于：

- 疲劳；
- 伤势；
- 头痛；
- 灵魂损伤。

若过载导致真实身体 / 精神 / 灵魂伤害：

```text
EP-MAGIC-CORE
→ 产生正式效果提案
→ `EP-HEALTH-CORE｜身体状态核心`
→ Runtime Commit
```

不得在本 Expansion 内另建第二套伤势状态。

## 8.5A Current Health Core Integration

`Magic Strain` 继续由 Magic Core 拥有。

若 Backlash / Spell Effect 产生真实身体后果：

```text
Magic Effect / Backlash
→ Health-relevant Effect
→ EP-HEALTH-CORE
→ Condition / Health Burden / HP
```

Magic Core 与 Health Core 保持 Optional Integration / Handoff；Magic Core 不直接写 `HP -X` 或 `HP +X`。

## 8.6 恢复

Magic Strain 可以随：

- 时间；
- 停止施法；
- 安全环境；
- 特定恢复手段；
- 世界内合法辅助；

逐渐下降。

恢复速度不是统一“睡一觉全满”，也不要求玩家精确计算分钟数。

---

# 9. Special Requirements｜少量特殊条件

## 9.1 设计原则

`Casting Load` 是所有 Spell 的共同核心成本。

只有当某个 Spell 真的需要时，才额外声明特殊 Requirement。

## 9.2 Core 支持的通用 Requirement 类型

- **Cast Time**：需要明显更长准备；
- **Focus**：必须持有或使用某类焦点 / 法器；
- **Material**：需要消耗或使用特定材料；
- **Environment**：需要特定环境状态；
- **Location**：必须在某类地点或结构中；
- **Cooperative**：需要多名施术者；
- **Ritual Setup**：需要提前布置仪式结构；
- **Target Access**：需要触碰、视线、样本、真名、坐标等特定目标接入条件。

## 9.3 默认省略

普通基础 Spell 不需要为了“格式完整”强行填满所有 Requirement。

最简单的 Spell Definition 可以只有：

> 常规负荷 + 正常目标条件。

## 9.4 Theme Extension

Theme Expansion 可以贡献新的 Requirement 类型。

例如空间主题包可以贡献：

> `spatial_anchor`

灵魂主题包可以贡献：

> `soul_contact`

但新 Requirement 必须：

- 真正有领域意义；
- 能被 Runtime 理解；
- 不复制已有 Requirement；
- 不偷偷建立新的资源系统。

---

# 10. Spell Target / Reach / Duration｜共同基础语义

本节只描述一个 Spell Definition 本身的目标、可达范围与持续方式。

> **直接战斗中的相对距离、LOS、Cover、Reach、Engagement 由 `EP-COMBAT-CORE` 拥有。**

## 10.1 Spell Target Profile

典型语义：self / creature / object / point / area / structure / spell_effect / special。

## 10.2 Spell Reach Profile

推荐：自身 / 接触 / 近距 / 可视 / 远距 / 特殊。

战斗中：

```text
Combat Relative Range + LOS / Cover + Spell Reach
→ 当前 Spell Target Access
```

Spell Reach 不得反向改写 Combat Position。

## 10.3 Duration Profile

瞬时 / 短暂 / 持续 / 定时 / 维持 / 触发式 / 长期或永久。

## 10.4 世界解释

World Pack 可以投影本世界术语，但不能改变基础逻辑。
---

# 11. Spell Variant｜法术变体

## 11.1 原则

掌握 Spell 后，角色不是只能逐字照说明书释放。

每个 Spell 可以声明：

> `variant_axes`

即合法可调整轴。

## 11.2 Core 支持的常见变体轴

- range；
- area；
- intensity；
- duration；
- target_count；
- shape；
- delay；
- precision；
- casting_time_for_stability。

## 11.3 变体必须保留 Spell Core

例如：

> 火焰弹缩小威力换取更低破坏风险。

仍然是同一个 Spell。

但：

> 把火焰弹改成读取思想。

已经改变 Spell Core，不属于变体。

## 11.4 变体的代价

变体可能：

- 提高或降低 Casting Load；
- 增加 Cast Time；
- 提高控制要求；
- 需要更高 Mastery；
- 引入额外 Requirement。

不使用统一“变体点数”。

## 11.5 不产生永久新 Spell

一次成功变体：

> 不自动成为新的 Canonical Spell Definition。

真正的新法术：

> 交给 `EP-MAGIC-RESEARCH｜法术研究与创造`。

---

# 12. Casting Process｜通用施法过程

Core 规定所有法术型魔法至少遵守以下逻辑链：

```text
Intent
→ Spell Access
→ Current Capability
→ Requirements
→ Variant
→ Load / Strain
→ Runtime Resolution
→ Formal Outcome
→ State Commit
```

## 12.1 Intent

玩家 / NPC 表达想做什么。

Intent 不是 Formal Outcome。

## 12.2 Spell Access

检查角色是否：

- 已掌握该 Spell；
- 处于学习中但允许尝试；
- 通过合法外部机制临时获得使用权。

## 12.3 Current Capability

读取：

- Magic Aptitude；
- 通用人物能力；
- 魔法领域技能；
- Spell Mastery；
- 当前 Strain；
- 其他正式状态。

## 12.4 Requirements

检查目标、距离、材料、焦点、环境等。

## 12.5 Variant

若使用变体：

> 检查是否属于该 Spell 合法可变轴。

## 12.6 Load / Strain

判断当前负荷与失衡是否会影响这次尝试。

## 12.7 Runtime Resolution

真正成功与否属于 Runtime。

Expansion 不直接提交 Game State。

## 12.8 Formal Outcome

结果可能是：

- 成功；
- 部分成功；
- 失败；
- 被中断；
- 被反制；
- 产生 Backlash；
- 因 Requirement 不成立而无法启动。

## 12.9 Commit

只有 Runtime 可以把正式结果写入 Game State。

## 12.10 Combat Composition

Spell 在直接战斗中使用时：

```text
Combat Core → Combat Access / Range / LOS / Reaction / Opposition
Magic Core → Spell Access / Requirements / Load / Strain / Effect
Runtime → Composite Formal Outcome / Atomic Commit
```

Magic Core 不再自行定义战斗距离、战斗防御、Combat Reaction、Pressure 或 Martial Outcome。

---

# 13. Sustaining / Interrupting｜维持与中断

## 13.1 维持

某些 Spell 的 Duration Profile 为：

> 维持

意味着施术者需要持续投入注意与魔法稳定性。

同时维持多个复杂 Spell：

> 可以增加实际负荷和 Strain 风险。

## 13.2 主动取消

施术者通常可以主动结束自己正在维持的 Spell。

除非 Spell Definition 明确：

> 一旦形成便独立运行。

## 13.3 中断

施法准备或维持中的 Spell 可以因为真实原因中断，例如：

- 失去意识；
- 被迫离开必要位置；
- Focus 被破坏；
- Concentration 被严重打断；
- 关键 Requirement 消失；
- Countermagic；
- Magic Strain 进入无法维持的状态。

---

# 14. Countermagic｜通用反魔法框架

Core 必须拥有公共 Countermagic 语义，否则每个 Theme Expansion 会创造自己的平行反制系统。

## 14.1 基础反制类型

### 识别

判断：

> 正在发生什么魔法、可能属于什么 Spell / Domain。

### 打断

在 Spell 尚未正式完成时：

> 破坏施法过程。

### 抵消

针对正在形成的 Spell：

> 用兼容反制手段阻止其完成或削弱效果。

### 驱散

针对已经存在、仍可被魔法结构维持的效果：

> 破坏其持续结构。

### 抑制

建立区域或目标条件：

> 使部分法术更难形成或维持。

### 防护

不一定取消 Spell，而是：

> 阻止 / 减轻 Spell 对特定目标的作用。

## 14.2 反魔法不是万能关闭按钮

能否反制取决于：

- Spell 本身；
- 反制者能力；
- 是否识别；
- 时间窗口；
- 距离 / 接入条件；
- 当前 Strain；
- 双方准备；
- Theme Rule；
- Runtime Resolution。

## 14.3 专业反魔法

未来可以有专门反魔法 Expansion 或 Theme Contribution，但必须扩展本框架。

## 14.4 Combat Countermagic Ownership

直接战斗中：

- Combat Core：Reaction、Range、LOS/Cover、Pressure、Opposition、Interruption Trigger；
- Magic Core：Spell Identify / Interrupt / Counter / Dispel Compatibility、Spell State、Magic Strain / Casting Load。

> **Combat Core 优先拥有战斗时机；Magic Core 优先拥有 Spell 内部结构。**

---

# 15. Cooperative Casting｜协同施法

## 15.1 Core 只定义共同逻辑

多人施法是法术型魔法的基础能力之一。

最小结构：

```text
主施术者
+ 协助施术者
+ 共同 Spell / Ritual
+ 任务分工
+ 共享 Requirements
→ Runtime Resolution
```

## 15.2 主施术者

负责：

- 核心 Spell 结构；
- 最终协调；
- 关键决策。

## 15.3 协助施术者

可以贡献：

- 稳定性；
- 特定领域 Skill；
- 维持；
- 材料 / 法阵操作；
- 魔法负荷分担；
- 特定 Requirement。

## 15.4 不是简单人数加成

十个不会某个仪式的人：

> 不自动等于一个大法师。

协同施法必须存在：

- 组织；
- 分工；
- 必要能力；
- 共同结构。

## 15.5 大型仪式

Core 定义“多人 / Ritual 怎样成为合法施法形式”。

具体：

- 城市结界；
- 大预言；
- 位面工程；
- 传奇升格；

由下游 Expansion 定义特殊 Requirement。

---

# 16. Learning & Teaching｜学习与教授

## 16.1 学习来源

角色可以通过：

- 导师；
- 学院；
- 书籍；
- Spell Formula；
- 观察；
- 自学；
- 训练；
- 合法记忆 / 知识传递；
- 世界内其他正式来源；

学习 Canonical Spell。

## 16.2 学会不是瞬时按钮

学习过程应参考：

- Spell Grade；
- Magic Aptitude；
- 魔法理论；
- 术式控制；
- 已掌握相关 Spell；
- 教学质量；
- 时间；
- 可获得材料 / Focus；
- 实际练习机会。

## 16.3 学习中可以尝试

“学习中”不是禁止行动。

角色可以在适当条件下尝试不稳定施法。

Runtime 必须真实考虑其：

- Mastery 不足；
- 条件；
- 风险；
- 指导。

## 16.4 教授

能够教授某 Spell 不只取决于“自己会”。

通常需要：

- 至少稳定掌握；
- 足够理论理解；
- 对 Spell 结构拥有可表达理解；
- 合适教学环境。

深度掌握者更容易成为可靠教师。

---

# 17. Failure & Backlash｜失败与反噬

## 17.1 失败必须有因果

本 Expansion 不提供：

> “掷到 1 随机召唤恶魔”

式通用大失败表。

可能出现的结果必须能追溯到真实原因。

## 17.2 常见失败类别

### 无法启动

Requirement 不成立或能力明显不足。

### 结构失败

Spell 没有稳定形成。

### 效果不足

Spell 成功但低于预期。

### 控制偏差

目标、形态、持续等发生有限偏差。

### 维持中断

Spell 形成后无法继续稳定维持。

### 资源损失

特殊材料 / Focus 因失败被消耗或损坏。

### Strain 激增

失败增加当前 Magic Strain。

### Backlash

魔法结构反向作用于施术者、Focus 或环境。

## 17.3 Backlash 不是随机搞笑事件

Backlash 的性质应来自：

- Spell Domain；
- 失败方式；
- 当前环境；
- 特殊 Requirement；
- Theme Rule。

## 17.4 真实后果转交正式 Owner

如果 Backlash 造成：

- 伤势；
- 火灾；
- 建筑损坏；
- 关系变化；
- 法律追责；

应分别进入对应 Runtime / State Owner。

---

# 18. Spell Tag Taxonomy｜法术标签

Core 使用多维 Tag，而不是要求所有 Spell 只能属于唯一“学派”。

## 18.1 Tag 用途

- 搜索；
- Creator 分类；
- Theme Contribution；
- 规则互动；
- 法律 / 宗教投影；
- UI 筛选；
- Countermagic；
- 学习关联。

## 18.2 Core Tag 维度

### Function

例如：

- utility；
- perception；
- protection；
- movement；
- communication；
- control；
- damage；
- dispel；
- support。

### Target

例如：

- creature；
- object；
- area；
- structure；
- spell_effect。

### Form

例如：

- projectile；
- beam；
- field；
- barrier；
- mark；
- sustained。

### Risk / Sensitivity

记录真实事实，例如：

- mind_affecting；
- soul_affecting；
- corpse_use；
- blood_requirement；
- living_sacrifice；
- high_civilian_risk；
- forbidden_targeting。

这些 Tag 不是善恶结论。

## 18.3 不建立 `black_magic = evil`

“黑魔法”属于：

> World Pack / 文化 / 法律 / 宗教对事实 Tag 的社会解释。

Core 不维护宇宙级善恶标签。

## 18.4 Domain Tags

Theme Expansion 可以贡献：

- fire；
- frost；
- spatial；
- planar；
- divination；
- soul；
- mind；
- life；

等领域 Tag。

---

# 19. Theme Expansion Contract｜主题魔法声明式扩展

## 19.1 强前置原则

所有以 Spell 为主体的 Theme Expansion：

> 默认声明 `EP-MAGIC-CORE` 为强前置依赖。

## 19.2 Theme Pack 主要负责

1. Domain Identity；
2. Domain Tags；
3. 真正必要的领域 Requirement；
4. 真正必要的特殊 Interaction Rule；
5. Spell Definition；
6. UI Contribution；
7. Creator Authoring Note。

## 19.3 Theme Pack 默认不得重复

- Magic Aptitude；
- Spell Mastery；
- Casting Process；
- Casting Load；
- Magic Strain；
- 通用 Countermagic；
- 基础 Requirement；
- 通用 Spell Grade；
- 通用 Variant；
- 通用学习流程；
- 通用失败语义。

## 19.4 合法 Extension Point

Theme Expansion 可以贡献：

- `Domain Contribution`
- `Spell Contribution`
- `Tag Contribution`
- `Requirement Contribution`
- `Casting Modifier`
- `Resolution Modifier`
- `Interaction Rule`
- `UI Contribution`

这些是语义 Extension Point，不是最终 API 名称。

## 19.5 禁止平行状态

下游 Theme Expansion 不得另建：

- `FireMana`
- `MindMagicStrain`
- `SoulSpellMastery`
- `TeleportCastingProcess`
- `NecromancySkillSystem`

若需要特殊机制：

> 必须扩展 Core，而不是复制 Core。

## 19.6 Magic Breadth Contract｜魔法功能广度

魔法不是“战斗技能”的同义词。

对于空间、生命、元素、预言、心灵、灵魂等**自然领域型 Theme Expansion**，Creator 在设计 Spell Library 时必须主动探索该领域可能产生的多种社会与个人用途，例如：

- 日常生活；
- 生产与劳动；
- 交通与物流；
- 探索；
- 通讯；
- 医疗与生命维护；
- 建筑与工程；
- 学术研究；
- 信息获取；
- 环境治理；
- 公共设施；
- 商业；
- 艺术与娱乐；
- 战斗；
- 战争或灾害应对。

并不是每个 Theme 都必须覆盖全部用途。

判断标准是：

> **只要该领域自然支持某类非战斗用途，就不应因为“游戏里战斗更显眼”而把这些可能性全部删掉。**

功能型 Theme 可以合法保持聚焦。

例如：

> `EP-MAGIC-COMBAT｜战斗魔法`

本身定义的就是“为了战斗服务”，因此不要求强行创造日常家务 Spell。

## 19.7 Theme Legendary Completeness｜主题传奇完整性

在当前资产族开发阶段，每个正式生产的法术型 Theme Expansion 至少应拥有：

> **1 个真正属于本领域、满足 Core Legendary Qualification 的传说级 Spell。**

目的不是凑数量，而是强迫每个 Theme 回答：

> **“当这个领域发展到凡俗魔法极限之上，它独有的质变能力是什么？”**

该要求属于当前阶段的内容完整性 Gate。

如果某 Theme 无法提出任何真正符合传奇条件的 Spell：

> 应优先怀疑 Theme 切分是否过窄、是否只是其他 Theme 的标签组合，而不是降低传奇标准。


---

# 20. Legendary Contract｜传说级共同定义

“传说”属于本 Core 的公共 Spell Grade Contract。

它不是独立 Expansion。

## 20.1 Legendary Qualification｜什么才叫传说魔法

一个 Spell 要被标记为 `传说`，至少必须满足：

### 条件 A｜发生非线性能力跃迁

它至少跨越一种普通法术无法仅靠：

- 威力提高；
- 范围放大；
- 人数增加；
- 重复施展；

等线性堆量方式等价实现的能力边界。

因此：

> 一百个普通火球一起释放，不会自动使其中任何一个火球变成传奇 Spell。

### 条件 B｜仍然具有可定义边界

传奇 Spell 可以逼近世界边界，但仍然必须有：

- Core Effect；
- Requirement；
- Capability 前提；
- 失败方式；
- Interaction；
- Runtime Resolution。

它不能因为“很传奇”就获得无边界 GM 权限。

## 20.2 典型传奇边界

一个 Legendary Spell 可以跨越一项或多项边界。

### Scale Boundary｜规模边界

能够影响普通 Spell 无法合理线性扩展到的：

- 城市级系统；
- 大片区域；
- 大规模人群；
- 巨型基础设施；
- 战略环境。

但传奇 Spell **不必**一定是大范围。

### World Boundary｜世界边界

真正触及或跨越：

- 位面；
- 极端空间结构；
- 生死边界的某些阶段；
- 普通法术难以直接接触的世界层。

### Causal Boundary｜因果边界

能够处理：

- 长期未来；
- 大范围因果；
- 高汇聚命运节点；
- 极复杂信息关系。

### Persistence / System Boundary｜持续与系统边界

能够建立普通 Spell 无法通过简单维持等价获得的：

- 长期魔法系统；
- 大型稳定结构；
- 自维持设施；
- 跨地点协同结构。

### Local Law Exception｜局部法则例外

在：

- 有限范围；
- 有限时间；
- 严格 Requirement；

下制造某种通常不成立的局部世界条件。

这已经接近神域，但仍不是：

> 自由改写世界法则。

## 20.3 Legendary ≠ 大范围 ≠ 战斗

传奇判断看：

> **突破了什么能力边界。**

不看：

> 炸了多少平方米。

一个只作用于单个人的 Spell，如果能够完成普通魔法无法线性抵达的存在层跃迁，也可以是传奇。

同样，传奇 Spell 可以服务：

- 文明建设；
- 交通；
- 医疗；
- 环境；
- 探索；
- 信息；
- 艺术；
- 学术；
- 公共设施；
- 战斗。

## 20.4 Knowledge Availability｜传奇知识可获得性

每个 Legendary Spell 应声明其完整知识在目标世界中的可获得性语义。

推荐自然类别：

- **公开理论**：基本理论广为人知，真正施展者仍极少；
- **受控传承**：国家、学院、组织或家族严格控制；
- **私人秘传**：集中在极少数个人与师徒链条；
- **失落**：只剩残卷、记录或不完整重建；
- **孤本 / 唯一传承**：可靠完整来源极少；
- **未知**：当前文明尚未掌握。

这些是通用语义。

具体：

> 哪个学院、遗迹、国家或人物拥有它

由 World Pack / Character Definition / Game State 按各自 Owner 决定。

## 20.5 Legendary Learning Requirement｜学习门槛

获得完整公式：

> **不等于学会。**

传奇学习通常需要一组真实前提，例如：

- 深厚领域知识；
- 相关 Theme Skill；
- 若干重要前置 Spell；
- 大师级实践经验；
- 高 Spell Mastery；
- 特殊导师；
- 特殊实验；
- 身体 / 灵魂 / Magic Aptitude 条件；
- 某种决定性的理解突破。

不使用：

> “角色达到 50 级自动解锁。”

具体 Legendary Spell 自己声明真正需要的前提。

## 20.6 Legendary Knowledge Source｜知识来源

传奇知识可以通过不同路径出现：

- 古代遗产；
- 失落文明档案；
- 现代顶级机构；
- 国家战略部门；
- 传奇施法者私人传承；
- 高位存在提供知识；
- 自主研究与重建。

“神提供一个法术公式”只是知识来源之一。

这不会自动把该 Spell 变成神术，也不会让接受者自动掌握。

## 20.7 Deployment Pattern｜传奇施法形态

传奇级描述能力层次，不规定统一施法姿态。

常见形态可以包括：

### Personal Legendary Casting

由极端强大的个人直接承担。

### Grand Ritual

需要：

- 多人；
- 材料；
- Focus；
- 法阵；
- 环境；
- 较长准备。

### Strategic Magic Project

由：

- 国家；
- 城市；
- 大型组织；
- 长期魔法工程；

完成。

这些 Deployment Pattern 不是传奇专属。

部分大师级 Spell 也可能采用 Ritual；传奇 Spell 只是更常触及这些高成本形态。

## 20.8 Theme Ownership｜具体传奇法术由领域 Owner 拥有

Core 拥有：

> “什么叫传奇”的统一定义。

Theme Expansion 拥有：

> “这个领域有哪些传奇 Spell”。

例如：

```text
魔法基础
→ Legendary Contract

预言与命运
→ 大预言术（传说）

空间与位面
→ 位面传送（传说）

战斗魔法
→ 本领域传奇战斗 Spell
```

禁止建立一个只负责集中收容“所有高等级 Spell”的独立壳资产。

## 20.9 Divine Boundary｜与神性的边界

传奇 Spell 可以：

- 接近神权边界；
- 打开前往某些神性领域的道路；
- 与神性效应发生安全交互；
- 在严格条件下制造局部法则例外。

但不能仅凭“传奇”绕过：

- 神性权柄；
- 神域 Owner；
- 死亡 World Truth；
- Character Agency；
- Runtime Program Authority。

例如：

> 灵魂已经抵达死神所在死亡领域之后，传奇法术可以帮助凡人抵达、联系或提出交涉，但不能把“强行复活”写成自动成功来绕过死神。

## 20.10 Current Theme Completion Gate｜当前阶段要求

当前资产族开发阶段：

> **每个正式生产的法术型 Theme 至少提供 1 个属于自己领域的 Legendary Spell。**

这不表示每个 Theme 只需要一个，也不表示未来最终版只能有一个。

它是当前阶段验证 Theme 上限与 Core Legendary Contract 的最低样本要求。

---

# 21. Research Contract｜法术研究依赖

`EP-MAGIC-RESEARCH｜法术研究与创造` 是本 Core 的正式下游。

## 21.1 Core 的 Ownership

本 Core 回答：

> **Spell 是什么。**

## 21.2 Research 的 Ownership

研究包回答：

> **怎样创造一个此前不存在的新 Spell。**

## 21.3 Game Instance 的 Ownership

研究成功后形成：

> **符合本 Core Grammar 的 Custom Spell Definition / Instance。**

它属于当前 Game Instance。

不回写：

- 本 Core；
- Theme Expansion；
- World Pack；
- Character Card。

---

# 22. Character Card Bootstrap｜角色卡接口

Character Card 可以合法声明：

- 初始 Magic Aptitude；
- 初始魔法领域技能来源；
- 初始掌握哪些 Canonical Spell；
- 初始 Spell Mastery；
- 相关导师 / 教育 / 经历事实。

## 22.1 Bootstrap

开局时：

```text
Character Definition
+ EP-CHAR-CORE
+ EP-MAGIC-CORE
→ 初始化人物能力与 Learned Spell State
```

## 22.2 游戏后变化

游戏中角色：

- 学会新 Spell；
- 忘记 / 长期不用；
- Mastery 提升；
- Magic Aptitude 发生罕见变化；
- 当前 Strain 改变；

都属于 Game Instance。

不得回写原始 Character Card。

---

# 23. Player Knowledge｜玩家可见边界

## 23.1 自己的法术

玩家角色通常可以清楚知道：

- 自己掌握什么；
- 大体 Mastery；
- 当前 Strain；
- 已知 Requirement；
- 自己理解的合法 Variant。

## 23.2 NPC 法术能力

不得自动显示完整后台 Spell List。

玩家对 NPC 的认识可以来自：

- 亲眼观察；
- 学院档案；
- 名声；
- 军事情报；
- 导师评价；
- 共同冒险；
- 魔法检测。

例如：

> “传闻精通火焰法术。”

不等于：

> 自动知道 NPC 的全部 Spell Definition 与 Mastery。

## 23.3 未知信息

“未知”属于 Character Knowledge / UI Projection。

不能篡改 NPC 的真实能力状态。

---

# 24. UI Contribution｜界面贡献语义

本 Expansion 应允许 UI Host 展示至少：

## 玩家角色

- Magic Aptitude；
- 当前 Magic Strain；
- 魔法领域 Skills；
- Learned Spells；
- Spell Mastery；
- Spell Grade；
- Casting Load；
- Requirements；
- Tags；
- 可用 Variant；
- 当前是否满足明显 Requirement。

## Spell Library

支持按：

- Grade；
- Domain；
- Function；
- Mastery；
- Tags；

筛选。

## 不应默认显示

- Runtime 私有 Resolution 参数；
- NPC 完整隐藏 Spell List；
- 隐藏 Countermagic 情报；
- 未被角色知道的 Requirement；
- 后台世界秘密。

---

# 25. Creator Authoring｜创作者写法

## 25.1 Creator 创建普通 Spell 时应优先回答

1. 这个 Spell 的核心效果是什么？
2. 它属于什么 Grade？
3. 基础 Casting Load 是什么？
4. 目标与距离是什么？
5. 持续方式是什么？
6. 哪些轴可以调整？
7. 是否真的需要特殊 Requirement？
8. 有哪些真实风险 / 敏感 Tag？
9. 是否能被通用 Dispel / Countermagic 处理？

## 25.2 Creator 不应被迫填写

- 十几种资源消耗；
- 精确 Mana 点数；
- 精确 Skill 加成；
- 固定成功率；
- 不必要的材料；
- 每个 Spell 一套独立失败表。

## 25.3 Theme Pack Authoring

Theme Expansion 优先写：

```text
我增加了什么领域语义？
这个领域除了战斗，还自然能解决哪些问题？
我增加了什么 Spell？
我的 Theme 在传奇层级能够完成什么不可线性复制的质变能力？
我有哪些 Core 无法表达的特殊 Requirement / Interaction？
```

而不是重写 Core。

对于当前阶段正式生产的法术型 Theme：

> 至少完成 1 个属于本领域的 Legendary Spell Definition。

## 25.4 Creator 创建 Legendary Spell 时额外检查

1. 它突破了哪一种 Legendary Boundary？
2. 为什么普通 / 大师级 Spell 不能靠简单放大等价复制？
3. 它是否真的属于当前 Theme，而不是因为“很强”被随意塞进来？
4. 它的 Knowledge Availability 是什么？
5. 学习它需要哪些真实能力 / 知识前提？
6. 它采用 Personal / Ritual / Project 中哪种或哪些施法形态？
7. 它是否错误绕过了神性、死亡、Agency 或 Runtime Owner？
8. 如果它是战斗 Spell，是否只是“大伤害”，还是确有质变能力？

---

# 26. Runtime Contract｜正式运行边界

本 Expansion 声明事实与规则，但不直接拥有 Formal Outcome。

## 26.1 Runtime 必须读取

- Character Capability；
- Magic Aptitude；
- Spell Mastery；
- Spell Definition；
- Casting Load；
- Magic Strain；
- Requirements；
- Variant；
- 当前世界状态；
- 目标状态；
- Theme Interaction。

## 26.2 Runtime 决定

- Spell 是否能够启动；
- 是否成功；
- 效果规模；
- 是否部分成功；
- 是否被中断 / 反制；
- Strain 变化；
- 是否触发 Backlash；
- 世界后果。

## 26.3 Expansion 不直接 Commit

Expansion：

> 提供定义、规则与贡献。

Runtime：

> Program Judge → Formal Outcome → State Commit。

---

# 27. Definition / Instance Boundary｜定义与实例

必须永久保持：

```text
Canonical Spell Definition
≠
角色当前掌握状态
≠
当前一次施法过程
≠
当前 Spell Effect Instance
≠
游戏中研究出的 Custom Spell
```

## 27.1 Canonical Spell

属于资产。

## 27.2 Learned Spell

属于 Character Instance / Game State。

## 27.3 Casting Process

属于当前运行过程。

## 27.4 Spell Effect Instance

属于当前 Game State。

## 27.5 Custom Spell

属于当前 Game Instance，除非显式导出并经过 Creator 审核成为新正式资产。

---

# 28. 基础 Spell Library｜36 个标准基础法术

> [!note] Library 原则
> 本节提供可跨世界复用的基础 Spell Definition 语义。
>
> 它们以“足够直接游戏”为目标，不追求穷尽所有低阶魔法。
>
> World Pack 可以给这些 Spell 添加本地俗名、学院分类或法律解释，但不应在没有机制理由时偷偷改变 Core Effect。

---

## 28.1 日常与工具

### SPELL-CORE-001｜魔法灯

- **等级**：日常
- **负荷**：轻微
- **核心效果**：在允许位置形成稳定、无明显燃烧危险的可见光源。
- **目标**：点 / 小型物体
- **距离**：近距
- **持续**：维持 / 定时
- **可变轴**：亮度、颜色、位置微调、持续时间
- **标签**：utility, light, sustained
- **特殊要求**：无

### SPELL-CORE-002｜清洁术

- **等级**：日常
- **负荷**：轻微
- **核心效果**：从小范围物体或表面移除普通污垢、灰尘与非危险附着物。
- **目标**：object / area
- **距离**：接触 / 近距
- **持续**：瞬时
- **可变轴**：面积、精度
- **标签**：utility, cleaning
- **特殊要求**：无
- **边界**：不自动净化毒素、诅咒、疾病或危险魔法污染。

### SPELL-CORE-003｜点火术

- **等级**：日常
- **负荷**：轻微
- **核心效果**：点燃正常条件下可燃的小型目标。
- **目标**：object
- **距离**：近距
- **持续**：瞬时
- **可变轴**：点火位置、火种规模
- **标签**：utility, fire
- **特殊要求**：目标必须具有真实可燃条件。

### SPELL-CORE-004｜温度调节

- **等级**：日常
- **负荷**：轻微
- **核心效果**：使小型物体、饮食或局部空气在安全范围内升温或降温。
- **目标**：object / small_area
- **距离**：接触 / 近距
- **持续**：短暂
- **可变轴**：温差、范围、持续
- **标签**：utility, thermal
- **边界**：不承担战斗级冻结、燃烧或极端热力破坏。

### SPELL-CORE-005｜干燥术

- **等级**：日常
- **负荷**：轻微
- **核心效果**：移除衣物、工具、纸张或小范围表面的普通水分。
- **目标**：object / small_area
- **距离**：近距
- **持续**：瞬时
- **可变轴**：范围、精度
- **标签**：utility
- **边界**：不直接抽取活体内部水分。

### SPELL-CORE-006｜简易修补

- **等级**：基础
- **负荷**：常规
- **核心效果**：重新连接简单、原本连续且材料仍基本完整的非魔法物体破损处。
- **目标**：object
- **距离**：接触
- **持续**：长期
- **可变轴**：修补面积、精度
- **标签**：utility, repair
- **边界**：不能凭空补齐大量缺失材料，也不负责修复复杂魔具内部结构。

---

## 28.2 感知与分析

### SPELL-CORE-007｜魔力感知

- **等级**：基础
- **负荷**：常规
- **核心效果**：主动察觉附近明显魔法活动或持续魔法结构的存在。
- **目标**：area
- **距离**：近距
- **持续**：维持
- **可变轴**：范围、精度
- **标签**：perception, magic_detection
- **边界**：存在 ≠ 自动理解。

### SPELL-CORE-008｜术式辨识

- **等级**：基础
- **负荷**：常规
- **核心效果**：对可接触或可观察的魔法结构进行基础分析，判断其大体功能、领域与稳定程度。
- **目标**：spell_effect / object
- **距离**：接触 / 近距
- **持续**：短暂
- **可变轴**：分析深度、时间换精度
- **标签**：perception, analysis
- **边界**：不自动揭示隐藏世界秘密或 Creator 未授权知识。

### SPELL-CORE-009｜魔痕追踪

- **等级**：正式
- **负荷**：较重
- **核心效果**：识别并沿着近期留下的明显魔法残留寻找其移动或来源方向。
- **目标**：magic_trace
- **距离**：特殊
- **持续**：维持
- **可变轴**：追踪时间、精度
- **标签**：perception, tracking
- **特殊要求**：必须先获得可识别魔痕。
- **边界**：旧痕迹、污染环境与主动遮蔽会降低可靠性。

### SPELL-CORE-010｜异常检视

- **等级**：基础
- **负荷**：常规
- **核心效果**：检查目标是否存在明显异常魔法影响、附着或不稳定结构。
- **目标**：creature / object / area
- **距离**：近距
- **持续**：短暂
- **可变轴**：精度、检查范围
- **标签**：perception, analysis
- **边界**：发现异常 ≠ 自动知道成因。

### SPELL-CORE-011｜魔法方向感

- **等级**：日常
- **负荷**：轻微
- **核心效果**：在短时间内建立对周围魔法流动强弱与主要方向的粗略感知。
- **目标**：self
- **距离**：自身
- **持续**：短暂
- **可变轴**：持续、精度
- **标签**：perception, environment
- **边界**：不等于位面感知或预言。

### SPELL-CORE-012｜结构标定

- **等级**：基础
- **负荷**：常规
- **核心效果**：在已观察的魔法结构中标出若干稳定节点、薄弱节点或交互位置，供后续操作参考。
- **目标**：spell_effect / magic_structure
- **距离**：接触 / 近距
- **持续**：定时
- **可变轴**：节点数量、精度
- **标签**：analysis, support
- **边界**：标定不自动完成破解或驱散。

---

## 28.3 防护与反制

### SPELL-CORE-013｜基础屏障

- **等级**：基础
- **负荷**：常规
- **核心效果**：形成短暂魔法屏障，阻挡或削弱有限外来冲击。
- **目标**：area / self
- **距离**：自身 / 近距
- **持续**：维持
- **可变轴**：面积、方向、持续
- **标签**：protection, barrier
- **边界**：不是绝对无敌墙。

### SPELL-CORE-014｜护身术

- **等级**：基础
- **负荷**：常规
- **核心效果**：在单个目标周围建立贴身的低强度魔法防护。
- **目标**：creature
- **距离**：接触 / 近距
- **持续**：定时
- **可变轴**：持续、保护侧重
- **标签**：protection, ward

### SPELL-CORE-015｜警戒结界

- **等级**：基础
- **负荷**：常规
- **核心效果**：在小范围设置简单触发式警戒，当指定边界被穿越或明显扰动时向施术者发出信号。
- **目标**：area
- **距离**：接触
- **持续**：定时 / 触发式
- **可变轴**：范围、触发条件
- **标签**：protection, alert, mark
- **特殊要求**：需要短暂布置。

### SPELL-CORE-016｜驱散术

- **等级**：正式
- **负荷**：较重
- **核心效果**：尝试破坏一个当前可被驱散的持续 Spell Effect。
- **目标**：spell_effect
- **距离**：近距 / 可视
- **持续**：瞬时
- **可变轴**：投入负荷、目标优先级
- **标签**：dispel, countermagic
- **边界**：不能无条件取消任何魔法。

### SPELL-CORE-017｜施法干扰

- **等级**：正式
- **负荷**：较重
- **核心效果**：在短时间内干扰一个正在进行的法术型施法过程，提高其维持和完成难度。
- **目标**：casting_process
- **距离**：可视
- **持续**：短暂
- **可变轴**：持续、干扰强度
- **标签**：countermagic, control
- **边界**：不是自动打断。

### SPELL-CORE-018｜术式稳定

- **等级**：基础
- **负荷**：常规
- **核心效果**：辅助维持一个已经合法形成但处于轻度不稳定的法术结构。
- **目标**：spell_effect / cooperative_casting
- **距离**：近距
- **持续**：维持
- **可变轴**：持续、辅助强度
- **标签**：support, stabilization
- **边界**：不能把已经彻底崩溃的 Spell 无条件恢复。

---

## 28.4 移动与操控

### SPELL-CORE-019｜牵引术

- **等级**：日常
- **负荷**：轻微
- **核心效果**：使小型非固定物体朝施术者或指定方向平稳移动。
- **目标**：object
- **距离**：近距
- **持续**：维持
- **可变轴**：速度、距离、精度
- **标签**：movement, object_control

### SPELL-CORE-020｜浮举术

- **等级**：基础
- **负荷**：常规
- **核心效果**：使有限重量目标暂时离开支撑面并受控悬浮。
- **目标**：object
- **距离**：近距
- **持续**：维持
- **可变轴**：高度、重量、移动速度
- **标签**：movement, object_control
- **边界**：不等于自由飞行。

### SPELL-CORE-021｜缓降术

- **等级**：基础
- **负荷**：常规
- **核心效果**：降低目标坠落速度，使正常高处坠落更容易安全着地。
- **目标**：creature / object
- **距离**：近距
- **持续**：短暂
- **可变轴**：目标数量、持续
- **标签**：movement, protection

### SPELL-CORE-022｜轻身术

- **等级**：基础
- **负荷**：常规
- **核心效果**：短暂降低目标行动时受到的自身体重负担。
- **目标**：creature
- **距离**：接触
- **持续**：定时
- **可变轴**：持续、效果幅度
- **标签**：movement, support
- **边界**：不提供真正飞行。

### SPELL-CORE-023｜推斥术

- **等级**：基础
- **负荷**：常规
- **核心效果**：对目标施加一次短促定向推力。
- **目标**：creature / object
- **距离**：近距
- **持续**：瞬时
- **可变轴**：方向、强度
- **标签**：movement, control
- **风险**：高处、危险地形中可能造成真实伤害。

### SPELL-CORE-024｜固着术

- **等级**：基础
- **负荷**：常规
- **核心效果**：让一个小型物体在有限时间内更难相对其当前支撑面移动。
- **目标**：object
- **距离**：接触 / 近距
- **持续**：定时
- **可变轴**：持续、固着强度
- **标签**：control, utility
- **边界**：不等于永久焊接或不可破坏。

---

## 28.5 交流与辅助

### SPELL-CORE-025｜传声术

- **等级**：日常
- **负荷**：轻微
- **核心效果**：把施术者正常说出的声音定向传递到附近指定位置。
- **目标**：point / creature
- **距离**：近距
- **持续**：短暂
- **可变轴**：方向、音量、持续
- **标签**：communication, sound

### SPELL-CORE-026｜短讯术

- **等级**：基础
- **负荷**：常规
- **核心效果**：向当前可明确定位的近距离目标传递一段简短语义讯息。
- **目标**：creature
- **距离**：远距
- **持续**：瞬时
- **可变轴**：讯息长度、准备时间
- **标签**：communication
- **边界**：不等于无限距离跨世界通讯。

### SPELL-CORE-027｜魔法标记

- **等级**：日常
- **负荷**：轻微
- **核心效果**：在目标表面留下可被普通观察或魔法感知识别的临时标记。
- **目标**：object / surface
- **距离**：接触 / 近距
- **持续**：定时
- **可变轴**：图形、可见性、持续
- **标签**：mark, utility

### SPELL-CORE-028｜指引线

- **等级**：基础
- **负荷**：常规
- **核心效果**：在短时间内建立一条可见或仅对指定对象可感知的方向指引。
- **目标**：area / path
- **距离**：近距
- **持续**：定时
- **可变轴**：可见性、长度、持续
- **标签**：support, navigation
- **边界**：它标示已知路径，不自动发现未知正确路线。

### SPELL-CORE-029｜静音区

- **等级**：正式
- **负荷**：较重
- **核心效果**：在小范围内显著削弱普通声音向外传播。
- **目标**：area
- **距离**：近距
- **持续**：维持
- **可变轴**：范围、持续
- **标签**：support, sound, field
- **边界**：不自动阻止魔法通讯，也不等于绝对真空。

### SPELL-CORE-030｜协作节拍

- **等级**：基础
- **负荷**：常规
- **核心效果**：在小组成员之间提供简单、非语言的同步节奏提示，帮助重复性协作保持一致。
- **目标**：multiple_creatures
- **距离**：近距
- **持续**：维持
- **可变轴**：目标数量、节奏复杂度
- **标签**：support, cooperative
- **边界**：不传输复杂思想，不控制意志。

---

## 28.6 基础战斗

### SPELL-CORE-031｜魔能矢

- **等级**：基础
- **负荷**：常规
- **核心效果**：释放一枚短程定向魔法冲击，对命中目标造成有限直接冲击。
- **目标**：creature / object
- **距离**：可视
- **持续**：瞬时
- **可变轴**：强度、精度
- **标签**：damage, projectile, force
- **边界**：不自动必中。

### SPELL-CORE-032｜火焰弹

- **等级**：基础
- **负荷**：常规
- **核心效果**：投射小型火焰，造成热力与燃烧风险。
- **目标**：creature / object / point
- **距离**：可视
- **持续**：瞬时
- **可变轴**：威力、弹道、点燃倾向
- **标签**：damage, projectile, fire
- **风险**：可燃环境可能形成真实次生火灾。
- **边界**：完整火焰领域玩法属于元素主题 Expansion。

### SPELL-CORE-033｜冰霜束

- **等级**：基础
- **负荷**：常规
- **核心效果**：对近距离目标施加短促低温冲击，造成寒冷与短暂迟缓风险。
- **目标**：creature / object
- **距离**：近距
- **持续**：瞬时 / 短暂
- **可变轴**：强度、持续
- **标签**：damage, control, frost
- **边界**：不自动完全冻结大型目标。

### SPELL-CORE-034｜震击术

- **等级**：基础
- **负荷**：常规
- **核心效果**：向接触或近距离目标释放短促震荡冲击，适合打断、击退或造成有限伤害。
- **目标**：creature / object
- **距离**：接触 / 近距
- **持续**：瞬时
- **可变轴**：方向、强度
- **标签**：damage, control, force

### SPELL-CORE-035｜束缚带

- **等级**：正式
- **负荷**：较重
- **核心效果**：形成短暂魔法束缚结构，限制一个目标的明显位移或肢体动作。
- **目标**：creature
- **距离**：近距
- **持续**：维持
- **可变轴**：限制部位、持续、强度
- **标签**：control, restraint
- **边界**：目标仍可以反抗、破坏、逃脱或接受外部协助。

### SPELL-CORE-036｜眩光术

- **等级**：基础
- **负荷**：常规
- **核心效果**：在指定方向制造短暂强光干扰，影响依赖视觉的观察和瞄准。
- **目标**：area / point
- **距离**：近距
- **持续**：瞬时 / 短暂
- **可变轴**：方向、范围、强度
- **标签**：control, light
- **边界**：效果取决于目标感知方式和防护条件。

---

# 29. Basic Library Ownership｜基础法术边界

## 29.1 为什么 Core 自带这些 Spell

因为一个“魔法基础”资产若只有 Grammar 而没有可用 Spell：

> 玩家安装后仍然无法直接体验法术型魔法。

因此 Core 必须自身提供一个完整的最低可玩集合。

## 29.2 为什么不继续无限扩张

本 Library 只负责：

- 日常；
- 工具；
- 基础感知；
- 基础防护；
- 基础操控；
- 基础交流；
- 基础战斗；
- 通用反制。

更深入领域交给 Theme Expansion。

## 29.3 Theme Ownership 例子

Core 可以提供：

> 火焰弹。

元素主题包负责进一步提供：

- 火墙；
- 火焰塑形；
- 大范围燃烧；
- 元素护甲；
- 环境火焰操纵；
- 更复杂元素 Interaction。

Core 可以提供：

> 魔痕追踪。

预言主题包负责：

- 远视；
- 条件未来；
- 命运节点；
- 大规模预言干扰。

---

# 30. Cross-World Compatibility｜跨世界复用

本 Expansion 不假定：

- 埃瑟维亚；
- 五神；
- 大断裂；
- 五强；
- 某个学院；
- 某个魔法术语；
- 某种货币；
- 某种位面；
- 某种魔法材料。

World Pack 可以：

- 重命名社会术语；
- 决定法术是否普及；
- 决定谁能合法学习；
- 决定哪些 Spell 被禁止；
- 决定某些 Requirement 在该世界是否容易获得；
- 决定种族 / 血统如何影响 Magic Aptitude。

但不能在不声明兼容差异的情况下：

> 私自改变 Core 的基础 Spell 运行语义。

---

# 31. Compatibility with 埃瑟维亚｜诸界余辉首发绑定

在《埃瑟维亚：诸界余辉》中，本 Expansion 应支持：

- 极高魔社会；
- 普通人接触基础魔法；
- 正式法师存在巨大能力差异；
- 学院、私师、家族、军队等多种教育路径；
- 魔法与神术本体同源但运行分流；
- 传奇魔法真实存在；
- “黑魔法”由社会与法律解释，而非 Core 善恶标签；
- 魔法工具普及，但制造由未来魔法工艺 Expansion 负责；
- 战斗、空间、预言、灵魂等 Theme 共享同一 Spell Grammar，并由各自 Theme 自行拥有符合 Legendary Contract 的传说级 Spell。

---

# 32. Dependency Matrix｜依赖矩阵

| 资产 | 与本 Core 的关系 | 原则 |
|---|---|---|
| 人物能力与技艺 | 上游 | 本 Core 消费统一人物能力与 Skill Registry |
| World Pack | 并列世界事实 Owner | 决定世界如何理解、教授、监管魔法 |
| 战斗核心 | Optional Integration / Combat Owner | Magic Core 非战斗可独立；直接战斗由 Combat Core 拥有战斗壳 |
| 战斗魔法 | 强下游 | 同时 Hard Depend Magic Core + Combat Core；本包只提供 Spell Internal Grammar |
| 空间与位面 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 预言与命运 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 元素与毁灭 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 心灵与幻象 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 灵魂与亡灵 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 生命与变形 | 强下游 | 只扩展领域语义与 Spell，并可拥有本领域 Legendary Spell |
| 法术研究与创造 | 强下游 | 创造符合 Core Grammar 的 Custom Spell |
| 魔法工艺与魔具 | 交互 | 可提供 Focus / 魔具，但制造机制独立 |
| 神术与信仰 v0.2.1 | 并行 / Optional Integration | 通过 Divine Interaction Profile 交互；不继承法术型状态 |
| Character Card | Bootstrap | 可声明初始 Aptitude / Learned Spell |
| Runtime | 正式执行者 | Judge / Resolution / Commit |

---

# 33. Regression Cases｜永久回归案例

## RC-MAGIC-01｜主题包重复施法系统

**错误：**

空间包创建 `TeleportCastingProcess`，元素包创建 `ElementCastingProcess`。

**正确：**

二者都引用 Core `Casting Process`，只声明必要领域扩展。

---

## RC-MAGIC-02｜把每个 Spell 做成 Character Skill

**错误：**

Skill Registry 中出现 200 个法术技能。

**正确：**

通用技能由 Skill Registry 管理；具体 Spell 用 Mastery 管理。

---

## RC-MAGIC-03｜重新发明 Mana

**错误：**

某 Theme Expansion 添加 `FireMana = 100`。

**正确：**

使用 Core Casting Load / Magic Strain；真正特殊领域资源必须证明其独立世界意义，并接受 Ownership 审核。

---

## RC-MAGIC-04｜十维魔法资质

**错误：**

为了“精确”增加感应、容量、稳定、纯度、效率、亲和、精神池等大量玩家参数。

**正确：**

默认只使用一个 `Magic Aptitude`；实际能力由通用能力、领域技能与 Spell Mastery 表达。

---

## RC-MAGIC-05｜成本表膨胀

**错误：**

每个基础 Spell 强制填写精神值、体力值、材料值、环境值等十几个成本。

**正确：**

所有 Spell 只有一个公共 Casting Load；只有真实需要时才添加 Special Requirement。

---

## RC-MAGIC-06｜法术变体变成万能即兴魔法

**错误：**

掌握火焰弹后直接“变体”为治疗、读心或位面传送。

**正确：**

Variant 必须保持 Spell Core；真正新能力进入法术研究。

---

## RC-MAGIC-07｜变体自动写回资产

**错误：**

玩家一次成功特殊用法后，原 Expansion 新增 Spell。

**正确：**

Game Instance 不写回 Asset Definition。

---

## RC-MAGIC-08｜随机荒诞大失败

**错误：**

任何失败都查通用表随机召唤怪物。

**正确：**

失败 / Backlash 必须从 Spell、环境、能力、Requirement 与真实因果产生。

---

## RC-MAGIC-09｜黑魔法宇宙善恶字段

**错误：**

Core 定义 `black_magic = evil`。

**正确：**

Core 记录事实 Tag；World Pack / 法律 / 宗教解释其伦理与禁忌。

---

## RC-MAGIC-10｜神术被做成换皮 Spell

**错误：**

神术直接继承 Magic Aptitude、Spell Mastery 与 Magic Strain，仅改图标。

**正确：**

神术拥有独立 Domain Owner；与 Spell Magic 只在正式交互层对接。

---

## RC-MAGIC-11｜为 Legendary Grade 创建纯依赖壳 Expansion

**错误：**

因为“传说很特殊”，建立一个独立《传说魔法》包，只负责定义传奇标准，并要求空间、预言、生命、战斗等 Theme 额外依赖它。

**正确：**

Legendary Contract 直接由《魔法基础》拥有；具体 Legendary Spell 留在所属 Theme。

---

## RC-MAGIC-12｜Creator 主题包过重

**错误：**

每做一个 Theme Expansion 都必须重复 50 页基础魔法机制。

**正确：**

Theme Pack 声明式引用 Core，只写真正新增的领域内容。

---

## RC-MAGIC-13｜高级魔法全部战斗化

**错误：**

某自然领域 Theme 越往高阶越只剩伤害、控制和战场能力。

**正确：**

自然领域 Theme 主动探索生活、生产、探索、交通、研究、医疗、公共设施、艺术等合理用途；战斗只是其中一种可能。

---

## RC-MAGIC-14｜Legendary 等于超大 AoE

**错误：**

只有能毁城的 Spell 才能标记为传奇。

**正确：**

Legendary 看非线性能力边界；单目标、信息、交通、生命、艺术或系统型 Spell 都可以是传奇。

---

# 34. Acceptance Gate｜单资产审核清单

正式绑定 Creator / asset-spec vNext 前至少检查：

## Ownership

- [ ] Magic Aptitude 只有本 Expansion 一个角色级 Owner；
- [ ] 通用人物六层能力仍由 EP-CHAR-CORE 拥有；
- [ ] Health / Condition 没有被 Magic Strain 替代；
- [ ] 神术没有被本 Core 接管；
- [ ] 魔具制造没有被本 Core 接管；
- [ ] 法术研究没有被本 Core 接管。

## Simplicity

- [ ] 玩家侧没有多维魔法资质负担；
- [ ] 没有统一 Mana；
- [ ] 没有十几种强制成本；
- [ ] Casting Load / Strain 的语义足够清晰；
- [ ] Spell Mastery 不与 Skill Registry 重复。

## Extensibility

- [ ] Theme Expansion 可以声明式新增 Spell；
- [ ] 新 Domain 可以新增 Tag；
- [ ] 新 Requirement 有正式 Extension Point；
- [ ] Theme 不需要重复 Countermagic；
- [ ] Theme 可以在不增加第二套机制的前提下直接拥有 Legendary Spell；
- [ ] Legendary Qualification / Knowledge Availability / Learning Requirement 已可统一复用；
- [ ] Research 可以产生兼容 Custom Spell。

## Runtime Boundary

- [ ] Expansion 不直接 Commit；
- [ ] Formal Outcome 仍属于 Runtime；
- [ ] Spell Effect Instance 与 Definition 分离；
- [ ] Custom Spell 不回写资产。

## Player Agency

- [ ] Spell Definition 不是动作白名单；
- [ ] 未掌握不等于角色不能尝试任何相关行为；
- [ ] Variant 不替玩家决定目标和意图；
- [ ] 控制类 Spell 的具体玩家授权问题留给正式 Runtime / Player Agency 规则。

---

# 34.5 v0.2 修订摘要

本版根据资产族讨论完成以下 Blueprint / Ownership 收敛：

- 取消独立 `EP-MAGIC-LEGEND｜传说魔法` 作为必要 Expansion；
- 将 Legendary Qualification、知识可获得性、学习门槛、施法形态与神性边界统一吸收进 Core；
- 明确 `传说` 是 Spell Grade，不是 Theme；
- 具体 Legendary Spell 回归各 Theme 的 Canonical Ownership；
- 新增 Magic Breadth Contract，明确高阶魔法不能默认退化为战斗技能表；
- 新增当前阶段 Theme Legendary Completeness：每个正式法术型 Theme 至少提供 1 个本领域 Legendary Spell；
- Creator Authoring 增加 Legendary Spell 与非战斗功能广度检查；
- 更新所有依赖语义，移除“传说魔法”纯依赖壳。

---

# 35. 当前资产状态

```text
EP-MAGIC-CORE｜魔法基础
├─ 创作前讨论                  COMPLETE
├─ 用户裁定                    COMPLETE
├─ 正式创作授权                COMPLETE
├─ Combat Ownership Refactor   COMPLETE
├─ Semantic Candidate v0.3     AUDITED CURRENT
├─ Independent Re-audit        PASS
├─ Creator Binding             PENDING
└─ asset-spec vNext Binding    PENDING
```

---

# 36. 后续建议顺序

按当前资产组合总蓝图：

```text
EP-CHAR-CORE
├─ EP-COMBAT-CORE v0.1
└─ EP-MAGIC-CORE v0.3

EP-COMBAT-CORE + EP-MAGIC-CORE
→ EP-MAGIC-COMBAT v0.3

EP-CHAR-CORE
→ EP-HEALTH-CORE v0.1

Magic / Combat / Divine
↔ EP-HEALTH-CORE
= Optional Integration / Handoff

Pioneer Asset Family
→ FINAL CLOSURE PASS
```

每个后续法术型 Theme 在当前阶段至少提供 1 个本领域 Legendary Spell，用来验证该领域的纵向能力上限。

Theme Expansion 的批量生产仍不应在核心角色验证之前无限扩张。

---

# 37. 最终冻结语句

> **`EP-MAGIC-CORE｜魔法基础` 是所有法术型魔法资产的公共 Core，而不是单纯的低阶法术包。**
>
> **玩家侧保持低复杂度：一个魔法适性、统一施法负荷、当前魔法失衡、具体 Spell Mastery。**
>
> **Creator 侧保持高一致性：所有主题 Spell 使用同一 Grammar，通过声明式 Contribution 扩展。**
>
> **主题可以不同，法术语法必须相同。**
>
> **“传说”是所有 Theme 共享的最高纵向 Grade，不是独立 Theme；具体传奇 Spell 必须由它真正所属的领域资产拥有。**
>
> **魔法的高阶发展不以战斗为默认终点；它同样可以改变生活、文明、研究、交通、医疗、环境与艺术。**


---

# v0.2.1 Divine Interface Closure

本 patch 不改变 Spell Grammar。

仅关闭 `EP-DIVINE-CORE` 接口：

- Spell Magic 与 Divine Invocation 不再处于抽象 Future Interaction；
- 采用 Divine Core 的 Interaction Profile；
- 普通 Countermagic 不拥有 Covenant / Authorization / Sovereign Boundary 权限；
- Magic Strain 与 Channel Strain 明确保持两个 Canonical State Owner。


---

# v0.2.2 Core Audit Closure

本 patch 不改变 Spell Grammar。

完成：

- 当前版本 / 标题 /状态统一；
- Character Core / Blueprint / World 引用更新；
- `EP-DIVINE-CORE v0.2` Interaction Profile 作为 Optional Integration 正式消费者接口；
- Magic Strain 与 Channel Strain 保持独立 Canonical Owner；
- 核心 Ownership / Dependency 总审核：PASS。

---

# v0.3 Combat Core Ownership Refactor

本版根据项目所有者“战斗核心优先”裁定，将直接战斗中的 Combat Range、LOS/Cover、Reaction Window、Combat Defense、Stance、Pressure、Tempo、Martial Outcome、Combat Consequence 与通用 Coupling Trigger 正式让渡给 `EP-COMBAT-CORE`。

Magic Core 保留 Spell Mastery、Magic Aptitude、Spell Definition、Spell Target/Reach/Duration、Casting Load、Magic Strain、Spell Variant、Counter/Dispel Internal Grammar、Ritual 与 Legendary Contract。

> **Magic Core 定义 Spell，不再定义整个战斗。**

当前：`v0.3 candidate / INTERFACE RE-AUDIT PASS`。


---

# 35. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本 Core 是法术型魔法公共语义 Owner。

G8 UI 意图：

- 当 Magic 机制启用时，本 Core **请求拥有一个独立“魔法”Extension Surface**；
- Spell Library、已学 Spell、Mastery、Ritual 等可进入该 Surface 的受控 View / Section；
- Casting 过程可进入 Narrative Contextual Surface；
- Magic Strain 可贡献 Player Status；
- 下游 Theme / Combat Magic 只贡献到“魔法”Surface，不得重新 owns 同一 Surface。

“埃瑟维亚兼容”章节仅为首发 reference consumer 示例。

**通用库独立审核：PASS。**
