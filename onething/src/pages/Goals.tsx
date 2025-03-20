import React from 'react';
import AppLayout from '../components/layout/AppLayout';

const Goals: React.FC = () => {
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>目标管理</span>
          <button className="btn btn-primary btn-sm">+ 开始新目标对话</button>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold">目标分类</div>
            <div className="mt-2 space-y-1">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-filter" defaultChecked className="mr-2" />
                <span>所有目标</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-filter" className="mr-2" />
                <span>进行中</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-filter" className="mr-2" />
                <span>已完成</span>
              </label>
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold">排序方式</div>
            <div className="mt-2 space-y-1">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-sort" defaultChecked className="mr-2" />
                <span>优先级</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-sort" className="mr-2" />
                <span>截止日期</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="goal-sort" className="mr-2" />
                <span>完成度</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-lg font-medium">🎯 项目管理认证 PMP</div>
        <div className="text-sm text-gray-500">优先级：高  截止日期：2024-06-30  完成度：68%</div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden my-2">
          <div 
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full"
            style={{ width: '68%' }}
          ></div>
        </div>
        <div className="text-sm">子目标：4/6 已完成</div>
        <button className="btn btn-sm btn-secondary mt-2">查看详情 ▼</button>
      </div>

      <div className="card">
        <div className="text-lg font-medium">💪 健身计划</div>
        <div className="text-sm text-gray-500">优先级：中  截止日期：2024-12-31  完成度：45%</div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden my-2">
          <div 
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full"
            style={{ width: '45%' }}
          ></div>
        </div>
        <div className="text-sm">子目标：2/5 已完成</div>
        <button className="btn btn-sm btn-secondary mt-2">查看详情 ▼</button>
      </div>
    </AppLayout>
  );
};

export default Goals; 