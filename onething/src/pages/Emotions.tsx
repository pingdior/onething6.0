import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useEmotionStore, EmotionRecord } from '../store/emotionStore';
import EmotionCard from '../components/emotion/EmotionCard';
import EmotionDetailModal from '../components/emotion/EmotionDetailModal';
import AddEmotionModal from '../components/emotion/AddEmotionModal';
import EmotionTrendChart from '../components/emotion/EmotionTrendChart';
import EmotionDistributionChart from '../components/emotion/EmotionDistributionChart';
import { Box, Typography, Button, Paper, Grid, useTheme } from '@mui/material';

const Emotions: React.FC = () => {
  const theme = useTheme();
  const emotions = useEmotionStore(state => state.records);
  const addRecord = useEmotionStore(state => state.addRecord);
  const updateRecord = useEmotionStore(state => state.updateRecord);
  const removeRecord = useEmotionStore(state => state.removeRecord);
  const getRecordsByDateRange = useEmotionStore(state => state.getRecordsByDateRange);
  const getTrendsByPeriod = useEmotionStore(state => state.getTrendsByPeriod);
  const currentEmotion = useEmotionStore(state => state.currentEmotion);
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionRecord | undefined>(undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState<EmotionRecord[]>([]);
  const [trends, setTrends] = useState(getTrendsByPeriod(period));
  
  // 获取今天的日期
  const todayString = new Date().toISOString().split('T')[0];
  
  // 根据周期过滤记录
  useEffect(() => {
    let startDate = '';
    const endDate = todayString;
    
    if (period === 'week') {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      startDate = date.toISOString().split('T')[0];
    } else if (period === 'month') {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      startDate = date.toISOString().split('T')[0];
    } else {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      startDate = date.toISOString().split('T')[0];
    }
    
    setFilteredRecords(getRecordsByDateRange(startDate, endDate));
    setTrends(getTrendsByPeriod(period));
  }, [period, emotions, getRecordsByDateRange, getTrendsByPeriod, todayString]);
  
  // 处理情绪记录点击
  const handleEmotionClick = (emotion: EmotionRecord) => {
    setSelectedEmotion(emotion);
    setShowDetailModal(true);
  };
  
  // 处理关闭详情模态框
  const handleCloseDetailModal = () => {
    setSelectedEmotion(undefined);
    setShowDetailModal(false);
  };
  
  // 处理添加/更新情绪记录
  const handleSaveEmotion = (record: Omit<EmotionRecord, 'id'>) => {
    if (selectedEmotion) {
      updateRecord(selectedEmotion.id, record);
    } else {
      addRecord(record);
    }
    
    setShowAddModal(false);
  };
  
  // 获取最近的记录
  const recentRecords = emotions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // 获取情绪类型对应的表情和颜色
  const getEmotionIcon = (type: string): string => {
    switch(type) {
      case 'happy': return '😊';
      case 'excited': return '🤩';
      case 'calm': return '😌';
      case 'sad': return '😔';
      case 'anxious': return '😰';
      case 'angry': return '😠';
      case 'tired': return '😫';
      default: return '😐';
    }
  };
  
  const getEmotionColor = (type: string): string => {
    switch(type) {
      case 'happy': return '#4BD0A0';
      case 'excited': return '#7C6BFF';
      case 'calm': return '#4ECDC4';
      case 'sad': return '#6B7280';
      case 'anxious': return '#FFB054';
      case 'angry': return '#FF6B6B';
      case 'tired': return '#9CA3AF';
      default: return '#6B7280';
    }
  };
  
  const getEmotionName = (type: string): string => {
    switch(type) {
      case 'happy': return '开心';
      case 'excited': return '兴奋';
      case 'calm': return '平静';
      case 'sad': return '伤心';
      case 'anxious': return '焦虑';
      case 'angry': return '生气';
      case 'tired': return '疲惫';
      default: return '其他';
    }
  };
  
  // 获取当前情绪分布百分比
  const getEmotionDistribution = () => {
    if (filteredRecords.length === 0) return [];

    const emotionCounts = new Map<string, number>();
    filteredRecords.forEach(record => {
      const count = emotionCounts.get(record.emotion) || 0;
      emotionCounts.set(record.emotion, count + 1);
    });

    const total = filteredRecords.length;
    const result: {emotion: string, percentage: number}[] = [];

    emotionCounts.forEach((count, emotion) => {
      result.push({
        emotion,
        percentage: Math.round((count / total) * 100)
      });
    });

    return result.sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  };
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>情绪趋势</span>
          <div>
            <button 
              className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-secondary'} mr-2`}
              onClick={() => setPeriod('week')}
            >
              周
            </button>
            <button 
              className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-secondary'} mr-2`}
              onClick={() => setPeriod('month')}
            >
              月
            </button>
            <button 
              className={`btn btn-sm ${period === 'year' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriod('year')}
            >
              年
            </button>
          </div>
        </div>
        <div className="emotion-trend">
          <EmotionTrendChart trends={trends} period={period} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">情绪记录</div>
        <div>
          今天的情绪：{currentEmotion ? getEmotionIcon(currentEmotion.emotion) : '😐'}
        </div>
        <div style={{ margin: '1rem 0' }}>近期情绪分布：</div>
        <div className="emotion-distribution">
          <EmotionDistributionChart records={filteredRecords} />
        </div>
        <div className="text-sm text-gray">
          {getEmotionDistribution().map(item => (
            <span key={item.emotion}>
              {getEmotionIcon(item.emotion)} {item.percentage}% {' '}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>情绪日记</span>
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + 记录今日情绪
          </button>
        </div>
        
        {recentRecords.map(emotion => (
          <div key={emotion.id} className="emotion-journal-item" onClick={() => handleEmotionClick(emotion)}>
            <div className="journal-date">
              {new Date(emotion.date).toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric'
              })} - {getEmotionIcon(emotion.emotion)} {getEmotionName(emotion.emotion)}
            </div>
            <div className="journal-content">
              {emotion.note}
            </div>
          </div>
        ))}
        
        {recentRecords.length === 0 && (
          <div className="text-sm text-gray-500 p-4">暂无情绪记录</div>
        )}
      </div>

      {/* 添加情绪记录模态框 */}
      <AddEmotionModal
        open={showAddModal}
        onSave={handleSaveEmotion}
        onClose={() => setShowAddModal(false)}
        initialRecord={selectedEmotion}
      />

      {/* 情绪详情模态框 */}
      {showDetailModal && selectedEmotion && (
        <EmotionDetailModal
          record={selectedEmotion}
          onClose={handleCloseDetailModal}
          onEdit={() => {
            setShowDetailModal(false);
            setShowAddModal(true);
          }}
          onDelete={() => {
            removeRecord(selectedEmotion.id);
            handleCloseDetailModal();
          }}
        />
      )}
    </AppLayout>
  );
};

export default Emotions; 