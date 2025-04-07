import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Divider, LinearProgress, Button } from '@mui/material';
import AppLayout from '../components/layout/AppLayout';
import DashboardComponent from '../components/dashboard/Dashboard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobile } from '../i18n'; // 导入isMobile函数

// 为GoalsSummarySection组件添加类型定义
interface Goal {
  id: string;
  title: string;
  progress: number;
}

// 完全移除目标摘要部分或设置为不可见
/* 旧代码保留为注释
const GoalsSummarySection = () => {
  const { t } = useTranslation();
  // 使用示例目标数据或从您的状态管理获取
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'PMP认证', progress: 68 },
    { id: '2', title: '健身计划', progress: 45 }
  ]); 
  
  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A535C' }}>
            {t('goals.summary')}
          </Typography>
          <Link to="/goals" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" sx={{ color: '#4ECDC4' }}>
              {t('common.viewAll')}
            </Typography>
          </Link>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {goals.length > 0 ? (
          goals.map(goal => (
            <Box key={goal.id} sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{goal.title}</Typography>
                <Typography variant="body2" sx={{ color: '#4ECDC4' }}>{goal.progress}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={goal.progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  mt: 0.5,
                  bgcolor: 'rgba(0,0,0,0.05)' 
                }} 
              />
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('goals.noGoals')}
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              component={Link} 
              to="/goals"
              sx={{ mt: 1 }}
            >
              {t('goals.createFirst')}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
*/

const Dashboard: React.FC = () => {
  const { t } = useTranslation(); // 添加翻译函数
  
  return (
    <AppLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#1A535C', 
            mb: 3 
          }}
        >
          {t('nav.dashboard')}
        </Typography>
        
        <Box sx={{ flex: 1 }}>
          <DashboardComponent />
          {/* 完全移除目标摘要部分 */}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default Dashboard; 