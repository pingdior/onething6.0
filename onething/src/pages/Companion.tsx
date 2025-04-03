import React from 'react';
import { Box, Typography } from '@mui/material';
import AppLayout from '../components/layout/AppLayout';
import EnhancedCompanion from '../components/companion/EnhancedCompanion';
import { isMobile } from '../i18n';

const Companion: React.FC = () => {
  const isOnMobile = isMobile();
  
  return (
    <AppLayout>
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        ...(isOnMobile ? { padding: 0 } : {})
      }}>
        {!isOnMobile && (
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              color: '#1A535C', 
              mb: 3 
            }}
          >
            AI伙伴
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3,
          ...(isOnMobile ? { gap: 0 } : {})
        }}>
          {/* 主AI聊天区域 */}
          <Box sx={{ 
            flex: 1, 
            height: { 
              xs: isOnMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 200px)', 
              md: 'calc(100vh - 160px)' 
            } 
          }}>
            <EnhancedCompanion />
          </Box>
          
          {/* 右侧信息面板 - 在移动端不显示 */}
          {!isOnMobile && (
            <Box sx={{ width: { xs: '100%', md: '300px' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 伙伴成长状态 */}
              <Box sx={{ 
                bgcolor: 'white', 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)' 
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  伙伴成长
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  随着你的使用，AI伙伴会深入了解你的习惯、偏好和目标，提供更个性化的帮助。
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    当前等级: Lv.3 (进阶助手)
                  </Typography>
                  <Box sx={{ 
                    height: 8, 
                    bgcolor: '#E5E7EB', 
                    borderRadius: 4, 
                    mb: 1, 
                    position: 'relative' 
                  }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        left: 0, 
                        top: 0, 
                        height: '100%', 
                        width: '65%',
                        bgcolor: '#4ECDC4',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    65% 到 Lv.4 (战略顾问)
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  已解锁能力:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <Typography component="li" variant="body2">
                    深度目标分析
                  </Typography>
                  <Typography component="li" variant="body2">
                    个性化任务建议
                  </Typography>
                  <Typography component="li" variant="body2">
                    基础情绪支持
                  </Typography>
                </Box>
              </Box>
              
              {/* 互动记忆 */}
              <Box sx={{ 
                bgcolor: 'white', 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                display: { xs: 'none', md: 'block' }
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  互动记忆
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  重要时刻:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, color: 'primary.main' }}>•</Box>
                    首次设定PMP目标
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, color: 'primary.main' }}>•</Box>
                    克服学习瓶颈
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1, color: 'primary.main' }}>•</Box>
                    完成周计划
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  经常讨论的话题:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(78, 205, 196, 0.1)', 
                    color: '#4ECDC4',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}>
                    #学习进度
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(78, 205, 196, 0.1)', 
                    color: '#4ECDC4',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}>
                    #时间管理
                  </Box>
                  <Box sx={{ 
                    bgcolor: 'rgba(78, 205, 196, 0.1)', 
                    color: '#4ECDC4',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem'
                  }}>
                    #目标设定
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Companion; 