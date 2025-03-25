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
    detection: {
      // 通过localStorage缓存用户语言
      caches: ['localStorage'],
      // 通过HTML标签的lang属性查找语言
      lookupHTML: true,
      // 通过navigator查找语言
      order: ['navigator', 'localStorage', 'htmlTag'],
    },
  } as any);

export default i18n; 