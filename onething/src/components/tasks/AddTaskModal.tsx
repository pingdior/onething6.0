import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTaskStore } from '../../store/taskStore';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAIPlan?: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onAIPlan }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const addTask = useTaskStore(state => state.addTask);
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!title || !startTime || !endTime) {
      return;
    }
    
    const timeString = `${startTime}-${endTime}`;
    
    try {
      addTask({
        title,
        time: timeString,
        completed: false,
        timeRange: {
          start: startTime,
          end: endTime
        }
      });
      handleClose();
    } catch (error) {
      console.error('添加任务失败:', error);
    }
  };
  
  const handleClose = () => {
    setTitle('');
    setStartTime('');
    setEndTime('');
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            添加任务
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="task-title"
            label="任务内容"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入任务内容..."
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              required
              fullWidth
              id="start-time"
              label="开始时间"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5分钟为步长
              }}
            />
            
            <TextField
              required
              fullWidth
              id="end-time"
              label="结束时间"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5分钟为步长
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {onAIPlan && (
          <Button
            color="secondary"
            onClick={onAIPlan}
          >
            让AI帮我规划
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleClose}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!title || !startTime || !endTime}
        >
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal; 