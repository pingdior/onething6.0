import React, { useEffect, useState, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceStatus from './components/common/ServiceStatus';
import { useTranslation } from 'react-i18next';
import { isMobile } from './i18n';
import { Fab } from '@mui/material'; // 导入 Fab 组件
import MicIcon from '@mui/icons-material/Mic'; // 导入麦克风图标

// 导入 i18n 配置
import './i18n';

// 导入样式
import './styles/mobile.css'; // 导入移动端样式

// 导入页面
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Tasks from './pages/Tasks';
import Emotions from './pages/Emotions';
import Review from './pages/Review';
import Companion from './pages/Companion';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Welcome from './pages/Welcome';
// 新增页面导入
import CompanionStatus from './pages/CompanionStatus';
import VoiceInput from './pages/VoiceInput';
import GoalDetail from './pages/GoalDetail';

// 导入切好的图标
import ReviewIcon from './assets/icons/review-icon.svg';
import ChatIcon from './assets/icons/chat-icon.svg';

// 更新移动端底部导航组件
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // 如果是欢迎页，不显示底部导航
  if (currentPath === '/welcome') return null;
  
  // 中心按钮点击处理函数 - 导航到聊天页面
  const handleCenterButtonClick = () => {
    navigate('/companion');
  };
  
  return (
    <div className="bottom-nav">
      <NavItem 
        path="/dashboard" 
        current={currentPath} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        } 
        label="今日" 
      />
      <NavItem 
        path="/review" 
        current={currentPath} 
        icon={<img src={ReviewIcon} alt="复盘" width="24" height="24" />} 
        label="复盘" 
      />
      <div className="bottom-nav-center" onClick={handleCenterButtonClick}>
        <Fab 
          color="primary" 
          aria-label="chat" 
          size="medium" // 可以调整大小
          sx={{ 
            boxShadow: 'none', // 移除阴影
            bgcolor: '#4ECDC4' // 使用主色调
          }}
        >
          <MicIcon />
        </Fab>
      </div>
      <NavItem 
        path="/emotions" 
        current={currentPath} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        } 
        label="情绪" 
      />
      <NavItem 
        path="/settings" 
        current={currentPath} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        } 
        label="我的" 
      />
    </div>
  );
};

// 导航项组件接口
interface NavItemProps {
  path: string;
  current: string;
  icon: ReactNode;
  label: string;
}

// 导航项组件
const NavItem: React.FC<NavItemProps> = ({ path, current, icon, label }) => {
  const navigate = useNavigate();
  
  // 使用navigate函数进行跳转，而不是直接用a标签
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };
  
  return (
    <a href={path} onClick={handleClick} className={`bottom-nav-item ${current === path ? 'active' : ''}`}>
      {icon}
      <span className="bottom-nav-text">{label}</span>
    </a>
  );
};

// AIServiceError组件以便在AI服务连接失败时显示更友好的错误
const AIServiceError: React.FC<{onClose: () => void}> = ({ onClose }) => {
  return (
    <div className="ai-service-error">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="ai-service-error-icon">⚠️</span>
        <span>无法连接到AI服务器，请检查您的网络连接或稍后再试。</span>
      </div>
      <button className="ai-service-error-close" onClick={onClose}>×</button>
    </div>
  );
};

const App: React.FC = () => {
  // 模拟用户登录状态
  const isLoggedIn = true;
  // AI服务错误状态
  const [showAIError, setShowAIError] = useState<boolean>(false);
  // 添加连续失败计数
  const [failureCount, setFailureCount] = useState<number>(0);
  
  // 获取翻译函数
  const { i18n } = useTranslation();
  
  // 根据设备类型添加适当的类名
  useEffect(() => {
    // 检测是否为移动设备
    if (isMobile()) {
      document.body.classList.add('mobile-device');
      document.documentElement.classList.add('mobile-device');
    } else {
      document.body.classList.add('desktop-device');
      document.documentElement.classList.add('desktop-device');
    }
    
    // 设置文档的语言
    document.documentElement.lang = i18n.language;
    
    // 清理函数
    return () => {
      document.body.classList.remove('mobile-device');
      document.body.classList.remove('desktop-device');
      document.documentElement.classList.remove('mobile-device');
      document.documentElement.classList.remove('desktop-device');
    };
  }, [i18n.language]);
  
  // 监听AI服务状态
  useEffect(() => {
    // 检查AI服务状态，增加重试机制
    const checkAIService = async () => {
      try {
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/health', {
          signal: controller.signal,
          cache: 'no-store' // 不使用缓存
        });
        
        clearTimeout(timeoutId);
        const data = await response.json();
        
        if (data.services?.ai_service === false) {
          // 连续失败次数+1
          setFailureCount(prev => prev + 1);
          
          // 只有连续失败3次以上才显示错误
          if (failureCount >= 2) {
            setShowAIError(true);
          }
        } else {
          // 重置失败计数
          setFailureCount(0);
          setShowAIError(false);
        }
      } catch (error) {
        console.error('检查AI服务状态失败:', error);
        
        // 连续失败次数+1
        setFailureCount(prev => prev + 1);
        
        // 只有连续失败3次以上才显示错误
        if (failureCount >= 2) {
          setShowAIError(true);
        }

        // 尝试备用检查方法
        try {
          // 用纯GET请求重试
          const backupResponse = await fetch('/api/test-ai', { 
            method: 'GET',
            cache: 'no-store'
          });
          
          if (backupResponse.ok) {
            // 如果备用检查成功，重置失败计数并隐藏错误
            setFailureCount(0);
            setShowAIError(false);
          }
        } catch (backupError) {
          console.error('备用检查也失败:', backupError);
        }
      }
    };
    
    // 初始检查
    checkAIService();
    
    // 每60秒检查一次，延长间隔减少频繁提示
    const interval = setInterval(checkAIService, 60000);
    
    return () => clearInterval(interval);
  }, [failureCount]);
  
  // 处理错误提示关闭
  const handleCloseError = () => {
    setShowAIError(false);
    // 重置失败计数，给用户一次完整的重试机会
    setFailureCount(0);
  };
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* 所有设备都显示AI服务错误提示 */}
        {showAIError && <AIServiceError onClose={handleCloseError} />}
        
        <Routes>
          {/* 欢迎页 */}
          <Route path="/welcome" element={<Welcome />} />
          
          {/* 主应用路由 */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/welcome" />} />
          <Route path="/goals" element={isLoggedIn ? <Goals /> : <Navigate to="/welcome" />} />
          <Route path="/goal-detail/:id" element={isLoggedIn ? <GoalDetail /> : <Navigate to="/welcome" />} />
          <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/welcome" />} />
          <Route path="/emotions" element={isLoggedIn ? <Emotions /> : <Navigate to="/welcome" />} />
          <Route path="/review" element={isLoggedIn ? <Review /> : <Navigate to="/welcome" />} />
          <Route path="/companion" element={isLoggedIn ? <Companion /> : <Navigate to="/welcome" />} />
          <Route path="/companion-status" element={isLoggedIn ? <CompanionStatus /> : <Navigate to="/welcome" />} />
          <Route path="/voice-input" element={isLoggedIn ? <VoiceInput /> : <Navigate to="/welcome" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/welcome" />} />
          <Route path="/help" element={isLoggedIn ? <Help /> : <Navigate to="/welcome" />} />
          
          {/* 默认重定向 - 修改为进入dashboard而不是companion */}
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/welcome"} />} />
        </Routes>
        
        {/* 移动端底部导航 */}
        {isMobile() && <MobileBottomNav />}
      </BrowserRouter>
      
      {/* 服务状态监控组件 */}
      <ServiceStatus />
    </ErrorBoundary>
  );
};

export default App;
