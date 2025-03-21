import React, { useState } from 'react';

interface OnboardingStep {
  title: string;
  description: string;
  image: string;
}

interface OnboardingStepsProps {
  onComplete: () => void;
}

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: '欢迎使用 OneThing',
      description: 'OneThing 是一个智能目标管理应用，帮助你更有效地实现个人目标。',
      image: '/onboarding-1.png'
    },
    {
      title: '设置目标',
      description: '创建明确的长期目标，AI 会帮助你分解成可执行的小步骤。',
      image: '/onboarding-2.png'
    },
    {
      title: '每日任务管理',
      description: '安排和跟踪每日任务，保持对目标的专注和持续进展。',
      image: '/onboarding-3.png'
    },
    {
      title: '情绪记录',
      description: '记录每日情绪变化，了解情绪与目标进展的关系。',
      image: '/onboarding-4.png'
    },
    {
      title: 'AI 伴侣',
      description: '智能 AI 伴侣提供个性化引导和建议，陪伴你实现目标。',
      image: '/onboarding-5.png'
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-md mx-auto h-full flex flex-col px-6">
        {/* 进度指示器 */}
        <div className="flex justify-center py-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* 步骤内容 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-8">
            {/* 实际项目中这里会显示真实图片 */}
            <div className="text-4xl">{
              currentStep === 0 ? '🚀' :
              currentStep === 1 ? '🎯' :
              currentStep === 2 ? '📋' :
              currentStep === 3 ? '😊' : '🤖'
            }</div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-center">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-gray-600 text-center mb-12">
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* 导航按钮 */}
        <div className="py-8">
          {currentStep === 0 ? (
            <div className="flex justify-between">
              <button
                className="text-gray-500"
                onClick={handleSkip}
              >
                跳过
              </button>
              <button
                className="bg-primary text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                下一步
              </button>
            </div>
          ) : currentStep === steps.length - 1 ? (
            <div className="flex justify-between">
              <button
                className="text-gray-500"
                onClick={handlePrevious}
              >
                上一步
              </button>
              <button
                className="bg-primary text-white px-6 py-2 rounded-full"
                onClick={onComplete}
              >
                开始使用
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <button
                className="text-gray-500"
                onClick={handlePrevious}
              >
                上一步
              </button>
              <button
                className="bg-primary text-white px-6 py-2 rounded-full"
                onClick={handleNext}
              >
                下一步
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps; 