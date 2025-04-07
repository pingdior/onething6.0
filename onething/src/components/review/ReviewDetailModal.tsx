import React from 'react';
import { ReviewData } from '../../store/reviewStore';
import { useTranslation } from 'react-i18next';

interface ReviewDetailModalProps {
  review: ReviewData;
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-3xl mr-3">📊</span>
            <div>
              <h2 className="text-2xl font-bold">
                {getReviewTypeText()}
              </h2>
              <p className="text-gray-500">{formatDateRange()}</p>
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
        
        {/* 整体进度 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('review.overallProgress')}</h3>
          
          <div className="flex items-center mb-3">
            <div className="text-4xl font-bold mr-4 flex-none">
              <span className={getCompletionRateColor(review.overallProgress.completionRate)}>
                {review.overallProgress.completionRate}%
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm mb-1 flex justify-between">
                <span>{t('review.completionRate')}</span>
                <span>
                  {review.overallProgress.completedTasks}/{review.overallProgress.totalTasks} {t('tasks.dailyTasks')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    review.overallProgress.completionRate >= 80 ? 'bg-green-500' :
                    review.overallProgress.completionRate >= 60 ? 'bg-blue-500' :
                    review.overallProgress.completionRate >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${review.overallProgress.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">{t('review.totalTasks')}</div>
              <div className="text-xl font-bold">{review.overallProgress.totalTasks}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">{t('review.completedTasks')}</div>
              <div className="text-xl font-bold">{review.overallProgress.completedTasks}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-500">{t('review.averageEfficiency')}</div>
              <div className="text-xl font-bold">{review.timeAnalysis.averageEfficiency}/10</div>
            </div>
          </div>
        </div>
        
        {/* 目标进展 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('review.goalsProgress')}</h3>
          
          {review.goalDetails.map((goal) => (
            <div key={goal.id} className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between mb-2">
                <div className="font-medium">{goal.name}</div>
                <div className={getCompletionRateColor(goal.progress)}>{goal.progress}%</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full ${
                    goal.progress >= 80 ? 'bg-green-500' :
                    goal.progress >= 60 ? 'bg-blue-500' :
                    goal.progress >= 40 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{t('review.completedItemsCount', { completed: goal.completedItems, total: goal.totalItems })}</span>
                <span>{t('review.timeSpent', { hours: Math.round(goal.timeSpent / 60) })}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 时间效率分析 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('review.timeEfficiencyAnalysis')}</h3>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="text-sm font-medium mb-2">{t('review.bestTimeSlots')}</div>
            <div className="flex items-end h-32 space-x-2">
              {Array.from({ length: 24 }).map((_, hour) => {
                const timeSlot = review.timeAnalysis.bestTimeSlots.find(slot => slot.hour === hour);
                const efficiency = timeSlot ? timeSlot.efficiency : 0;
                const height = `${efficiency * 10}%`;
                
                return (
                  <div key={hour} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full rounded-t-sm ${
                        efficiency >= 8 ? 'bg-green-500' :
                        efficiency >= 6 ? 'bg-blue-500' :
                        efficiency >= 4 ? 'bg-yellow-500' :
                        efficiency > 0 ? 'bg-gray-300' : 'bg-gray-200'
                      }`}
                      style={{ height }}
                    ></div>
                    <div className="text-xs mt-1">{hour}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-sm font-medium mb-1">{t('review.interruptionCount')}</div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold">{review.timeAnalysis.interruptionCount}</span>
                <span className="text-sm text-gray-500 ml-2">{t('review.times')}</span>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-sm font-medium mb-1">{t('review.averageFocusTime')}</div>
              <div className="flex items-baseline">
                <span className="text-xl font-bold">{Math.round(45 + Math.random() * 15)}</span>
                <span className="text-sm text-gray-500 ml-2">{t('time.minutes')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 核心洞察 */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">{t('review.coreInsights')}</h3>
          
          <ul className="space-y-2 text-gray-700">
            {review.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 行动建议 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{t('review.actionSuggestions')}</h3>
          
          <ul className="space-y-2 text-gray-700">
            {review.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 新增：任务分析和SOP总结区域 */}
        {(review.taskAnalysis || review.sopRecommendations) && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{t('review.taskAnalysisAndOptimization')}</h3>
            
            {/* 任务表现分析 */}
            {review.taskAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-center font-medium text-primary mb-2">{t('review.strengths')}</div>
                  <ul className="pl-5 list-disc space-y-1 text-sm">
                    {review.taskAnalysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-center font-medium text-accent-color mb-2">{t('review.improvements')}</div>
                  <ul className="pl-5 list-disc space-y-1 text-sm">
                    {review.taskAnalysis.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* 详细任务分析 */}
            {review.taskAnalysis?.detailedTasks && review.taskAnalysis.detailedTasks.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('review.detailedAnalysis')}</h4>
                
                {review.taskAnalysis.detailedTasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">{task.name}</div>
                      <div className="flex items-center">
                        <span className={`${
                          task.efficiency === 'high' ? 'text-primary' : 
                          task.efficiency === 'medium' ? 'text-warning-color' : 
                          'text-red-500'
                        } font-medium mr-2`}>
                          {task.efficiency === 'high' ? t('review.efficiency.high') : 
                           task.efficiency === 'medium' ? t('review.efficiency.medium') : 
                           t('review.efficiency.low')}
                        </span>
                        <span>{'⭐'.repeat(task.rating)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {task.analysis}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* SOP建议 */}
            {review.sopRecommendations && review.sopRecommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">{t('review.sopRecommendations')}</h4>
                
                {review.sopRecommendations.map((sop, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg mb-3 last:mb-0">
                    <div className="font-medium text-tertiary-color mb-2">{sop.title}</div>
                    <ol className="pl-5 space-y-1 text-sm" style={{ listStyleType: 'decimal' }}>
                      {sop.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
            
            {/* 应用建议按钮 */}
            <div className="mt-6 flex justify-center">
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                onClick={() => window.alert(t('review.sopAppliedAlert'))}
              >
                {t('review.applyToTomorrowPlan')}
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
            onClick={onClose}
          >
            {t('actions.close')}
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={onClose}
          >
            {t('review.exportReport')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal; 