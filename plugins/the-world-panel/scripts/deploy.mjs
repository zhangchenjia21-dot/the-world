#!/usr/bin/env node
/**
 * the-world-panel 部署脚本：把 The World 插件（含构建产物）接入 DSH 部署根。
 * 可重复执行（幂等）。用法：
 *
 *   node plugins/the-world-panel/scripts/deploy.mjs [部署根]
 *
 * 默认部署根：D:\AI\deepseekharness（可用参数覆盖，便于测试）。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const deployRoot = path.resolve(process.argv[2] ?? 'D:/AI/deepseekharness')
const dshHome = path.join(os.homedir(), '.dsh')
const profileRoot = path.join(dshHome, 'profiles', 'web')
const presetTarget = path.join(dshHome, '.agent-presets', 'the-world')

const SYNC_DIRS = ['plugins/the-world-core', 'plugins/shared', 'plugins/the-world-panel']

function step(message) {
  console.log(`\n== ${message}`)
}

function syncDir(relative) {
  const source = path.join(repoRoot, relative)
  const target = path.join(deployRoot, relative)
  if (!fs.existsSync(source)) throw new Error(`源目录不存在：${source}`)
  // 先删后拷，避免已删除文件残留在部署副本中。junction 只删链接本身。
  if (fs.existsSync(target)) {
    const stat = fs.lstatSync(target)
    if (stat.isSymbolicLink()) fs.rmSync(target)
    else fs.rmSync(target, { recursive: true })
  }
  fs.cpSync(source, target, {
    recursive: true,
    filter: (src) => !`${src}`.includes(`${path.sep}node_modules${path.sep}`)
  })
  console.log(`synced ${relative} -> ${target}`)
}

/** 建立目录 junction（Windows 无需管理员权限）；已存在且指向正确目标则跳过。 */
function ensureJunction(link, target) {
  if (fs.existsSync(link)) {
    try {
      if (fs.lstatSync(link).isSymbolicLink() && path.resolve(fs.readlinkSync(link)) === path.resolve(target)) {
        console.log(`junction ok: ${link}`)
        return
      }
    } catch {
      // 读不出目标：按重建处理
    }
    throw new Error(`路径已被占用且不是指向目标的 junction：${link}`)
  }
  fs.mkdirSync(path.dirname(link), { recursive: true })
  fs.symlinkSync(target, link, 'junction')
  console.log(`junction created: ${link} -> ${target}`)
}

step('构建 the-world-panel client bundle')
const build = spawnSync('npm', ['run', 'build:panel'], { cwd: repoRoot, shell: true, stdio: 'inherit' })
if (build.status !== 0) throw new Error('构建失败')
const bundle = path.join(repoRoot, 'plugins/the-world-panel/lib/client.js')
if (!fs.existsSync(bundle)) throw new Error(`构建产物缺失：${bundle}`)

step(`同步插件到部署根 ${deployRoot}`)
for (const relative of SYNC_DIRS) syncDir(relative)

step('同步 the-world preset')
const presetSource = path.join(repoRoot, 'plugins/the-world-core/preset')
fs.mkdirSync(presetTarget, { recursive: true })
for (const entry of fs.readdirSync(presetSource)) {
  fs.copyFileSync(path.join(presetSource, entry), path.join(presetTarget, entry))
  console.log(`preset file: ${entry}`)
}

step('建立包名解析 junction')
const panelTarget = path.join(deployRoot, 'plugins', 'the-world-panel')
ensureJunction(path.join(profileRoot, 'node_modules', 'the-world-panel'), panelTarget)
ensureJunction(path.join(deployRoot, 'node_modules', 'the-world-panel'), panelTarget)

console.log(`
完成。下一步：
  1. 重启 DSH Web（start-dsh.bat）；
  2. 打开 the-world preset 的游戏会话（或新建）；
  3. 刷新一次页面——「世界」tab 应自动出现在 better-sidebar 并打开。
注意：若 DSH 正在运行，旧进程不会加载新插件；preset 改动只影响新会话。`)
