const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const webpack = require('webpack');
module.exports = {
	mode: 'development',
	entry: {
		app: './js/main.js',
		restaurant: './js/restaurant_info.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	externals: {
		leaflet: 'leaflet',
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [new UglifyJsPlugin({
			sourceMap: true
		})]
	}
	// plugins: [
	// 	new CompressionPlugin({test: /\.js/})
	// ]
};