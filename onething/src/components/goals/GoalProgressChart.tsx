import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { Goal } from '../../store/goalStore';

// 注册Chart.js组件
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 组件接口定义
interface GoalProgressChartProps {
  goal: Goal;
  historicalData?: { date: string; value: number }[];
  type?: 'doughnut' | 'line';
  height?: number;
  width?: number;
  milestones?: { value: number; label: string }[];
  showDetails?: boolean;
}

const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  goal,
  historicalData = [],
  type = 'doughnut',
  height = 200,
  width = '100%',
  milestones = [],
  showDetails = true,
}) => {
  const chartRef = useRef<ChartJS | null>(null);

  const getDaysRemaining = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadline = new Date(goal.deadline);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // 为环形图准备数据
  const doughnutData: ChartData<'doughnut'> = {
    labels: ['已完成', '未完成'],
    datasets: [
      {
        data: [goal.completionRate, 100 - goal.completionRate],
        backgroundColor: [
          '#4ECDC4', // 主题色
          '#E5E7EB'  // 灰色
        ],
        borderWidth: 0,
        borderRadius: 3,
      }
    ]
  };

  // 环形图配置
  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  // 为折线图准备数据
  const generateLineData = () => {
    // 如果没有历史数据，则创建模拟数据
    const dataPoints = historicalData.length > 0 ? historicalData : [
      { date: '一周前', value: Math.max(0, goal.completionRate - 15) },
      { date: '今天', value: goal.completionRate }
    ];

    return {
      labels: dataPoints.map(d => d.date),
      datasets: [
        {
          label: '进度',
          data: dataPoints.map(d => d.value),
          borderColor: '#4ECDC4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#4ECDC4',
          pointBorderColor: '#FFF',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  // 折线图配置
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return `${value}%`;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `进度: ${context.raw}%`;
          }
        }
      }
    }
  };

  // 根据目标进度返回颜色
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#22C55E'; // 绿色
    if (progress >= 50) return '#4ECDC4'; // 青绿色
    if (progress >= 25) return '#FFA057'; // 橙色
    return '#FF6B6B'; // 红色
  };

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch(priority) {
      case 'high': return '高优先级';
      case 'medium': return '中优先级';
      case 'low': return '低优先级';
      default: return '中优先级';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return { bg: '#FFE4E4', text: '#FF5757' };
      case 'medium': return { bg: '#FFF4E4', text: '#FFA057' };
      case 'low': return { bg: '#E4F4FF', text: '#57A0FF' };
      default: return { bg: '#FFF4E4', text: '#FFA057' };
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: 'auto', width }}>
      {showDetails && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" component="div">
              {goal.icon} {goal.title}
            </Typography>
            <Chip 
              label={getPriorityText(goal.priority)} 
              size="small"
              sx={{
                bgcolor: getPriorityColor(goal.priority).bg,
                color: getPriorityColor(goal.priority).text,
                fontWeight: 500
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              截止日期: {new Date(goal.deadline).toLocaleDateString('zh-CN')}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: getDaysRemaining() < 0 ? 'error.main' : 
                      getDaysRemaining() < 3 ? 'warning.main' : 
                      'success.main',
                fontWeight: 500
              }}
            >
              {getDaysRemaining() < 0 ? `已逾期 ${Math.abs(getDaysRemaining())} 天` : 
              getDaysRemaining() === 0 ? '今日截止' : 
              `剩余 ${getDaysRemaining()} 天`}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ height, position: 'relative' }}>
        {type === 'doughnut' ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} sx={{ position: 'relative' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  color={getProgressColor(goal.completionRate)}
                >
                  {goal.completionRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  完成度
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              {goal.subGoals && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    子目标进度
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {goal.subGoals.filter(sg => sg.completed).length}/{goal.subGoals.length} 已完成
                  </Typography>
                  {goal.subGoals.slice(0, 3).map((subGoal, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: subGoal.completed ? '#4ECDC4' : '#E5E7EB',
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white'
                        }}
                      >
                        {subGoal.completed ? '✓' : ''}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: subGoal.completed ? 'text.primary' : 'text.secondary',
                          textDecoration: subGoal.completed ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {subGoal.title}
                      </Typography>
                    </Box>
                  ))}
                  {goal.subGoals.length > 3 && (
                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                      +{goal.subGoals.length - 3} 个更多...
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ height: '100%', position: 'relative' }}>
            <Line data={generateLineData()} options={lineOptions} />

            {/* 里程碑标记 */}
            {milestones.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  里程碑
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {milestones.map((milestone, index) => (
                    <Chip
                      key={index}
                      label={milestone.label}
                      size="small"
                      variant={goal.completionRate >= milestone.value ? "filled" : "outlined"}
                      color={goal.completionRate >= milestone.value ? "success" : "default"}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default GoalProgressChart; 