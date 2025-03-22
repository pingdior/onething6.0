import React from 'react';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container component="main" sx={{ flex: 1, py: 3 }}>
          {children}
        </Container>
      </Box>
      <ChatSidebar />
    </Box>
  );
};

export default MainLayout; 