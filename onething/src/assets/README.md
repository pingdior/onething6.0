# OneThing 移动端UI设计资源

本目录包含了基于 `mobile@2x.svg` 设计稿提取的UI资源，用于开发移动端界面。

## 目录结构

```
assets/
├── icons/              # 图标SVG文件
├── buttons/            # 按钮样式SVG
├── backgrounds/        # 背景和容器SVG
├── svg/                # 原始设计SVG文件
├── theme-colors.js     # 主题颜色定义
└── README.md           # 本文档
```

## 颜色主题

颜色主题在 `theme-colors.js` 中定义，包括：

- **主色**: #4ECDC4 (青绿色)
- **辅助色**: #A6E4D0 (浅绿色)
- **中性色**: #1A535C (深青色)
- **点缀色**: #FF6B6B (珊瑚红)
- **文字颜色**: #374151, #4B5563, #6B7280
- **背景色**: #F3F4F6, #FEF7FF
- **其他辅助色**: #FFB054, #0075FF, #9370DB

## 可用资源

### 图标

- `logo.svg` - 应用标志
- `today.svg` - 今日/首页导航图标
- `tasks.svg` - 任务导航图标
- `settings.svg` - 设置导航图标
- `add.svg` - 添加按钮图标

### 按钮

- `primary-button.svg` - 主要按钮样式
- `secondary-button.svg` - 次要按钮样式
- `danger-button.svg` - 警告/危险按钮样式

### 背景与容器

- `input-bg.svg` - 输入框背景
- `card-bg.svg` - 卡片容器背景

## 使用方法

在React组件中导入这些资源：

```jsx
// 导入颜色主题
import themeColors from '../assets/theme-colors';

// 导入SVG图标
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg';
import { ReactComponent as TodayIcon } from '../assets/icons/today.svg';

// 使用颜色
const styles = {
  container: {
    backgroundColor: themeColors.bgLight,
    color: themeColors.textDark,
  }
};

// 使用图标
return (
  <div style={styles.container}>
    <LogoIcon width="40" height="40" />
    <TodayIcon width="24" height="24" />
  </div>
);
```

## 预览组件

可以通过 `MobileUIKit` 组件预览所有UI资源：

```jsx
import MobileUIKit from '../components/mobile/MobileUIKit';

// 在应用中渲染
<MobileUIKit />
```

## 说明

这些资源是从原始设计稿 `mobile@2x.svg` 中提取的，遵循了设计稿中的视觉风格和色彩方案。如果需要添加更多资源，请参考原始设计稿或与设计师沟通以保持一致性。