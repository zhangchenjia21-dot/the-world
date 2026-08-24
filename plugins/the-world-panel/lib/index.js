/**
 * the-world-panel — The World 只读游戏面板（Gate B 首个 RPG 体验插件）Node 半。
 *
 * 职责：经 DSH webServer 前缀路由把当前 game 的四个稳定 Owner
 * （state/PLAYER.md、state/characters/、mechanics/<id>/STATE.md、state/THREADS.md）
 * 投影为 JSON，并用 fs.watch + SSE 提供「回合结束后刷新」信号。
 *
 * 硬边界（DEC-B3）：本模块对游戏文件只有读取，不存在任何写路径；
 * 只投影活档案（state/ 与 mechanics/ 的当前文件），不读 saves/ 历史快照。
 *
 * 挂载方式：the-world preset 行（agent.cordis.yml）。不硬 inject webServer——
 * preset 也会在无 Web 宿主的平面被挂载校验（check-preset 夹具 / CLI），
 * 硬 inject 会让整个 preset 挂载永久等待；webServer 缺失时本插件静默不注册路由。
 */
import fs from 'node:fs'
import path from 'node:path'
import z from '@deepseek-ai/schemastery'
import { resolveSessionPreset } from '@deepseek-ai/dsh-agent-presets'
import { resolveGame, readBounded } from '../../shared/游戏定位.js'

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
  for (const item of [player, threads, composition]) {
    if (typeof item?.mtime === 'number') mtimes.push(item.mtime)
  }

  return {
    game: { id: game.id, updatedAt: mtimes.length ? Math.max(...mtimes) : null },
    player,
    threads,
    composition,
    charactersIndex,
    characters,
    mechanics
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
