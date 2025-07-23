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
			// Copy JSON templates to dist
			const srcTemplatesDir = path.join(__dirname, 'src', 'templates');
			const distTemplatesDir = path.join(__dirname, 'dist', 'templates');

			if (!fs.existsSync(distTemplatesDir)) {
				fs.mkdirSync(distTemplatesDir, { recursive: true });
			}

			// Copy all JSON files
			const files = fs.readdirSync(srcTemplatesDir);
			files.forEach(file => {
				if (file.endsWith('.json')) {
					const srcFile = path.join(srcTemplatesDir, file);
					const distFile = path.join(distTemplatesDir, file);
					fs.copyFileSync(srcFile, distFile);
					console.log(`Copied ${file} to dist/templates/`);
				}
			});

			// Copy webviews files to dist
			const srcWebviewsDir = path.join(__dirname, 'src', 'webviews');
			const distWebviewsDir = path.join(__dirname, 'dist', 'webviews');

			if (fs.existsSync(srcWebviewsDir)) {
				if (!fs.existsSync(distWebviewsDir)) {
					fs.mkdirSync(distWebviewsDir, { recursive: true });
				}

				// Copy HTML and CSS files
				const webviewFiles = fs.readdirSync(srcWebviewsDir);
				webviewFiles.forEach(file => {
					if (file.endsWith('.html') || file.endsWith('.css')) {
						const srcFile = path.join(srcWebviewsDir, file);
						const distFile = path.join(distWebviewsDir, file);
						fs.copyFileSync(srcFile, distFile);
						console.log(`Copied ${file} to dist/webviews/`);
					}
				});
			}

			// Copy media files to dist
			const srcMediaDir = path.join(__dirname, 'src', 'media');
			const distMediaDir = path.join(__dirname, 'src', 'media'); // Keep original path for VS Code

			if (fs.existsSync(srcMediaDir)) {
				if (!fs.existsSync(distMediaDir)) {
					fs.mkdirSync(distMediaDir, { recursive: true });
				}

				// Copy all media files (svg, png, etc.)
				const mediaFiles = fs.readdirSync(srcMediaDir);
				mediaFiles.forEach(file => {
					if (file.endsWith('.svg') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico')) {
						const srcFile = path.join(srcMediaDir, file);
						const distFile = path.join(distMediaDir, file);
						// Only copy if source and destination are different
						if (srcFile !== distFile) {
							fs.copyFileSync(srcFile, distFile);
							console.log(`Copied ${file} to media/`);
						}
					}
				});
			}
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
