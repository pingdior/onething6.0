import React from 'react';
import { EmotionRecord, EmotionType } from '../../store/emotionStore';
import { useTranslation } from 'react-i18next';

interface EmotionCardProps {
  record: EmotionRecord;
  onClick: (record: EmotionRecord) => void;
}

const getEmotionEmoji = (type: EmotionType): string => {
  switch(type) {
    case 'happy': return '😊';
    case 'excited': return '😃';
    case 'calm': return '😌';
    case 'sad': return '😔';
    case 'anxious': return '😰';
    case 'angry': return '😡';
    case 'tired': return '😫';
    default: return '😐';
  }
};

const getEmotionColor = (type: EmotionType): string => {
  switch(type) {
    case 'happy': return 'bg-green-100 text-green-800';
    case 'excited': return 'bg-amber-100 text-amber-800';
    case 'calm': return 'bg-blue-100 text-blue-800';
    case 'sad': return 'bg-indigo-100 text-indigo-800';
    case 'anxious': return 'bg-purple-100 text-purple-800';
    case 'angry': return 'bg-red-100 text-red-800';
    case 'tired': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const EmotionCard: React.FC<EmotionCardProps> = ({ record, onClick }) => {
  const { t, i18n } = useTranslation();
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language, { month: 'long', day: 'numeric' });
  };
  
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(record)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getEmotionEmoji(record.emotion)}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${getEmotionColor(record.emotion)}`}>
            {t(`emotions.moodTypes.${record.emotion}`)}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {t('emotions.intensity')}: {record.intensity}/10
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(record.date)}
        </div>
      </div>
      
      <div className="text-gray-700 text-sm">
        {record.note}
      </div>
      
      {record.factors && record.factors.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {record.factors.map((factor: string, index: number) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {factor}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        {record.relatedGoals && record.relatedGoals.length > 0 && (
          <div>{t('emotions.relatedGoals')}: {record.relatedGoals.length}{t('emotions.count')}</div>
        )}
        {record.relatedTasks && record.relatedTasks.length > 0 && (
          <div>{t('emotions.relatedTasks')}: {record.relatedTasks.length}{t('emotions.count')}</div>
        )}
      </div>
    </div>
  );
};

export default EmotionCard; 