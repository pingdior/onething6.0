import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGoalStore } from './goalStore';

export interface Task {
  id: string;
  title: string;
  date?: string | Date;
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
  order?: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'date'> & { date: string | Date }) => string;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
  reorderTasks: (startIndex: number, endIndex: number, timeSlot: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: '优化OneThing应用UI',
          date: '2024-03-19',
          time: '9:00-11:00',
          completed: true,
          goalId: '1',
          goalName: '上线OneThing应用Web版本',
          priority: 'high',
          timeRange: {
            start: '9:00',
            end: '11:00'
          },
          order: 0
        },
        {
          id: '2',
          title: '编写ProductHunt发布材料',
          date: '2024-03-19',
          time: '11:00-12:30',
          completed: false,
          goalId: '1',
          goalName: '上线OneThing应用Web版本',
          priority: 'high',
          timeRange: {
            start: '11:00',
            end: '12:30'
          },
          order: 1
        },
        {
          id: '3',
          title: '回复产品合作邮件',
          date: '2024-03-19',
          time: '13:00-14:00',
          completed: true,
          priority: 'medium',
          timeRange: {
            start: '13:00',
            end: '14:00'
          },
          order: 0
        },
        {
          id: '4',
          title: '有氧运动45分钟',
          date: '2024-03-19',
          time: '15:00-16:00',
          completed: false,
          goalId: '2',
          goalName: '减重5公斤',
          priority: 'medium',
          timeRange: {
            start: '15:00',
            end: '16:00'
          },
          order: 1
        },
        {
          id: '5',
          title: '测试视频制作自动化流程',
          date: '2024-03-20',
          time: '16:30-18:00',
          completed: false,
          goalId: '3',
          goalName: '优化视频制作流程',
          priority: 'high',
          timeRange: {
            start: '16:30',
            end: '18:00'
          },
          order: 2
        },
        {
          id: '6',
          title: '记录今日饮食清单',
          date: '2024-03-20',
          time: '20:00-20:30',
          completed: false,
          goalId: '2',
          goalName: '减重5公斤',
          priority: 'low',
          timeRange: {
            start: '20:00',
            end: '20:30'
          },
          order: 0
        },
        {
          id: '7',
          title: '写视频文案模板',
          date: '2024-03-20',
          time: '21:00-22:00',
          completed: true,
          goalId: '3',
          goalName: '优化视频制作流程',
          priority: 'medium',
          timeRange: {
            start: '21:00',
            end: '22:00'
          },
          order: 1
        }
      ],

      addTask: (task) => {
        const id = Date.now().toString();
        const allTasks = get().tasks;
        
        const taskDateString = typeof task.date === 'string' ? task.date : task.date.toISOString().split('T')[0];

        console.log('[taskStore] Adding new task:', {
          taskDateString,
          taskData: task,
          existingTasksCount: allTasks.length
        });

        let order = 0;
        const timeSlotTasks = allTasks.filter(t => {
          const tDateString = typeof t.date === 'string' ? t.date : t.date?.toISOString().split('T')[0];
          if (tDateString !== taskDateString) return false;

          const taskTimeStart = t.timeRange?.start?.split(':')[0] || '';
          const newTaskTimeStart = task.timeRange?.start?.split(':')[0] || '';
          return taskTimeStart === newTaskTimeStart;
        });
        
        if (timeSlotTasks.length > 0) {
          order = Math.max(...timeSlotTasks.map(t => t.order || 0)) + 1;
        }
        
        let finalTask: Task = { ...task, id, order, date: taskDateString };
        if (task.goalId) {
          const goal = useGoalStore.getState().getGoalById(task.goalId);
          if (goal) {
            finalTask.goalName = goal.title;
          }
        }
        
        console.log('[taskStore] State before addTask:', get().tasks);
        set((state) => ({
          tasks: [...state.tasks, finalTask]
        }));
        console.log('[taskStore] State after addTask:', get().tasks);
        
        try {
          console.log('[taskStore] Calling syncGoalProgress...');
          syncGoalProgress();
          console.log('[taskStore] syncGoalProgress finished.');
        } catch (syncError) {
          console.error('[taskStore] Error during syncGoalProgress:', syncError);
        }
        
        try {
          localStorage.setItem('tasks-storage', JSON.stringify({
            state: { tasks: get().tasks },
            version: 0
          }));
          console.log('[taskStore] Tasks manually saved to localStorage');
        } catch (storageError) {
          console.error('[taskStore] Error saving to localStorage:', storageError);
        }
        
        return id;
      },

      updateTask: (id, updates) => {
        let finalUpdates = { ...updates };
        if (updates.date) {
          finalUpdates.date = typeof updates.date === 'string' 
            ? updates.date 
            : updates.date.toISOString().split('T')[0];
        }
        if (updates.goalId) {
          const goal = useGoalStore.getState().getGoalById(updates.goalId);
          if (goal) {
            finalUpdates.goalName = goal.title;
          }
        }
        
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...finalUpdates } : task
          )
        }));
        
        syncGoalProgress();
      },

      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
        
        syncGoalProgress();
      },

      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        }));
        
        syncGoalProgress();
      },

      getTasks: () => get().tasks,
      
      getTaskById: (id) => get().tasks.find(task => task.id === id),
      
      reorderTasks: (startIndex, endIndex, timeSlot) => {
        set((state) => {
          const timeSlotTasks = state.tasks.filter(task => {
            const taskStartHour = task.timeRange?.start?.split(':')[0] || '';
            return taskStartHour === timeSlot;
          }).sort((a, b) => (a.order || 0) - (b.order || 0));
          
          const [removed] = timeSlotTasks.splice(startIndex, 1);
          timeSlotTasks.splice(endIndex, 0, removed);
          
          const updatedTimeSlotTasks = timeSlotTasks.map((task, index) => ({
            ...task,
            order: index
          }));
          
          const updatedTasks = state.tasks.map(task => {
            const taskStartHour = task.timeRange?.start?.split(':')[0] || '';
            if (taskStartHour === timeSlot) {
              const updatedTask = updatedTimeSlotTasks.find(t => t.id === task.id);
              return updatedTask || task;
            }
            return task;
          });
          
          return { tasks: updatedTasks };
        });
      }
    }),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
); 

function syncGoalProgress() {
  const tasks = useTaskStore.getState().tasks;
  const goalStore = useGoalStore.getState();
  const goals = goalStore.getGoals();
  
  goals.forEach(goal => {
    const goalTasks = tasks.filter(task => task.goalId === goal.id);
    
    if (goalTasks.length > 0) {
      const completedTasks = goalTasks.filter(task => task.completed);
      const completionRate = Math.round((completedTasks.length / goalTasks.length) * 100);
      
      if (completionRate !== goal.completionRate) {
        goalStore.updateCompletionRate(goal.id, completionRate);
      }
    }
  });
} 