import React, { useState, useEffect } from 'react';
import { useEmotionStore } from '../../store/emotionStore';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

// 定义对话消息类型
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'insight' | 'task' | 'goal';
  relatedEntityId?: string;
}

// 定义记忆类型
interface Memory {
  key: string;
  value: string;
  lastUpdated: Date;
  importance: number; // 1-10
}

// 对话记忆组件属性
interface ConversationMemoryProps {
  onSendMessage: (message: string) => Promise<string>;
  onCreateTask?: (taskTitle: string) => void;
  onViewGoal?: (goalId: string) => void;
}

const ConversationMemory: React.FC<ConversationMemoryProps> = ({
  onSendMessage,
  onCreateTask,
  onViewGoal
}) => {
  // 状态
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);
  
  // 从其他Store获取数据
  const currentEmotion = useEmotionStore(state => state.currentEmotion);
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  
  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessages: Message[] = [
      {
        id: '1',
        content: '你好！我是你的AI助手。今天我能帮你什么呢？',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ];
    
    setMessages(welcomeMessages);
    
    // 根据情绪生成建议回复
    generateSuggestedResponses();
  }, []);
  
  // 根据用户情绪和目标/任务情况生成建议回复
  const generateSuggestedResponses = () => {
    const suggestions: string[] = [];
    
    // 情绪建议
    if (currentEmotion) {
      if (currentEmotion.emotion === 'happy' || currentEmotion.emotion === 'excited') {
        suggestions.push('我今天感觉很好，有什么能帮我保持这种状态的建议吗？');
      } else if (currentEmotion.emotion === 'anxious' || currentEmotion.emotion === 'sad') {
        suggestions.push('我今天心情不太好，有什么调节情绪的方法吗？');
      }
    } else {
      suggestions.push('我想记录一下今天的情绪状态');
    }
    
    // 任务相关建议
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length > 0) {
      suggestions.push(`帮我规划今天的${incompleteTasks.length}个未完成任务`);
    } else {
      suggestions.push('我需要规划明天的任务');
    }
    
    // 目标相关建议
    if (goals.length > 0) {
      const highPriorityGoals = goals.filter(goal => goal.priority === 'high');
      if (highPriorityGoals.length > 0) {
        suggestions.push(`我想讨论一下关于"${highPriorityGoals[0].title}"这个目标的进展`);
      } else {
        suggestions.push('我想设定一个新的重要目标');
      }
    } else {
      suggestions.push('帮我创建一个新目标');
    }
    
    setSuggestedResponses(suggestions);
  };
  
  // 处理消息发送
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // 检查是否包含任务创建意图
    const hasTaskCreationIntent = /创建任务|添加任务|新任务|新增任务|记录任务|安排任务/g.test(inputMessage);
    console.log('检测任务创建意图:', hasTaskCreationIntent);
    
    try {
      // 将上下文信息附加到请求中
      const contextInfo = {
        currentEmotion: currentEmotion,
        recentGoals: goals.slice(0, 3),
        incompleteTasks: tasks.filter(task => !task.completed).slice(0, 5),
        memories: memories.slice(0, 5)
      };
      
      // 添加内存
      updateMemories(inputMessage);
      
      // 调用API获取回复
      const aiResponse = await onSendMessage(
        JSON.stringify({
          message: inputMessage,
          context: contextInfo
        })
      );
      
      // 处理任务创建意图
      if (hasTaskCreationIntent && onCreateTask) {
        const taskTitle = extractTaskTitle(inputMessage);
        console.log('提取的任务标题:', taskTitle);
        if (taskTitle) {
          onCreateTask(taskTitle);
        }
      }
      
      // 将AI回复添加到消息列表
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 更新建议回复
      generateSuggestedResponses();
    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，我现在遇到了一些问题，无法回复你的消息。请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 从用户消息中提取任务标题
  const extractTaskTitle = (message: string): string | null => {
    // 简单的规则提取
    const taskRegex = /[创建|添加|新建|记录|安排]任务[：:]\s*(.+)$/;
    const match = message.match(taskRegex);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    // 更通用的提取方式
    const lines = message.split(/[\n,.，。]/);
    for (const line of lines) {
      if (line.includes('任务') && line.length < 50) {
        const cleanLine = line.replace(/[创建|添加|新建|记录|安排]任务[：:：]?\s*/g, '').trim();
        if (cleanLine.length > 0) {
          return cleanLine;
        }
      }
    }
    
    // 尝试直接提取句子中可能的任务描述
    if (message.includes('任务') && message.length < 100) {
      const taskPart = message.split(/任务[是为:：]?/)[1];
      if (taskPart && taskPart.trim().length > 0) {
        return taskPart.trim();
      }
    }
    
    return null;
  };
  
  // 更新记忆库
  const updateMemories = (message: string) => {
    const newMemory: Memory = {
      key: `user_message_${Date.now()}`,
      value: message,
      lastUpdated: new Date(),
      importance: calculateImportance(message)
    };
    
    setMemories(prev => {
      const updated = [...prev, newMemory];
      // 保持内存最多20条，按重要性排序
      return updated
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 20);
    });
  };
  
  // 计算消息重要性
  const calculateImportance = (message: string): number => {
    let importance = 5; // 默认中等重要性
    
    // 包含关键词的消息更重要
    const importantKeywords = ['目标', '任务', '重要', '紧急', '截止', '困难', '帮助', '问题', '挑战'];
    importantKeywords.forEach(keyword => {
      if (message.includes(keyword)) importance += 1;
    });
    
    // 长消息可能更重要
    if (message.length > 100) importance += 1;
    
    // 包含问号的消息可能是问题
    if (message.includes('?') || message.includes('？')) importance += 1;
    
    // 限制范围在1-10
    return Math.min(Math.max(importance, 1), 10);
  };
  
  // 使用建议回复
  const handleUseSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="text-xs text-right mt-1 opacity-70">
                {new Intl.DateTimeFormat('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 建议回复 */}
      {suggestedResponses.length > 0 && !isLoading && (
        <div className="px-4 py-2 space-x-2 flex overflow-x-auto">
          {suggestedResponses.map((suggestion, index) => (
            <button
              key={index}
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full whitespace-nowrap"
              onClick={() => handleUseSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* 输入框 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="发送消息..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="ml-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationMemory; 