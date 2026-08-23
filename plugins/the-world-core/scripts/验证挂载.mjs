/* the-world preset 挂载校验夹具（真实挂载冒烟）。
 * 模式复用部署根目录的 run-check.mjs：在独立进程中挂载与真实 web 等价的
 * 宿主平面（dsh-base 全部行 + agentPresets 服务，含 user preset 根），
 * 再由 check-preset.mjs 对 the-world preset 做真实组合校验。
 * 用法：在 D:\AI\deepseekharness 下运行 `node plugins/the-world-core/scripts/验证挂载.mjs`。 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import * as yaml from "js-yaml";
import { Context } from "@deepseek-ai/cordis";
import Loader from "@deepseek-ai/cordis-plugin-loader";
import Group from "@deepseek-ai/cordis-plugin-group";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";

const deployRoot = path.resolve(process.cwd());
if (!fs.existsSync(path.join(deployRoot, "node_modules/@deepseek-ai/dsh-base/cordis.patch.yml"))) {
	console.error("请在 DSH 部署根目录（含 node_modules/@deepseek-ai/dsh-base）下运行本脚本");
	process.exit(1);
}

// 与 dsh-app-boot 同款：支持 `!!js` 表达式节点的 YAML 方言
const JsExpr = new yaml.Type("tag:yaml.org,2002:js", {
	kind: "scalar",
	resolve: (data) => typeof data === "string",
	construct: (data) => ({ __jsExpr: data }),
	predicate: (obj) => obj !== null && typeof obj === "object" && "__jsExpr" in obj,
	represent: (obj) => obj["__jsExpr"]
});
const entrySchema = yaml.JSON_SCHEMA.extend(JsExpr);

const basePatch = yaml.load(
	fs.readFileSync(path.join(deployRoot, "node_modules/@deepseek-ai/dsh-base/cordis.patch.yml"), "utf8"),
	{ schema: entrySchema }
);
const baseEntries = [];
for (const patch of basePatch) {
	if (Array.isArray(patch.insert)) baseEntries.push(...patch.insert);
	else if (patch && typeof patch === "object" && patch.id !== void 0) baseEntries.push(patch);
}

const ctx = new Context();
ctx.baseUrl = pathToFileURL(deployRoot + "/").href;
ctx.provide("dshHomePath", dshHomePath);
await ctx.plugin(Loader);
// 与 mountRootInclude 一致：注册 cordis:group / cordis:include 内建
ctx.loader.builtins.group = Group;

for (const entry of baseEntries) await ctx.loader.create(entry);

await ctx.loader.create({
	id: "agent-presets",
	name: "@deepseek-ai/dsh-agent-presets",
	config: {
		default: "standard",
		roots: [{ path: path.join(deployRoot, "node_modules/@deepseek-ai/dsh/config/agent-presets"), trust: "system" }]
		// includeUserRoot 默认 true：自动追加 ~/.dsh/.agent-presets（user 根，the-world 所在处）
	}
});
await ctx.loader.create({
	id: "the-world-preset-check",
	name: pathToFileURL(path.join(deployRoot, "plugins/the-world-core/scripts/check-preset.mjs")).href
});

try {
	await Promise.race([
		ctx.loader.await(),
		new Promise((_, reject) => setTimeout(() => reject(new Error("loader settle timeout")), 120000))
	]);
	console.log("tree settled without check row exiting (unexpected)");
	process.exit(1);
} catch (error) {
	console.error("TREE_SETTLE_FAIL " + (error && error.stack ? error.stack : String(error)));
	process.exit(1);
}
