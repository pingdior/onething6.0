import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import GoalCard from '../components/goals/GoalCard';
import GoalDetailModal from '../components/goals/GoalDetailModal';
import AddGoalModal from '../components/goals/AddGoalModal';
import { Goal, useGoalStore } from '../store/goalStore';

type GoalFilter = 'all' | 'inProgress' | 'completed';
type GoalSort = 'priority' | 'deadline' | 'completion';

const Goals: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [sort, setSort] = useState<GoalSort>('priority');
  
  const goals = useGoalStore(state => state.goals);
  
  // 过滤目标
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'completed') return goal.completionRate === 100;
    if (filter === 'inProgress') return goal.completionRate < 100;
    return true;
  });
  
  // 排序目标
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sort === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    if (sort === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sort === 'completion') {
      return b.completionRate - a.completionRate;
    }
    return 0;
  });
  
  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
  };
  
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };
  
  const handleAIHelp = () => {
    // 后续实现AI辅助创建目标
    console.log('AI帮助创建目标');
  };
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>目标管理</span>
          <div className="flex gap-2">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleAIHelp}
            >
              💬 开始新目标对话
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleOpenAddModal}
            >
              + 新建目标
            </button>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold">目标分类</div>
            <div className="mt-2 space-y-1">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-filter" 
                  checked={filter === 'all'} 
                  onChange={() => setFilter('all')} 
                  className="mr-2" 
                />
                <span>所有目标</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-filter" 
                  checked={filter === 'inProgress'} 
                  onChange={() => setFilter('inProgress')} 
                  className="mr-2" 
                />
                <span>进行中</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-filter" 
                  checked={filter === 'completed'} 
                  onChange={() => setFilter('completed')} 
                  className="mr-2" 
                />
                <span>已完成</span>
              </label>
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm font-semibold">排序方式</div>
            <div className="mt-2 space-y-1">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-sort" 
                  checked={sort === 'priority'} 
                  onChange={() => setSort('priority')} 
                  className="mr-2" 
                />
                <span>优先级</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-sort" 
                  checked={sort === 'deadline'} 
                  onChange={() => setSort('deadline')} 
                  className="mr-2" 
                />
                <span>截止日期</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="goal-sort" 
                  checked={sort === 'completion'} 
                  onChange={() => setSort('completion')} 
                  className="mr-2" 
                />
                <span>完成度</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          {sortedGoals.length > 0 ? (
            sortedGoals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onClick={handleGoalClick} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">还没有设定目标</p>
              <button 
                className="btn btn-primary"
                onClick={handleOpenAddModal}
              >
                + 添加第一个目标
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 目标详情弹窗 */}
      {selectedGoal && (
        <GoalDetailModal 
          goal={selectedGoal} 
          onClose={() => setSelectedGoal(null)} 
        />
      )}
      
      {/* 添加目标弹窗 */}
      {showAddModal && (
        <AddGoalModal 
          onClose={() => setShowAddModal(false)} 
          onAIHelp={handleAIHelp}
        />
      )}
    </AppLayout>
  );
};

export default Goals; 