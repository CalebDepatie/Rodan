const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );

module.exports = {

    target: "electron-renderer",
    devtool: "source-map",

    entry: './src/renderer/index.tsx',

    output: {
        path: path.join(__dirname, 'build'),
        publicPath: "/",
        filename: "renderer.bundle.js",
        libraryTarget: 'commonjs2'
    },

    externals: {
      react: "commonjs react",
      "react-dom": "commonjs react-dom",
    },

    devServer: {
        static: {
            directory: path.join(__dirname, 'src/renderer/Public')
        },
        historyApiFallback: true,
        hot: true,
        compress: true,
        port: 8182
    },

    module: {
        rules: [
            {
              // Sass loader
              test: /\.(css|scss)$/,
              exclude: /(node_modules)/,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              // CSS loader for inside node_modules
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
            {
              // Babel loader configuration. Performs the JSX and ES6 to JS transformations.
              test: /\.(tsx|ts)?$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/env',
                  '@babel/preset-react',
                  '@babel/preset-typescript'
                ]
              }
            }
          ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
          template: path.join(__dirname, 'src/renderer/Public/index.html'),
          filename: 'index.html'
        })
    ],

    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.scss'],
      fallback: {
        "path": require.resolve("path-browserify")
      },
      alias: {
        "common": path.join(__dirname, 'src/common/')
      }
    }
}
