import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Grow,
  Zoom,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useTheme } from '@mui/material/styles';
import aiService from '../../services/aiService';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';
import { isMobile } from '../../i18n';
import { useNavigate } from 'react-router-dom';

// 消息接口 - 重命名为EnhancedMessage避免冲突
interface EnhancedMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  thinking?: boolean;
  isError?: boolean; // 添加错误标志
}

// 自定义头像样式
const AvatarStyle = {
  ai: {
    backgroundColor: '#4ECDC4',
    color: 'white',
  },
  user: {
    backgroundColor: '#7C6BFF',
    color: 'white',
  },
};

const EnhancedCompanion: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<EnhancedMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  const isOnMobile = isMobile();
  const navigate = useNavigate();

  // 模拟AI特性等级 - 实际应用中可能从用户数据获取
  const aiLevel = 3;
  const aiExperience = 65; // 百分比

  // 初始化AI伴侣消息
  useEffect(() => {
    // 尝试从localStorage加载消息历史
    const savedMessages = localStorage.getItem('aiChatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // 确保timestamp是Date对象
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        return;
      } catch (error) {
        console.error('解析保存的消息历史出错:', error);
      }
    }

    // 如果没有保存的历史，使用默认欢迎消息
    const welcomeMessage: EnhancedMessage = {
      id: Date.now().toString(),
      text: '你好，我是你的AI目标管理助手。我能帮你设定目标、分解任务，或者给你提供情绪支持。今天有什么我能帮到你的吗？',
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['设定新目标', '今日任务规划', '复盘上周进展'],
    };
    setMessages([welcomeMessage]);
  }, []);

  // 保存消息到localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('aiChatHistory', JSON.stringify(messages));
      } catch (error) {
        console.error('保存消息历史出错:', error);
      }
    }
  }, [messages]);

  // 滚动到最新消息
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 获取当前用户状态摘要，用于AI上下文
  const getUserContext = () => {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const highPriorityGoals = goals.filter(goal => goal.priority === 'high').length;
    const upcomingDeadlines = goals.filter(goal => {
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }).length;

    return `
      用户当前有${pendingTasks}个待完成任务，
      ${highPriorityGoals}个高优先级目标，
      和${upcomingDeadlines}个即将到期的截止日期（7天内）。
    `;
  };

  // 添加跳转到语音输入的处理函数
  const handleVoiceInputClick = () => {
    navigate('/voice-input');
  };

  // 添加跳转到伙伴状态的处理函数
  const handleCompanionStatusClick = () => {
    navigate('/companion-status');
  };

  // 检查是否有从语音页面传来的输入
  useEffect(() => {
    const voiceInputText = localStorage.getItem('voiceInputText');
    if (voiceInputText) {
      // 设置为输入值并自动发送
      setInput(voiceInputText);
      // 清除存储
      localStorage.removeItem('voiceInputText');
      // 延迟一下发送，确保状态更新
      setTimeout(() => {
        const userMessage: EnhancedMessage = {
          id: Date.now().toString(),
          text: voiceInputText,
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        
        // 添加AI思考状态消息
        const thinkingId = Date.now().toString();
        setMessages(prev => [
          ...prev,
          {
            id: thinkingId,
            text: '思考中...',
            sender: 'ai',
            timestamp: new Date(),
            thinking: true,
          },
        ]);
        
        setIsLoading(true);
        
        // 使用已有的发送逻辑发送消息 - 将本地消息格式转换为API所需格式
        aiService.sendMessageToAI([
          aiService.getDefaultSystemMessage(),
          {
            role: 'system' as const,
            content: `这是关于用户当前状态的一些信息：${getUserContext()}`
          },
          ...messages
            .filter(m => !m.thinking)
            .map(m => ({
              role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
              content: m.text,
            })),
          {
            role: 'user' as const,
            content: voiceInputText,
          },
        ])
        .then((response: string) => {
          // 移除思考中消息并添加AI回复
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== thinkingId);
            return [
              ...filtered,
              {
                id: Date.now().toString(),
                text: response,
                sender: 'ai',
                timestamp: new Date(),
                suggestions: [
                  '告诉我更多',
                  voiceInputText.toLowerCase().includes('目标') ? '分解这个目标' : '查看我的目标进度',
                  voiceInputText.toLowerCase().includes('任务') ? '调整任务优先级' : '今日任务规划',
                ],
              },
            ];
          });
        })
        .catch((error: Error) => {
          console.error('AI服务错误:', error);
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== thinkingId);
            return [
              ...filtered,
              {
                id: Date.now().toString(),
                text: `抱歉，请求失败: ${error.message}`,
                sender: 'ai',
                timestamp: new Date(),
                isError: true,
              },
            ];
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
      }, 100);
    }
  }, []);

  // 处理消息发送
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    // 清除输入并添加用户消息
    setInput('');
    setMessages(prev => [...prev, userMessage]);

    // 添加AI思考状态消息
    const thinkingId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      {
        id: thinkingId,
        text: '思考中...',
        sender: 'ai',
        timestamp: new Date(),
        thinking: true,
      },
    ]);

    setIsLoading(true);

    try {
      // 构建发送给AI的消息上下文 - 将本地消息格式转换为API所需格式
      const apiMessages = [
        aiService.getDefaultSystemMessage(),
        {
          role: 'system' as const,
          content: `这是关于用户当前状态的一些信息：${getUserContext()}`
        },
        ...messages
          .filter(m => !m.thinking)
          .map(m => ({
            role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: m.text,
          })),
        {
          role: 'user' as const,
          content: input,
        },
      ];

      // 发送给AI服务
      const response = await aiService.sendMessageToAI(apiMessages);
      
      // 移除思考中消息并添加AI回复
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: response,
            sender: 'ai',
            timestamp: new Date(),
            suggestions: [
              '告诉我更多',
              input.toLowerCase().includes('目标') ? '分解这个目标' : '查看我的目标进度',
              input.toLowerCase().includes('任务') ? '调整任务优先级' : '今日任务规划',
            ],
          },
        ];
      });
    } catch (error: any) { // 添加类型注解
      // 处理错误并移除thinking消息
      console.error('AI服务错误:', error);
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: '抱歉，我遇到了问题，无法处理您的请求。请稍后再试或检查您的网络连接。',
            sender: 'ai',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理快捷建议点击
  const handleSuggestionClick = (text: string) => {
    const userMessage: EnhancedMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    // 设置为输入值并自动发送
    setInput(text);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // 处理键盘按键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化消息时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 渲染消息
  const renderMessage = (message: EnhancedMessage) => {
    // 如果是思考中消息
    if (message.thinking) {
      return (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            opacity: 0.7,
          }}
        >
          <Avatar sx={{ ...AvatarStyle.ai, mr: 1 }}>
            <SmartToyIcon fontSize="small" />
          </Avatar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={16} sx={{ mr: 1 }} />
            <Typography variant="body2">思考中...</Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Grow
        key={message.id}
        in={true}
        timeout={300}
        style={{ transformOrigin: message.sender === 'user' ? 'right' : 'left' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            mb: 2,
            ...(isOnMobile ? { px: 1 } : {}),
          }}
        >
          {message.sender === 'ai' && (
            <Avatar sx={{ ...AvatarStyle.ai, mr: 1, mt: 0.5 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
          )}
          {message.sender === 'user' && (
            <Avatar sx={{ ...AvatarStyle.user, ml: 1, mt: 0.5 }}>张</Avatar>
          )}
          <Box
            sx={{
              maxWidth: '75%',
              ...(isOnMobile ? { maxWidth: '85%' } : {}),
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: message.sender === 'user' ? '#7C6BFF' : '#F0F1F2',
                color: message.sender === 'user' ? 'white' : 'text.primary',
                borderRadius: message.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                ...(isOnMobile ? {
                  borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  p: 2,
                } : {}),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                }}
              >
                {message.text}
              </Typography>
            </Paper>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                mt: 0.5,
                textAlign: message.sender === 'user' ? 'right' : 'left',
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>

            {/* 建议回复 */}
            {message.sender === 'ai' && message.suggestions && message.suggestions.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {message.suggestions.map((suggestion, index) => (
                  <Zoom key={index} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Chip
                      label={suggestion}
                      size="small"
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        borderRadius: '16px',
                        bgcolor: 'rgba(78, 205, 196, 0.1)',
                        color: '#4ECDC4',
                        border: '1px solid rgba(78, 205, 196, 0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(78, 205, 196, 0.2)',
                        },
                        fontSize: '0.75rem',
                        height: '28px',
                      }}
                    />
                  </Zoom>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Grow>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        ...(isOnMobile ? { border: 'none', boxShadow: 'none' } : {}),
      }}
    >
      {/* 伴侣头部 - 添加点击事件 */}
      <Box
        sx={{
          p: 2,
          bgcolor: isOnMobile ? '#4ECDC4' : 'primary.light',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(isOnMobile ? {
            borderRadius: '0 0 16px 16px',
            py: 1.5,
          } : {}),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={handleCompanionStatusClick}>
          <Avatar 
            sx={{ 
              bgcolor: isOnMobile ? 'white' : 'primary.main', 
              color: isOnMobile ? '#4ECDC4' : 'white',
              mr: 1.5,
              cursor: 'pointer',
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              AI{isOnMobile ? '伙伴' : '助手'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                color="secondary"
                label={`Lv.${aiLevel}`}
                sx={{ height: 20, mr: 1 }}
              />
              <Box sx={{ width: 60, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1, height: 4 }}>
                <Box
                  sx={{
                    width: `${aiExperience}%`,
                    bgcolor: 'secondary.main',
                    height: '100%',
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: 'primary.contrastText' }}>
          <AutoAwesomeIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 消息区域 */}
      <Box
        sx={{
          flex: 1,
          bgcolor: 'background.default',
          overflowY: 'auto',
          p: 2,
          ...(isOnMobile ? { p: 1.5, pb: 2 } : {}),
        }}
      >
        {messages.map(renderMessage)}
        <div ref={messageEndRef} />
      </Box>

      {/* 消息输入区域 - 添加语音按钮点击事件 */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          ...(isOnMobile ? { 
            p: '12px 16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          } : {}),
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: isOnMobile ? '24px' : 4,
              bgcolor: isOnMobile ? '#F3F4F6' : 'transparent',
            },
          }}
          disabled={isLoading}
        />
        {isOnMobile ? (
          <>
            <IconButton 
              color="primary" 
              sx={{ 
                ml: 1, 
                bgcolor: '#9370DB', 
                color: 'white',
                '&:hover': {
                  bgcolor: '#8a63d2',
                },
                width: 36,
                height: 36,
              }} 
              onClick={handleVoiceInputClick}
            >
              <MicIcon fontSize="small" />
            </IconButton>
            <IconButton 
              color="primary" 
              sx={{ 
                ml: 1, 
                bgcolor: '#4ECDC4', 
                color: 'white',
                '&:hover': {
                  bgcolor: '#45c1b9',
                },
                width: 36,
                height: 36,
              }} 
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ''}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton color="primary" sx={{ ml: 1 }} onClick={handleVoiceInputClick}>
              <MicIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={isLoading || input.trim() === ''}
              sx={{
                ml: 1,
                borderRadius: 4,
                px: 2,
              }}
            >
              发送
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default EnhancedCompanion; 