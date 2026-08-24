/**
 * the-world-panel — 浏览器半：唯一接触 ctx.betterSidebar 的宿主适配模块（DEC-B10 薄适配层）。
 *
 * 职责：
 * - registerTab 注册「世界」tab（single 实例）；
 * - 启动与会话切换时探测当前会话：是 the-world preset 且 cwd 解析出 game → openTab 顶入视野；
 * - 面板组件按分页渲染 Node 半投影；刷新由 SSE（fs.watch 驱动）触发，无定时轮询。
 *
 * UI 是 game truth 的投影（DEC-B3）：解析层只重组既有 Markdown 的版式，
 * 不增删内容、不产生第二事实源、无任何编辑入口。
 *
 * 分页语义（v0.2，按真实文件结构归纳，不硬编码具体游戏）：
 * - 角色：PLAYER.md 全卷，但「装备 / 携带物」类分节移交物品页；
 * - 人物：state/characters/ 名册；
 * - 物品：PLAYER.md 装备类分节 + 机制 STATE.md 中「空间 / 仓库 / 背包」类分节；
 * - 系统：机制 STATE.md 其余分节（剔除任务类与仓库类）；无机制时分页隐藏（并非所有世界都带系统）；
 * - 任务：THREADS.md 世界线程（紧急 → 普通 → 长期排序）+ 机制「任务 / 委托」类分节（系统任务组）。
 *
 * 降级：inject 声明 betterSidebar——宿主缺失时本 fiber 永久等待（不报错、不崩 DSH），
 * 面板功能静默缺席（AC-7）。
 */
import { createElement as h, useEffect, useRef, useState } from 'react'

export const name = 'the-world-panel'
export const inject = ['betterSidebar', 'sessions']

const TAB_ID = 'the-world:panel'
const PRESET_ID = 'the-world'

function stateUrl(scope) {
  const params = new URLSearchParams()
  if (scope?.sessionId) params.set('session', scope.sessionId)
  if (scope?.cwd) params.set('cwd', scope.cwd)
  return `/the-world/panel/state?${params}`
}

function eventsUrl(scope) {
  return stateUrl(scope).replace('/state?', '/events?')
}

/** ── 解析层：把稳定 Owner 的 Markdown 重组为结构化版式（只读投影） ──────── */

/** 文件头部的 --- 围栏键值块（id/姓名/类型/updated 等）→ 元信息签。 */
function splitDoc(text) {
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

/** 按 ## 分节 → { preamble, sections: [{title, text}] }。 */
function sectionsOf(text) {
  const parts = text.split(/^(#{2,3})\s+(.+)$/m)
  // split 带捕获组：parts = [前导, '##', 标题1, 正文1, '##', 标题2, 正文2, ...]
  const preamble = parts[0]?.trim() ?? ''
  const sections = []
  for (let i = 1; i + 2 <= parts.length; i += 3) {
    sections.push({ title: parts[i + 1].trim(), text: (parts[i + 2] ?? '').trim() })
  }
  return { preamble, sections }
}

/** 抽取 bullets 正文；无条目时返回 null。 */
function bulletsOf(text) {
  const items = []
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*[-*]\s+(.*)$/.exec(line)
    if (m) items.push(m[1].trim())
  }
  return items.length ? items : null
}

/** 分节归类词表：按节名把机制分节分流到物品页 / 任务页（通用词，不绑定具体游戏）。 */
const INVENTORY_SECTION = /装备|携带|物品|背包|行囊|空间|仓库|储物/
const QUEST_SECTION = /任务|委托|合同/

/** 机制拆分：任务类与仓库类分节流出，其余留在系统页。 */
function splitMechanics(mechanics) {
  const inventory = []
  const quests = []
  const systems = []
  for (const m of mechanics) {
    const { preamble, sections } = sectionsOf(m.text ?? '')
    const keep = []
    for (const s of sections) {
      if (QUEST_SECTION.test(s.title)) quests.push({ mech: m.id, section: s })
      else if (INVENTORY_SECTION.test(s.title)) inventory.push({ mech: m.id, section: s })
      else keep.push(s)
    }
    systems.push({ id: m.id, preamble, sections: keep })
  }
  return { inventory, quests, systems }
}

/** THREADS.md 的 ### T-xx｜标题 条目 → quest 卡；解析不出结构时返回 null 走通用渲染。 */
function parseQuests(text) {
  if (!text) return null
  const parts = text.split(/^(#{3,4})\s+(.+)$/m)
  const quests = []
  for (let i = 1; i + 2 <= parts.length; i += 3) {
    const heading = parts[i + 1].trim()
    const body = (parts[i + 2] ?? '').trim()
    const m = /^([A-Za-z]+-\d+)\s*[｜|]\s*(.+)$/.exec(heading)
    const fields = {}
    for (const line of body.split(/\r?\n/)) {
      const f = /^\s*[-*]\s*([^:：]+)\s*[:：]\s*(.*)$/.exec(line)
      if (f) fields[f[1].trim()] = f[2].trim()
    }
    quests.push(m ? { id: m[1], title: m[2].trim(), fields, raw: body } : { id: '', title: heading, fields, raw: body })
  }
  return quests.length ? quests : null
}

/** 世界线程排序：紧急 → 普通 → 长期；同级按 id 稳定。 */
function questRank(quest) {
  const status = quest.fields['状态'] ?? ''
  if (/紧急|紧迫|倒计时/.test(status)) return 0
  if (/长期/.test(status)) return 2
  return 1
}

function sortQuests(quests) {
  return [...quests].sort((a, b) => questRank(a) - questRank(b) || a.id.localeCompare(b.id))
}

/** 系统任务条目（机制「任务」节的一条 bullet）：「…」为题，余文为注。 */
function parseSystemQuest(bullet) {
  const m = /^「([^」]+)」\s*[——\-–]*\s*(.*)$/.exec(bullet)
  const done = /已完成|已关闭|已办结/.test(bullet)
  return m ? { title: m[1], note: m[2], done } : { title: bullet, note: '', done }
}

/** 从角色卡正文标题行（# 乱世三国｜玩家角色：张宸嘉）提取显示名。 */
function displayNameOf(docBody, fallback) {
  const m = /^#\s+.+?[:：]\s*(.+)$/m.exec(docBody)
  return m?.[1]?.trim() || fallback
}

/** ── 渲染层 ─────────────────────────────────────────────────────────────── */

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|「[^」]+」)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return h('strong', { key: `${keyPrefix}-${i}` }, part.slice(2, -2))
    if (part.startsWith('`') && part.endsWith('`')) return h('code', { key: `${keyPrefix}-${i}` }, part.slice(1, -1))
    return part
  })
}

/** 通用 Markdown 体渲染：引用注记 / 列表 / 标题 / 段落。 */
function Markdown({ text }) {
  if (!text) return h('div', { className: 'twp-empty' }, '（空）')
  const lines = text.split(/\r?\n/)
  const out = []
  let listBuffer = []
  const flushList = (key) => {
    if (listBuffer.length === 0) return
    out.push(h('ul', { key, className: 'twp-list' }, listBuffer.map((item, i) => h('li', { key: i }, renderInline(item, `${key}-${i}`)))))
    listBuffer = []
  }
  lines.forEach((line, index) => {
    const key = `l${index}`
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    const quote = /^\s*>\s?(.*)$/.exec(line)
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      listBuffer.push(bullet[1])
      return
    }
    flushList(`${key}-ul`)
    if (heading) {
      out.push(h('div', { key, className: 'twp-md-h' }, renderInline(heading[2], key)))
    } else if (quote) {
      out.push(h('div', { key, className: 'twp-md-quote' }, renderInline(quote[1], key)))
    } else if (/^\s*---+\s*$/.test(line) || line.trim() === '') {
      // 分隔线与空行：卡片版式里由 CSS 间距承担
    } else {
      out.push(h('p', { key, className: 'twp-md-p' }, renderInline(line, key)))
    }
  })
  flushList('tail-ul')
  return h('div', { className: 'twp-md' }, out)
}

/** 元信息签行（id / 类型 / updated 等）。 */
function MetaChips({ meta, omitKeys = [] }) {
  const shown = meta.filter(([k]) => !omitKeys.includes(k))
  if (shown.length === 0) return null
  return h(
    'div',
    { className: 'twp-chips' },
    shown.map(([k, v]) => h('span', { key: k, className: 'twp-chip' }, h('em', null, k), v))
  )
}

/** 分节面板：小篆风标题 + 条目列表。 */
function SectionCard({ title, text, badge }) {
  const bullets = bulletsOf(text)
  return h(
    'section',
    { className: 'twp-card' },
    h(
      'header',
      { className: 'twp-card-h' },
      h('span', { className: 'twp-card-seal' }, '❖'),
      title,
      badge ? h('span', { className: 'twp-badge plain' }, badge) : null
    ),
    bullets
      ? h('ul', { className: 'twp-list' }, bullets.map((item, i) => h('li', { key: i }, renderInline(item, `b${i}`))))
      : h(Markdown, { text })
  )
}

/** 卷首题注（> 开头的 Owner 说明行）。 */
function Preamble({ text }) {
  if (!text) return null
  const notes = text.split(/\r?\n/).filter((l) => /^\s*>/.test(l)).map((l) => l.replace(/^\s*>\s?/, ''))
  const plain = text.split(/\r?\n/).filter((l) => !/^\s*>/.test(l) && l.trim() !== '' && !/^#{1,4}\s/.test(l))
  return h(
    'div',
    { className: 'twp-preamble' },
    notes.map((n, i) => h('div', { key: `n${i}`, className: 'twp-note' }, renderInline(n, `n${i}`))),
    plain.length ? h(Markdown, { text: plain.join('\n') }) : null
  )
}

/** 角色页：人物卡（画轴眉 + 名讳 + 元信息签）+ 各分节面板（装备类移交物品页）。 */
function PlayerSheet({ text }) {
  const { meta, body } = splitDoc(text)
  const { preamble, sections } = sectionsOf(body)
  const name = meta.find(([k]) => k === '姓名')?.[1] ?? displayNameOf(body, '玩家角色')
  return h(
    'div',
    null,
    h(
      'div',
      { className: 'twp-hero' },
      h('div', { className: 'twp-avatar' }, name.slice(0, 1)),
      h(
        'div',
        { className: 'twp-hero-m' },
        h('div', { className: 'twp-hero-name' }, name),
        h(MetaChips, { meta, omitKeys: ['姓名'] })
      )
    ),
    h(Preamble, { text: preamble }),
    sections.filter((s) => !INVENTORY_SECTION.test(s.title)).map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text }))
  )
}

/** 人物页：NPC 名册卡。 */
function NpcCard({ id, text }) {
  const { meta, body } = splitDoc(text)
  const { preamble, sections } = sectionsOf(body)
  const name = meta.find(([k]) => k === '姓名')?.[1] ?? displayNameOf(body, id)
  const kind = meta.find(([k]) => k === '类型')?.[1]
  return h(
    'details',
    { className: 'twp-card twp-npc' },
    h(
      'summary',
      null,
      h('span', { className: 'twp-avatar sm' }, name.slice(0, 1)),
      h('span', { className: 'twp-npc-name' }, name),
      kind ? h('span', { className: 'twp-badge' }, kind) : null,
      h('span', { className: 'twp-npc-id' }, id)
    ),
    h(MetaChips, { meta, omitKeys: ['姓名', '类型'] }),
    h(Preamble, { text: preamble }),
    sections.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text }))
  )
}

/** 物品页：玩家装备类分节 + 机制仓库类分节（带来源徽记）。 */
function InventoryPanel({ playerText, mechanicInventory }) {
  const playerSections = sectionsOf(splitDoc(playerText ?? '').body).sections.filter((s) => INVENTORY_SECTION.test(s.title))
  const empty = playerSections.length === 0 && mechanicInventory.length === 0
  if (empty) return h('div', { className: 'twp-empty' }, '（行囊空空）')
  return h(
    'div',
    null,
    playerSections.map((s) => h(SectionCard, { key: `p:${s.title}`, title: s.title, text: s.text })),
    mechanicInventory.map(({ mech, section }) =>
      h(SectionCard, { key: `m:${mech}:${section.title}`, title: section.title, text: section.text, badge: mech })
    )
  )
}

/** 系统页：机制卡（任务类与仓库类分节已流出）。 */
function MechanicCard({ mech, defaultOpen }) {
  return h(
    'details',
    { className: 'twp-card twp-mech', open: defaultOpen },
    h('summary', null, h('span', { className: 'twp-card-seal' }, '⚙'), h('span', { className: 'twp-npc-name' }, mech.id)),
    h(Preamble, { text: mech.preamble }),
    mech.sections.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text }))
  )
}

/** 任务页：世界线程（排序 + 状态徽章）+ 系统任务组。 */
function questTone(status) {
  if (!status) return ''
  if (/紧急|紧迫|倒计时/.test(status)) return 'urgent'
  if (/长期/.test(status)) return 'long'
  return 'open'
}

function QuestCard({ quest }) {
  const status = quest.fields['状态'] ?? ''
  const rest = Object.entries(quest.fields).filter(([k]) => k !== '状态')
  return h(
    'section',
    { className: `twp-card twp-quest ${questTone(status)}` },
    h(
      'header',
      { className: 'twp-quest-h' },
      quest.id ? h('span', { className: 'twp-quest-id' }, quest.id) : null,
      h('span', { className: 'twp-quest-title' }, quest.title),
      status ? h('span', { className: `twp-badge ${questTone(status)}` }, status) : null
    ),
    rest.length
      ? h(
          'dl',
          { className: 'twp-quest-f' },
          rest.flatMap(([k, v]) => [h('dt', { key: `k${k}` }, k), h('dd', { key: `v${k}` }, renderInline(v, `q${k}`))])
        )
      : h(Markdown, { text: quest.raw })
  )
}

function SystemQuestRow({ bullet, mech }) {
  const q = parseSystemQuest(bullet)
  return h(
    'div',
    { className: `twp-sysq${q.done ? ' done' : ''}` },
    h('span', { className: 'twp-sysq-mark' }, q.done ? '✓' : '◇'),
    h('span', { className: 'twp-sysq-title' }, q.title),
    q.note ? h('span', { className: 'twp-sysq-note' }, renderInline(q.note, q.title)) : null,
    h('span', { className: 'twp-badge plain' }, mech)
  )
}

function QuestPanel({ threadsText, mechanicQuests }) {
  const worldQuests = parseQuests(threadsText)
  const systemBullets = mechanicQuests.flatMap(({ mech, section }) =>
    (bulletsOf(section.text) ?? []).map((bullet) => ({ mech, bullet }))
  )
  // 系统任务：未完成在前，已完成沉底
  const sortedSystem = [...systemBullets].sort((a, b) => Number(parseSystemQuest(a.bullet).done) - Number(parseSystemQuest(b.bullet).done))
  if (!worldQuests && sortedSystem.length === 0) {
    return h('div', { className: 'twp-empty' }, '（当前没有悬而未决的事）')
  }
  return h(
    'div',
    null,
    worldQuests
      ? h(
          'div',
          null,
          h('div', { className: 'twp-group-h' }, '世界线程'),
          sortQuests(worldQuests).map((q, i) => h(QuestCard, { key: q.id || i, quest: q }))
        )
      : h(Markdown, { text: threadsText }),
    sortedSystem.length
      ? h(
          'div',
          null,
          h('div', { className: 'twp-group-h' }, '系统任务'),
          h(
            'section',
            { className: 'twp-card' },
            sortedSystem.map(({ mech, bullet }, i) => h(SystemQuestRow, { key: `${mech}:${i}`, bullet, mech }))
          )
        )
      : null
  )
}

/** ── 分页骨架 ─────────────────────────────────────────────────────────────── */

function formatTime(ms) {
  if (!ms) return ''
  const d = new Date(ms)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function PanelBody({ data }) {
  const [sub, setSub] = useState('player')
  if (!data?.game) {
    return h('div', { className: 'twp-idle' }, '当前会话不是已确认的 The World 游戏局（或工作目录不在游戏工作区）。')
  }

  const { inventory, quests, systems } = splitMechanics(data.mechanics ?? [])
  const hasMechanics = (data.mechanics ?? []).length > 0

  const tabs = [
    { id: 'player', label: '角色' },
    { id: 'characters', label: '人物' },
    { id: 'inventory', label: '物品' },
    ...(hasMechanics ? [{ id: 'mechanics', label: '系统' }] : []),
    { id: 'threads', label: '任务' }
  ]
  const active = tabs.some((t) => t.id === sub) ? sub : 'player'

  let content = null
  if (active === 'player') {
    content = data.player?.text
      ? h(PlayerSheet, { text: data.player.text })
      : h('div', { className: 'twp-empty' }, '（PLAYER.md 尚未建立）')
  } else if (active === 'characters') {
    content = h(
      'div',
      null,
      data.characters.length === 0 ? h('div', { className: 'twp-empty' }, '（暂无人物档案）') : null,
      data.characters.map((c) => h(NpcCard, { key: c.id, id: c.id, text: c.text }))
    )
  } else if (active === 'inventory') {
    content = h(InventoryPanel, { playerText: data.player?.text, mechanicInventory: inventory })
  } else if (active === 'mechanics') {
    content = h(
      'div',
      null,
      systems.map((m) => h(MechanicCard, { key: m.id, mech: m, defaultOpen: systems.length === 1 }))
    )
  } else {
    content = h(QuestPanel, { threadsText: data.threads?.text, mechanicQuests: quests })
  }
  return h(
    'div',
    { className: 'twp-body' },
    h(
      'div',
      { className: 'twp-subtabs' },
      tabs.map((t) =>
        h('button', { key: t.id, className: active === t.id ? 'twp-subtab active' : 'twp-subtab', onClick: () => setSub(t.id) }, t.label)
      )
    ),
    h('div', { className: 'twp-content' }, content)
  )
}

function WorldPanel(props) {
  const scope = props.scope
  const visible = props.visible !== false
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const seq = useRef(0)

  const load = () => {
    const my = ++seq.current
    fetch(stateUrl(scope))
      .then((r) => r.json())
      .then((d) => {
        if (seq.current === my) {
          setData(d)
          setError(null)
        }
      })
      .catch((e) => {
        if (seq.current === my) setError(String(e?.message ?? e))
      })
  }

  // 初次与 scope 变化时拉取；visible 时才挂 SSE（live views pause otherwise）。
  useEffect(() => {
    if (visible) load()
  }, [scope?.sessionId, scope?.cwd, visible])

  // 只有确认是游戏局之后才挂 SSE——否则 EventSource 会对非流式应答无限重连，
  // 退化成事实上的轮询（违反 DEC-B4）。
  const isGame = Boolean(data?.game)
  useEffect(() => {
    if (!visible || !isGame) return
    const es = new EventSource(eventsUrl(scope))
    es.onmessage = () => load()
    return () => es.close()
  }, [isGame, scope?.sessionId, scope?.cwd, visible])

  return h(
    'div',
    { className: 'twp-root' },
    h(
      'div',
      { className: 'twp-header' },
      h('span', { className: 'twp-seal' }, '世'),
      h('span', { className: 'twp-title' }, data?.game ? data.game.id : '世界'),
      data?.game?.updatedAt ? h('span', { className: 'twp-updated' }, `更新于 ${formatTime(data.game.updatedAt)}`) : null,
      h('button', { className: 'twp-refresh', title: '刷新', onClick: load }, '⟳')
    ),
    error ? h('div', { className: 'twp-error' }, `面板数据加载失败：${error}`) : null,
    h(PanelBody, { data })
  )
}

/** ── 样式：宣纸 / 墨色 / 朱砂 / 鎏金的卷轴风（随 factory 物化注入一次） ──── */

const CSS = `
.twp-root { display: flex; flex-direction: column; height: 100%; font-size: 13px;
  color: var(--fg, #2b2620); background: var(--bg, #f6f1e5); }
.twp-header { display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  border-bottom: 2px solid #b8860b55; background: linear-gradient(#fbf7ec, #f3eddc); }
.twp-seal { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px;
  border-radius: 4px; background: #9e2b25; color: #f6f1e5; font-weight: 700; font-size: 13px;
  font-family: "STKaiti", "KaiTi", serif; box-shadow: 0 1px 2px #0003; }
.twp-title { font-weight: 700; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  font-family: "STKaiti", "KaiTi", serif; font-size: 15px; letter-spacing: 1px; }
.twp-updated { opacity: 0.55; font-size: 11px; }
.twp-refresh { border: none; background: none; cursor: pointer; font-size: 14px; color: inherit; opacity: 0.65; }
.twp-refresh:hover { opacity: 1; }
.twp-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.twp-subtabs { display: flex; gap: 4px; padding: 6px 10px; border-bottom: 1px solid #b8860b33; background: #f3eddca0; }
.twp-subtab { border: 1px solid transparent; background: none; color: inherit; padding: 4px 12px;
  border-radius: 6px 6px 0 0; cursor: pointer; opacity: 0.65; font-size: 12.5px;
  font-family: "STKaiti", "KaiTi", serif; letter-spacing: 2px; }
.twp-subtab:hover { opacity: 0.9; }
.twp-subtab.active { opacity: 1; background: #fffdf6; border-color: #b8860b55; border-bottom-color: #fffdf6;
  font-weight: 700; color: #9e2b25; }
.twp-content { flex: 1; overflow: auto; padding: 10px 12px 16px; }

.twp-hero { display: flex; gap: 12px; align-items: center; padding: 12px; margin-bottom: 10px;
  background: #fffdf6; border: 1px solid #b8860b44; border-radius: 10px; box-shadow: 0 1px 3px #6b5a2a18; }
.twp-avatar { display: inline-flex; align-items: center; justify-content: center; width: 46px; height: 46px;
  border-radius: 50%; background: radial-gradient(circle at 35% 30%, #c14a42, #9e2b25); color: #f9f3e3;
  font-size: 22px; font-family: "STKaiti", "KaiTi", serif; border: 2px solid #b8860b88; flex: none; }
.twp-avatar.sm { width: 24px; height: 24px; font-size: 13px; }
.twp-hero-name { font-size: 17px; font-weight: 700; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 2px; }
.twp-hero-m { min-width: 0; }

.twp-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.twp-chip { font-size: 11px; padding: 1px 8px; border-radius: 999px; background: #b8860b18;
  border: 1px solid #b8860b44; color: #6b5a2a; }
.twp-chip em { font-style: normal; opacity: 0.6; margin-right: 4px; }

.twp-preamble { margin: 0 2px 10px; }
.twp-note { font-size: 11.5px; color: #6b5a2a; opacity: 0.85; line-height: 1.6; padding-left: 8px;
  border-left: 2px solid #b8860b55; margin: 2px 0; }

.twp-card { background: #fffdf6; border: 1px solid #b8860b44; border-radius: 10px;
  padding: 8px 12px 10px; margin-bottom: 10px; box-shadow: 0 1px 3px #6b5a2a14; }
.twp-card-h { display: flex; align-items: center; gap: 6px; font-family: "STKaiti", "KaiTi", serif;
  font-weight: 700; font-size: 14px; letter-spacing: 2px; color: #9e2b25;
  border-bottom: 1px dashed #b8860b44; padding-bottom: 5px; margin-bottom: 6px; }
.twp-card-seal { color: #b8860b; font-size: 11px; }

.twp-list { margin: 4px 0; padding-left: 4px; list-style: none; }
.twp-list li { margin: 5px 0; line-height: 1.65; padding-left: 14px; position: relative; }
.twp-list li::before { content: "◆"; position: absolute; left: 0; top: 0; font-size: 8px; color: #b8860baa; line-height: 2.2; }
.twp-md-p { margin: 4px 0; line-height: 1.65; }
.twp-md-h { font-weight: 700; margin: 6px 0 3px; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px; }
.twp-md-quote { color: #6b5a2a; opacity: 0.85; font-size: 11.5px; line-height: 1.6; padding-left: 8px;
  border-left: 2px solid #b8860b55; margin: 2px 0; }
.twp-md code { background: #b8860b18; border-radius: 4px; padding: 0 4px; font-size: 12px; }
.twp-md strong { color: #9e2b25; }

.twp-npc, .twp-mech { padding: 0; overflow: hidden; }
.twp-npc > summary, .twp-mech > summary { display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 8px 12px; list-style: none; }
.twp-npc > summary::-webkit-details-marker, .twp-mech > summary::-webkit-details-marker { display: none; }
.twp-npc > summary:hover, .twp-mech > summary:hover { background: #b8860b12; }
.twp-npc .twp-chips, .twp-npc .twp-preamble, .twp-npc .twp-card,
.twp-mech .twp-preamble, .twp-mech .twp-card { margin-left: 12px; margin-right: 12px; }
.twp-npc > .twp-card, .twp-mech > .twp-card { box-shadow: none; }
.twp-npc-name { font-weight: 700; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px; font-size: 14px; }
.twp-npc-id { margin-left: auto; font-size: 10.5px; opacity: 0.45; }
.twp-badge { font-size: 10.5px; padding: 1px 7px; border-radius: 999px; background: #3a6b3518;
  border: 1px solid #3a6b3544; color: #3a6b35; }
.twp-badge.urgent { background: #9e2b2514; border-color: #9e2b2544; color: #9e2b25; }
.twp-badge.long { background: #b8860b18; border-color: #b8860b44; color: #6b5a2a; }
.twp-badge.plain { background: #6b5a2a14; border-color: #6b5a2a33; color: #6b5a2a; }

.twp-quest-h { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.twp-quest-id { font-size: 10.5px; font-weight: 700; color: #f6f1e5; background: #6b5a2a;
  padding: 1px 6px; border-radius: 4px; letter-spacing: 0.5px; flex: none; }
.twp-quest.urgent .twp-quest-id { background: #9e2b25; }
.twp-quest-title { font-weight: 700; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px;
  font-size: 13.5px; flex: 1; }
.twp-quest-f { margin: 4px 0 2px; display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; }
.twp-quest-f dt { font-size: 11px; color: #6b5a2a; opacity: 0.75; white-space: nowrap; padding-top: 1px; }
.twp-quest-f dd { margin: 0; line-height: 1.6; }

.twp-group-h { font-family: "STKaiti", "KaiTi", serif; font-weight: 700; letter-spacing: 3px;
  color: #6b5a2a; font-size: 12.5px; margin: 4px 2px 8px; display: flex; align-items: center; gap: 8px; }
.twp-group-h::after { content: ""; flex: 1; border-top: 1px solid #b8860b44; }

.twp-sysq { display: flex; align-items: baseline; gap: 8px; padding: 5px 2px; line-height: 1.55;
  border-bottom: 1px dashed #b8860b2e; }
.twp-sysq:last-child { border-bottom: none; }
.twp-sysq.done { opacity: 0.5; }
.twp-sysq.done .twp-sysq-title { text-decoration: line-through; }
.twp-sysq-mark { color: #b8860b; flex: none; }
.twp-sysq.done .twp-sysq-mark { color: #3a6b35; }
.twp-sysq-title { font-weight: 600; }
.twp-sysq-note { flex: 1; font-size: 11.5px; opacity: 0.75; }
.twp-sysq .twp-badge { margin-left: auto; flex: none; }

.twp-empty, .twp-idle { opacity: 0.55; padding: 14px 6px; line-height: 1.7; }
.twp-error { color: #9e2b25; padding: 6px 12px; font-size: 12px; }
`

function injectCss() {
  if (typeof document === 'undefined') return
  if (document.getElementById('the-world-panel-css')) return
  const style = document.createElement('style')
  style.id = 'the-world-panel-css'
  style.textContent = CSS
  document.head.appendChild(style)
}

/** ── 宿主适配（本文件是唯一接触 ctx.betterSidebar 的模块） ──────────────── */

export function apply(ctx) {
  injectCss()
  const sidebar = ctx.betterSidebar

  // tab 的 scope.cwd 由宿主从客户端列表摘要带出（可选）；缺失时现场补一次，
  // 避免服务器端会话尚未水合时出现假性 no-cwd。
  const enrichScope = (scope) => {
    if (!scope?.sessionId || scope.cwd) return scope
    const summary = ctx.sessions?.list?.getSnapshot?.()?.byId?.[scope.sessionId]
    return summary?.cwd ? { ...scope, cwd: summary.cwd } : scope
  }

  ctx.effect(
    () =>
      sidebar.registerTab({
        id: TAB_ID,
        title: '世界',
        icon: (size) => h('span', { style: { fontSize: size }, role: 'img', 'aria-label': '世界' }, '🗺️'),
        order: 5,
        single: true,
        component: (props) => h(WorldPanel, { ...props, scope: enrichScope(props.scope) })
      }),
    'the-world-panel: tab'
  )

  // 游戏 session 进入视野时自动 openTab 顶入（DEC-B10）；非 the-world preset /
  // 非游戏 cwd 一律不动（AC-6）。每个会话每次页面加载只自动打开一次：
  // subscribe 在列表任何变化时都会触发，重复 openTab 会经 dedupe 聚焦而抢走
  // 用户正在使用的其它 tab 的焦点。
  let probing = false
  const autoOpened = new Set()
  const tryAutoOpen = () => {
    if (probing) return
    try {
      const snapshot = ctx.sessions?.list?.getSnapshot?.()
      const sessionId = snapshot?.current
      if (!sessionId || autoOpened.has(sessionId)) return
      const summary = snapshot.byId?.[sessionId]
      if (!summary?.cwd) return
      if (summary.agentPreset && summary.agentPreset !== PRESET_ID) return
      if (!sidebar.isTabEnabled(TAB_ID)) return
      probing = true
      fetch(stateUrl({ sessionId, cwd: summary.cwd }))
        .then((r) => r.json())
        .then((d) => {
          if (!d?.game) return
          autoOpened.add(sessionId)
          // 带 path 的 content open：宿主约定它必须「落入视野」——面板折叠时自动展开
          // （纯 type open 永不展开）。path 对本 tab 仅为元数据（指向会话工作区）。
          const scope = { sessionId, cwd: summary.cwd }
          sidebar.openTab({ type: TAB_ID, path: summary.cwd, meta: { game: d.game.id } }, scope)
          // 打开后显式激活：恢复的布局里默认聚焦可能是内置「文件」tab。
          sidebar.activateTab?.(TAB_ID, scope)
        })
        .catch(() => {})
        .finally(() => {
          probing = false
        })
    } catch {
      probing = false
    }
  }

  tryAutoOpen()
  ctx.effect(() => ctx.sessions.list.subscribe(tryAutoOpen), 'the-world-panel: auto-open')
}
