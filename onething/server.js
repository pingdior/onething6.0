const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
require('dotenv').config(); // 确保加载环境变量

const app = express();
const PORT = process.env.PORT || 4000;

// 记录服务状态
const serviceStatus = {
  server: true,
  mongodb: false,
  ai_service: null // 将在第一次调用时更新
};

console.log(`准备在端口 ${PORT} 上启动服务器...`);

// 启用CORS和JSON请求体解析
app.use(cors());
app.use(bodyParser.json());

// 为生产环境提供静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// 连接MongoDB - 添加更多连接选项并使用内存数据库作为备选
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onething', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 增加超时时间
  socketTimeoutMS: 45000, // 设置更长的socket超时
  family: 4 // 强制使用IPv4
})
  .then(() => {
    console.log('MongoDB连接成功');
    serviceStatus.mongodb = true;
  })
  .catch(err => {
    console.error('MongoDB连接失败:', err.message);
    console.log('将使用内存数据存储作为备选');
    // MongoDB连接失败不影响服务器启动
  });

// DeepSeek API代理
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求:', req.body);
    
    const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    // 检查API密钥是否存在
    if (!API_KEY) {
      console.error('错误: DeepSeek API密钥未设置');
      serviceStatus.ai_service = false;
      return res.status(500).json({
        error: {
          message: '服务器配置错误: API密钥未设置'
        }
      });
    }
    
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
    
    // 更新AI服务状态
    serviceStatus.ai_service = response.status >= 200 && response.status < 300;
    
    // 记录API响应
    console.log('API响应状态:', response.status);
    console.log('API响应数据:', data);
    
    // 返回结果
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API代理错误:', error);
    serviceStatus.ai_service = false;
    res.status(500).json({
      error: {
        message: `服务器错误: ${error.message}`
      }
    });
  }
});

// 服务状态检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    services: serviceStatus
  });
});

// 测试AI服务连接
app.get('/api/test-ai', async (req, res) => {
  try {
    const API_URL = process.env.DEEPSEEK_API_URL || 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
    const API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      serviceStatus.ai_service = false;
      return res.status(500).json({
        success: false,
        message: 'API密钥未设置',
        aiStatus: false
      });
    }
    
    // 发送一个简单的测试请求到DeepSeek API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: "Hello" }
        ],
        model: "deepseek-v3"
      })
    });
    
    const success = response.status >= 200 && response.status < 300;
    serviceStatus.ai_service = success;
    
    res.json({
      success,
      message: success ? 'AI服务连接正常' : 'AI服务连接失败',
      aiStatus: success
    });
  } catch (error) {
    console.error('AI服务测试失败:', error);
    serviceStatus.ai_service = false;
    res.status(500).json({
      success: false,
      message: `AI服务测试失败: ${error.message}`,
      aiStatus: false
    });
  }
});

// 设置Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // 简单的认证上下文，后续可以扩展
      return { 
        user: { id: '1', name: '测试用户' },
        mongodb: serviceStatus.mongodb // 添加MongoDB连接状态到上下文
      };
    }
  });
  
  await server.start();
  server.applyMiddleware({ app });
  
  console.log(`GraphQL服务器运行在 http://localhost:${PORT}${server.graphqlPath}`);
}

// 为非API路由提供React应用
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// 启动服务器
async function startServer() {
  try {
    await startApolloServer();
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
      console.log(`REST API接口: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer(); 