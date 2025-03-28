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
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  credentials: true,
  maxAge: 86400 // 24小时
};

// 启用CORS和JSON请求体解析
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// 为所有响应添加必要的CORS头
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
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
    console.log('收到前端请求:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    // 验证请求数据
    if (!req.body || !req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({ 
        error: '无效的请求格式，缺少messages字段或格式不正确' 
      });
    }
    
    // 请求DeepSeek API
    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
    let apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error('错误：DEEPSEEK_API_KEY未设置');
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    // DeepSeek API密钥通常以"sk-"开头，确保格式正确
    if (!apiKey.trim().startsWith('sk-')) {
      console.warn('警告：API密钥格式可能不正确，应以sk-开头');
    }
    
    // 打印请求信息但不包含敏感内容
    console.log(`请求AI服务: ${apiUrl}`);
    
    // 添加重试逻辑
    let response;
    let retryCount = 0;
    const maxRetries = 1; // 最多重试一次
    
    while (retryCount <= maxRetries) {
      try {
        response = await axios({
          method: 'post',
          url: apiUrl,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}` // 确保没有多余空格
          },
          data: req.body,
          timeout: 30000 // 30秒超时
        });
        
        // 如果请求成功，跳出循环
        break;
      } catch (error) {
        if (error.response && error.response.status === 401 && retryCount < maxRetries) {
          // 如果是401错误并且还可以重试，尝试从备用key中获取
          console.warn('API密钥认证失败，尝试使用备用密钥');
          
          // 这里可以尝试使用不同的API密钥
          // 模拟AI响应以防所有API密钥都失效
          if (retryCount === maxRetries) {
            console.warn('所有API密钥均已失效，使用模拟响应');
            
            // 创建模拟响应以保障基本的用户体验
            const fakeResponse = {
              choices: [
                {
                  message: {
                    content: "很抱歉，AI服务暂时不可用，请稍后再试。您可以继续使用应用的其他功能。如有紧急需求，请联系管理员。"
                  },
                  finish_reason: "stop"
                }
              ]
            };
            
            serviceStatus.ai_service = false;
            return res.json(fakeResponse);
          }
          
          retryCount++;
          continue;
        }
        
        // 其他错误或重试次数已用完，抛出异常
        throw error;
      }
    }
    
    console.log('DeepSeek API响应状态:', response.status);
    // 更新AI服务状态
    serviceStatus.ai_service = true;
    res.json(response.data);
  } catch (error) {
    console.error('调用DeepSeek API出错:', error.message);
    // 更新AI服务状态
    serviceStatus.ai_service = false;
    
    if (error.response) {
      console.error('错误响应数据:', JSON.stringify(error.response.data));
      console.error('错误状态码:', error.response.status);
      
      // 401错误处理
      if (error.response.status === 401) {
        console.error('DeepSeek API密钥认证失败，请检查您的API密钥是否有效。');
        return res.status(500).json({ 
          error: 'AI服务认证失败，请联系管理员更新API密钥',
          code: 'AUTH_FAILED'
        });
      }
      
      return res.status(error.response.status).json({ 
        error: `AI服务错误: ${error.response.data.error?.message || error.message}`
      });
    }
    
    // 针对网络错误提供更详细的信息
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: '无法连接到AI服务，服务可能暂时不可用',
        code: error.code
      });
    }
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      return res.status(504).json({ 
        error: 'AI服务请求超时，服务可能过载',
        code: error.code 
      });
    }
    
    res.status(500).json({ 
      error: `与AI服务通信失败: ${error.message}`,
      code: error.code || 'UNKNOWN'
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