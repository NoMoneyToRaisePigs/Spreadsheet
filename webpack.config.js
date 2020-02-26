const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackCleanPlugin = require('webpack-clean');
const path = require('path');

module.exports = {
  entry: {
    app: './src/main.js',
    style: './src/style.js'
  },
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.vue$/, use: 'vue-loader' },
      { 
        test: /\.(le|c)ss$/, 
        use: [
          {loader: MiniCssExtractPlugin.loader},
          // 'vue-style-loader', 
          'css-loader',
          'less-loader']
      },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
      chunkFilename: "[name].bundle.css"
    }),
    new WebpackCleanPlugin([
      // 'dist/app.bundle.css',
      // 'dist/style.bundle.js'
    ])
  ],

  devtool: 'source-map'
};