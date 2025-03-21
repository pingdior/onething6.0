import React from 'react';
import { EmotionRecord, EmotionType } from '../../store/emotionStore';

interface EmotionDistributionChartProps {
  records: EmotionRecord[];
}

interface EmotionDistribution {
  type: EmotionType;
  count: number;
  percentage: number;
  color: string;
  emoji: string;
  label: string;
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

const getEmotionLabel = (type: EmotionType): string => {
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

const EmotionDistributionChart: React.FC<EmotionDistributionChartProps> = ({ records }) => {
  if (records.length === 0) {
    return (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">暂无情绪数据</div>
      </div>
    );
  }
  
  // 计算情绪分布
  const distributionMap = new Map<EmotionType, number>();
  records.forEach(record => {
    const count = distributionMap.get(record.emotion) || 0;
    distributionMap.set(record.emotion, count + 1);
  });
  
  const distribution: EmotionDistribution[] = [];
  let totalCount = 0;
  
  distributionMap.forEach((count, type) => {
    totalCount += count;
    distribution.push({
      type,
      count,
      percentage: 0, // 稍后计算
      color: getEmotionColor(type),
      emoji: getEmotionEmoji(type),
      label: getEmotionLabel(type)
    });
  });
  
  // 计算百分比并排序
  distribution.forEach(item => {
    item.percentage = Math.round((item.count / totalCount) * 100);
  });
  
  distribution.sort((a, b) => b.count - a.count);
  
  // 生成简单的圆饼图
  let startAngle = 0;
  const segments = distribution.map(item => {
    const angle = (item.percentage / 100) * 360;
    const segment = createSegment(startAngle, startAngle + angle, item.color);
    startAngle += angle;
    return segment;
  });
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-gray-500">
            {distribution.length}种情绪
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 w-full text-sm">
        {distribution.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
            <span className="mr-1">{item.emoji}</span>
            <span className="mr-1">{item.label}</span>
            <span className="text-gray-500 ml-auto">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 创建饼图的一个扇形
function createSegment(startAngle: number, endAngle: number, color: string) {
  // 圆心和半径
  const centerX = 50;
  const centerY = 50;
  const radius = 40;
  
  // 角度转弧度
  const startRad = (startAngle - 90) * Math.PI / 180; // -90是为了从12点钟方向开始
  const endRad = (endAngle - 90) * Math.PI / 180;
  
  // 计算起点和终点坐标
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  
  // 创建路径
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const path = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  
  return <path d={path} fill={color} />;
}

export default EmotionDistributionChart; 