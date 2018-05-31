const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackWriteStatsPlugin = require('webpack-write-stats-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const productName = 'StatWrangler';

// NOTE: if you need detailed trace of webpack enable the next line:
// process.traceDeprecation = true;

module.exports = {
  cache: true,
  context: path.resolve(__dirname, 'client/'),
  entry: {
    main: path.resolve(__dirname, 'client/application.js'),
    orbiter_light: path.resolve(__dirname, 'client', 'stylesheets', 'index.scss'),
  },
  devtool: 'cheap-module-source-map', // React 16's suggestion: https://reactjs.org/docs/cross-origin-errors.html#webpack
  name: productName,
  output: {
    path: path.resolve(__dirname, `public/bundles`),
    filename: 'bundle-[name].js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, `public/`),
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [
      path.resolve(__dirname, 'client/'),
      'node_modules',
    ],
  },
  externals: {
    jquery: 'jQuery',
    lodash: '_',
    moment: 'moment',
    numeral: 'numeral',
    'whatwg-fetch': 'fetch',
  },
  module: {
    rules: [
      {
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: 'inline',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        test: /\.scss$/,
        include: path.join(__dirname, 'client/stylesheets'),
      },
      {
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'client'),
          path.join(__dirname, 'test/client'),
        ],
      },
      {
        use: ['json-loader'],
        test: /\.(json)$/,
        include: path.join(__dirname, 'client'),
      },
      {
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
        test: /\.(jpe?g|png|gif|ttf)$/,
        include: path.join(__dirname, 'client/'),
      },
    ],
  },
};
