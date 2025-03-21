import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 页面导入（后续会创建这些组件）
const Welcome = React.lazy(() => import('./pages/Welcome'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Goals = React.lazy(() => import('./pages/Goals'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Emotions = React.lazy(() => import('./pages/Emotions'));
const Companion = React.lazy(() => import('./pages/Companion'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Help = React.lazy(() => import('./pages/Help'));
const Review = React.lazy(() => import('./pages/Review'));

function App() {
  const [isAppStarted, setIsAppStarted] = useState(false);

  const startApp = () => {
    setIsAppStarted(true);
  };

  if (!isAppStarted) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Welcome onStart={startApp} />
      </React.Suspense>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/emotions" element={<Emotions />} />
            <Route path="/companion" element={<Companion />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
