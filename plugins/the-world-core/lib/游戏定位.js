/**
 * 游戏定位：从会话 cwd 解析当前游戏目录，并读取少量程序需要的当前字段。
 *
 * 这里只做最窄的定位与字段读取，不解析完整世界状态，也不做重型 Schema 校验。
 * 缺文件、半写状态都允许存在；World Core 负责把它们识别为 Setup 或可恢复游戏。
 */
import fs from 'node:fs'
import path from 'node:path'

export const CONTROL_MODES = ['full-control', 'light-delegation', 'narrative-delegation']
export const DEFAULT_CONTROL_MODE = 'light-delegation'
export const POINTER_FILES = ['CURRENT_GAME', 'CURRENT_GAME.md']
export const TEMPLATE_DIR_NAME = '_template'
export const COMPOSITION_FILE = 'COMPOSITION.md'

const TODO_PATTERN = /^\s*`?TODO`?\s*$/i

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

export function resolveGamesDir(cwd, gamesDir) {
  if (!cwd || typeof cwd !== 'string') return null
  return path.isAbsolute(gamesDir) ? gamesDir : path.join(cwd, gamesDir)
}

/**
 * 一旦目录里出现 COMPOSITION.md 或 state/CURRENT.md，就认为它属于一个 game lifecycle。
 * 这样 Setup 草稿也能被 World Core 看见并受确认门约束，而不是只有正式 state 出现后才被发现。
 */
export function isGameDir(dir) {
  for (const relative of [COMPOSITION_FILE, path.join('state', 'CURRENT.md')]) {
    try {
      if (fs.statSync(path.join(dir, relative)).isFile()) return true
    } catch {
      // 尝试下一个标记
    }
  }
  return false
}

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
      // 指针不存在或不可读：继续
    }
  }

  const candidates = entries
    .filter((entry) => entry.isDirectory() && entry.name !== TEMPLATE_DIR_NAME && !entry.name.startsWith('.'))
    .map((entry) => ({ id: entry.name, dir: path.join(root, entry.name) }))
    .filter((candidate) => isGameDir(candidate.dir))

  return candidates.length === 1 ? candidates[0] : null
}

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

function extractField(text, pattern) {
  const match = pattern.exec(text)
  if (!match) return undefined
  const value = match[1].trim().replace(/^`+|`+$/g, '').trim()
  if (!value || TODO_PATTERN.test(value)) return undefined
  return value.length > 120 ? value.slice(0, 120) : value
}

export function parseCurrentFields(currentText) {
  if (!currentText) return {}

  const time = extractField(currentText, /^[-*]\s*Current time\s*\/\s*date\s*[:：]\s*(.+)$/im)
    ?? extractField(currentText, /^[-*]\s*时间\s*[:：]\s*(.+)$/im)
  const location = extractField(currentText, /^[-*]\s*Current location\s*[:：]\s*(.+)$/im)
    ?? extractField(currentText, /^[-*]\s*当前位置\s*[:：]\s*(.+)$/im)
  const controlRaw = extractField(currentText, /^[-*]\s*Control mode\s*[:：]\s*(.+)$/im)
    ?? extractField(currentText, /^[-*]\s*操控模式\s*[:：]\s*(.+)$/im)

  return { time, location, controlMode: normalizeControlMode(controlRaw) }
}

export function normalizeControlMode(raw) {
  if (!raw) return DEFAULT_CONTROL_MODE
  const key = raw.trim().toLowerCase()
  return CONTROL_MODE_ALIASES.get(key) ?? DEFAULT_CONTROL_MODE
}

export function readGameDynamics(gameDir) {
  const current = readBounded(path.join(gameDir, 'state', 'CURRENT.md'), 65536)
  return parseCurrentFields(current?.text)
}

/**
 * null       = 尚无 COMPOSITION.md
 * pending    = 有 COMPOSITION.md，但没有玩家确认标记
 * confirmed  = 玩家确认后的正式 Game Composition
 */
export function readCompositionStatus(gameDir) {
  const composition = readBounded(path.join(gameDir, COMPOSITION_FILE), 65536)
  if (!composition) return null
  return /确认状态\s*[:：]\s*(confirmed|已确认)/i.test(composition.text)
    ? 'confirmed'
    : 'pending'
}
