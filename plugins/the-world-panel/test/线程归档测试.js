/** 线程归档纯函数测试（DEC-B3 v1.2 窄写口的文件变换语义）。 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { cutThreadBlock, appendToLedger, archiveEntry, LEDGER_SEED } from '../lib/线程归档.js'

const THREADS = `# 乱世三国｜THREADS（悬而未决）

> 只装 open 线程。

## open

### T-03｜田石家人生死未卜
- 状态: open（长期）
- 内容: 田石父母与两妹在田家堡子焚毁夜下落不明

### T-05｜绎幕黄巾即将攻城（倒计时三五日）
- 状态: open（紧急）
- 内容: 绎幕黄巾即将攻巨鹿

### T-07｜军情叙功未兑现
- 状态: open
- 内容: 兵曹掾承诺叙功
`

test('cutThreadBlock：切出中间线程，其余原样保留', () => {
  const cut = cutThreadBlock(THREADS, 'T-05')
  assert.ok(cut)
  assert.equal(cut.title, '绎幕黄巾即将攻城（倒计时三五日）')
  assert.match(cut.block, /^### T-05/)
  assert.match(cut.block, /open（紧急）/)
  assert.doesNotMatch(cut.remaining, /T-05/)
  assert.match(cut.remaining, /T-03/)
  assert.match(cut.remaining, /T-07/)
})

test('cutThreadBlock：切末尾线程', () => {
  const cut = cutThreadBlock(THREADS, 'T-07')
  assert.ok(cut)
  assert.doesNotMatch(cut.remaining, /T-07/)
  assert.doesNotMatch(cut.remaining, /\n{3,}/)
})

test('cutThreadBlock：不存在 / 非法 id 返回 null', () => {
  assert.equal(cutThreadBlock(THREADS, 'T-99'), null)
  assert.equal(cutThreadBlock(THREADS, '../../etc/passwd'), null)
  assert.equal(cutThreadBlock(THREADS, ''), null)
  assert.equal(cutThreadBlock(THREADS, 'T-03｜田石'), null)
})

test('appendToLedger：新开节日期归档，再次归档并入当天节', () => {
  const cut = cutThreadBlock(THREADS, 'T-03')
  const entry = archiveEntry(cut, '2026-08-24')
  assert.match(entry, /### T-03｜田石家人生死未卜/)
  assert.match(entry, /归档: 2026-08-24/)

  let ledger = appendToLedger(LEDGER_SEED, entry, '2026-08-24')
  assert.match(ledger, /## 面板归档 · 2026-08-24/)

  const cut2 = cutThreadBlock(THREADS, 'T-05')
  ledger = appendToLedger(ledger, archiveEntry(cut2, '2026-08-24'), '2026-08-24')
  assert.equal((ledger.match(/## 面板归档/g) ?? []).length, 1)
  assert.match(ledger, /T-03/)
  assert.match(ledger, /T-05/)
  // 归档条目在原块之后、不改变 LEDGER 卷首
  assert.ok(ledger.indexOf('# story/LEDGER') < ledger.indexOf('T-03'))
})

test('appendToLedger：跨天开新节，不动已有节', () => {
  const cut = cutThreadBlock(THREADS, 'T-03')
  let ledger = appendToLedger(LEDGER_SEED, archiveEntry(cut, '2026-08-24'), '2026-08-24')
  const cut2 = cutThreadBlock(THREADS, 'T-05')
  ledger = appendToLedger(ledger, archiveEntry(cut2, '2026-08-25'), '2026-08-25')
  assert.match(ledger, /## 面板归档 · 2026-08-24/)
  assert.match(ledger, /## 面板归档 · 2026-08-25/)
  assert.ok(ledger.indexOf('2026-08-24') < ledger.indexOf('2026-08-25'))
})
