/**
 * 游戏定位：从会话 cwd 解析当前游戏目录，并读取少量程序需要的当前字段。
 *
 * 设计原因（TW-01 程序化边界）：
 * - 程序只保证“当前 game 能被识别 / control mode 可被 GM 知道 / recovery 会发生”，
 *   不解析完整世界状态；因此这里只做最窄的定位与字段读取，不做 Schema 校验。
 * - 所有函数失败时返回 null / 默认值而不是抛错：游戏工作区由模型维护，
 *   缺文件、半写状态都是正常中间态，恢复优先于预防（Prefer Recovery over Prevention）。
 * - 函数无缓存：每次调用重新读文件系统。每回合只有几次小文件读取，
 *   换来“玩家/模型刚写完就生效”，避免缓存失效类 bug。
 */
import fs from 'node:fs'
import path from 'node:path'

/** 三种主角操控粒度（Gap 05）。 */
export const CONTROL_MODES = ['full-control', 'light-delegation', 'narrative-delegation']

/** 玩家未显式选择时的默认操控粒度。 */
export const DEFAULT_CONTROL_MODE = 'light-delegation'

/** 游戏目录指针文件名（games/ 下存在多个游戏时用它指定当前游戏）。 */
export const POINTER_FILES = ['CURRENT_GAME', 'CURRENT_GAME.md']

/** 模板目录名，定位当前游戏时排除。 */
export const TEMPLATE_DIR_NAME = '_template'

/** CURRENT.md 未填写占位符。 */
const TODO_PATTERN = /^\s*`?TODO`?\s*$/i

/** 控制模式别名 →  canonical 值。 */
const CONTROL_MODE_ALIASES = new Map([
  ['full-control', 'full-control'],
  ['fullcontrol', 'full-control'],
  ['full control', 'full-control'],
  ['完全控制', 'full-control'],
  ['light-delegation', 'light-delegation'],
  ['lightdelegation', 'light-delegation'],
  ['light delegation', 'light-delegation'],
  ['轻度委托', 'light-delegation'],
  ['narrative-delegation', 'narrative-delegation'],
  ['narrativedelegation', 'narrative-delegation'],
  ['narrative delegation', 'narrative-delegation'],
  ['叙事委托', 'narrative-delegation']
])

/** 把 gamesDir 配置解析成绝对路径（相对路径基于会话 cwd）。 */
export function resolveGamesDir(cwd, gamesDir) {
  if (!cwd || typeof cwd !== 'string') return null
  return path.isAbsolute(gamesDir) ? gamesDir : path.join(cwd, gamesDir)
}

/** 目录是否看起来像一局游戏（以 state/CURRENT.md 为第一 canonical 入口判定）。 */
export function isGameDir(dir) {
  try {
    return fs.statSync(path.join(dir, 'state', 'CURRENT.md')).isFile()
  } catch {
    return false
  }
}

/**
 * 解析当前游戏。
 *
 * 判定顺序（任一命中即返回）：
 * 1. 会话 cwd 本身就是游戏目录（玩家直接把 game 目录当工作区）；
 * 2. gamesDir 下存在指针文件 CURRENT_GAME(.md)，内容为目标目录名；
 * 3. gamesDir 下恰好一个非模板子目录且是游戏目录。
 *
 * 故意不做：多游戏无指针时“猜最近修改”——恢复错游戏比不恢复更糟，
 * 此时返回 null，由提示文本引导模型/玩家显式指定。
 *
 * @returns {{ id: string, dir: string } | null}
 */
export function resolveGame(cwd, gamesDir) {
  if (cwd && isGameDir(cwd)) {
    return { id: path.basename(cwd), dir: cwd }
  }
  const root = resolveGamesDir(cwd, gamesDir)
  if (!root) return null
  let entries
  try {
    entries = fs.readdirSync(root, { withFileTypes: true })
  } catch {
    return null
  }
  for (const pointer of POINTER_FILES) {
    const pointerPath = path.join(root, pointer)
    try {
      const id = fs.readFileSync(pointerPath, 'utf8').trim()
      if (!id || id.includes('/') || id.includes('\\') || id.includes('..')) continue
      const dir = path.join(root, id)
      if (isGameDir(dir)) return { id, dir }
    } catch {
      // 指针不存在或不可读：继续尝试下一种判定
    }
  }
  const candidates = entries
    .filter((entry) => entry.isDirectory() && entry.name !== TEMPLATE_DIR_NAME && !entry.name.startsWith('.'))
    .map((entry) => ({ id: entry.name, dir: path.join(root, entry.name) }))
    .filter((candidate) => isGameDir(candidate.dir))
  return candidates.length === 1 ? candidates[0] : null
}

/**
 * 读取有界文本。文件不存在/不可读返回 null；超长截断并标记 truncated。
 * 截断是恢复上下文的正常形态：模型可按需 read 完整文件。
 */
export function readBounded(filePath, maxChars) {
  let text
  try {
    text = fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
  if (text.length <= maxChars) return { text, truncated: false }
  return { text: text.slice(0, maxChars), truncated: true }
}

/** 从 CURRENT.md 文本提取一行字段（`- 字段名: 值`），TODO/空值视为未填写。 */
function extractField(text, pattern) {
  const match = pattern.exec(text)
  if (!match) return undefined
  const value = match[1].trim().replace(/^`+|`+$/g, '').trim()
  if (!value || TODO_PATTERN.test(value)) return undefined
  return value.length > 120 ? value.slice(0, 120) : value
}

/**
 * 从 CURRENT.md 提取程序需要的少数字段。
 *
 * 只提取动态上下文真正要展示的三项：当前时间、当前位置、操控模式。
 * 其它一切交给模型自己读文件，程序不复制第二份事实（Snapshot != live truth）。
 */
export function parseCurrentFields(currentText) {
  if (!currentText) return {}
  const time = extractField(currentText, /^[-*]\s*Current time\s*\/\s*date\s*[:：]\s*(.+)$/im)
  const location = extractField(currentText, /^[-*]\s*Current location\s*[:：]\s*(.+)$/im)
  const controlRaw = extractField(currentText, /^[-*]\s*Control mode\s*[:：]\s*(.+)$/im)
    ?? extractField(currentText, /^[-*]\s*操控模式\s*[:：]\s*(.+)$/im)
  return { time, location, controlMode: normalizeControlMode(controlRaw) }
}

/** 归一化操控模式；未填写或不认识一律回落默认值（不写死报错）。 */
export function normalizeControlMode(raw) {
  if (!raw) return DEFAULT_CONTROL_MODE
  const key = raw.trim().toLowerCase()
  return CONTROL_MODE_ALIASES.get(key) ?? DEFAULT_CONTROL_MODE
}

/**
 * 读取一局的当前动态信息：control mode + 时间 + 位置。
 * 每次 prompt 组装调用一次（一次小文件读），保证玩家改完立即生效。
 */
export function readGameDynamics(gameDir) {
  const current = readBounded(path.join(gameDir, 'state', 'CURRENT.md'), 65536)
  return parseCurrentFields(current?.text)
}

/** COMPOSITION.md 文件名：玩家确认后的本局组合配置（game-local canonical）。 */
export const COMPOSITION_FILE = 'COMPOSITION.md'

/**
 * 读取本局组合配置的确认状态。
 *
 * 返回：
 * - null：没有 COMPOSITION.md（早期游戏 / 模型误建的半成品目录），按既有恢复路径处理；
 * - 'confirmed'：玩家已确认组合，恢复时直接沿用，不重新走 New Game Setup；
 * - 'pending'：组合文件存在但未确认——确认完成前不得进入正式叙事（WC-08 确认门）。
 *
 * 判定只看一行 `- 确认状态: confirmed/已确认`，宽容其余内容：配置由模型读写，
 * 程序只承担“确认门”这一个程序化保证，不解析完整配置（那是模型的职责）。
 */
export function readCompositionStatus(gameDir) {
  const composition = readBounded(path.join(gameDir, COMPOSITION_FILE), 65536)
  if (!composition) return null
  return /确认状态\s*[:：]\s*(confirmed|已确认)/i.test(composition.text) ? 'confirmed' : 'pending'
}
