import { create } from 'zustand';

export type EmotionType = 'happy' | 'excited' | 'calm' | 'sad' | 'anxious' | 'angry' | 'tired';

export interface EmotionRecord {
  id: string;
  date: string; // ISO格式日期字符串
  emotion: EmotionType;
  intensity: number; // 1-10
  note: string;
  factors?: string[]; // 影响因素
  relatedGoals?: string[]; // 关联的目标ID
  relatedTasks?: string[]; // 关联的任务ID
}

export interface EmotionTrend {
  date: string;
  averageIntensity: number;
  dominantEmotion: EmotionType;
}

interface EmotionState {
  records: EmotionRecord[];
  currentEmotion: EmotionRecord | null;
  trends: EmotionTrend[];
  
  // 操作方法
  addRecord: (record: Omit<EmotionRecord, 'id'>) => string;
  updateRecord: (id: string, updates: Partial<Omit<EmotionRecord, 'id'>>) => void;
  removeRecord: (id: string) => void;
  getRecordsByDateRange: (startDate: string, endDate: string) => EmotionRecord[];
  getTrendsByPeriod: (period: 'week' | 'month' | 'year') => EmotionTrend[];
  getDominantEmotion: (period?: 'day' | 'week' | 'month') => EmotionType | null;
  getEmotionIntensity: (period?: 'day' | 'week' | 'month') => number;
}

// 获取今天的日期字符串
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 获取过去N天的日期字符串
const getPastDaysString = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// 模拟数据生成器
const generateSampleEmotionRecords = (): EmotionRecord[] => {
  const emotions: EmotionType[] = ['happy', 'excited', 'calm', 'sad', 'anxious', 'angry', 'tired'];
  const records: EmotionRecord[] = [];
  
  // 生成过去14天的情绪记录
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.floor(Math.random() * 5) + 5; // 5-10之间
    
    let note = '';
    switch (emotion) {
      case 'happy':
        note = '今天完成了重要任务，感觉很有成就感。';
        break;
      case 'excited':
        note = '有新的想法和灵感，迫不及待想要实现它。';
        break;
      case 'calm':
        note = '平静地完成了日常工作，感觉很平衡。';
        break;
      case 'sad':
        note = '今天有些失落，可能是因为项目进展不顺利。';
        break;
      case 'anxious':
        note = '对即将到来的截止日期感到有些焦虑。';
        break;
      case 'angry':
        note = '遇到了一些困难问题，感到有些烦躁。';
        break;
      case 'tired':
        note = '今天工作强度有点大，感觉很疲惫。';
        break;
    }
    
    records.push({
      id: `emotion-${i + 1}`,
      date: date.toISOString().split('T')[0],
      emotion,
      intensity,
      note,
      factors: [['工作', '健康', '人际关系'][Math.floor(Math.random() * 3)]],
      relatedGoals: i % 3 === 0 ? ['1'] : i % 3 === 1 ? ['2'] : ['3'],
      relatedTasks: [(i % 7 + 1).toString()]
    });
  }
  
  return records;
};

// 生成情绪趋势数据
const generateEmotionTrends = (records: EmotionRecord[]): EmotionTrend[] => {
  const trends: EmotionTrend[] = [];
  const dateMap = new Map<string, EmotionRecord[]>();
  
  // 按日期分组
  records.forEach(record => {
    if (!dateMap.has(record.date)) {
      dateMap.set(record.date, []);
    }
    dateMap.get(record.date)?.push(record);
  });
  
  // 计算每天的平均强度和主导情绪
  dateMap.forEach((dayRecords, date) => {
    const totalIntensity = dayRecords.reduce((sum, record) => sum + record.intensity, 0);
    const avgIntensity = totalIntensity / dayRecords.length;
    
    // 统计情绪出现次数
    const emotionCounts = new Map<EmotionType, number>();
    dayRecords.forEach(record => {
      const count = emotionCounts.get(record.emotion) || 0;
      emotionCounts.set(record.emotion, count + 1);
    });
    
    // 找出出现次数最多的情绪
    let dominantEmotion: EmotionType = 'calm';
    let maxCount = 0;
    
    emotionCounts.forEach((count, emotion) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion;
      }
    });
    
    trends.push({
      date,
      averageIntensity: avgIntensity,
      dominantEmotion
    });
  });
  
  // 按日期排序
  return trends.sort((a, b) => a.date.localeCompare(b.date));
};

export const useEmotionStore = create<EmotionState>((set, get) => {
  // 生成初始样本数据
  const sampleRecords = generateSampleEmotionRecords();
  const sampleTrends = generateEmotionTrends(sampleRecords);
  
  return {
    records: sampleRecords,
    currentEmotion: sampleRecords.find(r => r.date === getTodayString()) || null,
    trends: sampleTrends,
    
    addRecord: (record) => {
      const id = Date.now().toString();
      const newRecord = { ...record, id };
      
      set(state => {
        const newRecords = [...state.records, newRecord];
        return {
          records: newRecords,
          currentEmotion: record.date === getTodayString() ? newRecord : state.currentEmotion,
          trends: generateEmotionTrends(newRecords)
        };
      });
      
      return id;
    },
    
    updateRecord: (id, updates) => {
      set(state => {
        const updatedRecords = state.records.map(record => 
          record.id === id ? { ...record, ...updates } : record
        );
        
        return {
          records: updatedRecords,
          currentEmotion: state.currentEmotion?.id === id 
            ? { ...state.currentEmotion, ...updates } 
            : state.currentEmotion,
          trends: generateEmotionTrends(updatedRecords)
        };
      });
    },
    
    removeRecord: (id) => {
      set(state => {
        const filteredRecords = state.records.filter(record => record.id !== id);
        
        return {
          records: filteredRecords,
          currentEmotion: state.currentEmotion?.id === id 
            ? null 
            : state.currentEmotion,
          trends: generateEmotionTrends(filteredRecords)
        };
      });
    },
    
    getRecordsByDateRange: (startDate, endDate) => {
      return get().records.filter(record => {
        return record.date >= startDate && record.date <= endDate;
      });
    },
    
    getTrendsByPeriod: (period) => {
      const today = getTodayString();
      let startDate: string;
      
      switch (period) {
        case 'week':
          startDate = getPastDaysString(7);
          break;
        case 'month':
          startDate = getPastDaysString(30);
          break;
        case 'year':
          startDate = getPastDaysString(365);
          break;
      }
      
      return get().trends.filter(trend => 
        trend.date >= startDate && trend.date <= today
      );
    },
    
    getDominantEmotion: (period = 'day') => {
      let filteredRecords: EmotionRecord[];
      const today = getTodayString();
      
      switch (period) {
        case 'day':
          filteredRecords = get().records.filter(r => r.date === today);
          break;
        case 'week':
          filteredRecords = get().getRecordsByDateRange(getPastDaysString(7), today);
          break;
        case 'month':
          filteredRecords = get().getRecordsByDateRange(getPastDaysString(30), today);
          break;
        default:
          filteredRecords = get().records.filter(r => r.date === today);
      }
      
      if (filteredRecords.length === 0) return null;
      
      // 计算每种情绪的出现次数
      const emotionCounts = new Map<EmotionType, number>();
      filteredRecords.forEach(record => {
        const count = emotionCounts.get(record.emotion) || 0;
        emotionCounts.set(record.emotion, count + 1);
      });
      
      // 找出最常见的情绪
      let dominantEmotion: EmotionType = 'calm';
      let maxCount = 0;
      
      emotionCounts.forEach((count, emotion) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      });
      
      return dominantEmotion;
    },
    
    getEmotionIntensity: (period = 'day') => {
      let filteredRecords: EmotionRecord[];
      const today = getTodayString();
      
      switch (period) {
        case 'day':
          filteredRecords = get().records.filter(r => r.date === today);
          break;
        case 'week':
          filteredRecords = get().getRecordsByDateRange(getPastDaysString(7), today);
          break;
        case 'month':
          filteredRecords = get().getRecordsByDateRange(getPastDaysString(30), today);
          break;
        default:
          filteredRecords = get().records.filter(r => r.date === today);
      }
      
      if (filteredRecords.length === 0) return 0;
      
      // 计算平均强度
      const totalIntensity = filteredRecords.reduce((sum, record) => sum + record.intensity, 0);
      return Math.round((totalIntensity / filteredRecords.length) * 10) / 10;
    }
  };
}); 