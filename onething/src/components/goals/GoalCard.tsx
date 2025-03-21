import React from 'react';
import { Goal } from '../../store/goalStore';

interface GoalCardProps {
  goal: Goal;
  onClick: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
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
  
  const remainingDays = calculateRemainingDays(goal.deadline);
  
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(goal)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{goal.icon || '🎯'}</span>
          <h3 className="text-lg font-bold">{goal.title}</h3>
        </div>
        <div className="text-sm text-gray-500">
          优先级：
          <span className={`font-medium ${
            goal.priority === 'high' ? 'text-red-500' : 
            goal.priority === 'medium' ? 'text-yellow-500' : 
            'text-green-500'
          }`}>
            {goal.priority === 'high' ? '高' : goal.priority === 'medium' ? '中' : '低'}
          </span>
        </div>
      </div>
      
      {goal.description && (
        <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
      )}
      
      <div className="text-sm text-gray-500 mb-3">
        截止：{formatDeadline(goal.deadline)}
        <span className={`ml-2 ${remainingDays < 7 ? 'text-red-500' : remainingDays < 30 ? 'text-yellow-500' : 'text-green-500'}`}>
          (剩余{remainingDays}天)
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>完成度：{goal.completionRate}%</span>
          <span>子目标：{goal.subGoals ? goal.subGoals.filter(sg => sg.completed).length : 0}/{goal.subGoals?.length || 0}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${goal.completionRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="text-sm text-primary font-medium cursor-pointer hover:underline text-right">
        [详情 ▼]
      </div>
    </div>
  );
};

export default GoalCard; 