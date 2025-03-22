import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ServiceCheckResult {
  backend: boolean;
  ai: boolean;
  lastChecked: Date;
}

const ServiceStatus: React.FC = () => {
  const [status, setStatus] = useState<ServiceCheckResult>({
    backend: true,
    ai: true,
    lastChecked: new Date()
  });
  
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  
  // API基础URL
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';
  
  // 检查服务状态
  const checkServices = async () => {
    setChecking(true);
    
    const newStatus: ServiceCheckResult = {
      backend: true,
      ai: true,
      lastChecked: new Date()
    };
    
    try {
      // 检查后端服务
      const healthResponse = await fetch(`${apiBaseUrl}/api/health`);
      if (!healthResponse.ok) {
        throw new Error('后端服务不可用');
      }
      
      const healthData = await healthResponse.json();
      console.log('健康检查响应:', healthData);
      
      // 如果服务器返回了服务状态信息，直接使用
      if (healthData.services) {
        newStatus.backend = true; // 既然能获取响应，后端肯定是在线的
        newStatus.ai = healthData.services.ai_service === true;
        
        // 如果服务器已经知道AI服务状态，就不需要再单独测试了
        if (healthData.services.ai_service !== null) {
          setStatus(newStatus);
          setChecking(false);
          
          // 如果AI服务不可用，显示提示
          if (!newStatus.ai) {
            setOpen(true);
          }
          return;
        }
      }
    } catch (error) {
      console.error('后端服务检查失败:', error);
      newStatus.backend = false;
      newStatus.ai = false; // 如果后端不可用，AI服务也不可用
      
      setStatus(newStatus);
      setChecking(false);
      setOpen(true);
      return;
    }
    
    // 只有在后端正常且服务器不知道AI状态时，才测试AI服务
    if (newStatus.backend) {
      try {
        // 使用专门的AI测试端点
        const aiTestResponse = await fetch(`${apiBaseUrl}/api/test-ai`);
        const aiTestResult = await aiTestResponse.json();
        
        newStatus.ai = aiTestResult.success === true;
      } catch (error) {
        console.error('AI服务检查失败:', error);
        newStatus.ai = false;
      }
    }
    
    setStatus(newStatus);
    setChecking(false);
    
    // 如果任一服务不可用，显示提示
    if (!newStatus.backend || !newStatus.ai) {
      setOpen(true);
    }
  };
  
  // 组件加载时和每5分钟检查一次服务状态
  useEffect(() => {
    checkServices();
    
    const interval = setInterval(() => {
      checkServices();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  const handleRefresh = () => {
    checkServices();
  };
  
  // 始终渲染组件，但只在服务异常时显示
  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        severity="error" 
        variant="filled"
        action={
          <>
            <IconButton
              size="small"
              color="inherit"
              disabled={checking}
              onClick={handleRefresh}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        无法连接到AI服务器，请检查您的网络连接或稍后再试。
      </Alert>
    </Snackbar>
  );
};

export default ServiceStatus; 