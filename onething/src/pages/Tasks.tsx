import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';

const Tasks: React.FC = () => {
  const [activeView, setActiveView] = useState<'timeline' | 'kanban'>('timeline');

  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>每日任务</span>
          <div className="flex items-center gap-2">
            <span>2024-03-19</span>
            <button className="btn btn-sm btn-secondary">日历</button>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <div 
            className={`py-3 px-4 cursor-pointer ${activeView === 'timeline' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
            onClick={() => setActiveView('timeline')}
          >
            时间线
          </div>
          <div 
            className={`py-3 px-4 cursor-pointer ${activeView === 'kanban' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
            onClick={() => setActiveView('kanban')}
          >
            看板
          </div>
        </div>
        
        {activeView === 'timeline' ? (
          <div>
            <div className="text-sm font-semibold mb-4">上午</div>
            <div className="task-item">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">9:00-10:30</div>
                <div className="font-medium">PMP章节学习</div>
                <div className="text-xs text-gray-500">🎯来自：PMP认证</div>
              </div>
              <div className="ml-auto">
                <button className="btn btn-sm btn-secondary">拖动调整</button>
              </div>
            </div>
            <div className="task-item">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">11:00-12:00</div>
                <div className="font-medium">团队周会</div>
                <div className="text-xs text-gray-500">📅工作安排</div>
              </div>
            </div>
            
            <div className="text-sm font-semibold my-4">下午</div>
            <div className="task-item">
              <input type="checkbox" className="mr-3" defaultChecked />
              <div className="flex-1">
                <div className="text-sm text-gray-500">13:00-14:00</div>
                <div className="font-medium">回复邮件</div>
              </div>
            </div>
            <div className="task-item">
              <input type="checkbox" className="mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">15:00-16:00</div>
                <div className="font-medium">健身训练</div>
                <div className="text-xs text-gray-500">💪来自：健身计划</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">待办</div>
              
              <div className="bg-white rounded-md p-3 mb-3 shadow-sm cursor-grab">
                <div className="font-medium">PMP章节学习</div>
                <div className="text-xs text-gray-500">9:00-10:30</div>
                <div className="text-xs text-gray-500 mt-1">🎯 PMP认证</div>
              </div>
              
              <div className="bg-white rounded-md p-3 mb-3 shadow-sm cursor-grab">
                <div className="font-medium">团队周会</div>
                <div className="text-xs text-gray-500">11:00-12:00</div>
                <div className="text-xs text-gray-500 mt-1">📅 工作安排</div>
              </div>
              
              <div className="bg-white rounded-md p-3 mb-3 shadow-sm cursor-grab">
                <div className="font-medium">健身训练</div>
                <div className="text-xs text-gray-500">15:00-16:00</div>
                <div className="text-xs text-gray-500 mt-1">💪 健身计划</div>
              </div>
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">进行中</div>
              {/* 可以拖动卡片到此 */}
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">已完成</div>
              <div className="bg-gray-100 rounded-md p-3 mb-3 shadow-sm cursor-grab line-through text-gray-500">
                <div className="font-medium">回复邮件</div>
                <div className="text-xs text-gray-500">13:00-14:00</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks; 