const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const appStaticPath = require('./webpack.constant').appStaticPath;
const appStaticProtocal = require('./webpack.constant').appStaticProtocal;

module.exports = [
  new webpack.DefinePlugin({
    APP_STATIC_PATH: JSON.stringify(appStaticPath),
    APP_STATIC_PROTOCAL: JSON.stringify(appStaticProtocal)
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, `./src/${appStaticPath}`),
        to: path.resolve(__dirname, `.webpack/renderer/${appStaticPath}`)
      }
    ]
  }),
  new ForkTsCheckerWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin()
];
