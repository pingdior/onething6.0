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
import { useNavigate } from 'react-router-dom';
import { isMobile } from '../i18n';
import { useTranslation } from 'react-i18next';

type GoalFilter = 'all' | 'inProgress' | 'completed';
type GoalSort = 'priority' | 'deadline' | 'completion';

const Goals: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState<GoalFilter>('all');
  const [sort, setSort] = useState<GoalSort>('priority');
  const navigate = useNavigate();
  const isOnMobile = isMobile();
  
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
    if (isOnMobile) {
      navigate(`/goal-detail/${goal.id}`);
    } else {
      setSelectedGoal(goal);
      setShowDetailModal(true);
    }
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
            {t('goals.management')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
            >
              {t('goals.newGoal')}
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          {/* 过滤选项 */}
          <Paper sx={{ p: 2, borderRadius: '8px', width: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t('goals.filterTitle')}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={filter}
                onChange={(e) => setFilter(e.target.value as GoalFilter)}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label={t('goals.allGoals')}
                />
                <FormControlLabel
                  value="inProgress"
                  control={<Radio />}
                  label={t('goals.inProgress')}
                />
                <FormControlLabel
                  value="completed"
                  control={<Radio />}
                  label={t('goals.completed')}
                />
              </RadioGroup>
            </FormControl>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {t('goals.sortTitle')}
            </Typography>
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as GoalSort)}
              >
                <MenuItem value="priority">{t('goals.sortByPriority')}</MenuItem>
                <MenuItem value="deadline">{t('goals.sortByDeadline')}</MenuItem>
                <MenuItem value="completion">{t('goals.sortByCompletion')}</MenuItem>
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
                            label={t(`goals.priorityLabels.${goal.priority}`)}
                            size="small"
                            sx={{
                              bgcolor: priorityColor(goal.priority),
                              color: priorityTextColor(goal.priority),
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('goals.deadlineLabel')}: {new Date(goal.deadline).toLocaleDateString(i18n.language, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body2">{t('goals.progress')}</Typography>
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
                            {t('goals.subgoalProgress', { completed: goal.subGoals.filter(sg => sg.completed).length, total: goal.subGoals.length })}
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
                  {t('goals.noGoalsYet')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddModal}
                >
                  {t('goals.createFirst')}
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