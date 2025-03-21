import React from 'react';
import { EmotionRecord, EmotionType } from '../../store/emotionStore';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

interface EmotionDetailModalProps {
  record: EmotionRecord;
  onClose: () => void;
  onEdit: () => void;
}

const getEmotionEmoji = (type: EmotionType): string => {
  switch (type) {
    case 'happy': return '😊';
    case 'excited': return '🤩';
    case 'calm': return '😌';
    case 'sad': return '😔';
    case 'anxious': return '😰';
    case 'angry': return '😠';
    case 'tired': return '😫';
    default: return '😐';
  }
};

const getEmotionName = (type: EmotionType): string => {
  switch (type) {
    case 'happy': return '开心';
    case 'excited': return '兴奋';
    case 'calm': return '平静';
    case 'sad': return '伤心';
    case 'anxious': return '焦虑';
    case 'angry': return '生气';
    case 'tired': return '疲惫';
    default: return '其他';
  }
};

const getEmotionColor = (type: EmotionType): string => {
  switch (type) {
    case 'happy': return 'bg-yellow-500';
    case 'excited': return 'bg-pink-500';
    case 'calm': return 'bg-blue-500';
    case 'sad': return 'bg-indigo-500';
    case 'anxious': return 'bg-purple-500';
    case 'angry': return 'bg-red-500';
    case 'tired': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

const EmotionDetailModal: React.FC<EmotionDetailModalProps> = ({ record, onClose, onEdit }) => {
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  // 获取关联的目标和任务
  const relatedGoals = record.relatedGoals 
    ? goals.filter(goal => record.relatedGoals?.includes(goal.id))
    : [];
    
  const relatedTasks = record.relatedTasks
    ? tasks.filter(task => record.relatedTasks?.includes(task.id))
    : [];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${getEmotionColor(record.emotion)} text-white flex items-center justify-center text-2xl`}>
              {getEmotionEmoji(record.emotion)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{getEmotionName(record.emotion)}</h2>
              <p className="text-gray-500">{formatDate(record.date)}</p>
            </div>
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">情绪强度</h3>
            <span className="text-lg font-semibold">{record.intensity}/10</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getEmotionColor(record.emotion)}`}
              style={{ width: `${record.intensity * 10}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">记录内容</h3>
          <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
            {record.note}
          </div>
        </div>
        
        {record.factors && record.factors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">影响因素</h3>
            <div className="flex flex-wrap gap-2">
              {record.factors.map((factor, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {relatedGoals.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">相关目标</h3>
            <div className="space-y-2">
              {relatedGoals.map(goal => (
                <div key={goal.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{goal.icon || '🎯'}</span>
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    完成度: {goal.completionRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {relatedTasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">相关任务</h3>
            <div className="space-y-2">
              {relatedTasks.map(task => (
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.time}</div>
                  </div>
                  <div className="mt-1 flex items-center text-sm">
                    <span className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                    <span>{task.completed ? '已完成' : '未完成'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            onClick={onClose}
          >
            关闭
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onEdit}
          >
            编辑记录
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetailModal; 