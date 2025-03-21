import { create } from 'zustand';
import { Task } from './taskStore';
import { Goal } from './goalStore';

export interface TimeSlot {
  hour: number;
  efficiency: number; // 0-10
}

export interface ReviewData {
  id: string;
  dateRange: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month' | 'custom';
  };
  
  overallProgress: {
    completionRate: number;
    totalTasks: number;
    completedTasks: number;
  };
  
  goalDetails: Array<{
    id: string;
    name: string;
    progress: number;
    completedItems: number;
    totalItems: number;
    timeSpent: number; // 分钟
  }>;
  
  timeAnalysis: {
    bestTimeSlots: TimeSlot[];
    averageEfficiency: number;
    interruptionCount: number;
  };
  
  insights: string[];
  recommendations: string[];
}

interface ReviewState {
  reviews: ReviewData[];
  currentReview: ReviewData | null;
  addReview: (review: Omit<ReviewData, 'id'>) => string;
  getReviewById: (id: string) => ReviewData | undefined;
  getReviewsByDateRange: (start: string, end: string) => ReviewData[];
  generateReview: (options: {
    startDate: string;
    endDate: string;
    type: 'day' | 'week' | 'month' | 'custom';
    goals: Goal[];
    tasks: Task[];
  }) => ReviewData;
}

const generateRandomInsights = (goals: Goal[], tasks: Task[]): string[] => {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  const insights: string[] = [];
  
  if (completedTasks.length > 0) {
    const completionRate = Math.round((completedTasks.length / tasks.length) * 100);
    insights.push(`本期任务完成率为${completionRate}%，共完成${completedTasks.length}个任务。`);
  }
  
  if (incompleteTasks.length > 0) {
    insights.push(`有${incompleteTasks.length}个任务未完成，建议检查任务安排是否合理。`);
  }
  
  const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high').length;
  if (highPriorityCompleted > 0) {
    insights.push(`完成了${highPriorityCompleted}个高优先级任务，很好地专注于重要事项。`);
  }
  
  const morningTasks = completedTasks.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour < 12;
  });
  
  const afternoonTasks = completedTasks.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour >= 12 && startHour < 18;
  });
  
  const eveningTasks = completedTasks.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour >= 18;
  });
  
  if (morningTasks.length > afternoonTasks.length && morningTasks.length > eveningTasks.length) {
    insights.push('上午是您的高效时段，完成了最多的任务。');
  } else if (afternoonTasks.length > morningTasks.length && afternoonTasks.length > eveningTasks.length) {
    insights.push('下午是您的高效时段，完成了最多的任务。');
  } else if (eveningTasks.length > morningTasks.length && eveningTasks.length > afternoonTasks.length) {
    insights.push('晚上是您的高效时段，完成了最多的任务。');
  }
  
  return insights;
};

const generateRandomRecommendations = (goals: Goal[], tasks: Task[]): string[] => {
  const recommendations: string[] = [];
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const highPriorityIncomplete = incompleteTasks.filter(task => task.priority === 'high');
  
  if (highPriorityIncomplete.length > 0) {
    recommendations.push(`优先处理${highPriorityIncomplete.length}个未完成的高优先级任务。`);
  }
  
  if (goals.some(goal => goal.completionRate < 50)) {
    recommendations.push('部分目标进度较慢，建议重新评估目标计划或分配更多资源。');
  }
  
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length > 0) {
    recommendations.push('合理安排休息时间，避免过度工作导致效率下降。');
  }
  
  recommendations.push('设置清晰的优先级，确保最重要的任务得到及时处理。');
  recommendations.push('每日进行简短复盘，及时调整计划和策略。');
  
  return recommendations;
};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [
    {
      id: '1',
      dateRange: {
        start: '2024-03-13',
        end: '2024-03-19',
        type: 'week'
      },
      overallProgress: {
        completionRate: 75,
        totalTasks: 12,
        completedTasks: 9
      },
      goalDetails: [
        {
          id: '1',
          name: '上线OneThing应用Web版本',
          progress: 62,
          completedItems: 2,
          totalItems: 6,
          timeSpent: 840
        },
        {
          id: '2',
          name: '减重5公斤',
          progress: 35,
          completedItems: 1,
          totalItems: 5,
          timeSpent: 420
        },
        {
          id: '3',
          name: '优化视频制作流程',
          progress: 52,
          completedItems: 2,
          totalItems: 5,
          timeSpent: 360
        }
      ],
      timeAnalysis: {
        bestTimeSlots: [
          { hour: 10, efficiency: 9 },
          { hour: 11, efficiency: 8 },
          { hour: 15, efficiency: 8 },
          { hour: 16, efficiency: 7 }
        ],
        averageEfficiency: 7.2,
        interruptionCount: 12
      },
      insights: [
        '本周完成了12个任务中的9个，完成率达到75%。',
        '上午10-12点是您最高效的工作时段。',
        '产品相关任务的完成质量高于平均水平。',
        '周三和周四的任务完成效率最高。',
        '习惯在下午3点后处理创意类任务。'
      ],
      recommendations: [
        '将重要任务安排在上午10-12点效率最高的时段。',
        '减少工作中的打断次数，可提高15%的效率。',
        '为"优化视频制作流程"目标分配更多资源。',
        '建议每天安排15-20分钟的反思时间。',
        '使用番茄工作法来提高专注度和效率。'
      ]
    }
  ],
  
  currentReview: null,
  
  addReview: (review) => {
    const id = Date.now().toString();
    const newReview = { ...review, id };
    
    set(state => ({
      reviews: [...state.reviews, newReview],
      currentReview: newReview
    }));
    
    return id;
  },
  
  getReviewById: (id) => {
    return get().reviews.find(review => review.id === id);
  },
  
  getReviewsByDateRange: (start, end) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    
    return get().reviews.filter(review => {
      const reviewStartDate = new Date(review.dateRange.start).getTime();
      const reviewEndDate = new Date(review.dateRange.end).getTime();
      
      return (
        (reviewStartDate >= startDate && reviewStartDate <= endDate) ||
        (reviewEndDate >= startDate && reviewEndDate <= endDate) ||
        (reviewStartDate <= startDate && reviewEndDate >= endDate)
      );
    });
  },
  
  generateReview: (options) => {
    const { startDate, endDate, type, goals, tasks } = options;
    
    const tasksInRange = tasks.filter(task => {
      // 简化处理，实际应考虑任务时间
      return true;
    });
    
    const completedTasks = tasksInRange.filter(task => task.completed);
    const completionRate = tasksInRange.length > 0 
      ? Math.round((completedTasks.length / tasksInRange.length) * 100)
      : 0;
    
    const goalDetails = goals.map(goal => {
      const goalTasks = tasksInRange.filter(task => task.goalId === goal.id);
      const completedGoalTasks = goalTasks.filter(task => task.completed);
      
      return {
        id: goal.id,
        name: goal.title,
        progress: goal.completionRate,
        completedItems: completedGoalTasks.length,
        totalItems: goalTasks.length,
        timeSpent: Math.round(goalTasks.length * 60) // 假设每个任务平均60分钟
      };
    });
    
    // 生成时间效率分析数据
    const timeAnalysis = {
      bestTimeSlots: [
        { hour: 10, efficiency: Math.floor(Math.random() * 3) + 7 },
        { hour: 14, efficiency: Math.floor(Math.random() * 3) + 7 },
        { hour: 16, efficiency: Math.floor(Math.random() * 3) + 6 },
      ],
      averageEfficiency: Math.round((Math.random() * 2 + 6) * 10) / 10,
      interruptionCount: Math.floor(Math.random() * 10) + 5
    };
    
    const insights = generateRandomInsights(goals, tasksInRange);
    const recommendations = generateRandomRecommendations(goals, tasksInRange);
    
    const review: ReviewData = {
      id: Date.now().toString(),
      dateRange: {
        start: startDate,
        end: endDate,
        type
      },
      overallProgress: {
        completionRate,
        totalTasks: tasksInRange.length,
        completedTasks: completedTasks.length
      },
      goalDetails,
      timeAnalysis,
      insights,
      recommendations
    };
    
    set(state => ({
      reviews: [...state.reviews, review],
      currentReview: review
    }));
    
    return review;
  }
})); 