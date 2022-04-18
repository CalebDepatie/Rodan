const path = require('path');
const webpack = require('webpack');

module.exports = {

    target: "electron-main",
    devtool: "source-map",

    entry: {
        main: './src/main/index.ts'
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: "[name].bundle.js"
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
                ]
              }
            }
          ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        "path": require.resolve("path-browserify")
      }
    }
}
