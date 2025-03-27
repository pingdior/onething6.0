import React, { useEffect, useState, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// 创建移动端底部导航组件
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // 如果是欢迎页，不显示底部导航
  if (currentPath === '/welcome') return null;
  
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
        path="/goals" 
        current={currentPath} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        } 
        label="目标" 
      />
      <div className="bottom-nav-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
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
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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
  return (
    <a href={path} className={`bottom-nav-item ${current === path ? 'active' : ''}`}>
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
