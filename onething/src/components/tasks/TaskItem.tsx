import React, { useState } from 'react';
import { Task, useTaskStore } from '../../store/taskStore';

interface TaskItemProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDiscussWithAI?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onTaskClick, 
  onDelete, 
  onEdit, 
  onDiscussWithAI 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleTaskCompletion = useTaskStore(state => state.toggleTaskCompletion);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(task);
    }
    setShowMenu(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task);
    }
    setShowMenu(false);
  };

  const handleDiscuss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDiscussWithAI) {
      onDiscussWithAI(task);
    }
    setShowMenu(false);
  };

  return (
    <div 
      className="task-item relative"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
      onClick={() => onTaskClick && onTaskClick(task)}
    >
      <input 
        type="checkbox" 
        className="mr-3" 
        checked={task.completed}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
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
        {task.description && !task.goalName && (
          <div className="text-xs text-gray-500">
            📅 {task.description}
          </div>
        )}
      </div>
      
      {showMenu && (
        <div className="task-menu absolute right-0 top-0 bg-white shadow-md rounded-md z-10 p-2">
          <div 
            className="menu-item py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={handleEdit}
          >
            <span className="mr-2">✏️</span> 编辑
          </div>
          <div 
            className="menu-item py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={handleDelete}
          >
            <span className="mr-2">🗑️</span> 删除
          </div>
          <div 
            className="menu-item py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
            onClick={handleDiscuss}
          >
            <span className="mr-2">💬</span> 与AI讨论
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem; 