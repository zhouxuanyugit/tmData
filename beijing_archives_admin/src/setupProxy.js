const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      // http://47.104.165.114:39012/ 测试服务器
      target: 'http://47.104.165.114:39012/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }),
  )
}