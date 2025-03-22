import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  time?: string;
  description?: string;
  completed: boolean;
  goalId?: string;
  source?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

// 模拟任务数据
const mockTasks: Task[] = [
  {
    id: '1',
    title: '完成项目提案初稿',
    time: '9:00',
    completed: false,
    source: '项目管理',
    goalId: '1'
  },
  {
    id: '2',
    title: '团队周会',
    time: '11:00-12:00',
    completed: false,
    source: '工作安排'
  },
  {
    id: '3',
    title: '回复邮件',
    time: '13:00-14:00',
    completed: true,
    source: '日常任务'
  },
  {
    id: '4',
    title: '健身训练',
    time: '15:00-16:00',
    completed: false,
    source: '健身计划',
    goalId: '2'
  }
];

const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  loading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ loading: true });
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ tasks: mockTasks, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '未知错误', 
        loading: false 
      });
    }
  },
  
  toggleTask: async (id: string) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
    
    // 这里可以添加API调用来保存状态
  },
  
  addTask: async (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    
    set(state => ({
      tasks: [...state.tasks, newTask]
    }));
  },
  
  deleteTask: async (id: string) => {
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  }
}));

export default useTaskStore; 