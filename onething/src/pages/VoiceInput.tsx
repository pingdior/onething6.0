import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, CircularProgress } from '@mui/material';
import { ArrowBack, Mic, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { isMobile } from '../i18n';

const VoiceInput: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingText, setRecordingText] = useState('');
  const isOnMobile = isMobile();

  // 模拟语音识别效果
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        
        // 随机生成识别文本，模拟实时语音识别效果
        if (recordingTime > 2 && Math.random() > 0.7) {
          const phrases = [
            '我想设定一个新目标',
            '帮我查看今天的任务',
            '我最近感觉有点压力',
            '分析一下我的目标完成情况',
            '帮我做一个周计划',
          ];
          setRecordingText(phrases[Math.floor(Math.random() * phrases.length)]);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, recordingTime]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const toggleRecording = () => {
    if (!isRecording && recordingTime > 0) {
      // 如果有录音内容，先重置
      setRecordingTime(0);
      setRecordingText('');
    }
    setIsRecording(!isRecording);
  };
  
  const handleSubmit = () => {
    // 将语音内容发送回聊天页面
    if (recordingText) {
      // 这里可以实现将文本发回聊天窗口的逻辑
      // 例如，可以通过状态管理或localStorage临时存储
      localStorage.setItem('voiceInputText', recordingText);
    }
    navigate('/companion');
  };
  
  // 格式化录音时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <AppLayout>
      <Box sx={{ 
        height: 'calc(100vh - 120px)',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#F3F4F6',
        ...(isOnMobile ? { 
          p: 0,
          height: 'calc(100vh - 116px)',
        } : {})
      }}>
        {/* 顶部导航栏 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          bgcolor: 'white'
        }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            语音输入
          </Typography>
        </Box>
        
        {/* 主要内容区域 */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          p: 3
        }}>
          {/* 录音时间显示 */}
          <Typography variant="h4" sx={{ mb: 3, color: isRecording ? '#4ECDC4' : 'text.secondary' }}>
            {formatTime(recordingTime)}
          </Typography>
          
          {/* 语音识别文本 */}
          {recordingText && (
            <Paper elevation={0} sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              width: '100%',
              maxWidth: 500,
              textAlign: 'center',
              bgcolor: 'white'
            }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                "{recordingText}"
              </Typography>
            </Paper>
          )}
          
          {/* 录音按钮 */}
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <IconButton 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: isRecording ? '#FF6B6B' : '#4ECDC4',
                color: 'white',
                '&:hover': {
                  bgcolor: isRecording ? '#ff5252' : '#45c1b9'
                }
              }}
              onClick={toggleRecording}
            >
              {isRecording ? (
                <Box sx={{ position: 'relative' }}>
                  <CircularProgress 
                    size={70} 
                    thickness={2} 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      position: 'absolute',
                      top: -35,
                      left: -35
                    }} 
                  />
                  <Mic sx={{ fontSize: 32 }} />
                </Box>
              ) : (
                <Mic sx={{ fontSize: 32 }} />
              )}
            </IconButton>
            
            {recordingText && (
              <IconButton 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: '#4ECDC4',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#45c1b9'
                  }
                }}
                onClick={handleSubmit}
              >
                <CheckCircle sx={{ fontSize: 28 }} />
              </IconButton>
            )}
          </Box>
          
          {/* 提示文本 */}
          <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary', textAlign: 'center' }}>
            {isRecording ? '正在录音，请说话...' : '点击按钮开始录音'}
          </Typography>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default VoiceInput; 