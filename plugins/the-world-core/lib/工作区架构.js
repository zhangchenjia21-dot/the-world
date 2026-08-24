/**
 * Game Workspace Architecture v0.2
 *
 * 该文件只定义工作区语义，不负责创建文件。
 * 创建与维护仍由 DSH/模型执行，避免 Core 取代 GM。
 */

export const WORKSPACE_V2_CONTRACT = `## Game Workspace Architecture v0.2

当前游戏目录代表一局独立现实，不是素材库。

### 信息分层

library/
- 可复用世界包、人物卡、拓展包。
- 永远不要写入本局变化。

state/
- 当前世界事实。
- 只保存恢复游戏必须知道的长期事实。

state/CURRENT.md
- 当前时间、地点、主要局势、最近关键变化。
- 保持短，不作为数据库。

state/characters/
- 已进入玩家长期视野的重要人物。
- 包含关系、已知能力、经历、当前状态。

state/organizations/
- 势力、组织、军队、家族、机构。
- 保存结构变化和长期关系。

state/places/
- 城镇、据点、关键地点。
- 保存玩家已经探索或影响的地点信息。

mechanics/
- 启用拓展包产生的运行状态。
- 例如人物成长、资源、生存状态、特殊系统。
- 没有启用的机制不要创建。

story/
- 剧情历史、事件账本、长期线索。

memory/
- 最近上下文摘要。

saves/
- 玩家选择的存档策略产生的快照。

### durable change 原则

只有未来仍会影响游戏的问题才进入长期文件。
普通路人、一次性交谈、不影响未来的环境描写无需建档。

NPC 是否记录取决于剧情意义，不取决于是否是初始角色卡。

### UI 读取原则

未来 UI 可以直接读取对应目录：
- 人物图鉴 → state/characters/
- 势力关系 → state/organizations/
- 地图 → state/places/
- 系统面板 → mechanics/
- 任务日志 → story/
` 
