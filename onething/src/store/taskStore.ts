import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  goalId?: string;
  goalName?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  timeRange?: {
    start: string;
    end: string;
  };
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => string;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: '优化OneThing应用UI',
      time: '9:00-11:00',
      completed: true,
      goalId: '1',
      goalName: '上线OneThing应用Web版本',
      priority: 'high',
      timeRange: {
        start: '9:00',
        end: '11:00'
      }
    },
    {
      id: '2',
      title: '编写ProductHunt发布材料',
      time: '11:00-12:30',
      completed: false,
      goalId: '1',
      goalName: '上线OneThing应用Web版本',
      priority: 'high',
      timeRange: {
        start: '11:00',
        end: '12:30'
      }
    },
    {
      id: '3',
      title: '回复产品合作邮件',
      time: '13:00-14:00',
      completed: true,
      priority: 'medium',
      timeRange: {
        start: '13:00',
        end: '14:00'
      }
    },
    {
      id: '4',
      title: '有氧运动45分钟',
      time: '15:00-16:00',
      completed: false,
      goalId: '2',
      goalName: '减重5公斤',
      priority: 'medium',
      timeRange: {
        start: '15:00',
        end: '16:00'
      }
    },
    {
      id: '5',
      title: '测试视频制作自动化流程',
      time: '16:30-18:00',
      completed: false,
      goalId: '3',
      goalName: '优化视频制作流程',
      priority: 'high',
      timeRange: {
        start: '16:30',
        end: '18:00'
      }
    },
    {
      id: '6',
      title: '记录今日饮食清单',
      time: '20:00-20:30',
      completed: false,
      goalId: '2',
      goalName: '减重5公斤',
      priority: 'low',
      timeRange: {
        start: '20:00',
        end: '20:30'
      }
    },
    {
      id: '7',
      title: '写视频文案模板',
      time: '21:00-22:00',
      completed: true,
      goalId: '3',
      goalName: '优化视频制作流程',
      priority: 'medium',
      timeRange: {
        start: '21:00',
        end: '22:00'
      }
    }
  ],

  addTask: (task) => {
    const id = Date.now().toString();
    set((state) => ({
      tasks: [...state.tasks, { ...task, id }]
    }));
    return id;
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  },

  toggleTaskCompletion: (id) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  },

  getTasks: () => get().tasks,
  
  getTaskById: (id) => get().tasks.find(task => task.id === id),
})); 