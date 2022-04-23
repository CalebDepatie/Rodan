const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.renderer.common.js');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );

const devConfig = {

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

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
          template: path.join(__dirname, 'src/renderer/Public/index.html'),
          filename: 'index.html'
        })
    ],
}
module.exports = merge(common, devConfig);
