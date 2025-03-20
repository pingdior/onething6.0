import React from 'react';
import AppLayout from '../components/layout/AppLayout';

const Settings: React.FC = () => {
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">个人资料</div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">用户名</div>
          <div className="text-gray-500">张三</div>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">邮箱</div>
          <div className="text-gray-500">zhang@example.com</div>
        </div>
        <div className="mt-4">
          <button className="btn btn-secondary btn-sm mr-2">修改密码</button>
          <button className="btn btn-secondary btn-sm">账号管理</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">工作习惯设置</div>
        <div className="mb-4">
          <div className="font-medium mb-2">工作日</div>
          <div className="flex flex-wrap gap-2">
            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => (
              <label 
                key={index}
                className="flex-shrink-0 px-2 py-1 border border-gray-300 rounded cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  className="mr-1" 
                  defaultChecked={index < 6} 
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <div className="font-medium mb-2">高效工作时段</div>
          <div className="mb-1">上午 9:00 - 12:00</div>
          <div className="mb-2">下午 14:00 - 17:00</div>
          <button className="btn btn-sm btn-secondary">+添加时段</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">提醒设置</div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">任务提醒</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>开启</span>
            </label>
            <span>提前15分钟</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">晨间计划提醒</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>开启</span>
            </label>
            <span>每天 8:00</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <div className="font-medium">晚间复盘提醒</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>开启</span>
            </label>
            <span>每天 20:00</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">界面设置</div>
        <div className="mb-4">
          <div className="font-medium mb-2">主题</div>
          <div className="flex gap-6">
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="light" className="sr-only" />
              <div className="w-10 h-10 rounded-full border border-gray-300 mb-1"></div>
              <div className="text-sm">浅色</div>
            </label>
            
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="dark" defaultChecked className="sr-only" />
              <div className="w-10 h-10 rounded-full bg-gray-800 mb-1 border-2 border-primary"></div>
              <div className="text-sm">深色</div>
            </label>
            
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="system" className="sr-only" />
              <div className="w-10 h-10 rounded-full mb-1 overflow-hidden flex">
                <div className="w-1/2 bg-white"></div>
                <div className="w-1/2 bg-gray-800"></div>
              </div>
              <div className="text-sm">跟随系统</div>
            </label>
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">字体大小</div>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="small" className="mr-1" />
              <span>小</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="medium" defaultChecked className="mr-1" />
              <span>中</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="large" className="mr-1" />
              <span>大</span>
            </label>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings; 