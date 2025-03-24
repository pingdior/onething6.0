import React from 'react';
import { Typography, Box } from '@mui/material';
import AppLayout from '../components/layout/AppLayout';
import DashboardComponent from '../components/dashboard/Dashboard';

const Dashboard: React.FC = () => {
  return (
    <AppLayout>
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
        
        <Box sx={{ flex: 1 }}>
          <DashboardComponent />
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Dashboard; 