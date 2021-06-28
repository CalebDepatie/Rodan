const { useGuarkLockFile, checkBeforeBuild } = require('guark/build');
const path = require('path');

checkBeforeBuild()

module.exports =
{
	outputDir: process.env.GUARK_BUILD_DIR,
	productionSourceMap: process.env.NODE_ENV == 'production' ? false : true,
	configureWebpack:
	{
		devServer:
		{
			// After server started you should call useGuarkLockFile.
			after: (app, server, compiler) => compiler.hooks.done.tap("Guark", useGuarkLockFile)
		},
		module: {
			rules: [
			  {
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					compilerOptions: {
						"noEmit": false
					}
				}
			  },
			],
		},
	    resolve: {
			extensions: ['.tsx', '.ts', '.js'],
	    },
	},
}
