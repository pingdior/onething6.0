import React from 'react';
import themeColors from '../../assets/theme-colors';

// 图标导入
import { ReactComponent as LogoIcon } from '../../assets/icons/logo.svg';
import { ReactComponent as TodayIcon } from '../../assets/icons/today.svg';
import { ReactComponent as TasksIcon } from '../../assets/icons/tasks.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as AddIcon } from '../../assets/icons/add.svg';

// 按钮导入
import { ReactComponent as PrimaryButtonSVG } from '../../assets/buttons/primary-button.svg';
import { ReactComponent as SecondaryButtonSVG } from '../../assets/buttons/secondary-button.svg';
import { ReactComponent as DangerButtonSVG } from '../../assets/buttons/danger-button.svg';

// 背景导入
import { ReactComponent as InputBgSVG } from '../../assets/backgrounds/input-bg.svg';
import { ReactComponent as CardBgSVG } from '../../assets/backgrounds/card-bg.svg';

// 样式
const styles = {
  container: {
    maxWidth: '100%',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: themeColors.neutral,
    marginBottom: '20px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    color: themeColors.textDark,
    borderBottom: `2px solid ${themeColors.primary}`,
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '20px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    border: `1px solid ${themeColors.bgLight}`,
    borderRadius: '8px',
  },
  itemName: {
    marginTop: '10px',
    fontSize: '14px',
    color: themeColors.textMedium,
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '15px',
  },
  colorItem: {
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  colorName: {
    fontSize: '12px',
    marginBottom: '5px',
    color: themeColors.textMedium,
  },
  colorValue: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: themeColors.textLight,
  },
};

const MobileUIKit = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>OneThing 移动端UI组件库</h1>
      
      {/* 颜色部分 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>颜色主题</h2>
        <div style={styles.colorGrid}>
          {Object.entries(themeColors).map(([name, value]) => (
            <div key={name} style={styles.item}>
              <div style={{ 
                ...styles.colorItem,
                backgroundColor: value,
                color: ['bgLight', 'bgLighter', 'secondary'].includes(name) ? '#333' : '#fff'
              }}>
                <div style={styles.colorName}>{name}</div>
                <div style={styles.colorValue}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 图标部分 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>图标</h2>
        <div style={styles.grid}>
          <div style={styles.item}>
            <LogoIcon width="40" height="40" />
            <span style={styles.itemName}>Logo</span>
          </div>
          <div style={styles.item}>
            <TodayIcon width="32" height="32" />
            <span style={styles.itemName}>今日</span>
          </div>
          <div style={styles.item}>
            <TasksIcon width="32" height="32" />
            <span style={styles.itemName}>任务</span>
          </div>
          <div style={styles.item}>
            <SettingsIcon width="32" height="32" />
            <span style={styles.itemName}>设置</span>
          </div>
          <div style={styles.item}>
            <AddIcon width="32" height="32" />
            <span style={styles.itemName}>添加</span>
          </div>
        </div>
      </div>
      
      {/* 按钮部分 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>按钮</h2>
        <div style={styles.grid}>
          <div style={styles.item}>
            <PrimaryButtonSVG width="120" height="40" />
            <span style={styles.itemName}>主要按钮</span>
          </div>
          <div style={styles.item}>
            <SecondaryButtonSVG width="120" height="40" />
            <span style={styles.itemName}>次要按钮</span>
          </div>
          <div style={styles.item}>
            <DangerButtonSVG width="120" height="40" />
            <span style={styles.itemName}>警告按钮</span>
          </div>
        </div>
      </div>
      
      {/* 背景部分 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>容器与背景</h2>
        <div style={styles.grid}>
          <div style={styles.item}>
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'center' }}>
              <InputBgSVG />
            </div>
            <span style={styles.itemName}>输入框</span>
          </div>
          <div style={styles.item}>
            <div style={{ transform: 'scale(0.3)', transformOrigin: 'center' }}>
              <CardBgSVG />
            </div>
            <span style={styles.itemName}>卡片容器</span>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>设计规范说明</h2>
        <p>本UI组件库根据mobile@2x.svg设计稿进行切图，主要提取了以下元素：</p>
        <ul>
          <li>颜色主题：包括主色#4ECDC4、辅助色#A6E4D0、中性色#1A535C和点缀色#FF6B6B</li>
          <li>基础图标：页面导航和功能操作所需的图标集</li>
          <li>按钮样式：提供了三种常用按钮样式</li>
          <li>容器背景：常用的卡片和输入框等背景样式</li>
        </ul>
        <p>使用这些组件可快速开发符合设计稿的移动端界面。</p>
      </div>
    </div>
  );
};

export default MobileUIKit; 