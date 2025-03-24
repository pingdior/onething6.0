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
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface GenerateReviewModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
  timeRangeLabel: string;
}

const GenerateReviewModal: React.FC<GenerateReviewModalProps> = ({ 
  open, 
  onClose, 
  onGenerate, 
  timeRangeLabel 
}) => {
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
            生成新复盘
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          确定要生成{timeRangeLabel}的复盘报告吗？系统将分析您的目标和任务完成情况，生成详细的复盘报告。
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={onGenerate}
          color="primary"
        >
          生成复盘
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReviewModal; 