/**
 * 存档：玩家侧确定性 Save / Restore 的文件层实现。
 *
 * 边界：
 * - 纯 Node fs，不依赖 cordis，可独立用 node --test 覆盖；
 * - 快照只含 COMPOSITION.md + state/ mechanics/ story/ memory/，永不碰 saves/ 与 library/；
 * - restore 是真正 snapshot 语义（整体替换），不是“覆盖存档里有的文件”；
 * - 失败安全：先完整验证源 → 先建 pre-restore 保护档 → staging 组装 → 原子就位；
 *   中途异常优先从 backup 回滚，回滚不完整时保留恢复材料并 fail loud。
 */
import fs from 'node:fs'
import path from 'node:path'
import { readGameDynamics } from './游戏定位.js'

export const SNAPSHOT_ENTRIES = ['COMPOSITION.md', 'state', 'mechanics', 'story', 'memory']

/** v0.2 可恢复结构：缺一即视为旧版归档，只可展示不可恢复（B3）。 */
export const REQUIRED_STRUCTURE = [
  'COMPOSITION.md',
  path.join('state', 'CURRENT.md'),
  path.join('state', 'PLAYER.md'),
  path.join('state', 'THREADS.md'),
  path.join('state', 'characters', 'INDEX.md'),
  path.join('mechanics', 'README.md'),
  path.join('story', 'LEDGER.md'),
  path.join('memory', 'DELTAS.md'),
  path.join('memory', 'RECENT.md')
]

const SAVE_DIR_PATTERN = /^(SAVE-\d+)(?:_(.+))?$/
const META_FILE = 'META.md'
const MAX_AUTO_SAVES = 5

/** 存档类型 → 玩家可见中文标签。 */
const KIND_LABELS = {
  manual: '手动',
  'auto-checkpoint': '自动回合',
  milestone: '里程碑',
  'pre-restore': '恢复前保护',
  legacy: '旧存档'
}

/** B6：label 清洗——去掉路径逃逸与分隔符，截断，空值回退。 */
export function sanitizeLabel(raw) {
  const fallback = '存档'
  if (!raw || typeof raw !== 'string') return fallback
  const cleaned = raw
    .replace(/[\\/]+/g, ' ')
    .replace(/\.\./g, '')
    .replace(/[\0-\x1f<>:"|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 24)
    .replace(/^[._\s]+|[._\s]+$/g, '')
  return cleaned || fallback
}

/**
 * META 解析要宽容：新档是很薄的 frontmatter（B5），旧档是自由格式中文 Markdown。
 * 只尽力提取 类型 / 建立时间 / 游戏内时点 / 名称，拿不到就留空，不崩。
 */
export function parseMeta(text) {
  const meta = {}
  if (!text || typeof text !== 'string') return meta

  const body = text.replace(/\r\n/g, '\n')
  const fm = /^---\n([\s\S]*?)\n---/.exec(body)
  const source = fm ? fm[1] : body

  const grab = (keys) => {
    for (const key of keys) {
      const match = new RegExp(`^\\s*(?:[-*]\\s*)?${key}\\s*[:：]\\s*(.+?)\\s*$`, 'im').exec(source)
      if (match) return match[1].trim().replace(/^`+|`+$/g, '')
    }
    return undefined
  }

  meta.saveId = grab(['save_id'])
  meta.kind = grab(['kind', '类型'])
  meta.createdAt = grab(['created_at', '建立(?:时间)?', '创建(?:时间)?'])
  meta.gameTime = grab(['game_time', '游戏内时点', '游戏时点'])
  meta.label = grab(['label', '名称', '存档名'])
  meta.sourceSession = grab(['source_session'])
  return meta
}

/** 旧 META 自由文本里的类型关键词 → kind；全新无法识别时按结构新旧兜底。 */
function normalizeKind(raw, restorable) {
  if (!raw) return restorable ? 'auto-checkpoint' : 'legacy'
  const text = raw.toLowerCase()
  if (text.includes('pre-restore') || raw.includes('恢复前')) return 'pre-restore'
  if (text.includes('manual') || raw.includes('手动')) return 'manual'
  if (text.includes('milestone') || raw.includes('里程碑')) return 'milestone'
  if (text.includes('auto') || raw.includes('自动') || raw.includes('回合')) return 'auto-checkpoint'
  return restorable ? 'auto-checkpoint' : 'legacy'
}

function readMeta(saveDir) {
  try {
    return fs.readFileSync(path.join(saveDir, META_FILE), 'utf8')
  } catch {
    return null
  }
}

/** 检查单个存档目录；不存在或不可读返回 null。 */
export function inspectSave(saveDir) {
  const id = path.basename(saveDir)
  const idMatch = SAVE_DIR_PATTERN.exec(id)
  if (!idMatch) return null

  let stat
  try {
    stat = fs.statSync(saveDir)
  } catch {
    return null
  }
  if (!stat.isDirectory()) return null

  const meta = parseMeta(readMeta(saveDir))
  const missing = REQUIRED_STRUCTURE.filter((relative) => {
    try {
      return !fs.statSync(path.join(saveDir, relative)).isFile()
    } catch {
      return true
    }
  })
  const restorable = missing.length === 0
  const kind = normalizeKind(meta.kind, restorable)

  return {
    id: idMatch[1],
    label: meta.label || (idMatch[2] ? idMatch[2].replace(/_/g, ' ') : idMatch[1]),
    kind,
    kindLabel: KIND_LABELS[kind] ?? KIND_LABELS.legacy,
    gameTime: meta.gameTime ?? null,
    createdAt: meta.createdAt ?? null,
    restorable,
    reasonIfNotRestorable: restorable ? null : `旧版归档：缺少 ${missing.map((m) => m.replace(/\\/g, '/')).join('、')}，当前版本不可直接恢复`
  }
}

/** 枚举 gameDir/saves 下的全部存档，按编号升序。 */
export function listSaves(gameDir) {
  const savesDir = path.join(gameDir, 'saves')
  let entries
  try {
    entries = fs.readdirSync(savesDir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.isDirectory() && SAVE_DIR_PATTERN.test(entry.name))
    .map((entry) => inspectSave(path.join(savesDir, entry.name)))
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
}

function nextSaveId(gameDir) {
  const max = listSaves(gameDir).reduce((acc, save) => {
    const n = Number.parseInt(save.id.slice(5), 10)
    return Number.isFinite(n) && n > acc ? n : acc
  }, 0)
  return `SAVE-${String(max + 1).padStart(2, '0')}`
}

/**
 * 手写递归复制，不用 fs.cpSync：Node v24 在 Windows 上遇到非 ASCII 路径会
 * 静默复制出空目录（实测 cpSync 对中文目标路径先 scandir 目标再放弃）。
 */
function copyDirRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const sourcePath = path.join(from, entry.name)
    const targetPath = path.join(to, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath)
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

/**
 * Node v24 的 Windows rmSync(recursive) 在中文目录上可能直接终止进程；
 * 只对存档服务已经精确定位的目录做不跟随符号链接的深度删除。
 */
function removeDirRecursive(targetDir, { force = false } = {}) {
  let stat
  try {
    stat = fs.lstatSync(targetDir)
  } catch (error) {
    if (force && error.code === 'ENOENT') return
    throw error
  }
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    fs.unlinkSync(targetDir)
    return
  }
  for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
    const child = path.join(targetDir, entry.name)
    if (entry.isDirectory() && !entry.isSymbolicLink()) removeDirRecursive(child)
    else fs.unlinkSync(child)
  }
  fs.rmdirSync(targetDir)
}

function copySnapshotContents(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true })
  for (const entry of SNAPSHOT_ENTRIES) {
    const from = path.join(sourceDir, entry)
    const to = path.join(targetDir, entry)
    try {
      if (fs.statSync(from).isDirectory()) {
        copyDirRecursive(from, to)
      } else {
        fs.copyFileSync(from, to)
      }
    } catch (error) {
      if (error.code === 'ENOENT') continue // 可选目录缺失不视为失败
      throw error
    }
  }
}

/**
 * 新恢复点必须从完整 live workspace 建立；这里验证的是恢复能力底线，
 * 不负责替玩家或模型补齐缺失 Owner。
 */
function assertWorkspaceComplete(gameDir) {
  const missing = REQUIRED_STRUCTURE.filter((relative) => {
    try {
      return !fs.statSync(path.join(gameDir, relative)).isFile()
    } catch {
      return true
    }
  })
  if (missing.length === 0) return

  const error = new Error(`游戏工作区不完整，无法建立可恢复存档：缺少 ${missing.map((item) => item.replace(/\\/g, '/')).join('、')}`)
  error.code = 'workspace-incomplete'
  throw error
}

/** 自动档只滚动同类快照；manual / milestone / pre-restore 永不在这里删除。 */
function rotateAutoSnapshots(gameDir) {
  const autos = listSaves(gameDir).filter((save) => save.kind === 'auto-checkpoint')
  const excess = autos.slice(0, Math.max(0, autos.length - MAX_AUTO_SAVES))
  for (const save of excess) {
    const saveDir = resolveSaveDir(gameDir, save.id)
    if (saveDir) removeDirRecursive(saveDir)
  }
}

function buildMeta({ saveId, kind, gameTime, label, sourceSession }) {
  const lines = [
    '---',
    `save_id: ${saveId}`,
    `kind: ${kind}`,
    'workspace_schema: 0.2',
    `created_at: ${new Date().toISOString()}`
  ]
  if (gameTime) lines.push(`game_time: ${gameTime}`)
  lines.push(`label: ${label}`)
  if (sourceSession) lines.push(`source_session: ${sourceSession}`)
  lines.push('---', '')
  return lines.join('\n')
}

/**
 * 创建快照。kind ∈ manual / auto-checkpoint / milestone / pre-restore。
 * 目录编号由服务端生成；label 只做展示与目录后缀，先清洗（B6）。
 * 前提：live workspace 满足 REQUIRED_STRUCTURE；否则抛 workspace-incomplete，零存档 mutation。
 * auto-checkpoint 成功后只滚动同类快照，最多保留最近 5 个。
 */
export function createSnapshot(gameDir, { kind = 'manual', label, sourceSession } = {}) {
  // 必须早于 saves/ mkdir 与编号分配，失败时不得改变既有存档集合。
  assertWorkspaceComplete(gameDir)
  const safeLabel = sanitizeLabel(label)
  const saveId = nextSaveId(gameDir)
  const savesDir = path.join(gameDir, 'saves')
  const targetDir = path.join(savesDir, `${saveId}_${safeLabel}`)

  fs.mkdirSync(savesDir, { recursive: true })
  const gameTime = readGameDynamics(gameDir).time ?? null
  try {
    copySnapshotContents(gameDir, targetDir)
    fs.writeFileSync(path.join(targetDir, META_FILE), buildMeta({ saveId, kind, gameTime, label: safeLabel, sourceSession }), 'utf8')
    if (kind === 'auto-checkpoint') rotateAutoSnapshots(gameDir)
  } catch (error) {
    // 半成品目录不能留下——下次编号/列表都不该看到残缺快照
    removeDirRecursive(targetDir, { force: true })
    throw error
  }
  return inspectSave(targetDir)
}

/** restore 源验证：任何 live mutation 之前完成（B13）。 */
function assertRestorable(saveDir) {
  const info = inspectSave(saveDir)
  if (!info) {
    const error = new Error('存档不存在或标识非法')
    error.code = 'save-not-found'
    throw error
  }
  if (!info.restorable) {
    const error = new Error(info.reasonIfNotRestorable)
    error.code = 'save-incompatible'
    throw error
  }
  return info
}

/**
 * 恢复快照（真正 snapshot 语义，B12）：
 * 1. 完整验证源；
 * 2. 先建 pre-restore 保护档，失败则整体失败、不动 live（B10）；
 * 3. staging 目录组装快照内容；
 * 4. live 各条目 rename 到 backup → staging 条目 rename 就位；
 * 5. 任何异常从 backup 回滚并 fail loud；成功后删除 backup。
 * 结果：live 中存档里没有的文件（如 T5 新增）必须消失。
 */
export function restoreSnapshot(gameDir, saveDir) {
  const info = assertRestorable(saveDir)

  const gameTime = readGameDynamics(gameDir).time ?? '未知时点'
  createSnapshot(gameDir, { kind: 'pre-restore', label: `恢复前保护 · ${gameTime}` })

  const stagingDir = path.join(gameDir, `.restore-staging-${Date.now()}`)
  const backupDir = path.join(gameDir, `.restore-backup-${Date.now()}`)
  const moved = []
  const installed = []
  let preserveRecoveryDirs = false
  try {
    fs.mkdirSync(stagingDir, { recursive: true })
    copySnapshotContents(saveDir, stagingDir)

    fs.mkdirSync(backupDir, { recursive: true })
    for (const entry of SNAPSHOT_ENTRIES) {
      const livePath = path.join(gameDir, entry)
      try {
        fs.renameSync(livePath, path.join(backupDir, entry))
        moved.push(entry)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    for (const entry of SNAPSHOT_ENTRIES) {
      const stagedPath = path.join(stagingDir, entry)
      try {
        fs.renameSync(stagedPath, path.join(gameDir, entry))
        installed.push(entry)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    removeDirRecursive(backupDir, { force: true })
  } catch (error) {
    // 只移走已经安装的新条目；备份阶段尚未移动的 live 条目必须原地保留。
    const rollbackErrors = []
    for (const entry of installed.reverse()) {
      try {
        fs.renameSync(path.join(gameDir, entry), path.join(stagingDir, `rolled-${entry}`))
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError)
      }
    }
    for (const entry of moved.reverse()) {
      try {
        fs.renameSync(path.join(backupDir, entry), path.join(gameDir, entry))
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError)
      }
    }
    preserveRecoveryDirs = rollbackErrors.length > 0
    const rollbackState = preserveRecoveryDirs
      ? '自动回滚未完整完成，已保留 staging/backup 供人工恢复'
      : '已回滚到恢复前状态'
    const loud = new Error(`恢复失败，${rollbackState}：${error.message}`)
    loud.code = 'restore-failed'
    loud.cause = error
    throw loud
  } finally {
    if (!preserveRecoveryDirs) {
      removeDirRecursive(stagingDir, { force: true })
      removeDirRecursive(backupDir, { force: true })
    }
  }
  return info
}

/**
 * 按服务端枚举出的 save id（SAVE-NN）定位目录。
 * 只接受编号形式，客户端永远不给任意路径（B6）；找不到返回 null。
 */
export function resolveSaveDir(gameDir, saveId) {
  if (typeof saveId !== 'string' || !/^SAVE-\d+$/.test(saveId)) return null
  const savesDir = path.join(gameDir, 'saves')
  let entries
  try {
    entries = fs.readdirSync(savesDir, { withFileTypes: true })
  } catch {
    return null
  }
  const hit = entries.find((entry) => entry.isDirectory() && (entry.name === saveId || entry.name.startsWith(`${saveId}_`)))
  return hit ? path.join(savesDir, hit.name) : null
}

/** B14：同一 game 的写操作串行。进程内互斥；占用时抛 busy，让调用方返回显式错误。 */
const gameLocks = new Map()

export function withGameLock(gameDir, fn) {
  const key = path.resolve(gameDir)
  if (gameLocks.get(key)) {
    const error = new Error('该游戏有存档操作正在进行，请稍后再试')
    error.code = 'busy'
    throw error
  }
  gameLocks.set(key, true)
  try {
    return fn()
  } finally {
    gameLocks.delete(key)
  }
}
