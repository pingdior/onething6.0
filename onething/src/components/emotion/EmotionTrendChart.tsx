import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { EmotionTrend } from '../../store/emotionStore';

interface EmotionTrendChartProps {
  trends: EmotionTrend[];
  period: 'week' | 'month' | 'year';
}

const EmotionTrendChart: React.FC<EmotionTrendChartProps> = ({ trends, period }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // 销毁旧图表
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // 准备数据
      const labels = trends.map(trend => {
        const date = new Date(trend.date);
        if (period === 'week') {
          return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
        } else if (period === 'month') {
          return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
        } else {
          return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' });
        }
      });
      
      const intensityData = trends.map(trend => trend.averageIntensity);
      
      // 创建图表
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: '情绪强度',
                data: intensityData,
                borderColor: '#7C6BFF',
                backgroundColor: 'rgba(124, 107, 255, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#7C6BFF',
                pointBorderColor: '#FFF',
                pointRadius: 4,
                pointHoverRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
                labels: {
                  boxWidth: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  color: '#4B5563'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#111827',
                bodyColor: '#4B5563',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                boxPadding: 4,
                callbacks: {
                  afterLabel: function(context) {
                    const index = context.dataIndex;
                    const emotion = trends[index].dominantEmotion;
                    const emotionText = getEmotionName(emotion);
                    return `主要情绪: ${emotionText}`;
                  }
                }
              }
            },
            scales: {
              y: {
                min: 0,
                max: 10,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  lineWidth: 1
                },
                ticks: {
                  color: '#6B7280',
                  padding: 10,
                  stepSize: 2
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#6B7280',
                  padding: 10,
                  maxRotation: 0
                }
              }
            },
            elements: {
              line: {
                borderWidth: 3
              }
            }
          }
        });
      }
    }
    
    // 清理函数
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [trends, period]);
  
  // 获取情绪名称
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
  
  if (trends.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        暂无情绪趋势数据
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EmotionTrendChart; 