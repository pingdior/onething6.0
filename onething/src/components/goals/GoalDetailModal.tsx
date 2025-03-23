import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, TextField, List, ListItem,
  ListItemIcon, ListItemText, Checkbox, Chip, Divider,
  IconButton, Paper, LinearProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Goal, useGoalStore } from '../../store/goalStore';

interface GoalDetailModalProps {
  goal: Goal;
  onClose: () => void;
  open: boolean;
}

const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ goal, onClose, open }) => {
  const [newSubGoal, setNewSubGoal] = useState('');
  const toggleSubGoalCompletion = useGoalStore(state => state.toggleSubGoalCompletion);
  const addSubGoal = useGoalStore(state => state.addSubGoal);
  
  // 格式化截止日期
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // 计算剩余天数
  const calculateRemainingDays = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadline = new Date(dateString);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // 添加子目标
  const handleAddSubGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newSubGoal.trim()) {
      addSubGoal(goal.id, {
        title: newSubGoal,
        completed: false
      });
      setNewSubGoal('');
    }
  };
  
  // 切换子目标完成状态
  const handleToggleSubGoal = (subGoalId: string) => {
    toggleSubGoalCompletion(goal.id, subGoalId);
  };
  
  // 根据优先级获取颜色
  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return { bg: '#FFE4E4', text: '#FF5757' };
      case 'medium':
        return { bg: '#FFF4E4', text: '#FFA057' };
      case 'low':
        return { bg: '#E4F4FF', text: '#57A0FF' };
      default:
        return { bg: '#E4F4FF', text: '#57A0FF' };
    }
  };
  
  const remainingDays = calculateRemainingDays(goal.deadline);
  const priorityColors = getPriorityColor(goal.priority);
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            目标详情
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="div" sx={{ mr: 1 }}>
              {goal.icon || '🎯'} {goal.title}
            </Typography>
            <Chip 
              label={goal.priority === 'high' ? '高优先级' : goal.priority === 'medium' ? '中优先级' : '低优先级'} 
              size="small" 
              sx={{
                bgcolor: priorityColors.bg,
                color: priorityColors.text,
                fontWeight: 500
              }}
            />
          </Box>
          
          {goal.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {goal.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              截止日期: {formatDeadline(goal.deadline)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: remainingDays < 0 ? 'error.main' : 
                       remainingDays < 3 ? 'warning.main' : 
                       'success.main',
                fontWeight: 500
              }}
            >
              {remainingDays < 0 ? `已逾期 ${Math.abs(remainingDays)} 天` : 
               remainingDays === 0 ? '今日截止' : 
               `剩余 ${remainingDays} 天`}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            完成进度
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={goal.completionRate} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#4ECDC4'
                  }
                }}
              />
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {goal.completionRate}%
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            子目标
          </Typography>
          
          {goal.subGoals && goal.subGoals.length > 0 ? (
            <Paper variant="outlined" sx={{ mb: 2 }}>
              <List disablePadding>
                {goal.subGoals.map((subGoal) => (
                  <ListItem
                    key={subGoal.id}
                    divider
                    disablePadding
                    sx={{ px: 2, py: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        edge="start"
                        checked={subGoal.completed}
                        onChange={() => handleToggleSubGoal(subGoal.id)}
                        sx={{
                          color: '#4ECDC4',
                          '&.Mui-checked': {
                            color: '#4ECDC4',
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={subGoal.title}
                      sx={{
                        '& .MuiListItemText-primary': {
                          textDecoration: subGoal.completed ? 'line-through' : 'none',
                          color: subGoal.completed ? 'text.disabled' : 'text.primary'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              暂无子目标
            </Typography>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleAddSubGoal}
            sx={{ display: 'flex', gap: 1 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="添加新子目标..."
              value={newSubGoal}
              onChange={(e) => setNewSubGoal(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="outlined"
              disabled={!newSubGoal.trim()}
            >
              添加
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalDetailModal; 