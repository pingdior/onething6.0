import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TaskItem from '../components/tasks/TaskItem';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { Task, useTaskStore } from '../store/taskStore';
import taskDiscussService from '../services/taskDiscussService';
import { useTranslation } from 'react-i18next';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'timeline' | 'kanban'>('timeline');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // 从状态管理获取任务和操作函数
  const tasks = useTaskStore(state => state.tasks);
  const removeTask = useTaskStore(state => state.removeTask);
  
  // 按时间段分组任务
  const morningTasks = tasks.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour < 12;
  });
  
  const afternoonTasks = tasks.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour >= 12;
  });
  
  // 按状态分组任务（用于看板视图）
  const todoTasks = tasks.filter(task => !task.completed);
  const inProgressTasks: Task[] = []; // 这里可以根据实际需求添加"进行中"的判断逻辑
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };
  
  // 添加任务处理函数
  const handleAddTask = () => {
    setShowAddModal(true);
  };
  
  // 删除任务处理函数
  const handleDeleteTask = (id: string) => {
    console.log("删除任务:", id);
    removeTask(id);
  };
  
  // 编辑任务处理函数
  const handleEditTask = (task: Task) => {
    console.log("编辑任务:", task.id);
    setSelectedTask(task);
    setShowDetailModal(true);
  };
  
  // 与AI讨论任务处理函数
  const handleDiscussWithAI = (task: Task) => {
    console.log("与AI讨论任务:", task.title);
    // 使用服务触发讨论事件
    taskDiscussService.discussTask(task);
  };

  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>{t('tasks.dailyTasks')}</span>
          <div className="flex items-center gap-2">
            <span>2024-03-19</span>
            <button className="btn btn-sm btn-secondary">{t('tasks.calendar')}</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex border-b border-gray-200">
            <div 
              className={`py-3 px-4 cursor-pointer ${activeView === 'timeline' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
              onClick={() => setActiveView('timeline')}
            >
              {t('tasks.timeline')}
            </div>
            <div 
              className={`py-3 px-4 cursor-pointer ${activeView === 'kanban' ? 'border-b-2 border-primary text-primary font-medium' : ''}`}
              onClick={() => setActiveView('kanban')}
            >
              {t('tasks.kanban')}
            </div>
          </div>
          
          <button 
            className="btn btn-primary flex items-center gap-1"
            onClick={handleAddTask}
          >
            <span>+</span> {t('tasks.addTask')}
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <div className="py-2 px-4 cursor-pointer text-gray-500 hover:text-primary">
            💬 {t('tasks.letAIPlan')}
          </div>
        </div>
        
        {activeView === 'timeline' ? (
          <div>
            <div className="text-sm font-semibold mb-4">{t('dashboard.morningTasks')}</div>
            {morningTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskClick={handleTaskClick}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
                onDiscussWithAI={() => handleDiscussWithAI(task)}
              />
            ))}
            
            <div className="text-sm font-semibold my-4">{t('dashboard.afternoonTasks')}</div>
            {afternoonTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskClick={handleTaskClick}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
                onDiscussWithAI={() => handleDiscussWithAI(task)}
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.todo')}</div>
              
              {todoTasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-white rounded-md p-3 mb-3 shadow-sm cursor-grab"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.time}</div>
                  {task.goalName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {task.goalId?.startsWith('1') ? '🎯' : '💪'} {task.goalName}
                    </div>
                  )}
                  <div className="flex mt-2 text-xs text-gray-500">
                    <button 
                      className="mr-2 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      ✏️ {t('actions.edit')}
                    </button>
                    <button 
                      className="mr-2 hover:text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      🗑️ {t('actions.delete')}
                    </button>
                    <button 
                      className="hover:text-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscussWithAI(task);
                      }}
                    >
                      💬 {t('tasks.discussWithAI')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.inProgress')}</div>
              {inProgressTasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-white rounded-md p-3 mb-3 shadow-sm cursor-grab"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.time}</div>
                  {task.goalName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {task.goalId?.startsWith('1') ? '🎯' : '💪'} {task.goalName}
                    </div>
                  )}
                  <div className="flex mt-2 text-xs text-gray-500">
                    <button 
                      className="mr-2 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      ✏️ {t('actions.edit')}
                    </button>
                    <button 
                      className="mr-2 hover:text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      🗑️ {t('actions.delete')}
                    </button>
                    <button 
                      className="hover:text-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscussWithAI(task);
                      }}
                    >
                      💬 {t('tasks.discussWithAI')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.completed')}</div>
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  className="bg-gray-100 rounded-md p-3 mb-3 shadow-sm cursor-grab line-through text-gray-500"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.time}</div>
                  {task.goalName && (
                    <div className="text-xs text-gray-500 mt-1">
                      {task.goalId?.startsWith('1') ? '🎯' : '💪'} {task.goalName}
                    </div>
                  )}
                  <div className="flex mt-2 text-xs text-gray-500">
                    <button 
                      className="mr-2 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      ✏️ {t('actions.edit')}
                    </button>
                    <button 
                      className="mr-2 hover:text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                    >
                      🗑️ {t('actions.delete')}
                    </button>
                    <button 
                      className="hover:text-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscussWithAI(task);
                      }}
                    >
                      💬 {t('tasks.discussWithAI')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 添加任务弹窗 */}
      <AddTaskModal 
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAIPlan={() => console.log("AI规划")}
      />
      
      {/* 任务详情弹窗 */}
      {selectedTask && showDetailModal && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </AppLayout>
  );
};

export default Tasks; 