import React from 'react';
import { Task, useTaskStore } from '../../store/taskStore';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">时间：</span> {task.time}
          </div>
          
          {task.goalName && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">目标：</span> {task.goalName}
            </div>
          )}
          
          {task.priority && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">优先级：</span> 
              {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
            </div>
          )}
          
          {task.description && (
            <div className="mt-4">
              <div className="font-medium mb-2">今日学习内容：</div>
              <ul className="list-disc pl-5">
                <li>{task.description}</li>
                {task.title.includes('PMP') && <li>完成练习题</li>}
              </ul>
            </div>
          )}
          
          <div className="text-sm text-gray-600 mt-4">
            <span className="font-medium">预计完成：</span> 45分钟
          </div>
        </div>
        
        <div className="flex space-x-2 mt-6">
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => {
              // 处理开始任务逻辑
              onClose();
            }}
          >
            开始
          </button>
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            onClick={onClose}
          >
            推迟
          </button>
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded-md ml-auto"
            onClick={() => {
              toggleTaskCompletion(task.id);
              onClose();
            }}
          >
            {task.completed ? '标记未完成' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal; 