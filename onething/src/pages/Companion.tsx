import React from 'react';
import AppLayout from '../components/layout/AppLayout';

const Companion: React.FC = () => {
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">伙伴状态</div>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-tertiary flex items-center justify-center text-white text-4xl mb-4">
            🤖
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold">小助手</div>
            <div className="text-sm text-gray-500">等级：3级 (成长值：65/100)</div>
            <div className="text-sm mt-2">特质：温暖、鼓励型</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">互动记忆</div>
        <div className="text-sm font-semibold">重要时刻：</div>
        <div className="bg-gray-100 rounded-lg p-3 my-2">• 首次设定PMP目标</div>
        <div className="bg-gray-100 rounded-lg p-3 my-2">• 克服学习瓶颈</div>
        <div className="bg-gray-100 rounded-lg p-3 my-2">• 第一次完成周计划</div>
        
        <div className="text-sm font-semibold mt-4">最近话题：</div>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#学习进度</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#情绪管理</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#时间规划</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">互动仪式</div>
        <div className="mb-6">
          <div className="font-medium">☀️ 晨间计划</div>
          <div className="text-sm text-gray-500 my-1">状态：未完成</div>
          <button className="btn btn-sm btn-primary mt-2">开始晨间计划</button>
        </div>
        
        <div>
          <div className="font-medium">🌙 晚间复盘</div>
          <div className="text-sm text-gray-500 my-1">状态：19:30可用</div>
          <button className="btn btn-sm btn-secondary mt-2">设置提醒</button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Companion; 