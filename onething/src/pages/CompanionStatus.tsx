import React, { useState } from 'react';
import { 
  Box, Typography, IconButton, Paper, Avatar, Divider, 
  LinearProgress, Chip, List, ListItem, ListItemText, ListItemIcon 
} from '@mui/material';
import { 
  ArrowBack, SmartToy, AutoAwesome, History, 
  Psychology, FormatQuote, EmojiEvents
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { isMobile } from '../i18n';

const CompanionStatus: React.FC = () => {
  const navigate = useNavigate();
  const isOnMobile = isMobile();
  
  // 模拟AI伴侣数据
  const [companion] = useState({
    name: 'AI助手',
    level: 3,
    experience: 65,
    personality: ['温暖', '鼓励型', '理性'],
    specialties: ['目标分解', '情绪分析', '时间管理'],
    nextLevel: 4,
    nextLevelName: '战略顾问',
    unlockedAbilities: [
      { name: '深度目标分析', description: '能够分析目标的可行性和挑战' },
      { name: '个性化任务建议', description: '根据你的习惯和偏好推荐任务安排' },
      { name: '基础情绪支持', description: '识别情绪波动并提供支持' },
    ],
    nextAbilities: [
      { name: '复杂目标协调', description: '协调多个相互影响的目标' },
      { name: '认知模式分析', description: '识别思维模式并优化决策过程' },
    ],
    memories: [
      { type: 'milestone', content: '首次设定PMP目标', date: '2024-03-10' },
      { type: 'milestone', content: '克服学习瓶颈', date: '2024-03-15' },
      { type: 'milestone', content: '完成周计划', date: '2024-03-18' },
    ],
    topics: ['学习进度', '时间管理', '目标设定', '情绪调节'],
    interactionDays: 12,
  });
  
  const handleBack = () => {
    navigate(-1);
  };
  
  // 计算到下一级所需的经验值百分比
  const experiencePercentage = companion.experience;
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <AppLayout>
      <Box sx={{ 
        height: 'calc(100vh - 120px)',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#F3F4F6',
        ...(isOnMobile ? { 
          p: 0,
          height: 'calc(100vh - 116px)',
        } : {})
      }}>
        {/* 顶部导航栏 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          bgcolor: 'white'
        }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            伙伴资料
          </Typography>
        </Box>
        
        {/* 主要内容区域 */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          p: 2
        }}>
          {/* 伙伴基本信息卡片 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: '#4ECDC4',
                  mr: 2
                }}
              >
                <SmartToy sx={{ fontSize: 36 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {companion.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Chip 
                    size="small" 
                    label={`Lv.${companion.level}`} 
                    sx={{ 
                      bgcolor: '#4ECDC4',
                      color: 'white',
                      fontWeight: 500,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {companion.interactionDays}天互动
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                成长进度: {companion.experience}% 到 Lv.{companion.nextLevel} ({companion.nextLevelName})
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={experiencePercentage} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(0,0,0,0.05)'
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ width: '100%', mb: 0.5 }}>
                专长:
              </Typography>
              {companion.specialties.map((specialty, index) => (
                <Chip 
                  key={index}
                  label={specialty} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(78, 205, 196, 0.1)',
                    color: '#4ECDC4',
                    border: '1px solid rgba(78, 205, 196, 0.3)'
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ width: '100%', mb: 0.5 }}>
                性格特质:
              </Typography>
              {companion.personality.map((trait, index) => (
                <Chip 
                  key={index}
                  label={trait} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(147, 112, 219, 0.1)',
                    color: '#9370DB',
                    border: '1px solid rgba(147, 112, 219, 0.3)'
                  }}
                />
              ))}
            </Box>
          </Paper>
          
          {/* 解锁能力卡片 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesome sx={{ mr: 1, color: '#4ECDC4' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                已解锁能力
              </Typography>
            </Box>
            
            <List disablePadding>
              {companion.unlockedAbilities.map((ability, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Psychology sx={{ color: '#4ECDC4' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={ability.name}
                      secondary={ability.description}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
              下一级解锁:
            </Typography>
            
            <List disablePadding>
              {companion.nextAbilities.map((ability, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1, opacity: 0.6 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Psychology sx={{ color: '#9370DB' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={ability.name}
                    secondary={ability.description}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {/* 互动记忆卡片 */}
          <Paper sx={{ 
            p: 3, 
            mb: 2, 
            borderRadius: 2,
            bgcolor: 'white'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <History sx={{ mr: 1, color: '#4ECDC4' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                互动记忆
              </Typography>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              重要时刻:
            </Typography>
            
            <List disablePadding>
              {companion.memories.map((memory, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EmojiEvents sx={{ color: '#FFB054' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={memory.content}
                    secondary={formatDate(memory.date)}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              常见话题:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {companion.topics.map((topic, index) => (
                <Chip 
                  key={index}
                  icon={<FormatQuote fontSize="small" />}
                  label={topic} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(78, 205, 196, 0.1)',
                    color: '#4ECDC4',
                    border: '1px solid rgba(78, 205, 196, 0.3)'
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </AppLayout>
  );
};

export default CompanionStatus; 