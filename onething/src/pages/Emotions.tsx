import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useEmotionStore, EmotionRecord } from '../store/emotionStore';
import EmotionCard from '../components/emotion/EmotionCard';
import EmotionDetailModal from '../components/emotion/EmotionDetailModal';
import AddEmotionModal from '../components/emotion/AddEmotionModal';
import EmotionTrendChart from '../components/emotion/EmotionTrendChart';
import EmotionDistributionChart from '../components/emotion/EmotionDistributionChart';

const Emotions: React.FC = () => {
  const emotions = useEmotionStore(state => state.records);
  const addRecord = useEmotionStore(state => state.addRecord);
  const updateRecord = useEmotionStore(state => state.updateRecord);
  const removeRecord = useEmotionStore(state => state.removeRecord);
  const getRecordsByDateRange = useEmotionStore(state => state.getRecordsByDateRange);
  const getTrendsByPeriod = useEmotionStore(state => state.getTrendsByPeriod);
  const currentEmotion = useEmotionStore(state => state.currentEmotion);
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState<EmotionRecord[]>([]);
  const [trends, setTrends] = useState(getTrendsByPeriod(period));
  
  // 获取今天的日期
  const todayString = new Date().toISOString().split('T')[0];
  
  // 获取过去7天的日期
  const getLastWeekDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  };
  
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
  }, [period, emotions, getRecordsByDateRange, getTrendsByPeriod]);
  
  // 处理情绪记录点击
  const handleEmotionClick = (emotion: EmotionRecord) => {
    setSelectedEmotion(emotion);
  };
  
  // 处理关闭详情模态框
  const handleCloseDetailModal = () => {
    setSelectedEmotion(null);
  };
  
  // 处理打开编辑模态框
  const handleOpenEditModal = () => {
    setShowEditModal(true);
    setSelectedEmotion(null);
  };
  
  // 处理添加/更新情绪记录
  const handleSaveEmotion = (record: Omit<EmotionRecord, 'id'>) => {
    if (showEditModal && selectedEmotion) {
      updateRecord(selectedEmotion.id, record);
    } else {
      addRecord(record);
    }
    
    setShowAddModal(false);
    setShowEditModal(false);
  };
  
  // 获取最近的记录
  const recentRecords = emotions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
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
        
        <EmotionTrendChart trends={trends} period={period} />
      </div>

      <div className="card">
        <div className="card-title">情绪分析</div>
        
        <div className="flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-4">
            <div className="text-sm font-medium mb-2">情绪分布</div>
            <EmotionDistributionChart records={filteredRecords} />
          </div>
          
          <div className="w-full md:w-1/2 md:pl-4">
            <div className="text-sm font-medium mb-2">情绪洞察</div>
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              {currentEmotion ? (
                <div>
                  <p className="mb-2">今日主要情绪: <span className="font-medium">{
                    currentEmotion.emotion === 'happy' ? '开心😊' :
                    currentEmotion.emotion === 'excited' ? '兴奋🤩' :
                    currentEmotion.emotion === 'calm' ? '平静😌' :
                    currentEmotion.emotion === 'sad' ? '伤心😔' :
                    currentEmotion.emotion === 'anxious' ? '焦虑😰' :
                    currentEmotion.emotion === 'angry' ? '生气😠' :
                    currentEmotion.emotion === 'tired' ? '疲惫😫' : '其他'
                  }</span></p>
                  <p className="mb-2">情绪强度: <span className="font-medium">{currentEmotion.intensity}/10</span></p>
                  <p className="text-sm text-gray-600">{currentEmotion.note}</p>
                </div>
              ) : (
                <>
                  <p className="mb-2">您最近的情绪平均值: <span className="font-medium">{
                    filteredRecords.length > 0 
                      ? Math.round(filteredRecords.reduce((sum, r) => sum + r.intensity, 0) / filteredRecords.length * 10) / 10
                      : 0
                  }/10</span></p>
                  
                  {filteredRecords.length > 0 ? (
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">情绪分析:</p>
                      <ul className="list-disc pl-5">
                        <li>您本{period === 'week' ? '周' : period === 'month' ? '月' : '年'}记录了{filteredRecords.length}次情绪状态</li>
                        {filteredRecords.length >= 3 && (
                          <li>最常见的情绪是: {
                            (() => {
                              const emotionCounts = new Map<string, number>();
                              filteredRecords.forEach(r => {
                                const count = emotionCounts.get(r.emotion) || 0;
                                emotionCounts.set(r.emotion, count + 1);
                              });
                              let maxEmotion = '';
                              let maxCount = 0;
                              emotionCounts.forEach((count, emotion) => {
                                if (count > maxCount) {
                                  maxCount = count;
                                  maxEmotion = emotion;
                                }
                              });
                              
                              const emotionMap: Record<string, string> = {
                                'happy': '开心😊',
                                'excited': '兴奋🤩',
                                'calm': '平静😌',
                                'sad': '伤心😔',
                                'anxious': '焦虑😰',
                                'angry': '生气😠',
                                'tired': '疲惫😫'
                              };
                              
                              return emotionMap[maxEmotion] || '未知';
                            })()
                          }</li>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">暂无足够的情绪数据进行分析</p>
                  )}
                </>
              )}
            </div>
          </div>
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
        
        {recentRecords.length > 0 ? (
          recentRecords.map(emotion => (
            <EmotionCard 
              key={emotion.id} 
              record={emotion} 
              onClick={handleEmotionClick} 
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>暂无情绪记录</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => setShowAddModal(true)}
            >
              创建首个情绪记录
            </button>
          </div>
        )}
      </div>
      
      {/* 情绪详情模态框 */}
      {selectedEmotion && (
        <EmotionDetailModal 
          record={selectedEmotion} 
          onClose={handleCloseDetailModal}
          onEdit={handleOpenEditModal}
        />
      )}
      
      {/* 添加情绪模态框 */}
      {showAddModal && (
        <AddEmotionModal 
          onClose={() => setShowAddModal(false)} 
          onSave={handleSaveEmotion} 
        />
      )}
      
      {/* 编辑情绪模态框 */}
      {showEditModal && selectedEmotion && (
        <AddEmotionModal 
          onClose={() => setShowEditModal(false)} 
          onSave={handleSaveEmotion}
          initialRecord={selectedEmotion}
        />
      )}
    </AppLayout>
  );
};

export default Emotions; 