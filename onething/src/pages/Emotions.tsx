import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';

const Emotions: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  
  // 这里我们会模拟图表，实际项目中可以使用Chart.js或其他图表库
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>情绪趋势</span>
          <div>
            <button 
              className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-secondary'} mr-2`}
              onClick={() => setPeriod('week')}
            >
              周
            </button>
            <button 
              className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-secondary'} mr-2`}
              onClick={() => setPeriod('month')}
            >
              月
            </button>
            <button 
              className={`btn btn-sm ${period === 'year' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriod('year')}
            >
              年
            </button>
          </div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">
            情绪趋势图 - {period === 'week' ? '周视图' : period === 'month' ? '月视图' : '年视图'}
            {/* 在实际项目中，这里会渲染一个图表 */}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">情绪记录</div>
        <div>今天的情绪：😊</div>
        <div className="my-4">近期情绪分布：</div>
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <div className="text-gray-400">
            情绪分布饼图
            {/* 在实际项目中，这里会渲染一个饼图 */}
          </div>
        </div>
        <div className="text-sm text-gray-500">😊 60% 😐 25% 😟 15%</div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>情绪日记</span>
          <button className="btn btn-sm btn-primary">+ 记录今日情绪</button>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>3月18日</span>
            <span>-</span>
            <span>😊 开心</span>
          </div>
          <div className="text-gray-700">
            完成了PMP第3章学习，感觉很有成就感...
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>3月17日</span>
            <span>-</span>
            <span>😐 平静</span>
          </div>
          <div className="text-gray-700">
            今天完成了常规任务，没有特别波动...
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Emotions; 