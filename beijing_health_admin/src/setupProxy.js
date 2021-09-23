const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://mistest.bjyl.tianma3600.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }),
  )
}