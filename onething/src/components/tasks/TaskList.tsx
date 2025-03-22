import React, { useEffect, useState, useCallback } from 'react';
import { 
  List, ListItem, ListItemIcon, ListItemText, 
  Checkbox, Typography, Box, Paper
} from '@mui/material';
import { useTaskStore } from '../../store/taskStore';

const TaskList: React.FC = () => {
  const tasks = useTaskStore(state => state.tasks);
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  
  // 将任务按时间段分组并排序
  const getMorningTasks = useCallback(() => {
    return tasks
      .filter(task => {
        const startHour = task.timeRange?.start?.split(':')[0] || '';
        return ['09', '10', '11', '9'].includes(startHour);
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);
  
  const getAfternoonTasks = useCallback(() => {
    return tasks
      .filter(task => {
        const startHour = task.timeRange?.start?.split(':')[0] || '';
        return ['13', '14', '15', '16'].includes(startHour);
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);
  
  const getEveningTasks = useCallback(() => {
    return tasks
      .filter(task => {
        const startHour = task.timeRange?.start?.split(':')[0] || '';
        return ['17', '18', '19', '20', '21', '22'].includes(startHour);
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);
  
  const [morningTasks, setMorningTasks] = useState(getMorningTasks());
  const [afternoonTasks, setAfternoonTasks] = useState(getAfternoonTasks());
  const [eveningTasks, setEveningTasks] = useState(getEveningTasks());
  
  useEffect(() => {
    setMorningTasks(getMorningTasks());
    setAfternoonTasks(getAfternoonTasks());
    setEveningTasks(getEveningTasks());
  }, [getMorningTasks, getAfternoonTasks, getEveningTasks]);
  
  // 渲染任务时间段组
  const renderTaskGroup = (title: string, tasksToRender: any[]) => {
    if (tasksToRender.length === 0) {
      return null;
    }
    
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Paper elevation={1}>
          <List>
            {tasksToRender.map((task) => (
              <ListItem 
                key={task.id}
                dense
                onClick={() => toggleTaskCompletion(task.id)}
                sx={{ 
                  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                  '&:last-child': { borderBottom: 'none' },
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.disabled' : 'text.primary',
                  cursor: 'pointer'
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={task.title}
                  secondary={`${task.timeRange?.start} - ${task.timeRange?.end}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };
  
  // 当没有任务时显示提示信息
  if (tasks.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
        color: 'text.secondary'
      }}>
        <Typography variant="h6">没有待办任务</Typography>
        <Typography variant="body2">点击"添加任务"按钮创建新任务</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 2 }}>
      {renderTaskGroup("上午", morningTasks)}
      {renderTaskGroup("下午", afternoonTasks)}
      {renderTaskGroup("晚上", eveningTasks)}
      
      {morningTasks.length === 0 && afternoonTasks.length === 0 && eveningTasks.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          <Typography>今天没有安排任务</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TaskList; 