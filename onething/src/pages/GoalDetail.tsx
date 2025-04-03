import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, IconButton, Paper, Divider, LinearProgress, 
  Chip, List, ListItem, ListItemText, ListItemIcon, Checkbox,
  Button
} from '@mui/material';
import { 
  ArrowBack, Flag, CalendarMonth, AccessTime, 
  Add as AddIcon, MoreVert
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { isMobile } from '../i18n';
import { useGoalStore } from '../store/goalStore';

const GoalDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isOnMobile = isMobile();
  
  const goals = useGoalStore(state => state.goals);
  const [goal, setGoal] = useState<any>(null);
  
  // 获取目标数据
  useEffect(() => {
    if (id) {
      const foundGoal = goals.find(g => g.id === id);
      if (foundGoal) {
        setGoal(foundGoal);
      } else {
        // 如果找不到对应目标，使用第一个目标作为示例
        if (goals.length > 0) {
          setGoal(goals[0]);
        } else {
          // 如果没有目标，使用模拟数据
          setGoal({
            id: 'mock-goal',
            title: 'PMP认证',
            icon: '🎯',
            description: '在2024年6月前获得PMP认证',
            priority: 'high',
            deadline: '2024-06-30',
            completionRate: 68,
            createdAt: '2024-02-15',
            subGoals: [
              { id: 'sg1', title: '完成PMBOK学习', completed: true },
              { id: 'sg2', title: '完成35小时培训', completed: true },
              { id: 'sg3', title: '完成1000道练习题', completed: false },
              { id: 'sg4', title: '模拟考试达到80%', completed: false },
              { id: 'sg5', title: '参加正式考试', completed: false },
            ],
            milestones: [
              { id: 'm1', title: '学习阶段', date: '2024-03-31', completed: true },
              { id: 'm2', title: '练习阶段', date: '2024-05-15', completed: false },
              { id: 'm3', title: '冲刺阶段', date: '2024-06-15', completed: false },
              { id: 'm4', title: '考试', date: '2024-06-30', completed: false },
            ],
            tasks: [
              { id: 't1', title: 'PMBOK第6章学习', date: '2024-03-22', completed: false },
              { id: 't2', title: '完成100道练习题', date: '2024-03-24', completed: false },
              { id: 't3', title: '复习进度管理知识点', date: '2024-03-26', completed: false },
            ]
          });
        }
      }
    }
  }, [id, goals]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleToggleSubGoal = (subGoalId: string) => {
    if (goal) {
      setGoal({
        ...goal,
        subGoals: goal.subGoals.map((sg: any) => 
          sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
        )
      });
    }
  };
  
  // 计算到期剩余天数
  const getRemainingDays = () => {
    if (!goal) return 0;
    
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const timeDiff = deadline.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return dayDiff > 0 ? dayDiff : 0;
  };
  
  // 获取优先级显示文本和颜色
  const getPriorityData = () => {
    if (!goal) return { text: '', color: '', bgColor: '' };
    
    switch(goal.priority) {
      case 'high':
        return { text: '高优先级', color: '#FF5757', bgColor: '#FFE4E4' };
      case 'medium':
        return { text: '中优先级', color: '#FFA057', bgColor: '#FFF4E4' };
      case 'low':
        return { text: '低优先级', color: '#57A0FF', bgColor: '#E4F4FF' };
      default:
        return { text: '普通', color: '#57A0FF', bgColor: '#E4F4FF' };
    }
  };
  
  if (!goal) {
    return (
      <AppLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>加载中...</Typography>
        </Box>
      </AppLayout>
    );
  }
  
  const priorityData = getPriorityData();
  const remainingDays = getRemainingDays();
  
  return (
    <AppLayout>
      <Box sx={{ 
        height: 'calc(100vh - 120px)',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#F3F4F6',
        ...(isOnMobile ? { 
          p: 0,
          height: 'calc(100vh - 116px)',
        } : {})
      }}>
        {/* 顶部导航栏 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          bgcolor: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              目标详情
            </Typography>
          </Box>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
        
        {/* 主要内容区域 */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 2
        }}>
          {/* 目标基本信息卡片 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mr: 2 }}>
                {goal.icon || '🎯'} {goal.title}
              </Typography>
              <Chip 
                label={priorityData.text}
                size="small"
                sx={{ 
                  bgcolor: priorityData.bgColor,
                  color: priorityData.color,
                  fontWeight: 500
                }}
              />
            </Box>
            
            {goal.description && (
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {goal.description}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonth sx={{ fontSize: 20, color: '#6B7280', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  截止日期: {new Date(goal.deadline).toLocaleDateString('zh-CN')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ fontSize: 20, color: '#6B7280', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  剩余时间: {remainingDays} 天
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Flag sx={{ fontSize: 20, color: '#6B7280', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  创建于: {new Date(goal.createdAt).toLocaleDateString('zh-CN')}
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* 进度卡片 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              整体进度
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">完成度</Typography>
                <Typography variant="body2" fontWeight={500} color="primary">
                  {goal.completionRate}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={goal.completionRate} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(0,0,0,0.05)'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                子目标: {goal.subGoals.filter((sg: any) => sg.completed).length}/{goal.subGoals.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                里程碑: {goal.milestones.filter((m: any) => m.completed).length}/{goal.milestones.length}
              </Typography>
            </Box>
          </Paper>
          
          {/* 子目标列表 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                子目标
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                sx={{ textTransform: 'none' }}
              >
                添加
              </Button>
            </Box>
            
            <List disablePadding>
              {goal.subGoals.map((subGoal: any, index: number) => (
                <React.Fragment key={subGoal.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem 
                    disablePadding 
                    sx={{ py: 1 }}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={subGoal.completed}
                        onChange={() => handleToggleSubGoal(subGoal.id)}
                        sx={{
                          color: '#4ECDC4',
                          '&.Mui-checked': {
                            color: '#4ECDC4',
                          },
                        }}
                      />
                    }
                  >
                    <ListItemText
                      primary={subGoal.title}
                      primaryTypographyProps={{
                        style: {
                          textDecoration: subGoal.completed ? 'line-through' : 'none',
                          color: subGoal.completed ? '#A1A1AA' : 'inherit',
                        }
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          {/* 里程碑列表 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                里程碑
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                sx={{ textTransform: 'none' }}
              >
                添加
              </Button>
            </Box>
            
            <List disablePadding>
              {goal.milestones.map((milestone: any, index: number) => (
                <React.Fragment key={milestone.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Flag sx={{ 
                        color: milestone.completed ? '#4ECDC4' : '#FFB054',
                      }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={milestone.title}
                      secondary={new Date(milestone.date).toLocaleDateString('zh-CN')}
                      primaryTypographyProps={{
                        style: {
                          fontWeight: 500,
                          textDecoration: milestone.completed ? 'line-through' : 'none',
                          color: milestone.completed ? '#A1A1AA' : 'inherit',
                        }
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          {/* 近期任务 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                近期任务
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                sx={{ textTransform: 'none' }}
              >
                添加
              </Button>
            </Box>
            
            {goal.tasks && goal.tasks.length > 0 ? (
              <List disablePadding>
                {goal.tasks.map((task: any, index: number) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem 
                      disablePadding 
                      sx={{ py: 1 }}
                      secondaryAction={
                        <Checkbox
                          edge="end"
                          checked={task.completed}
                          sx={{
                            color: '#4ECDC4',
                            '&.Mui-checked': {
                              color: '#4ECDC4',
                            },
                          }}
                        />
                      }
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={new Date(task.date).toLocaleDateString('zh-CN')}
                        primaryTypographyProps={{
                          style: {
                            fontWeight: 500,
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#A1A1AA' : 'inherit',
                          }
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                暂无近期任务
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default GoalDetail; 