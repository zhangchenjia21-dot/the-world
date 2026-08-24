/**
 * 线程归档：DEC-B3 v1.2 唯一窄写口的纯函数部分。
 *
 * 语义：把 state/THREADS.md 中指定 `### T-xx` 线程块原样移出，
 * 追加到 story/LEDGER.md 的「面板归档」节下——遵循 THREADS.md 自己的约定
 * （「closed 线程归档入 story/LEDGER.md（历史）」）。归档不是删除：内容可追溯、可恢复。
 *
 * 本模块不 import cordis / schemastery，可在仓库内直接 node --test。
 */

export const THREAD_ID_PATTERN = /^[A-Za-z]+-\d+$/

// 注意尾部 \r?：游戏文件是 CRLF，按 \n 切行后行尾残留 \r，
// 而 . 不匹配 \r（line terminator），不写 \r? 会导致 (.+)$ 永远失配。
const THREAD_HEADING = /^###\s+([A-Za-z]+-\d+)\s*[｜|]\s*(.+?)\r?$/

/**
 * 从 THREADS.md 文本中切出指定线程块。
 * @returns {{ id: string, title: string, block: string, remaining: string } | null}
 *   block 含 ### 标题行的完整原文（去掉尾部空行）；null = 线程不存在。
 */
export function cutThreadBlock(threadsText, threadId) {
  if (!THREAD_ID_PATTERN.test(threadId ?? '')) return null
  const lines = threadsText.split('\n')
  let start = -1
  let title = ''
  for (let i = 0; i < lines.length; i++) {
    const m = THREAD_HEADING.exec(lines[i])
    if (m && m[1] === threadId) {
      start = i
      title = m[2].trim()
      break
    }
  }
  if (start === -1) return null

  // 块的结束：下一个同级或更高级标题（## / ###），或 EOF
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{2,3}\s/.test(lines[i])) {
      end = i
      break
    }
  }

  const blockLines = lines.slice(start, end)
  // 去掉块尾空行，保持 remaining 不多出连续空行
  while (blockLines.length > 1 && blockLines[blockLines.length - 1].trim() === '') blockLines.pop()

  const remainingLines = [...lines.slice(0, start), ...lines.slice(end)]
  // 收拢因切走块产生的 3+ 连续空行
  const remaining = remainingLines.join('\n').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '\n')

  return { id: threadId, title, block: blockLines.join('\n'), remaining }
}

/** 生成 LEDGER 归档条目：原块保留 + 归档注记行。 */
export function archiveEntry(thread, dateStr) {
  return `${thread.block}\n- 归档: ${dateStr} 玩家面板关闭（自 THREADS 移入，原 open 线程不再追踪）`
}

const ARCHIVE_HEADING_PREFIX = '## 面板归档'

/**
 * 把归档条目追加到 LEDGER 文本。
 * 当天已有「## 面板归档 · <date>」节则并入该节末尾，否则在文末新开一节。
 */
export function appendToLedger(ledgerText, entry, dateStr) {
  const heading = `${ARCHIVE_HEADING_PREFIX} · ${dateStr}`
  const base = (ledgerText ?? '').trimEnd()

  const headingIndex = base.indexOf(heading)
  if (headingIndex !== -1) {
    // 找该节结束位置（下一个 ## 标题或 EOF），把条目插到节尾
    const rest = base.slice(headingIndex + heading.length)
    const nextHeading = /^##\s/m.exec(rest)
    const insertAt = nextHeading ? headingIndex + heading.length + nextHeading.index : base.length
    const before = base.slice(0, insertAt).trimEnd()
    const after = base.slice(insertAt).replace(/^\s+/, '\n\n')
    return `${before}\n\n${entry}\n${after}`.trimEnd() + '\n'
  }

  return `${base}\n\n${heading}\n\n${entry}\n`
}

/** 新建 LEDGER.md 时的卷首（与既有台账格式一致）。 */
export const LEDGER_SEED = '# story/LEDGER｜事件台账\n\n本局重要事件、承诺、债务与后果的长期记录。current reality 以 state/CURRENT.md 为准。\n'
