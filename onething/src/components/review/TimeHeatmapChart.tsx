import React, { useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData, 
  ChartOptions
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Box, Typography, Paper } from '@mui/material';
import { TimeSlot } from '../../store/reviewStore';

// 注册Chart.js组件
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface TimeHeatmapChartProps {
  data: {
    day: number; // 0-6 代表周一到周日
    hour: number; // 0-23 小时
    efficiency: number; // 0-10 效率值
  }[];
  height?: number;
}

const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const TimeHeatmapChart: React.FC<TimeHeatmapChartProps> = ({ data, height = 300 }) => {
  const chartRef = useRef<ChartJS<"scatter">>(null);

  // 将数据转换为Chart.js的散点图格式
  const chartData: ChartData<'scatter'> = {
    datasets: [{
      label: '工作效率',
      data: data.map(item => ({
        x: item.hour, // x轴是小时 0-23
        y: item.day,  // y轴是星期几 0-6
        v: item.efficiency // 自定义属性，表示效率值
      })),
      backgroundColor: (context) => {
        if (!context.raw) return 'rgba(78, 205, 196, 0.2)';
        
        const efficiency = (context.raw as any).v || 0;
        const alpha = efficiency / 10; // 效率越高，颜色越深
        return `rgba(78, 205, 196, ${alpha})`;
      },
      pointRadius: 15,
      pointHoverRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(78, 205, 196, 0.1)'
    }]
  };

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 23,
        ticks: {
          stepSize: 3,
          callback: function(value) {
            return `${value}:00`;
          }
        },
        title: {
          display: true,
          text: '时间（小时）',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        min: -0.5, // 给图表留出一些空间
        max: 6.5,
        reverse: false, // 从上到下：周一至周日
        ticks: {
          callback: function(value) {
            return dayLabels[value as number] || '';
          }
        },
        title: {
          display: true,
          text: '星期',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const raw = context.raw as any;
            const day = dayLabels[raw.y];
            const hour = `${raw.x}:00`;
            const efficiency = raw.v;
            return [`${day} ${hour}`, `效率: ${efficiency}/10`];
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 4,
      },
      legend: {
        display: false
      }
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
        时间效率热力图
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        展示一周内不同时间段的工作效率，颜色越深表示效率越高
      </Typography>
      <Box sx={{ height: height }}>
        <Scatter ref={chartRef} data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default TimeHeatmapChart; 