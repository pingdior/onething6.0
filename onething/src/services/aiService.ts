/**
 * AI服务模块，用于调用后端代理API
 */

import axios, { AxiosError } from 'axios';

// 后端代理API的相对路径
const API_CONFIG = {
  proxyURL: `/api/chat`,
  // model: 'deepseek-v3', // 模型名称由后端处理
};

// 获取基础URL，确保在移动端和Web端都能正确连接后端
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境使用配置的后端URL
    // 注意：这里是后端服务的URL，不是AI服务本身的URL
    return process.env.REACT_APP_API_URL || 'http://localhost:5005'; // 默认为本地后端地址
  }
  // 生产环境：使用相对路径，由Nginx等代理处理
  return '';
};

// 消息类型定义 (与后端保持一致)
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// AI响应类型 (定义前端期望的数据结构)
export interface AIResponse {
  text: string;
  suggestions?: string[];
}

/**
 * 检测当前设备是否为移动设备
 */
export const isMobile = () => {
  // 检查navigator是否存在，以兼容非浏览器环境（如SSR或测试）
  if (typeof navigator !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  return false;
};

// --- 调用后端代理 API 的函数 ---
const makeApiCallToBackend = async (messages: Message[]): Promise<string> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${API_CONFIG.proxyURL}`;
  
  console.log(`[FRONTEND aiService] Making API call to backend proxy: ${url}`);
  console.log(`[FRONTEND aiService] Payload being sent:`, { messages }); // 只发送messages，模型由后端决定

  try {
    const response = await axios.post(
      url,
      {
        // 只发送 messages，模型和其他参数由后端 server.js 决定和添加
        messages: messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 设置稍长的前端超时时间 (60秒)
      }
    );

    // 检查后端返回的数据结构是否符合预期 (包含 choices[0].message.content)
    if (response.data && response.data.choices && response.data.choices[0] &&
        response.data.choices[0].message && typeof response.data.choices[0].message.content === 'string') {
      console.log('[FRONTEND aiService] Received successful response from backend.');
      return response.data.choices[0].message.content;
    } else {
      // 如果后端返回了非预期的成功响应结构 (例如返回了兜底错误但状态码是200)
      console.error('[FRONTEND aiService] Unexpected success response structure from backend:', response.data);
      // 尝试从可能的兜底响应中提取消息，否则抛出通用错误
      const fallbackMessage = response.data?.choices?.[0]?.message?.content || '收到意外的响应结构';
      throw new Error(fallbackMessage);
    }
  } catch (error) {
    console.error('[FRONTEND aiService] Backend proxy call failed:', error);

    // 尝试从 Axios 错误中提取后端返回的错误信息
    if (axios.isAxiosError(error) && error.response && error.response.data) {
       console.error('[FRONTEND aiService] Error response data from backend:', error.response.data);
       // 优先使用后端返回的错误消息（可能是兜底消息）
       const backendErrorMessage = error.response.data?.choices?.[0]?.message?.content || error.response.data.error || '与后端通信失败';
       throw new Error(backendErrorMessage);
    }
    // 其他类型的错误（网络错误等）
    throw new Error('无法连接到服务器，请检查网络连接。');
  }
};

// --- 发送消息到AI（通过后端代理） ---
const sendMessageToAI = async (messages: Message[]): Promise<string> => {
  // 不需要在这里处理主备切换，后端会处理
  // 不需要在这里读取 API Key
  console.log('[FRONTEND sendMessageToAI] Preparing to call backend...');
  try {
    const result = await makeApiCallToBackend(messages);
    console.log('[FRONTEND sendMessageToAI] Successfully received response via backend.');
    return result;
  } catch (error: any) {
    console.error('[FRONTEND sendMessageToAI] Error calling backend:', error.message);
    // 将从后端（或网络层）捕获的错误向上抛出，由调用者（如ChatSidebar）处理并显示给用户
    throw error;
  }
};

/**
 * 生成默认的系统提示信息 (这个可以在前端保留)
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

// --- 测试API连通性 (也应该测试后端代理) ---
export const testAPIConnection = async (): Promise<boolean> => {
  const baseUrl = getBaseUrl();
  const healthCheckUrl = baseUrl ? `${baseUrl}/api/health` : '/api/health';
  console.log('[FRONTEND testAPIConnection] Testing backend health at:', healthCheckUrl);

  try {
    const response = await fetch(healthCheckUrl);
    if (!response.ok) {
      throw new Error(`Backend health check failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error('Backend health check returned non-ok status.');
    }
    console.log('[FRONTEND testAPIConnection] Backend health check successful:', data);
    // 可以选择性地再调用 /api/test-ai，但这会消耗API额度
    // const testAiUrl = baseUrl ? `${baseUrl}/api/test-ai` : '/api/test-ai';
    // const aiTestResponse = await fetch(testAiUrl);
    // ... handle AI test response ...
    return true; // 仅确认后端可达
  } catch (error) {
    console.error('[FRONTEND testAPIConnection] Backend connection test failed:', error);
    return false;
  }
};

// --- 自动目标分解 (调用后端代理) ---
// 注意：autoBreakdownGoal 和 analyzeGoal 逻辑类似，都应通过 sendMessageToAI 调用后端
export const autoBreakdownGoal = async (goal: string, description: string): Promise<{id: string; title: string; completed: boolean}[]> => {
  console.log('[FRONTEND autoBreakdownGoal] Requesting goal breakdown from backend...');
  const systemPrompt = {
    role: 'system' as const,
    content: `你是OneThing的AI助手，专注于目标管理。现在你需要将用户的大目标分解为5-7个具体可执行的子目标。子目标应当：
    1. 符合SMART原则（具体、可衡量、可实现、相关、有时限）
    2. 逻辑顺序合理，从开始到完成
    3. 每个子目标应具体明确，便于执行和追踪
    4. 返回格式必须是JSON数组，每个子目标包含title属性
    请不要添加任何其他文字说明，只返回JSON数组。` // 要求后端返回不带 completed 的 JSON
  };

  const userPrompt = {
    role: 'user' as const,
    content: `请将以下目标分解为子目标:
    目标标题: ${goal}
    目标描述: ${description}`
  };

  const messages = [systemPrompt, userPrompt];

  try {
    // 调用 sendMessageToAI 来通过后端获取分解结果
    const responseText = await sendMessageToAI(messages);
    console.log('[FRONTEND autoBreakdownGoal] Received response text from backend:', responseText);

    // 解析后端返回的文本（假设后端直接返回了AI生成的JSON或类似文本）
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/); // 提取可能的JSON数组
      if (jsonMatch) {
        const subGoalsParsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(subGoalsParsed)) {
          console.log('[FRONTEND autoBreakdownGoal] Successfully parsed JSON response.');
          return subGoalsParsed.map((sg: any, index: number) => ({
            id: `ai-${Date.now()}-${index}`,
            title: sg.title || `未命名子目标 ${index + 1}`, // 提供默认标题
            completed: false // 前端添加 completed 状态
          }));
        }
      }
       console.warn('[FRONTEND autoBreakdownGoal] Response was not a valid JSON array. Attempting line splitting.');
      // 如果不是标准JSON，尝试按行分割
      const lines = responseText.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith("```"));
      if (lines.length > 0) {
         console.log('[FRONTEND autoBreakdownGoal] Parsed response by splitting lines.');
        return lines.map((line, index) => ({
          id: `ai-${Date.now()}-${index}`,
          title: line.replace(/^\d+[\.\)、]\s*/, ''), // 清理可能的序号
          completed: false
        }));
      }
      throw new Error('无法从AI响应中解析出子目标列表。');

    } catch (parseError: any) {
      console.error('[FRONTEND autoBreakdownGoal] Failed to parse AI response:', parseError.message);
      throw new Error(`解析目标分解结果失败: ${parseError.message}`);
    }
  } catch (error: any) {
    console.error('[FRONTEND autoBreakdownGoal] Error during goal breakdown:', error.message);
    // 抛出错误，让调用者处理UI
    throw error;
  }
};

// --- Re-add the getAIResponse function ---
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

// 导出所有需要被外部使用的函数和类型
export default {
  sendMessageToAI,
  getDefaultSystemMessage,
  testAPIConnection,
  autoBreakdownGoal,
  isMobile,
  getAIResponse,
  // analyzeGoal 如果也需要，也应导出
}; 