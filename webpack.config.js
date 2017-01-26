'use strict';

if (`${__dirname}/.env`) {
  require('dotenv').load({path: `${__dirname}/.env`});
}

if (process.env.NODE_ENV === 'testing') {
  require('./test/lib/test-env');
}

if (!process.env.API_URL || !process.env.NODE_ENV || !process.env.TITLE){
  console.error('ERROR: ng-template requires .env file');
  process.exit(1);
}

//const webpack = require('webpack');
const HTMLPlugin = require('html-webpack-plugin');
//const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


let plugins = [
  new ExtractTextPlugin('bundle.css'),
  new HTMLPlugin({template: `${__dirname}/app/index.html`}),
];


module.exports = {
  entry: `${__dirname}/app/entry.js`,
  plugins,
  output: {
    path: 'build',
    filename: 'bundle.js',
  },
  sassLoader: {
    includePaths: [`${__dirname}/app/scss/lib`],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.html$/,
        loader: 'html',
      },
      {
        test: /\.(woff|ttf|svg|eot).*/,
        loader: 'url?limit=10000&name=font/[name].[ext]',
      },
      {
        test: /\.(jpg|jpeg|bmp|tiff|gif|png)$/,
        loader: 'url?limit=10000&name=image/[hash].[ext]',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!resolve-url!sass?sourceMap'),
      },
    ],
  },
};
