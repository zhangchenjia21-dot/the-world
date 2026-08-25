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
import { readGameDynamics, policyFingerprint } from './游戏定位.js'

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

/** Restore Reliability v0.2：pre-restore 保护档的系统 namespace，不占玩家 SAVE 编号。 */
export const RECOVERY_DIR = 'recovery'
const PROTECTION_PREFIX = 'PRE-RESTORE-'
const MAX_PROTECTIONS = 3

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
  const dirName = path.basename(saveDir)
  const idMatch = SAVE_DIR_PATTERN.exec(dirName)
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
    /** 存储层精确引用：目录 basename。玩家显示编号可能重复（历史脏数据），ref 不会。 */
    ref: dirName,
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
  // Restore Reliability v0.2：扫描 saves/ 顶层所有目录名的 SAVE-(\d+) 前缀取最大值 + 1，
  // 不再只数「能被当前 parser 识别」的快照——损坏 / legacy / duplicate / 旧模型直写
  // 目录占用了编号就不能再发，避免继续制造 duplicate SAVE-NN。不自动重命名既有目录。
  const savesDir = path.join(gameDir, 'saves')
  let entries
  try {
    entries = fs.readdirSync(savesDir, { withFileTypes: true })
  } catch {
    entries = []
  }
  const max = entries.reduce((acc, entry) => {
    if (!entry.isDirectory()) return acc
    const match = /^SAVE-(\d+)/.exec(entry.name)
    if (!match) return acc
    const n = Number.parseInt(match[1], 10)
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
    // 用枚举时拿到的精确 ref 删除：duplicate SAVE-NN 下按 id 解析会误删别的目录
    const saveDir = resolveSaveRef(gameDir, save.ref)
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

/** 恢复前保护档目录名：PRE-RESTORE-<UTC 时间戳>-<同秒序号>，字典序即时间序。 */
function nextProtectionName(recoveryDir) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '')
  let maxSeq = 0
  try {
    for (const entry of fs.readdirSync(recoveryDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const match = new RegExp(`^${PROTECTION_PREFIX}${stamp}-(\\d+)$`).exec(entry.name)
      if (match) maxSeq = Math.max(maxSeq, Number.parseInt(match[1], 10))
    }
  } catch { /* recovery/ 还不存在 */ }
  return `${PROTECTION_PREFIX}${stamp}-${String(maxSeq + 1).padStart(3, '0')}`
}

/**
 * 建立恢复前保护档：放进 saves/recovery/ 系统 namespace（Restore Reliability v0.2），
 * 不占玩家 SAVE 编号、不进玩家主列表；快照内容与 createSnapshot 语义一致。
 */
function createProtectionSnapshot(gameDir, gameTime) {
  assertWorkspaceComplete(gameDir)
  const savesDir = path.join(gameDir, 'saves')
  const recoveryDir = path.join(savesDir, RECOVERY_DIR)
  const name = nextProtectionName(recoveryDir)
  const targetDir = path.join(recoveryDir, name)
  const label = `恢复前保护 · ${gameTime}`
  fs.mkdirSync(recoveryDir, { recursive: true })
  try {
    copySnapshotContents(gameDir, targetDir)
    fs.writeFileSync(
      path.join(targetDir, META_FILE),
      buildMeta({ saveId: name, kind: 'pre-restore', gameTime, label }),
      'utf8'
    )
  } catch (error) {
    // 半成品保护档不能留下
    removeDirRecursive(targetDir, { force: true })
    throw error
  }
  return { name, dir: targetDir, label, gameTime }
}

/**
 * 枚举 saves/recovery/ 下的恢复前保护档（系统 namespace，按名称升序 = 时间升序）。
 * 这些目录不是 SAVE-NN，inspectSave 不适用；这里单独解析 META + 结构完整性，
 * 供 Panel 折叠区展示与异常时人工恢复参考。
 */
export function listProtections(gameDir) {
  const recoveryDir = path.join(gameDir, 'saves', RECOVERY_DIR)
  let entries
  try {
    entries = fs.readdirSync(recoveryDir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(PROTECTION_PREFIX))
    .map((entry) => {
      const dir = path.join(recoveryDir, entry.name)
      const meta = parseMeta(readMeta(dir))
      const restorable = REQUIRED_STRUCTURE.every((relative) => {
        try {
          return fs.statSync(path.join(dir, relative)).isFile()
        } catch {
          return false
        }
      })
      return {
        name: entry.name,
        label: meta.label || '恢复前保护',
        gameTime: meta.gameTime ?? null,
        createdAt: meta.createdAt ?? null,
        restorable
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/** 系统保护档只保留最近 3 份（名称字典序即时间序）。 */
function rotateProtections(gameDir) {
  const protections = listProtections(gameDir)
  const excess = protections.slice(0, Math.max(0, protections.length - MAX_PROTECTIONS))
  for (const protection of excess) {
    removeDirRecursive(path.join(gameDir, 'saves', RECOVERY_DIR, protection.name), { force: true })
  }
}

/**
 * 恢复快照（真正 snapshot 语义，B12）：
 * 1. 完整验证源；
 * 2. 先建 pre-restore 保护档（saves/recovery/ 系统 namespace），失败则整体失败、不动 live（B10）；
 * 3. staging 目录组装快照内容；
 * 4. live 各条目 rename 到 backup → staging 条目 rename 就位；
 * 5. 任何异常从 backup 回滚并 fail loud；成功后删除 backup。
 * 结果：live 中存档里没有的文件（如 T5 新增）必须消失。
 * 保护档生命周期（§7.3）：rollback 确认完整 → 删除本次保护档（失败重试不堆积）；
 * rollback 不完整 → 保留本次保护档与 staging/backup 供人工恢复。成功后滚动只留最近 3 份。
 */
export function restoreSnapshot(gameDir, saveDir) {
  const info = assertRestorable(saveDir)

  const gameTime = readGameDynamics(gameDir).time ?? '未知时点'
  const protection = createProtectionSnapshot(gameDir, gameTime)

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
    if (!preserveRecoveryDirs) {
      // rollback 确认完整：live 已回到恢复前，本次 protection 是多余材料，删除避免失败重试堆积
      removeDirRecursive(protection.dir, { force: true })
    }
    const rollbackState = preserveRecoveryDirs
      ? '自动回滚未完整完成，已保留 staging/backup 与恢复前保护档供人工恢复'
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
  rotateProtections(gameDir)
  return info
}

/**
 * 按玩家显示编号枚举 saves/ 顶层所有匹配目录（exact name 或 `SAVE-NN_后缀`）。
 * 历史脏数据可能制造 duplicate SAVE-NN，这里如实返回全部匹配；
 * 玩家可恢复目标的定位绝不能「取第一个」（Restore Reliability v0.2）。
 */
export function resolveSaveDirMatches(gameDir, saveId) {
  if (typeof saveId !== 'string' || !/^SAVE-\d+$/.test(saveId)) return []
  const savesDir = path.join(gameDir, 'saves')
  let entries
  try {
    entries = fs.readdirSync(savesDir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.isDirectory() && (entry.name === saveId || entry.name.startsWith(`${saveId}_`)))
    .map((entry) => path.join(savesDir, entry.name))
}

/**
 * 兼容旧调用：按编号取第一个匹配目录（保留旧行为给内部非玩家目标场景）。
 * 新代码定位玩家可恢复目标时必须用 resolveSaveRef / resolveSaveDirMatches。
 */
export function resolveSaveDir(gameDir, saveId) {
  return resolveSaveDirMatches(gameDir, saveId)[0] ?? null
}

/**
 * Restore Reliability v0.2：存储层精确引用（exact ref）解析。
 * ref 只能是服务端枚举出的 saves/ 顶层目录 basename（SAVE_DIR_PATTERN）：
 * 拒绝分隔符逃逸、`..`、绝对路径；最终还必须通过 inspectSave 存在于枚举国里。
 */
export function resolveSaveRef(gameDir, ref) {
  if (typeof ref !== 'string' || !SAVE_DIR_PATTERN.test(ref)) return null
  if (ref.includes('/') || ref.includes('\\') || ref.includes('..') || path.isAbsolute(ref)) return null
  const savesDir = path.join(gameDir, 'saves')
  const candidate = path.join(savesDir, ref)
  if (path.dirname(candidate) !== savesDir) return null
  return inspectSave(candidate) ? candidate : null
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

/** ── Save Policy v0.2：POLICY_STATE.json 执行簿记 ───────────────────────────
 *
 * saves/POLICY_STATE.json 是 Save subsystem 自己的 machine-owned state：
 * - 由这里的确定性代码独占读写，Agent / 模型不直接维护；
 * - 位于 saves/ 下，天然不进入 snapshot（快照只复制 SNAPSHOT_ENTRIES）；
 * - Restore 不回滚它：恢复后下一次 sync 以 live COMPOSITION.md 的策略为准；
 * - 文件缺失 / 损坏都按 null 处理，随后从当前 COMPOSITION.md 安全重建。
 */
export const POLICY_STATE_FILE = 'POLICY_STATE.json'
const POLICY_STATE_VERSION = 1
const MILESTONE_LABEL_MAX = 48

function policyStatePath(gameDir) {
  return path.join(gameDir, 'saves', POLICY_STATE_FILE)
}

function emptyPolicyState() {
  return {
    version: POLICY_STATE_VERSION,
    policyFingerprint: null,
    totalPlayerTurns: 0,
    intervalProgress: 0,
    pendingMilestone: null,
    lastAutoSaveError: null
  }
}

/** 读取执行簿记；缺失、损坏、版本不符一律返回 null（fail-safe，调用方负责重建）。 */
export function readPolicyState(gameDir) {
  let raw
  try {
    raw = fs.readFileSync(policyStatePath(gameDir), 'utf8')
  } catch {
    return null
  }
  try {
    const data = JSON.parse(raw)
    if (!data || data.version !== POLICY_STATE_VERSION) return null
    const state = emptyPolicyState()
    state.policyFingerprint = typeof data.policyFingerprint === 'string' ? data.policyFingerprint : null
    state.totalPlayerTurns = Number.isSafeInteger(data.totalPlayerTurns) && data.totalPlayerTurns > 0 ? data.totalPlayerTurns : 0
    state.intervalProgress = Number.isSafeInteger(data.intervalProgress) && data.intervalProgress > 0 ? data.intervalProgress : 0
    if (data.pendingMilestone && typeof data.pendingMilestone.label === 'string') {
      state.pendingMilestone = {
        label: data.pendingMilestone.label,
        atTurn: Number.isSafeInteger(data.pendingMilestone.atTurn) ? data.pendingMilestone.atTurn : 0
      }
    }
    state.lastAutoSaveError = typeof data.lastAutoSaveError === 'string' ? data.lastAutoSaveError : null
    return state
  } catch {
    return null
  }
}

/** 原子写入：tmp + rename，避免半写状态被下一轮读到。 */
function writePolicyState(gameDir, state) {
  const savesDir = path.join(gameDir, 'saves')
  fs.mkdirSync(savesDir, { recursive: true })
  const tmp = path.join(savesDir, `.POLICY_STATE.${process.pid}.tmp`)
  fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, policyStatePath(gameDir))
}

/**
 * 让执行簿记与当前 COMPOSITION.md 策略对齐（每次访问前置）：
 * - 缺失 / 损坏 → 按当前策略新建；
 * - 指纹不一致（玩家改策略或 Restore 回旧策略）→ intervalProgress 清零、
 *   totalPlayerTurns 保留、新策略不含 milestone 时清掉 pending milestone、更新指纹。
 */
export function syncPolicyState(gameDir, policy) {
  const fingerprint = policyFingerprint(policy)
  const existing = readPolicyState(gameDir)
  if (!existing) {
    const state = emptyPolicyState()
    state.policyFingerprint = fingerprint
    writePolicyState(gameDir, state)
    return state
  }
  if (existing.policyFingerprint !== fingerprint) {
    existing.intervalProgress = 0
    if (!policy.milestone) existing.pendingMilestone = null
    existing.policyFingerprint = fingerprint
    writePolicyState(gameDir, existing)
  }
  return existing
}

/**
 * 记录一个真实玩家回合（每回合只在 first stopping 调一次）。
 * 返回 { state, intervalDue }：intervalProgress 达到策略间隔即 due。
 * 没有 interval 策略时 intervalDue 恒为 false。
 */
export function recordPlayerTurn(gameDir, policy) {
  const state = syncPolicyState(gameDir, policy)
  state.totalPlayerTurns += 1
  state.intervalProgress += 1
  const intervalDue = policy.interval != null && state.intervalProgress >= policy.interval
  writePolicyState(gameDir, state)
  return { state, intervalDue }
}

/** 里程碑 label 清洗：去换行 / 控制字符，折叠空白，截断到 48 字（玩家可见）。 */
export function sanitizeMilestoneLabel(raw) {
  if (!raw || typeof raw !== 'string') return null
  const cleaned = raw.replace(/[\0-\x1f\x7f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MILESTONE_LABEL_MAX)
  return cleaned || null
}

/**
 * world_mark_milestone 的唯一写口：只把 pending milestone 记进簿记。
 * 不建快照、不动世界文件。同一回合多次 mark 合并为一条（保留首个 label）。
 * 策略不含 milestone 时明确 ignored。
 */
export function markMilestone(gameDir, policy, label) {
  if (!policy.milestone) return { marked: false, reason: 'policy-without-milestone' }
  const safeLabel = sanitizeMilestoneLabel(label)
  if (!safeLabel) return { marked: false, reason: 'empty-label' }
  const state = syncPolicyState(gameDir, policy)
  if (state.pendingMilestone && state.pendingMilestone.atTurn === state.totalPlayerTurns) {
    return { marked: true, coalesced: true, label: state.pendingMilestone.label }
  }
  state.pendingMilestone = { label: safeLabel, atTurn: state.totalPlayerTurns }
  writePolicyState(gameDir, state)
  return { marked: true, coalesced: false, label: safeLabel }
}

/**
 * 自动快照成功：清 pending milestone、重置 intervalProgress
 * （milestone 档同样视为 interval 安全点已满足）、清除失败记录。
 */
export function recordAutoSaveSuccess(gameDir, policy) {
  const state = syncPolicyState(gameDir, policy)
  state.pendingMilestone = null
  state.intervalProgress = 0
  state.lastAutoSaveError = null
  writePolicyState(gameDir, state)
  return state
}

/**
 * 自动快照失败：记录 lastAutoSaveError 供 Panel 显形；
 * 不清零 intervalProgress、不丢 pending milestone——下一安全回合重试。
 */
export function recordAutoSaveFailure(gameDir, policy, message) {
  const state = syncPolicyState(gameDir, policy)
  state.lastAutoSaveError = String(message ?? '未知错误').slice(0, 200)
  writePolicyState(gameDir, state)
  return state
}
