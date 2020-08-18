const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, './src/assets/json'), to: path.resolve(__dirname, './dist/static/json') }
        ]
      }),
    ]
  },
  devServer: {
    // proxy: {
    //   '/tea/cms': {
    //     target: 'http://47.106.172.126:8888',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/tea/cms': '/tea/cms'
    //     },
    //   }
    // }
  }
}
