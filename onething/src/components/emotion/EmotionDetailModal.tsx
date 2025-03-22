import React from 'react';
import { EmotionRecord, EmotionType } from '../../store/emotionStore';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

interface EmotionDetailModalProps {
  record: EmotionRecord;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
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

const EmotionDetailModal: React.FC<EmotionDetailModalProps> = ({ record, onClose, onEdit, onDelete }) => {
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
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title flex items-center gap-2">
            <span className="text-2xl">{getEmotionEmoji(record.emotion)}</span>
            <span>{getEmotionName(record.emotion)}</span>
          </div>
          <div className="modal-close" onClick={onClose}>
            &times;
          </div>
        </div>
        <div className="modal-body">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">记录日期</div>
            <div>{formatDate(record.date)}</div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">情绪强度</div>
            <div className="font-bold">{record.intensity}/10</div>
            <div className="progress-bar mt-1">
              <div 
                className="progress-bar-fill"
                style={{ width: `${record.intensity * 10}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">记录内容</div>
            <div className="p-3 bg-gray-50 rounded-lg">{record.note}</div>
          </div>
          
          {record.factors && record.factors.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">影响因素</div>
              <div className="flex flex-wrap gap-2">
                {record.factors.map((factor, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {relatedGoals.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">相关目标</div>
              <div className="space-y-2">
                {relatedGoals.map(goal => (
                  <div key={goal.id} className="p-2 border border-gray-200 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <span>{goal.icon || '🎯'}</span>
                      <span className="font-medium">{goal.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {relatedTasks.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">相关任务</div>
              <div className="space-y-2">
                {relatedTasks.map(task => (
                  <div key={task.id} className="p-2 border border-gray-200 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <div>{task.title}</div>
                      <div className="text-gray-500">{task.completed ? '已完成' : '未完成'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            关闭
          </button>
          <button 
            className="btn btn-primary"
            onClick={onEdit}
          >
            编辑
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onDelete}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetailModal; 