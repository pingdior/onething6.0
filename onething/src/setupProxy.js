const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/deepseek',
    createProxyMiddleware({
      target: 'https://api.lkeap.cloud.tencent.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/deepseek': '/v1'
      },
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader('Authorization', `Bearer sk-BITPkaL3lVggWwuQc5SaoXZfUou0L9SEyGbvam1nLkzhUgCC`);
        proxyReq.setHeader('Content-Type', 'application/json');
        
        console.log('代理请求路径:', req.url);
        console.log('代理请求方法:', req.method);
        console.log('代理请求头:', req.headers);
        
        if (req.method === 'POST' && req.body) {
          console.log('代理请求体:', req.body);
        }
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('代理响应状态:', proxyRes.statusCode);
        console.log('代理响应头:', proxyRes.headers);
      },
      onError: function(err, req, res) {
        console.error('代理错误:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          error: {
            message: `代理请求失败: ${err.message}`
          }
        }));
      }
    })
  );
}; 