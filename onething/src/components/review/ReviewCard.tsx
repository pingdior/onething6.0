import React from 'react';
import { ReviewData } from '../../store/reviewStore';
import { useTranslation } from 'react-i18next';

interface ReviewCardProps {
  review: ReviewData;
  onClick: (review: ReviewData) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
  const { t, i18n } = useTranslation();
  
  // 格式化日期范围
  const formatDateRange = () => {
    const startDate = new Date(review.dateRange.start);
    const endDate = new Date(review.dateRange.end);
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    };
    
    return `${startDate.toLocaleDateString(i18n.language, options)} ${t('review.to')} ${endDate.toLocaleDateString(i18n.language, options)}`;
  };
  
  // 根据完成率确定颜色
  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-blue-500';
    if (rate >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // 获取复盘类型文本
  const getReviewTypeText = () => {
    if (review.dateRange.type === 'week') return t('review.weeklyReview');
    if (review.dateRange.type === 'month') return t('review.monthlyReview');
    if (review.dateRange.type === 'day') return t('review.dailyReview');
    return t('review.reviewAnalysis');
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(review)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-3">
            {review.dateRange.type === 'week' ? '📅' : 
             review.dateRange.type === 'month' ? '📆' : 
             review.dateRange.type === 'day' ? '📋' : '📊'}
          </span>
          <div>
            <h3 className="font-medium text-gray-800">
              {getReviewTypeText()}
            </h3>
            <p className="text-sm text-gray-500">{formatDateRange()}</p>
          </div>
        </div>
        
        <div>
          <span className={`text-lg font-bold ${getCompletionRateColor(review.overallProgress.completionRate)}`}>
            {review.overallProgress.completionRate}%
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1 flex justify-between">
          <span>{t('review.completionRate')}</span>
          <span>{review.overallProgress.completedTasks}/{review.overallProgress.totalTasks} {t('tasks.dailyTasks')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              review.overallProgress.completionRate >= 80 ? 'bg-green-500' :
              review.overallProgress.completionRate >= 60 ? 'bg-blue-500' :
              review.overallProgress.completionRate >= 40 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${review.overallProgress.completionRate}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <span>{t('review.clickForDetails')}</span>
        </div>
        
        {/* 新增: 任务分析和SOP建议指示器 */}
        <div className="flex gap-2">
          {review.taskAnalysis && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {t('review.taskAnalysis')}
            </span>
          )}
          {review.sopRecommendations && review.sopRecommendations.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {t('review.sopOptimization')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard; 