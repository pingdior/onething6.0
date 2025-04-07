import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  
  const weekdays = [
    t('settings.weekdays.monday'),
    t('settings.weekdays.tuesday'),
    t('settings.weekdays.wednesday'),
    t('settings.weekdays.thursday'),
    t('settings.weekdays.friday'),
    t('settings.weekdays.saturday'),
    t('settings.weekdays.sunday')
  ];
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">{t('settings.profile')}</div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">{t('settings.username')}</div>
          <div className="text-gray-500">张三</div>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">{t('settings.email')}</div>
          <div className="text-gray-500">zhang@example.com</div>
        </div>
        <div className="mt-4">
          <button className="btn btn-secondary btn-sm mr-2">{t('settings.changePassword')}</button>
          <button className="btn btn-secondary btn-sm">{t('settings.accountManagement')}</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{t('settings.workHabits')}</div>
        <div className="mb-4">
          <div className="font-medium mb-2">{t('settings.workdays')}</div>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((day, index) => (
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
          <div className="font-medium mb-2">{t('settings.efficientWorkingHours')}</div>
          <div className="mb-1">{t('dashboard.morningTasks')} 9:00 - 12:00</div>
          <div className="mb-2">{t('dashboard.afternoonTasks')} 14:00 - 17:00</div>
          <button className="btn btn-sm btn-secondary">+{t('settings.addTimeSlot')}</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{t('settings.reminderSettings')}</div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">{t('settings.taskReminder')}</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>{t('settings.enabled')}</span>
            </label>
            <span>{t('settings.minutesBefore', { minutes: 15 })}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <div className="font-medium">{t('settings.morningPlanReminder')}</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>{t('settings.enabled')}</span>
            </label>
            <span>{t('settings.dailyAt', { time: '8:00' })}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <div className="font-medium">{t('settings.eveningReviewReminder')}</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="mr-1" />
              <span>{t('settings.enabled')}</span>
            </label>
            <span>{t('settings.dailyAt', { time: '20:00' })}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{t('settings.interfaceSettings')}</div>
        <div className="mb-4">
          <div className="font-medium mb-2">{t('settings.theme')}</div>
          <div className="flex gap-6">
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="light" className="sr-only" />
              <div className="w-10 h-10 rounded-full border border-gray-300 mb-1"></div>
              <div className="text-sm">{t('settings.lightTheme')}</div>
            </label>
            
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="dark" defaultChecked className="sr-only" />
              <div className="w-10 h-10 rounded-full bg-gray-800 mb-1 border-2 border-primary"></div>
              <div className="text-sm">{t('settings.darkTheme')}</div>
            </label>
            
            <label className="flex flex-col items-center cursor-pointer">
              <input type="radio" name="theme" value="system" className="sr-only" />
              <div className="w-10 h-10 rounded-full mb-1 overflow-hidden flex">
                <div className="w-1/2 bg-white"></div>
                <div className="w-1/2 bg-gray-800"></div>
              </div>
              <div className="text-sm">{t('settings.systemTheme')}</div>
            </label>
          </div>
        </div>

        <div>
          <div className="font-medium mb-2">{t('settings.fontSize')}</div>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="small" className="mr-1" />
              <span>{t('settings.fontSizes.small')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="medium" defaultChecked className="mr-1" />
              <span>{t('settings.fontSizes.medium')}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="font-size" value="large" className="mr-1" />
              <span>{t('settings.fontSizes.large')}</span>
            </label>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings; 