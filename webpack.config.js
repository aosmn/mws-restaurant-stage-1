const path = require('path');
const webpack = require('webpack');
module.exports = {
	mode: 'development',
	entry: './js/main.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [
			{ test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader' }
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map'
};