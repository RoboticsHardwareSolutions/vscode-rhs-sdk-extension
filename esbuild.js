const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

/**
 * @type {import('esbuild').Plugin}
 */
const copyFilesPlugin = {
	name: 'copy-files',
	setup(build) {
		build.onEnd(() => {
			// Копируем JSON шаблоны в dist
			const srcTemplatesDir = path.join(__dirname, 'src', 'templates');
			const distTemplatesDir = path.join(__dirname, 'dist', 'templates');

			if (!fs.existsSync(distTemplatesDir)) {
				fs.mkdirSync(distTemplatesDir, { recursive: true });
			}

			// Копируем все JSON файлы
			const files = fs.readdirSync(srcTemplatesDir);
			files.forEach(file => {
				if (file.endsWith('.json')) {
					const srcFile = path.join(srcTemplatesDir, file);
					const distFile = path.join(distTemplatesDir, file);
					fs.copyFileSync(srcFile, distFile);
					console.log(`Copied ${file} to dist/templates/`);
				}
			});
		});
	},
};

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outfile: 'dist/extension.js',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			copyFilesPlugin,
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();
	} else {
		await ctx.rebuild();
		await ctx.dispose();
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
