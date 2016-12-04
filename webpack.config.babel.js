
const { resolve, relative } = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');
const hydeConfig = require('./hyde.config.json');
const getMyIp = require('get-my-ip');

module.exports = (webpackEnv = {}) => {
	const { env } = process;

	const { prod, build } = webpackEnv;

	env.NODE_ENV = env.NODE_ENV || (prod ? 'production' : 'development');

	const port = env.PORT || 3000;
	const host = getMyIp();
	const DEV = env.NODE_ENV === 'development';
	const PROJECT_PATH = __dirname;
	const inProject = (...args) => resolve(PROJECT_PATH, ...args);
	const inSrc = inProject.bind(null, 'src');
	const srcDir = inSrc();
	const themeDir = inProject('theme');
	const ralatedToSrc = relative.bind(null, srcDir);

	const babelConfig = do {
		const presets = [
			['es2015', { modules: false }],
			'react',
			'stage-0',
		];

		const plugins = [
			'transform-decorators-legacy',
			'transform-runtime',
			'lodash',
		];

		if (DEV) {
			plugins.push('react-hot-loader/babel');
		}

		// eslint-disable-next-line
		({
			presets,
			plugins,
			cacheDirectory: true,
			babelrc: false,
		});
	};

	const configs = {
		devtool: DEV ? 'source-map' : 'none',
		entry: {
			hyde: ['./src/index.js'],
		},
		output: {
			filename: 'hyde.js',
			publicPath: '/',
			path: resolve(__dirname, DEV ? 'site' : 'dist'),
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, themeDir],
					loader: 'babel',
					query: babelConfig,
				},
				{
					test: /\.ico$/,
					include: [srcDir],
					loader: 'file?name=[name].ico',
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
				'process.env.HYDE': JSON.stringify(hydeConfig),
				__DEV__: DEV,
			}),
		],
		resolve: {
			modules: [srcDir, 'node_modules'],
			extensions: ['.js'],
			alias: glob
				.sync(`${srcDir}/*`)
				.filter((dirname) => fs.lstatSync(dirname).isDirectory())
				.map((dirname) => ralatedToSrc(dirname))
				.reduce((results, key) => Object.assign(results, {
					[key]: inSrc(key)
				}), {
					hydeTheme: themeDir,
				})
			,
		},
		devServer: {
			host,
			port,
			hot: true,
			inline: false,
			contentBase: './site',
			historyApiFallback: {
				disableDotRule: true
			},
			stats: {
				chunkModules: false,
				colors: true,
			},
		},
	};

	if (!build) {
		configs.entry.hyde = [
			'babel-polyfill',
			...configs.entry.hyde,
			'./src/bootstrap',
		];
	}

	if (DEV) {
		configs.plugins.push(
			new webpack.HotModuleReplacementPlugin()
		);
		configs.entry.hyde = [
			`webpack-dev-server/client?http://${host}:${port}`,
			'webpack/hot/only-dev-server',
			'react-hot-loader/patch',
			...configs.entry.hyde,
		];
	}

	return configs;
};
