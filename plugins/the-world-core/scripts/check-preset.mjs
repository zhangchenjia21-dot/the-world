/* the-world preset 挂载校验插件：在真实宿主平面上对 the-world preset 做
 * standingKeyFor（真实组合其插件子树：导入 world-core 模块、执行 apply、
 * 挂载全部工具行），不启动 agent/会话/轮次。 */
export const name = "the-world-preset-check";
export const inject = ["agentPresets"];

export async function apply(ctx) {
	const timer = setTimeout(() => {
		console.error("THE_WORLD_MOUNT_TIMEOUT: 90s 内未完成，可能因等待缺失服务而挂起");
		process.exit(1);
	}, 90000);
	try {
		const key = await ctx.agentPresets.standingKeyFor("the-world");
		clearTimeout(timer);
		console.log("THE_WORLD_MOUNT_OK " + JSON.stringify(key));
		process.exit(0);
	} catch (error) {
		clearTimeout(timer);
		console.error("THE_WORLD_MOUNT_FAIL " + (error && error.stack ? error.stack : String(error)));
		process.exit(1);
	}
}
