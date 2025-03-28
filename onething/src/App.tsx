import React, { useEffect, useState, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceStatus from './components/common/ServiceStatus';
import { useTranslation } from 'react-i18next';
import { isMobile } from './i18n';

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

// 更新移动端底部导航组件
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // 如果是欢迎页，不显示底部导航
  if (currentPath === '/welcome') return null;
  
  // 中心按钮点击处理函数
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
        label="首页" 
      />
      <NavItem 
        path="/review" 
        current={currentPath} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        } 
        label="复盘" 
      />
      <div className="bottom-nav-center" onClick={handleCenterButtonClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
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

// AI服务错误提示组件接口
interface AIServiceErrorProps {
  onClose: () => void;
}

// AI服务错误提示组件
const AIServiceError: React.FC<AIServiceErrorProps> = ({ onClose }) => {
  return (
    <div className="ai-service-error">
      <div className="ai-service-error-icon">⚠️</div>
      <div>无法连接到AI服务器，请检查您的网络连接或稍后再试。</div>
      <button className="ai-service-error-close" onClick={onClose}>×</button>
    </div>
  );
};

const App: React.FC = () => {
  // 模拟用户登录状态
  const isLoggedIn = true;
  // AI服务错误状态
  const [showAIError, setShowAIError] = useState<boolean>(false);
  
  // 获取翻译函数
  const { i18n } = useTranslation();
  
  // 根据设备类型添加适当的类名
  useEffect(() => {
    // 检测是否为移动设备
    if (isMobile()) {
      document.body.classList.add('mobile-device');
    } else {
      document.body.classList.add('desktop-device');
    }
    
    // 设置文档的语言
    document.documentElement.lang = i18n.language;
    
    // 清理函数
    return () => {
      document.body.classList.remove('mobile-device');
      document.body.classList.remove('desktop-device');
    };
  }, [i18n.language]);
  
  // 监听AI服务状态
  useEffect(() => {
    // 检查是否在移动设备上
    if (isMobile()) {
      // 监听AI服务状态变化
      const checkAIService = async () => {
        try {
          const response = await fetch('/api/health');
          const data = await response.json();
          
          if (data.services?.ai_service === false) {
            setShowAIError(true);
          } else {
            setShowAIError(false);
          }
        } catch (error) {
          console.error('检查AI服务状态失败:', error);
          setShowAIError(true);
        }
      };
      
      // 初始检查
      checkAIService();
      
      // 每30秒检查一次
      const interval = setInterval(checkAIService, 30000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {showAIError && isMobile() && <AIServiceError onClose={() => setShowAIError(false)} />}
        
        <Routes>
          {/* 欢迎页 */}
          <Route path="/welcome" element={<Welcome />} />
          
          {/* 主应用路由 */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/welcome" />} />
          <Route path="/goals" element={isLoggedIn ? <Goals /> : <Navigate to="/welcome" />} />
          <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/welcome" />} />
          <Route path="/emotions" element={isLoggedIn ? <Emotions /> : <Navigate to="/welcome" />} />
          <Route path="/review" element={isLoggedIn ? <Review /> : <Navigate to="/welcome" />} />
          <Route path="/companion" element={isLoggedIn ? <Companion /> : <Navigate to="/welcome" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/welcome" />} />
          <Route path="/help" element={isLoggedIn ? <Help /> : <Navigate to="/welcome" />} />
          
          {/* 默认重定向 */}
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
