import React, { useState, useEffect } from 'react';
import { useGoalStore } from '../store/goalStore';
import { useTaskStore } from '../store/taskStore';
import { useReviewStore, ReviewData } from '../store/reviewStore';
import AppLayout from '../components/layout/AppLayout';
import ReviewCard from '../components/review/ReviewCard';
import ReviewDetailModal from '../components/review/ReviewDetailModal';
import GenerateReviewModal from '../components/review/GenerateReviewModal';

type TimeRange = 'week' | 'month' | 'custom';

const Review: React.FC = () => {
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  const reviews = useReviewStore(state => state.reviews);
  const generateReview = useReviewStore(state => state.generateReview);
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  
  // 获取当前周的起止日期
  const getCurrentWeekRange = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 是周日，1 是周一
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // 调整到周一
    
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(now);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0]
    };
  };
  
  // 获取当前月的起止日期
  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };
  
  // 生成新的复盘报告
  const handleGenerateReview = () => {
    let dateRange: { start: string; end: string; type: 'day' | 'week' | 'month' | 'custom' };
    
    if (selectedTimeRange === 'week') {
      const weekRange = getCurrentWeekRange();
      dateRange = { ...weekRange, type: 'week' };
    } else if (selectedTimeRange === 'month') {
      const monthRange = getCurrentMonthRange();
      dateRange = { ...monthRange, type: 'month' };
    } else {
      dateRange = { ...customDateRange, type: 'custom' };
    }
    
    const newReview = generateReview({
      startDate: dateRange.start,
      endDate: dateRange.end,
      type: dateRange.type,
      goals,
      tasks
    });
    
    setSelectedReview(newReview);
    setShowGenerateModal(false);
  };
  
  const handleReviewClick = (review: ReviewData) => {
    setSelectedReview(review);
  };
  
  const getTimeRangeLabel = () => {
    if (selectedTimeRange === 'week') return '本周';
    if (selectedTimeRange === 'month') return '本月';
    return '自定义时间段';
  };
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>目标复盘</span>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowGenerateModal(true)}
          >
            生成新复盘
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <div 
              className={`py-2 px-4 cursor-pointer ${selectedTimeRange === 'week' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
              onClick={() => setSelectedTimeRange('week')}
            >
              周
            </div>
            <div 
              className={`py-2 px-4 cursor-pointer ${selectedTimeRange === 'month' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
              onClick={() => setSelectedTimeRange('month')}
            >
              月
            </div>
            <div 
              className={`py-2 px-4 cursor-pointer ${selectedTimeRange === 'custom' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
              onClick={() => setSelectedTimeRange('custom')}
            >
              自定义
            </div>
          </div>
          
          {selectedTimeRange === 'custom' && (
            <div className="flex items-center gap-2 mt-4">
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-3 py-2"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span>至</span>
              <input 
                type="date" 
                className="border border-gray-300 rounded-md px-3 py-2"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          )}
        </div>
        
        {/* 复盘列表 */}
        <div>
          <h3 className="text-lg font-medium mb-4">{getTimeRangeLabel()}复盘</h3>
          
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onClick={handleReviewClick} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">暂时没有复盘记录</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowGenerateModal(true)}
              >
                生成首个复盘报告
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 复盘详情弹窗 */}
      {selectedReview && (
        <ReviewDetailModal 
          review={selectedReview} 
          onClose={() => setSelectedReview(null)} 
        />
      )}
      
      {/* 使用新的生成复盘弹窗组件 */}
      <GenerateReviewModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={handleGenerateReview}
        timeRangeLabel={getTimeRangeLabel()}
      />
    </AppLayout>
  );
};

export default Review; 