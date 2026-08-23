---
title: 战斗魔法｜Expansion Pack
aliases:
  - EP-MAGIC-COMBAT
  - Combat Magic
  - Martial Spellcraft
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
  - "[[魔法基础_Expansion_Pack_v0.3]]"
  - "[[战斗核心_Expansion_Pack_v0.1]]"
reference_world_consumers:
  - "[[埃瑟维亚_诸界余辉_World_Pack_v0.1.3]]"
health_core_optional:
  - "[[身体状态核心_Expansion_Pack_v0.1]]"
generic_reuse_target: true
domain_role: combat_spell_theme
creator_binding: pending
asset_spec_binding: pending
language: zh-CN
tags:
  - 酒馆游戏
  - tavern-asset
  - Expansion-Pack
  - Magic
  - Combat
  - Martial
  - Anti-Magic
  - 敌法者
  - 声明式资产
  - 通用资产
  - Obsidian
---

# 战斗魔法｜Expansion Pack v0.3

> [!abstract] 一句话定位
> **《战斗魔法》把法术型魔法压缩、武技化并嵌入真实战斗，使战士、射手、猎人、潜行者等不必转变成传统学院法师，也能够形成魔剑士、魔弓手、魔猎者、影行者与敌法者等成熟战斗风格。**
>
> 本包最重要的战略支柱之一是：
>
> **反制魔法。**
>
> 敌法者不是“不会魔法所以克制法师”的职业，也不是获得万能禁魔权限的人。他们本身学习法术型魔法，并专门把 Countermagic 训练成可以在近身压迫、追猎、护卫和短反应窗口中使用的战斗技术。
>
> 因此，《战斗魔法》可以与元素、空间、心灵、灵魂等领域 Theme Expansion **分庭抗礼但不抢 Ownership**：
>
> - 领域 Theme 负责把某种魔法做深；
> - 《战斗魔法》负责把法术变成适合战士体系使用的实战工具；
> - 敌法者负责让所有依赖 Spell Casting 的强者拥有真实可被针对的战斗弱点。

> [!important] 当前可信状态
> **已审核语义稿 v0.3｜已正式绑定 `EP-COMBAT-CORE v0.1`，Combat / Health / Generic Library 总审核通过。**
>
> 本稿冻结 Ownership、玩法循环、声明式 Extension、Spell Library 与跨 Expansion 接口需求，不伪造未来正式 Schema、ID 或 Runtime Primitive。

---

# 0. 创作摘要

本资产根据项目所有者已确认的创作方向生成。

## 0.1 已确认方向

1. 主要服务对象不是传统法师群体，而是：
   - 战士；
   - 猎人；
   - 射手；
   - 潜行者；
   - 其他以武技、装备、机动和实战为核心的人物。
2. 法师可以学习本包，没有职业硬限制。
3. 战斗魔法的设计目标始终是：
   > **为了战斗服务。**
4. 战斗魔法可以包含多种表现形式，但以短式、稳健、动作化、实战可靠为主要设计语言。
5. 魔剑士、魔弓手、魔猎者、影行者、敌法者是**战斗风格**，不是固定职业树。
6. 本包强依赖 `EP-MAGIC-CORE｜魔法基础` 与 `EP-COMBAT-CORE｜战斗核心`。
7. 本包复用：
   - Magic Aptitude；
   - Spell Mastery；
   - Casting Load；
   - Magic Strain；
   - Countermagic Grammar；
   - Spell Definition Grammar。
8. 本包不新增 Battle Mana / Rage / 第二套施法系统。
9. 本包允许基础、正式、高阶、大师与传说级 Combat Spell；`传说` 直接使用《魔法基础》Legendary Contract，由本 Theme 自己拥有符合条件的传奇战斗 Spell。
10. **敌法者 / 反制魔法为核心支柱，不是附带小分支。**

---

# 1. Scope Lock

## 1.1 本包必须完成

- 战斗魔法作为通用法术 Theme 的身份；
- 非传统法师为什么能形成成熟战斗魔法路线；
- Combat Style Profile；
- `战斗施法` Skill Contribution；
- Combat Core 通用 Coupling Grammar 上的 **Spell ↔ Martial Coupling Contribution**；
- Weapon / Projectile / Movement / Reaction 的 **Spell Contribution**；通用 Combat Grammar 由 Combat Core 提供；
- 反制魔法与 Core Countermagic 的职责分层；
- 敌法者完整玩法定位；
- 52 个标准 Combat Spell，其中包含 2 个本领域 Legendary Spell；
- 与未来元素、空间、心灵等 Theme 的组合原则；
- 与 `EP-COMBAT-CORE` 的 Hard Dependency / Combat Extension Contract；
- Creator Authorability；
- 测试场景与回归案例。

## 1.2 明确不做

- 固定职业等级；
- 魔剑士职业树；
- 武器攻击命中系统；
- 伤害公式；
- 护甲数值公式；
- 战斗回合制规则；
- Battle Mana；
- Rage；
- 战场军团 / 国家战争机制；
- 永久附魔和魔具制造；
- 元素魔法完整领域；
- 空间魔法完整领域；
- 心灵魔法完整领域；
- 神术反制的最终规则；
- 其他领域 Theme 的 Legendary Spell；
- Character Card 正文。

---

# 2. 资产身份与可复用性

## 2.1 类型

> **Reusable Spell Theme Expansion**

## 2.2 Hard Dependency

```text
EP-CHAR-CORE
├─→ EP-MAGIC-CORE
└─→ EP-COMBAT-CORE

EP-MAGIC-CORE + EP-COMBAT-CORE
↓
EP-MAGIC-COMBAT
```

## 2.3 World Pack 的职责

World Pack 决定：

- 谁普遍教授战斗魔法；
- 军队、佣兵、猎团和学院怎么看待它；
- “魔剑士”“敌法者”等名称是否流行；
- 哪些国家禁止某些反制魔法；
- 哪些组织垄断高阶战斗术式。

本包不硬编码这些世界事实。

---

# 3. 核心设计哲学

## 3.1 战斗魔法不是低级法师魔法

> **简单不等于弱。**

战斗魔法通常牺牲：

- 通用性；
- 学术延展性；
- 大尺度仪式能力；
- 极复杂自由变体；

换取：

- 更短的施法结构；
- 更高压环境鲁棒性；
- 与武器动作兼容；
- 更容易形成身体记忆；
- 更容易在移动中使用；
- 更窄但更可靠的实战效果。

## 3.2 非传统法师路线

一个战士不必拥有广博魔法学术背景。

他可能只掌握：

- `战斗施法`；
- 少量魔法理论；
- 一组高度熟练的 Combat Spell；
- 自己的近战兵器 / 远程兵器、潜行或狩猎相关能力。

这仍然可以形成极强的战斗能力。

## 3.3 法师仍然可以学习

本包不包含职业白名单。

传统法师可以学习全部 Combat Spell。

只是很多世界中的学院法师可能更偏好：

- 高阶领域法术；
- 复杂变体；
- 大型仪式；
- 理论完整性；

而把战斗短式视为：

> 实用、直接、狭窄但高效的魔法工程。

这是 World Pack 可使用的社会解释，不是 Core 禁令。

---

# 4. Skill Contribution｜战斗施法

本包只向统一 Skill Registry 贡献一个真正通用的新技能：

> **战斗施法**

它表示：

> 在高速移动、受击威胁、近身压迫、武器动作、复杂地形和短反应窗口中，把法术稳定嵌入战斗的训练程度。

## 4.1 战斗施法不替代

- 近战兵器；
- 远程兵器；
- 潜行；
- 狩猎；
- 体魄；
- 协调；
- 感知；
- 术式控制；
- 魔法感知；
- Spell Mastery。

## 4.2 示例 Capability

魔弓手可能依赖：

```text
远程兵器
+ 战斗施法
+ 术式控制
+ 对应 Spell Mastery
```

敌法者可能依赖：

```text
战斗施法
+ 魔法感知
+ 术式控制
+ 近战兵器 / 远程兵器 / 运动等相关能力
+ 反制 Spell Mastery
```

不存在“敌法者等级”。

---

# 5. Spell ↔ Martial Coupling Contribution

v0.3 起，通用 Combat Coupling Grammar 正式上移 `EP-COMBAT-CORE`。

本包只拥有：**哪一个 Combat Spell 在什么 Combat Core Outcome / Trigger 后可以继续 Resolve。**

```text
Combat Core: Martial Outcome / effective_contact / Reaction
↓
Combat Magic: Spell-specific Coupling Condition
↓
Magic Core: Spell Effect / Countermagic Internal Resolution
```

Combat Spell 永远不能反向保证 Martial Outcome。

由于 Combat Core 已成为 Hard Dependency，本包不再保留“缺少 Combat Provider 时自行用通用世界 Action 充当完整战斗系统”的正式降级。
---

# 6. Combat Style Profile｜战斗风格而非职业

Style Profile 只是：

> 推荐技能 + Spell 组合 + 战术偏好。

不是：

- 职业锁；
- 等级树；
- 法术权限白名单。

## 6.1 魔剑士

核心：

- 武器强化；
- 近战耦合；
- 瞬间机动；
- 防守反击；
- 少量反制。

典型组合：

> 锐锋术 / 震荡斩 / 瞬步 / 刃前屏障 / 断法斩

## 6.2 魔弓手

核心：

- Projectile Channel；
- 轨迹修正；
- 远距标记；
- 破障；
- 战场感知。

典型组合：

> 贯劲矢 / 追迹矢 / 破障矢 / 猎印 / 战场锐感

## 6.3 魔猎者

核心：

- 追踪；
- 标记；
- 控场；
- 生存战斗；
- 对特定目标持续施压。

典型组合：

> 猎印 / 战场锐感 / 牵足符 / 瞬步 / 贯劲矢

## 6.4 影行者

核心：

- 降噪；
- 痕迹控制；
- 视觉扰动；
- 爆发接近；
- 快速脱离。

典型组合：

> 静步术 / 魔痕收束 / 轮廓扰动 / 瞬步 / 紧急脱离

## 6.5 敌法者

> **本包的核心辨识度 Style。**

敌法者以：

- 施法识别；
- 追猎；
- 反应打断；
- 破障；
- 驱散；
- 制造 Magic Strain；
- 压制 Casting Load；
- 保护队友免受 Spell；
- 近身逼迫高阶施法者失去从容施法环境；

为核心。

敌法者不是：

> 无魔法者。

恰恰相反：

> **敌法者学习的是“专门用来让别人难以正常施法”的魔法。**

---

# 7. 敌法者三种典型取向

## 7.1 追猎型敌法者

目标：

> 找到施法者，并让对方无法从容保持距离。

重视：

- 魔法感知；
- 施法追迹；
- 战场锐感；
- 瞬步；
- 猎印；
- 魔痕追踪类能力。

## 7.2 决斗型敌法者

目标：

> 把每一次施法都变成可以被惩罚的战斗窗口。

重视：

- 识式瞬读；
- 截咒；
- 断法斩；
- 破障击；
- 焦点扰乱；
- 零式封断。

## 7.3 护卫型敌法者

目标：

> 让敌对法师无法轻易越过自己杀伤队友。

重视：

- 反制护卫；
- 驱附术；
- 消散波；
- 抑术场；
- 刃前屏障；
- 同伴遮护。

“战法卫士”可以成为部分世界对这一分支的地方称呼，但 Core Profile 统一归入：

> **敌法者。**

---

# 8. Core Countermagic 与反制魔法的 Ownership

## 8.1 《魔法基础》拥有

- 什么叫识别 Spell；
- 什么叫打断；
- 什么叫抵消；
- 什么叫驱散；
- 什么叫抑制；
- 什么叫防护；
- Countermagic 如何进入 Runtime Resolution。

## 8.2 《战斗核心》拥有

- Combat Reaction Window；
- Range / Reach / LOS / Cover；
- Combat Pressure / Opposition；
- Combat Interruption Trigger；
- Martial Outcome / Combat Consequence。

## 8.3 《战斗魔法》拥有

- 战斗化反制 Spell Definition；
- 如何把反制与武器 / 移动 / Reaction Window 耦合；
- 敌法者 Style；
- 如何用 Combat Spell：
  - 提高对手 Casting Load；
  - 制造 Magic Strain；
  - 破坏 Focus；
  - 破坏维持结构；
  - 对抗 Barrier；
  - 保护同伴。

## 8.4 禁止

本包不得自行声明：

> “所有魔法在敌法者面前无效。”

敌法者仍需要：

- 技能；
- 时机；
- 接近；
- 信息；
- Spell Mastery；
- 当前状态；
- 正式 Resolution。

高阶法师依然可以：

- 诱导错误反制；
- 使用快速 Spell；
- 通过距离和地形压制；
- 多重施法；
- 破坏敌法者节奏；
- 直接击败敌法者。

这是一条对抗路线，不是万能克制标签。

---

# 9. 与其他 Theme Expansion 的 Ownership

核心原则：

> **《战斗魔法》拥有战斗化方法；领域 Theme 拥有领域深度。**

## 9.1 元素

本包可以有：

> 火焰弹式基础战斗应用、未来兼容“炎刃”等 Combat Variant / Spell。

元素 Theme 才拥有：

- 高阶火焰塑形；
- 环境元素操纵；
- 大型元素场；
- 深层元素相互作用。

## 9.2 空间

本包的“瞬步”是：

> 魔法强化的超短战斗步法，不是空间传送。

真正：

- 瞬移；
- 空间门；
- 空间锚；
- 位面移动；

属于空间 Theme。

## 9.3 心灵

本包可以：

> 造成感知扰动、战斗威压、战术欺骗。

真正：

- 读心；
- 记忆改写；
- 深度精神控制；

属于心灵 Theme。

## 9.4 灵魂

本包不自行建立灵魂攻击体系。

若未来灵魂 Theme 提供 Combat Spell：

> 它仍可以带 `combat` Tag，并通过本包 Martial Coupling 使用。

## 9.5 组合原则

未来 Theme 可以向 Combat Style 贡献新 Spell。

例如：

```text
战斗魔法
+
元素魔法
→ 元素魔剑士路线更丰富
```

但两个包仍分别拥有自己的 Canonical Spell Definition。

---

# 10. 战斗魔法的纵向等级

本包允许：

- 基础；
- 正式；
- 高阶；
- 大师；
- **传说**。

“传说”不再由独立《传说魔法》Expansion 接管。

本包直接消费：

> `EP-MAGIC-CORE｜魔法基础` 的 Legendary Contract。

## 10.1 什么样的传奇能力仍属于战斗魔法

必须满足两个条件：

1. 它确实跨越普通 Combat Spell 无法线性复制的 Legendary Boundary；
2. 它的核心问题仍然是：
   > **怎样在个人 / 小队直接交战中改变战斗方式。**

例如：

- 把局部战场的施法条件整体改造成高度敌对的反制环境；
- 把一个人的多套 Combat Spell 统合成短时自维持战斗体系。

这仍属于战斗 Theme。

## 10.2 什么不属于战斗魔法

如果“传奇”只是借战斗场景出现，但真正能力核心是：

- 跨位面传送；
- 深层心智控制；
- 文明尺度预言；
- 巨型元素天灾；
- 灵魂存在层操作；

则仍应由对应领域 Theme 拥有。

## 10.3 战斗 / 战争边界继续成立

传奇 Combat Spell 可以极强。

但如果其核心已经变成：

> 军团组织、战役级火力配置、国家战略施法工程

则应进入未来战争魔法 / 战争机制，而不是因为 Grade 高就吞并尺度 Owner。

---

# 11. State / Resource 语义

## 11.1 不新增长期资源

本包不建立：

- Combat Mana；
- Rage；
- Technique Point；
- Anti-Magic Charge。

继续消费：

- Magic Aptitude；
- Spell Mastery；
- Casting Load；
- Magic Strain；
- EP-CHAR-CORE Capability。

## 11.2 短期 Effect Instance

某些 Spell 可以生成：

- 猎印；
- 禁制印；
- 牵足结构；
- 抑术场；
- 武器短时强化；

等 Spell Effect Instance。

它们属于 Game State。

不回写 Expansion Definition。

---

# 12. 玩法循环

## 12.1 普通战斗魔法

```text
观察战况
↓
选择武技 / Spell
↓
决定是否 Martial Coupling
↓
Runtime 检查 Requirements
↓
武技 Outcome
↓
Spell Outcome
↓
Casting Load / Strain
↓
战场正式变化
```

## 12.2 敌法者

```text
发现施法者
↓
识别 / 追迹
↓
逼迫距离或守住队友
↓
观察施法窗口
↓
截咒 / 断法 / 破障 / 抑术
↓
迫使对方提高 Load / Strain
↓
对方调整施法策略
↓
敌法者继续追击或保护
```

核心体验不是：

> “按下禁魔键。”

而是：

> **围绕施法窗口、距离、Focus、Barrier、Strain 和反制时机进行战斗博弈。**

---

# 13. Action 语义

本包提供的结构化 Action 路径可以包括：

- Cast Combat Spell；
- Prime Coupled Spell；
- Couple to Martial Action；
- Reaction Counter；
- Dispel Combat Effect；
- Protect Ally from Spell；
- Apply Combat Mark；
- Maintain Suppression Field。

Action Definition 不是玩家行为白名单。

玩家仍然可以自由尝试：

- 打掉法杖；
- 抢走法器；
- 扑倒施法者；
- 用泥巴遮住视线；
- 威胁敌人停止施法；
- 用普通弓箭射击施法者。

这些不因为“没有 Combat Spell Action”而被禁止。

---

# 14. Resolution 语义

通用 Combat Resolution 由 `EP-COMBAT-CORE` 定义。

```text
Combat Attempt
→ Combat Core Resolution
→ Martial Outcome / Combat Consequence
→ Spell Coupling Trigger
→ Magic Core Spell Resolution
→ Runtime Composite Formal Outcome
```

## 14.1 断法斩

先由 Combat Core 判定接近、近战攻击、effective_contact 与 Reaction / Interruption Trigger；然后 Combat Magic 检查 CBT-040 Coupling；最后 Magic Core 处理 Countermagic。任何一层都不能替上一层制造成功。
---

# 15. Information Boundary

敌法者很依赖信息，但不得获得后台全知。

## 15.1 可以获得

通过：

- 识式瞬读；
- 魔法感知；
- 亲眼观察；
- 训练；
- 情报；

获得：

- Spell 大体领域；
- 是否正在准备；
- 是否使用 Focus；
- 屏障是否存在；
- 某些明显弱点。

## 15.2 不自动获得

- 对手全部 Spell List；
- 精确 Spell Mastery；
- 隐藏 Magic Strain 数值；
- 未知传奇 Spell 完整结构；
- 对手计划；
- 神术后台秘密。

---

# 16. UI Contribution

推荐 UI：

- Spell Library 增加 `combat` 过滤；
- Combat Style Profile 推荐组合；
- 当前可合法 Coupling 的 Spell 提示；
- Reaction Spell 在真实反应窗口出现可选提示；
- 敌法者面板可显示**玩家角色已经知道**的：
  - 对手正在施法；
  - 已识别领域；
  - 已知 Focus；
  - 已知持续 Spell；
  - 可尝试反制方式。

UI 不得：

- 直接泄露隐藏 Spell；
- 显示“100% 可断法”；
- 用 disabled 按钮限制自由输入；
- 自动替玩家选择最佳反制。

---

# 17. Host / asset-spec Requirement

## 17.1 关键 G9 需求：Cross-Action Coupling

未来 Runtime / asset-spec vNext 需要安全表达：

> 一个 Spell Effect 的成立条件可以消费另一正式 Action Outcome。

例如：

```text
Martial Attack Outcome = Effective Contact
→ 允许继续 Resolve 断法斩
```

Creator 不应通过任意脚本实现。

## 17.2 Reaction Window

需要声明式表达：

- 哪类事件可以贡献 Reaction Trigger；真正的 Reaction Window 是否成立由 Combat Core + Runtime 判定；
- 谁拥有相关知识；
- 哪些 Reaction Spell 可以提出 Intent；
- Runtime 仍拥有最终时序与 Outcome。

## 17.3 Effect Interaction

需要安全表达：

- Barrier；
- Maintained Spell；
- Focus；
- Casting Process；
- Magic Strain；

作为可交互对象 / 安全输入。

当前只登记语义需求，不自造正式 entityKind。

---

# 18. 依赖、兼容、冲突与降级

## Hard Dependency

- `EP-CHAR-CORE｜人物能力与技艺`
- `EP-MAGIC-CORE｜魔法基础`
- `EP-COMBAT-CORE｜战斗核心`

## Optional Integration / Handoff

- 元素 Theme；
- 空间 Theme；
- 心灵 Theme；
- 灵魂 Theme；
- 神术与信仰。

## 神术交互

所有敌法者 anti-magic Spell 必须读取：

> `EP-DIVINE-CORE｜神术与信仰 v0.2.1` 的 Divine Interaction Profile。

因此：

- `open`：可以正常进入反制 Resolution；
- `resistant`：可以干扰 / 削弱，但有额外神性稳定性；
- `authority_bound`：可以干扰 mortal channel / visible effect，但不能删除 Covenant 或 Authorization；
- `sovereign`：普通敌法者不拥有取消神权主权的默认权限；
- `Miracle`：不默认作为普通 Spell Effect 被驱散。

敌法者仍可以尝试。

但 Capability / Effect 权限必须真实裁定。

---

# 19. Combat Style Bootstrap 建议

Character Card 可以声明角色开局：

- 掌握哪些 Combat Spell；
- 战斗施法 Skill；
- 近战兵器 / 远程兵器等 Combat Core Skill；
- 一种常见 Style 倾向；
- 训练来源。

但 Style 不是强制标签。

例如角色完全可以：

> 同时学习魔剑士与敌法者 Spell。

游戏中进一步学会新 Spell：

> 属于 Game Instance。

---

# 20. 标准 Combat Spell Library｜52 个

本 Library 自身足以支持：

- 魔剑士；
- 魔弓手；
- 魔猎者；
- 影行者；
- 敌法者；

的第一阶段完整可玩构筑，并通过 2 个 Legendary Spell 验证该 Theme 的纵向能力上限。

## 20.1 武器强化

### CBT-001｜锐锋术

- **类别**：武器强化
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：短时间强化武器有效刃口、尖端或打击面的魔法稳定性，使其更可靠地发挥既有武器性能。
- **Target**：weapon
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, weapon_channel`
- **边界**：不把普通武器变成无视一切防御的神兵；真实破坏仍由武器、使用者与目标共同裁定。

### CBT-002｜重势术

- **类别**：武器强化
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：让一次或一小段连续武器动作更容易把已有动量转化为冲击与压制。
- **Target**：weapon
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, weapon_channel`
- **边界**：不提供自动命中；轻武器也不会无条件获得攻城锤级冲击。

### CBT-003｜稳刃术

- **类别**：武器强化
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：降低高速挥击、碰撞与复杂步法对武器姿态造成的扰动，使连续战斗动作更稳定。
- **Target**：weapon
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, weapon_channel`
- **边界**：提升稳定性而非自动修正错误武技。

### CBT-004｜守势附着

- **类别**：武器强化
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：让武器或盾牌在短时间内更适合承接魔法冲击与非实体攻击结构。
- **Target**：weapon_or_shield
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, weapon_channel, protection`
- **边界**：只提供合法防御交互，不保证能够格挡任何 Spell。

### CBT-005｜破甲纹

- **类别**：武器强化
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在武器上形成短暂破坏性术纹，使有效命中更容易把力量集中到护甲、硬壳或结构弱点。
- **Target**：weapon
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, weapon_channel, armor_break`
- **边界**：需要真实命中与合适接触；不自动忽略护甲。

### CBT-006｜回势印

- **类别**：武器强化
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：把一次成功防守、格挡或卸力后的部分魔法结构保留到下一次近距离反击中。
- **Target**：weapon
- **Range**：接触
- **Duration**：触发式
- **Tags**：`combat, weapon_channel, reaction`
- **边界**：必须先出现合法的防守事件；不能凭空储存无限力量。

## 20.8 近战武技耦合

### CBT-007｜震荡斩

- **类别**：近战耦合
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：把一次近战命中的冲击以短促魔法震荡扩展，使目标更容易失去平衡或被迫后退。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, martial_coupling, force`
- **边界**：武器攻击是否命中仍由 Martial Action Resolution 决定。

### CBT-008｜破盾击

- **类别**：近战耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：把一次打击专门耦合到盾牌、格挡结构或防护姿态，强化对防御结构的破坏与扰动。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, martial_coupling, breaker`
- **边界**：不是针对所有魔法屏障；魔法屏障专项处理见敌法者反制分支。

### CBT-009｜牵制刺

- **类别**：近战耦合
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：有效命中后形成短暂牵制力，使目标立即大幅位移或转身更困难。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：短暂
- **Tags**：`combat, martial_coupling, control`
- **边界**：限制而非完全定身。

### CBT-010｜断步击

- **类别**：近战耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：把一次腿部、武器或身体接触攻击转化为短促的动作干扰，破坏目标当前步法连续性。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：短暂
- **Tags**：`combat, martial_coupling, control`
- **边界**：不自动造成肢体伤残。

### CBT-011｜回击术印

- **类别**：近战耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在成功招架、闪避或格挡后的短反应窗口中，为紧接的反击提供法术耦合。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：触发式
- **Tags**：`combat, martial_coupling, reaction`
- **边界**：必须存在正式防守 Outcome 与合法反击窗口。

### CBT-012｜跃袭印

- **类别**：近战耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：将冲刺、跳跃或下落中的动量与一次近战攻击耦合，提高突入动作的爆发性。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, martial_coupling, movement`
- **边界**：不能替代跳跃、落点和命中本身的正式裁定。

## 20.15 远程与投射武器

### CBT-013｜贯劲矢

- **类别**：远程耦合
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：把箭、弩矢、投枪或类似投射物的冲击更集中地作用于命中点。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, projectile_channel, martial_coupling`
- **边界**：不自动命中，也不无条件穿透重甲。

### CBT-014｜爆震矢

- **类别**：远程耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：投射物命中或达到预设触发位置时产生短促震荡，扰乱小范围站位。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, projectile_channel, force, area`
- **边界**：属于冲击性战斗术式，不承担完整元素爆炸体系。

### CBT-015｜追迹矢

- **类别**：远程耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：让已经发射的投射物在有限范围内根据已知目标运动进行小幅轨迹修正。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, projectile_channel, guidance`
- **边界**：只能有限修正，不是自动必中或穿墙追踪。

### CBT-016｜静音矢

- **类别**：远程耦合
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：显著削弱投射物飞行和普通撞击产生的声音，便于隐蔽射击。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, projectile_channel, stealth`
- **边界**：不隐藏可见轨迹、伤害结果或全部魔法痕迹。

### CBT-017｜钉足矢

- **类别**：远程耦合
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：投射物有效命中后形成短暂牵制结构，使目标移动更困难。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：短暂
- **Tags**：`combat, projectile_channel, control`
- **边界**：不自动完全束缚，目标可挣脱、破坏或接受协助。

### CBT-018｜破障矢

- **类别**：远程耦合
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：将投射物攻击专门调谐为对魔法屏障与持续防护结构的破坏性冲击。
- **Target**：projectile_attack
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, projectile_channel, anti_magic, breaker`
- **边界**：依赖 Core Countermagic 交互；不保证一箭击破任何高阶结界。

## 20.22 战斗机动

### CBT-019｜瞬步

- **类别**：战斗机动
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：以魔法强化一次极短距离爆发步法，使施术者更快完成突进、侧移或脱离。
- **Target**：self
- **Range**：自身
- **Duration**：瞬时
- **Tags**：`combat, movement, combat`
- **边界**：不是空间传送；仍需存在可通过的现实路径。

### CBT-020｜踏壁术

- **类别**：战斗机动
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：在极短时间内强化脚步与接触稳定，使施术者能借墙面、树干或斜面完成一次战斗步法。
- **Target**：self
- **Range**：自身
- **Duration**：短暂
- **Tags**：`combat, movement, combat`
- **边界**：不提供持续壁行。

### CBT-021｜猎跃术

- **类别**：战斗机动
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：强化一次跳跃、跨越或扑击，使战斗者能更可靠地越过障碍、沟壑或敌阵缝隙。
- **Target**：self
- **Range**：自身
- **Duration**：瞬时
- **Tags**：`combat, movement, combat`
- **边界**：不能忽略落点、空间和真实身体承受。

### CBT-022｜轻甲步

- **类别**：战斗机动
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：短时间降低装备对步法节奏的干扰，使中重装备使用者更容易保持战斗移动。
- **Target**：self
- **Range**：自身
- **Duration**：定时
- **Tags**：`combat, movement, support`
- **边界**：不改变装备真实重量到可忽略程度，也不提供飞行。

### CBT-023｜紧急脱离

- **类别**：战斗机动
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在遭受近身压迫、包夹或明显危险时快速完成一次受控后撤或侧撤。
- **Target**：self
- **Range**：自身
- **Duration**：瞬时
- **Tags**：`combat, movement, reaction`
- **边界**：需要真实可行的脱离方向；不能穿过封闭障碍。

### CBT-024｜蓄势冲锋

- **类别**：战斗机动
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：在短暂准备后把连续步法、身体姿态和魔法强化统一到一次高强度突入行动。
- **Target**：self
- **Range**：自身
- **Duration**：短暂
- **Tags**：`combat, movement, martial_coupling`
- **边界**：不自动撞开所有目标；Outcome 仍取决于体魄、地形、目标与防御。

## 20.29 防御与反应

### CBT-025｜刃前屏障

- **类别**：战斗防御
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：在武器、盾牌或前臂防线前形成贴近身体的短暂定向屏障。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, protection, barrier, combat`
- **边界**：覆盖范围窄，强调战斗姿态而非全向防护。

### CBT-026｜偏斥术

- **类别**：战斗防御
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在反应窗口中对接近的投射物或冲击施加短促偏转力。
- **Target**：incoming_effect
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, protection, reaction`
- **边界**：偏转而非无条件消除；高速或大质量攻击可能只被削弱。

### CBT-027｜受击缓冲

- **类别**：战斗防御
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：在即将承受冲击时提供短促缓冲，降低部分动量直接传递。
- **Target**：self_or_ally
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, protection, reaction`
- **边界**：不能代替 `EP-HEALTH-CORE｜身体状态核心`，也不保证无伤；若形成真实身体影响，必须经 Health Handoff 生成 Condition / HP。

### CBT-028｜临时魔甲

- **类别**：战斗防御
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在装备或身体表面形成短时附着式防护层，增强对常见物理与魔法冲击的承受。
- **Target**：creature
- **Range**：接触
- **Duration**：定时
- **Tags**：`combat, protection, armor`
- **边界**：不是真正永久附魔，也不由本包制造装备。

### CBT-029｜反冲护印

- **类别**：战斗防御
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：当贴身防护成功承接明显冲击时，向攻击方向释放一次有限反冲。
- **Target**：self
- **Range**：自身
- **Duration**：触发式
- **Tags**：`combat, protection, reaction, force`
- **边界**：只有在防护实际承接攻击后才可触发。

### CBT-030｜同伴遮护

- **类别**：战斗防御
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：在短时间内把施术者的防守动作与邻近同伴的防护需求耦合，为其提供定向遮护。
- **Target**：ally
- **Range**：近距
- **Duration**：维持
- **Tags**：`combat, protection, cooperative`
- **边界**：不替同伴自动闪避，也不使施术者免于承担位置与风险。

## 20.36 狩猎、潜行与控制

### CBT-031｜猎印

- **类别**：狩猎与追踪
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：对已经可靠识别的目标留下短期魔法标记，帮助施术者在复杂环境中维持追踪。
- **Target**：creature
- **Range**：近距
- **Duration**：定时
- **Tags**：`combat, hunter, mark, tracking`
- **边界**：不能跨越任意距离或位面；必须先合法接触或锁定目标。

### CBT-032｜战场锐感

- **类别**：狩猎与追踪
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在短时间内提高对高速运动、伏击迹象、攻击前兆与战场异常的主动感知。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, perception, combat`
- **边界**：不是预知未来；仍受视线、知识与信息边界限制。

### CBT-033｜静步术

- **类别**：潜行
- **等级**：基础
- **Casting Load**：常规
- **核心效果**：削弱施术者正常移动产生的脚步、衣甲摩擦与细小碰撞声。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, stealth, sound`
- **边界**：不提供不可见，也不消除所有环境痕迹。

### CBT-034｜魔痕收束

- **类别**：潜行
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：降低施术者正在维持的低强度战斗法术向环境泄漏的明显魔法痕迹。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, stealth, magic_signature`
- **边界**：不能让大型施法、过载或传奇效应完全不可检测。

### CBT-035｜轮廓扰动

- **类别**：潜行
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：使施术者的外轮廓与局部动作更难被快速视觉锁定，适合移动中的短时隐蔽。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, stealth, perception_interference`
- **边界**：不是完全隐身，也不修改记忆或思想。

### CBT-036｜牵足符

- **类别**：狩猎与控制
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在小范围地面或路径设置短时触发式牵制结构，对快速通过者造成行动干扰。
- **Target**：area
- **Range**：接触
- **Duration**：触发式
- **Tags**：`combat, hunter, control, trap`
- **边界**：属于短时战斗陷阱，不承担永久符文工程。

## 20.43 反制魔法｜敌法者核心

### CBT-037｜识式瞬读

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：把 Core 的术式辨识压缩成战斗化短式，用于在极短窗口判断正在形成 Spell 的大体领域、释放方向与关键结构。
- **Target**：casting_process
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, countermagic, perception`
- **边界**：得到的是战斗所需的有限信息，不自动读取完整 Spell Definition。

### CBT-038｜施法追迹

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：持续观察一个已识别施法者的魔法节奏与姿态，使敌法者更容易捕捉下一次明显施法窗口。
- **Target**：creature
- **Range**：可视
- **Duration**：维持
- **Tags**：`combat, anti_caster, tracking`
- **边界**：不是预知；目标可以改变节奏、隐藏动作或制造假动作。

### CBT-039｜截咒

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：在敌对 Spell 尚未完成的短窗口中发动快速结构干扰，尝试使其失败、延迟或迫使施法者承担更高失衡。
- **Target**：casting_process
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, countermagic, reaction`
- **边界**：依赖 Core Countermagic；不是无条件取消。

### CBT-040｜断法斩

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：将一次近战攻击与反制结构耦合；若攻击有效接触正在施法或维持 Spell 的目标，可尝试同时破坏其施法连续性。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, martial_coupling, countermagic`
- **边界**：先有真实命中 / 接触，才有后续反制；不自动伤害并沉默施法者。

### CBT-041｜破障击

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：把近战攻击专门调谐为对屏障、护盾、魔法甲与可驱散防护结构的破坏性冲击。
- **Target**：martial_attack
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, martial_coupling, breaker`
- **边界**：依赖目标防护的 Dispel / Counter Profile；不能一击无视所有结界。

### CBT-042｜驱附术

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：针对武器、装备或身体表面的临时 Spell Effect 进行快速战斗驱散。
- **Target**：spell_effect
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, dispel`
- **边界**：只处理可进入通用 Dispel 框架的效果；永久魔具属性不属于此处。

### CBT-043｜焦点扰乱

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：对已识别的施法 Focus、法器操作或施法媒介施加短时干扰，使依赖该 Focus 的施法更难稳定。
- **Target**：focus_or_caster
- **Range**：近距
- **Duration**：短暂
- **Tags**：`combat, anti_caster, disruption`
- **边界**：不自动摧毁装备；真实破坏需要对应行动与 Outcome。

### CBT-044｜术式钉

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：在已识别持续 Spell 的局部结构上建立短时干扰锚，使其更难移动、扩展或重新塑形。
- **Target**：spell_effect
- **Range**：近距
- **Duration**：定时
- **Tags**：`combat, anti_caster, suppression`
- **边界**：只限制被成功锁定的具体结构，不形成万能禁魔。

### CBT-045｜失衡针

- **类别**：反制魔法
- **等级**：正式
- **Casting Load**：较重
- **核心效果**：向施法者投射高度针对魔法运转的短促干扰；若成立，会提高其当前 Magic Strain 或使下一次高负荷施法更危险。
- **Target**：creature
- **Range**：可视
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, disruption, projectile`
- **边界**：不造成 Mana 损失，也不能永久降低 Magic Aptitude。

### CBT-046｜禁制印

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：对已充分观察的目标建立短时压制标记，使其某一类明显施法动作在持续期间承担更高 Casting Load。
- **Target**：creature
- **Range**：近距
- **Duration**：定时
- **Tags**：`combat, anti_caster, suppression, mark`
- **边界**：不能一次封禁目标全部魔法；需要识别、接入与正式 Resolution。

### CBT-047｜反制护卫

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：敌法者在邻近同伴遭受已识别 Spell 作用的反应窗口中，尝试把自己的 Countermagic 插入目标与 Spell 之间。
- **Target**：ally_and_spell
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, protection, reaction`
- **边界**：可以削弱、打断或失败；不能替队友自动免疫所有法术。

### CBT-048｜消散波

- **类别**：反制魔法
- **等级**：高阶
- **Casting Load**：沉重
- **核心效果**：释放短距扩散式反制脉冲，对周围多个低至中等强度、可驱散的持续 Spell Effect 进行统一干扰。
- **Target**：area
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, dispel, area`
- **边界**：敌我效果都可能受影响；不智能选择未知隐藏效果。

### CBT-049｜抑术场

- **类别**：反制魔法
- **等级**：大师
- **Casting Load**：极限
- **核心效果**：在有限范围维持高强度魔法干扰，使区域内法术型施法普遍承担更高 Casting Load、维持更困难。
- **Target**：area
- **Range**：近距
- **Duration**：维持
- **Tags**：`combat, anti_caster, suppression, field`
- **边界**：同样影响友军和敌法者本人；不等于彻底关闭魔法，不自动影响神术等平行体系。

### CBT-050｜零式封断

- **类别**：反制魔法
- **等级**：大师
- **Casting Load**：极限
- **核心效果**：在极短反应窗口内集中全部控制建立一次局部“空窗”，尝试切断一个正在形成或刚完成、且能够被反制的 Spell 结构。
- **Target**：casting_process_or_spell
- **Range**：近距
- **Duration**：瞬时
- **Tags**：`combat, anti_caster, countermagic, reaction, master`
- **边界**：这是极高要求的单次反制，不是长期禁魔领域；失败会造成显著 Magic Strain 与反噬风险。


---


## 20.8 传说级战斗魔法

> [!important] 当前 Theme Legendary Completeness
> 本版提供 2 个传说级 Combat Spell，用于验证《魔法基础》Legendary Contract 在战斗 Theme 中的实际表达。
>
> 它们分别证明：
>
> - 传奇不一定只是“伤害更高”；
> - 传奇可以通过**局部法则例外**与**系统统合**产生质变；
> - 传奇也不一定影响整座城市，其中一个甚至只作用于施术者本人。

### CBT-051｜万法折锋·敌法战域

- **类别**：反制魔法 / 敌法者传奇
- **等级**：**传说**
- **Casting Load**：极限
- **传奇边界**：Local Law Exception + System Boundary
- **核心效果**：以施术者为移动核心，在有限直接交战区域建立高度不利于稳定 Spell Casting 的“敌法战域”。战域不会关闭魔法，而是让区域中的法术结构更容易暴露、维持更困难、被战斗化 Countermagic 捕捉，并显著放大连续强行施法产生的 Magic Strain 风险。
- **Target**：area centered on self
- **Range**：自身 / 近距战斗域
- **Duration**：维持
- **Tags**：`combat, legendary, anti_caster, countermagic, suppression, field, local_law_exception`
- **Knowledge Availability**：受控传承 / 私人秘传常见；具体由 World Pack 决定
- **典型学习前提**：
  - 敌法者方向长期实战经历；
  - 战斗施法达到极高水平；
  - 深度掌握多种 Countermagic Combat Spell；
  - 能理解 Casting Process、Barrier、Focus 与 Magic Strain 的战斗交互。
- **特殊要求**：
  - Personal Legendary Casting；
  - 施术者必须持续维持战域；
  - 极高 Magic Strain 风险。
- **核心不变量**：
  - 不自动取消区域内 Spell；
  - 不让敌法者获得后台 Spell List；
  - 友军法术同样受战域影响；
  - 施术者自己的法术型魔法也处于高干扰环境，只因训练更适合在其中行动；
  - 不自动影响神术等平行体系，除非对应 Owner 提供正式 Interaction。
- **为什么不是大师级简单放大**：
  > 普通抑术 Spell 只对某个目标、效果或小范围施加干扰；本术改变的是**局部战斗空间中所有法术型施法共同遵守的环境条件**，使“反制窗口更容易出现”成为整个区域的暂时规则。
- **失败 / Backlash**：
  - 战域无法稳定形成；
  - 施术者自身 Magic Strain 急剧上升；
  - 领域出现不均匀干扰，使敌我双方 Spell Interaction 更难预测；
  - 维持崩溃后产生短时反制能力真空。
- **玩家价值**：
  > 让顶级敌法者真正拥有与高阶、多领域施法者正面对抗的传奇资本，但仍通过时机、距离、训练和自我负荷取得优势，而不是获得“禁魔 GM 权限”。

### CBT-052｜百式归一

- **类别**：武技—法术耦合传奇
- **等级**：**传说**
- **Casting Load**：极限
- **传奇边界**：Persistence / System Boundary
- **核心效果**：施术者把自己已经深度掌握的一组 Combat Spell 暂时编织成一个统一、自洽的“战斗术式体系”。在持续期间，预先声明的合法 Martial Trigger 可以直接唤起对应 Combat Spell 的准备态，使移动、攻击、防御、反制与武器附着之间不再需要每次重新从零构筑完整术式。
- **Target**：self
- **Range**：自身
- **Duration**：维持
- **Tags**：`combat, legendary, martial_coupling, self, integrated_spell_system`
- **Knowledge Availability**：私人秘传 / 唯一传承 / 高阶机构受控传承常见；具体由 World Pack 决定
- **典型学习前提**：
  - 对多种 Combat Spell 达到深度掌握；
  - 极高战斗施法与术式控制；
  - 长期形成稳定个人战斗风格；
  - 能在高压环境中同时维持多个术式关系而不混淆 Trigger。
- **特殊要求**：
  - Personal Legendary Casting；
  - 启动前必须声明本次统合的 Spell 集合与合法 Trigger；
  - 只允许统合施术者已经真正掌握的 Combat Spell。
- **核心不变量**：
  - 不赋予未学习 Spell；
  - 不自动替玩家选择攻击、防御、移动或反制；
  - 不自动命中；
  - 每个被触发的 Spell 仍进入 Runtime Resolution；
  - 每个效果仍产生对应 Casting Load / Magic Strain；
  - 不创造额外时间，也不允许一个瞬间无限触发。
- **为什么不是大师级简单加速**：
  > 普通快速施法优化的是“一个 Spell 怎样更快”；本术把**多个独立 Combat Spell 的施法关系临时统合成一个自维持系统**，改变了施术者组织战斗魔法的方式本身。
- **失败 / Backlash**：
  - Trigger 串扰；
  - 统合结构崩溃；
  - 某些 Combat Spell 被错误 Prime 后只能取消并承担 Strain；
  - 严重失败时短时间难以重新组织高复杂度战斗法术。
- **玩家价值**：
  > 证明传奇战斗魔法不仅可以表现为“更大破坏力”，也可以表现为一个顶级战斗者把多年训练真正统合成凡俗魔法无法线性复制的个人战斗系统。


---

# 21. 敌法者的战略价值

敌法者承担三个重要生态功能。

## 21.1 防止 Spell User 垄断战斗解释权

高阶法师可以非常强。

但：

> 强 ≠ 没有针对路线。

敌法者让：

- 战士；
- 射手；
-猎人；
- 潜行者；

通过主动学习魔法建立自己的 anti-caster 生态位。

## 21.2 让复杂 Spell 的优势与代价都真实

复杂、高负荷、高维持要求的 Spell：

> 可以更强。

但也意味着：

> 更容易形成可以被敌法者识别、追猎、压迫和破坏的战斗窗口。

这不是隐藏 Nerf。

而是公开的系统性交互。

## 21.3 让战斗魔法拥有独立竞争力

如果《战斗魔法》只有：

> 刀上加火、箭上加冰。

它最终只是其他 Theme 的简化合集。

加入深度反制体系后，本包拥有其他 Theme 无法取代的核心价值：

> **把“如何与施法者战斗”本身变成一整个魔法领域。**

---

# 22. “敌法者克法师”不是属性相克

不得建立：

```text
EnemyMage > Mage
```

敌法者真正优势来自：

- 训练目标明确；
- Reaction Spell；
- 近身压力；
- Countermagic Mastery；
- 反制工具丰富；
- 对施法节奏的专门理解。

法师可以通过：

- 距离；
- 预设法术；
- 隐蔽施法；
- 多层防护；
- 诱导 Counter；
- 更高 Mastery；
- 队友保护；

对抗敌法者。

双方关系应该是：

> **可博弈的能力体系。**

---

# 23. 与《战争魔法》的未来边界

原资产族曾列出“战争魔法”候选。

本包完成后必须区分：

## 战斗魔法

尺度：

> 个人 / 小队 / 直接交战。

核心：

- 武器；
- 射击；
- 移动；
- 反应；
- 敌法；
- 个人战斗 Style。

## 战争魔法

若未来生产，尺度应是：

> 军队 / 战场 / 战役 / 战略组织。

可能负责：

- 大型军阵施法；
- 战场通讯；
- 军团级防护；
- 魔法炮击组织；
- 反战略施法；
- 战争魔法后勤。

因此：

> “战争魔法”不能重复本包的个人战斗 Spell Library。

---

# 24. Creator Authorability Summary

## 24.1 Creator Primitives Required

复用《魔法基础》：

- Spell Definition；
- Tag；
- Requirement；
- Casting Modifier；
- Resolution Modifier；
- Interaction Rule；
- UI Contribution。

本包额外真实需要：

- Martial Coupling；
- Reaction Trigger Contribution / Consume Combat Core Reaction Window；
- Consume Martial Outcome；
- Spell Effect Targeting；
- Focus / Barrier / Casting Process 安全交互。

## 24.2 asset-spec vNext Requirements

需要未来正式表达：

- 一个 Definition 安全引用另一个 Expansion 提供的 Outcome 类型；
- `on_effective_contact` 一类声明式触发语义；
- Reaction Trigger Contribution 与 Combat Core Reaction Window 引用；
- Effect Interaction Target；
- Provider → Consumer 依赖；
- Optional Integration；
- Optional Integration 缺少 Provider 时的安全降级语义；Hard Dependency 缺失时必须拒绝启用，不得降级成第二套 Combat System。

## 24.3 Runtime / UI Host Requirements

Runtime 负责：

- 武器攻击 / 射击 Outcome；
- 距离与接触；
- Reaction 时序；
- Countermagic Resolution；
- Barrier / Focus / Casting Process Interaction；
- Magic Strain 正式变化；
- State Commit；
- Save / Restore。

UI Host 负责：

- 玩家安全 Reaction 提示；
- Coupling 状态；
- Player-known Spell 信息。

## 24.4 Unresolved Declarative Gaps

当前最大 G9 需求：

> **跨 Action Outcome 的声明式 Martial Coupling。**

这不能用任意脚本解决。

因此当前 Creator Authorability：

> **PASS WITH G9 REQUIREMENT / WARN**

Owner 清楚，没有要求 Creator 越权执行 Runtime。

---

# 25. 机制测试场景

## TS-01｜魔剑士正常耦合成功

角色掌握震荡斩并有效命中。

期待：

- 先确定命中；
- 再 Resolve Spell；
- 不反向用 Spell 保证命中。

## TS-02｜魔剑士挥空

角色使用断法斩但攻击未接触施法者。

期待：

- 不产生断法 Outcome；
- Spell Intent / Load 按实际规则处理；
- 不自动命中。

## TS-03｜魔弓手追迹矢

箭已发射，目标突然变向。

期待：

- 只允许有限轨迹修正；
- 不自动必中。

## TS-04｜未掌握战斗魔法的战士尝试

战士模仿锐锋术。

期待：

- Attempt 允许；
- 按 Spell Access / Mastery 裁定；
- 不因为“战士身份”拒绝输入。

## TS-05｜法师学习战斗魔法

学院法师学习瞬步。

期待：

- 无职业阻止；
- 真实技能与 Mastery 生效。

## TS-06｜敌法者截咒成功

敌法者识别施法窗口并使用截咒。

期待：

- 进入 Core Countermagic；
- 可能中断 / 延迟 / 增加 Strain；
- 不硬编码 100% 取消。

## TS-07｜敌法者误判 Spell

敌法者误认施法结构。

期待：

- 可以提出错误 Counter；
- 不自动获得后台真相；
- 产生时间 / Strain / 战术代价。

## TS-08｜抑术场

敌法者展开抑术场。

期待：

- 友军法术也受影响；
- 自身施法同样变难；
- 不关闭所有魔法。

## TS-09｜敌法者对神术

未安装 / 未定义 Divine Interaction。

期待：

- 不自动驱散神术；
- 按 Optional Integration 缺失处理。

## TS-10｜普通行为反法师

玩家不使用 Spell，直接撞倒施法者。

期待：

- 自由 Attempt 允许；
- 由正常 Martial / World Action 裁定；
- Action 列表不是白名单。

## TS-11｜缺少 Combat Core

Host 试图安装 / 启用 `EP-MAGIC-COMBAT`，但未安装 `EP-COMBAT-CORE`。

期待：

- 依赖检查明确拒绝；
- 不静默降级为第二套战斗规则；
- 不删除 Combat Magic 资产本身。

## TS-12｜Theme 组合

安装元素 Theme 后新增带 `combat` Tag 的高级炎刃 Spell。

期待：

- 元素 Theme 拥有 Spell；
- 本包提供 Martial Coupling；
- 无重复 Owner。

## TS-13｜Save / Restore

角色正在维持抑术场时保存并恢复。

期待：

- Effect Instance 与 Strain 连续；
- 不写回资产 Definition。

## TS-14｜确定不可能的断法

敌法者试图用普通断法斩直接取消一个明确不受此类 Countermagic 作用的世界级效应。

期待：

- Attempt 可以发生；
- 可确定失败；
- 无需为了“给机会”强行 Dice；
- 合理时间与暴露后果仍发生。

---

# 26. Regression Cases

## RC-COMBAT-01｜把战斗魔法做成职业树

错误：

> 只有选择“魔剑士职业”才能使用 Combat Spell。

正确：

> Style 只是推荐组合，任何满足 Spell 学习条件的人都可以学习。

## RC-COMBAT-02｜魔法自动保证武器命中

错误：

> 使用震荡斩就自动命中。

正确：

> 先裁定 Martial Outcome，再决定 Coupled Spell 是否进入 Resolution。

## RC-COMBAT-03｜另造 Battle Mana

错误：

> 战斗魔法拥有独立蓝条。

正确：

> 使用 Core Casting Load / Magic Strain。

## RC-COMBAT-04｜敌法者万能禁魔

错误：

> 敌法者在场，法师不能施法。

正确：

> 敌法者必须通过识别、距离、Reaction、Spell Mastery 与正式 Countermagic 施压。

## RC-COMBAT-05｜敌法者偷读后台

错误：

> 自动显示对手全部 Spell、Mastery 和当前 Strain。

正确：

> 只显示通过观察 / Spell / 情报真正获得的 Character Knowledge。

## RC-COMBAT-06｜战斗魔法吞掉元素 Theme

错误：

> 因为火球用于战斗，所以完整火焰领域都写进本包。

正确：

> 本包拥有战斗化用法；元素 Theme 拥有元素领域深度。

## RC-COMBAT-07｜反制魔法重写 Core Countermagic

错误：

> 本包创建第二套 Dispel / Counter System。

正确：

> 本包只声明 Combat Counter Spell，最终调用 Core Countermagic Grammar。

## RC-COMBAT-08｜敌法者自动反神术

错误：

> 因为法术与神术本体同源，所以所有 anti_magic Spell 自动取消神术。

正确：

> 使用 `EP-DIVINE-CORE v0.2.1` 的 Divine Interaction Profile；普通反魔法只在该 Profile 允许的层级作用。

## RC-COMBAT-09｜Style 变成身份限制

错误：

> 影行者不能学习敌法者 Spell。

正确：

> 玩家可以自由组合，只承担学习成本与真实因果。

## RC-COMBAT-10｜为 Coupling 写任意脚本

错误：

> Creator 允许 JS：`if(hit) dispel(target)`。

正确：

> Cross-Action Coupling 必须成为有限声明式 asset-spec / Runtime 能力。

---

## RC-COMBAT-11｜传奇战斗 Spell 被搬到独立“传奇包”

错误：

> 因为一个 Combat Spell 达到传奇级，所以它不再属于战斗魔法，必须搬去另一个《传说魔法》资产。

正确：

> `传说` 是 Grade；只要 Spell 的核心问题仍是战斗，就继续由《战斗魔法》拥有，并复用《魔法基础》Legendary Contract。

---

## RC-COMBAT-12｜传奇 = 更大伤害

错误：

> 战斗 Theme 的 Legendary Spell 只能设计成更大的斩击、更大的爆炸。

正确：

> 传奇战斗能力可以通过局部施法规则改变、多术式统合、极端机动、战略级单体反制等方式发生质变，不要求纯伤害放大。

---

# 27. 越界内容与交接建议

| 内容 | 推荐 Owner | 当前需要的最小接口 | 关系 |
|---|---|---|---|
| 武器攻击正式命中 / 格挡 | Runtime / EP-COMBAT-CORE | Martial Outcome | Hard Dependency / CLOSED |
| 永久魔剑制作 | 魔法工艺与魔具 | Weapon / Focus Definition | Optional Integration |
| 高阶元素魔剑 Spell | 元素 Theme | Combat Tag / Martial Coupling | Provider → Consumer / Integration |
| 传奇级空间闪杀 | 空间 Theme | 《魔法基础》Legendary Contract + Combat Integration | Optional Integration |
| 传奇级战斗术式 | 战斗魔法 | 《魔法基础》Legendary Contract + Martial Coupling | 本包自身 Owner |
| 神术反制兼容 | 神术与信仰 v0.2.1 | Divine Interaction Profile | Provider → Consumer |
| 身体持续后果 | EP-HEALTH-CORE v0.1 | Health-relevant Effect / Physical Impact Handoff | Optional Integration / Handoff |
| 军团级战争法术 | 未来战争魔法 | Battlefield / Formation Provider | Separate Owner |

---

# 28. 审核结果

| Gate | 结果 | 说明 | 是否阻塞 |
|---|---|---|---|
| Prior Audit Skill Source | HISTORICAL PASS | v0.2 阶段曾按 tavern-asset v0.5.0 审核；当前 v0.3 受 tavern-asset v0.5.2 约束 | 否 |
| Discussion / Authorization | PASS | 用户完成关键讨论并明确授权 | 否 |
| 资产职责归属 | PASS | Combat / Domain / Core / Divine 边界清楚 | 否 |
| Scope | PASS | 未创建职业树、战斗系统或 Theme 深层领域 | 否 |
| 语义完整性 | PASS | Style、Coupling、Countermagic、52 Spell 完整，其中 2 个 Legendary Spell | 否 |
| World OS Core | PASS | 无职业白名单，无自动命中，无玩家代理权覆盖 | 否 |
| Open Attempt | PASS | 非 Spell 战术尝试仍开放 | 否 |
| Information Boundary | PASS | 敌法者不获得后台全知 | 否 |
| Definition / Instance | PASS | Spell / Style Definition 与 Game State 分离 | 否 |
| 程序与资产安全 | PASS | 无任意代码、无直接 Commit | 否 |
| 跨资产一致性 | PASS | 复用 Magic Core；Theme 不重复 Owner | 否 |
| Reusable Expansion | PASS | 不硬编码埃瑟维亚 | 否 |
| Creator Authorability | WARN | Cross-Action Coupling 需要未来 G9 声明式能力 | 否 |
| Obsidian Markdown | PASS | 独立 `.md` 正式交付 | 否 |
| Creator 准备度 | PASS WITH FUTURE BINDING | 语义可绑定，机器协议待 G9 | 否 |

---

# 28.5 v0.2 修订摘要

本版根据全魔法体系 Legendary Ownership 调整：

- 移除对独立《传说魔法》Expansion 的依赖；
- 直接消费《魔法基础 v0.2》的 Legendary Contract；
- 战斗 Theme 现在可以自行拥有本领域 Legendary Spell；
- 标准 Combat Spell Library 从 50 增至 52；
- 新增 2 个传说级 Combat Spell：
  - `CBT-051｜万法折锋·敌法战域`
  - `CBT-052｜百式归一`
- 两个 Spell 分别验证：
  - 敌法者 / Countermagic 的 Local Law Exception；
  - Martial Coupling 的 System Boundary；
- 继续保持“战斗魔法 ≠ 战争魔法”的尺度边界；
- 新增“传奇不是更大伤害”Regression Case。

---

# 29. 当前资产状态

```text
EP-MAGIC-COMBAT｜战斗魔法
├─ 创作前讨论                    COMPLETE
├─ 敌法者 / 反制魔法追加裁定      COMPLETE
├─ 用户正式创作授权              COMPLETE
├─ Combat Core Hard Binding      COMPLETE
├─ Semantic Candidate v0.3       AUDITED CURRENT
├─ Independent Re-audit          PASS
├─ Creator Binding               PENDING
└─ asset-spec vNext Binding      PENDING
```

---

# 30. 最终冻结语句

> **战斗魔法不是法师魔法的低级版，而是把统一 Spell Grammar 专门优化为武技、装备、移动、反应与实战压力下可用的魔法体系。**
>
> **魔剑士、魔弓手、魔猎者、影行者和敌法者都是开放战斗风格，不是职业锁。**
>
> **反制魔法是本包核心力量之一：敌法者通过战斗化 Countermagic 与其他主题魔法分庭抗礼，但不能获得万能禁魔、后台全知或自动克制。**
>
> **领域 Theme 把某种魔法做深；《战斗魔法》把魔法变成真正的战斗技术。**
>
> **当战斗魔法跨入传奇层级时，它仍由本 Theme 自己拥有；传奇代表纵向质变，不代表资产 Ownership 迁移。**


---

# v0.2.1 Divine Interface Closure

本 patch 不改变 52 个 Combat Spell 的核心定义。

正式关闭“反神术”Handoff：

- 敌法者读取 Divine Interaction Profile；
- 可以干扰 mortal channel / formed effect；
- 不删除 Covenant / Authorization；
- 不默认驱散 Miracle；
- 不越过 Sovereign Divine Authority；
- `RC-COMBAT-08` 从 Future Handoff 转为正式 Integration。


---

# v0.2.2 Core Audit Closure

本 patch 不改变 52 个 Combat Spell。

完成：

- 当前版本 / 标题 / 状态统一；
- Divine Interaction 正式 Provider 更新到 `EP-DIVINE-CORE v0.2`；
- 神职战斗 Profile 与 Combat Style 保持不同 Owner：
  - Divine Practice Profile 组织 Invocation 使用；
  - Combat Style 组织 Spell / Martial Coupling；
- 核心 Ownership / Dependency 总审核：PASS。

---

# v0.3 Combat Core Hard Binding

不改变 52 个 Combat Spell 的 Core Effect。

变化：Combat Core 成为 Hard Dependency；Martial Outcome、Reaction、Combat Range、Weapon/Armor Profile、Stance、Pressure、Tempo 与通用 Coupling Grammar 上移；本包只保留战斗施法、Combat Spell、Magic Combat Practice Profile、Spell-specific Coupling、Countermagic Combat Spell 与 Legendary Combat Spell。

当前：`v0.3 candidate / INTERFACE RE-AUDIT PASS`。


---

# 34. Generic Library / G8 UI Closure｜通用资产库与 UI Host 收口

本资产归类为：

> **Content-bearing Generic Downstream Expansion｜内容型通用下游拓展包**

它可以跨世界复用，但不是所有世界都应安装。

G8 UI 意图：

- 不拥有独立一级 Extension Surface；
- **贡献到 EP-MAGIC-CORE 拥有的“魔法”Surface**；
- 当前 Combat Spell / Practice Profile 可成为该 Surface 的 View / Section；
- 实际战斗施法过程使用 Narrative Contextual Surface；
- Health consequence 仍通过 Health Handoff。

若 Magic Core 不存在，本资产因 Hard Dependency 直接不可启用，不创建 fallback Surface / Spell System。

**通用库独立审核：PASS。**
