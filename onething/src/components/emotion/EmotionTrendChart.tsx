import React from 'react';
import { EmotionTrend, EmotionType } from '../../store/emotionStore';

interface EmotionTrendChartProps {
  trends: EmotionTrend[];
  period: 'week' | 'month' | 'year';
}

const getEmotionColor = (type: EmotionType): string => {
  switch (type) {
    case 'happy': return '#FCD34D'; // yellow-300
    case 'excited': return '#F472B6'; // pink-400
    case 'calm': return '#60A5FA'; // blue-400
    case 'sad': return '#818CF8'; // indigo-400
    case 'anxious': return '#C084FC'; // purple-400
    case 'angry': return '#F87171'; // red-400
    case 'tired': return '#9CA3AF'; // gray-400
    default: return '#9CA3AF'; // gray-400
  }
};

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

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ trends, period }) => {
  if (trends.length === 0) {
    return (
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">暂无情绪数据</div>
      </div>
    );
  }
  
  // 获取日期格式化函数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (period === 'week') {
      return date.toLocaleDateString('zh-CN', { weekday: 'short' }); // 周几
    } else if (period === 'month') {
      return date.getDate().toString(); // 日期
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short' }); // 月份
    }
  };
  
  // 计算图表的最大强度值
  const maxIntensity = trends.reduce((max, trend) => 
    Math.max(max, trend.averageIntensity), 0);
  
  // 计算柱状图高度百分比
  const getBarHeightPercentage = (intensity: number) => {
    return (intensity / 10) * 100; // 最大值为10
  };
  
  // 获取相对趋势，用于确定上升/下降
  const getTrend = (index: number): 'up' | 'down' | 'same' => {
    if (index === 0) return 'same';
    
    const current = trends[index].averageIntensity;
    const previous = trends[index - 1].averageIntensity;
    
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };
  
  return (
    <div className="h-64 bg-white rounded-lg p-4">
      <div className="flex items-end h-48 space-x-1">
        {trends.map((trend, index) => {
          const height = getBarHeightPercentage(trend.averageIntensity);
          const color = getEmotionColor(trend.dominantEmotion);
          const emoji = getEmotionEmoji(trend.dominantEmotion);
          const trendDirection = getTrend(index);
          
          return (
            <div key={trend.date} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex justify-center mb-1">
                <span className="text-xs absolute -top-6">
                  {trend.averageIntensity.toFixed(1)}
                </span>
                {trendDirection === 'up' && (
                  <svg className="w-4 h-4 text-green-500 absolute -top-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {trendDirection === 'down' && (
                  <svg className="w-4 h-4 text-red-500 absolute -top-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div 
                className="relative w-full rounded-t-sm"
                style={{ height: `${height}%`, backgroundColor: color }}
              >
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sm">
                  {emoji}
                </span>
              </div>
              <div className="text-xs mt-2 text-gray-500">{formatDate(trend.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionTrendChart; 