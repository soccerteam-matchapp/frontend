// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    ['/auth', '/api'],
    createProxyMiddleware({
      target: 'https://port-0-sportly-mg82ro7fce364845.sel3.cloudtype.app',
      changeOrigin: true,
    })
  );
};