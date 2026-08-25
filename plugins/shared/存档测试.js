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
  RECOVERY_DIR,
  POLICY_STATE_FILE,
  createSnapshot,
  inspectSave,
  listSaves,
  listProtections,
  parseMeta,
  resolveSaveDir,
  resolveSaveRef,
  resolveSaveDirMatches,
  restoreSnapshot,
  sanitizeLabel,
  sanitizeMilestoneLabel,
  withGameLock,
  readPolicyState,
  syncPolicyState,
  recordPlayerTurn,
  markMilestone,
  recordAutoSaveSuccess,
  recordAutoSaveFailure
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

  // Restore Reliability v0.2：保护档进 saves/recovery/ 系统 namespace，不进玩家主列表
  assert.equal(listSaves(gameDir).some((s) => s.kind === 'pre-restore'), false, '主列表不得平铺保护档')
  const protections = listProtections(gameDir)
  assert.equal(protections.length, 1, '必须有一份保护档')
  assert.match(protections[0].label, /恢复前保护/)
  assert.equal(protections[0].restorable, true)
  assert.ok(fs.existsSync(path.join(gameDir, 'saves', RECOVERY_DIR, protections[0].name)))
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
  assert.deepEqual(ids.sort(), [first.id, second.id].sort(), '主列表只剩目标档 + 另一份 manual 存档')
  assert.equal(listProtections(gameDir).length, 1, '保护档在 saves/recovery/，不占玩家存档编号')
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

/** ── Save Policy v0.2：POLICY_STATE.json 执行簿记（任务 §4/§5/§12）────────── */

const 每5策略 = { manual: true, milestone: false, interval: 5 }
const 仅里程碑策略 = { manual: true, milestone: true, interval: null }
const 混合策略 = { manual: true, milestone: true, interval: 10 }
const 手动策略 = { manual: true, milestone: false, interval: null }

test('POLICY_STATE：缺失 / 损坏 / 版本不符都 fail-safe 返回 null（§4）', () => {
  const gameDir = makeGameDir()
  assert.equal(readPolicyState(gameDir), null)

  const file = path.join(gameDir, 'saves', POLICY_STATE_FILE)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '{ 这不是 JSON', 'utf8')
  assert.equal(readPolicyState(gameDir), null)

  fs.writeFileSync(file, JSON.stringify({ version: 99, totalPlayerTurns: 7 }), 'utf8')
  assert.equal(readPolicyState(gameDir), null)
})

test('POLICY_STATE：sync 按当前策略安全初始化，不碰世界文件（§4）', () => {
  const gameDir = makeGameDir()
  const state = syncPolicyState(gameDir, 每5策略)
  assert.equal(state.totalPlayerTurns, 0)
  assert.equal(state.intervalProgress, 0)
  assert.ok(state.policyFingerprint.includes('interval:5'))
  // 落盘且可复读
  assert.deepEqual(readPolicyState(gameDir), state)
})

test('recordPlayerTurn：每回合只 +1，到达间隔即 due（§5）', () => {
  const gameDir = makeGameDir()
  for (let turn = 1; turn <= 4; turn += 1) {
    const { state, intervalDue } = recordPlayerTurn(gameDir, 每5策略)
    assert.equal(state.totalPlayerTurns, turn)
    assert.equal(intervalDue, false)
  }
  const fifth = recordPlayerTurn(gameDir, 每5策略)
  assert.equal(fifth.intervalDue, true)
  assert.equal(fifth.state.intervalProgress, 5)

  // 无 interval 策略永不 due
  const manual = makeGameDir()
  assert.equal(recordPlayerTurn(manual, 手动策略).intervalDue, false)
  assert.equal(recordPlayerTurn(manual, 仅里程碑策略).intervalDue, false)
})

test('policy 指纹变化：intervalProgress 清零、totalPlayerTurns 保留（§4/§12-19/20）', () => {
  const gameDir = makeGameDir()
  for (let turn = 0; turn < 4; turn += 1) recordPlayerTurn(gameDir, 每5策略)

  // 玩家改策略：每 5 → 每 10
  const changed = syncPolicyState(gameDir, { manual: true, milestone: false, interval: 10 })
  assert.equal(changed.intervalProgress, 0)
  assert.equal(changed.totalPlayerTurns, 4, '真实玩家交互计数不因策略改变回滚')

  // 新策略下重新累计
  assert.equal(recordPlayerTurn(gameDir, { manual: true, milestone: false, interval: 10 }).state.intervalProgress, 1)
})

test('policy 指纹变化：新策略不含 milestone 时清掉 pending milestone（§4）', () => {
  const gameDir = makeGameDir()
  recordPlayerTurn(gameDir, 混合策略)
  markMilestone(gameDir, 混合策略, '升任屯长 · 暗查内坊')
  assert.ok(readPolicyState(gameDir).pendingMilestone)

  const cleared = syncPolicyState(gameDir, 每5策略)
  assert.equal(cleared.pendingMilestone, null)

  // 新策略仍含 milestone：pending 保留
  const gameDir2 = makeGameDir()
  recordPlayerTurn(gameDir2, 混合策略)
  markMilestone(gameDir2, 混合策略, '绎幕侦巡完成')
  const kept = syncPolicyState(gameDir2, 仅里程碑策略)
  assert.equal(kept.pendingMilestone.label, '绎幕侦巡完成')
})

test('markMilestone：策略不含 milestone 时明确 ignored，不写文件（§6/§12-14）', () => {
  const gameDir = makeGameDir()
  recordPlayerTurn(gameDir, 每5策略)
  const before = readPolicyState(gameDir)
  const result = markMilestone(gameDir, 每5策略, '不该被记录')
  assert.equal(result.marked, false)
  assert.equal(result.reason, 'policy-without-milestone')
  assert.deepEqual(readPolicyState(gameDir), before)
})

test('markMilestone：同一回合多次 signal 合并为一条（§6/§12-16）', () => {
  const gameDir = makeGameDir()
  recordPlayerTurn(gameDir, 仅里程碑策略)
  const first = markMilestone(gameDir, 仅里程碑策略, '升任屯长')
  const second = markMilestone(gameDir, 仅里程碑策略, '换个说法')
  assert.equal(first.marked, true)
  assert.equal(first.coalesced, false)
  assert.equal(second.marked, true)
  assert.equal(second.coalesced, true)
  assert.equal(readPolicyState(gameDir).pendingMilestone.label, '升任屯长', '保留首个 label')
})

test('milestone label 清洗：换行 / 控制字符去除，截断 48 字，空标签拒绝（§6/§12-15）', () => {
  assert.equal(sanitizeMilestoneLabel('升任屯长\n暗查内坊'), '升任屯长 暗查内坊')
  assert.equal(sanitizeMilestoneLabel('a\0b\tc'), 'a b c')
  assert.equal(sanitizeMilestoneLabel('  '), null)
  assert.equal(sanitizeMilestoneLabel(null), null)
  assert.equal(sanitizeMilestoneLabel('很长'.repeat(30)).length, 48)

  const gameDir = makeGameDir()
  recordPlayerTurn(gameDir, 仅里程碑策略)
  assert.equal(markMilestone(gameDir, 仅里程碑策略, '\n\n').marked, false)
})

test('自动档失败记录 lastAutoSaveError；成功后清除并重置进度（§7/§12-24）', () => {
  const gameDir = makeGameDir()
  for (let turn = 0; turn < 5; turn += 1) recordPlayerTurn(gameDir, 每5策略)

  const failed = recordAutoSaveFailure(gameDir, 每5策略, '游戏工作区不完整，无法建立可恢复存档：缺少 story/LEDGER.md')
  assert.match(failed.lastAutoSaveError, /工作区不完整/)
  assert.equal(failed.intervalProgress, 5, '失败不清零进度，下回合重试')

  const succeeded = recordAutoSaveSuccess(gameDir, 每5策略)
  assert.equal(succeeded.lastAutoSaveError, null)
  assert.equal(succeeded.intervalProgress, 0)
  assert.equal(succeeded.totalPlayerTurns, 5)
})

test('POLICY_STATE.json 不进入 snapshot（§4：执行簿记不是世界真相）', () => {
  const gameDir = makeGameDir()
  recordPlayerTurn(gameDir, 每5策略)
  const save = createSnapshot(gameDir, { kind: 'manual', label: '检查簿记隔离' })
  const saveDir = resolveSaveDir(gameDir, save.id)
  assert.equal(fs.existsSync(path.join(saveDir, 'saves')), false)
  assert.equal(fs.existsSync(path.join(saveDir, POLICY_STATE_FILE)), false)
})

/** ── Restore Reliability v0.2（任务 §13）：exact ref / recovery namespace ───── */

/** 测试内递归复制（禁用 fs.cpSync：Node v24 Windows 中文路径静默复制空目录）。 */
function copyDirRecursiveForTest(from, to) {
  fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const sourcePath = path.join(from, entry.name)
    const targetPath = path.join(to, entry.name)
    if (entry.isDirectory()) copyDirRecursiveForTest(sourcePath, targetPath)
    else if (entry.isFile()) fs.copyFileSync(sourcePath, targetPath)
  }
}

/** 真实试玩档的 duplicate SAVE-04（只读复制进临时 fixture，绝不修改原档）。 */
const REAL_SAVES_DIR = path.resolve(import.meta.dirname, '..', '..', 'games', 'luan-shi-sanguo-2', 'saves')
const REAL_PROTECTION_NAME = 'SAVE-04_恢复前保护 · 东汉 · 中平元年（184 年）'
const REAL_MILESTONE_NAME = 'SAVE-04_隶义兵籍入张庄共谋'

test('真实 duplicate SAVE-04：exact ref 区分并精确恢复里程碑档（§12/§13-1/3/11）', (t) => {
  if (
    !fs.existsSync(path.join(REAL_SAVES_DIR, REAL_PROTECTION_NAME)) ||
    !fs.existsSync(path.join(REAL_SAVES_DIR, REAL_MILESTONE_NAME))
  ) {
    t.skip('真实 duplicate SAVE-04 fixture 不在本机')
    return
  }
  const gameDir = makeGameDir()
  const savesDir = path.join(gameDir, 'saves')
  copyDirRecursiveForTest(path.join(REAL_SAVES_DIR, REAL_PROTECTION_NAME), path.join(savesDir, REAL_PROTECTION_NAME))
  copyDirRecursiveForTest(path.join(REAL_SAVES_DIR, REAL_MILESTONE_NAME), path.join(savesDir, REAL_MILESTONE_NAME))
  // 临时副本补齐 v0.2 结构：真实里程碑档是旧时代模型直写，缺 state/characters/INDEX.md
  const milestoneIndex = path.join(savesDir, REAL_MILESTONE_NAME, 'state', 'characters', 'INDEX.md')
  fs.mkdirSync(path.dirname(milestoneIndex), { recursive: true })
  fs.writeFileSync(milestoneIndex, '# INDEX\n', 'utf8')

  // §12-1：同编号两者同时枚举且 ref 不同
  const dup = listSaves(gameDir).filter((save) => save.id === 'SAVE-04')
  assert.equal(dup.length, 2)
  assert.deepEqual(new Set(dup.map((save) => save.ref)), new Set([REAL_PROTECTION_NAME, REAL_MILESTONE_NAME]))

  // exact ref 各自精确命中
  assert.equal(resolveSaveRef(gameDir, REAL_MILESTONE_NAME), path.join(savesDir, REAL_MILESTONE_NAME))
  assert.equal(resolveSaveRef(gameDir, REAL_PROTECTION_NAME), path.join(savesDir, REAL_PROTECTION_NAME))

  // §12-3 / §13-11：选择里程碑档时精确恢复里程碑档，不能误命中同 id 的保护档
  const milestoneMarker = read(path.join(savesDir, REAL_MILESTONE_NAME, 'state', 'CURRENT.md'))
  const protectionMarker = read(path.join(savesDir, REAL_PROTECTION_NAME, 'state', 'CURRENT.md'))
  assert.notEqual(milestoneMarker, protectionMarker, 'fixture 两个目录内容必须可区分')
  restoreSnapshot(gameDir, resolveSaveRef(gameDir, REAL_MILESTONE_NAME))
  assert.equal(read(path.join(gameDir, 'state', 'CURRENT.md')), milestoneMarker, '必须恢复里程碑档而非同 id 保护档')

  // §12-4：旧 saveId 语义下多匹配（Panel 据此返回 save-id-ambiguous，绝不「取第一个」）
  assert.equal(resolveSaveDirMatches(gameDir, 'SAVE-04').length, 2)
})

test('resolveSaveRef：非法 ref / 路径穿越一律拒绝（§13-3）', () => {
  const gameDir = makeGameDir()
  const save = createSnapshot(gameDir, { kind: 'manual', label: '目标' })
  const savesDir = path.join(gameDir, 'saves')
  assert.equal(resolveSaveRef(gameDir, save.ref), path.join(savesDir, save.ref))
  const rejected = [
    'SAVE-01/../../games',
    '../..',
    'SAVE-01/x',
    'SAVE-01\\x',
    'SAVE-01_..',
    'PRE-RESTORE-20260825T000000-001',
    'SAVE-aa',
    'SAVE-99_不存在',
    ''
  ]
  for (const bad of rejected) {
    assert.equal(resolveSaveRef(gameDir, bad), null, bad)
  }
  // 绝对路径形式
  assert.equal(resolveSaveRef(gameDir, path.join(savesDir, save.ref)), null, '绝对路径必须拒绝')
})

test('nextSaveId：所有 SAVE 前缀目录都占编号（§5/§13-4）', () => {
  const gameDir = makeGameDir()
  const savesDir = path.join(gameDir, 'saves')
  // duplicate / legacy / 损坏（空目录）都占用编号
  for (const name of ['SAVE-04_A', 'SAVE-04_B', 'SAVE-09_legacy']) {
    fs.mkdirSync(path.join(savesDir, name), { recursive: true })
  }
  const save = createSnapshot(gameDir, { kind: 'manual', label: '新档' })
  assert.equal(save.id, 'SAVE-10')
})

test('protection 不消耗 SAVE 编号且不进 snapshot（§13-6/20）', () => {
  const gameDir = makeGameDir()
  const first = createSnapshot(gameDir, { kind: 'manual', label: '一' })
  const second = createSnapshot(gameDir, { kind: 'manual', label: '二' })
  assert.equal(first.id, 'SAVE-01')
  assert.equal(second.id, 'SAVE-02')

  restoreSnapshot(gameDir, resolveSaveRef(gameDir, first.ref))
  assert.equal(listProtections(gameDir).length, 1)

  // 保护档不占玩家编号：下一份 manual 仍是 SAVE-03
  const third = createSnapshot(gameDir, { kind: 'manual', label: '三' })
  assert.equal(third.id, 'SAVE-03')

  // saves/（含 recovery/）不进入任何快照
  const thirdDir = path.join(gameDir, 'saves', third.ref)
  assert.equal(fs.existsSync(path.join(thirdDir, 'saves')), false)
})

test('protection rotation：只保留最近 3 份（§7.2/§13-8）', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '基准' })
  const targetDir = resolveSaveRef(gameDir, target.ref)
  for (let round = 0; round < 4; round += 1) {
    fs.writeFileSync(path.join(gameDir, 'state', 'CURRENT.md'), `# CURRENT\n\n- 时间: 第${round}轮\n`, 'utf8')
    restoreSnapshot(gameDir, targetDir)
  }
  const protections = listProtections(gameDir)
  assert.equal(protections.length, 3, '4 次成功 restore 后只留最近 3 份保护档')
  const recoveryEntries = fs
    .readdirSync(path.join(gameDir, 'saves', RECOVERY_DIR))
    .filter((name) => name.startsWith('PRE-RESTORE-'))
  assert.equal(recoveryEntries.length, 3)
})

test('restore 失败且 rollback 完整时删除本次 protection（§7.3/§13-9）', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
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
      () => restoreSnapshot(gameDir, resolveSaveRef(gameDir, target.ref)),
      (error) => error?.code === 'restore-failed'
    )
  } finally {
    fs.renameSync = originalRename
  }
  assert.equal(injected, true)
  assert.equal(listProtections(gameDir).length, 0, 'rollback 完整时本次 protection 必须删除')
  // live 完整回滚
  assert.equal(read(path.join(gameDir, 'state', 'CURRENT.md')), '# CURRENT\n\n- 时间: 中平元年三月初十夜\n- 当前位置: 巨鹿城内\n')
})

test('rollback 不完整时保留 protection 与恢复材料（§7.3/§13-10）', () => {
  const gameDir = makeGameDir()
  const target = createSnapshot(gameDir, { kind: 'manual', label: '目标档' })
  const originalRename = fs.renameSync
  let phase = 0
  fs.renameSync = (from, to) => {
    // 第一次 staging 安装失败
    if (phase === 0 && path.basename(from) === 'state' && String(from).includes('.restore-staging-')) {
      phase = 1
      const error = new Error('注入 staging rename 失败')
      error.code = 'EACCES'
      throw error
    }
    // rollback 把 backup 的 state 移回 live 时也失败 → 不完整
    if (phase === 1 && path.basename(from) === 'state' && String(from).includes('.restore-backup-')) {
      phase = 2
      const error = new Error('注入 rollback rename 失败')
      error.code = 'EACCES'
      throw error
    }
    return originalRename(from, to)
  }
  try {
    assert.throws(
      () => restoreSnapshot(gameDir, resolveSaveRef(gameDir, target.ref)),
      (error) => error?.code === 'restore-failed' && /未完整完成/.test(error.message)
    )
  } finally {
    fs.renameSync = originalRename
  }
  assert.equal(phase, 2)
  assert.equal(listProtections(gameDir).length, 1, 'rollback 不完整时 protection 必须保留')
  const leftovers = fs.readdirSync(gameDir).filter((name) => name.startsWith('.restore-'))
  assert.ok(leftovers.length > 0, 'staging/backup 恢复材料必须保留供人工恢复')
})
