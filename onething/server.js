const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const path = require('path');
const { typeDefs, resolvers } = require('./schema');
require('dotenv').config(); // 确保加载环境变量

// ---> 添加调试日志 <---
console.log('--- DEBUG: Environment Variables ---');
console.log(`DEEPSEEK_API_URL: ${process.env.DEEPSEEK_API_URL ? 'Loaded (masked)' : 'NOT LOADED'}`);
console.log(`DEEPSEEK_API_KEY: ${process.env.DEEPSEEK_API_KEY ? 'Loaded (masked)' : 'NOT LOADED'}`);
console.log(`BACKUP_AI_API_URL: ${process.env.BACKUP_AI_API_URL ? 'Loaded (masked)' : 'NOT LOADED'}`);
console.log(`BACKUP_AI_API_KEY: ${process.env.BACKUP_AI_API_KEY ? 'Loaded (masked)' : 'NOT LOADED'}`);
console.log('----------------------------------');
// ---> 结束调试日志 <---

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
    // --- 添加生产调试日志 ---
    const receivedMessages = req.body.messages;
    if (Array.isArray(receivedMessages)) {
       console.log(`[PROD /api/chat] Received ${receivedMessages.length} messages.`);
       if (receivedMessages.length > 0) {
         const lastMsg = receivedMessages[receivedMessages.length - 1];
         console.log(`[PROD /api/chat] Last msg role: ${lastMsg?.role}, content start: ${String(lastMsg?.content).substring(0,30)}`);
       }
       if (receivedMessages.length > 1) {
         const secondLastMsg = receivedMessages[receivedMessages.length - 2];
         console.log(`[PROD /api/chat] Second last msg role: ${secondLastMsg?.role}, content start: ${String(secondLastMsg?.content).substring(0,30)}`);
       }
    } else {
       console.error('[PROD /api/chat] Received invalid messages format:', req.body.messages);
    }
    // --- 结束生产调试日志 ---

    console.log('收到前端请求:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    // 检查是否开启模拟响应模式
    const useMockResponse = process.env.USE_MOCK_AI_RESPONSE === 'true';
    if (useMockResponse) {
      console.log('使用模拟AI响应模式');
      const mockResponse = {
        choices: [
          {
            message: {
              content: "这是一个模拟的AI响应。系统管理员已开启了模拟模式，AI功能将返回预设回复。请联系管理员恢复正常服务。",
              role: "assistant"
            },
            finish_reason: "stop"
          }
        ]
      };
      // 延迟500ms模拟网络延迟
      await new Promise(r => setTimeout(r, 500));
      return res.json(mockResponse);
    }
    
    // 验证请求数据
    if (!req.body || !req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({
        error: '无效的请求格式，缺少messages字段或格式不正确'
      });
    }
    const messages = req.body.messages; // <-- 只获取 messages

    // 请求DeepSeek API - 修改为支持主备API切换的逻辑
    const primaryApiUrl = process.env.DEEPSEEK_API_URL || 'https://api.lkeap.cloud.tencent.com/v1/chat/completions';
    const primaryApiKey = process.env.DEEPSEEK_API_KEY;

    // 添加备用API配置
    const backupApiUrl = process.env.BACKUP_AI_API_URL;
    const backupApiKey = process.env.BACKUP_AI_API_KEY;

    // 记录API配置状态
    const hasPrimaryConfig = !!primaryApiKey;
    const hasBackupConfig = !!(backupApiUrl && backupApiKey);

    // 日志记录配置状态（不显示实际密钥）
    console.log('API配置状态:', {
      primary: hasPrimaryConfig ? '已配置' : '未配置',
      backup: hasBackupConfig ? '已配置' : '未配置'
    });

    if (!hasPrimaryConfig && !hasBackupConfig) {
      console.error('错误：未配置任何可用的AI API密钥');
      return res.status(500).json({ error: 'API密钥未配置' });
    }

    console.log(`首先尝试主API服务: ${primaryApiUrl}`);

    let response;
    let retryCount = 0;
    const maxRetries = hasBackupConfig ? 1 : 0;

    while (retryCount <= maxRetries) {
      let currentApiUrl = null;
      let currentApiKey = null;
      const apiSource = retryCount === 0 ? "主API" : "备用API";

      try {
        // Determine current API URL and Key
        if (retryCount === 0) {
          currentApiUrl = primaryApiUrl;
          currentApiKey = primaryApiKey;
          // Check if primary key exists before proceeding
          if (!currentApiKey) {
             console.error('主API密钥未配置，跳过主API尝试。');
             if (hasBackupConfig) {
                 retryCount++; // Move to backup attempt
                 continue;
             } else {
                 // 直接返回配置错误给前端可能更好
                 // throw new Error('主API密钥缺失且无备用配置。');
                 return res.status(500).json({ error: '主 AI 服务配置缺失，且无备用配置。' });
             }
          }
        } else { // retryCount must be 1, attempting backup
          currentApiUrl = backupApiUrl;
          currentApiKey = backupApiKey;
           // Check if backup key exists before proceeding
          if (!currentApiKey) {
              console.error('备用API密钥未配置，无法尝试备用API。');
              // 如果主API失败且备用也未配置
              // throw new Error('主API失败且备用API密钥缺失。');
              return res.status(500).json({ error: '主 AI 服务失败，且备用 AI 服务未配置。' });
          }
        }

        // --- 定义 requestData INSIDE the loop for this attempt ---
        let requestData; // 在循环内定义
        if (retryCount === 0) { // 主 API 尝试
          requestData = {
            messages: messages, // 使用从外部获取的 messages
            model: "deepseek-v3" // 主 API 模型
          };
          console.log(`[Attempt ${retryCount + 1}] 为主API构建 requestData`);
        } else { // 备用 API 尝试
          requestData = {
            messages: messages, // 使用从外部获取的 messages
            model: "deepseek-ai/DeepSeek-V3" // 备用 API 模型
          };
          console.log(`[Attempt ${retryCount + 1}] 为备用API构建 requestData`);
        }
        // --- requestData is now defined for this scope ---

        console.log(`[Attempt ${retryCount + 1}/${maxRetries + 1}] 尝试使用 ${apiSource}: ${currentApiUrl}`);
        console.log(`[Attempt ${retryCount + 1}] 使用 ${apiSource} Key: ${currentApiKey.substring(0, 5)}...${currentApiKey.substring(currentApiKey.length - 4)}`);
        console.log(`[Attempt ${retryCount + 1}] 发送请求体: ${JSON.stringify(requestData)}`);

        response = await axios({
          method: 'post',
          url: currentApiUrl,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentApiKey.trim()}` // Trim just in case
          },
          data: requestData, // 使用在当前循环作用域中定义的 requestData
          timeout: 30000 // 增加超时到30秒
        });

        console.log(`[Attempt ${retryCount + 1}] ${apiSource} 请求成功 (Status: ${response.status})`);
        break; // Success!

      } catch (error) {
        console.error(`[Attempt ${retryCount + 1}] ${apiSource} 请求失败:`, error.message);

        if (error.response) {
          console.error(`[Attempt ${retryCount + 1}] 错误响应数据:`, JSON.stringify(error.response.data));
          console.error(`[Attempt ${retryCount + 1}] 错误状态码:`, error.response.status);
          if (hasBackupConfig && retryCount === 0) {
            const errorCode = error.response.data?.error?.code;
            const errorMessage = error.response.data?.error?.message;
            if (
              (errorCode === '20031' || (errorMessage && errorMessage.includes('not enough quota'))) ||
              error.response.status === 401 || // Unauthorized
              error.response.status === 429 || // Too Many Requests
              error.response.status >= 500    // Server errors
            ) {
              console.log(`[Attempt ${retryCount + 1}] 主API因特定错误 (${error.response.status}/${errorCode || 'N/A'}) 失败，切换到备用API`);
              retryCount++;
              continue; // Try backup
            }
          }
        }

        if (hasBackupConfig && retryCount === 0) {
          console.log(`[Attempt ${retryCount + 1}] 主API发生其他类型错误，仍尝试切换到备用API`);
          retryCount++;
          continue; // Try backup
        }

        console.error(`[Attempt ${retryCount + 1}] 无法重试或 ${apiSource} 最终失败。`);
        // 在这里抛出错误，让外层 catch 处理兜底响应
        throw error;
      }
    } // End while loop

    // 检查 response 对象是否存在且包含数据 (防御性编程)
    if (!response || typeof response.data === 'undefined') {
      console.error('错误：API 调用成功跳出循环，但 response 或 response.data 无效！', response);
      throw new Error('InternalServerError: Invalid response object after successful API call.');
    }

    console.log('成功获取到响应数据，准备发送回前端。结构预览:', JSON.stringify(response.data).substring(0, 250) + '...');
    serviceStatus.ai_service = true;

    console.log('尝试执行 res.json(response.data)...');
    res.json(response.data);
    console.log('res.json(response.data) 执行完毕，成功响应已发送。');

  } catch (error) { // 最外层的 catch 块
    console.error('在 /api/chat 处理的顶层 catch 块捕获到错误:', error.message);
    console.error('错误堆栈:', error.stack); // 打印堆栈帮助调试
    serviceStatus.ai_service = false;

    const fallbackResponse = {
      choices: [
        {
          message: {
            content: "非常抱歉，AI服务目前无法连接。这可能是网络问题或服务暂时不可用。请稍后再试，或查看应用其他功能。",
            role: "assistant"
          },
          finish_reason: "stop"
        }
      ]
    };

    if (error.response) {
      console.error('Axios 错误响应数据:', JSON.stringify(error.response.data));
      console.error('Axios 错误状态码:', error.response.status);
    } else if (error.code) {
      console.error(`网络或系统错误代码: ${error.code}`);
    }

    if (!res.headersSent) {
      console.log('发送兜底错误响应到前端...');
      // 发送兜底，但不一定是 500 错误，根据情况
      res.status(error.response?.status || 503).json(fallbackResponse); // 使用 503 Service Unavailable 或原始错误码
    } else {
      console.error('错误：尝试发送兜底响应失败，因为响应头已发送！');
    }
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