const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: "electron-renderer",
  devtool: "source-map",

  entry: './src/renderer/index.tsx',

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
    new CopyWebpackPlugin({
        patterns: [
          { from: './static', to: './assets' },
        ]
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
