/**
 * 玩家视图模型层：raw workspace projection → player-facing view model。
 *
 * 原则（GATE_B_PANEL_PLAYER_EXPERIENCE_REDESIGN 任务书 §5）：
 * - View Model 是瞬时投影，不落盘、不改 Owner 文件；
 * - 对缺失字段宽容降级——有就展示，没有就自然省略，不编造数据；
 * - 不绑定具体游戏：所有提取基于通用节名/字段名词表，不硬编码某一局的内容。
 *
 * 本模块不 import react / node 内置模块，可在仓库内直接 node --test。
 */

/** ── 基础解析（Markdown 结构） ─────────────────────────────────────────── */

/** 文件头部的 --- 围栏键值块 → { meta: [[k,v]], body }。 */
export function splitDoc(text) {
  if (!text) return { meta: [], body: '' }
  const match = /^\s*---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text)
  if (!match) return { meta: [], body: text }
  const meta = match[1]
    .split(/\r?\n/)
    .map((line) => /^\s*([^:：]+)\s*[:：]\s*(.+)$/.exec(line))
    .filter(Boolean)
    .map((m) => [m[1].trim(), m[2].trim()])
  return { meta, body: text.slice(match[0].length) }
}

/** 按 ##/### 分节 → { preamble, sections: [{title, text}] }。 */
export function sectionsOf(text) {
  const parts = (text ?? '').split(/^(#{2,3})\s+(.+)$/m)
  const preamble = parts[0]?.trim() ?? ''
  const sections = []
  for (let i = 1; i + 2 <= parts.length; i += 3) {
    sections.push({ title: parts[i + 1].trim(), text: (parts[i + 2] ?? '').trim() })
  }
  return { preamble, sections }
}

/** 抽取 bullets 正文；无条目时返回 null。 */
export function bulletsOf(text) {
  const items = []
  for (const line of (text ?? '').split(/\r?\n/)) {
    const m = /^\s*[-*]\s+(.*)$/.exec(line)
    if (m) items.push(m[1].trim())
  }
  return items.length ? items : null
}

/** 从标题行（# 乱世三国｜玩家角色：张宸嘉）提取显示名。 */
export function displayNameOf(docBody, fallback) {
  const m = /^#\s+.+?[:：]\s*(.+)$/m.exec(docBody)
  return m?.[1]?.trim() || fallback
}

/** ── 玩家界面文本清洗（去开发者痕迹） ──────────────────────────────────── */

/**
 * 把 workspace 文本片段清洗为玩家可读文本：
 * 去 markdown 链接（留显示名）、去（→ path）与 .md 文件引用、去行内代码/加粗记号。
 * 只用于 view model 提取的短文本；分节正文仍走 Markdown 渲染。
 */
export function cleanDisplay(text) {
  return stripDevRefs(text)
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * 温和版清洗：只去链接与（→ path）交叉引用，保留加粗/代码记号。
 * 用于仍走 Markdown 渲染的分节正文——玩家界面不出现路径与跳转符。
 * A1 补强：整段剔除含 .md / LEDGER / THREADS / PLAYER / CURRENT / COMPOSITION 的
 * 文件引用（括号组或「详见/见 xxx.md」短语），canonical 原文不动。
 */
export function stripDevRefs(text) {
  return (text ?? '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/（[^（）]*→[^（）]*）/g, '')
    .replace(/\([^()]*→[^()]*\)/g, '')
    .replace(/（[^（）]*(?:\.md|LEDGER|THREADS|PLAYER|CURRENT|COMPOSITION)\b[^（）]*）/g, '')
    .replace(/\([^()]*(?:\.md|LEDGER|THREADS|PLAYER|CURRENT|COMPOSITION)\b[^()]*\)/g, '')
    .replace(/(?:详见|参见|参考|见)\s*[^，。；\n]*?\.md[^，。；\n]*/g, '')
    .replace(/\b[A-Za-z][\w-]*\.md\b/g, '')
    // LEDGER / THREADS 是 Owner 文件名而非自然词汇，裸出现同样属于开发元数据
    .replace(/\b(?:LEDGER|THREADS)\b/g, '')
}

/**
 * char-* 内部 id 的玩家化映射（A1）：
 * - `田石（char-tianshi）` → `田石`（括号形式直接去掉，前文已有名字）；
 * - 裸 `char-tianshi` 且知名 → 替换为显示名；未知 → 隐藏，不泄漏内部 id。
 * nameById：{ 'char-tianshi': '田石（石头）' }，来自 characters/INDEX.md。
 */
export function mapCharRefs(text, nameById = {}) {
  return (text ?? '')
    .replace(/[（(]char-[\w-]+[）)]/g, '')
    .replace(/\bchar-[\w-]+\b/g, (id) => nameById[id] ?? '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([，。；、）])/g, '$1')
    .trim()
}

/** 玩家显示层本地化（A4）：canonical 状态词 → 中文显示，不改 truth 文件。 */
const STATUS_DISPLAY = {
  active: '当前',
  open: '进行中',
  deadline: '时限',
  dormant: '暂离',
  closed: '已关闭',
  confirmed: '已确认',
  pending: '待确认'
}

export function localizeStatus(text) {
  return (text ?? '').replace(/\b(active|open|deadline|dormant|closed|confirmed|pending)\b/g, (w) => STATUS_DISPLAY[w] ?? w)
}

/** 截断到 max 字（概览芯片用）。 */
export function truncate(text, max = 90) {
  const t = (text ?? '').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

/** ── 线程（事务） ─────────────────────────────────────────────────────── */

/** THREADS.md 的 ### T-xx｜标题 条目 → thread 卡；解析不出结构时返回 null。 */
export function parseThreads(text) {
  if (!text) return null
  const parts = text.split(/^(#{3,4})\s+(.+)$/m)
  const threads = []
  for (let i = 1; i + 2 <= parts.length; i += 3) {
    const heading = parts[i + 1].trim()
    const body = (parts[i + 2] ?? '').trim()
    const m = /^([A-Za-z]+-\d+)\s*[｜|]\s*(.+)$/.exec(heading)
    const fields = {}
    for (const line of body.split(/\r?\n/)) {
      const f = /^\s*[-*]\s*([^:：]+)\s*[:：]\s*(.*)$/.exec(line)
      if (f) fields[f[1].trim()] = f[2].trim()
    }
    threads.push(m ? { id: m[1], title: cleanDisplay(m[2]), fields, raw: body } : { id: '', title: cleanDisplay(heading), fields, raw: body })
  }
  return threads.length ? threads : null
}

/** 线程分组：紧急 / 进行中 / 长期（按「状态」字段的通用词判定）。 */
export function threadGroup(thread) {
  const status = thread.fields['状态'] ?? ''
  if (/紧急|紧迫|倒计时/.test(status)) return 'urgent'
  if (/长期/.test(status)) return 'long'
  return 'active'
}

export const THREAD_GROUPS = [
  { id: 'urgent', label: '紧急' },
  { id: 'active', label: '进行中' },
  { id: 'long', label: '长期' }
]

/** 事务页排序：紧急 → 进行中 → 长期；同级按 id 稳定。 */
export function sortThreads(threads) {
  const rank = { urgent: 0, active: 1, long: 2 }
  return [...threads].sort((a, b) => rank[threadGroup(a)] - rank[threadGroup(b)] || a.id.localeCompare(b.id))
}

/** 系统任务条目（机制「任务」节的一条 bullet）：「…」为题，余文为注。 */
export function parseSystemQuest(bullet) {
  const m = /^「([^」]+)」\s*[——\-–]*\s*(.*)$/.exec(bullet)
  const done = /已完成|已关闭|已办结/.test(bullet)
  return m ? { title: m[1], note: m[2], done } : { title: bullet, note: '', done }
}

/** ── 机制拆分（行囊 / 事务 / 系统三向分流） ────────────────────────────── */

/** 分节归类词表（通用词，不绑定具体游戏）。 */
export const INVENTORY_SECTION = /装备|携带|物品|背包|行囊|空间|仓库|储物|货舱|货仓/
export const QUEST_SECTION = /任务|委托|合同/
export const RESOURCE_SECTION = /货币|资源|资金|钱财|银钱|存款/

/** 机制拆分：任务类与仓库类分节流出，其余留在系统页。 */
export function splitMechanics(mechanics) {
  const inventory = []
  const quests = []
  const systems = []
  for (const m of mechanics ?? []) {
    const { preamble, sections } = sectionsOf(m.text ?? '')
    const keep = []
    for (const s of sections) {
      if (QUEST_SECTION.test(s.title)) quests.push({ mech: m.id, section: s })
      else if (INVENTORY_SECTION.test(s.title)) inventory.push({ mech: m.id, section: s })
      else keep.push(s)
    }
    systems.push({ id: m.id, preamble, sections: keep, text: m.text ?? '' })
  }
  return { inventory, quests, systems }
}

/** 机制显示名：取文档一级标题 ｜ 前半（如「穿越与系统」），取不到回退 id。 */
export function mechanicName(text, fallbackId) {
  const m = /^#\s+(.+?)\s*[｜|]/m.exec(text ?? '')
  return m?.[1]?.trim() || fallbackId
}

/** 机制状态行：正文里第一条「状态: …」字段。 */
export function mechanicStatus(text) {
  const m = /^\s*[-*]\s*状态\s*[:：]\s*(.+?)\s*$/m.exec(text ?? '')
  return m ? cleanDisplay(m[1]) : null
}

/** ── 人物（INDEX 派生表 → 关系化视图） ────────────────────────────────── */

/**
 * characters/INDEX.md 的 markdown 表格 → [{ id, name, status, location, affiliation, relation, lastSeen }]。
 * 列按表头名映射（姓名/状态/位置/所属/关系/确认），缺列宽容降级。
 */
export function parsePeopleIndex(text) {
  if (!text) return []
  const lines = text.split(/\r?\n/).filter((l) => /^\s*\|/.test(l))
  if (lines.length < 2) return []
  const headerCells = lines[0].split('|').slice(1, -1).map((c) => c.trim())
  const col = (patterns) => headerCells.findIndex((h) => patterns.some((p) => h.includes(p)))
  const idx = {
    name: col(['姓名', '名称', '名字']),
    status: col(['状态']),
    location: col(['位置', '所在']),
    affiliation: col(['所属', '阵营', '势力']),
    relation: col(['关系']),
    lastSeen: col(['最后确认', '确认', '更新'])
  }
  const rows = []
  for (const line of lines.slice(1)) {
    if (/^\s*\|[\s\-:|]+\|?\s*$/.test(line)) continue // 分隔行
    const cells = line.split('|').slice(1, -1).map((c) => c.trim())
    if (cells.length < 2) continue
    const idCell = cells[0] ?? ''
    const link = /\[([^\]]*)\]\(([^)]*)\)/.exec(idCell)
    const id = (link ? link[2] : idCell).replace(/\.md$/, '').trim()
    const get = (i) => (i >= 0 && i < cells.length ? cells[i] : '')
    const name = cleanDisplay(get(idx.name)) || cleanDisplay(link?.[1] ?? '') || id
    if (!name && !id) continue
    rows.push({
      id,
      name,
      status: cleanDisplay(get(idx.status)),
      location: cleanDisplay(get(idx.location)),
      affiliation: cleanDisplay(get(idx.affiliation)),
      relation: cleanDisplay(get(idx.relation)),
      lastSeen: cleanDisplay(get(idx.lastSeen))
    })
  }
  return rows
}

/** 人物分类桶：全部仍是属性/视图，不改 characters/ 存储结构。 */
export const PEOPLE_BUCKETS = [
  { id: 'all', label: '全部' },
  { id: 'nearby', label: '身边' },
  { id: 'companion', label: '同伴', pattern: /同行|同袍|班底|班子|徒弟|弟子|师|上司|保人|直属|同组|同队|部下|同伴/ },
  { id: 'friendly', label: '友好', pattern: /友善|友好|拥护|酒约|托背|过命|恩|亲/ },
  { id: 'hostile', label: '敌对', pattern: /敌对|仇|敌视|对立/ },
  { id: 'lost', label: '失联', pattern: /未归|下落不明|失联|未知|传闻|失踪/ }
]

/** 一个人属于哪些桶（nearby 由概览的「眼前的人」名单单独给出）。 */
export function personBuckets(person, nearbyNames = []) {
  const text = `${person.relation} ${person.status} ${person.location}`
  const buckets = ['all']
  if (nearbyNames.some((n) => n && (person.name.includes(n) || n.includes(person.name)))) buckets.push('nearby')
  for (const def of PEOPLE_BUCKETS) {
    if (def.pattern && def.pattern.test(text)) buckets.push(def.id)
  }
  return buckets
}

/** ── 角色页视图 ────────────────────────────────────────────────────────── */

/** 低频节：退居折叠层，不与当前身份/身体/装备争首屏。 */
export const LOW_FREQ_SECTION = /知识边界|背景|来历|认知|设定|过往|附录/

export function characterView(playerText) {
  const { meta, body } = splitDoc(playerText ?? '')
  const { sections } = sectionsOf(body)
  const name = meta.find(([k]) => k === '姓名')?.[1] ?? displayNameOf(body, '玩家角色')
  const primary = sections.filter((s) => !INVENTORY_SECTION.test(s.title) && !LOW_FREQ_SECTION.test(s.title))
  const collapsed = sections.filter((s) => LOW_FREQ_SECTION.test(s.title))
  const gear = sections.filter((s) => INVENTORY_SECTION.test(s.title))
  return { name, primary, collapsed, gear }
}

/** ── 概览聚合（跨 Owner） ──────────────────────────────────────────────── */

/** 从文档 bullets 里取「键: 值」字段值（键为词表包含匹配）。 */
function fieldValue(text, keys) {
  for (const line of (text ?? '').split(/\r?\n/)) {
    const m = /^\s*[-*]\s*([^:：]+)\s*[:：]\s*(.+?)\s*$/.exec(line)
    if (m && keys.some((k) => m[1].trim().includes(k))) return cleanDisplay(m[2])
  }
  return null
}

/** 找第一个标题命中词表的分节。 */
function findSection(sections, pattern) {
  return sections.find((s) => pattern.test(s.title)) ?? null
}

/** 当前身份摘要：社会身份/身份节里带加粗标记的条目优先（通常是当前核心身份），否则首条。 */
export function identityLines(sections) {
  const sec = findSection(sections, /^社会身份/) ?? findSection(sections, /^身份/) ?? findSection(sections, /职位|任职|阵营/)
  if (!sec) return []
  const bullets = bulletsOf(sec.text) ?? []
  const emphasized = bullets.filter((b) => b.includes('**'))
  const picked = (emphasized.length ? emphasized : bullets).slice(0, 2)
  return picked.map((b) => truncate(cleanDisplay(b), 110))
}

/** ── Hero 摘要（A3：只承担快速识别，1–2 行） ─────────────────────────── */

/** 当前核心身份短语：社会身份/身份节中加粗片段（书写约定：**当前身份**），去重取前 3。 */
export function heroIdentity(sections) {
  const sec = findSection(sections, /^社会身份/) ?? findSection(sections, /^身份/) ?? findSection(sections, /职位|任职|阵营/)
  if (!sec) return []
  const bullets = bulletsOf(sec.text) ?? []
  const emphasized = bullets.filter((b) => b.includes('**'))
  const spans = []
  for (const b of emphasized.length ? emphasized : bullets.slice(0, 1)) {
    for (const m of b.match(/\*\*([^*]+)\*\*/g) ?? []) {
      const t = m.slice(2, -2).trim()
      if (t && t.length <= 12 && !spans.includes(t)) spans.push(t)
    }
  }
  if (spans.length) return spans.slice(0, 3)
  // 无加粗书写时降级：首条截断
  const first = emphasized.length ? emphasized[0] : bullets[0]
  return first ? [truncate(cleanDisplay(first), 40)] : []
}

/** 基本信息行：身份节首条的短事实（年龄/性别/来历等），去掉姓名段，取 3 段。 */
export function heroFacts(sections) {
  const sec = findSection(sections, /^身份/)
  if (!sec) return ''
  const first = (bulletsOf(sec.text) ?? [])[0]
  if (!first) return ''
  const parts = cleanDisplay(first)
    .split(/[；;]/)
    .map((p) => p.trim())
    .filter((p) => p && !/^姓名/.test(p))
    .map((p) => p.replace(/^[^:：]+[:：]\s*/, ''))
    .filter((p) => p.length > 0 && p.length <= 20)
  return parts.slice(0, 3).join(' · ')
}

/** 资源芯片：机制「货币/资源」类分节的第一条含数字 bullet → { label, value }。 */
function resourceChips(mechanics) {
  const chips = []
  for (const m of mechanics ?? []) {
    const { sections } = sectionsOf(m.text ?? '')
    for (const s of sections) {
      if (!RESOURCE_SECTION.test(s.title)) continue
      const bullet = (bulletsOf(s.text) ?? []).find((b) => /\d/.test(b))
      if (!bullet) continue
      const mnum = /(\d[\d,]*)\s*([^\s\d（(，,。；;]{0,6})/.exec(cleanDisplay(bullet))
      if (mnum) chips.push({ label: s.title, value: `${mnum[1]}${mnum[2] ? ` ${mnum[2]}` : ''}` })
    }
  }
  return chips
}

/** 「眼前的人」名单：CURRENT.md 在场/眼前节的条目名（破折号或括号为界）。 */
function nearbyNames(currentText) {
  const { sections } = sectionsOf(currentText ?? '')
  const sec = findSection(sections, /眼前的人|在场|身边/)
  if (!sec) return []
  return (bulletsOf(sec.text) ?? [])
    .map((b) => cleanDisplay(b).split(/[———(（·:：]\s*/)[0].trim())
    .filter(Boolean)
}

/**
 * 概览聚合：CURRENT.md + PLAYER.md + mechanics/<id>/STATE.md + THREADS.md + characters/。
 * 每个字段独立降级：任一 Owner 缺失只让对应块消失，不影响其它块。
 */
export function buildOverview(projection) {
  const playerText = projection?.player?.text ?? ''
  const currentText = projection?.current?.text ?? ''
  const { meta, body } = splitDoc(playerText)
  const playerSections = sectionsOf(body).sections
  const currentSections = sectionsOf(currentText).sections

  const name = meta.find(([k]) => k === '姓名')?.[1] ?? (playerText ? displayNameOf(body, null) : null)

  const healthSec = findSection(playerSections, /^身体|^健康/)
  const health = healthSec ? truncate(cleanDisplay((bulletsOf(healthSec.text) ?? [])[0] ?? ''), 60) : null

  const threads = parseThreads(projection?.threads?.text ?? '') ?? []
  const crises = threads.filter((t) => threadGroup(t) === 'urgent').map((t) => ({ id: t.id, title: t.title }))
  const affairs = sortThreads(threads.filter((t) => threadGroup(t) !== 'urgent'))
    .slice(0, 3)
    .map((t) => ({ id: t.id, title: t.title }))

  const recentSec = findSection(currentSections, /刚刚发生|近期变化|最近发生/)
  const issueSec = findSection(currentSections, /最直接的问题|当前决策|眼下选择|待决/)

  return {
    name,
    identity: heroIdentity(playerSections),
    facts: heroFacts(playerSections),
    time: fieldValue(currentText, ['时间', '日期']),
    location: fieldValue(currentText, ['当前位置', '位置', '所在']),
    health,
    resources: resourceChips(projection?.mechanics),
    crises,
    affairs,
    recent: (bulletsOf(recentSec?.text ?? '') ?? []).slice(0, 4).map((b) => truncate(cleanDisplay(b), 90)),
    issues: (bulletsOf(issueSec?.text ?? '') ?? []).slice(0, 3).map((b) => truncate(cleanDisplay(b), 100)),
    nearby: nearbyNames(currentText)
  }
}

/** 面板标题：COMPOSITION.md 一级标题 ｜ 前半为世界名，取不到回退 game id。 */
export function worldName(compositionText, fallbackId) {
  const m = /^#\s+(.+?)\s*[｜|]/m.exec(compositionText ?? '')
  return m?.[1]?.trim() || fallbackId
}
