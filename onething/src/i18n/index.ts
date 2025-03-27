import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入语言文件
import zhTranslation from './locales/zh';
import enTranslation from './locales/en';
import jaTranslation from './locales/ja';

// 检测设备是否为移动端
export const isMobile = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
};

// 获取用户系统语言
export const getUserSystemLanguage = (): string => {
  // 获取完整的系统语言设置，如 'en-US', 'zh-CN', 'ja-JP'
  const systemLang = navigator.language || 
    (navigator as any).userLanguage || 
    (navigator as any).browserLanguage || 
    'en';
  
  // 提取基础语言代码（如'en', 'zh', 'ja'）
  const baseLang = systemLang.split('-')[0];
  
  console.log('检测到系统语言:', systemLang, '基础语言:', baseLang);
  
  // 根据检测到的基础语言返回支持的语言代码
  if (baseLang === 'zh') return 'zh';
  if (baseLang === 'ja') return 'ja';
  return 'en'; // 默认返回英语
};

// 自定义语言检测器选项
const languageDetectorOptions = {
  // 语言检测顺序
  order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag'],
  
  // 缓存用户语言选择，确保在会话中保持一致
  caches: ['localStorage'],
  
  // localStorage缓存键名
  lookupLocalStorage: 'i18nextLng',
  
  // 从navigator中获取语言时使用我们自定义的逻辑
  lookupFromNavigatorOnlyOnce: true,
  
  // 自定义从navigator获取语言的方法
  getNavigatorLanguage: function() {
    return getUserSystemLanguage();
  }
};

// 初始化 i18next
i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 默认语言
    fallbackLng: 'en',
    // 不显示警告日志
    debug: process.env.NODE_ENV === 'development',
    // 资源配置
    resources: {
      en: {
        translation: enTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
    // 插值配置
    interpolation: {
      escapeValue: false, // 不需要 XSS 转义
    },
    // 检测语言选项
    detection: languageDetectorOptions,
    // 确保初始化时就立即应用检测到的语言
    load: 'currentOnly'
  } as any);

// 为文档设置语言，确保屏幕阅读器和其他辅助技术能正确识别
document.documentElement.lang = i18n.language;

// 监听语言变化，更新文档语言
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  // 更新移动设备视口元数据
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport) {
    if (lng === 'ja') {
      // 日文可能需要更小的字体以适应布局
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=0.95, maximum-scale=1.0, user-scalable=no');
    } else {
      // 其他语言使用标准设置
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }
});

export default i18n; 