import React from 'react';
import { ReviewData } from '../../store/reviewStore';

interface ReviewCardProps {
  review: ReviewData;
  onClick: (review: ReviewData) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
  // 格式化日期范围
  const formatDateRange = () => {
    const startDate = new Date(review.dateRange.start);
    const endDate = new Date(review.dateRange.end);
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${startDate.toLocaleDateString('zh-CN', options)} - ${endDate.toLocaleDateString('zh-CN', options)}`;
  };
  
  // 根据完成率确定颜色
  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-blue-500';
    if (rate >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(review)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-xl mr-2">📊</span>
          <h3 className="text-lg font-bold">
            {review.dateRange.type === 'week' ? '周复盘' : 
             review.dateRange.type === 'month' ? '月复盘' : 
             review.dateRange.type === 'day' ? '日复盘' : '复盘分析'}
          </h3>
        </div>
        <div className="text-sm text-gray-500">
          {formatDateRange()}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>完成率：</span>
          <span className={getCompletionRateColor(review.overallProgress.completionRate)}>
            {review.overallProgress.completionRate}%
          </span>
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
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-100 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500">总任务数</div>
          <div className="font-semibold">{review.overallProgress.totalTasks}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500">已完成</div>
          <div className="font-semibold">{review.overallProgress.completedTasks}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg text-center">
          <div className="text-xs text-gray-500">平均效率</div>
          <div className="font-semibold">{review.timeAnalysis.averageEfficiency}/10</div>
        </div>
      </div>
      
      <div className="text-sm">
        <div className="font-medium mb-1">核心洞察：</div>
        <ul className="list-disc pl-5 text-gray-600">
          {review.insights.slice(0, 2).map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
          {review.insights.length > 2 && (
            <li>...</li>
          )}
        </ul>
      </div>
      
      <div className="text-sm text-primary font-medium cursor-pointer hover:underline text-right mt-2">
        [查看完整分析]
      </div>
    </div>
  );
};

export default ReviewCard; 