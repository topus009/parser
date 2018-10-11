const webpack = require('webpack');
const path = require('path');
const WebpackChunkHash = require('webpack-chunk-hash');

const config = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    index: './src/index.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};

config.plugins = [
...config.plugins,
new webpack.HashedModuleIdsPlugin(),
new WebpackChunkHash(),
];

module.exports = config;
