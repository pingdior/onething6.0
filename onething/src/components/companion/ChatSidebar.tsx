import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, 
  List, ListItem, Avatar, Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getAIResponse } from '../../services/aiService';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  suggestions?: string[];
}

const ChatSidebar: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 初始欢迎消息
    if (messages.length === 0) {
      setIsLoading(true);
      getAIResponse('').then(response => {
        setMessages([
          {
            id: '1',
            text: response.text, // AI回复通常不需要翻译，除非API支持返回多语言
            sender: 'ai',
            suggestions: response.suggestions // AI建议通常不需要翻译
          }
        ]);
        setIsLoading(false);
      });
    }
  }, [messages.length]);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // 获取AI响应
    try {
      const response = await getAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text, // AI回复通常不需要翻译
        sender: 'ai',
        suggestions: response.suggestions // AI建议通常不需要翻译
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('获取AI响应失败', error);
      // 添加错误消息
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: t('companion.errorResponse'),
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 320, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        borderLeft: '1px solid #eaeaea'
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
                  color: message.sender === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body2">{message.text}</Typography>
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatSidebar; 