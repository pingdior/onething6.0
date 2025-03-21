import { Task } from '../store/taskStore';

// 定义事件类型
export type TaskDiscussEventType = 'discuss_task';

// 定义事件接口
export interface TaskDiscussEvent {
  type: TaskDiscussEventType;
  payload: {
    task: Task;
  };
}

// 事件监听器类型
type TaskDiscussEventListener = (event: TaskDiscussEvent) => void;

// 事件管理类
class TaskDiscussService {
  private listeners: TaskDiscussEventListener[] = [];

  // 添加事件监听器
  public addEventListener(listener: TaskDiscussEventListener): void {
    this.listeners.push(listener);
  }

  // 移除事件监听器
  public removeEventListener(listener: TaskDiscussEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 触发讨论任务事件
  public discussTask(task: Task): void {
    const event: TaskDiscussEvent = {
      type: 'discuss_task',
      payload: { task }
    };
    
    // 通知所有监听器
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('处理任务讨论事件时出错:', error);
      }
    });
  }
}

// 导出单例
export default new TaskDiscussService(); 