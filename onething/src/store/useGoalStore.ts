// 替换文件的全部内容
import { create } from 'zustand'; // 注意：使用命名导入，不是默认导入

// 定义完整的类型
interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  progress: number;
  subgoals: SubGoal[];
}

interface GoalState {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'subgoals'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addSubGoal: (goalId: string, subgoal: Omit<SubGoal, 'id'>) => Promise<void>;
  toggleSubGoal: (goalId: string, subgoalId: string) => Promise<void>;
}

// 模拟数据
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'PMP认证',
    priority: 'high',
    deadline: '2024-06-30',
    progress: 68,
    subgoals: [
      { id: '1-1', title: 'PMBOK第1章', completed: true },
      { id: '1-2', title: 'PMBOK第2章', completed: true },
      { id: '1-3', title: 'PMBOK第3章', completed: true },
      { id: '1-4', title: 'PMBOK第4章', completed: true },
      { id: '1-5', title: 'PMBOK第5章', completed: false },
      { id: '1-6', title: 'PMBOK第6章', completed: false },
    ]
  },
  {
    id: '2',
    title: '健身计划',
    priority: 'medium',
    deadline: '2024-12-31',
    progress: 45,
    subgoals: [
      { id: '2-1', title: '减重5kg', completed: false },
      { id: '2-2', title: '每周3次训练', completed: true },
      { id: '2-3', title: '增肌计划', completed: false },
    ]
  }
];

// 创建store，使用正确的语法
const useGoalStore = create<GoalState>()((set) => ({
  goals: [],
  loading: false,
  error: null,
  
  fetchGoals: async () => {
    set({ loading: true });
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ goals: mockGoals, loading: false });
    } catch (error) {
      // 修复错误处理
      set({ 
        error: error instanceof Error ? error.message : '未知错误', 
        loading: false 
      });
    }
  },
  
  addGoal: async (goal: Omit<Goal, 'id' | 'progress' | 'subgoals'>) => {
    set({ loading: true });
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString(),
        progress: 0,
        subgoals: []
      };
      set((state: GoalState) => ({ 
        goals: [...state.goals, newGoal],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '未知错误', 
        loading: false 
      });
    }
  },
  
  updateGoal: async (id: string, updates: Partial<Goal>) => {
    set((state: GoalState) => ({
      goals: state.goals.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));
  },
  
  deleteGoal: async (id: string) => {
    set((state: GoalState) => ({
      goals: state.goals.filter(goal => goal.id !== id)
    }));
  },
  
  addSubGoal: async (goalId: string, subgoal: Omit<SubGoal, 'id'>) => {
    set((state: GoalState) => ({
      goals: state.goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subgoals: [
              ...goal.subgoals,
              { id: Date.now().toString(), ...subgoal }
            ]
          };
        }
        return goal;
      })
    }));
  },
  
  toggleSubGoal: async (goalId: string, subgoalId: string) => {
    set((state: GoalState) => ({
      goals: state.goals.map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subgoals: goal.subgoals.map(sg => 
              sg.id === subgoalId ? { ...sg, completed: !sg.completed } : sg
            )
          };
        }
        return goal;
      })
    }));
  }
}));

export default useGoalStore;