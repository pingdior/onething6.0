import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { EmotionRecord } from '../../store/emotionStore';
import { ChartConfiguration } from 'chart.js';

interface EmotionDistributionChartProps {
  records: EmotionRecord[];
}

const EmotionDistributionChart: React.FC<EmotionDistributionChartProps> = ({ records }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  // 获取情绪类型对应的颜色
  const getEmotionColor = (type: string): string => {
    switch(type) {
      case 'happy': return '#4BD0A0';
      case 'excited': return '#7C6BFF';
      case 'calm': return '#4ECDC4';
      case 'sad': return '#6B7280';
      case 'anxious': return '#FFB054';
      case 'angry': return '#FF6B6B';
      case 'tired': return '#9CA3AF';
      default: return '#6B7280';
    }
  };
  
  // 获取情绪类型对应的名称
  const getEmotionName = (type: string): string => {
    switch(type) {
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
  
  useEffect(() => {
    if (chartRef.current) {
      // 计算各情绪类型的数量
      const emotionCounts = new Map<string, number>();
      records.forEach(record => {
        const count = emotionCounts.get(record.emotion) || 0;
        emotionCounts.set(record.emotion, count + 1);
      });
      
      // 准备图表数据
      const labels: string[] = [];
      const data: number[] = [];
      const backgroundColors: string[] = [];
      
      // 只显示存在的情绪类型
      Array.from(emotionCounts.entries())
        .sort((a, b) => b[1] - a[1]) // 按数量降序排列
        .forEach(([emotion, count]) => {
          labels.push(getEmotionName(emotion));
          data.push(count);
          backgroundColors.push(getEmotionColor(emotion));
        });
      
      // 销毁旧图表
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // 创建新图表
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const config: ChartConfiguration<'doughnut'> = {
          type: 'doughnut',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: backgroundColors,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 15,
                  padding: 15,
                  font: {
                    size: 12
                  },
                  color: '#4B5563'
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = Math.round((value as number / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            layout: {
              padding: 10
            },
            elements: {
              arc: {
                borderRadius: 6
              }
            }
          }
        };
        
        chartInstance.current = new Chart(ctx, config);
      }
    }
    
    // 组件卸载时销毁图表
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [records]);
  
  if (records.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        暂无情绪记录数据
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EmotionDistributionChart; 