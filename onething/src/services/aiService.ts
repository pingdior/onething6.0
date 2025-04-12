/**
 * AI服务模块，用于调用后端代理API
 */

import axios, { AxiosError } from 'axios';
import { useGoalStore } from '../store/goalStore';

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
    // 强制返回 5005 端口，忽略环境变量以解决持续的端口错误问题
    return 'http://localhost:5005'; 
    // return process.env.REACT_APP_API_URL || 'http://localhost:5005'; // 默认为本地后端地址
  }
  // 生产环境：使用相对路径，由Nginx等代理处理
  return '';
};

// 消息类型定义 (与后端保持一致)
export interface Message {
  role: string;
  content: string;
}

// AI响应类型 (定义前端期望的数据结构)
export interface AIResponse {
  text: string;
  suggestions: string[];
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

/**
 * 发送消息到AI并获取回复
 */
export const sendMessageToAI = async (messages: Message[], option?: any): Promise<AIResponse> => {
  try {
    // 检查用户是否明确要求保存目标
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || '';
    
    // 扩展模式匹配，增加更多可能的目标创建请求表达
    const saveGoalPatterns = [
      /保存(这个|该|一个|新的)?目标/i,
      /创建(这个|该|一个|新的)?目标/i,
      /添加(这个|该|一个|新的)?目标/i,
      /设定(这个|该|一个|新的)?目标/i,
      /设为目标/i,
      /创建新(的)?目标/i,
      /将.*设为(我的|新的)?目标/i
    ];
    
    // 如果任何一个模式匹配，则认为是请求保存目标
    const isRequestingSaveGoal = saveGoalPatterns.some(pattern => pattern.test(lastUserMessage));
    
    console.log('[FRONTEND sendMessageToAI] 用户是否请求保存目标:', isRequestingSaveGoal, '消息:', lastUserMessage);
    
    // 调用后端API
    const responseText = await makeApiCallToBackend(messages);
    
    // 清理响应文本，移除后端可能添加的目标成功添加信息
    let cleanedResponse = responseText.trim();
    cleanedResponse = cleanedResponse.replace(/【已成功添加到您的目标列表】/g, '');
    cleanedResponse = cleanedResponse.replace(/\n*已成功添加到您的目标列表\n*/g, '');
    
    // 检查响应是否指示已经创建了目标
    const responseIndicatesGoalCreated = /已(为你)?(成功)?(添加|创建|设定|保存)(了)?(新的)?目标/.test(cleanedResponse);
    
    console.log('[FRONTEND sendMessageToAI] 回复是否指示已创建目标:', responseIndicatesGoalCreated);
    
    cleanedResponse = cleanedResponse.trim();
    
    // 如果用户请求保存目标或者AI回复中指示已创建目标，尝试创建目标
    let goalCreated = false;
    if (isRequestingSaveGoal || responseIndicatesGoalCreated) {
      console.log('[FRONTEND sendMessageToAI] 尝试创建目标');
      goalCreated = await detectAndCreateGoal(cleanedResponse);
      
      // 如果成功创建了目标，在回复中添加确认信息
      if (goalCreated) {
        cleanedResponse += '\n\n【已成功添加到您的目标列表】';
      }
    }
    
    // 返回处理后的响应
    return {
      text: cleanedResponse,
      suggestions: [] // 目前没有从后端获取建议，可以根据需要添加
    };
  } catch (error) {
    console.error("[FRONTEND sendMessageToAI] Error:", error);
    throw error;
  }
};

// 修复Goal接口类型
interface Goal {
  id?: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  completionRate: number;
}

/**
 * 检测并创建目标
 * @param aiResponse AI的回复文本
 * @returns 是否成功创建了目标
 */
export const detectAndCreateGoal = async (aiResponse: string): Promise<boolean> => {
  console.log("[FRONTEND detectAndCreateGoal] 开始分析AI回复:", aiResponse.substring(0, 100) + "...");
  
  // 检测AI的回复是否包含创建目标的意图
  const intentRegexes = [
    /\b(添加|创建|建立|设立|建议)(这个|一个|该|新的)?目标到(我的|你的|用户的)?列表\b/i,
    /\b(把|将)(这个|一个|该|新的)?(任务|项目|事项)(添加|创建|建立|设立)为(一个)?目标\b/i,
    /\b(这个|该|此)(任务|项目|事项|目标)(很|非常|真的)?(重要|关键|必要)\b/i
  ];
  
  // 检查是否有创建目标的意图
  let hasGoalCreationIntent = false;
  for (const regex of intentRegexes) {
    if (regex.test(aiResponse)) {
      console.log("[FRONTEND detectAndCreateGoal] 检测到目标创建意图，匹配模式:", regex);
      hasGoalCreationIntent = true;
      break;
    }
  }

  // 如果没有明确的创建目标意图，但包含"已成功添加到您的目标列表"这句话，也认为是有创建意图
  if (!hasGoalCreationIntent && aiResponse.includes("已成功添加到您的目标列表")) {
    console.log("[FRONTEND detectAndCreateGoal] 检测到目标添加成功提示，设置为有创建意图");
    hasGoalCreationIntent = true;
  }

  if (!hasGoalCreationIntent) {
    console.log("[FRONTEND detectAndCreateGoal] 未检测到目标创建意图");
    return false;
  }

  // 提取目标信息
  try {
    // 1. 提取标题 - 寻找引号、书名号或方括号中的内容作为标题
    const titleRegexes = [
      /[""【《]([^""\】》]+)[""】》]/,
      /标题[：:]\s*([^\n]+)/i,
      /目标[：:]\s*([^\n]+)/i
    ];
    
    let title = "";
    for (const regex of titleRegexes) {
      const match = aiResponse.match(regex);
      if (match && match[1]) {
        title = match[1].trim();
        console.log("[FRONTEND detectAndCreateGoal] 找到标题:", title);
        break;
      }
    }
    
    if (!title) {
      // 如果没有找到明确的标题，使用第一行作为标题
      const lines = aiResponse.split('\n').filter((l: string) => l.trim());
      if (lines.length > 0) {
        title = lines[0].replace(/^[#*\-•]+\s*/, '').trim();
        console.log("[FRONTEND detectAndCreateGoal] 使用第一行作为标题:", title);
      }
    }
    
    // 标题长度限制
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
      console.log("[FRONTEND detectAndCreateGoal] 标题过长，截断为:", title);
    }
    
    // 2. 提取描述 - 尝试从AI回复中提取合适的描述
    let description = "";
    const lines = aiResponse.split('\n').filter((l: string) => l.trim());
    
    // 跳过第一行(标题)，提取剩余内容作为描述
    lines.forEach((line: string, index: number) => {
      if (index > 0 && line.trim() && !line.includes("优先级") && !line.includes("截止日期")) {
        description += line + "\n";
      }
    });
    
    if (!description) {
      description = "从AI助手创建的目标";
    }
    
    // 3. 提取优先级 - 寻找"优先级"相关内容
    const priorityRegex = /优先级[：:]\s*(高|中|低)/i;
    const priorityMatch = aiResponse.match(priorityRegex);
    let priority: "high" | "medium" | "low" = "medium"; // 默认
    
    if (priorityMatch && priorityMatch[1]) {
      if (priorityMatch[1] === "高") priority = "high";
      else if (priorityMatch[1] === "低") priority = "low";
      else priority = "medium";
      console.log("[FRONTEND detectAndCreateGoal] 找到优先级:", priority);
    }
    
    // 4. 提取截止日期 - 寻找"截止日期"相关内容
    const deadlineRegex = /截止(日期|时间)[：:]\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}|\d{1,2}月\d{1,2}日)/i;
    const deadlineMatch = aiResponse.match(deadlineRegex);
    let deadline = ""; // 默认无截止日期
    
    if (deadlineMatch && deadlineMatch[2]) {
      deadline = deadlineMatch[2];
      console.log("[FRONTEND detectAndCreateGoal] 找到截止日期:", deadline);
      // 处理简化日期格式 (例如 MM/DD 添加当前年份)
      if (/^\d{1,2}[/-]\d{1,2}$/.test(deadline)) {
        const currentYear = new Date().getFullYear();
        const parts = deadline.split(/[/-]/);
        deadline = `${currentYear}/${parts[0]}/${parts[1]}`;
        console.log("[FRONTEND detectAndCreateGoal] 格式化后的截止日期:", deadline);
      }
    }
    
    // 创建目标对象
    const newGoal: Omit<Goal, "id"> = {
      title,
      description,
      priority,
      deadline,
      completionRate: 0
    };
    
    console.log("[FRONTEND detectAndCreateGoal] 提取的目标对象:", newGoal);
    
    // 使用特殊的事件名称，以便所有相关组件都能监听
    const eventName = 'onething-add-goal';
    console.log(`[FRONTEND detectAndCreateGoal] 分发${eventName}事件`);
    
    // 确保目标数据被正确序列化
    window.dispatchEvent(new CustomEvent(eventName, { 
      detail: JSON.parse(JSON.stringify(newGoal)),
      bubbles: true,
      cancelable: true
    }));
    
    console.log("[FRONTEND detectAndCreateGoal] 事件分发完成");
    
    return true;
  } catch (error) {
    console.error("[FRONTEND detectAndCreateGoal] 创建目标时出错:", error);
    return false;
  }
};

// 根据目标标题选择合适的图标
function selectIconForGoal(title: string): string {
  // 转换为小写以便匹配
  const lowerTitle = title.toLowerCase();
  
  // 常见目标类型对应的图标
  if (/学习|课程|教育|考试|认证|书|读书|知识/.test(lowerTitle)) {
    return "📚"; // 学习相关
  } else if (/工作|项目|任务|会议|报告|演讲|提案/.test(lowerTitle)) {
    return "💼"; // 工作相关
  } else if (/健身|运动|跑步|锻炼|健康|瑜伽|游泳/.test(lowerTitle)) {
    return "🏃"; // 健身相关
  } else if (/饮食|营养|减肥|饮水|食谱/.test(lowerTitle)) {
    return "🥗"; // 饮食相关
  } else if (/家庭|孩子|父母|家务|清洁/.test(lowerTitle)) {
    return "🏠"; // 家庭相关
  } else if (/旅行|旅游|出行|度假|出差/.test(lowerTitle)) {
    return "✈️"; // 旅行相关
  } else if (/财务|储蓄|投资|预算|理财|存钱/.test(lowerTitle)) {
    return "💰"; // 财务相关
  } else if (/社交|朋友|聚会|约会|社区/.test(lowerTitle)) {
    return "👥"; // 社交相关
  } else if (/写作|写字|文章|创作|博客/.test(lowerTitle)) {
    return "✍️"; // 写作相关
  } else if (/编程|开发|代码|软件|应用/.test(lowerTitle)) {
    return "💻"; // 编程相关
  } else if (/艺术|音乐|绘画|设计|创意/.test(lowerTitle)) {
    return "🎨"; // 艺术相关
  } else if (/阅读|书籍|小说|文学/.test(lowerTitle)) {
    return "📖"; // 阅读相关
  } else if (/冥想|放松|休息|睡眠/.test(lowerTitle)) {
    return "🧘"; // 心理健康相关
  } else if (/日记|反思|总结|计划/.test(lowerTitle)) {
    return "📝"; // 日记/记录相关
  } else if (/购物|消费|买东西/.test(lowerTitle)) {
    return "🛒"; // 购物相关
  } else if (/生活|习惯|养成/.test(lowerTitle)) {
    return "⭐"; // 习惯养成
  } else if (/成长|提升|进步|发展|能力/.test(lowerTitle)) {
    return "🚀"; // 自我提升
  }
  
  // 默认图标
  return "🎯"; // 默认使用目标图标
}

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
    const response = await sendMessageToAI(messages);
    const responseText = response.text; // 获取AIResponse中的text属性
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
      const lines = responseText.split('\n').map((l: string) => l.trim()).filter((l: string) => l && !l.startsWith("```"));
      if (lines.length > 0) {
        console.log('[FRONTEND autoBreakdownGoal] Parsed response by splitting lines.');
        return lines.map((line: string, index: number) => ({
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
  detectAndCreateGoal,
};