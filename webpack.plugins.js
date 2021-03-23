const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const plugins = [
  new ForkTsCheckerWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin()
];

module.exports = [
  ...plugins  
];
