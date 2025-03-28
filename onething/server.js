const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
require('dotenv').config(); // 确保加载环境变量
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5005;

// 记录服务状态
const serviceStatus = {
  server: true,
  mongodb: false,
  ai_service: null // 将在第一次调用时更新
};

console.log(`准备在端口 ${PORT} 上启动服务器...`);

// 配置更强大的CORS设置，确保移动端请求不被拒绝
const corsOptions = {
  origin: '*',  // 开发环境可设为*，生产环境应限制来源
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// 启用CORS和JSON请求体解析
app.use(cors(corsOptions));
app.use(bodyParser.json());

// 为所有响应添加必要的CORS头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

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
    console.log('收到前端请求:', JSON.stringify(req.body));
    
    // 请求DeepSeek API
    const response = await axios({
      method: 'post',
      url: process.env.DEEPSEEK_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      data: req.body,
      timeout: 30000 // 增加超时时间
    });
    
    console.log('DeepSeek API响应状态:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('调用DeepSeek API出错:', error.message);
    if (error.response) {
      console.error('错误响应数据:', error.response.data);
      console.error('错误状态码:', error.response.status);
    }
    res.status(500).json({ error: `与AI服务通信失败: ${error.message}` });
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
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`REST API接口: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
}

startServer(); 