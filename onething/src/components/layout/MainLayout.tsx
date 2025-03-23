import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showChatSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showChatSidebar = false }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#f7f9fb'
      }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: 3, 
            overflow: 'auto',
            maxWidth: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout; 