const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.renderer.common.js');
const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const TerserPlugin = require('terser-webpack-plugin');

const prodConfig = {

    output: {
        path: path.join(__dirname, 'build'),
        publicPath: "./",
        filename: "renderer.bundle.js",
        assetModuleFilename: 'assets/[hash][ext][query]',
        libraryTarget: 'commonjs2'
    },

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        })
      ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
          template: path.join(__dirname, 'src/renderer/Public/index.html'),
          filename: 'index.html',
          minify: {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
          },
          isBrowser: false,
        })
    ],
}
module.exports = merge(common, prodConfig);
