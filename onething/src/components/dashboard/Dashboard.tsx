import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, CircularProgress, LinearProgress,
  List, ListItem, ListItemText, Divider, Card, CardContent 
} from '@mui/material';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtext, icon }) => (
  <Card elevation={0} sx={{ height: '100%', bgcolor: 'background.default' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div" sx={{ mb: 0.5 }}>
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

const Dashboard: React.FC = () => {
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  
  const [completionRate, setCompletionRate] = useState(0);
  const [todayCompletedTasks, setTodayCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [priorityGoal, setPriorityGoal] = useState<any>(null);
  
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
      // 选择完成率最低的高优先级目标
      const lowestCompletionGoal = highPriorityGoals.reduce(
        (prev, current) => (prev.completionRate < current.completionRate) ? prev : current
      );
      setPriorityGoal(lowestCompletionGoal);
    } else if (goals.length > 0) {
      // 如果没有高优先级目标，则选择第一个目标
      setPriorityGoal(goals[0]);
    }
  }, [goals, tasks]);
  
  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* 统计卡片区域 */}
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
        
        {/* 优先目标区域 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              优先目标
            </Typography>
            {priorityGoal ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="span" sx={{ mr: 2 }}>
                    {priorityGoal.icon || '🎯'} {priorityGoal.title}
                  </Typography>
                  <Box 
                    sx={{ 
                      backgroundColor: 
                        priorityGoal.priority === 'high' ? 'error.light' : 
                        priorityGoal.priority === 'medium' ? 'warning.light' : 'info.light',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}
                  >
                    {priorityGoal.priority === 'high' ? '高' : 
                     priorityGoal.priority === 'medium' ? '中' : '低'}优先级
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgressWithLabel value={priorityGoal.completionRate} />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  截止日期: {formatDate(priorityGoal.deadline)}
                </Typography>
                
                {priorityGoal.subGoals && priorityGoal.subGoals.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      子目标进展
                    </Typography>
                    <List dense>
                      {priorityGoal.subGoals.slice(0, 4).map((subGoal: any) => (
                        <ListItem key={subGoal.id} disablePadding sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  textDecoration: subGoal.completed ? 'line-through' : 'none',
                                  color: subGoal.completed ? 'text.disabled' : 'text.primary',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {subGoal.completed ? '✓' : '○'} {subGoal.title}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                      {priorityGoal.subGoals.length > 4 && (
                        <ListItem disablePadding sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="body2" 
                                color="primary"
                              >
                                查看全部 {priorityGoal.subGoals.length} 个子目标...
                              </Typography>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography color="text.secondary">
                没有设置目标，点击"目标"页面添加新目标
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* 时间效率分析 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              时间效率分析
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                最佳工作时段
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ 
                  bgcolor: 'success.light', 
                  color: 'success.contrastText',
                  p: 1,
                  borderRadius: 1,
                  width: '30%',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2">上午 9:00-11:00</Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText',
                  p: 1,
                  borderRadius: 1,
                  width: '30%',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2">下午 14:00-16:00</Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: 'secondary.light', 
                  color: 'secondary.contrastText',
                  p: 1,
                  borderRadius: 1,
                  width: '30%',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2">晚上 20:00-22:00</Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                本周专注度
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 100 }}>周一</Typography>
                  <LinearProgressWithLabel value={85} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 100 }}>周二</Typography>
                  <LinearProgressWithLabel value={75} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 100 }}>周三</Typography>
                  <LinearProgressWithLabel value={92} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 100 }}>周四</Typography>
                  <LinearProgressWithLabel value={68} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ width: 100 }}>周五</Typography>
                  <LinearProgressWithLabel value={88} />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

function LinearProgressWithLabel(props: { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={props.value} sx={{ height: 8, borderRadius: 5 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

// 辅助函数：格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}

export default Dashboard; 