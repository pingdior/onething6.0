import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceStatus from './components/common/ServiceStatus';
import { useTranslation } from 'react-i18next';
import { isMobile } from './i18n';

// 导入 i18n 配置
import './i18n';

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

const App: React.FC = () => {
  // 模拟用户登录状态
  const isLoggedIn = true;
  
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
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* 欢迎页 */}
          <Route path="/welcome" element={<Welcome />} />
          
          {/* 主应用路由 */}
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/welcome" />} />
          <Route path="/goals" element={isLoggedIn ? <Goals /> : <Navigate to="/welcome" />} />
          <Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/welcome" />} />
          <Route path="/emotions" element={isLoggedIn ? <Emotions /> : <Navigate to="/welcome" />} />
          <Route path="/review" element={isLoggedIn ? <Review /> : <Navigate to="/welcome" />} />
          <Route path="/companion" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/welcome" />} />
          <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/welcome" />} />
          <Route path="/help" element={isLoggedIn ? <Help /> : <Navigate to="/welcome" />} />
          
          {/* 默认重定向 */}
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/welcome"} />} />
        </Routes>
      </BrowserRouter>
      {/* 服务状态监控组件 */}
      <ServiceStatus />
    </ErrorBoundary>
  );
};

export default App;
