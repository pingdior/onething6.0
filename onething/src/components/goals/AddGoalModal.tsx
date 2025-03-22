import React, { useState } from 'react';
import { useGoalStore } from '../../store/goalStore';
import { autoBreakdownGoal } from '../../services/aiService';

interface AddGoalModalProps {
  onClose: () => void;
  onAIHelp?: () => void;
}

const ICONS = ['🎯', '💪', '📚', '💼', '🏠', '🎨', '🌱', '💰', '🧠', '❤️'];

const AddGoalModal: React.FC<AddGoalModalProps> = ({ onClose, onAIHelp }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [deadline, setDeadline] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const addGoal = useGoalStore(state => state.addGoal);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !deadline) return;
    
    // 添加AI自动目标分解功能
    if (e.nativeEvent && (e.nativeEvent as any).submitter?.name === 'ai-breakdown') {
      await handleAIBreakdown();
      return;
    }
    
    addGoal({
      title,
      description,
      priority,
      deadline,
      completionRate: 0,
      icon: selectedIcon,
      subGoals: []
    });
    
    onClose();
  };

  // 新增：AI自动分解目标函数
  const handleAIBreakdown = async () => {
    if (!title) {
      setErrorMessage('请先输入目标名称');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const subGoals = await autoBreakdownGoal(title, description);
      
      const goalId = addGoal({
        title,
        description,
        priority,
        deadline,
        completionRate: 0,
        icon: selectedIcon,
        subGoals
      });

      setIsLoading(false);
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(`自动分解目标失败: ${error.message}`);
    }
  };
  
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">添加新目标</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* 显示错误信息 */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择图标
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded-md ${
                    selectedIcon === icon ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标名称
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="输入目标名称..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="输入目标描述..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                截止日期
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={getMinDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? '处理中...' : '创建目标'}
            </button>
            <button
              type="submit"
              name="ai-breakdown"
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI分解中...
                </>
              ) : (
                'AI自动分解目标'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal; 