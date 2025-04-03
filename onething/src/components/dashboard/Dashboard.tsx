import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, CircularProgress, LinearProgress,
  List, ListItem, ListItemText, Divider, Card, CardContent, Button
} from '@mui/material';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';
import GoalProgressChart from '../goals/GoalProgressChart';
import TimeHeatmapChart from '../review/TimeHeatmapChart';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { isMobile } from '../../i18n'; // 导入isMobile函数

// 统计卡片组件
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}> = ({ title, value, subtext, icon }) => (
  <Card elevation={0} sx={{ 
    height: '100%', 
    bgcolor: 'background.default',
    border: '1px solid #eaeaea',
    borderRadius: '8px'
  }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
            {value}
          </Typography>
          {subtext && (
            <Typography variant="caption" color="text.secondary">
              {subtext}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

// 主要指标UI组件
const LinearProgressWithLabel: React.FC<{ value: number }> = ({ value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
    <Box sx={{ width: '100%', mr: 1 }}>
      <LinearProgress 
        variant="determinate" 
        value={value} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#4ECDC4'
          }
        }}
      />
    </Box>
    <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.secondary">
        {`${Math.round(value)}%`}
      </Typography>
    </Box>
  </Box>
);

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// 在合适的位置添加复盘入口 - 仅在必要时显示
const DashboardReviewSection = () => {
  // 从代码中完全移除此组件的显示
  return null;
  
  // 原始代码注释掉
  /*
  const { t } = useTranslation();
  
  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A535C' }}>
            {t('review.title')}
          </Typography>
          <AssessmentIcon sx={{ color: '#4ECDC4' }} />
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Typography variant="body2" sx={{ mb: 2, color: '#6B7280' }}>
          {t('review.dashboardDescription')}
        </Typography>
        <Button 
          component={Link} 
          to="/review" 
          variant="outlined" 
          color="primary"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          {t('review.goToReview')}
        </Button>
      </CardContent>
    </Card>
  );
  */
};

const Dashboard: React.FC = () => {
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  const navigate = useNavigate(); // 添加导航hook
  
  const [completionRate, setCompletionRate] = useState(0);
  const [todayCompletedTasks, setTodayCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [priorityGoal, setPriorityGoal] = useState<any>(null);
  
  // 检测是否为移动设备
  const isMobileDevice = isMobile();
  
  useEffect(() => {
    // 计算整体目标完成率
    if (goals.length > 0) {
      const avgCompletionRate = goals.reduce((sum, goal) => sum + goal.completionRate, 0) / goals.length;
      setCompletionRate(Math.round(avgCompletionRate));
    }
    
    // 计算今日任务完成情况
    const totalTaskCount = tasks.length;
    const completedTaskCount = tasks.filter(task => task.completed).length;
    setTodayCompletedTasks(completedTaskCount);
    setTotalTasks(totalTaskCount);
    
    // 获取优先级最高的目标
    const highPriorityGoals = goals.filter(goal => goal.priority === 'high');
    if (highPriorityGoals.length > 0) {
      const lowestCompletionGoal = highPriorityGoals.reduce(
        (prev, current) => (prev.completionRate < current.completionRate) ? prev : current
      );
      setPriorityGoal(lowestCompletionGoal);
    } else if (goals.length > 0) {
      setPriorityGoal(goals[0]);
    }
  }, [goals, tasks]);
  
  // 替换目标展示部分
  const highPriorityGoal = goals.find(goal => goal.priority === 'high') || goals[0];
  
  // 生成模拟数据
  const generateHeatmapData = () => {
    const data = [];
    // 为每天的每个工作时间段生成数据
    for (let day = 0; day < 7; day++) {
      for (let hour = 8; hour < 22; hour++) {
        // 工作效率在0-10之间随机，但在特定时间段效率会更高
        let efficiency = Math.random() * 10;
        // 上午9-11点和下午14-16点效率更高
        if ((hour >= 9 && hour < 11) || (hour >= 14 && hour < 16)) {
          efficiency = 5 + Math.random() * 5; // 5-10之间
        }
        // 周末效率略低
        if (day > 4) {
          efficiency *= 0.8;
        }
        data.push({
          day,
          hour,
          efficiency: Math.round(efficiency * 10) / 10
        });
      }
    }
    return data;
  };
  
  // 添加跳转到目标页面的处理函数
  const handleViewAllGoals = () => {
    navigate('/goals');
  };
  
  return (
    <Box>
      {/* 统计卡片区域 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="整体目标完成率"
            value={`${completionRate}%`}
            subtext={`共 ${goals.length} 个目标`}
            icon={
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={completionRate}
                  size={40}
                  sx={{
                    color: '#4ECDC4',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${completionRate}%`}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="今日任务完成"
            value={`${todayCompletedTasks}/${totalTasks}`}
            subtext={totalTasks > 0 ? `完成率 ${Math.round((todayCompletedTasks / totalTasks) * 100)}%` : '暂无任务'}
            icon={
              <Box sx={{ fontSize: '2rem' }}>
                {todayCompletedTasks === totalTasks && totalTasks > 0 ? '🎉' : '📋'}
              </Box>
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="当前情绪状态"
            value="😊 良好"
            subtext="比昨天提升了15%"
            icon={
              <Box sx={{ fontSize: '2rem' }}>
                📈
              </Box>
            }
          />
        </Grid>
      </Grid>
      
      {/* 详细信息区域 */}
      <Grid container spacing={3}>
        {/* 优先目标区域 - 添加查看全部按钮 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                优先目标
              </Typography>
              {isMobileDevice && (
                <Button 
                  size="small" 
                  onClick={handleViewAllGoals}
                  sx={{ 
                    color: '#4ECDC4', 
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  查看全部
                </Button>
              )}
            </Box>
            <Divider sx={{ my: 1 }} />
            <GoalProgressChart 
              goal={highPriorityGoal} 
              showDetails={true}
              height={220}
              milestones={[
                { value: 25, label: '初步规划' },
                { value: 50, label: '半程检查点' },
                { value: 75, label: '最终冲刺' },
                { value: 100, label: '目标完成' },
              ]}
            />
          </Paper>
        </Grid>
        
        {/* 时间效率分析 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              时间效率分析
            </Typography>
            <Divider sx={{ my: 1 }} />
            <TimeHeatmapChart 
              data={generateHeatmapData()} 
              height={250}
            />
          </Paper>
        </Grid>
      </Grid>
      
      {/* 只在移动设备上显示复盘入口 */}
      {isMobileDevice && <DashboardReviewSection />}
    </Box>
  );
};

export default Dashboard; 