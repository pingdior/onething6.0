import React, { useState, useMemo } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, MenuItem, 
  Select, Box, Chip, Typography, IconButton, 
  CircularProgress, Alert, Stepper, Step, StepLabel,
  List, ListItem, ListItemIcon, ListItemText, Checkbox, 
  Paper, Divider, FormControlLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useGoalStore } from '../../store/goalStore';
import { autoBreakdownGoal } from '../../services/aiService';
import { useTranslation } from 'react-i18next';

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
}

// 可选的目标图标
const ICONS = ['🎯', '💪', '📚', '💼', '🏠', '🎨', '🌱', '💰', '🧠', '❤️'];

const AddGoalModal: React.FC<AddGoalModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  // 步骤控制
  const [activeStep, setActiveStep] = useState(0);
  const steps = useMemo(() => [
    t('addGoalModal.steps.defineGoal'), 
    t('addGoalModal.steps.aiBreakdown'), 
    t('addGoalModal.steps.confirmAndSave')
  ], [t]);
  
  // 目标信息
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [deadline, setDeadline] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  
  // AI分解的子目标
  const [subGoals, setSubGoals] = useState<{id: string; title: string; completed: boolean}[]>([]);
  
  // 状态控制
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [aiHelp, setAiHelp] = useState(true);
  
  const addGoal = useGoalStore(state => state.addGoal);
  
  // 重置表单
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDeadline('');
    setSelectedIcon('🎯');
    setSubGoals([]);
    setActiveStep(0);
    setErrorMessage('');
    setAiHelp(true);
  };
  
  // 关闭对话框
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // 处理下一步
  const handleNext = async () => {
    if (activeStep === 0) {
      // 验证第一步输入
      if (!title) {
        setErrorMessage(t('addGoalModal.error.missingTitle'));
        return;
      }
      if (!deadline) {
        setErrorMessage(t('addGoalModal.error.missingDeadline'));
        return;
      }
      
      setErrorMessage('');
      
      // 如果启用AI帮助，使用AI分解目标
      if (aiHelp) {
        await handleAIBreakdown();
      } else {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      // 验证是否有子目标
      if (subGoals.length === 0) {
        setErrorMessage(t('addGoalModal.error.noSubGoals'));
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      // 最后一步，保存并关闭
      handleSaveGoal();
    }
  };
  
  // 处理后退
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // 保存目标
  const handleSaveGoal = () => {
    addGoal({
      title,
      description,
      priority,
      deadline,
      completionRate: 0,
      icon: selectedIcon,
      subGoals
    });
    
    handleClose();
  };

  // AI自动分解目标函数
  const handleAIBreakdown = async () => {
    if (!title) {
      setErrorMessage(t('addGoalModal.error.missingTitleForAI'));
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const generatedSubGoals = await autoBreakdownGoal(title, description);
      setSubGoals(generatedSubGoals);
      
      setIsLoading(false);
      setActiveStep(1);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(t('addGoalModal.error.aiBreakdownFailed', { error: error.message }));
    }
  };
  
  // 手动添加子目标
  const handleAddSubGoal = () => {
    if (manualSubGoal.trim() === '') return;
    
    setSubGoals([
      ...subGoals, 
      { 
        id: `manual-${Date.now()}`, 
        title: manualSubGoal, 
        completed: false 
      }
    ]);
    setManualSubGoal('');
  };
  
  // 删除子目标
  const handleRemoveSubGoal = (id: string) => {
    setSubGoals(subGoals.filter(sg => sg.id !== id));
  };
  
  // 编辑子目标
  const [editingSubGoalId, setEditingSubGoalId] = useState<string | null>(null);
  const [editedSubGoalTitle, setEditedSubGoalTitle] = useState('');
  const [manualSubGoal, setManualSubGoal] = useState('');
  
  const startEditingSubGoal = (id: string, title: string) => {
    setEditingSubGoalId(id);
    setEditedSubGoalTitle(title);
  };
  
  const saveEditedSubGoal = () => {
    if (!editingSubGoalId || editedSubGoalTitle.trim() === '') return;
    
    setSubGoals(subGoals.map(sg => 
      sg.id === editingSubGoalId 
        ? { ...sg, title: editedSubGoalTitle }
        : sg
    ));
    
    setEditingSubGoalId(null);
    setEditedSubGoalTitle('');
  };
  
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 渲染步骤内容
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // 基本信息设置步骤
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('addGoalModal.labels.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              helperText={t('addGoalModal.helpers.title')}
            />
            
            <TextField
              fullWidth
              label={t('addGoalModal.labels.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              helperText={t('addGoalModal.helpers.description')}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>{t('addGoalModal.labels.priority')}</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  label={t('addGoalModal.labels.priority')}
                >
                  <MenuItem value="high">{t('goals.high')}</MenuItem>
                  <MenuItem value="medium">{t('goals.medium')}</MenuItem>
                  <MenuItem value="low">{t('goals.low')}</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label={t('addGoalModal.labels.deadline')}
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDate() }}
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('addGoalModal.labels.selectIcon')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ICONS.map((icon) => (
                  <Chip
                    key={icon}
                    label={icon}
                    onClick={() => setSelectedIcon(icon)}
                    sx={{
                      fontSize: '1.2rem',
                      bgcolor: selectedIcon === icon ? 'primary.light' : 'grey.100',
                      color: selectedIcon === icon ? 'primary.dark' : 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: selectedIcon === icon ? 'primary.light' : 'grey.200',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );
        
      case 1: // AI目标分解步骤
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedIcon} {title}
              <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '0.9rem' }}>
                ({t(`goals.priorityLabels.${priority}`)})
              </Typography>
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              {t('addGoalModal.labels.subGoalList')}
            </Typography>
            
            {/* 子目标列表 */}
            {subGoals.length > 0 ? (
              <Paper variant="outlined" sx={{ mb: 2 }}>
                <List dense disablePadding>
                  {subGoals.map((subGoal, index) => (
                    <ListItem
                      key={subGoal.id}
                      secondaryAction={
                        <IconButton edge="end" size="small" onClick={() => handleRemoveSubGoal(subGoal.id)}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      }
                      divider={index < subGoals.length - 1}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" color="text.secondary">
                          {index + 1}.
                        </Typography>
                      </ListItemIcon>
                      {editingSubGoalId === subGoal.id ? (
                        <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            value={editedSubGoalTitle}
                            onChange={(e) => setEditedSubGoalTitle(e.target.value)}
                            autoFocus
                          />
                          <Button size="small" onClick={saveEditedSubGoal}>保存</Button>
                        </Box>
                      ) : (
                        <ListItemText
                          primary={subGoal.title}
                          onClick={() => startEditingSubGoal(subGoal.id, subGoal.title)}
                          sx={{ cursor: 'pointer' }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>
                {t('addGoalModal.info.noSubGoals')}
              </Alert>
            )}
            
            {/* 添加子目标 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label={t('addGoalModal.labels.addSubGoal')}
                value={manualSubGoal}
                onChange={(e) => setManualSubGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubGoal()}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddSubGoal}
                disabled={!manualSubGoal.trim()}
              >
                {t('actions.add')}
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleAIBreakdown}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
                sx={{ mt: 1 }}
              >
                {isLoading ? t('addGoalModal.buttons.thinking') : t('addGoalModal.buttons.rebreakdown')}
              </Button>
            </Box>
            
            <Box sx={{ mt: 2, bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'info.dark' }}>
                {t('addGoalModal.info.aiHelperTitle')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.dark' }}>
                {t('addGoalModal.info.aiHelperDescription')}
              </Typography>
            </Box>
          </Box>
        );
        
      case 2: // 确认步骤
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('addGoalModal.labels.confirmGoalInfo')}
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="span">
                  {selectedIcon} {title}
                </Typography>
                <Chip 
                  label={t(`goals.priorityLabels.${priority}`)} 
                  size="small" 
                  color={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'info'}
                  sx={{ ml: 1 }}
                />
              </Box>
              
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {description}
                </Typography>
              )}
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {t('addGoalModal.labels.deadline')}: {new Date(deadline).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              {t('addGoalModal.labels.subGoalList')} ({subGoals.length})
            </Typography>
            
            <Paper variant="outlined" sx={{ mb: 2 }}>
              <List dense disablePadding>
                {subGoals.map((subGoal, index) => (
                  <ListItem key={subGoal.id} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Typography variant="body2" color="text.secondary">
                        {index + 1}.
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary={subGoal.title} />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            <Alert severity="success">
              {t('addGoalModal.info.goalSaved')}
            </Alert>
          </Box>
        );
        
      default:
        return null;
    }
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
            {t('addGoalModal.title')}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pb: 1 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 1, mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        {getStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <FormControlLabel 
          control={<Checkbox checked={aiHelp} onChange={(e) => setAiHelp(e.target.checked)} />} 
          label={t('addGoalModal.labels.useAiHelp')}
          disabled={activeStep > 0}
          sx={{ mr: 'auto' }}
        />
        
        <Button onClick={handleClose}>{t('actions.cancel')}</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>{t('actions.back')}</Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : (activeStep === steps.length - 1 ? t('actions.save') : t('addGoalModal.buttons.next'))}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoalModal; 