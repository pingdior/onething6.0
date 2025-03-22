import React, { useState } from 'react';
import { EmotionType, EmotionRecord } from '../../store/emotionStore';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

interface AddEmotionModalProps {
  onClose: () => void;
  onSave: (record: Omit<EmotionRecord, 'id'>) => void;
  initialRecord?: EmotionRecord;
}

const emotionOptions: Array<{ type: EmotionType; emoji: string; label: string }> = [
  { type: 'happy', emoji: '😊', label: '开心' },
  { type: 'excited', emoji: '🤩', label: '兴奋' },
  { type: 'calm', emoji: '😌', label: '平静' },
  { type: 'sad', emoji: '😔', label: '伤心' },
  { type: 'anxious', emoji: '😰', label: '焦虑' },
  { type: 'angry', emoji: '😠', label: '生气' },
  { type: 'tired', emoji: '😫', label: '疲惫' },
];

const factorOptions = [
  '工作', '学习', '健康', '人际关系', '家庭', '财务', '个人成长'
];

const AddEmotionModal: React.FC<AddEmotionModalProps> = ({ onClose, onSave, initialRecord }) => {
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialRecord?.emotion || 'calm');
  const [intensity, setIntensity] = useState(initialRecord?.intensity || 5);
  const [note, setNote] = useState(initialRecord?.note || '');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(initialRecord?.factors || []);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>(initialRecord?.relatedGoals || []);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(initialRecord?.relatedTasks || []);
  const [date, setDate] = useState(initialRecord?.date || new Date().toISOString().split('T')[0]);
  
  // 切换情绪
  const handleSelectEmotion = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };
  
  // 切换因素
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };
  
  // 切换目标
  const toggleGoal = (goalId: string) => {
    if (selectedGoalIds.includes(goalId)) {
      setSelectedGoalIds(selectedGoalIds.filter(id => id !== goalId));
    } else {
      setSelectedGoalIds([...selectedGoalIds, goalId]);
    }
  };
  
  // 切换任务
  const toggleTask = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };
  
  // 保存情绪记录
  const handleSave = () => {
    const emotionRecord: Omit<EmotionRecord, 'id'> = {
      date,
      emotion: selectedEmotion,
      intensity,
      note,
      factors: selectedFactors,
      relatedGoals: selectedGoalIds.length > 0 ? selectedGoalIds : undefined,
      relatedTasks: selectedTaskIds.length > 0 ? selectedTaskIds : undefined,
    };
    
    onSave(emotionRecord);
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            {initialRecord ? '编辑情绪记录' : '记录今日情绪'}
          </div>
          <div className="modal-close" onClick={onClose}>
            &times;
          </div>
        </div>
        
        <div className="modal-body">
          <div className="mb-4">
            <div className="form-label">你今天感觉如何？</div>
            <div className="emotion-grid">
              {emotionOptions.map(option => (
                <div 
                  key={option.type}
                  className={`emotion-item ${selectedEmotion === option.type ? 'active' : ''}`}
                  onClick={() => handleSelectEmotion(option.type)}
                >
                  <div className="emotion-icon">{option.emoji}</div>
                  <div className="text-sm">{option.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="form-label">情绪强度：</div>
            <div className="flex items-center mb-1">
              <span className="mr-2">弱</span>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2">强</span>
            </div>
            <div className="text-center text-sm text-gray-600">{intensity}/10</div>
          </div>
          
          <div className="mb-4">
            <div className="form-label">关联事件：</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {factorOptions.map(factor => (
                <div 
                  key={factor}
                  className={`px-2 py-1 rounded-full text-sm cursor-pointer ${
                    selectedFactors.includes(factor)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => toggleFactor(factor)}
                >
                  {factor}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="form-label">详细描述：</div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今天发生了什么？你的感受如何？"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none"
              rows={4}
            ></textarea>
          </div>
          
          <div className="mb-4">
            <div className="form-label">日期：</div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          {goals.length > 0 && (
            <div className="mb-4">
              <div className="form-label">关联目标：</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {goals.map(goal => (
                  <div 
                    key={goal.id}
                    className={`p-2 rounded-lg flex items-center cursor-pointer ${
                      selectedGoalIds.includes(goal.id)
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'border border-gray-200'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <span className="mr-2">{goal.icon || '🎯'}</span>
                    <span className="text-sm">{goal.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {tasks.length > 0 && (
            <div className="mb-4">
              <div className="form-label">关联任务：</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`p-2 rounded-lg flex items-center justify-between cursor-pointer ${
                      selectedTaskIds.includes(task.id)
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'border border-gray-200'
                    }`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className="text-sm">{task.title}</span>
                    <span className="text-xs text-gray-500">{task.completed ? '已完成' : '未完成'}</span>
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
            取消
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!selectedEmotion || !note}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmotionModal; 