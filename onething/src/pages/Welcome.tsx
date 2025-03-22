import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// 关键修改：将onStart设为可选属性
export interface WelcomeProps {
  onStart?: () => void; // 添加问号，使其可选
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    if (onStart) {
      onStart();
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          OneThing
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          你的AI智能目标管理助手
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          帮你实现更好的自己，通过智能目标分解和任务管理
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 300 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleStart}
          >
            开始体验
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
          >
            观看介绍视频
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Welcome;