var webpackConfig = require('./webpack.test.config.js');

module.exports = function(config) {
    config.set({
      
      basePath: '.',
      frameworks: ['jasmine'],
  
      files: [
        './src/test_entry.js'
      ],
  
      exclude: [
      ],
  
      preprocessors: {
        './src/test.js': ['webpack']
      },

      webpack: webpackConfig,

      reporters: ['kjhtml'],
  
      port: 9876,
  
      colors: true,
      
      logLevel: config.LOG_DISABLE,
  
      autoWatch: true,
  
      browsers: ['Chrome'],
  
      client: {
         clearContext: false
      },
      
      singleRun: false,
  
      concurrency: Infinity,
    })
  }