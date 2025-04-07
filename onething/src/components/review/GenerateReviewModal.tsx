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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
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
            {t('review.generateNew')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t('review.confirmGenerateMessage', { timeRange: timeRangeLabel })}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          {t('actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onGenerate}
          color="primary"
        >
          {t('review.generate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateReviewModal; 