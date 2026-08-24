// the-world-panel 客户端 bundle 构建配置（DEC-B5：构建链进仓库，对齐 DSH 的 tsdown）。
//
// 产物形态：DSH client module 的惰性 CJS 表契约——
//   window.__ModuleLoader__.load({ id, factory })
// 执行 bundle 只登记 factory；模块体副作用（含样式注入）在物化时运行。
// 用 rolldown 的 banner/footer 把 cjs 产物包进 factory 闭包：
// 对外部模块的 require(...) 调用解析为 factory 参数（宿主模块表），
// 返回值即导出表层（{ name, inject, apply }）。
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { client: 'src/client/index.jsx' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  target: 'chrome120',
  sourcemap: true,
  minify: false,
  // outDir 同时存放手维护的 Node 半（lib/index.js），禁止构建时清空目录。
  clean: false,
  // 统一基座由外壳播种（React / jsx-runtime），不打包、不声明 external。
  deps: { neverBundle: ['react', 'react-dom', 'react/jsx-runtime'] },
  outputOptions: {
    entryFileNames: '[name].js',
    banner: 'window.__ModuleLoader__.load({\n  id: "the-world-panel",\n  factory: (require) => {\n  var module = { exports: {} };\n  var exports = module.exports;',
    footer: '  return module.exports;\n  }\n})'
  }
})
