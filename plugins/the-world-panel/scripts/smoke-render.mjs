// 一次性渲染冒烟：mini-react stub 驱动 the-world-panel bundle，验证真实数据下渲染不炸、内容齐全。
import fs from 'node:fs'
import http from 'node:http'

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

// ── 加载 bundle ──
eval(code)
if (!registration) throw new Error('bundle 未注册')
const ex = registration.factory((id) => {
  if (/^react/.test(id)) return reactStub
  throw new Error('unexpected require: ' + id)
})

// ── DOM/fetch/ES stub ──
globalThis.document = { getElementById: () => null, createElement: () => ({}), head: { appendChild() {} } }
const stateJson = await new Promise((resolve, reject) => {
  http.get('http://127.0.0.1:3080/the-world/panel/state?cwd=' + encodeURIComponent('D:/AI/Projects/the world/games/luan-shi-sanguo'), (res) => {
    let buf = ''
    res.on('data', (c) => (buf += c))
    res.on('end', () => resolve(JSON.parse(buf)))
  }).on('error', reject)
})
globalThis.fetch = async () => ({ json: async () => stateJson })
let esCreated = 0
globalThis.EventSource = class { constructor() { esCreated++ } close() {} }

const sidebar = { registerTab: () => () => {}, isTabEnabled: () => true, openTab() {}, activateTab() {} }
const sessions = { list: { getSnapshot: () => ({ current: 's1', byId: { s1: { cwd: 'D:/AI/Projects/the world/games/luan-shi-sanguo', agentPreset: 'the-world' } } }), subscribe: () => () => {} } }

let tabComponent = null
sidebar.registerTab = (d) => { tabComponent = d.component; return () => {} }
ex.apply({ betterSidebar: sidebar, sessions, effect: (fn) => fn() })

// ── 渲染：先空态（data=null），flush 后应进入游戏态并挂 SSE ──
const el = tabComponent({ scope: { sessionId: 's1', cwd: 'D:/AI/Projects/the world/games/luan-shi-sanguo' }, visible: true })
let texts = fullRender(el)
console.log('空态包含空闲提示:', texts.some((t) => t.includes('不是已确认')))

await new Promise((r) => setTimeout(r, 50)) // 等 fetch 微任务
if (dirty) texts = fullRender(el)
if (dirty) { dirty = false; texts = fullRender(el) }

const joined = texts.join('\n')
const checks = [
  ['人物卡姓名', joined.includes('张宸嘉')],
  ['角色分节-身份', joined.includes('身份')],
  ['角色页不含装备（移交物品页）', !texts.some((t) => t.includes('装备'))],
  ['分页-人物/物品/任务标签', joined.includes('人物') && joined.includes('物品') && joined.includes('任务')],
  ['meta chip（类型）', joined.includes('玩家角色')],
]
// 切分页：直接把 PanelBody 的 sub hook 置为目标 id 并重渲染
// hooks 序列：WorldPanel(data,error,seq,eff,eff) + PanelBody(sub) → sub 是 index 5
hooks[5].v = 'inventory'
texts = fullRender(el)
const invJoined = texts.join('\n')
checks.push(['物品页-玩家装备（作训服）', invJoined.includes('作训服')], ['物品页-系统空间（金疮药）', invJoined.includes('金疮药')])
hooks[5].v = 'mechanics'
texts = fullRender(el)
const mechJoined = texts.join('\n')
checks.push(
  ['系统页-机制卡 traveler-system', mechJoined.includes('traveler-system')],
  ['系统页-任务节已流出（无立足巨鹿）', !mechJoined.includes('立足巨鹿')],
  ['系统页-系统空间已流出（无「当前存放」）', !mechJoined.includes('当前存放')]
)
hooks[5].v = 'threads'
texts = fullRender(el)
const qJoined = texts.join('\n')
checks.push(
  ['任务页-世界线程 T-03', qJoined.includes('田石家人生死未卜')],
  ['任务页-紧急徽章', qJoined.includes('紧急')],
  ['任务页-系统任务组（立足巨鹿）', qJoined.includes('立足巨鹿')],
  ['任务排序-紧急(T-05)在长期(T-03)前', qJoined.indexOf('绎幕黄巾') > -1 && qJoined.indexOf('绎幕黄巾') < qJoined.indexOf('田石家人')]
)
hooks[5].v = 'characters'
texts = fullRender(el)
checks.push(['NPC 名册（岑恪卡）', texts.join('\n').includes('岑恪') || texts.join('\n').includes('cenke')])
checks.push(['游戏态后挂 SSE', esCreated >= 1])

let fail = 0
for (const [name, ok] of checks) { console.log((ok ? 'PASS' : 'FAIL') + ' ' + name); if (!ok) fail++ }
process.exit(fail ? 1 : 0)
