import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Paper, Chip, FormControl,
  RadioGroup, FormControlLabel, Radio, MenuItem, Select, InputLabel,
  Divider, IconButton
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import AppLayout from '../components/layout/AppLayout';
import GoalCard from '../components/goals/GoalCard';
import GoalDetailModal from '../components/goals/GoalDetailModal';
import AddGoalModal from '../components/goals/AddGoalModal';
import { Goal, useGoalStore } from '../store/goalStore';

type GoalFilter = 'all' | 'inProgress' | 'completed';
type GoalSort = 'priority' | 'deadline' | 'completion';

const Goals: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [sort, setSort] = useState<GoalSort>('priority');
  
  const goals = useGoalStore(state => state.goals);
  
  // 过滤目标
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'completed') return goal.completionRate === 100;
    if (filter === 'inProgress') return goal.completionRate < 100;
    return true;
  });
  
  // 排序目标
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sort === 'priority') {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    }
    if (sort === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sort === 'completion') {
      return b.completionRate - a.completionRate;
    }
    return 0;
  });
  
  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowDetailModal(true);
  };
  
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };
  
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };
  
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedGoal(null);
  };
  
  const priorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '#FFE4E4';
      case 'medium':
        return '#FFF4E4';
      case 'low':
        return '#E4F4FF';
      default:
        return '#E4F4FF';
    }
  };
  
  const priorityTextColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return '#FF5757';
      case 'medium':
        return '#FFA057';
      case 'low':
        return '#57A0FF';
      default:
        return '#57A0FF';
    }
  };
  
  return (
    <AppLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A535C' }}>
            目标管理
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
            >
              新建目标
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          {/* 过滤选项 */}
          <Paper sx={{ p: 2, borderRadius: '8px', width: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              目标分类
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={filter}
                onChange={(e) => setFilter(e.target.value as GoalFilter)}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="所有目标"
                />
                <FormControlLabel
                  value="inProgress"
                  control={<Radio />}
                  label="进行中"
                />
                <FormControlLabel
                  value="completed"
                  control={<Radio />}
                  label="已完成"
                />
              </RadioGroup>
            </FormControl>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              排序方式
            </Typography>
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as GoalSort)}
              >
                <MenuItem value="priority">按优先级</MenuItem>
                <MenuItem value="deadline">按截止日期</MenuItem>
                <MenuItem value="completion">按完成度</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          
          {/* 目标列表 */}
          <Box sx={{ flex: 1 }}>
            {sortedGoals.length > 0 ? (
              <Grid container spacing={2}>
                {sortedGoals.map((goal) => (
                  <Grid item xs={12} key={goal.id}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }
                      }}
                      onClick={() => handleGoalClick(goal)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                            {goal.icon || '🎯'} {goal.title}
                          </Typography>
                          <Chip
                            label={goal.priority === 'high' ? '高优先级' : goal.priority === 'medium' ? '中优先级' : '低优先级'}
                            size="small"
                            sx={{
                              bgcolor: priorityColor(goal.priority),
                              color: priorityTextColor(goal.priority),
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          截止: {new Date(goal.deadline).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2">进度</Typography>
                          <Typography variant="body2" color="text.secondary">{goal.completionRate}%</Typography>
                        </Box>
                        <Box sx={{ 
                          width: '100%', 
                          height: 8, 
                          bgcolor: '#e0e0e0', 
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{ 
                            width: `${goal.completionRate}%`, 
                            height: '100%', 
                            bgcolor: '#4ECDC4',
                            borderRadius: 4
                          }} />
                        </Box>
                      </Box>
                      
                      {goal.subGoals && goal.subGoals.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            子目标: {goal.subGoals.filter(sg => sg.completed).length}/{goal.subGoals.length}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '8px' }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  暂无目标，点击"新建目标"按钮开始
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                >
                  创建第一个目标
                </Button>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* 添加目标对话框 */}
      <AddGoalModal 
        open={showAddModal}
        onClose={handleCloseAddModal}
      />
      
      {/* 目标详情对话框 */}
      {selectedGoal && (
        <GoalDetailModal
          open={showDetailModal}
          goal={selectedGoal}
          onClose={handleCloseDetailModal}
        />
      )}
    </AppLayout>
  );
};

export default Goals; 