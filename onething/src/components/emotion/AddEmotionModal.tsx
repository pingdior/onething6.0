import React, { useState, useMemo } from 'react';
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
  Divider,
  Grid,
  Slider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Checkbox
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { EmotionType, EmotionRecord } from '../../store/emotionStore';
import { useGoalStore } from '../../store/goalStore';
import { useTaskStore } from '../../store/taskStore';
import { useTranslation } from 'react-i18next';

interface AddEmotionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (record: Omit<EmotionRecord, 'id'>) => void;
  initialRecord?: EmotionRecord;
}

const AddEmotionModal: React.FC<AddEmotionModalProps> = ({ open, onClose, onSave, initialRecord }) => {
  const { t, i18n } = useTranslation();
  const goals = useGoalStore(state => state.goals);
  const tasks = useTaskStore(state => state.tasks);
  
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>(initialRecord?.emotion || 'calm');
  const [intensity, setIntensity] = useState(initialRecord?.intensity || 5);
  const [note, setNote] = useState(initialRecord?.note || '');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(initialRecord?.factors || []);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>(initialRecord?.relatedGoals || []);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(initialRecord?.relatedTasks || []);
  const [date, setDate] = useState(initialRecord?.date || new Date().toISOString().split('T')[0]);
  
  const emotionOptions = useMemo(() => [
    { type: 'happy' as EmotionType, emoji: '😊', label: t('emotions.moodTypes.happy') },
    { type: 'excited' as EmotionType, emoji: '🤩', label: t('emotions.moodTypes.excited') },
    { type: 'calm' as EmotionType, emoji: '😌', label: t('emotions.moodTypes.calm') },
    { type: 'sad' as EmotionType, emoji: '😔', label: t('emotions.moodTypes.sad') },
    { type: 'anxious' as EmotionType, emoji: '😰', label: t('emotions.moodTypes.anxious') },
    { type: 'angry' as EmotionType, emoji: '😠', label: t('emotions.moodTypes.angry') },
    { type: 'tired' as EmotionType, emoji: '😫', label: t('emotions.moodTypes.tired') },
  ], [t]);

  const factorOptions = useMemo(() => [
    t('emotions.factors.work'), 
    t('emotions.factors.study'), 
    t('emotions.factors.health'), 
    t('emotions.factors.relationship'), 
    t('emotions.factors.family'), 
    t('emotions.factors.finance'), 
    t('emotions.factors.personalGrowth')
  ], [t]);

  // 切换情绪
  const handleSelectEmotion = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };
  
  // 切换因素
  const toggleFactor = (factor: string) => {
    if (selectedFactors.includes(factor)) {
      setSelectedFactors(selectedFactors.filter(f => f !== factor));
    } else {
      setSelectedFactors([...selectedFactors, factor]);
    }
  };
  
  // 切换目标
  const toggleGoal = (goalId: string) => {
    if (selectedGoalIds.includes(goalId)) {
      setSelectedGoalIds(selectedGoalIds.filter(id => id !== goalId));
    } else {
      setSelectedGoalIds([...selectedGoalIds, goalId]);
    }
  };
  
  // 切换任务
  const toggleTask = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };
  
  // 保存情绪记录
  const handleSave = () => {
    const emotionRecord: Omit<EmotionRecord, 'id'> = {
      date,
      emotion: selectedEmotion,
      intensity,
      note,
      factors: selectedFactors,
      relatedGoals: selectedGoalIds.length > 0 ? selectedGoalIds : undefined,
      relatedTasks: selectedTaskIds.length > 0 ? selectedTaskIds : undefined,
    };
    
    onSave(emotionRecord);
    handleClose();
  };
  
  const handleClose = () => {
    if (!initialRecord) {
      setSelectedEmotion('calm');
      setIntensity(5);
      setNote('');
      setSelectedFactors([]);
      setSelectedGoalIds([]);
      setSelectedTaskIds([]);
      setDate(new Date().toISOString().split('T')[0]);
    }
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {initialRecord ? t('emotions.editRecord') : t('emotions.recordToday')}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('emotions.howDoYouFeel')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {emotionOptions.map(option => (
                <Paper
                  key={option.type}
                  elevation={selectedEmotion === option.type ? 3 : 1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    width: 80,
                    textAlign: 'center',
                    border: selectedEmotion === option.type ? '2px solid' : '1px solid',
                    borderColor: selectedEmotion === option.type ? 'primary.main' : 'divider',
                    bgcolor: selectedEmotion === option.type ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      bgcolor: selectedEmotion === option.type ? 'primary.light' : 'action.hover'
                    }
                  }}
                  onClick={() => handleSelectEmotion(option.type)}
                >
                  <Typography variant="h4" component="div" sx={{ mb: 0.5 }}>
                    {option.emoji}
                  </Typography>
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('emotions.intensity')}
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={intensity}
                onChange={(_, value) => setIntensity(value as number)}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">{t('emotions.intensityScale.weak')}</Typography>
                <Typography variant="body2" color="text.secondary">{t('emotions.intensityScale.strong')}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('emotions.relatedFactors')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {factorOptions.map(factor => (
                <Chip
                  key={factor}
                  label={factor}
                  clickable
                  color={selectedFactors.includes(factor) ? 'primary' : 'default'}
                  onClick={() => toggleFactor(factor)}
                  variant={selectedFactors.includes(factor) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {t('emotions.detailedDescription')}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder={t('emotions.descriptionPlaceholder')}
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              {t('emotions.date')}
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {goals.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                {t('emotions.relatedGoals')}
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List dense disablePadding>
                  {goals.map(goal => (
                    <ListItemButton
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      dense
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={selectedGoalIds.includes(goal.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography component="span" mr={1}>
                              {goal.icon || '🎯'}
                            </Typography>
                            <Typography variant="body2">
                              {goal.title}
                            </Typography>
                          </Box>
                        } 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
          
          {tasks.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                {t('emotions.relatedTasks')}
              </Typography>
              <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List dense disablePadding>
                  {tasks.map(task => (
                    <ListItemButton
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      dense
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={selectedTaskIds.includes(task.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={task.title} 
                        secondary={task.completed ? t('tasks.completed') : t('tasks.notCompleted')} 
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>
          {t('actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedEmotion || !note}
        >
          {t('actions.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmotionModal; 