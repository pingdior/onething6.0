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

  // 新增任务分析和SOP优化相关数据
  taskAnalysis?: {
    strengths: string[]; // 做得好的方面
    improvements: string[]; // 需要改进的方面
    detailedTasks: Array<{
      name: string;
      efficiency: 'high' | 'medium' | 'low'; // 效率评级
      rating: 1 | 2 | 3 | 4 | 5; // 星级评价
      analysis: string; // 分析文字
    }>;
  };
  
  sopRecommendations?: Array<{
    title: string; // SOP标题，如"学习任务优化流程"
    steps: string[]; // SOP步骤列表
  }>;
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
      ],
      // 新增任务分析和SOP优化示例数据
      taskAnalysis: {
        strengths: [
          '完成了所有计划任务',
          '专注度高，无干扰时间长',
          '合理安排了休息时间'
        ],
        improvements: [
          '早上效率较低',
          '频繁查看邮件和消息',
          '任务准备时间过长'
        ],
        detailedTasks: [
          {
            name: 'PMP章节学习',
            efficiency: 'high',
            rating: 4,
            analysis: '在14:00-16:00时间段内专注度高，完成了预期的125%。采用了番茄工作法，每25分钟休息5分钟的节奏非常适合你。'
          },
          {
            name: '团队周会',
            efficiency: 'medium',
            rating: 2,
            analysis: '会议时间超出计划30分钟，准备工作不充分。建议提前5-10分钟做好准备工作，并设置明确的会议议程和时间限制。'
          }
        ]
      },
      sopRecommendations: [
        {
          title: '学习任务优化流程',
          steps: [
            '调整到下午高效时段 (14:00-16:00)',
            '采用25/5的番茄工作法',
            '提前5分钟准备学习环境和材料',
            '学习前明确目标和要点',
            '每完成一个章节进行自测'
          ]
        },
        {
          title: '会议效率提升流程',
          steps: [
            '提前一天设置会议议程',
            '准备时间调整为会前10分钟',
            '设置议题时间限制并严格执行',
            '会议结束前5分钟总结决议和下一步行动',
            '会后立即记录关键点和待办事项'
          ]
        }
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
        timeSpent: Math.round(Math.random() * 500 + 100) // 模拟数据
      };
    });
    
    // 生成模拟的最佳时间段数据
    const bestTimeSlots: TimeSlot[] = [];
    for (let hour = 8; hour < 22; hour++) {
      const efficiency = Math.random() * 10;
      if (efficiency > 5) { // 只保留效率较高的时段
        bestTimeSlots.push({
          hour,
          efficiency: parseFloat(efficiency.toFixed(1))
        });
      }
    }
    
    // 生成洞察和建议
    const insights = generateRandomInsights(goals, tasks);
    const recommendations = generateRandomRecommendations(goals, tasks);

    // 生成任务分析数据
    const generateTaskAnalysis = () => {
      // 创建基本的优势和改进点
      const strengths = [
        '完成了所有计划任务',
        '专注度高，无干扰时间长',
        '合理安排了休息时间'
      ];
      
      const improvements = [
        '早上效率较低',
        '频繁查看邮件和消息',
        '任务准备时间过长'
      ];
      
      // 从任务中生成详细分析
      const detailedTasks = tasksInRange.slice(0, 3).map(task => {
        const isCompleted = task.completed;
        const efficiency = isCompleted ? 
          (Math.random() > 0.6 ? 'high' : 'medium') : 
          (Math.random() > 0.3 ? 'medium' : 'low');
        
        const rating = efficiency === 'high' ? 
          (Math.random() > 0.5 ? 5 : 4) : 
          efficiency === 'medium' ? 
            (Math.random() > 0.5 ? 3 : 2) : 
            1;
        
        const analyses = {
          high: [
            `在14:00-16:00时间段内专注度高，完成了预期的125%。采用的工作节奏非常适合你。`,
            `任务按计划完成，质量高于平均水平。积极主动解决了潜在问题。`,
            `高效利用了最佳工作时段，任务完成质量优秀，无需返工。`
          ],
          medium: [
            `完成了基本任务，但耗时略长于预期。期间有几次不必要的中断。`,
            `任务完成质量合格，但有改进空间。建议提前做好准备工作。`,
            `工作效率一般，有时出现注意力分散的情况。建议尝试番茄工作法提高专注度。`
          ],
          low: [
            `任务延期完成，期间频繁切换上下文。建议减少多任务处理，专注单一任务。`,
            `工作期间经常分心，效率较低。建议设置免打扰模式，减少干扰源。`,
            `准备不充分导致执行困难。建议提前规划任务步骤，做好充分准备。`
          ]
        };
        
        // 随机选择一个分析文本
        const analysisOptions = analyses[efficiency];
        const analysis = analysisOptions[Math.floor(Math.random() * analysisOptions.length)];
        
        return {
          name: task.title,
          efficiency: efficiency as 'high' | 'medium' | 'low',
          rating: rating as 1 | 2 | 3 | 4 | 5,
          analysis
        };
      });
      
      return {
        strengths,
        improvements,
        detailedTasks
      };
    };
    
    // 生成SOP建议
    const generateSopRecommendations = () => {
      const sopTemplates = [
        {
          title: '学习任务优化流程',
          steps: [
            '调整到高效时段 (14:00-16:00)',
            '采用25/5的番茄工作法',
            '提前5分钟准备学习环境和材料',
            '学习前明确目标和要点',
            '每完成一个章节进行自测'
          ]
        },
        {
          title: '会议效率提升流程',
          steps: [
            '提前一天设置会议议程',
            '准备时间调整为会前10分钟',
            '设置议题时间限制并严格执行',
            '会议结束前5分钟总结决议和下一步行动',
            '会后立即记录关键点和待办事项'
          ]
        },
        {
          title: '专注力提升SOP',
          steps: [
            '工作前清空桌面，只保留必要物品',
            '设置手机勿扰模式，关闭不必要通知',
            '使用白噪音或专注音乐营造环境',
            '每45-60分钟休息5-10分钟',
            '使用时间块技术，预先安排专注时段'
          ]
        }
      ];
      
      // 随机选择1-2个SOP返回
      const count = Math.floor(Math.random() * 2) + 1;
      const shuffled = [...sopTemplates].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    
    const newReview: ReviewData = {
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
      timeAnalysis: {
        bestTimeSlots,
        averageEfficiency: parseFloat((Math.random() * 3 + 5).toFixed(1)), // 5-8之间
        interruptionCount: Math.floor(Math.random() * 20 + 5) // 5-25之间
      },
      insights,
      recommendations,
      // 添加任务分析和SOP建议
      taskAnalysis: generateTaskAnalysis(),
      sopRecommendations: generateSopRecommendations()
    };
    
    // 添加到reviews列表并设置为当前review
    set(state => ({
      reviews: [...state.reviews, newReview],
      currentReview: newReview
    }));
    
    return newReview;
  }
})); 