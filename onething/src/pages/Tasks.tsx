import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TaskItem from '../components/tasks/TaskItem';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import AddTaskModal from '../components/tasks/AddTaskModal';
import { Task, useTaskStore } from '../store/taskStore';
import taskDiscussService from '../services/taskDiscussService';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { isSameDay, startOfDay } from 'date-fns';

const Tasks: React.FC = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'timeline' | 'kanban'>('timeline');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  
  // 从状态管理获取所有任务
  const allTasks = useTaskStore(state => state.tasks);
  const removeTask = useTaskStore(state => state.removeTask);
  
  // 添加一个刷新状态，用于强制组件重新渲染
  const [refreshFlag, setRefreshFlag] = useState(0);

  // 监听任务添加/更新，触发刷新
  useEffect(() => {
    // 监听 localStorage 变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tasks-storage') {
        console.log('[Tasks.tsx] Detected localStorage change, refreshing component');
        setRefreshFlag(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 添加任务成功后回调
  const handleTaskAdded = () => {
    console.log('[Tasks.tsx] Task added, refreshing component');
    setRefreshFlag(prev => prev + 1);
  };
  
  // --- Add Logs for Debugging --- 
  console.log('[Tasks.tsx] allTasks from store:', allTasks);
  console.log('[Tasks.tsx] selectedDate:', selectedDate);
  // --- End Logs --- 
  
  // 筛选选定日期的任务
  const tasksForSelectedDay = allTasks.filter(task => {
    // --- Add Log inside filter --- 
    const isMatch = task.date && isSameDay(new Date(task.date), selectedDate);
    // console.log(`[Tasks.tsx] Filtering task '${task.title}' (date: ${task.date}) against ${selectedDate.toISOString().split('T')[0]}. Match: ${isMatch}`); // Optional: Log each task check
    // --- End Log --- 
    return isMatch;
  });
  
  // --- Add Log for Filtered Tasks --- 
  console.log('[Tasks.tsx] tasksForSelectedDay:', tasksForSelectedDay);
  // --- End Log --- 
  
  // 按时间段分组选定日期的任务
  const morningTasks = tasksForSelectedDay.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour < 12;
  });
  
  const afternoonTasks = tasksForSelectedDay.filter(task => {
    const startHour = task.timeRange?.start ? parseInt(task.timeRange.start.split(':')[0]) : 0;
    return startHour >= 12;
  });
  
  // 按状态分组选定日期的任务（用于看板视图）
  const todoTasks = tasksForSelectedDay.filter(task => !task.completed);
  const inProgressTasks: Task[] = [];
  const completedTasks = tasksForSelectedDay.filter(task => task.completed);
  
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

  // --- Date handling functions ---
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(startOfDay(newDate));
    }
  };

  const goToToday = () => {
    setSelectedDate(startOfDay(new Date()));
  };
  // --- End Date handling functions ---

  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>{t('tasks.dailyTasks')}</span>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex items-center gap-2">
              <DatePicker 
                value={selectedDate} 
                onChange={handleDateChange}
                slotProps={{ textField: { size: 'small', sx: { width: '150px' } } }} 
                format="yyyy-MM-dd"
              />
              <Button variant="outlined" size="small" onClick={goToToday}>
                {t('common.today')} 
              </Button>
              <Button 
                 variant="contained" 
                 size="small" 
                 startIcon={<span>+</span>}
                 onClick={handleAddTask}
                 className="ml-auto"
              >
                 {t('tasks.addTask')}
              </Button>
            </div>
          </LocalizationProvider>
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
        </div>
        
        <div className="flex border-b border-gray-200 mb-4">
          <div className="py-2 px-4 cursor-pointer text-gray-500 hover:text-primary">
            💬 {t('tasks.letAIPlan')}
          </div>
        </div>
        
        {activeView === 'timeline' ? (
          <div>
            <div className="text-sm font-semibold mb-4">{t('dashboard.morningTasks')}</div>
            {morningTasks.length > 0 ? morningTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskClick={handleTaskClick}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
                onDiscussWithAI={() => handleDiscussWithAI(task)}
              />
            )) : <p className="text-gray-500 text-sm">{t('tasks.noTasksMorning')}</p>}
            
            <div className="text-sm font-semibold my-4">{t('dashboard.afternoonTasks')}</div>
            {afternoonTasks.length > 0 ? afternoonTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onTaskClick={handleTaskClick}
                onDelete={() => handleDeleteTask(task.id)}
                onEdit={() => handleEditTask(task)}
                onDiscussWithAI={() => handleDiscussWithAI(task)}
              />
            )) : <p className="text-gray-500 text-sm">{t('tasks.noTasksAfternoon')}</p>}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.todo')}</div>
              {todoTasks.length > 0 ? todoTasks.map(task => (
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
              )) : <p className="text-gray-500 text-sm">{t('tasks.noTasksTodo')}</p>}
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.inProgress')}</div>
              {inProgressTasks.length > 0 ? inProgressTasks.map(task => (
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
              )) : <p className="text-gray-500 text-sm">{t('tasks.noTasksInProgress')}</p>}
            </div>
            
            <div className="flex-1 min-w-64 bg-gray-100 rounded-lg p-3">
              <div className="font-semibold py-2 mb-3 border-b border-gray-300">{t('tasks.completed')}</div>
              {completedTasks.length > 0 ? completedTasks.map(task => (
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
              )) : <p className="text-gray-500 text-sm">{t('tasks.noTasksCompleted')}</p>}
            </div>
          </div>
        )}
      </div>
      
      {/* 添加任务弹窗 */}
      <AddTaskModal 
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAIPlan={() => console.log("AI规划")}
        selectedDate={selectedDate}
        onTaskAdded={handleTaskAdded}
      />
      
      {/* 任务详情弹窗 */}
      {selectedTask && showDetailModal && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => { 
            setShowDetailModal(false); 
            setSelectedTask(null);
          }}
        />
      )}
    </AppLayout>
  );
};

export default Tasks; 