import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-white">
      <h1 className="text-4xl font-bold mb-4 text-primary">欢迎使用 OneThing</h1>
      <p className="text-xl mb-8 text-gray-600">你的AI智能目标管理助手，帮你实现更好的自己</p>
      <div className="flex gap-4">
        <button 
          className="btn btn-primary" 
          onClick={onStart}
        >
          开始体验
        </button>
        <button className="btn btn-secondary">观看介绍视频</button>
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
    </div>
  );
};

export default Welcome; 