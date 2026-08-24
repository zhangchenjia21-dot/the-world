/**
 * the-world-panel — 浏览器半：唯一接触 ctx.betterSidebar 的宿主适配模块（DEC-B10 薄适配层）。
 *
 * 职责：
 * - registerTab 注册「世界」tab（single 实例）；
 * - 启动与会话切换时探测当前会话：是 the-world preset 且 cwd 解析出 game → openTab 顶入视野；
 * - 面板组件按四分页渲染 Node 半投影；刷新由 SSE（fs.watch 驱动）触发，无定时轮询。
 *
 * 降级：inject 声明 betterSidebar——宿主缺失时本 fiber 永久等待（不报错、不崩 DSH），
 * 面板功能静默缺席（AC-7）。
 */
import { createElement as h, useEffect, useMemo, useRef, useState } from 'react'

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

/** ── 极简 Markdown 行渲染：标题 / 列表 / 复选 / 粗体 / 分隔线 ───────────── */

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return h('strong', { key: `${keyPrefix}-${i}` }, part.slice(2, -2))
    if (part.startsWith('`') && part.endsWith('`')) return h('code', { key: `${keyPrefix}-${i}` }, part.slice(1, -1))
    return part
  })
}

function Markdown({ text }) {
  if (!text) return h('div', { className: 'twp-empty' }, '（空）')
  const lines = text.split('\n')
  const out = []
  let listBuffer = []

  const flushList = (key) => {
    if (listBuffer.length === 0) return
    out.push(
      h(
        'ul',
        { key, className: 'twp-list' },
        listBuffer.map((item, i) =>
          h('li', { key: i, className: item.checked === true ? 'twp-checked' : item.checked === false ? 'twp-unchecked' : '' }, renderInline(item.text, `${key}-${i}`))
        )
      )
    )
    listBuffer = []
  }

  lines.forEach((line, index) => {
    const key = `l${index}`
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    const checkbox = /^\s*[-*]\s+\[([ xX])\]\s+(.*)$/.exec(line)
    if (checkbox) {
      listBuffer.push({ text: checkbox[2], checked: checkbox[1] !== ' ' })
      return
    }
    if (bullet) {
      listBuffer.push({ text: bullet[1], checked: null })
      return
    }
    flushList(`${key}-ul`)
    if (heading) {
      const level = heading[1].length
      out.push(h(`h${Math.min(level + 1, 6)}`, { key, className: `twp-h twp-h${level}` }, renderInline(heading[2], key)))
    } else if (/^\s*---+\s*$/.test(line)) {
      out.push(h('hr', { key, className: 'twp-hr' }))
    } else if (line.trim() === '') {
      out.push(h('div', { key, className: 'twp-gap' }))
    } else {
      out.push(h('p', { key, className: 'twp-p' }, renderInline(line, key)))
    }
  })
  flushList('tail-ul')
  return h('div', { className: 'twp-md' }, out)
}

/** ── 四分页 ─────────────────────────────────────────────────────────────── */

const SUBTABS = [
  { id: 'player', label: '角色' },
  { id: 'characters', label: '人物' },
  { id: 'mechanics', label: '物品 / 系统' },
  { id: 'threads', label: '任务' }
]

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
  let content = null
  if (sub === 'player') {
    content = h(Markdown, { text: data.player?.text })
  } else if (sub === 'characters') {
    content = h(
      'div',
      null,
      data.charactersIndex ? h('details', { className: 'twp-details' }, h('summary', null, '人物索引'), h(Markdown, { text: data.charactersIndex.text })) : null,
      data.characters.length === 0 ? h('div', { className: 'twp-empty' }, '（暂无人物档案）') : null,
      data.characters.map((c) =>
        h('details', { key: c.id, className: 'twp-details' }, h('summary', null, c.id), h(Markdown, { text: c.text }))
      )
    )
  } else if (sub === 'mechanics') {
    content =
      data.mechanics.length === 0
        ? h('div', { className: 'twp-empty' }, '（本局未启用带长期状态的机制）')
        : h(
            'div',
            null,
            data.mechanics.map((m) =>
              h('details', { key: m.id, className: 'twp-details', open: data.mechanics.length === 1 }, h('summary', null, m.id), h(Markdown, { text: m.text }))
            )
          )
  } else {
    content = h(Markdown, { text: data.threads?.text })
  }
  return h(
    'div',
    { className: 'twp-body' },
    h(
      'div',
      { className: 'twp-subtabs' },
      SUBTABS.map((t) =>
        h('button', { key: t.id, className: sub === t.id ? 'twp-subtab active' : 'twp-subtab', onClick: () => setSub(t.id) }, t.label)
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
      h('span', { className: 'twp-title' }, data?.game ? `世界：${data.game.id}` : '世界'),
      data?.game?.updatedAt ? h('span', { className: 'twp-updated' }, `更新于 ${formatTime(data.game.updatedAt)}`) : null,
      h('button', { className: 'twp-refresh', title: '刷新', onClick: load }, '⟳')
    ),
    error ? h('div', { className: 'twp-error' }, `面板数据加载失败：${error}`) : null,
    h(PanelBody, { data })
  )
}

/** ── 样式（随 factory 物化注入一次） ────────────────────────────────────── */

const CSS = `
.twp-root { display: flex; flex-direction: column; height: 100%; font-size: 13px; color: var(--fg, inherit); }
.twp-header { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-bottom: 1px solid var(--border, #4443); }
.twp-title { font-weight: 600; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twp-updated { opacity: 0.6; font-size: 11px; }
.twp-refresh { border: none; background: none; cursor: pointer; font-size: 14px; color: inherit; opacity: 0.7; }
.twp-refresh:hover { opacity: 1; }
.twp-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.twp-subtabs { display: flex; gap: 2px; padding: 4px 6px; border-bottom: 1px solid var(--border, #4443); }
.twp-subtab { border: none; background: none; color: inherit; padding: 3px 10px; border-radius: 6px; cursor: pointer; opacity: 0.7; font-size: 12px; }
.twp-subtab.active { opacity: 1; background: var(--active-bg, #8882); font-weight: 600; }
.twp-content { flex: 1; overflow: auto; padding: 8px 12px; }
.twp-md .twp-h { margin: 10px 0 4px; }
.twp-md .twp-h1 { font-size: 15px; } .twp-md .twp-h2 { font-size: 14px; } .twp-md .twp-h3, .twp-md .twp-h4 { font-size: 13px; }
.twp-p { margin: 3px 0; line-height: 1.55; }
.twp-gap { height: 6px; }
.twp-list { margin: 3px 0; padding-left: 18px; }
.twp-list li { margin: 2px 0; line-height: 1.5; }
.twp-checked { opacity: 0.55; text-decoration: line-through; }
.twp-unchecked { list-style-type: '☐ '; }
.twp-hr { border: none; border-top: 1px solid var(--border, #4443); margin: 8px 0; }
.twp-details { margin: 4px 0; border: 1px solid var(--border, #4443); border-radius: 8px; padding: 4px 8px; }
.twp-details summary { cursor: pointer; font-weight: 600; padding: 2px 0; }
.twp-empty, .twp-idle { opacity: 0.6; padding: 12px 4px; line-height: 1.6; }
.twp-error { color: var(--error, #e5534b); padding: 6px 10px; font-size: 12px; }
.twp-md code { background: var(--code-bg, #8882); border-radius: 4px; padding: 0 4px; font-size: 12px; }
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
