import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header: React.FC = () => {
  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
          OneThing
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton size="medium">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>张</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 