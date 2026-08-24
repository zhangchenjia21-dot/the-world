// 一次性渲染冒烟：mini-react stub 驱动 the-world-panel bundle，验证真实数据下渲染不炸、内容齐全。
// 覆盖：新信息架构六分页、概览聚合、开发者元数据清除、归档点击链路、第二 fixture（无系统/空事务，AC-9）。
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'

const code = fs.readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

let registration = null
globalThis.window = { __ModuleLoader__: { load(r) { registration = r } } }

// ── mini-react：支持 useState/useEffect/useRef/useMemo + 函数组件树展开 ──
let hooks = []
let hookIdx = 0
let dirty = false
function rerender() { dirty = true }
const reactStub = {
  createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
  useState: (init) => {
    const i = hookIdx++
    if (!(i in hooks)) hooks[i] = { v: typeof init === 'function' ? init() : init }
    return [hooks[i].v, (nv) => { hooks[i].v = nv; rerender() }]
  },
  useEffect: (fn, deps) => {
    const i = hookIdx++
    const d = deps ? JSON.stringify(deps) : null
    if (hooks[i]?.d !== d) {
      const cleanup = fn()
      hooks[i] = { d, cleanup: typeof cleanup === 'function' ? cleanup : null }
    }
  },
  useRef: (v) => {
    const i = hookIdx++
    if (!hooks[i]) hooks[i] = { current: v }
    return hooks[i]
  },
  useMemo: (fn) => fn()
}

function renderNode(node, texts) {
  if (node === null || node === undefined || node === false || node === true) return
  if (typeof node === 'string' || typeof node === 'number') { texts.push(String(node)); return }
  if (Array.isArray(node)) { for (const n of node) renderNode(n, texts); return }
  if (typeof node.type === 'function') { renderNode(node.type({ ...node.props, children: node.children }), texts); return }
  renderNode(node.children, texts)
}

function fullRender(el) {
  hookIdx = 0
  const texts = []
  renderNode(el, texts)
  return texts
}

// 展开函数组件为纯 DOM 树（找按钮 / 收集 tab 标签用）
function expand(node) {
  if (node === null || node === undefined || typeof node !== 'object') return node
  if (Array.isArray(node)) return node.map(expand)
  if (typeof node.type === 'function') return expand(node.type({ ...node.props, children: node.children }))
  return { ...node, children: expand(node.children) }
}
function findByClass(node, cls, out = []) {
  if (node === null || node === undefined || typeof node !== 'object') return out
  if (Array.isArray(node)) { for (const n of node) findByClass(n, cls, out); return out }
  if (String(node.props?.className ?? '').split(' ').includes(cls)) out.push(node)
  findByClass(node.children, cls, out)
  return out
}
function tabLabels(el) {
  hookIdx = 0
  const dom = expand(el)
  return findByClass(dom, 'twp-subtab').map((b) => {
    const t = []
    renderNode(b.children, t)
    return t.join('')
  })
}

// ── 加载 bundle ──
eval(code)
if (!registration) throw new Error('bundle 未注册')
const ex = registration.factory((id) => {
  if (/^react/.test(id)) return reactStub
  throw new Error('unexpected require: ' + id)
})

// ── DOM/fetch/ES stub ──
globalThis.document = { getElementById: () => null, createElement: () => ({}), head: { appendChild() {} } }
const getJson = (url) =>
  new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let buf = ''
      res.on('data', (c) => (buf += c))
      res.on('end', () => resolve(JSON.parse(buf)))
    }).on('error', reject)
  })

const GAME1 = 'D:/AI/Projects/the world/games/luan-shi-sanguo'
const stateJson = await getJson('http://127.0.0.1:3080/the-world/panel/state?cwd=' + encodeURIComponent(GAME1))
globalThis.fetch = async () => ({ json: async () => stateJson })
let esCreated = 0
globalThis.EventSource = class { constructor() { esCreated++ } close() {} }

const sidebar = { registerTab: () => () => {}, isTabEnabled: () => true, openTab() {}, activateTab() {} }
const sessions = { list: { getSnapshot: () => ({ current: 's1', byId: { s1: { cwd: GAME1, agentPreset: 'the-world' } } }), subscribe: () => () => {} } }

let tabComponent = null
sidebar.registerTab = (d) => { tabComponent = d.component; return () => {} }
ex.apply({ betterSidebar: sidebar, sessions, effect: (fn) => fn() })

let fail = 0
const checks = []
const check = (name, ok) => checks.push([name, Boolean(ok)])

// ── 主 fixture：真实三国档 ──
const el = tabComponent({ scope: { sessionId: 's1', cwd: GAME1 }, visible: true })
let texts = fullRender(el)
check('空态包含空闲提示', texts.some((t) => t.includes('不是已确认')))

await new Promise((r) => setTimeout(r, 50)) // 等 fetch 微任务
if (dirty) texts = fullRender(el)
if (dirty) { dirty = false; texts = fullRender(el) }

let joined = texts.join('\n')

// hooks 序列：WorldPanel(data,error,archiveError,seq,eff,eff) + PanelBody(sub) → sub 是 index 6
// 换页时真实 React 会卸载上一页组件（其 hook 随之销毁）；stub 是全局位置hook池，
// 必须截断 7 及之后的槽位，否则新页组件会读到上一页同位置组件的状态。
const SUB = 6
const switchPage = (id) => { hooks[SUB].v = id; hooks.length = SUB + 1 }

// 默认页 = 概览；导航 = 概览/角色/人物/行囊/事务/系统
const labels = tabLabels(el)
check('导航-六分页（概览/角色/人物/行囊/事务/系统）', labels.join('/') === '概览/角色/人物/行囊/事务/系统')
check('概览-我是谁（张宸嘉）', joined.includes('张宸嘉'))
check('概览-当前身份（暂署屯长）', joined.includes('暂署屯长'))
check('概览-时间（中平元年）', joined.includes('中平元年'))
check('概览-位置（巨鹿郡城）', joined.includes('巨鹿郡城'))
check('概览-当前危机（绎幕黄巾）', joined.includes('当前危机') && joined.includes('绎幕黄巾'))
check('概览-当前事务（暗查内坊）', joined.includes('当前事务') && joined.includes('暗查内坊'))
check('概览-近期变化（面见太守）', joined.includes('近期变化') && joined.includes('面见太守'))
check('概览-关键资源（87 币）', joined.includes('87'))
check('概览-标题用世界名（乱世三国）', joined.includes('乱世三国'))

// AC-1：开发者元数据不进玩家界面
for (const banned of ['player-zhangchenjia', 'char-cenke', 'mechanics/', '本文件 Own', 'source:', '（→ ']) {
  check(`AC1-无「${banned}」`, !joined.includes(banned))
}

// 角色页
switchPage('player')
texts = fullRender(el)
joined = texts.join('\n')
check('角色-核心身份分节', joined.includes('社会身份'))
check('角色-身体状态', joined.includes('身体'))
check('角色-低频折叠（知识边界）', joined.includes('知识边界'))
check('角色-无 raw id', !joined.includes('player-zhangchenjia'))

// 人物页
switchPage('characters')
texts = fullRender(el)
joined = texts.join('\n')
check('人物-关系化视图（岑恪 · 保人）', joined.includes('岑恪') && joined.includes('保人'))
check('人物-无 char-* id', !joined.includes('char-cenke') && !joined.includes('char-mengdai'))
check('人物-分类过滤（全部/敌对）', joined.includes('全部') && joined.includes('敌对'))
check('人物-所属阵营（汉军）', joined.includes('汉军'))

// 行囊页
switchPage('inventory')
texts = fullRender(el)
joined = texts.join('\n')
check('行囊-玩家装备（作训服）', joined.includes('作训服'))
check('行囊-系统空间（金疮药）', joined.includes('金疮药'))
check('行囊-无路径引用（→ ../mechanics）', !joined.includes('→'))

// 系统页
switchPage('mechanics')
texts = fullRender(el)
joined = texts.join('\n')
check('系统-机制显示名（穿越与系统）', joined.includes('穿越与系统'))
check('系统-无 mechanic raw id', !joined.includes('traveler-system'))
check('系统-商城分节', joined.includes('商城'))
check('系统-任务节已流出（无立足巨鹿）', !joined.includes('立足巨鹿'))
check('系统-系统空间已流出（无「当前存放」）', !joined.includes('当前存放'))

// 事务页 + 归档点击链路
switchPage('threads')
texts = fullRender(el)
joined = texts.join('\n')
check('事务-分组标题（紧急/进行中/长期）', joined.includes('紧急') && joined.includes('进行中') && joined.includes('长期'))
check('事务-线程 T-03', joined.includes('田石家人生死未卜'))
check('事务-系统任务组（立足巨鹿）', joined.includes('立足巨鹿'))
check('事务-排序：紧急(T-05)在长期(T-03)前', joined.indexOf('绎幕黄巾') > -1 && joined.indexOf('绎幕黄巾') < joined.indexOf('田石家人'))
check('事务-归档按钮', joined.includes('归档'))

const fetchCalls = []
const origFetch = globalThis.fetch
globalThis.fetch = async (url, opts) => { fetchCalls.push({ url, opts }); return origFetch(url, opts) }
hookIdx = 0
let dom = expand(el)
let archiveBtn = findByClass(dom, 'twp-archive')[0]
check('归档按钮可点击', typeof archiveBtn?.props?.onClick === 'function')
archiveBtn.props.onClick() // 第一次点击：进入确认态
hookIdx = 0
dom = expand(el)
archiveBtn = findByClass(dom, 'twp-archive')[0]
const confirmText = []
renderNode(archiveBtn.children, confirmText)
check('归档二步确认态', confirmText.join('').includes('确认归档'))
archiveBtn.props.onClick() // 第二次点击：触发归档请求
await new Promise((r) => setTimeout(r, 20))
const closeCall = fetchCalls.find((c) => String(c.url).includes('/close-thread?'))
check('归档请求发出（close-thread）', Boolean(closeCall))
check('归档请求体含 threadId', Boolean(closeCall?.opts?.body && JSON.parse(closeCall.opts.body).threadId))
globalThis.fetch = origFetch

check('游戏态后挂 SSE', esCreated >= 1)

// ── 第二 fixture（AC-9）：无机制、无 THREADS、不同世界与人物名 ──
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'twp-fixture2-'))
try {
  fs.mkdirSync(path.join(tmp, 'state', 'characters'), { recursive: true })
  fs.writeFileSync(path.join(tmp, 'COMPOSITION.md'), '# 星港｜Game Composition\n\n- 确认状态: confirmed\n')
  fs.writeFileSync(path.join(tmp, 'state', 'CURRENT.md'), '# Current\n\n## 时间\n\n- 时间: 星历 342 年\n\n## 当前位置与场景\n\n- 当前位置: 七号坞\n')
  fs.writeFileSync(path.join(tmp, 'state', 'PLAYER.md'), '---\n姓名: 林远\n---\n\n# 星港｜玩家角色：林远\n\n## 身份\n\n- 姓名: 林远\n')
  fs.writeFileSync(path.join(tmp, 'state', 'characters', 'INDEX.md'), '# INDEX\n\n| ID | 姓名 | 状态 | 当前位置 | 所属/阵营 | 与主角关系 | 最后确认 |\n|---|---|---|---|---|---|---|\n| [char-laozao](char-laozao.md) | 老灶 | active | 七号坞 | 港务局 | 保人 | 星历342 |\n')

  const stateJson2 = await getJson('http://127.0.0.1:3080/the-world/panel/state?cwd=' + encodeURIComponent(tmp))
  check('fixture2-投影成局', stateJson2?.game?.id === path.basename(tmp))

  // 重置 hook 池，换装 fixture2 数据后渲染新实例
  hooks = []
  hookIdx = 0
  dirty = false
  globalThis.fetch = async () => ({ json: async () => stateJson2 })
  const el2 = tabComponent({ scope: { sessionId: 's2', cwd: tmp }, visible: true })
  fullRender(el2)
  await new Promise((r) => setTimeout(r, 50))
  if (dirty) fullRender(el2)
  if (dirty) { dirty = false }

  const labels2 = tabLabels(el2)
  check('fixture2-系统页隐藏（无机制）', labels2.join('/') === '概览/角色/人物/行囊/事务')
  texts = fullRender(el2)
  joined = texts.join('\n')
  check('fixture2-概览渲染（林远/星历）', joined.includes('林远') && joined.includes('星历 342'))
  check('fixture2-世界名（星港）', joined.includes('星港'))

  switchPage('threads')
  texts = fullRender(el2)
  check('fixture2-事务空态', texts.join('\n').includes('（当前没有悬而未决的事）'))

  switchPage('characters')
  texts = fullRender(el2)
  check('fixture2-人物页（老灶）', texts.join('\n').includes('老灶'))
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}

for (const [name, ok] of checks) { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fail++ }
console.log(fail ? `FAIL ${fail}` : `ALL ${checks.length} PASS`)
process.exit(fail ? 1 : 0)
