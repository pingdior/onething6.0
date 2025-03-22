import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ServiceStatus from './components/common/ServiceStatus';

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
          <Route path="/companion" element={isLoggedIn ? <Companion /> : <Navigate to="/welcome" />} />
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
