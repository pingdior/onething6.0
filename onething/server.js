const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// 启用CORS和JSON请求体解析
app.use(cors());
app.use(bodyParser.json());

// DeepSeek API代理
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求:', req.body);
    
    const API_URL = 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
    const API_KEY = 'sk-BITPkaL3lVggWwuQc5SaoXZfUou0L9SEyGbvam1nLkzhUgCC';
    
    // 转发请求到DeepSeek API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    
    // 记录API响应
    console.log('API响应状态:', response.status);
    console.log('API响应数据:', data);
    
    // 返回结果
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API代理错误:', error);
    res.status(500).json({
      error: {
        message: `服务器错误: ${error.message}`
      }
    });
  }
});

// 测试端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器正常运行' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API代理服务器运行在 http://localhost:${PORT}`);
}); 