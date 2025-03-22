import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import TaskList from '../components/tasks/TaskList';
import GoalProgress from '../components/goals/GoalProgress';
import DashboardComponent from '../components/dashboard/Dashboard';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        仪表盘
      </Typography>
      
      <DashboardComponent />
      
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              今日待办
            </Typography>
            <TaskList />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              目标进展
            </Typography>
            <GoalProgress />
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard; 