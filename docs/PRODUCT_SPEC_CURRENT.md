---
title: The World｜产品与实验总纲
status: current-canonical-product-spec
version: 0.1
updated: 2026-08-23
stage: Stage 0 / Experimental Spike
---

# The World｜产品与实验总纲 CURRENT

## 0. Product Purpose

### Primary Purpose / Job To Be Done

让具备文件读写能力的通用 Agent 能够主持一个长期持续的 AI 世界 / RPG，并用轻量文件结构跨长上下文和跨会话维护世界、剧情与记忆。

### Core Value

在不明显牺牲优秀通用 AI 主持能力的前提下，获得：

- 更稳定的长期连续性；
- 可恢复的世界状态；
- 持续存在的人物、地点、关系与势力；
- 可追踪的重要剧情与未决后果；
- 可控的上下文增长；
- 明确的 Save / Restore 能力。

### Simple Baseline

直接让一个优秀通用 AI 主持长期 RPG，不提供专门的本地工作区或结构化长期记忆。

本项目若在主动性、创意承接、角色表现、场景推进或继续游玩欲望上明显劣于这个基线，则第一阶段失败。

## 1. Target User

第一阶段唯一必须服务好的用户：Project Owner / 实际玩家。

不在 Stage 0 假设大众市场、创作者生态或多人平台需求。

## 2. Product Promise

玩家应得到一个：

- 会主动发生事情的世界；
- NPC 有主动性的世界；
- 玩家可以自由用自然语言行动的世界；
- 重要选择会留下长期后果的世界；
- 跨长会话仍能恢复重要事实的世界；
- 不要求玩家自己维护状态表和记忆文件的世界。

Agent 负责维护工作区；玩家负责玩。

## 3. Core Loop

```text
恢复当前世界现场
↓
Agent 主持 / 世界主动发展
↓
玩家自由回应
↓
形成剧情与 durable consequence
↓
Agent 更新必要 state / story / memory
↓
按需形成 save
↓
下一轮只恢复相关上下文
```

## 4. Non-negotiable Core

以下任一长期失败，都意味着产品核心没有成立：

1. Agent 变得机械、保守，明显不如直接 AI 主持；
2. 世界缺乏主动性，只等待玩家提出剧情；
3. Agent 替玩家做关键决定；
4. 重要人物、承诺、后果在长局中频繁遗忘；
5. state / story / memory 多套事实长期漂移；
6. 玩家需要频繁手工纠正文件，实际变成 QA / 状态管理员；
7. 为维持长期连续性需要每回合加载几乎全部历史。

## 5. Support Capabilities

这些能力重要，但默认服务 Core Value，不是产品目的本身：

- 文件目录约定；
- 状态摘要；
- 长期记忆压缩；
- save / restore；
- deterministic RNG；
- consistency validation；
- schema / format checks；
- launcher / UI；
- future local service。

任何 Support Capability 若显著损害核心主持体验，必须缩窄或重新设计。

## 6. Stage 0 Scope

### Must Have

- 清晰的 repository / game folder ownership；
- 可复用 Source 与 Game-local Reality 分离；
- 第一套 game template；
- 能够创建并长期维护真实游戏；
- 最小状态、剧情、记忆、存档职责；
- 真实连续试玩与失败记录。

### Deferred

- Web UI / Launcher；
- 通用创作工具；
- 自动导入系统；
- 数据库；
- 扩展协议；
- 多 Agent 并发主持；
- 后台异步世界模拟；
- 大规模资产生态。

### Non-scope for First Spike

- 为所有未来场景冻结完整 Schema；
- 提前建设复杂 Runtime；
- 复制 SillyTavern 现有 architecture；
- 用工程测试替代真实游玩结论。

## 7. Domain Semantics

### Source Asset

开始一局前存在、可跨 game 复用的世界、角色、机制、资料。

Owner：`library/`。

### Game-local Canonical State

只属于某一局、会随游戏正式演化的当前世界事实。

Owner：`games/<game-id>/state/`。

### Story Ledger

对重要剧情、节点、承诺、后果和 unresolved hooks 的历史记录。

Owner：`games/<game-id>/story/`。

### Agent Memory

为了高效恢复上下文而生成的压缩 / 索引层。

Owner：`games/<game-id>/memory/`；它不是 current world truth。

### Save

某个明确可恢复的游戏现场。

Owner：`games/<game-id>/saves/`。

## 8. First Reality Gate

TW-01 / TW-02 的重点不是文件数量，而是真实使用。

第一轮至少验证：

- 新局可以直接开始，不要求玩家先设计剧情；
- Agent 能主动引入 NPC、事件和发展；
- 连续多回合后主要人物、关系、地点和承诺仍正确；
- durable change 能落入正确 Owner；
- memory 能减少重复加载历史；
- 玩家不需要频繁提醒 Agent“记得更新文件”；
- 重新打开一局时，Agent 能从工作区恢复现场；
- 与直接 AI 主持相比，核心主持体验不明显更差。

建议在第一条真实纵向成立后尽快进行 20–30 回合长会话实验，但回合数是测试强度，不是产品价值本身。

## 9. Falsification

以下证据会推动架构升级，而不是被解释掉：

- Agent 持续漏写关键 state；
- 多文件传播频繁漂移；
- Save / Restore 手工文件方案不可靠；
- 确定性机制经常被模型错误执行；
- 文件规模导致检索成本显著失控；
- 并发写入或原子性成为真实问题。

出现时遵循：

```text
真实失败
→ 分类
→ 最窄修复
→ 再验证
```

不从一次偶发错误直接推导大型平台化。

## 10. Current Decision

当前只冻结产品实验方向，不宣称最终技术架构已经被证明。

`docs/ARCHITECTURE_CURRENT.md` 是 Stage 0 的 current working architecture；真实试玩可以直接促使其修改。