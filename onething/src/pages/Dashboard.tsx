import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useTaskStore } from '../store/taskStore';
import { useGoalStore } from '../store/goalStore';

const Dashboard: React.FC = () => {
  const formatDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
    return now.toLocaleDateString('zh-CN', options);
  };

  // 获取任务和目标数据
  const tasks = useTaskStore(state => state.tasks);
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);
  const goals = useGoalStore(state => state.goals);
  
  // 计算未完成任务数量
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  
  // 获取今日情绪状态（这里简化处理，实际应该从情绪存储获取）
  const emotionStatus = '😊';
  
  // 按时间排序任务
  const sortedTasks = [...tasks].sort((a, b) => {
    const aTime = a.timeRange?.start || '';
    const bTime = b.timeRange?.start || '';
    return aTime.localeCompare(bTime);
  });
  
  // 获取前4个高优先级目标
  const topGoals = [...goals]
    .sort((a, b) => {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    })
    .slice(0, 2);

  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>今日概览</span>
          <span>{formatDate()}</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-sm text-gray-500">待完成任务</div>
            <div className="font-semibold">{incompleteTasks}/{totalTasks}</div>
          </div>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-sm text-gray-500">目标进度</div>
            <div className="font-semibold">
              {goals.length > 0 
                ? Math.round(goals.reduce((sum, goal) => sum + goal.completionRate, 0) / goals.length) 
                : 0}%
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-100 rounded-lg text-center">
            <div className="text-sm text-gray-500">情绪状态</div>
            <div className="font-semibold">{emotionStatus}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>今日待办</span>
          <Link to="/tasks" className="btn btn-sm btn-secondary">查看全部</Link>
        </div>
        {sortedTasks.slice(0, 4).map(task => (
          <div key={task.id} className="task-item">
            <input 
              type="checkbox" 
              className="mr-3" 
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <div className="flex-1">
              <div className="text-sm text-gray-500">{task.time}</div>
              <div className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </div>
              {task.goalName && (
                <div className="text-xs text-gray-500">
                  {task.goalId?.startsWith('1') ? '🎯' : '💪'} 来自：{task.goalName}
                </div>
              )}
            </div>
          </div>
        ))}
        {sortedTasks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>今天暂时没有待办任务</p>
            <Link to="/tasks" className="btn btn-primary mt-2">添加任务</Link>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">
          <span>目标进展</span>
          <Link to="/goals" className="text-sm">查看全部 &gt;</Link>
        </div>
        {topGoals.map(goal => (
          <div key={goal.id} className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">{goal.icon || '🎯'}</span>
                <span>{goal.title}</span>
              </div>
              <div>{goal.completionRate}%</div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2 mb-1">
              <div 
                className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full"
                style={{ width: `${goal.completionRate}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              子目标：{goal.subGoals?.filter(sg => sg.completed).length || 0}/{goal.subGoals?.length || 0} 已完成
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>暂时没有设定目标</p>
            <Link to="/goals" className="btn btn-primary mt-2">设定目标</Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard; 