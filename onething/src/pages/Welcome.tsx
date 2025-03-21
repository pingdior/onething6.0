import React, { useState } from 'react';
import OnboardingSteps from '../components/welcome/OnboardingSteps';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };
  
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    onStart();
  };
  
  // 如果展示引导流程
  if (showOnboarding) {
    return <OnboardingSteps onComplete={handleCompleteOnboarding} />;
  }
  
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-white">
      <div className="relative w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl">🚀</span>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-primary">欢迎使用 OneThing</h1>
      <p className="text-xl mb-8 text-gray-600">你的AI智能目标管理助手，帮你实现更好的自己</p>
      <div className="flex gap-4">
        <button 
          className="btn btn-primary" 
          onClick={handleStartOnboarding}
        >
          开始体验
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onStart}
        >
          跳过引导
        </button>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <select 
          className="px-2 py-1 rounded border border-gray-300 bg-white"
          defaultValue="zh"
          onChange={(e) => console.log(e.target.value)}
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="ar">العربية</option>
        </select>
      </div>
      <div className="absolute bottom-4 text-gray-400 text-sm">
        版本 6.0.0 | © 2024 OneThing 团队
      </div>
    </div>
  );
};

export default Welcome; 