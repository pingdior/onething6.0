/**
 * AI服务模块，用于与DeepSeek API通信
 */

// 使用我们的自定义代理服务器
const API_CONFIG = {
  // 本地代理服务器地址
  proxyURL: 'http://localhost:3001/api/chat',
  model: 'deepseek-v3',
};

// 消息类型定义
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * 发送消息到DeepSeek API并获取响应
 */
export const sendMessageToAI = async (messages: Message[]): Promise<string> => {
  try {
    console.log('发送请求到代理服务器，消息:', messages);
    
    // 构建请求数据
    const requestData = {
      model: API_CONFIG.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    };
    
    console.log('请求数据:', JSON.stringify(requestData));
    
    // 使用我们的自定义代理服务器
    const response = await fetch(API_CONFIG.proxyURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('代理响应状态:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}, 状态: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('代理响应数据:', responseData);

    // 从响应中提取AI的回复
    if (responseData && 
        responseData.choices && 
        responseData.choices.length > 0 && 
        responseData.choices[0].message) {
      return responseData.choices[0].message.content;
    }
    
    // 检查响应格式
    console.error('API响应格式不符合预期:', responseData);
    
    // 如果有错误信息
    if (responseData.error) {
      throw new Error(`API错误: ${responseData.error.message || '未知错误'}`);
    }
    
    throw new Error('无效的API响应格式');
  } catch (error: any) {
    console.error('AI通信错误详情:', error);
    
    // 默认错误信息
    throw new Error(`与AI助手通信时出错: ${error.message || '未知错误'}`);
  }
};

/**
 * 生成默认的系统提示信息
 */
export const getDefaultSystemMessage = (): Message => {
  return {
    role: 'system',
    content: `你是OneThing的AI助手，一个专注于目标管理和个人发展的应用。
你的职责是：
1. 帮助用户设定和分解目标
2. 提供任务管理建议
3. 关注用户的情绪状态，提供积极支持
4. 记住用户的偏好和历史交流
5. 用友好、专业的语气交流
请确保回答简洁、实用，并与用户建立良好的情感连接。`
  };
};

// 添加辅助函数，测试API连通性
export const testAPIConnection = async (): Promise<boolean> => {
  try {
    console.log('测试代理服务器连接...');
    
    // 先测试代理服务器是否在线
    const healthCheck = await fetch('http://localhost:3001/api/health')
      .then(res => res.json())
      .catch(() => null);
    
    if (!healthCheck || healthCheck.status !== 'ok') {
      console.error('代理服务器未运行，请先启动server.js');
      throw new Error('代理服务器未运行，请先运行: node server.js');
    }
    
    // 测试与AI的通信
    const testMessages: Array<Message> = [
      {
        role: 'user' as const,
        content: '你好，这是一个测试消息，请回复"API正常工作"'
      }
    ];
    
    // 简短的请求，仅用于测试连接
    const response = await fetch(API_CONFIG.proxyURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: testMessages,
        max_tokens: 10,
        temperature: 0
      })
    });
    
    if (!response.ok) {
      console.error('API测试失败，状态码:', response.status);
      throw new Error(`API测试失败，状态码: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API测试成功:', data);
    return true;
  } catch (error) {
    console.error('API连通性测试失败:', error);
    return false;
  }
};

export default {
  sendMessageToAI,
  getDefaultSystemMessage,
  testAPIConnection
}; 