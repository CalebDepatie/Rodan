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
        assetModuleFilename: 'assets/[hash][ext][query]',
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
              // Style loader
              test: /\.(css|scss)$/,
              use: [
                'style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              // Load file data
              test: /\.(svg|eot|woff|woff2|ttf)$/,
              type: 'asset/resource',
            },
            {
              test: /\.(png|jpg|gif)$/i,
              type: 'asset/inline', 
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
