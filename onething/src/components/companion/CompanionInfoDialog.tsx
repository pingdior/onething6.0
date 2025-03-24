import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  LinearProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface CompanionInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const CompanionInfoDialog: React.FC<CompanionInfoDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            AI伙伴
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        {/* 伙伴成长 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            伙伴成长
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            随着你的使用，AI伙伴会深入了解你的习惯、偏好和目标，提供更个性化的帮助。
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">
                当前等级: Lv.3 (进阶助手)
              </Typography>
              <Typography variant="subtitle2" color="primary">
                65%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={65} 
              sx={{ 
                height: 8, 
                borderRadius: 4 
              }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              距离 Lv.4 (战略顾问) 还需35%成长值
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
        
        <Divider sx={{ my: 2 }} />
        
        {/* 互动记忆 */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            互动记忆
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            重要时刻:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {['首次设定PMP目标', '克服学习瓶颈', '完成周计划'].map((memory, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 1, 
                  display: 'flex', 
                  alignItems: 'flex-start' 
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    mr: 1, 
                    color: 'primary.main',
                    fontSize: '1.2rem',
                    lineHeight: 1
                  }}
                >
                  •
                </Box>
                <Typography variant="body2">
                  {memory}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            经常讨论的话题:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['学习进度', '时间管理', '目标设定'].map((topic, index) => (
              <Box 
                key={index}
                sx={{ 
                  bgcolor: 'rgba(78, 205, 196, 0.1)', 
                  color: 'primary.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 4,
                  fontSize: '0.75rem'
                }}
              >
                #{topic}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanionInfoDialog; 