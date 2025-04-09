/**
 * AI服务模块，用于与DeepSeek API通信
 */

import axios, { AxiosError } from 'axios';

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

// 从环境变量读取配置
const primaryApiUrl = process.env.REACT_APP_DEEPSEEK_API_URL; // 提供默认值以防万一
const primaryApiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;

const backupApiUrl = process.env.REACT_APP_BACKUP_AI_API_URL;
const backupApiKey = process.env.REACT_APP_BACKUP_AI_API_KEY;

// 检查环境变量是否设置
if (!primaryApiKey) {
  console.warn('主 AI API Key (REACT_APP_DEEPSEEK_API_KEY) 未在 .env 文件中设置!');
}
if (!backupApiUrl || !backupApiKey) {
  console.warn('备用 AI API URL 或 Key 未在 .env 文件中完全设置，备用方案可能无法启用。');
}

/**
 * 检测当前设备是否为移动设备
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// --- 新增：通用的 API 调用函数 ---
const makeApiCall = async (apiUrl: string, apiKey: string, messages: Message[]) => {
  if (!apiKey) {
    throw new Error('API Key is missing for the request.');
  }
  console.log(`[aiService] Making API call to: ${apiUrl}`); // 日志记录使用的URL

  // 注意：这里的 model 名称可能需要根据 API 提供商调整
  // SiliconFlow 示例使用 "deepseek-ai/DeepSeek-V3"，这可能适用于你的备份API
  // 如果主/备用API需要不同的模型名称，这里需要更复杂的逻辑
  const modelName = "deepseek-v3"; // 或者根据 apiUrl 动态选择

  const response = await axios.post(
    apiUrl,
    {
      model: modelName, // 使用模型名称
      messages: messages,
      // 可以在这里添加 temperature, max_tokens 等参数
      // stream: false, // 明确指定非流式，除非你已经实现了流式处理
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // 假设非流式响应结构是 { choices: [ { message: { content: '...' } } ] }
  // 请根据实际 API 返回结构调整
  if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
    return response.data.choices[0].message.content;
  } else {
    console.error('Unexpected API response structure:', response.data);
    throw new Error('未能从 AI 回复中提取内容。');
  }
};

// --- 修改：核心消息发送函数，增加备用逻辑 ---
const sendMessageToAI = async (messages: Message[]): Promise<string> => {
  // 1. 尝试使用主 API
  if (primaryApiKey && primaryApiUrl) {
    try {
      console.log('[aiService] Attempting primary API...');
      return await makeApiCall(primaryApiUrl, primaryApiKey, messages);
    } catch (error) {
      console.error('[aiService] Primary API call failed:', error);

      // 检查是否是特定的配额错误或其他应触发备用的错误
      let shouldUseBackup = false;
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>; // 类型断言以便访问 response
        const errorCode = axiosError.response?.data?.error?.code;
        const errorMessage = axiosError.response?.data?.error?.message;

        console.log('[aiService] Primary API Error Details:', {
          status: axiosError.response?.status,
          code: errorCode,
          message: errorMessage,
        });

        // 在这里定义触发备用的条件，例如配额错误码或特定消息
        if (errorCode === '20031' || (errorMessage && errorMessage.includes('not enough quota'))) {
          console.log('[aiService] Quota error detected on primary API.');
          shouldUseBackup = true;
        }
        // 你可以根据需要添加其他错误条件，例如 5xx 服务器错误
        // else if (axiosError.response?.status && axiosError.response.status >= 500) {
        //   console.log('[aiService] Primary API server error detected.');
        //   shouldUseBackup = true;
        // }
      }

      if (shouldUseBackup) {
        // 2. 如果主 API 因特定错误失败，并且备用配置存在，则尝试备用 API
        if (backupApiUrl && backupApiKey) {
          console.warn('[aiService] Switching to backup API...');
          try {
            return await makeApiCall(backupApiUrl, backupApiKey, messages);
          } catch (backupError) {
            console.error('[aiService] Backup API call also failed:', backupError);
            // 如果备用也失败，抛出原始错误或特定错误
            throw new Error(`主 AI 服务失败，备用服务也失败: ${backupError instanceof Error ? backupError.message : String(backupError)}`);
          }
        } else {
          console.error('[aiService] Primary API failed, but backup API config is missing.');
          // 如果没有备用配置，则抛出原始错误
          throw error; // 或者抛出一个更具体的错误
        }
      } else {
        // 如果不是需要切换的错误类型，直接抛出原始错误
         throw error;
      }
    }
  } else {
     // 如果连主 API 配置都没有，直接报错或尝试备用（如果存在）
     console.error('[aiService] Primary API config is missing.');
     if (backupApiUrl && backupApiKey) {
       console.warn('[aiService] Primary config missing, attempting backup API directly...');
       try {
         return await makeApiCall(backupApiUrl, backupApiKey, messages);
       } catch (backupError) {
         console.error('[aiService] Backup API call failed:', backupError);
         throw new Error(`主 AI 配置缺失，备用服务也失败: ${backupError instanceof Error ? backupError.message : String(backupError)}`);
       }
     } else {
       throw new Error('主 AI 服务配置缺失，且无备用配置。');
     }
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
    // 获取基础URL，处理开发环境
    const baseUrl = getBaseUrl();
    console.log('测试API连接...使用baseUrl:', baseUrl);
    
    // 构建健康检查URL
    const healthCheckUrl = baseUrl ? `${baseUrl}/api/health` : '/api/health';
    
    // 先测试代理服务器是否在线
    const healthCheck = await fetch(healthCheckUrl)
      .then(res => res.json())
      .catch((err) => {
        console.error('健康检查请求失败:', err);
        return null;
      });
    
    if (!healthCheck || healthCheck.status !== 'ok') {
      console.error('代理服务器未运行或健康检查失败:', healthCheck);
      throw new Error('代理服务器未运行，请先启动server.js (端口5005)');
    }
    
    // 构建测试AI的URL
    const testAiUrl = baseUrl ? `${baseUrl}/api/test-ai` : '/api/test-ai';
    
    // 使用新添加的测试AI端点
    const aiTestResponse = await fetch(testAiUrl, {
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

// --- 新增：独立的备用 API 测试函数 ---
const testBackupApi = async (testMessages: Message[]): Promise<string | { error: string }> => {
  if (!backupApiUrl || !backupApiKey) {
    console.error('[aiService] Backup API config is missing for testing.');
    return { error: '备用 API 配置缺失，无法测试。' };
  }

  console.log('[aiService] Testing Backup API explicitly...');
  try {
    // 直接调用 makeApiCall 使用备用配置
    const result = await makeApiCall(backupApiUrl, backupApiKey, testMessages);
    console.log('[aiService] Backup API Test successful:', result);
    return result; // 返回成功结果
  } catch (error) {
    console.error('[aiService] Backup API Test failed:', error);
    // 返回错误信息
    return { error: `备用 API 测试失败: ${error instanceof Error ? error.message : String(error)}` };
  }
};

export default {
  sendMessageToAI,
  getDefaultSystemMessage,
  testAPIConnection,
  autoBreakdownGoal,
  testBackupApi
}; 