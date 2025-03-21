import React, { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {initialRecord ? '编辑情绪记录' : '添加情绪记录'}
          </h2>
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
          <label className="block text-gray-700 font-medium mb-2">日期</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">选择情绪</label>
          <div className="grid grid-cols-7 gap-2">
            {emotionOptions.map(option => (
              <div 
                key={option.type}
                className={`cursor-pointer p-3 rounded-lg flex flex-col items-center ${
                  selectedEmotion === option.type 
                    ? 'bg-primary bg-opacity-10 border-2 border-primary' 
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectEmotion(option.type)}
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span className="text-xs">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">情绪强度: {intensity}</label>
            <span className="text-sm text-gray-500">1-10</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>弱</span>
            <span>中等</span>
            <span>强</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">记录内容</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="今天感觉如何？发生了什么？"
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 resize-none"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">影响因素</label>
          <div className="flex flex-wrap gap-2">
            {factorOptions.map(factor => (
              <div 
                key={factor}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm ${
                  selectedFactors.includes(factor)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => toggleFactor(factor)}
              >
                {factor}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">关联目标</label>
          {goals.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {goals.map(goal => (
                <div 
                  key={goal.id}
                  className={`cursor-pointer p-3 rounded-lg flex items-center ${
                    selectedGoalIds.includes(goal.id) 
                      ? 'bg-primary bg-opacity-10 border border-primary' 
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <span className="mr-2">{goal.icon || '🎯'}</span>
                  <span>{goal.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无目标</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">关联任务</label>
          {tasks.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={`cursor-pointer p-3 rounded-lg flex items-center justify-between ${
                    selectedTaskIds.includes(task.id) 
                      ? 'bg-primary bg-opacity-10 border border-primary' 
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleTask(task.id)}
                >
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-500">{task.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无任务</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            onClick={onClose}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
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