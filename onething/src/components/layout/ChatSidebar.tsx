import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Badge, Avatar, Divider } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import aiService, { Message as AIMessage } from '../../services/aiService';
import { useTaskStore, Task } from '../../store/taskStore';
import taskDiscussService, { TaskDiscussEvent } from '../../services/taskDiscussService';
import CompanionInfoDialog from '../companion/CompanionInfoDialog';

// 消息类型定义
interface ChatMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  isError?: boolean; // 添加错误标志
}

// 本地存储键
const STORAGE_KEYS = {
  MESSAGES: 'onething_chat_messages',
  CONVERSATION_HISTORY: 'onething_conversation_history'
};

const ChatSidebar: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiTested, setIsApiTested] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // 保存对话历史记录（用于API请求）
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([
    aiService.getDefaultSystemMessage()
  ]);

  const [showCompanionInfo, setShowCompanionInfo] = useState(false);

  // 从本地存储加载聊天历史
  useEffect(() => {
    try {
      // 加载UI显示消息
      const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // 将时间戳字符串转回Date对象
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
      
      // 加载对话历史记录
      const savedHistory = localStorage.getItem(STORAGE_KEYS.CONVERSATION_HISTORY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // 确保系统消息始终存在
        if (parsedHistory.length === 0 || parsedHistory[0].role !== 'system') {
          parsedHistory.unshift(aiService.getDefaultSystemMessage());
        }
        setConversationHistory(parsedHistory);
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  }, []);

  // 保存聊天历史到本地存储
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);
  
  // 保存对话历史到本地存储
  useEffect(() => {
    if (conversationHistory.length > 1) { // 不仅仅是系统消息
      localStorage.setItem(STORAGE_KEYS.CONVERSATION_HISTORY, JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  // 消息自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 组件挂载时测试API连接
  useEffect(() => {
    if (!isApiTested) {
      testAPIConnection();
    }
  }, [isApiTested]);
  
  // 初始化欢迎信息
  useEffect(() => {
    // 只在首次渲染时添加欢迎消息，如果没有已保存的消息
    if (messages.length === 0) {
      const taskCount = tasks.length;
      const welcomeMessage: ChatMessage = {
        id: '1',
        text: `早上好！今天安排了${taskCount}个任务，我来帮你规划一下时间。`,
        isAI: true,
        timestamp: new Date()
      };
      
      const detailMessage: ChatMessage = {
        id: '2',
        text: tasks.length > 0 
          ? `最重要的是${tasks[0].time}的${tasks[0].title}，建议你优先完成它。`
          : '今天暂时没有任务安排，需要我帮你创建一些任务吗？',
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage, detailMessage]);
    }
  }, [tasks, messages.length]);
  
  // 测试API连接
  const testAPIConnection = async () => {
    setIsApiTested(true);
    try {
      const connected = await aiService.testAPIConnection();
      if (!connected) {
        addErrorMessage('无法连接到AI服务器，请检查您的网络连接或稍后再试。');
      }
    } catch (error) {
      console.error('API连接测试失败:', error);
      addErrorMessage('API连接测试失败，可能无法与AI助手对话。');
    }
  };
  
  // 添加错误消息到聊天
  const addErrorMessage = (errorText: string) => {
    const errorMessage: ChatMessage = {
      id: Date.now().toString(),
      text: errorText,
      isAI: true,
      timestamp: new Date(),
      isError: true
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  // 处理添加任务请求
  const handleAddTask = (taskContent: string) => {
    // 简单解析时间 - 实际中可能需要更复杂的自然语言处理
    const timeRegex = /(\d{1,2})[:.：](\d{2})/g;
    // 使用Array.from将迭代器转换为数组
    const timeMatches = Array.from(taskContent.matchAll(timeRegex));
    
    let startTime = '';
    let endTime = '';
    
    if (timeMatches.length >= 2) {
      // 找到两个时间点
      startTime = `${timeMatches[0][1].padStart(2, '0')}:${timeMatches[0][2]}`;
      endTime = `${timeMatches[1][1].padStart(2, '0')}:${timeMatches[1][2]}`;
    } else if (timeMatches.length === 1) {
      // 只找到一个时间点，假设任务持续1小时
      const hour = parseInt(timeMatches[0][1]);
      const minute = timeMatches[0][2];
      startTime = `${hour.toString().padStart(2, '0')}:${minute}`;
      endTime = `${(hour + 1).toString().padStart(2, '0')}:${minute}`;
    } else {
      // 找不到时间信息，设置默认时间
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      endTime = `${(hour + 1).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    // 提取任务标题
    let title = taskContent;
    
    // 去除时间信息
    timeMatches.forEach(match => {
      title = title.replace(match[0], '');
    });
    
    // 去除一些常见的提示词
    title = title.replace(/添加任务|创建任务|新任务|帮我记住|记一个|提醒我|安排|记住我要/g, '');
    title = title.trim();
    
    // 确保标题不为空
    if (!title) {
      title = "新任务";
    }
    
    console.log('准备添加任务:', {
      title,
      time: `${startTime}-${endTime}`,
      timeRange: { start: startTime, end: endTime }
    });
    
    // 添加新任务
    const newTask: Omit<Task, 'id'> = {
      title,
      time: `${startTime}-${endTime}`,
      completed: false,
      timeRange: {
        start: startTime,
        end: endTime
      }
    };
    
    try {
      // 添加到任务存储中
      const taskId = addTask(newTask);
      console.log('任务添加成功，ID:', taskId);
      
      return {
        taskId,
        title,
        time: `${startTime}-${endTime}`
      };
    } catch (error) {
      console.error('添加任务失败:', error);
      throw new Error('添加任务时出错，请稍后再试');
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // 创建用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isAI: false,
      timestamp: new Date()
    };

    // 添加到UI消息列表
    setMessages(prev => [...prev, userMessage]);
    
    // 保存用户输入并清空输入框
    const userInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // 检查是否是添加任务请求
      const addTaskPattern = /添加任务|创建任务|新任务|帮我记住|记一个/;
      if (addTaskPattern.test(userInput)) {
        // 使用handleAddTask函数添加任务
        console.log('检测到添加任务请求:', userInput);
        const taskResult = handleAddTask(userInput);
        
        // 任务添加成功的回复
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `我已经帮你添加了一个任务：\n"${taskResult.title}" (${taskResult.time})`,
          isAI: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // 将任务相关消息添加到对话历史
        const aiMsg: AIMessage = {
          role: 'assistant',
          content: `我已经帮你添加了一个任务："${taskResult.title}" (${taskResult.time})`
        };
        setConversationHistory(prev => [...prev, { role: 'user', content: userInput }, aiMsg]);
      } else {
        // 向AI发送消息
        // 创建消息历史记录
        const userMsg: AIMessage = {
          role: 'user',
          content: userInput
        };
        
        // 添加到对话历史
        const updatedHistory = [...conversationHistory, userMsg];
        setConversationHistory(updatedHistory);
        
        try {
          // 调用API获取回复
          const aiReply = await aiService.sendMessageToAI(updatedHistory);
          
          // 创建AI回复消息
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: aiReply,
            isAI: true,
            timestamp: new Date()
          };
          
          // 添加到UI消息列表
          setMessages(prev => [...prev, aiResponse]);
          
          // 添加到对话历史
          const aiMsg: AIMessage = {
            role: 'assistant',
            content: aiReply
          };
          setConversationHistory(prev => [...prev, aiMsg]);
        } catch (error: any) {
          console.error('AI回复获取失败:', error);
          
          // 创建错误消息
          const errorResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: `抱歉，我暂时无法回复: ${error.message || '未知错误'}`,
            isAI: true,
            isError: true,
            timestamp: new Date()
          };
          
          // 添加到UI消息列表
          setMessages(prev => [...prev, errorResponse]);
        }
      }
    } catch (error) {
      console.error('处理消息时发生错误:', error);
      
      // 创建错误消息
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，处理您的消息时出错了。请再试一次。',
        isAI: true,
        isError: true,
        timestamp: new Date()
      };
      
      // 添加到UI消息列表
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 监听任务讨论事件
  useEffect(() => {
    const handleTaskDiscuss = (event: TaskDiscussEvent) => {
      const { task } = event.payload;
      // 构造关于任务的问题
      const discussPrompt = `请帮我分析一下这个任务的重要性和执行建议：
任务名称：${task.title}
时间：${task.time}
${task.goalName ? `相关目标：${task.goalName}` : ''}
${task.description ? `描述：${task.description}` : ''}`;
      
      // 添加到用户消息
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: discussPrompt,
        isAI: false,
        timestamp: new Date()
      };
      
      // 更新UI消息列表
      setMessages(prev => [...prev, userMessage]);
      
      // 发送到AI
      const userMsg: AIMessage = {
        role: 'user',
        content: discussPrompt
      };
      
      // 更新对话历史
      const updatedHistory = [...conversationHistory, userMsg];
      setConversationHistory(updatedHistory);
      
      // 发送请求并获取回复
      setIsLoading(true);
      
      aiService.sendMessageToAI(updatedHistory)
        .then(aiReply => {
          // 创建AI回复消息
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: aiReply,
            isAI: true,
            timestamp: new Date()
          };
          
          // 添加到UI消息列表
          setMessages(prev => [...prev, aiResponse]);
          
          // 添加到对话历史
          const aiMsg: AIMessage = {
            role: 'assistant',
            content: aiReply
          };
          setConversationHistory(prev => [...prev, aiMsg]);
        })
        .catch(error => {
          console.error('获取AI任务分析失败:', error);
          
          // 创建错误消息
          const errorResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: `抱歉，分析任务时出错: ${error.message || '未知错误'}`,
            isAI: true,
            isError: true,
            timestamp: new Date()
          };
          
          // 添加到UI消息列表
          setMessages(prev => [...prev, errorResponse]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    
    // 添加事件监听器
    taskDiscussService.addEventListener(handleTaskDiscuss);
    
    // 清理函数
    return () => {
      taskDiscussService.removeEventListener(handleTaskDiscuss);
    };
  }, [conversationHistory]);

  // 打开伙伴信息面板
  const handleOpenCompanionInfo = () => {
    setShowCompanionInfo(true);
  };
  
  // 关闭伙伴信息面板
  const handleCloseCompanionInfo = () => {
    setShowCompanionInfo(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 聊天头部 */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge 
            badgeContent="Lv.3" 
            color="primary"
            sx={{ 
              '& .MuiBadge-badge': { 
                fontSize: '0.65rem', 
                height: 16, 
                minWidth: 16,
                padding: '0 4px',
                right: -8,
                top: 2,
                borderRadius: '8px'
              }
            }}
          >
            <Avatar
              sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.9rem' }}
            >
              🤖
            </Avatar>
          </Badge>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            AI伙伴
          </Typography>
        </Box>
        
        <IconButton
          size="small"
          onClick={handleOpenCompanionInfo}
          title="AI伙伴信息"
          sx={{ color: 'text.secondary' }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* 聊天消息区域 */}
      <div style={{
        flex: '1',
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 170px)'
      }}>
        {messages.map((message) => (
          <div 
            key={message.id}
            style={{
              marginBottom: '1rem',
              maxWidth: '80%',
              padding: '0.75rem 1rem',
              borderRadius: message.isAI ? '0.75rem 0.75rem 0.75rem 0' : '0.75rem 0.75rem 0 0.75rem',
              backgroundColor: message.isError ? 'var(--danger-color)' : message.isAI ? 'var(--gray-100)' : 'var(--primary-color)',
              color: message.isAI && !message.isError ? 'var(--text-dark)' : 'white',
              marginRight: message.isAI ? 'auto' : '0',
              marginLeft: message.isAI ? '0' : 'auto',
            }}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div style={{
            marginBottom: '1rem',
            maxWidth: '80%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem 0.75rem 0.75rem 0',
            backgroundColor: 'var(--gray-100)',
            marginRight: 'auto'
          }}>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 聊天输入区域 */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--gray-200)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input 
          type="text" 
          style={{
            flex: '1',
            padding: '0.75rem 1rem',
            border: '1px solid var(--gray-300)',
            borderRadius: '1.5rem',
            outline: 'none'
          }}
          placeholder="输入消息..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      
      {/* 伙伴信息弹窗 */}
      <CompanionInfoDialog 
        open={showCompanionInfo} 
        onClose={handleCloseCompanionInfo} 
      />
    </Box>
  );
};

export default ChatSidebar; 