import React, { useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import useGoalStore from '../../store/useGoalStore';

// 添加必要的类型定义
interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  subgoals: SubGoal[];
}

const GoalProgress: React.FC = () => {
  const { goals, loading, error, fetchGoals } = useGoalStore();
  
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);
  
  if (loading) {
    return <Typography>加载中...</Typography>;
  }
  
  if (error) {
    return <Typography color="error">错误：{error}</Typography>;
  }
  
  return (
    <Box>
      {goals.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          暂无目标，开始添加你的第一个目标吧！
        </Typography>
      ) : (
        // 添加明确的类型
        goals.map((goal: Goal) => (
          <Box key={goal.id} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">{goal.title}</Typography>
              <Typography variant="body2">{goal.progress}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={goal.progress} 
              sx={{ height: 8, borderRadius: 4 }} 
            />
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                子目标: {goal.subgoals.filter((sg: SubGoal) => sg.completed).length}/{goal.subgoals.length} 已完成
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default GoalProgress;