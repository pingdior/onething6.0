import React, { useState } from 'react';
import { Goal, useGoalStore } from '../../store/goalStore';

interface GoalDetailModalProps {
  goal: Goal;
  onClose: () => void;
}

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose }) => {
  const [newSubGoal, setNewSubGoal] = useState('');
  const toggleSubGoalCompletion = useGoalStore(state => state.toggleSubGoalCompletion);
  const addSubGoal = useGoalStore(state => state.addSubGoal);
  
  // 格式化截止日期
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };
  
  // 计算剩余天数
  const calculateRemainingDays = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateString);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const handleAddSubGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubGoal.trim() === '') return;
    
    addSubGoal(goal.id, {
      title: newSubGoal.trim(),
      completed: false
    });
    
    setNewSubGoal('');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{goal.icon || '🎯'}</span>
            <h2 className="text-2xl font-bold">{goal.title}</h2>
          </div>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          {goal.description && (
            <p className="text-gray-700 mb-4">{goal.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-sm text-gray-500">优先级</div>
              <div className={`font-medium ${
                goal.priority === 'high' ? 'text-red-500' : 
                goal.priority === 'medium' ? 'text-yellow-500' : 
                'text-green-500'
              }`}>
                {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-sm text-gray-500">截止日期</div>
              <div className="font-medium">
                {formatDeadline(goal.deadline)}
                <span className={`ml-2 text-sm ${
                  calculateRemainingDays(goal.deadline) < 7 ? 'text-red-500' : 
                  calculateRemainingDays(goal.deadline) < 30 ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  (剩余{calculateRemainingDays(goal.deadline)}天)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">完成度：{goal.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full" 
                style={{ width: `${goal.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">子目标（{goal.subGoals?.filter(sg => sg.completed).length || 0}/{goal.subGoals?.length || 0}）</h3>
          
          <ul className="space-y-2 mb-4">
            {goal.subGoals?.map(subGoal => (
              <li key={subGoal.id} className="flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-3 h-5 w-5"
                  checked={subGoal.completed}
                  onChange={() => toggleSubGoalCompletion(goal.id, subGoal.id)}
                />
                <span className={`flex-1 ${subGoal.completed ? 'line-through text-gray-400' : ''}`}>
                  {subGoal.title}
                </span>
              </li>
            ))}
          </ul>
          
          <form onSubmit={handleAddSubGoal} className="flex items-center">
            <input 
              type="text"
              value={newSubGoal}
              onChange={(e) => setNewSubGoal(e.target.value)}
              placeholder="添加新的子目标..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              添加
            </button>
          </form>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            onClick={onClose}
          >
            关闭
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onClose}
          >
            编辑目标
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailModal; 