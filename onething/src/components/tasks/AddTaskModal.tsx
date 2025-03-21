import React, { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';

interface AddTaskModalProps {
  onClose: () => void;
  onAIPlan?: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAIPlan }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const addTask = useTaskStore(state => state.addTask);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime) {
      console.error('任务信息不完整，无法添加任务');
      return;
    }
    
    const timeString = `${startTime}-${endTime}`;
    
    // 添加调试日志
    console.log('正在添加任务:', {
      title,
      time: timeString,
      timeRange: { start: startTime, end: endTime }
    });
    
    // 调用addTask函数添加任务
    try {
      addTask({
        title,
        time: timeString,
        completed: false,
        timeRange: {
          start: startTime,
          end: endTime
        }
      });
      console.log('任务添加成功');
      onClose();
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">添加临时任务</h3>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务内容：
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="输入任务内容..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时间：
            </label>
            <div className="flex space-x-2 items-center">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
              <span>至</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              添加
            </button>
            <button
              type="button"
              onClick={onAIPlan}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              让AI帮我规划
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal; 