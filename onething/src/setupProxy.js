const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * 开发环境API代理配置
 * 这个配置仅在开发环境中使用，确保前端开发服务器能够将API请求正确代理到后端服务
 */
module.exports = function(app) {
  // 代理GraphQL请求
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:4000',
      changeOrigin: true,
      secure: false, // 如果使用HTTPS但证书不受信任，可以设置为false
      headers: {
        Connection: 'keep-alive'
      },
      onError: (err, req, res) => {
        console.error('代理请求错误:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ error: '无法连接到后端服务' }));
      }
    })
  );
  
  // 代理API请求
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:4000',
      changeOrigin: true,
      secure: false,
      headers: {
        Connection: 'keep-alive'
      },
      onProxyRes: (proxyRes, req, res) => {
        // 添加CORS头，确保移动端也能访问
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError: (err, req, res) => {
        console.error('API代理请求错误:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ 
          error: '无法连接到API服务',
          message: err.message 
        }));
      }
    })
  );
}; 