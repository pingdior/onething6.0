import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, 
  List, ListItem, Avatar, Chip, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as aiService from '../../services/aiService';
import { getDefaultSystemMessage } from '../../services/aiService';
import { Message, AIResponse } from '../../services/aiService';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGoalStore } from '../../store/goalStore';

// 重命名为ChatMessage以避免冲突
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  suggestions?: string[];
}

// 修复: 定义DragHandle的props类型
interface DragHandleProps {
  sidebarWidth: number;
}

const DragHandle = styled.div<DragHandleProps>`
  position: fixed;
  left: auto;
  right: ${props => `${props.sidebarWidth}px`};
  top: 0;
  bottom: 0;
  width: 10px; // 增加宽度从5px到10px
  background-color: transparent;
  cursor: ew-resize;
  transition: background-color 0.2s;
  z-index: 1201;

  // 高亮拖拽条，使其更明显
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  // 添加拖拽指示器，使用伪元素
  &:after {
    content: "";
    position: absolute;
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    width: 4px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s;
  }
  
  &:hover:after {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChatSidebar: React.FC = () => {
  const { t } = useTranslation();
  // 修改状态类型为ChatMessage
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 添加侧边栏宽度状态和拖拽功能
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isDragging, setIsDragging] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  
  const goalStore = useGoalStore();
  
  // 处理拖拽逻辑
  useEffect(() => {
    const resizeElement = resizeRef.current;
    if (!resizeElement) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      console.log('[ChatSidebar] Started dragging');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // 优化计算逻辑，从窗口右边缘计算到鼠标位置的距离
      // 对于右边的侧边栏，宽度应该是窗口宽度减去鼠标X坐标
      const newWidth = Math.max(250, Math.min(600, window.innerWidth - e.clientX));
      console.log(`[ChatSidebar] Dragging - Mouse X: ${e.clientX}, New width: ${newWidth}`);
      
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        console.log('[ChatSidebar] Stopped dragging');
        setIsDragging(false);
      }
    };

    // 添加触摸事件支持
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        setIsDragging(true);
        console.log('[ChatSidebar] Started touch dragging');
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const newWidth = Math.max(250, Math.min(600, window.innerWidth - touch.clientX));
      console.log(`[ChatSidebar] Touch dragging - Touch X: ${touch.clientX}, New width: ${newWidth}`);
      
      setSidebarWidth(newWidth);
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        console.log('[ChatSidebar] Stopped touch dragging');
        setIsDragging(false);
      }
    };

    resizeElement.addEventListener('mousedown', handleMouseDown);
    resizeElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      resizeElement.removeEventListener('mousedown', handleMouseDown);
      resizeElement.removeEventListener('touchstart', handleTouchStart);
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging]);
  
  useEffect(() => {
    // 初始欢迎消息
    if (messages.length === 0) {
      setIsLoading(true);
      aiService.getAIResponse('').then((response: AIResponse) => {
        setMessages([
          {
            id: '1',
            text: response.text, // AI回复通常不需要翻译，除非API支持返回多语言
            sender: 'ai',
            suggestions: response.suggestions // AI建议通常不需要翻译
          }
        ]);
        setIsLoading(false);
      }).catch((error: any) => { // 添加类型注解
        console.error("获取初始消息失败:", error);
        setMessages([{
          id: '1',
          text: t('companion.initialError'),
          sender: 'ai'
        }]);
        setIsLoading(false);
      });
    }
  }, [messages.length, t]);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // 用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      suggestions: []
    };
    
    // 添加用户消息到聊天记录
    setMessages([...messages, userMessage]);
    setInput('');
    
    try {
      // 添加"思考中"消息
      const thinkingId = 'thinking-' + Date.now().toString();
      setMessages(prev => [...prev, {
        id: thinkingId,
        text: '思考中...',
        sender: 'ai',
        suggestions: []
      }]);
      
      // 准备调用AI服务
      const apiMessages = [
        aiService.getDefaultSystemMessage(),
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text
        })),
        {
          role: 'user' as const,
          content: input
        }
      ];
      
      // 发送消息到AI服务
      const responseText = await aiService.sendMessageToAI(apiMessages);
      
      // 删除"思考中"消息
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      
      // AI回复
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText.text, // 修改这里，使用AIResponse的text属性
        sender: 'ai',
        suggestions: responseText.suggestions || [] // 修改这里，使用AIResponse的suggestions属性
      };
      
      // 添加AI回复到聊天记录
      setMessages(prev => [...prev, aiMessage]);
      
      // 修改目标检测部分
      if (responseText.text.includes("已成功添加到您的目标列表") || 
          responseText.text.includes("已为你设定新目标") ||
          responseText.text.includes("已创建新目标") ||
          responseText.text.includes("添加到目标列表") ||
          /已(为你)?(成功)?(添加|创建|设定|设置)(了)?(新的|一个)?目标/.test(responseText.text)) {
        
        // 从AI回复中提取目标信息
        const goalInfo = extractGoalFromAIResponse(responseText.text);
        
        // 方法1: 触发目标创建事件
        console.log("[ChatSidebar] 触发目标创建事件:", goalInfo);
        try {
          window.dispatchEvent(new CustomEvent('onething-add-goal', { 
            detail: goalInfo,
            bubbles: true,
            cancelable: true
          }));
          console.log("[ChatSidebar] 事件已触发");
        } catch (error) {
          console.error("[ChatSidebar] 触发事件失败:", error);
        }
        
        // 方法2: 直接使用store添加目标
        try {
          console.log("[ChatSidebar] 直接使用goalStore添加目标:", goalInfo);
          const goalId = goalStore.addGoal(goalInfo);
          console.log("[ChatSidebar] 直接添加目标成功，ID:", goalId);
        } catch (error) {
          console.error("[ChatSidebar] 直接添加目标失败:", error);
        }
      }
      
    } catch (error) {
      console.error('发送消息失败:', error);
      // 显示错误消息
      setMessages(prev => {
        // 移除思考中消息（如果有）
        const filtered = prev.filter(msg => !msg.id.startsWith('thinking-'));
        return [...filtered, {
          id: 'error-' + Date.now().toString(),
          text: `很抱歉，我无法回复: ${error instanceof Error ? error.message : '未知错误'}`,
          sender: 'ai',
          suggestions: []
        }];
      });
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  
  useEffect(() => {
    // 添加事件监听器处理目标添加事件
    const handleAddGoal = (event: CustomEvent) => {
      const newGoal = event.detail;
      if (newGoal) {
        goalStore.addGoal(newGoal);
        console.log("[ChatSidebar] Goal added from event:", newGoal);
      }
    };

    // 添加事件监听器，使用与 aiService.ts 中相同的事件名称
    window.addEventListener('onething-add-goal', handleAddGoal as EventListener);

    // 清理函数
    return () => {
      window.removeEventListener('onething-add-goal', handleAddGoal as EventListener);
    };
  }, [goalStore]); // 依赖于goalStore
  
  return (
    <>
      {/* 修复拖拽调整器，使用DragHandle组件 */}
      <DragHandle 
        ref={resizeRef}
        sidebarWidth={sidebarWidth}
        style={{
          backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.2)' : 'transparent',
        }}
      />
      <Paper 
        elevation={0} 
        sx={{ 
          width: `${sidebarWidth}px`, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          borderLeft: '1px solid #eaeaea',
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 1200,
          transition: isDragging ? 'none' : 'width 0.3s ease'
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #eaeaea', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>🤖</Avatar>
          <Typography variant="subtitle1">{t('nav.companion')}</Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map(message => (
              <ListItem 
                key={message.id}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  p: 1
                }}
              >
                <Box 
                  sx={{ 
                    maxWidth: '80%', 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    // 增强Markdown显示样式
                    '& pre': { 
                      bgcolor: 'rgba(0,0,0,0.05)', 
                      p: 1, 
                      borderRadius: 1, 
                      overflowX: 'auto',
                      fontFamily: 'monospace'
                    },
                    '& code': { 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      bgcolor: 'rgba(0,0,0,0.05)',
                      p: '2px',
                      borderRadius: '3px'
                    },
                    '& ul, & ol': { pl: 2.5, mb: 1 },
                    '& li': { mb: 0.5 },
                    '& p': { my: 0.5 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { my: 1 },
                    '& h1': { fontSize: '1.5rem' },
                    '& h2': { fontSize: '1.3rem' },
                    '& h3': { fontSize: '1.1rem' },
                    '& a': { color: 'primary.main' },
                    '& blockquote': { 
                      borderLeft: '3px solid #ccc', 
                      pl: 1, 
                      ml: 1, 
                      color: 'text.secondary' 
                    },
                    '& table': {
                      borderCollapse: 'collapse',
                      width: '100%',
                      my: 1
                    },
                    '& th, & td': {
                      border: '1px solid #ddd',
                      p: 0.5,
                      textAlign: 'left'
                    }
                  }}
                >
                  {message.sender === 'ai' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    <Typography variant="body2">{message.text}</Typography>
                  )}
                </Box>
                
                {message.suggestions && message.suggestions.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {message.suggestions.map(suggestion => (
                      <Chip 
                        key={suggestion}
                        label={suggestion} 
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                )}
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="body2">{t('companion.thinking')}</Typography>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        
        <Box sx={{ p: 2, borderTop: '1px solid #eaeaea', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('companion.inputPlaceholder')}
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton color="primary" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

/**
 * 从AI回复中提取目标信息
 * @param text AI回复的文本内容
 * @returns 提取出的目标对象
 */
function extractGoalFromAIResponse(text: string) {
  console.log("[ChatSidebar] 开始从回复中提取目标信息:", text);
  
  // 1. 尝试多种方式提取标题
  let title = "新目标";
  // 尝试匹配各种引号和标记中的内容
  const titlePatterns = [
    /["""**【《]([^"""**】》]+)["""**】》]/,   // 匹配各种引号和标记
    /[:：][\s]*[""]([^""]+)[""]/,            // 匹配冒号后引号中的内容
    /[:：][\s]*(.+?)(?=\n|$)/,               // 匹配冒号后到行尾的内容
    /目标[:：][\s]*(.+?)(?=\n|$)/,           // 匹配"目标:"后的内容
    /设定新目标[到至]列表[:：]?\s*(.+?)(?=\n|。|$)/, // 特定模式
    /每天(.+?)(?=\n|。|$)/                   // 提取"每天..."这种常见目标模式
  ];
  
  // 尝试所有模式，直到找到匹配
  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      title = match[1].trim();
      console.log("[ChatSidebar] 找到目标标题:", title, "使用模式:", pattern);
      break;
    }
  }
  
  // 2. 提取优先级
  let priority: "high" | "medium" | "low" = "medium";
  const priorityMatch = text.match(/优先级[：:]?\s*(高|中|低)/i);
  if (priorityMatch && priorityMatch[1]) {
    if (priorityMatch[1] === "高") priority = "high";
    else if (priorityMatch[1] === "低") priority = "low";
    console.log("[ChatSidebar] 找到优先级:", priority);
  }
  
  // 3. 提取截止日期
  let deadline = getDefaultDeadline();
  const deadlineMatch = text.match(/截止(日期|时间)[：:]?\s*(\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}|\d{1,2}月\d{1,2}日)/i);
  if (deadlineMatch && deadlineMatch[2]) {
    deadline = deadlineMatch[2];
    console.log("[ChatSidebar] 找到截止日期:", deadline);
  }
  
  // 4. 自动选择图标
  let icon = "🎯"; // 默认图标
  const lowerTitle = title.toLowerCase();
  if (/锻炼|健身|运动|跑步|健康|瑜伽/.test(lowerTitle)) {
    icon = "💪";
  } else if (/学习|课程|教育|阅读|书/.test(lowerTitle)) {
    icon = "📚";
  } else if (/工作|项目|任务|编程|开发/.test(lowerTitle)) {
    icon = "💻";
  } else if (/饮食|营养|减肥|减重/.test(lowerTitle)) {
    icon = "🥗";
  }
  
  // 创建目标对象
  const goalInfo = {
    title,
    description: text,
    priority,
    deadline,
    completionRate: 0,
    icon
  };
  
  console.log("[ChatSidebar] 最终提取的目标对象:", goalInfo);
  return goalInfo;
}

/**
 * 获取默认的截止日期（当前日期之后的30天）
 * @returns 格式化的日期字符串
 */
function getDefaultDeadline(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30); // 设置为30天后
  return date.toISOString().split('T')[0]; // 返回YYYY-MM-DD格式
}

export default ChatSidebar; 