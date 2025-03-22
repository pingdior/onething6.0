import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, 
  Avatar, Chip, CircularProgress, Divider,
  Alert
} from '@mui/material';
import { SendRounded, AutoAwesomeRounded, WifiOff } from '@mui/icons-material';
import { sendMessageToAI, getDefaultSystemMessage, Message, getAIResponse } from '../../services/aiService';

interface CompanionProps {
  onClose?: () => void;
}

const Companion: React.FC<CompanionProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
  }>>([
    {
      id: '1',
      text: '你好！我是你的OneThing AI伙伴，我可以帮助你设定目标、分解任务，或者聊聊你的进展。有什么我能帮到你的吗？',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([
    '如何设定一个好的目标？',
    '帮我提高工作效率',
    '我感到有些焦虑，有什么建议？'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 定期尝试重新连接AI服务
  useEffect(() => {
    if (connectionError && reconnectAttempts < 3) {
      const timer = setTimeout(() => {
        console.log(`尝试重新连接AI服务 (${reconnectAttempts + 1}/3)...`);
        testConnection();
      }, 5000 * (reconnectAttempts + 1)); // 指数退避
      
      return () => clearTimeout(timer);
    }
  }, [connectionError, reconnectAttempts]);
  
  // 测试连接
  const testConnection = async () => {
    try {
      // 获取API基础URL
      const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';
      
      // 简单的测试请求
      await fetch(`${apiBaseUrl}/api/health`)
        .then(res => {
          if (!res.ok) throw new Error('API服务器不可用');
          return res.json();
        });
      
      // 如果成功，清除错误状态
      setConnectionError(null);
      setIsOfflineMode(false);
      console.log('AI服务连接正常');
    } catch (error) {
      // 如果失败，增加重连次数并保持离线模式
      setReconnectAttempts(prev => prev + 1);
      setConnectionError('AI服务连接失败');
      setIsOfflineMode(true);
      console.error('AI服务连接测试失败:', error);
    }
  };
  
  // 初始化时测试连接
  useEffect(() => {
    testConnection();
  }, []);
  
  // 发送消息到AI
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // 添加用户消息到列表
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // 如果是离线模式，使用模拟响应
    if (isOfflineMode) {
      try {
        // 使用本地模拟响应
        const simulatedResponse = await getAIResponse(text);
        
        // 添加模拟回复到列表
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          text: simulatedResponse.text,
          sender: 'assistant' as const,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // 使用模拟回复中的建议
        if (simulatedResponse.suggestions) {
          setSuggestions(simulatedResponse.suggestions);
        } else {
          // 从回复中提取建议
          extractSuggestions(simulatedResponse.text);
        }
      } catch (error: any) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    try {
      // 转换成AI服务需要的格式
      const messageHistory: Message[] = [
        getDefaultSystemMessage(),
        ...messages.map(msg => ({
          role: msg.sender,
          content: msg.text
        })),
        { role: 'user', content: text }
      ];
      
      // 调用AI服务
      const response = await sendMessageToAI(messageHistory);
      
      // 添加AI回复到列表
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // 从回复中提取建议
      extractSuggestions(response);
      
      // 重置连接错误状态
      if (connectionError) {
        setConnectionError(null);
        setReconnectAttempts(0);
        setIsOfflineMode(false);
      }
    } catch (error: any) {
      // 处理错误
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 统一错误处理
  const handleError = (error: any) => {
    console.error('与AI通信错误:', error);
    
    // 将服务器连接错误与其他错误区分
    if (error.message.includes('网络') || 
        error.message.includes('连接') || 
        error.message.includes('Failed to fetch')) {
      // 标记为离线模式
      setIsOfflineMode(true);
      setConnectionError('无法连接到AI服务器，请检查您的网络连接或稍后再试');
      
      // 添加连接错误消息
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: '无法连接到AI服务器，请检查您的网络连接或稍后再试',
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } else {
      // 添加一般错误消息
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `抱歉，我遇到了一些问题：${error.message || '未知错误'}`,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  // 从AI回复中提取建议
  const extractSuggestions = (text: string) => {
    // 简单实现：查找问号，提取可能的建议
    const sentences = text.split(/[.?！？。]/g)
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 40 && (s.includes('？') || s.includes('?')));
    
    if (sentences.length > 0) {
      setSuggestions(sentences.slice(0, 3));
    } else {
      // 如果没有找到问句，提供一些通用建议
      setSuggestions([
        '告诉我更多关于你的目标',
        '你今天完成了什么任务？',
        '需要我帮你分解任务吗？'
      ]);
    }
  };
  
  // 处理按键事件（回车发送）
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };
  
  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  // 格式化消息时间
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 伙伴头部 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.dark',
              width: 48,
              height: 48,
              mr: 2,
              border: '2px solid white'
            }}
          >
            AI
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              OneThing AI 伙伴
            </Typography>
            <Typography variant="caption">
              你的个人成长助手 • {isOfflineMode ? '离线模式' : '在线'}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* 离线模式提示 */}
      {isOfflineMode && (
        <Alert 
          severity="warning" 
          icon={<WifiOff />}
          sx={{ borderRadius: 0 }}
        >
          当前处于离线模式，使用本地模拟回复 {reconnectAttempts < 3 && '(正在尝试重连...)'}
        </Alert>
      )}
      
      {/* 消息列表 */}
      <Box 
        sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 2,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map(message => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                maxWidth: '80%',
                p: 2,
                borderRadius: message.sender === 'user' 
                  ? '12px 12px 0 12px' 
                  : '12px 12px 12px 0',
                bgcolor: message.sender === 'user'
                  ? 'primary.main'
                  : 'background.paper',
                color: message.sender === 'user'
                  ? 'white'
                  : 'text.primary',
                boxShadow: 1
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {formatMessageTime(message.timestamp)}
            </Typography>
          </Box>
        ))}
        
        {/* 如果正在加载，显示打字指示 */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '12px 12px 12px 0',
                bgcolor: 'background.paper',
                width: 80
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={20} />
              </Box>
            </Box>
          </Box>
        )}
        
        {/* 用于自动滚动到底部的引用 */}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* 建议按钮 */}
      <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {suggestions.map((suggestion, index) => (
          <Chip 
            key={index}
            label={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            sx={{ 
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white'
              }
            }}
            icon={<AutoAwesomeRounded fontSize="small" />}
          />
        ))}
      </Box>
      
      <Divider />
      
      {/* 输入区域 */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
            p: 1
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="standard"
            placeholder="输入消息，按回车发送..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              disableUnderline: true,
              sx: { px: 1 }
            }}
          />
          <IconButton 
            color="primary"
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
          >
            <SendRounded />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Companion; 