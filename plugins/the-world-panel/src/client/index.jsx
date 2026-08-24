/**
 * the-world-panel 浏览器半（唯一接触 ctx.betterSidebar 的适配模块）。
 *
 * 信息架构（Gate B 玩家体验重构）：UI 按玩家需求组织，不按 Owner 文件组织——
 *   概览 / 角色 / 人物 / 行囊 / 事务 / 系统（有长期机制时才显示）
 * raw projection → viewmodel.js（纯函数视图模型）→ 渲染组件。
 * 玩家界面不出现 raw id / 文件路径 / Owner 说明 / mechanic / source 等开发元数据。
 */
import { createElement as h, useEffect, useMemo, useRef, useState } from 'react'
import {
  splitDoc,
  sectionsOf,
  bulletsOf,
  cleanDisplay,
  stripDevRefs,
  truncate,
  parseThreads,
  threadGroup,
  THREAD_GROUPS,
  sortThreads,
  parseSystemQuest,
  INVENTORY_SECTION,
  splitMechanics,
  mechanicName,
  mechanicStatus,
  parsePeopleIndex,
  PEOPLE_BUCKETS,
  personBuckets,
  characterView,
  identityLines,
  buildOverview,
  worldName
} from './viewmodel.js'

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

/** ── 渲染层 ─────────────────────────────────────────────────────────────── */

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|「[^」]+」)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return h('strong', { key: `${keyPrefix}-${i}` }, part.slice(2, -2))
    if (part.startsWith('`') && part.endsWith('`')) return h('code', { key: `${keyPrefix}-${i}` }, part.slice(1, -1))
    return part
  })
}

/** 通用 Markdown 体渲染：引用注记 / 列表 / 标题 / 段落（先剥离链接与路径引用）。 */
function Markdown({ text }) {
  const cleaned = stripDevRefs(text)
  if (!cleaned || !cleaned.trim()) return h('div', { className: 'twp-empty' }, '（空）')
  const lines = cleaned.split(/\r?\n/)
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

/** 分节面板：小篆风标题 + 条目列表。 */
function SectionCard({ title, text }) {
  const bullets = bulletsOf(stripDevRefs(text))
  return h(
    'section',
    { className: 'twp-card' },
    h('header', { className: 'twp-card-h' }, h('span', { className: 'twp-card-seal' }, '❖'), title),
    bullets
      ? h('ul', { className: 'twp-list' }, bullets.map((item, i) => h('li', { key: i }, renderInline(item, `b${i}`))))
      : h(Markdown, { text })
  )
}

/** 折叠分节（低频信息：知识边界 / 背景 / 认知）。 */
function FoldCard({ title, text }) {
  return h(
    'details',
    { className: 'twp-card twp-fold' },
    h('summary', null, h('span', { className: 'twp-card-seal' }, '▾'), title),
    h(Markdown, { text })
  )
}

/** ── 概览 ───────────────────────────────────────────────────────────────── */

/** 概览信息块：小标题 + 行列表。 */
function OverviewBlock({ title, tone, items, renderItem }) {
  if (!items || items.length === 0) return null
  return h(
    'section',
    { className: `twp-card twp-ov ${tone ?? ''}` },
    h('header', { className: 'twp-card-h' }, h('span', { className: 'twp-card-seal' }, '❖'), title),
    h(
      'ul',
      { className: 'twp-list' },
      items.map((item, i) => h('li', { key: i }, renderItem ? renderItem(item, i) : renderInline(item, `ov${i}`)))
    )
  )
}

/** 概览页：跨 Owner 瞬时聚合（CURRENT + PLAYER + mechanics + THREADS + characters）。 */
function OverviewPanel({ data }) {
  const ov = useMemo(() => buildOverview(data), [data])
  const world = worldName(data.composition?.text, data.game.id)
  const statChips = [
    ...(ov.health ? [{ label: '身体', value: ov.health }] : []),
    ...ov.resources
  ]
  const empty =
    !ov.name && !ov.time && !ov.location && ov.identity.length === 0 &&
    ov.crises.length === 0 && ov.affairs.length === 0 && ov.recent.length === 0
  if (empty) return h('div', { className: 'twp-empty' }, '（这局还没有可概览的当前状态）')
  return h(
    'div',
    null,
    h(
      'div',
      { className: 'twp-hero' },
      ov.name ? h('div', { className: 'twp-avatar' }, ov.name.slice(0, 1)) : null,
      h(
        'div',
        { className: 'twp-hero-m' },
        ov.name ? h('div', { className: 'twp-hero-name' }, ov.name) : null,
        ov.identity.length
          ? h('div', { className: 'twp-hero-id' }, ov.identity.map((line, i) => h('div', { key: i }, renderInline(line, `id${i}`))))
          : null
      )
    ),
    ov.time || ov.location
      ? h(
          'div',
          { className: 'twp-ov-when' },
          ov.time ? h('span', { className: 'twp-chip' }, h('em', null, '时间'), ov.time) : null,
          ov.location ? h('span', { className: 'twp-chip' }, h('em', null, '位置'), ov.location) : null
        )
      : null,
    statChips.length
      ? h(
          'div',
          { className: 'twp-chips twp-ov-stats' },
          statChips.map((c, i) => h('span', { key: i, className: 'twp-chip' }, h('em', null, c.label), c.value))
        )
      : null,
    h(OverviewBlock, { title: '当前危机', tone: 'urgent', items: ov.crises, renderItem: (c) => c.title }),
    h(OverviewBlock, { title: '当前决策', items: ov.issues }),
    h(OverviewBlock, { title: '当前事务', items: ov.affairs, renderItem: (a) => a.title }),
    h(OverviewBlock, { title: '近期变化', items: ov.recent }),
    h('div', { className: 'twp-ov-world' }, world)
  )
}

/** ── 角色 ───────────────────────────────────────────────────────────────── */

/** 角色页：Character Sheet——核心状态优先，背景/认知退居折叠层。 */
function PlayerSheet({ text }) {
  const view = characterView(text)
  const identity = identityLines(sectionsOf(splitDoc(text ?? '').body).sections)
  return h(
    'div',
    null,
    h(
      'div',
      { className: 'twp-hero' },
      h('div', { className: 'twp-avatar' }, view.name.slice(0, 1)),
      h(
        'div',
        { className: 'twp-hero-m' },
        h('div', { className: 'twp-hero-name' }, view.name),
        identity.length
          ? h('div', { className: 'twp-hero-id' }, identity.map((line, i) => h('div', { key: i }, renderInline(line, `id${i}`))))
          : null
      )
    ),
    view.primary.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text })),
    view.gear.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text })),
    view.collapsed.map((s) => h(FoldCard, { key: s.title, title: s.title, text: s.text }))
  )
}

/** ── 人物 ───────────────────────────────────────────────────────────────── */

/** 人物详情：档案正文（无 frontmatter 元信息、无 Owner 说明、无 raw id）。 */
function PersonDetail({ text }) {
  const { body } = splitDoc(text ?? '')
  const { sections } = sectionsOf(body)
  return h('div', { className: 'twp-person-detail' }, sections.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text })))
}

/** 人物页：关系化人物视图（INDEX 派生表 → 列表 + 分类过滤 + 展开详情）。 */
function PeoplePanel({ indexText, characters, nearby }) {
  const [bucket, setBucket] = useState('all')
  const people = useMemo(() => parsePeopleIndex(indexText), [indexText])
  const detailOf = (id) => (characters ?? []).find((c) => c.id === id)?.text

  // INDEX 缺失时退回 characters/ 文件名册（只有名字，没有表格属性）
  const rows = people.length
    ? people
    : (characters ?? []).map((c) => {
        const { meta, body } = splitDoc(c.text ?? '')
        return { id: c.id, name: meta.find(([k]) => k === '姓名')?.[1] ?? c.id, status: '', location: '', affiliation: '', relation: '', lastSeen: '' }
      })

  if (rows.length === 0) return h('div', { className: 'twp-empty' }, '（暂无人物档案）')

  const withBuckets = rows.map((p) => ({ ...p, buckets: personBuckets(p, nearby ?? []) }))
  const shown = bucket === 'all' ? withBuckets : withBuckets.filter((p) => p.buckets.includes(bucket))
  const available = PEOPLE_BUCKETS.filter((def) => def.id === 'all' || withBuckets.some((p) => p.buckets.includes(def.id)))

  return h(
    'div',
    null,
    available.length > 1
      ? h(
          'div',
          { className: 'twp-filters' },
          available.map((def) =>
            h(
              'button',
              { key: def.id, className: bucket === def.id ? 'twp-filter active' : 'twp-filter', onClick: () => setBucket(def.id) },
              def.label
            )
          )
        )
      : null,
    shown.length === 0 ? h('div', { className: 'twp-empty' }, '（这一类下暂无人物）') : null,
    shown.map((p) =>
      h(
        'details',
        { key: p.id || p.name, className: 'twp-card twp-person' },
        h(
          'summary',
          null,
          h('span', { className: 'twp-avatar sm' }, (p.name || '?').slice(0, 1)),
          h(
            'span',
            { className: 'twp-person-m' },
            h('span', { className: 'twp-npc-name' }, p.name),
            p.affiliation ? h('span', { className: 'twp-person-sub' }, p.affiliation) : null
          ),
          p.relation ? h('span', { className: 'twp-badge plain' }, p.relation) : null,
          p.status ? h('span', { className: `twp-badge ${/敌对|仇/.test(p.status + p.relation) ? 'urgent' : ''}` }, p.status) : null,
          p.location ? h('span', { className: 'twp-person-loc' }, p.location) : null
        ),
        p.lastSeen ? h('div', { className: 'twp-person-seen' }, `最后确认：${p.lastSeen}`) : null,
        detailOf(p.id) ? h(PersonDetail, { text: detailOf(p.id) }) : null
      )
    )
  )
}

/** ── 行囊 ───────────────────────────────────────────────────────────────── */

/** 行囊页：玩家装备分节 + 机制仓库类分节（跨 Owner 聚合，去来源徽记与路径引用）。 */
function InventoryPanel({ playerText, mechanicInventory }) {
  const { sections } = sectionsOf(splitDoc(playerText ?? '').body)
  const playerSections = sections.filter((s) => INVENTORY_SECTION.test(s.title))
  const empty = playerSections.length === 0 && mechanicInventory.length === 0
  if (empty) return h('div', { className: 'twp-empty' }, '（行囊空空）')
  return h(
    'div',
    null,
    playerSections.map((s) => h(SectionCard, { key: `p:${s.title}`, title: s.title, text: s.text })),
    mechanicInventory.map(({ mech, section }) => h(SectionCard, { key: `m:${mech}:${section.title}`, title: section.title, text: section.text }))
  )
}

/** ── 系统 ───────────────────────────────────────────────────────────────── */

/** 系统页：机制卡（任务类与仓库类分节已流出到事务/行囊）。 */
function MechanicCard({ mech, defaultOpen }) {
  const name = mechanicName(mech.text, mech.id)
  const status = mechanicStatus(mech.text)
  return h(
    'details',
    { className: 'twp-card twp-mech', open: defaultOpen },
    h(
      'summary',
      null,
      h('span', { className: 'twp-card-seal' }, '⚙'),
      h('span', { className: 'twp-npc-name' }, name),
      status ? h('span', { className: 'twp-badge' }, status) : null
    ),
    mech.sections.map((s) => h(SectionCard, { key: s.title, title: s.title, text: s.text }))
  )
}

/** ── 事务 ───────────────────────────────────────────────────────────────── */

function threadTone(groupId) {
  return groupId === 'urgent' ? 'urgent' : groupId === 'long' ? 'long' : 'open'
}

function ThreadCard({ thread, onArchive }) {
  const [confirming, setConfirming] = useState(false)
  const group = threadGroup(thread)
  const status = thread.fields['状态'] ?? ''
  const rest = Object.entries(thread.fields).filter(([k]) => k !== '状态')
  return h(
    'section',
    { className: `twp-card twp-quest ${threadTone(group)}` },
    h(
      'header',
      { className: 'twp-quest-h' },
      thread.id ? h('span', { className: 'twp-quest-id' }, thread.id) : null,
      h('span', { className: 'twp-quest-title' }, thread.title),
      status ? h('span', { className: `twp-badge ${threadTone(group)}` }, status) : null
    ),
    rest.length
      ? h(
          'dl',
          { className: 'twp-quest-f' },
          rest.flatMap(([k, v]) => [h('dt', { key: `k${k}` }, k), h('dd', { key: `v${k}` }, renderInline(stripDevRefs(v), `q${k}`))])
        )
      : h(Markdown, { text: thread.raw }),
    // DEC-B3 v1.2 窄写口：归档不是删除，线程块移入 story/LEDGER.md 可追溯
    onArchive && thread.id
      ? h(
          'button',
          {
            className: `twp-archive${confirming ? ' confirm' : ''}`,
            title: '归档该线程：从事务列表移入故事台账（LEDGER），不是删除',
            onClick: () => {
              if (!confirming) {
                setConfirming(true)
                return
              }
              setConfirming(false)
              onArchive(thread.id)
            }
          },
          confirming ? '确认归档？' : '归档'
        )
      : null
  )
}

function SystemQuestRow({ bullet, mechName }) {
  const q = parseSystemQuest(bullet)
  return h(
    'div',
    { className: `twp-sysq${q.done ? ' done' : ''}` },
    h('span', { className: 'twp-sysq-mark' }, q.done ? '✓' : '◇'),
    h('span', { className: 'twp-sysq-title' }, q.title),
    q.note ? h('span', { className: 'twp-sysq-note' }, renderInline(stripDevRefs(q.note), q.title)) : null,
    mechName ? h('span', { className: 'twp-badge plain' }, mechName) : null
  )
}

/** 事务页：世界线程按 紧急/进行中/长期 分组 + 系统任务组；保留归档窄写口。 */
function AffairsPanel({ threadsText, mechanicQuests, mechanics, onArchive }) {
  const threads = parseThreads(threadsText)
  const mechNameOf = (id) => mechanicName((mechanics ?? []).find((m) => m.id === id)?.text, id)
  const systemBullets = mechanicQuests.flatMap(({ mech, section }) =>
    (bulletsOf(section.text) ?? []).map((bullet) => ({ mech, bullet }))
  )
  // 系统任务：未完成在前，已完成沉底
  const sortedSystem = [...systemBullets].sort((a, b) => Number(parseSystemQuest(a.bullet).done) - Number(parseSystemQuest(b.bullet).done))
  if (!threads && sortedSystem.length === 0) {
    return h('div', { className: 'twp-empty' }, '（当前没有悬而未决的事）')
  }
  const groups = THREAD_GROUPS.map((g) => ({ ...g, items: (threads ?? []).filter((t) => threadGroup(t) === g.id) })).filter(
    (g) => g.items.length > 0
  )
  return h(
    'div',
    null,
    threads
      ? groups.map((g) =>
          h(
            'div',
            { key: g.id },
            h('div', { className: 'twp-group-h' }, g.label),
            g.items.map((t, i) => h(ThreadCard, { key: t.id || i, thread: t, onArchive }))
          )
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
            sortedSystem.map(({ mech, bullet }, i) => h(SystemQuestRow, { key: `${mech}:${i}`, bullet, mechName: mechNameOf(mech) }))
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

function PanelBody({ data, onArchive }) {
  const [sub, setSub] = useState('overview')
  if (!data?.game) {
    return h('div', { className: 'twp-idle' }, '当前会话不是已确认的 The World 游戏局（或工作目录不在游戏工作区）。')
  }

  const { inventory, quests, systems } = splitMechanics(data.mechanics ?? [])
  const hasMechanics = (data.mechanics ?? []).length > 0
  const overview = buildOverview(data)

  const tabs = [
    { id: 'overview', label: '概览' },
    { id: 'player', label: '角色' },
    { id: 'characters', label: '人物' },
    { id: 'inventory', label: '行囊' },
    { id: 'threads', label: '事务' },
    ...(hasMechanics ? [{ id: 'mechanics', label: '系统' }] : [])
  ]
  const active = tabs.some((t) => t.id === sub) ? sub : 'overview'

  let content = null
  if (active === 'overview') {
    content = h(OverviewPanel, { data })
  } else if (active === 'player') {
    content = data.player?.text
      ? h(PlayerSheet, { text: data.player.text })
      : h('div', { className: 'twp-empty' }, '（角色档案尚未建立）')
  } else if (active === 'characters') {
    content = h(PeoplePanel, { indexText: data.charactersIndex?.text, characters: data.characters, nearby: overview.nearby })
  } else if (active === 'inventory') {
    content = h(InventoryPanel, { playerText: data.player?.text, mechanicInventory: inventory })
  } else if (active === 'threads') {
    content = h(AffairsPanel, { threadsText: data.threads?.text, mechanicQuests: quests, mechanics: data.mechanics, onArchive })
  } else {
    content = h(
      'div',
      null,
      systems.map((m) => h(MechanicCard, { key: m.id, mech: m, defaultOpen: systems.length === 1 }))
    )
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
  const [archiveError, setArchiveError] = useState(null)
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

  // DEC-B3 v1.2 窄写口：归档线程（THREADS → LEDGER）。失败必须显式呈现——
  // 静默吞错会让玩家以为按钮坏了（实际可能是 preset 门 / 线程不存在 / 网络断）。
  const archiveThread = (threadId) => {
    setArchiveError(null)
    fetch(stateUrl(scope).replace('/state?', '/close-thread?'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ threadId })
    })
      .then((r) => r.json())
      .then((r) => {
        if (!r?.ok) {
          setArchiveError(`归档 ${threadId} 失败：${r?.error ?? r?.reason ?? '未知响应'}`)
          return
        }
        load()
      })
      .catch((e) => setArchiveError(`归档请求未送达：${e?.message ?? e}`))
  }

  const title = data?.game ? worldName(data.composition?.text, data.game.id) : '世界'
  return h(
    'div',
    { className: 'twp-root' },
    h(
      'div',
      { className: 'twp-header' },
      h('span', { className: 'twp-seal' }, '世'),
      h('span', { className: 'twp-title' }, title),
      data?.game?.updatedAt ? h('span', { className: 'twp-updated' }, `更新于 ${formatTime(data.game.updatedAt)}`) : null,
      h('button', { className: 'twp-refresh', title: '刷新', onClick: load }, '⟳')
    ),
    error ? h('div', { className: 'twp-error' }, `面板数据加载失败：${error}`) : null,
    archiveError ? h('div', { className: 'twp-error' }, archiveError) : null,
    h(PanelBody, { data, onArchive: archiveThread })
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
.twp-hero-m { min-width: 0; flex: 1; }
.twp-hero-id { margin-top: 4px; font-size: 12px; color: #6b5a2a; line-height: 1.6; }

.twp-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
.twp-chip { font-size: 11px; padding: 1px 8px; border-radius: 999px; background: #b8860b18;
  border: 1px solid #b8860b44; color: #6b5a2a; }
.twp-chip em { font-style: normal; opacity: 0.6; margin-right: 4px; }
.twp-ov-when { display: flex; flex-wrap: wrap; gap: 4px; margin: 0 0 8px; }
.twp-ov-stats { margin: 0 0 10px; }
.twp-ov.urgent { border-color: #9e2b2566; }
.twp-ov.urgent .twp-card-h { color: #9e2b25; }
.twp-ov-world { text-align: center; opacity: 0.4; font-size: 11px; letter-spacing: 4px;
  font-family: "STKaiti", "KaiTi", serif; padding: 4px 0 2px; }

.twp-note { font-size: 11.5px; color: #6b5a2a; opacity: 0.85; line-height: 1.6; padding-left: 8px;
  border-left: 2px solid #b8860b55; margin: 2px 0; }

.twp-card { background: #fffdf6; border: 1px solid #b8860b44; border-radius: 10px;
  padding: 8px 12px 10px; margin-bottom: 10px; box-shadow: 0 1px 3px #6b5a2a14; }
.twp-card-h { display: flex; align-items: center; gap: 6px; font-family: "STKaiti", "KaiTi", serif;
  font-weight: 700; font-size: 14px; letter-spacing: 2px; color: #9e2b25;
  border-bottom: 1px dashed #b8860b44; padding-bottom: 5px; margin-bottom: 6px; }
.twp-card-seal { color: #b8860b; font-size: 11px; }

.twp-fold { padding: 0; overflow: hidden; }
.twp-fold > summary { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 8px 12px;
  list-style: none; font-family: "STKaiti", "KaiTi", serif; font-weight: 700; font-size: 13px;
  letter-spacing: 2px; color: #6b5a2a; }
.twp-fold > summary::-webkit-details-marker { display: none; }
.twp-fold > summary:hover { background: #b8860b12; }
.twp-fold > .twp-md { margin: 0 12px 10px; }

.twp-list { margin: 4px 0; padding-left: 4px; list-style: none; }
.twp-list li { margin: 5px 0; line-height: 1.65; padding-left: 14px; position: relative; }
.twp-list li::before { content: "◆"; position: absolute; left: 0; top: 0; font-size: 8px; color: #b8860baa; line-height: 2.2; }
.twp-md-p { margin: 4px 0; line-height: 1.65; }
.twp-md-h { font-weight: 700; margin: 6px 0 3px; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px; }
.twp-md-quote { color: #6b5a2a; opacity: 0.85; font-size: 11.5px; line-height: 1.6; padding-left: 8px;
  border-left: 2px solid #b8860b55; margin: 2px 0; }
.twp-md code { background: #b8860b18; border-radius: 4px; padding: 0 4px; font-size: 12px; }
.twp-md strong { color: #9e2b25; }

.twp-mech { padding: 0; overflow: hidden; }
.twp-mech > summary { display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 8px 12px; list-style: none; }
.twp-mech > summary::-webkit-details-marker { display: none; }
.twp-mech > summary:hover { background: #b8860b12; }
.twp-mech .twp-card { margin-left: 12px; margin-right: 12px; box-shadow: none; }
.twp-mech > .twp-card { box-shadow: none; }
.twp-npc-name { font-weight: 700; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px; font-size: 14px; }
.twp-badge { font-size: 10.5px; padding: 1px 7px; border-radius: 999px; background: #3a6b3518;
  border: 1px solid #3a6b3544; color: #3a6b35; }
.twp-badge.urgent { background: #9e2b2514; border-color: #9e2b2544; color: #9e2b25; }
.twp-badge.long { background: #b8860b18; border-color: #b8860b44; color: #6b5a2a; }
.twp-badge.plain { background: #6b5a2a14; border-color: #6b5a2a33; color: #6b5a2a; }

.twp-filters { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.twp-filter { border: 1px solid #b8860b44; background: none; color: #6b5a2a; font-size: 11.5px;
  padding: 2px 12px; border-radius: 999px; cursor: pointer; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 2px; }
.twp-filter:hover { background: #b8860b14; }
.twp-filter.active { background: #9e2b25; border-color: #9e2b25; color: #f6f1e5; }

.twp-person { padding: 0; overflow: hidden; }
.twp-person > summary { display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 8px 12px; list-style: none; flex-wrap: wrap; }
.twp-person > summary::-webkit-details-marker { display: none; }
.twp-person > summary:hover { background: #b8860b12; }
.twp-person-m { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.twp-person-sub { font-size: 11px; color: #6b5a2a; opacity: 0.8; }
.twp-person-loc { font-size: 11px; opacity: 0.6; flex-basis: 100%; padding-left: 32px; }
.twp-person-seen { font-size: 10.5px; opacity: 0.5; padding: 0 12px 4px 32px; }
.twp-person-detail { padding: 0 12px 4px; }
.twp-person-detail .twp-card { box-shadow: none; }

.twp-quest.urgent { border-color: #9e2b2588; }
.twp-quest.long { opacity: 0.88; }
.twp-quest-h { display: flex; align-items: baseline; gap: 8px; }
.twp-quest-id { font-size: 10.5px; color: #b8860b; font-family: "STKaiti", "KaiTi", serif; flex: none; }
.twp-quest-title { font-weight: 700; font-family: "STKaiti", "KaiTi", serif; letter-spacing: 1px;
  font-size: 14px; flex: 1; }
.twp-quest-f { margin: 4px 0 2px; display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; }
.twp-quest-f dt { font-size: 11px; color: #6b5a2a; opacity: 0.75; white-space: nowrap; padding-top: 1px; }
.twp-quest-f dd { margin: 0; line-height: 1.6; }
.twp-archive { margin-top: 6px; float: right; border: 1px solid #6b5a2a99; background: #b8860b14;
  color: #2b2620; font-size: 11.5px; padding: 2px 12px; border-radius: 999px; cursor: pointer;
  font-family: "STKaiti", "KaiTi", serif; letter-spacing: 2px; }
.twp-archive:hover { border-color: #9e2b25; color: #9e2b25; background: #9e2b2512; }
.twp-archive.confirm { border-color: #9e2b25; color: #f6f1e5; background: #9e2b25; }

.twp-group-h { font-family: "STKaiti", "KaiTi", serif; font-weight: 700; letter-spacing: 3px;
  color: #6b5a2a; font-size: 12px; margin: 12px 2px 8px; }
.twp-sysq { display: flex; gap: 8px; align-items: baseline; padding: 5px 2px; line-height: 1.55; }
.twp-sysq + .twp-sysq { border-top: 1px dashed #b8860b33; }
.twp-sysq-mark { color: #b8860b; flex: none; }
.twp-sysq.done { opacity: 0.6; }
.twp-sysq.done .twp-sysq-title { text-decoration: line-through; }
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
