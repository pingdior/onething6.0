import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, 
  Avatar, Chip, CircularProgress, Divider,
  Alert
} from '@mui/material';
import { SendRounded, AutoAwesomeRounded, WifiOff } from '@mui/icons-material';
import aiService, { Message, AIResponse } from '../../services/aiService';

interface CompanionProps {
  onClose?: () => void;
  embedded?: boolean;
}

const Companion: React.FC<CompanionProps> = ({ onClose, embedded = false }) => {
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
  const [suggestions, setSuggestions] = useState<string[]>([
    '如何设定一个好的目标？',
    '帮我规划今天的任务',
    '我感觉有点焦虑'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 测试AI连接
  const testConnection = async () => {
    try {
      // 实际项目中，这里应该调用API检查连接
      // const response = await fetch('/api/test-connection');
      // if (!response.ok) throw new Error('连接测试失败');
      setIsOfflineMode(false);
      return true;
    } catch (error) {
      console.error('连接测试失败:', error);
      setIsOfflineMode(true);
      return false;
    }
  };
  
  // 组件加载时测试连接
  useEffect(() => {
    testConnection();
  }, []);
  
  // 发送消息处理
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // 添加用户消息到消息列表
    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // 如果离线模式，使用简单回复
      if (isOfflineMode) {
        setTimeout(() => {
          const offlineResponse = {
            id: (Date.now() + 1).toString(),
            text: '我目前无法连接到服务器。我能提供一些基本帮助，但无法分析复杂问题。请检查你的网络连接，或稍后再试。',
            sender: 'assistant' as const,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, offlineResponse]);
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      // 构建会话历史
      const conversationHistory: Message[] = [
        aiService.getDefaultSystemMessage(),
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        { role: 'user', content: text }
      ];
      
      // 使用sendMessageToAI而不是getAIResponse
      const aiResponseText = await aiService.sendMessageToAI(conversationHistory);
      
      // 提取回复中的建议
      const extractedSuggestions = extractSuggestions(aiResponseText);
      if (extractedSuggestions.length > 0) {
        setSuggestions(extractedSuggestions);
      }
      
      // 添加AI回复到消息列表
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理错误
  const handleError = (error: any) => {
    console.error('AI回复错误:', error);
    const errorMessage = {
      id: (Date.now() + 1).toString(),
      text: '抱歉，我遇到了一些问题。请稍后再试或联系支持人员。',
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
    
    // 设置离线模式
    setIsOfflineMode(true);
  };
  
  // 分析回复中的建议（简化实现）
  const extractSuggestions = (text: string): string[] => {
    // 简单实现：查找特定格式的建议
    // 在实际项目中，可能需要更复杂的NLP处理
    const suggestionPattern = /可以尝试以下方法：\s*?([\s\S]*?)(?:\n\n|$)/;
    const match = text.match(suggestionPattern);
    
    if (match && match[1]) {
      // 分割建议成数组
      return match[1].split(/\n/)
        .map(s => s.replace(/^[•-]\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 3);
    }
    
    return [];
  };
  
  // 处理键盘输入
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

  // 根据嵌入模式应用不同样式
  const containerStyles = embedded
    ? {}
    : {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
        height: 'calc(100vh - 80px)'
      };
    
  const chatBoxStyles = embedded
    ? {
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100%',
        maxHeight: '400px',
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
      };

  return (
    <Box sx={containerStyles}>
      {!embedded && (
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          AI伴侣
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ float: 'right' }}>
              ✕
            </IconButton>
          )}
        </Typography>
      )}
      
      {isOfflineMode && !embedded && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          离线模式：无法连接到AI服务器，功能有限
        </Alert>
      )}
      
      <Box sx={chatBoxStyles}>
        {/* 聊天消息区域 */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: embedded ? 0 : 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}>
          {messages.map(message => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              {message.sender === 'assistant' && (
                <Avatar
                  sx={{
                    bgcolor: '#4ECDC4',
                    width: 32,
                    height: 32,
                    mr: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  AI
                </Avatar>
              )}
              
              <Box
                sx={{
                  maxWidth: '70%',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: message.sender === 'user' ? '#4B63FB' : '#f5f5f5',
                  color: message.sender === 'user' ? 'white' : 'inherit',
                  position: 'relative',
                  
                  '&::after': message.sender === 'user' ? {
                    content: '""',
                    position: 'absolute',
                    right: '-8px',
                    top: '8px',
                    border: '8px solid transparent',
                    borderRight: 'none',
                    borderLeft: `8px solid #4B63FB`,
                  } : message.sender === 'assistant' ? {
                    content: '""',
                    position: 'absolute',
                    left: '-8px',
                    top: '8px',
                    border: '8px solid transparent',
                    borderLeft: 'none',
                    borderRight: `8px solid #f5f5f5`,
                  } : undefined
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {formatMessageTime(message.timestamp)}
                </Typography>
              </Box>
            </Box>
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', ml: 1 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="body2">AI正在回复...</Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        {/* 建议区域 */}
        {suggestions.length > 0 && !embedded && (
          <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ 
                  bgcolor: '#f5f5f5', 
                  '&:hover': { bgcolor: '#e0e0e0' },
                  cursor: 'pointer'
                }}
              />
            ))}
          </Box>
        )}
        
        {/* 简化的建议区域（嵌入模式） */}
        {suggestions.length > 0 && embedded && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            <Chip
              label={suggestions[0]}
              size="small"
              onClick={() => handleSuggestionClick(suggestions[0])}
              sx={{ 
                bgcolor: '#f5f5f5', 
                '&:hover': { bgcolor: '#e0e0e0' },
                cursor: 'pointer'
              }}
            />
          </Box>
        )}
        
        {/* 输入区域 */}
        <Box sx={{ 
          display: 'flex', 
          p: embedded ? 1 : 2, 
          pt: embedded ? 0 : 2,
          borderTop: '1px solid #f0f0f0' 
        }}>
          <TextField
            fullWidth
            placeholder="输入消息..."
            variant="outlined"
            size={embedded ? "small" : "medium"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#f5f5f5',
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={() => sendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            sx={{ ml: 1 }}
          >
            <SendRounded />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Companion;