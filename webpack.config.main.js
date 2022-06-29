const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    target: "electron-main",
    devtool: "source-map",

    entry: {
        main: './src/main/index.ts'
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: "electron.js"
    },

    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        })
      ]
    },

    module: {
        rules: [
            {
              // Babel loader configuration. Performs the JSX and ES6 to JS transformations.
              test: /\.(js|ts)?$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/env',
                  '@babel/preset-typescript'
                ],
                plugins: [
                  '@babel/plugin-transform-runtime'
                ]
              }
            }
          ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
              { from: './zig-out/lib', to: './lib' },
            ]
        })
    ],

    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        "path": require.resolve("path-browserify")
      },
      alias: {
        "common": path.join(__dirname, 'src/common/')
      }
    }
}
