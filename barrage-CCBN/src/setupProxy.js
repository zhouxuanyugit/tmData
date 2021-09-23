const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/test', {
      target: 'https://review.360tianma.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/test': ''
      }
    }),
  )
}