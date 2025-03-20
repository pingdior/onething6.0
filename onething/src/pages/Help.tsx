import React from 'react';
import AppLayout from '../components/layout/AppLayout';

const Help: React.FC = () => {
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">快速入门</div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          如何设定目标
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          每日任务管理
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          情绪记录指南
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          与AI伙伴交流
        </div>
        
        <button className="btn btn-secondary mt-4">查看所有入门指南</button>
      </div>

      <div className="card">
        <div className="card-title">交互式教程</div>
        
        <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm mb-4">
          <div>
            <div className="font-medium">🎯 目标管理精通</div>
            <div className="text-sm text-gray-500">进度：2/5步</div>
          </div>
          <button className="btn btn-primary">继续学习</button>
        </div>
        
        <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
          <div>
            <div className="font-medium">😊 情绪认知入门</div>
            <div className="text-sm text-gray-500">进度：未开始</div>
          </div>
          <button className="btn btn-secondary">开始教程</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">常见问题</div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          如何更改提醒设置？
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          我的数据安全吗？
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          如何导出我的目标？
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          AI伙伴如何成长？
        </div>
        
        <button className="btn btn-secondary mt-4">查看所有问题</button>
      </div>

      <div className="card">
        <div className="card-title">快捷操作手册</div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">🔍 搜索：</div>
          <input 
            type="text" 
            className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-primary"
            placeholder="搜索快捷操作..."
          />
        </div>
        
        <div>
          <div className="text-sm font-semibold">热门快捷键：</div>
          <div className="mt-2">
            <div className="text-sm mt-1">• N - 新建任务</div>
            <div className="text-sm">• G + D - 转到仪表盘</div>
            <div className="text-sm">• / - 搜索</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help; 