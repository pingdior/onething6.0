import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';

const Dashboard: React.FC = () => {
  const formatDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // 简易日期格式化，实际项目中可以使用更好的格式化库
  };

  // 添加简单的任务切换功能
  const [taskStates, setTaskStates] = useState({
    task1: false,
    task2: false,
    task3: true,
    task4: false
  });

  const toggleTask = (taskId: keyof typeof taskStates) => {
    setTaskStates(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">
          <span>今日概览</span>
          <span>{formatDate()}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>待完成任务</div>
            <div style={{ fontWeight: 600 }}>5/8</div>
          </div>
          <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>目标进度</div>
            <div style={{ fontWeight: 600 }}>68%</div>
          </div>
          <div style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--gray-100)', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>情绪状态</div>
            <div style={{ fontWeight: 600 }}>😊</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>今日待办</span>
          <button className="btn btn-sm btn-secondary">排序</button>
        </div>
        <div className="task-item">
          <input 
            type="checkbox" 
            className="task-checkbox" 
            checked={taskStates.task1}
            onChange={() => toggleTask('task1')}
          />
          <div className="task-content">
            <div className="task-time">9:00</div>
            <div className="task-title">完成项目提案初稿</div>
          </div>
        </div>
        <div className="task-item">
          <input 
            type="checkbox" 
            className="task-checkbox" 
            checked={taskStates.task2}
            onChange={() => toggleTask('task2')}
          />
          <div className="task-content">
            <div className="task-time">11:00</div>
            <div className="task-title">团队周会</div>
          </div>
        </div>
        <div className="task-item">
          <input 
            type="checkbox" 
            className="task-checkbox" 
            checked={taskStates.task3}
            onChange={() => toggleTask('task3')}
          />
          <div className="task-content">
            <div className="task-time">13:00</div>
            <div className="task-title">回复重要邮件</div>
          </div>
        </div>
        <div className="task-item">
          <input 
            type="checkbox" 
            className="task-checkbox" 
            checked={taskStates.task4}
            onChange={() => toggleTask('task4')}
          />
          <div className="task-content">
            <div className="task-time">15:00</div>
            <div className="task-title">健身</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>目标进展</span>
          <a href="/goals" style={{ fontSize: '0.875rem' }}>查看全部 &gt;</a>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>项目管理认证</div>
            <div>68%</div>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden', margin: '0.5rem 0' }}>
            <div 
              style={{ 
                height: '100%', 
                width: '68%', 
                background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--tertiary-color) 100%)',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>健身计划</div>
            <div>45%</div>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden', margin: '0.5rem 0' }}>
            <div 
              style={{ 
                height: '100%', 
                width: '45%', 
                background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--tertiary-color) 100%)',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard; 