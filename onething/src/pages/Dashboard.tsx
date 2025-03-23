import React from 'react';
import { Typography, Grid, Paper, Box, Divider, Button } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import GoalProgress from '../components/goals/GoalProgress';
import DashboardComponent from '../components/dashboard/Dashboard';
import Companion from '../components/companion/Companion';

const Dashboard: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#1A535C', 
            mb: 3 
          }}
        >
          仪表盘
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* 左侧主内容区 */}
          <Box sx={{ flex: 1 }}>
            <DashboardComponent />
            
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: '8px' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    今日待办
                  </Typography>
                  <Divider sx={{ mt: 1, mb: 2 }} />
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      现在任务列表是空的，你可以开始添加一些任务。
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ 
                        bgcolor: '#4ECDC4',
                        '&:hover': { 
                          bgcolor: '#3DACA4'
                        }
                      }}
                    >
                      添加任务
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          {/* 右侧AI伴侣区 */}
          <Box sx={{ width: 300, display: { xs: 'none', md: 'block' } }}>
            <Paper sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI伴侣
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                <Companion />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Dashboard; 