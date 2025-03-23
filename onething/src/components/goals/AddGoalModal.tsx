import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, MenuItem, 
  Select, Box, Chip, Typography, IconButton, 
  CircularProgress, Alert, Stepper, Step, StepLabel,
  List, ListItem, ListItemIcon, ListItemText, Checkbox, 
  Paper, Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useGoalStore } from '../../store/goalStore';
import { autoBreakdownGoal } from '../../services/aiService';

interface AddGoalModalProps {
  open: boolean;
  onClose: () => void;
}

// 可选的目标图标
const ICONS = ['🎯', '💪', '📚', '💼', '🏠', '🎨', '🌱', '💰', '🧠', '❤️'];

const AddGoalModal: React.FC<AddGoalModalProps> = ({ open, onClose }) => {
  // 步骤控制
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['设定目标', 'AI分解目标', '确认并保存'];
  
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
        setErrorMessage('请输入目标标题');
        return;
      }
      if (!deadline) {
        setErrorMessage('请选择截止日期');
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
        setErrorMessage('请至少添加一个子目标');
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
      setErrorMessage('请先输入目标名称');
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
      setErrorMessage(`自动分解目标失败: ${error.message}`);
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
              label="目标标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              helperText="请输入清晰、具体的目标标题"
            />
            
            <TextField
              fullWidth
              label="目标描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              helperText="描述你的目标细节，包括背景和期望达成的结果"
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>优先级</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                  label="优先级"
                >
                  <MenuItem value="high">高</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="low">低</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="截止日期"
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
                选择图标
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
                ({priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}优先级)
              </Typography>
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              子目标清单
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
                暂无子目标，请手动添加或使用AI自动分解
              </Alert>
            )}
            
            {/* 添加子目标 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="添加子目标"
                value={manualSubGoal}
                onChange={(e) => setManualSubGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubGoal()}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddSubGoal}
                disabled={!manualSubGoal.trim()}
              >
                添加
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
                {isLoading ? '正在思考...' : '让AI重新分解目标'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 2, bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'info.dark' }}>
                AI助手提示
              </Typography>
              <Typography variant="body2" sx={{ color: 'info.dark' }}>
                子目标应该是清晰可执行的小任务，每个子目标完成后，整体目标的进度会自动更新。
                你可以根据需要添加、删除或编辑AI生成的子目标。
              </Typography>
            </Box>
          </Box>
        );
        
      case 2: // 确认步骤
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              确认目标信息
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" component="span">
                  {selectedIcon} {title}
                </Typography>
                <Chip 
                  label={priority === 'high' ? '高优先级' : priority === 'medium' ? '中优先级' : '低优先级'} 
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
              
              <Typography variant="body2">
                截止日期：{new Date(deadline).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>
              子目标 ({subGoals.length})
            </Typography>
            
            <Paper variant="outlined" sx={{ mb: 2 }}>
              <List dense disablePadding>
                {subGoals.map((subGoal, index) => (
                  <ListItem key={subGoal.id} divider={index < subGoals.length - 1}>
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
              目标设置完成！点击"保存目标"按钮开始你的旅程。
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
            {activeStep === 0 ? '创建新目标' : 
             activeStep === 1 ? '分解目标' : 
             '确认目标'}
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
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            disabled={isLoading}
          >
            上一步
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        {activeStep === 0 && (
          <Button 
            onClick={() => setAiHelp(!aiHelp)}
            color="info"
            disabled={isLoading}
          >
            {aiHelp ? '✓ 使用AI辅助' : '❌ 不使用AI'}
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleNext}
          disabled={isLoading}
        >
          {activeStep === steps.length - 1 ? '保存目标' : '下一步'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGoalModal; 