import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { isMobile } from '../../i18n';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const isOnMobile = isMobile();
  
  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        height: '60px'
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            color: '#4ECDC4'
          }}
        >
          {t('app.name')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!isOnMobile && <LanguageSwitcher />}
          <IconButton size="small">
            <NotificationsIcon sx={{ color: '#6B7280' }} />
          </IconButton>
          <Avatar 
            sx={{ 
              bgcolor: '#4B63FB', 
              width: 36, 
              height: 36,
              fontSize: '14px'
            }}
          >
            张
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 