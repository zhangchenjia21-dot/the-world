/**
 * 存档工具单测（任务书 §12.2）：全部使用临时 fixture，不污染真实游戏档。
 * 运行：node --test plugins/shared/存档测试.js
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  REQUIRED_STRUCTURE,
  createSnapshot,
  inspectSave,
  listSaves,
  parseMeta,
  resolveSaveDir,
  restoreSnapshot,
  sanitizeLabel,
  withGameLock
} from './存档.js'

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'tw-save-test-'))
}

/** 建一个最小 v0.2 游戏档。 */
function makeGameDir() {
  const gameDir = makeTempDir()
  for (const relative of REQUIRED_STRUCTURE) {
    const file = path.join(gameDir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, `# ${relative.replace(/\\/g, '/')}\n`, 'utf8')
  }
  fs.writeFileSync(
    path.join(gameDir, 'state', 'CURRENT.md'),
    '# CURRENT\n\n- 时间: 中平元年三月初十夜\n- 当前位置: 巨鹿城内\n',
    'utf8'
  )
  return gameDir
}

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

test('列出现有 compatible / legacy save（§12.2-1）', () => {
  const gameDir = makeGameDir()
  const savesDir = path.join(gameDir, 'saves')

  // compatible：完整 v0.2 结构
  const good = path.join(savesDir, 'SAVE-02_暗查内坊开局')
  for (const relative of REQUIRED_STRUCTURE) {
    const file = path.join(good, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, 'x', 'utf8')
  }
  fs.writeFileSync(path.join(good, 'META.md'), '---\nsave_id: SAVE-02\nkind: manual\ngame_time: 三月初十夜\nlabel: 暗查内坊开局\n---\n', 'utf8')

  // legacy：v0.1 结构（缺 state/PLAYER.md 等）
  const old = path.join(savesDir, 'SAVE-01_架构v0.1迁移前')
  fs.mkdirSync(path.join(old, 'state', 'npcs'), { recursive: true })
  fs.writeFileSync(path.join(old, 'COMPOSITION.md'), 'x', 'utf8')
  fs.writeFileSync(path.join(old, 'META.md'), '# 存档 META\n\n- 类型: 迁移前归档\n- 建立: 2026-08-20\n', 'utf8')

  const saves = listSaves(gameDir)
  assert.equal(saves.length, 2)
  const legacy = saves.find((s) => s.id === 'SAVE-01')
  const manual = saves.find((s) => s.id === 'SAVE-02')
  assert.equal(legacy.restorable, false)
  assert.equal(legacy.kind, 'legacy')
  assert.match(legacy.reasonIfNotRestorable, /旧版归档/)
  assert.equal(manual.restorable, true)
  assert.equal(manual.kind, 'manual')
  assert.equal(manual.gameTime, '三月初十夜')
})

test('manual snapshot 内容完整且带 frontmatter META（§12.2-2）', () => {
  const gameDir = makeGameDir()
  const save = createSnapshot(gameDir, { kind: 'manual', label: '暗查内坊开局' })
  assert.equal(save.id, 'SAVE-01')
  assert.equal(save.restorable, true)
  assert.equal(save.kind, 'manual')

  const saveDir = path.join(gameDir, 'saves', 'SAVE-01_暗查内坊开局')
  for (const relative of REQUIRED_STRUCTURE) {
    assert.ok(fs.statSync(path.join(saveDir, relative)).isFile(), `缺 ${relative}`)
  }
  const meta = parseMeta(read(path.join(saveDir, 'META.md')))
  assert.equal(meta.kind, 'manual')
  assert.equal(meta.gameTime, '中平元年三月初十夜')
  assert.equal(meta.label, '暗查内坊开局')
})

test('incomplete live workspace 无法创建新快照，且不修改已有存档', () => {
  const gameDir = makeGameDir()
  const existing = createSnapshot(gameDir, { kind: 'manual', label: '已有存档' })
  const existingDir = resolveSaveDir(gameDir, existing.id)
  const existingMeta = read(path.join(existingDir, 'META.md'))
  fs.rmSync(path.join(gameDir, 'state', 'PLAYER.md'))

  assert.throws(
    () => createSnapshot(gameDir, { kind: 'manual', label: '不可恢复的新档' }),
    (error) => error?.code === 'workspace-incomplete'
  )
  assert.deepEqual(listSaves(gameDir).map((save) => save.id), [existing.id])
  assert.equal(read(path.join(existingDir, 'META.md')), existingMeta)
})

test('自动档最多保留最近 5 个，不删除 manual / milestone / pre-restore', () => {
  const gameDir = makeGameDir()
  const protectedKinds = [
    createSnapshot(gameDir, { kind: 'manual', label: '手动档' }),
    createSnapshot(gameDir, { kind: 'milestone', label: '里程碑' }),
    createSnapshot(gameDir, { kind: 'pre-restore', label: '保护档' })
  ]
  for (let turn = 1; turn <= 7; turn += 1) {
    createSnapshot(gameDir, { kind: 'auto-checkpoint', label: `第 ${turn} 玩家回合自动存档` })
  }

  const saves = listSaves(gameDir)
  assert.equal(saves.filter((save) => save.kind === 'auto-checkpoint').length, 5)
  for (const save of protectedKinds) {
    assert.ok(saves.some((candidate) => candidate.id === save.id && candidate.kind === save.kind))
  }
  assert.deepEqual(
    saves.filter((save) => save.kind === 'auto-checkpoint').map((save) => save.label),
    [3, 4, 5, 6, 7].map((turn) => `第 ${turn} 玩家回合自动存档`)
  )
})

test('saves/ 不递归复制进 save（§12.2-3）', () => {
  const gameDir = makeGameDir()
  createSnapshot(gameDir, { kind: 'manual', label: '第一份' })
  const second = createSnapshot(gameDir, { kind: 'manual', label: '第二份' })
  const secondDir = path.join(gameDir, 'saves', `${second.id}_第二份`)
  assert.equal(fs.existsSync(path.join(secondDir, 'saves')), false)
  assert.equal(fs.existsSync(path.join(secondDir, 'library')), false)
})

test('label path traversal 被清洗（§12.2-4）', () => {
  assert.equal(sanitizeLabel('../../etc/passwd'), 'etc passwd')
  assert.equal(sanitizeLabel('a\\b/c'), 'a b c')
  assert.equal(sanitizeLabel(''), '存档')
  assert.ok(sanitizeLabel('超长'.repeat(30)).length <= 24)

  const gameDir = makeGameDir()
  const save = createSnapshot(gameDir, { kind: 'manual', label: '../逃逸' })
  assert.ok(save.id.startsWith('SAVE-'))
  assert.ok(!save.label.includes('..'))
  // 目录必须落在 saves/ 内
  const savesDir = path.join(gameDir, 'saves')
  for (const entry of fs.readdirSync(savesDir)) {
    assert.ok(!entry.includes('..'))
  }

  // API 只接受枚举出的 save id，任意路径 / 逃逸形式一律拒绝
  assert.equal(resolveSaveDir(gameDir, save.id), path.join(savesDir, `${save.id}_逃逸`))
  assert.equal(resolveSaveDir(gameDir, '../..'), null)
  assert.equal(resolveSaveDir(gameDir, 'SAVE-01/../../games'), null)
  assert.equal(resolveSaveDir(gameDir, 'SAVE-99'), null)
})

test('incompatible save restore fail before mutation（§12.2-5）', () => {
  const gameDir = makeGameDir()
  const legacy = path.join(gameDir, 'saves', 'SAVE-01_旧档')
  fs.mkdirSync(legacy, { recursive: true })
  fs.writeFileSync(path.join(legacy, 'COMPOSITION.md'), 'old', 'utf8')

  const liveMarker = path.join(gameDir, 'state', 'PLAYER.md')
  const before = read(liveMarker)
  assert.throws(() => restoreSnapshot(gameDir, legacy), /旧版归档/)
  assert.equal(read(liveMarker), before, 'live state 不得被改动')
})

test('restore 前生成 pre-restore protection save（§12.2-6）', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
  // live 推进
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), '# CURRENT\n\n- 时间: 三月十二\n', 'utf8')

  const targetDir = path.join(gameDir, 'saves', `${target.id}_目标档`)
  restoreSnapshot(gameDir, targetDir)

  const saves = listSaves(gameDir)
  const protection = saves.find((s) => s.kind === 'pre-restore')
  assert.ok(protection, '必须有保护档')
  assert.match(protection.label, /恢复前保护/)
})

test('pre-restore protection 创建失败时 live workspace 零 mutation', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
  const currentPath = path.join(gameDir, 'state', 'CURRENT.md')
  fs.writeFileSync(currentPath, '# CURRENT\n\n- 时间: T5\n', 'utf8')
  fs.rmSync(path.join(gameDir, 'state', 'PLAYER.md'))
  const beforeCurrent = read(currentPath)
  const beforeSaveIds = listSaves(gameDir).map((save) => save.id)

  assert.throws(
    () => restoreSnapshot(gameDir, resolveSaveDir(gameDir, target.id)),
    (error) => error?.code === 'workspace-incomplete'
  )
  assert.equal(read(currentPath), beforeCurrent)
  assert.deepEqual(listSaves(gameDir).map((save) => save.id), beforeSaveIds)
})

test('snapshot restore 删除 T5-only live 文件（§12.2-7）', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: 'T2时点' })

  // T5-only：存档之后才出现的文件
  const t5Only = path.join(gameDir, 'state', 'characters', 'char-hankai.md')
  fs.writeFileSync(t5Only, '# 韩楷\n', 'utf8')
  fs.writeFileSync(path.join(gameDir, 'memory', 'DELTAS.md'), '# DELTAS\nT5 新事实\n', 'utf8')

  restoreSnapshot(gameDir, path.join(gameDir, 'saves', `${target.id}_T2时点`))

  assert.equal(fs.existsSync(t5Only), false, 'T5-only 文件必须消失')
  assert.equal(read(path.join(gameDir, 'memory', 'DELTAS.md')), '# memory/DELTAS.md\n', 'DELTAS 必须回到存档时点')
})

test('backup rename 中途失败不会移走尚未备份的 live 条目', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), '# CURRENT\n\n- 时间: T5\n', 'utf8')
  fs.writeFileSync(path.join(gameDir, 'story', 'T5-only.md'), '# T5\n', 'utf8')
  const before = new Map(REQUIRED_STRUCTURE.map((relative) => [relative, read(path.join(gameDir, relative))]))
  const originalRename = fs.renameSync
  let injected = false
  fs.renameSync = (from, to) => {
    if (!injected && from === path.join(gameDir, 'state') && String(to).includes('.restore-backup-')) {
      injected = true
      const error = new Error('注入 backup rename 失败')
      error.code = 'EACCES'
      throw error
    }
    return originalRename(from, to)
  }
  try {
    assert.throws(
      () => restoreSnapshot(gameDir, resolveSaveDir(gameDir, target.id)),
      (error) => error?.code === 'restore-failed'
    )
  } finally {
    fs.renameSync = originalRename
  }

  assert.equal(injected, true)
  for (const [relative, content] of before) assert.equal(read(path.join(gameDir, relative)), content, relative)
  assert.equal(read(path.join(gameDir, 'story', 'T5-only.md')), '# T5\n')
})

test('staging rename 中途失败会移除已安装快照并完整恢复旧 live', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
  fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), '# CURRENT\n\n- 时间: T5\n', 'utf8')
  fs.writeFileSync(path.join(gameDir, 'memory', 'DELTAS.md'), '# DELTAS\nT5 新事实\n', 'utf8')
  const before = new Map(REQUIRED_STRUCTURE.map((relative) => [relative, read(path.join(gameDir, relative))]))
  const originalRename = fs.renameSync
  let injected = false
  fs.renameSync = (from, to) => {
    if (!injected && path.basename(from) === 'state' && String(from).includes('.restore-staging-')) {
      injected = true
      const error = new Error('注入 staging rename 失败')
      error.code = 'EACCES'
      throw error
    }
    return originalRename(from, to)
  }
  try {
    assert.throws(
      () => restoreSnapshot(gameDir, resolveSaveDir(gameDir, target.id)),
      (error) => error?.code === 'restore-failed'
    )
  } finally {
    fs.renameSync = originalRename
  }

  assert.equal(injected, true)
  for (const [relative, content] of before) assert.equal(read(path.join(gameDir, relative)), content, relative)
})

test('saves/ 本身在 restore 后原样保留（§12.2-8）', () => {
  const gameDir = makeGameDir()
  const first = createSnapshot(gameDir, { kind: 'manual', label: '甲' })
  const second = createSnapshot(gameDir, { kind: 'manual', label: '乙' })
  restoreSnapshot(gameDir, path.join(gameDir, 'saves', `${first.id}_甲`))

  const ids = listSaves(gameDir).map((s) => s.id)
  assert.ok(ids.includes(first.id))
  assert.ok(ids.includes(second.id))
  assert.ok(ids.length === 3, '目标档 + 另一份 + pre-restore 保护档都应在')
})

test('并发第二个 save/restore 被 busy 拒绝（§12.2-9）', () => {
  const gameDir = makeGameDir()
  withGameLock(gameDir, () => {
    assert.throws(() => withGameLock(gameDir, () => {}), /正在进行/)
  })
  // 锁释放后可以再次进入
  assert.equal(withGameLock(gameDir, () => 'ok'), 'ok')
})

test('Windows path / CRLF 不导致识别失败（§12.2-10）', () => {
  const gameDir = makeGameDir()
  const saveDir = path.join(gameDir, 'saves', 'SAVE-07_CRLF档')
  for (const relative of REQUIRED_STRUCTURE) {
    const file = path.join(saveDir, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, 'x\r\n', 'utf8')
  }
  fs.writeFileSync(
    path.join(saveDir, 'META.md'),
    '---\r\nsave_id: SAVE-07\r\nkind: manual\r\ngame_time: 三月初十\r\nlabel: CRLF档\r\n---\r\n',
    'utf8'
  )
  const info = inspectSave(saveDir)
  assert.equal(info.restorable, true)
  assert.equal(info.kind, 'manual')
  assert.equal(info.gameTime, '三月初十')

  // META 完全缺失也能识别结构
  const bare = path.join(gameDir, 'saves', 'SAVE-08_裸档')
  for (const relative of REQUIRED_STRUCTURE) {
    const file = path.join(bare, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, 'x', 'utf8')
  }
  const bareInfo = inspectSave(bare)
  assert.equal(bareInfo.restorable, true)
  assert.equal(bareInfo.kind, 'auto-checkpoint')
})
