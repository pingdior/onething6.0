import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useTranslation } from 'react-i18next';

const Help: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AppLayout>
      <div className="card">
        <div className="card-title">{t('help.quickStart')}</div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {t('help.howToSetGoals')}
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {t('help.dailyTaskManagement')}
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {t('help.emotionRecordingGuide')}
        </div>
        
        <div className="flex items-center gap-2 py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {t('help.communicateWithAI')}
        </div>
        
        <button className="btn btn-secondary mt-4">{t('help.viewAllGuides')}</button>
      </div>

      <div className="card">
        <div className="card-title">{t('help.interactiveTutorials')}</div>
        
        <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm mb-4">
          <div>
            <div className="font-medium">🎯 {t('help.goalManagementMastery')}</div>
            <div className="text-sm text-gray-500">{t('help.progress')}: 2/5{t('help.steps')}</div>
          </div>
          <button className="btn btn-primary">{t('help.continueLearning')}</button>
        </div>
        
        <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
          <div>
            <div className="font-medium">😊 {t('help.emotionIntroduction')}</div>
            <div className="text-sm text-gray-500">{t('help.progress')}: {t('help.notStarted')}</div>
          </div>
          <button className="btn btn-secondary">{t('help.startTutorial')}</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">{t('help.faq')}</div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          {t('help.howToChangeReminderSettings')}
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          {t('help.isMyDataSafe')}
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          {t('help.howToExportGoals')}
        </div>
        
        <div className="py-3 border-b border-gray-200 cursor-pointer hover:text-primary">
          {t('help.howAICompanionGrows')}
        </div>
        
        <button className="btn btn-secondary mt-4">{t('help.viewAllQuestions')}</button>
      </div>

      <div className="card">
        <div className="card-title">{t('help.shortcutGuide')}</div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">🔍 {t('help.search')}:</div>
          <input 
            type="text" 
            className="w-full py-3 px-4 border border-gray-300 rounded-lg outline-none focus:border-primary"
            placeholder={t('help.searchShortcuts')}
          />
        </div>
        
        <div>
          <div className="text-sm font-semibold">{t('help.popularShortcuts')}:</div>
          <div className="mt-2">
            <div className="text-sm mt-1">• N - {t('help.shortcuts.newTask')}</div>
            <div className="text-sm">• G + D - {t('help.shortcuts.goToDashboard')}</div>
            <div className="text-sm">• / - {t('help.shortcuts.search')}</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help; 