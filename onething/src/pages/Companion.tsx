import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import ConversationMemory from '../components/companion/ConversationMemory';
import { useTaskStore } from '../store/taskStore';

const Companion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'status'>('chat');
  const addTask = useTaskStore(state => state.addTask);
  
  // 处理发送消息
  const handleSendMessage = async (message: string): Promise<string> => {
    // 实际项目中会调用AI API
    // 这里模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (message.includes('任务')) {
      return '好的，我已经帮你记录了这个任务。你还需要做其他安排吗？';
    } else if (message.includes('目标')) {
      return '目标是成功的关键！你可以在目标页面详细设置你的目标，包括截止日期和优先级。需要我帮你制定目标计划吗？';
    } else if (message.includes('情绪') || message.includes('心情')) {
      return '注意情绪变化对你的生产力很重要。你可以在情绪页面记录你的情绪，我会给你一些调节建议。';
    } else {
      return '我理解了。我会一直在这里支持你。有什么其他我能帮到你的吗？';
    }
  };
  
  // 处理任务创建
  const handleCreateTask = (taskTitle: string) => {
    console.log('创建任务:', taskTitle); // 添加日志
    
    const newTaskId = addTask({
      title: taskTitle,
      time: `${new Date().getHours()}:00-${new Date().getHours() + 1}:00`,
      completed: false,
      timeRange: {
        start: `${new Date().getHours()}:00`,
        end: `${new Date().getHours() + 1}:00`
      },
      priority: 'medium'
    });
    
    console.log('任务已创建，ID:', newTaskId); // 添加任务创建成功日志
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-120px)]">
        {/* 左侧聊天区域 */}
        <div className="flex-1 card overflow-hidden flex flex-col">
          <div className="card-title flex justify-between">
            <div className="flex items-center">
              <span className="mr-2">AI伴侣</span>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="flex">
              <button 
                className={`text-sm px-3 py-1 rounded-md ${activeTab === 'chat' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('chat')}
              >
                聊天
              </button>
              <button 
                className={`text-sm px-3 py-1 rounded-md ml-2 ${activeTab === 'status' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('status')}
              >
                状态
              </button>
            </div>
          </div>
          
          {activeTab === 'chat' ? (
            <div className="flex-1 overflow-hidden">
              <ConversationMemory 
                onSendMessage={handleSendMessage}
                onCreateTask={handleCreateTask}
              />
            </div>
          ) : (
            <div className="p-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-tertiary flex items-center justify-center text-white text-4xl mb-4">
                  🤖
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">小助手</div>
                  <div className="text-sm text-gray-500">等级：3级 (成长值：65/100)</div>
                  <div className="text-sm mt-2">特质：温暖、鼓励型</div>
                </div>
                
                <div className="w-full mt-6">
                  <div className="text-sm font-semibold">成长进度</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">65/100</div>
                </div>
                
                <div className="w-full mt-6">
                  <div className="text-sm font-semibold">互动数据</div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                      <div className="font-medium">126</div>
                      <div className="text-xs text-gray-500">对话次数</div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                      <div className="font-medium">43</div>
                      <div className="text-xs text-gray-500">创建任务</div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                      <div className="font-medium">12</div>
                      <div className="text-xs text-gray-500">目标完成</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 右侧信息区域 */}
        <div className="w-full md:w-80 space-y-4">
          <div className="card">
            <div className="card-title">互动记忆</div>
            <div className="text-sm font-semibold">重要时刻：</div>
            <div className="bg-gray-100 rounded-lg p-3 my-2">• 首次设定PMP目标</div>
            <div className="bg-gray-100 rounded-lg p-3 my-2">• 克服学习瓶颈</div>
            <div className="bg-gray-100 rounded-lg p-3 my-2">• 第一次完成周计划</div>
            
            <div className="text-sm font-semibold mt-4">最近话题：</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#学习进度</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#情绪管理</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">#时间规划</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">互动仪式</div>
            <div className="mb-6">
              <div className="font-medium">☀️ 晨间计划</div>
              <div className="text-sm text-gray-500 my-1">状态：未完成</div>
              <button className="btn btn-sm btn-primary mt-2">开始晨间计划</button>
            </div>
            
            <div>
              <div className="font-medium">🌙 晚间复盘</div>
              <div className="text-sm text-gray-500 my-1">状态：19:30可用</div>
              <button className="btn btn-sm btn-secondary mt-2">设置提醒</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Companion; 