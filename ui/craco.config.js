const path = require('path');
const { useGuarkLockFile, checkBeforeBuild } = require('guark/build');

checkBeforeBuild();

module.exports = {
  babel: {
    presets: [
  		'@babel/preset-react',
  		'@babel/preset-typescript'
  	]
  },
  webpack: {
    configue: {
      entry: "main.js",
      output: {
        path: process.env.GUARK_BUILD_DIR,
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
    },
  },
  devServer: {
    after: (app, server, compiler) => compiler.hooks.done.tap("Guark", useGuarkLockFile)
  }
};
