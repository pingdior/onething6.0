import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmotionChart: React.FC = () => {
  const { t } = useTranslation();
  
  // 模拟情绪数据
  const dates = ['3/13', '3/14', '3/15', '3/16', '3/17', '3/18', '3/19'];
  const moodData = [65, 70, 55, 60, 75, 85, 80];
  const energyData = [70, 65, 60, 70, 75, 80, 85];
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: t('emotions.chart.pleasantness'),
        data: moodData,
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: t('emotions.chart.energyLevel'),
        data: energyData,
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };
  
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {t('emotions.trend')}
      </Typography>
      <Box sx={{ height: 250 }}>
        <Line data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default EmotionChart; 