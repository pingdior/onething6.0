/**
 * AI服务模块，用于与DeepSeek API通信
 */

import axios from 'axios';

// 使用环境变量或默认值
const API_CONFIG = {
  // 使用相对路径，适用于所有环境
  proxyURL: `/api/chat`,
  model: 'deepseek-v3',
};

// 获取基础URL，确保在移动端和Web端都能正确连接
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境使用配置的URL
    return process.env.REACT_APP_API_URL || '';
  }
  // 生产环境：优先使用空字符串（相对路径）
  return '';
};

// 消息类型定义
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// AI响应类型
export interface AIResponse {
  text: string;
  suggestions?: string[];
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
    
    // 构建完整URL，确保在不同环境下都能正确连接
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}${API_CONFIG.proxyURL}`;
    
    console.log('正在连接API服务:', fullUrl);
    
    // 使用我们的自定义代理服务器
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
 * 使用AI服务执行目标分解
 */
export const analyzeGoal = async (goalTitle: string, goalDescription: string): Promise<string> => {
  const messages: Message[] = [
    {
      role: 'system',
      content: '你是一位目标分解专家。请帮助用户将大目标分解为更小、更可操作的子目标或任务。'
    },
    {
      role: 'user',
      content: `请帮我分析并分解以下目标:\n标题: ${goalTitle}\n描述: ${goalDescription}\n\n请列出实现这个目标所需的3-5个关键子目标或任务步骤。`
    }
  ];
  
  return sendMessageToAI(messages);
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
    const baseUrl = getBaseUrl();
    console.log('测试代理服务器连接...');
    
    // 先测试代理服务器是否在线
    const healthCheck = await fetch(`${baseUrl}/api/health`)
      .then(res => res.json())
      .catch(() => null);
    
    if (!healthCheck || healthCheck.status !== 'ok') {
      console.error('代理服务器未运行，请先启动server.js');
      throw new Error('代理服务器未运行，请先运行: node server.js');
    }
    
    // 使用新添加的测试AI端点
    const aiTestResponse = await fetch(`${baseUrl}/api/test-ai`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!aiTestResponse.ok) {
      throw new Error('AI服务测试失败');
    }
    
    const testResult = await aiTestResponse.json();
    if (!testResult.success) {
      throw new Error(testResult.message || 'AI服务测试失败');
    }
    
    console.log('API测试成功:', testResult);
    return true;
  } catch (error) {
    console.error('API连通性测试失败:', error);
    return false;
  }
};

// 模拟AI服务 - 后期替换为真实API
export const getAIResponse = async (message: string): Promise<AIResponse> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 简单的响应匹配逻辑
  if (message.includes('目标') || message.includes('goal')) {
    return {
      text: '设定明确的目标是成功的第一步。您想要设定什么类型的目标呢？',
      suggestions: ['学习目标', '健身目标', '工作目标']
    };
  }
  
  if (message.includes('任务') || message.includes('task')) {
    return {
      text: '管理任务可以帮助您更有效地达成目标。需要我帮您安排今天的任务吗？',
      suggestions: ['查看今日任务', '添加新任务', '调整任务优先级']
    };
  }
  
  if (message.includes('情绪') || message.includes('感觉') || message.includes('emotion')) {
    return {
      text: '了解和管理情绪是自我成长的重要部分。您今天感觉如何？',
      suggestions: ['记录今日情绪', '查看情绪趋势', '情绪调节建议']
    };
  }
  
  // 默认响应
  return {
    text: '您好，我是您的AI助手。我可以帮您管理目标、安排任务，或者聊聊您的感受。有什么我能帮到您的吗？',
    suggestions: ['设定新目标', '管理任务', '记录情绪']
  };
};

// 自动目标分解功能
export const autoBreakdownGoal = async (goal: string, description: string): Promise<{id: string; title: string; completed: boolean}[]> => {
  try {
    const systemPrompt = {
      role: 'system' as const,
      content: `你是OneThing的AI助手，专注于目标管理。现在你需要将用户的大目标分解为5-7个具体可执行的子目标。子目标应当：
      1. 符合SMART原则（具体、可衡量、可实现、相关、有时限）
      2. 逻辑顺序合理，从开始到完成
      3. 每个子目标应具体明确，便于执行和追踪
      4. 返回格式必须是JSON数组，每个子目标包含title和completed属性
      请不要添加任何其他文字说明，只返回JSON数组。`
    };

    const userPrompt = {
      role: 'user' as const,
      content: `请将以下目标分解为子目标: 
      目标标题: ${goal}
      目标描述: ${description}`
    };

    const messages = [systemPrompt, userPrompt];
    const response = await sendMessageToAI(messages);
    
    try {
      // 尝试提取和解析JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const subGoals = JSON.parse(jsonStr);
        return subGoals.map((sg: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          title: sg.title,
          completed: false
        }));
      }

      // 如果没有找到JSON格式，尝试将回答按行分割处理
      const lines = response.split('\n').filter(line => 
        line.trim() && !line.includes('子目标') && !line.includes('：') && !line.includes(':')
      );
      
      if (lines.length > 0) {
        return lines.map((line, index) => {
          // 去除可能的序号和特殊字符
          const title = line.replace(/^\d+[\.\)、]\s*/, '').trim();
          return {
            id: `ai-${Date.now()}-${index}`,
            title,
            completed: false
          };
        });
      }
      
      throw new Error('无法解析AI响应');
    } catch (parseError) {
      console.error('解析AI响应出错:', parseError);
      // 如果解析失败，返回一个默认的子目标列表
      return [
        { id: `ai-${Date.now()}-0`, title: '分析目标需求', completed: false },
        { id: `ai-${Date.now()}-1`, title: '制定初步计划', completed: false },
        { id: `ai-${Date.now()}-2`, title: '准备必要资源', completed: false },
        { id: `ai-${Date.now()}-3`, title: '执行核心任务', completed: false },
        { id: `ai-${Date.now()}-4`, title: '评估完成情况', completed: false }
      ];
    }
  } catch (error: any) {
    console.error('目标分解出错:', error);
    throw new Error(`目标分解失败: ${error.message || '未知错误'}`);
  }
};

export default {
  sendMessageToAI,
  getDefaultSystemMessage,
  testAPIConnection,
  autoBreakdownGoal
}; 