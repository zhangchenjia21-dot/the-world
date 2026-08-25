/**
 * the-world-panel — The World 只读游戏面板（Gate B 首个 RPG 体验插件）Node 半。
 *
 * 职责：经 DSH webServer 前缀路由把当前 game 的四个稳定 Owner
 * （state/PLAYER.md、state/characters/、mechanics/<id>/STATE.md、state/THREADS.md）
 * 投影为 JSON，并用 fs.watch + SSE 提供「回合结束后刷新」信号。
 *
 * 硬边界（DEC-B3 v1.2 扩展）：本模块对游戏文件以投影（只读）为主，写口只有两个——
 * /close-thread 窄写口（线程归档）与 /save、/restore 确定性快照（plugins/shared/存档.js），
 * 都不经模型。除此之外不存在任何写路径；
 * 投影只读活档案（state/ 与 mechanics/ 的当前文件）；saves/ 仅经 /saves 枚举元数据。
 *
 * 挂载方式：the-world preset 行（agent.cordis.yml）。不硬 inject webServer——
 * preset 也会在无 Web 宿主的平面被挂载校验（check-preset 夹具 / CLI），
 * 硬 inject 会让整个 preset 挂载永久等待；webServer 缺失时本插件静默不注册路由。
 */
import fs from 'node:fs'
import path from 'node:path'
import z from '@deepseek-ai/schemastery'
import { resolveSessionPreset } from '@deepseek-ai/dsh-agent-presets'
import { resolveGame, readBounded, readSavePolicy, describeSavePolicy } from '../../shared/游戏定位.js'
import { createSnapshot, listSaves, listProtections, resolveSaveRef, resolveSaveDirMatches, restoreSnapshot, withGameLock, readPolicyState } from '../../shared/存档.js'
import { cutThreadBlock, appendToLedger, archiveEntry, LEDGER_SEED, THREAD_ID_PATTERN } from './线程归档.js'

export const name = 'the-world-panel'
export const inject = []

export const Config = z.object({
  /** 游戏根目录：相对会话 cwd 或绝对路径（与 the-world-core 同语义）。 */
  gamesDir: z.string().default('games'),
  /** 只服务该 preset 的会话（DEC-B1：standard preset 下插件语义不生效）。 */
  presetId: z.string().default('the-world'),
  /** 单文件投影上限（字符），超出截断并标记 truncated。 */
  maxFileChars: z.number().default(60000),
  /** fs.watch 事件去抖窗口（毫秒）。 */
  watchDebounceMs: z.number().default(400)
})

function sendJson(res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache'
  })
  res.end(body)
}

/** 有界读取请求体（字符），超限返回 null。close-thread 的负载只有一个 threadId，4KB 足够。 */
function readBodyBounded(req, maxChars = 4096) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > maxChars) {
        resolve(null)
        req.destroy()
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', () => resolve(null))
  })
}

/** 本地日历日（YYYY-MM-DD），作为归档节日期。 */
function localDateString(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** DEC-B3 v1.2 唯一窄写口：把线程从 state/THREADS.md 归档进 story/LEDGER.md。
 *  归档是「移动」而非「删除」——线程块全文进 LEDGER，THREADS 里只移除该块。 */
async function handleCloseThread(config, game, req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'method-not-allowed' })
    return
  }
  const body = await readBodyBounded(req)
  let threadId = null
  try {
    threadId = body ? JSON.parse(body)?.threadId : null
  } catch {
    // 非法 JSON 落入下面的 400
  }
  if (typeof threadId !== 'string' || !THREAD_ID_PATTERN.test(threadId)) {
    sendJson(res, 400, { ok: false, error: 'invalid-thread-id' })
    return
  }

  const threadsPath = path.join(game.dir, 'state', 'THREADS.md')
  const bounded = readBounded(threadsPath, config.maxFileChars * 4)
  if (!bounded || bounded.truncated) {
    sendJson(res, 404, { ok: false, error: 'threads-not-found' })
    return
  }
  const cut = cutThreadBlock(bounded.text, threadId)
  if (!cut) {
    sendJson(res, 404, { ok: false, error: 'thread-not-found' })
    return
  }

  const ledgerPath = path.join(game.dir, 'story', 'LEDGER.md')
  const ledgerBounded = readBounded(ledgerPath, config.maxFileChars * 8)
  const ledgerText = ledgerBounded?.text ?? LEDGER_SEED
  const dateStr = localDateString()
  const nextLedger = appendToLedger(ledgerText, archiveEntry(cut, dateStr), dateStr)

  fs.writeFileSync(threadsPath, cut.remaining, 'utf8')
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true })
  fs.writeFileSync(ledgerPath, nextLedger, 'utf8')
  sendJson(res, 200, { ok: true, threadId })
}

/** 会话 cwd 解析（对齐 better-sidebar 的 sessionCwdOf 语义）：会话 header 优先，
 *  会话尚未水合时用客户端列表摘要携带的 cwd；都没有则返回 null。 */
function sessionCwdOf(ctx, sessionId, clientCwd) {
  if (sessionId) {
    const session = ctx.get?.('sessions')?.get(sessionId)
    const headerCwd = session?.header?.cwd
    if (headerCwd) return { cwd: headerCwd, session }
  }
  if (clientCwd && path.isAbsolute(clientCwd)) return { cwd: clientCwd, session: null }
  return { cwd: null, session: null }
}

/** preset 门：能确定会话 preset 且不是 The World 时拒绝（视为非游戏）。
 *  注意必须用宿主官方的 resolveSessionPreset（事件流里最后一条 agent-preset/selected
 *  优先于创建 header）——session.header.agentPreset 只是创建时刻的值，
 *  用户在空会话上切换 preset 后 header 不会改写，只读 header 会把合法会话误判拒绝。 */
function presetAllowed(session, presetId) {
  if (!session) return true // 会话不在内存（未水合）：放行，cwd 语义门兜底
  let preset
  try {
    preset = resolveSessionPreset(session)
  } catch {
    preset = session.header?.agentPreset
  }
  if (preset === undefined || preset === null) return true // 无法判定时放行（客户端另有门槛）
  return preset === presetId
}

/** 读取目录下全部 .md 文件（排除 exclude），返回 [{id, ...}]，按 id 排序。 */
function readMarkdownDir(dir, maxChars, exclude = new Set()) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && !exclude.has(entry.name))
    .map((entry) => {
      const id = entry.name.replace(/\.md$/, '')
      const filePath = path.join(dir, entry.name)
      const bounded = readBounded(filePath, maxChars)
      let mtime = null
      try {
        mtime = fs.statSync(filePath).mtimeMs
      } catch {
        // 半写状态允许存在；mtime 缺失不影响投影
      }
      return { id, text: bounded?.text ?? '', truncated: bounded?.truncated ?? false, mtime }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

/** 构建四分页投影：全部来自 Workspace Architecture v0.2 已稳定 Owner（DEC-B2）。 */
function projectGame(game, maxChars) {
  const file = (...segments) => {
    const filePath = path.join(game.dir, ...segments)
    const bounded = readBounded(filePath, maxChars)
    let mtime = null
    try {
      mtime = fs.statSync(filePath).mtimeMs
    } catch {
      // 文件缺失：投影为 null
    }
    return bounded ? { text: bounded.text, truncated: bounded.truncated, mtime } : null
  }

  const charactersIndex = file('state', 'characters', 'INDEX.md')
  const characters = readMarkdownDir(path.join(game.dir, 'state', 'characters'), maxChars, new Set(['INDEX.md']))

  let mechanicIds = []
  const mechanicsRoot = path.join(game.dir, 'mechanics')
  try {
    mechanicIds = fs
      .readdirSync(mechanicsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
  } catch {
    // mechanics/ 可不存在
  }
  const mechanics = mechanicIds
    .map((id) => ({ id, ...file('mechanics', id, 'STATE.md') }))
    .filter((item) => typeof item.text === 'string')

  const mtimes = [charactersIndex, ...characters, ...mechanics]
    .map((item) => item?.mtime)
    .filter((value) => typeof value === 'number')
  const player = file('state', 'PLAYER.md')
  const threads = file('state', 'THREADS.md')
  const composition = file('COMPOSITION.md')
  const current = file('state', 'CURRENT.md')
  for (const item of [player, threads, composition, current]) {
    if (typeof item?.mtime === 'number') mtimes.push(item.mtime)
  }

  return {
    game: { id: game.id, updatedAt: mtimes.length ? Math.max(...mtimes) : null },
    player,
    threads,
    composition,
    current,
    charactersIndex,
    characters,
    mechanics
  }
}

/** B9 权威检查：当前会话 Agent 正在生成 / 执行工具时为 running。
 *  agents 服务不可用或会话不在内存时视为无法判定——放行给文件层互斥锁兜底。 */
function agentRunning(ctx, sessionId) {
  if (!sessionId) return false
  try {
    return ctx.get?.('agents')?.get(sessionId)?.status === 'running'
  } catch {
    return false
  }
}

/** POST /save：手动确定性快照（B4/B6）。label 只做展示，清洗后截断；编号服务端生成。 */
async function handleSave(ctx, game, sessionId, req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'method-not-allowed' })
    return
  }
  if (agentRunning(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'agent-running' })
    return
  }
  const body = await readBodyBounded(req)
  let label
  try {
    label = body ? JSON.parse(body)?.label : undefined
  } catch {
    // 非法 JSON：label 视为未提供，用自动友好名
  }
  try {
    const save = withGameLock(game.dir, () =>
      createSnapshot(game.dir, { kind: 'manual', label: label ?? '手动存档', sourceSession: sessionId }))
    sendJson(res, 200, { ok: true, save })
  } catch (error) {
    const status = error.code === 'busy' ? 409 : 500
    sendJson(res, status, { ok: false, error: error.code ?? 'save-failed', message: error.message })
  }
}

/**
 * POST /restore：真正 snapshot 回档（B10/B12/B13）。
 * Restore Reliability v0.2：优先收 exact `saveRef`（服务端枚举的目录 basename）；
 * 旧客户端的 `saveId` 只在编号唯一时兼容解析，duplicate 一律 fail closed（save-id-ambiguous）。
 */
async function handleRestore(ctx, game, sessionId, req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'method-not-allowed' })
    return
  }
  if (agentRunning(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'agent-running' })
    return
  }
  const body = await readBodyBounded(req)
  let payload = null
  try {
    payload = body ? JSON.parse(body) : null
  } catch {
    // 非法 JSON 落入下面的 400
  }
  const saveRef = typeof payload?.saveRef === 'string' ? payload.saveRef : null
  const saveId = typeof payload?.saveId === 'string' ? payload.saveId : null

  let saveDir = null
  if (saveRef != null) {
    if (!/^SAVE-\d+(?:_.+)?$/.test(saveRef) || saveRef.includes('/') || saveRef.includes('\\') || saveRef.includes('..')) {
      sendJson(res, 400, { ok: false, error: 'invalid-save-ref' })
      return
    }
    saveDir = resolveSaveRef(game.dir, saveRef)
    if (!saveDir) {
      sendJson(res, 404, { ok: false, error: 'save-ref-not-found' })
      return
    }
  } else if (saveId != null) {
    if (!/^SAVE-\d+$/.test(saveId)) {
      sendJson(res, 400, { ok: false, error: 'invalid-save-id' })
      return
    }
    const matches = resolveSaveDirMatches(game.dir, saveId)
    if (matches.length > 1) {
      sendJson(res, 409, { ok: false, error: 'save-id-ambiguous' })
      return
    }
    if (matches.length === 0) {
      sendJson(res, 400, { ok: false, error: 'invalid-save-id' })
      return
    }
    saveDir = matches[0]
  } else {
    sendJson(res, 400, { ok: false, error: 'invalid-save-ref' })
    return
  }

  try {
    const save = withGameLock(game.dir, () => restoreSnapshot(game.dir, saveDir))
    // 成功响应必须带 exact target 信息（§9）：客户端据此告诉玩家文件层恢复到了哪一份
    sendJson(res, 200, {
      ok: true,
      restoredRef: save.ref,
      restoredId: save.id,
      restoredLabel: save.label,
      restoredGameTime: save.gameTime,
      requiresNewSession: true
    })
  } catch (error) {
    const status = error.code === 'busy' || error.code === 'save-incompatible' ? 409 : error.code === 'save-not-found' ? 404 : 500
    sendJson(res, status, { ok: false, error: error.code ?? 'restore-failed', message: error.message })
  }
}

/** 需要监视的目录集合：活档案 Owner 所在目录（不含 saves/）。 */
function watchDirs(gameDir) {
  const dirs = [gameDir, path.join(gameDir, 'state'), path.join(gameDir, 'state', 'characters'), path.join(gameDir, 'mechanics')]
  try {
    for (const entry of fs.readdirSync(path.join(gameDir, 'mechanics'), { withFileTypes: true })) {
      if (entry.isDirectory()) dirs.push(path.join(gameDir, 'mechanics', entry.name))
    }
  } catch {
    // mechanics/ 可不存在
  }
  return dirs
}

function handleEvents(ctx, config, game, req, res) {
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache',
    connection: 'keep-alive'
  })
  res.write(': ok\n\n')

  const logger = ctx.logger('the-world-panel')
  let watchers = []
  let timer = null
  const onChange = () => {
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      // 新机制目录可能在上一回合出现：重挂监视集合
      arm()
      try {
        res.write('data: {"type":"refresh"}\n\n')
      } catch (error) {
        logger.warn('SSE 写入失败: %s', error?.message ?? error)
      }
    }, config.watchDebounceMs)
  }
  function arm() {
    for (const watcher of watchers) watcher.close()
    watchers = []
    for (const dir of watchDirs(game.dir)) {
      try {
        watchers.push(fs.watch(dir, { persistent: false }, onChange))
      } catch {
        // 目录缺失（如尚未创建 mechanics/）：跳过
      }
    }
  }
  arm()
  req.on('close', () => {
    if (timer) clearTimeout(timer)
    for (const watcher of watchers) watcher.close()
    watchers = []
  })
}

export function apply(ctx, config) {
  const logger = ctx.logger('the-world-panel')
  // 软取 webServer：缺失（CLI / 挂载校验平面）时静默降级，不影响宿主与其它插件。
  const webServer = ctx.get ? ctx.get('webServer') : null
  if (!webServer) {
    logger.debug('webServer 不存在（非 Web 平面），面板路由不注册')
    return
  }

  const handler = async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost')
      const sessionId = url.searchParams.get('session') || undefined
      const clientCwd = url.searchParams.get('cwd') || undefined
      const { cwd, session } = sessionCwdOf(ctx, sessionId, clientCwd)

      if (!presetAllowed(session, config.presetId)) {
        sendJson(res, 200, { game: null, reason: 'preset' })
        return
      }
      if (!cwd) {
        sendJson(res, 200, { game: null, reason: 'no-cwd' })
        return
      }
      const game = resolveGame(cwd, config.gamesDir)
      if (!game) {
        sendJson(res, 200, { game: null, reason: 'no-game' })
        return
      }

      if (url.pathname.endsWith('/close-thread')) {
        await handleCloseThread(config, game, req, res)
        return
      }
      if (url.pathname.endsWith('/saves')) {
        // GET：枚举存档元数据（不含真实路径 / source session 等内部字段）
        // Save Policy v0.2：附当前策略中文摘要与最近一次自动存档失败（若有），供存档页显形。
        const allSaves = listSaves(game.dir)
        sendJson(res, 200, {
          game: { id: game.id },
          // Restore Reliability v0.2：主列表不再平铺 pre-restore 保护档（§7.1）
          saves: allSaves.filter((save) => save.kind !== 'pre-restore'),
          // 保护档折叠区：旧时代 SAVE-NN_恢复前保护（兼容显示，不迁移不删除）
          // + 新 saves/recovery/ 系统工件（listProtections）
          protections: [
            ...allSaves
              .filter((save) => save.kind === 'pre-restore')
              .map((save) => ({
                name: save.ref,
                label: save.label,
                gameTime: save.gameTime,
                createdAt: save.createdAt,
                restorable: save.restorable
              })),
            ...listProtections(game.dir)
          ],
          policy: describeSavePolicy(readSavePolicy(game.dir)),
          autoSaveError: readPolicyState(game.dir)?.lastAutoSaveError ?? null
        })
        return
      }
      if (url.pathname.endsWith('/save')) {
        await handleSave(ctx, game, sessionId, req, res)
        return
      }
      if (url.pathname.endsWith('/restore')) {
        await handleRestore(ctx, game, sessionId, req, res)
        return
      }
      if (url.pathname.endsWith('/events')) {
        handleEvents(ctx, config, game, req, res)
        return
      }
      sendJson(res, 200, projectGame(game, config.maxFileChars))
    } catch (error) {
      logger.warn('面板投影失败: %s', error?.message ?? error)
      if (!res.headersSent) sendJson(res, 500, { error: String(error?.message ?? error) })
      else res.destroy()
    }
  }

  try {
    ctx.effect(
      () => webServer.register({ kind: 'prefix', path: '/the-world/panel', handler }),
      'the-world-panel: state route'
    )
  } catch (error) {
    // 重复挂载（同一路径已被注册）：保持惰性，不让宿主组合失败。
    logger.warn('路由注册失败（可能重复挂载）: %s', error?.message ?? error)
  }
}
