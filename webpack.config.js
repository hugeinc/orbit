'use strict';
const webpack = require('webpack'),
	StringReplacePlugin = require("string-replace-webpack-plugin"),
	path = require('path'),
	DIST = path.resolve(__dirname, 'lunar/dist'),
	env = process.env.WEBPACK_ENV,
	config = {
		context: __dirname + '/lunar/src',
    cacheDirectory: false,
		entry: {
			lunar: './index.js'
		},

		resolve: {
			extensions: ['', '.js'],
      root: [
        path.resolve('../install/node_modules')
      ]
		},

		output: {
			path: DIST,
			filename: env === 'dist' ? 'lunar.min.js' : 'lunar.js',
			libraryTarget: 'umd',
			library: 'Lunar',
			umdNamedDefine: true
		},

		devtool: env === 'dist' ? '' : 'eval-source-map',

    resolveLoader: {
      modulesDirectories: [
        path.resolve('../install/node_modules')
      ]
    },

		module: {
			loaders: [
				{
					test: /\.js?$/,
					exclude: /(node_modules|dist)/,
					loader: 'babel',
					query: {
						cacheDirectory: true,
						presets: ['es2015', 'stage-2'],
						plugins: ['transform-runtime', 'add-module-exports', 'transform-es2015-modules-commonjs']
					}
				}
			]
		}
	};

if(env === 'dist') {
	config.plugins = [];

	config.plugins.push(new StringReplacePlugin());
	config.module.loaders.push({
		test: /\.js?$/,
		exclude: /(node_modules)/,
		loader: StringReplacePlugin.replace({
			replacements: [
				{
					pattern: /Logger\.log\({(.*?)}\);/ig,
					replacement: function(match, p1, offset, string) {
						return '';
					}
				}
			]
		})
	});

	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				screw_ie8: true,
				warnings: false
			}
		})
	);
}

module.exports = config;
