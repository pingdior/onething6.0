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
import { sendMessageToAI, getDefaultSystemMessage } from '../../services/aiService';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

// 消息接口
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  thinking?: boolean;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);

  // 模拟AI特性等级 - 实际应用中可能从用户数据获取
  const aiLevel = 3;
  const aiExperience = 65; // 百分比

  // 初始化AI伴侣消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: '你好，我是你的AI目标管理助手。我能帮你设定目标、分解任务，或者给你提供情绪支持。今天有什么我能帮到你的吗？',
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['设定新目标', '今日任务规划', '复盘上周进展'],
    };
    setMessages([welcomeMessage]);
  }, []);

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

  // 处理消息发送
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
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
      // 构建发送给AI的消息上下文
      const messageHistory = [
        getDefaultSystemMessage(),
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
      const response = await sendMessageToAI(messageHistory);
      
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
    } catch (error) {
      console.error('AI通信错误:', error);
      
      // 移除思考中消息并添加错误消息
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== thinkingId);
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            text: '抱歉，我遇到了一些问题。请稍后再试。',
            sender: 'ai',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 10);
  };

  // 处理输入框回车
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 时间格式化
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
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
      }}
    >
      {/* 伴侣头部 */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5 }}>
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              AI助手
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
          p: 2,
          overflow: 'auto',
          bgcolor: theme.palette.background.default,
        }}
      >
        {messages.map((message) => (
          <Grow
            key={message.id}
            in={true}
            style={{ transformOrigin: message.sender === 'user' ? 'right' : 'left' }}
            timeout={500}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  ...AvatarStyle[message.sender],
                  width: 36,
                  height: 36,
                  mx: 1,
                }}
              >
                {message.sender === 'ai' ? <SmartToyIcon /> : '我'}
              </Avatar>
              <Box sx={{ maxWidth: '75%' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                    color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                    borderColor: message.sender === 'user' ? 'primary.light' : theme.palette.divider,
                  }}
                >
                  {message.thinking ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'inherit' }} />
                      <Typography variant="body2">{message.text}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                  )}
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {formatTime(message.timestamp)}
                </Typography>

                {/* 建议选项 */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Zoom key={index} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Chip
                          label={suggestion}
                          size="small"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.lighter',
                            },
                          }}
                        />
                      </Zoom>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grow>
        ))}
        <div ref={messageEndRef} />
      </Box>

      {/* 输入区域 */}
      <Divider />
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.paper',
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
              borderRadius: 4,
            },
          }}
          disabled={isLoading}
        />
        <IconButton color="primary" sx={{ ml: 1 }}>
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
      </Box>
    </Paper>
  );
};

export default EnhancedCompanion; 