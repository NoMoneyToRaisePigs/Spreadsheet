const merge = require('webpack-merge');
const config = require('./webpack.config.js');

var webpackConfig = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
});

delete webpackConfig.entry;

module.exports = webpackConfig;