// 目标类型定义
export interface Goal {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  progress: number;
  subgoals: SubGoal[];
}

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
}

// 任务类型定义
export interface Task {
  id: string;
  title: string;
  time?: string;
  source?: string;
  completed: boolean;
  goalId?: string;
}

// 情绪类型定义
export interface Emotion {
  id: string;
  type: 'happy' | 'calm' | 'sad' | 'angry' | 'anxious' | 'thoughtful';
  date: string;
  content?: string;
  intensity?: number;
} 