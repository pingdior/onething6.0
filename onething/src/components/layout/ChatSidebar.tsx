import React, { useState, useEffect, useRef } from 'react';
import aiService, { Message as AIMessage } from '../../services/aiService';

// 消息类型定义
interface ChatMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  isError?: boolean; // 添加错误标志
}

const ChatSidebar: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '早上好！今天安排了5个任务，我来帮你规划一下时间。',
      isAI: true,
      timestamp: new Date()
    },
    {
      id: '2',
      text: '最重要的是9:00的项目提案，建议你优先完成它。',
      isAI: true,
      timestamp: new Date()
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiTested, setIsApiTested] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // 保存对话历史记录（用于API请求）
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([
    aiService.getDefaultSystemMessage()
  ]);

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

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;
    
    // 添加用户消息到界面
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isAI: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // 添加用户消息到对话历史
    const userAPIMessage: AIMessage = {
      role: 'user',
      content: inputText
    };
    
    const updatedHistory = [...conversationHistory, userAPIMessage];
    setConversationHistory(updatedHistory);
    
    // 清空输入框并显示加载状态
    setInputText('');
    setIsLoading(true);
    
    try {
      // 调用DeepSeek API
      const aiResponse = await aiService.sendMessageToAI(updatedHistory);
      
      // 添加AI回复到界面
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 添加AI回复到对话历史
      const aiAPIMessage: AIMessage = {
        role: 'assistant',
        content: aiResponse
      };
      
      setConversationHistory([...updatedHistory, aiAPIMessage]);
    } catch (error: any) {
      console.error('AI回复错误:', error);
      
      // 显示详细错误消息
      const errorMessage = error.message || '抱歉，我暂时无法回复。请稍后再试。';
      
      addErrorMessage(errorMessage);
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

  return (
    <div className="flex flex-col h-full">
      {/* 聊天头部 */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--gray-200)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>🤖 AI伴侣</span>
      </div>
      
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
    </div>
  );
};

export default ChatSidebar; 