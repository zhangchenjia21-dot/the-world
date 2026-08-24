#!/usr/bin/env node
/**
 * 掷骰｜窄确定性 RNG 工具（The World tools/）
 *
 * 为什么存在：模型自称的骰点不真随机且系统性偏袒玩家。
 * 启用《判定与检定》包后，一切检定骰面只能来自本工具的真实输出。
 *
 * 用法：
 *   node tools/掷骰.mjs 1d20        一个 20 面骰
 *   node tools/掷骰.mjs 1d20+4      带修正值（可负）
 *   node tools/掷骰.mjs 3d6         多骰求和
 *   node tools/掷骰.mjs 1d20+4 adv  优势：掷两个取高
 *   node tools/掷骰.mjs 1d20+4 dis  劣势：掷两个取低
 */
import { randomInt } from 'node:crypto'

const usage = `用法: node tools/掷骰.mjs <骰式> [adv|dis]
  骰式: NdM 或 NdM±K，例如 1d20、3d6、1d20+4、2d10-1
  adv = 优势（仅 d20 检定用，掷两次取高）；dis = 劣势（取低）`

function fail(msg) {
  console.error(`错误: ${msg}\n${usage}`)
  process.exit(1)
}

const expr = process.argv[2]
const mode = process.argv[3]

if (!expr) fail('缺少骰式')
if (mode && !['adv', 'dis'].includes(mode)) fail(`未知模式 "${mode}"（只支持 adv / dis）`)

const m = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/i)
if (!m) fail(`无法解析骰式 "${expr}"`)

const count = m[1] ? Number(m[1]) : 1
const sides = Number(m[2])
const modifier = m[3] ? Number(m[3]) : 0

if (!Number.isInteger(count) || count < 1 || count > 100) fail(`骰数须在 1–100 之间（收到 ${count}）`)
if (!Number.isInteger(sides) || sides < 2 || sides > 1000) fail(`面数须在 2–1000 之间（收到 ${sides}）`)
if (mode && count !== 1) fail('adv/dis 只用于单骰检定（1dM）')

const rollOnce = () => Array.from({ length: count }, () => randomInt(1, sides + 1))

const modeText = mode === 'adv' ? '优势（取高）' : mode === 'dis' ? '劣势（取低）' : null
console.log(`掷骰: ${count}d${sides}${modifier ? (modifier > 0 ? `+${modifier}` : modifier) : ''}${modeText ? ` ${modeText}` : ''}`)

let dice = rollOnce()
if (mode) {
  const second = rollOnce()
  const sumA = dice[0]
  const sumB = second[0]
  const keepHigh = mode === 'adv'
  const picked = keepHigh ? Math.max(sumA, sumB) : Math.min(sumA, sumB)
  console.log(`骰面: [${sumA}, ${sumB}] 取 ${picked}`)
  dice = [picked]
} else {
  console.log(`骰面: [${dice.join(', ')}]`)
}

const subtotal = dice.reduce((a, b) => a + b, 0)
if (modifier) console.log(`修正: ${modifier > 0 ? '+' : ''}${modifier}`)
console.log(`总计: ${subtotal + modifier}`)
