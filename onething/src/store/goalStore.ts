import { create } from 'zustand';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string; // ISO格式日期字符串
  completionRate: number; // 0-100
  subGoals?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  icon?: string; // 图标表情符号
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => string;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id'>>) => void;
  removeGoal: (id: string) => void;
  updateCompletionRate: (id: string, rate: number) => void;
  addSubGoal: (goalId: string, subGoal: {title: string; completed: boolean}) => void;
  toggleSubGoalCompletion: (goalId: string, subGoalId: string) => void;
  getGoals: () => Goal[];
  getGoalById: (id: string) => Goal | undefined;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [
    {
      id: '1',
      title: '上线OneThing应用Web版本',
      description: '完成OneThing应用开发并发布到ProductHunt平台',
      priority: 'high',
      deadline: '2024-04-15',
      completionRate: 75,
      icon: '🚀',
      subGoals: [
        { id: '1-1', title: '完成核心功能开发', completed: true },
        { id: '1-2', title: '完成UI/UX优化', completed: true },
        { id: '1-3', title: '编写产品介绍文案', completed: true },
        { id: '1-4', title: '准备ProductHunt发布材料', completed: false },
        { id: '1-5', title: '发布到ProductHunt', completed: false },
        { id: '1-6', title: '收集用户反馈并迭代', completed: false },
      ]
    },
    {
      id: '2',
      title: '减重5公斤',
      description: '通过健康饮食和运动达到减重目标',
      priority: 'medium',
      deadline: '2024-05-30',
      completionRate: 40,
      icon: '💪',
      subGoals: [
        { id: '2-1', title: '制定健康饮食计划', completed: true },
        { id: '2-2', title: '每周运动3-4次', completed: true },
        { id: '2-3', title: '减重2公斤', completed: false },
        { id: '2-4', title: '减重3.5公斤', completed: false },
        { id: '2-5', title: '达到目标体重', completed: false },
      ]
    },
    {
      id: '3',
      title: '优化视频制作流程',
      description: '将视频制作时间从文案到发布控制在3小时内',
      priority: 'high',
      deadline: '2024-04-22',
      completionRate: 60,
      icon: '🎬',
      subGoals: [
        { id: '3-1', title: '梳理现有视频制作流程', completed: true },
        { id: '3-2', title: '建立文案模板库', completed: true },
        { id: '3-3', title: '优化拍摄和剪辑流程', completed: true },
        { id: '3-4', title: '设置发布自动化脚本', completed: false },
        { id: '3-5', title: '测试完整流程时间控制', completed: false },
      ]
    }
  ],

  addGoal: (goal) => {
    const id = Date.now().toString();
    set((state) => ({
      goals: [...state.goals, { ...goal, id }]
    }));
    return id;
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));
  },

  removeGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter(goal => goal.id !== id)
    }));
  },

  updateCompletionRate: (id, rate) => {
    set((state) => ({
      goals: state.goals.map(goal => 
        goal.id === id ? { ...goal, completionRate: rate } : goal
      )
    }));
  },

  addSubGoal: (goalId, subGoal) => {
    set((state) => ({
      goals: state.goals.map(goal => {
        if (goal.id !== goalId) return goal;
        
        const newSubGoals = [...(goal.subGoals || [])];
        newSubGoals.push({
          id: `${goalId}-${newSubGoals.length + 1}`,
          title: subGoal.title,
          completed: subGoal.completed
        });
        
        return {
          ...goal,
          subGoals: newSubGoals
        };
      })
    }));
  },

  toggleSubGoalCompletion: (goalId, subGoalId) => {
    set((state) => ({
      goals: state.goals.map(goal => {
        if (goal.id !== goalId || !goal.subGoals) return goal;
        
        const updatedSubGoals = goal.subGoals.map(subGoal => 
          subGoal.id === subGoalId 
            ? { ...subGoal, completed: !subGoal.completed } 
            : subGoal
        );
        
        // 更新完成率
        const completedCount = updatedSubGoals.filter(sg => sg.completed).length;
        const totalCount = updatedSubGoals.length;
        const newCompletionRate = Math.round((completedCount / totalCount) * 100);
        
        return {
          ...goal,
          subGoals: updatedSubGoals,
          completionRate: newCompletionRate
        };
      })
    }));
  },

  getGoals: () => get().goals,
  
  getGoalById: (id) => get().goals.find(goal => goal.id === id),
})); 