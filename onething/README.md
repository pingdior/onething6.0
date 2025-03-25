# OneThing - AI智能目标管理助手

OneThing是一款基于AI技术的智能目标管理助手，帮助用户更高效地设定、跟踪和完成目标。通过AI辅助，OneThing能够智能分析用户的目标完成情况，提供个性化建议，并帮助用户持续进步。

## 功能特点

- **智能目标管理**：设定、跟踪和完成目标
- **任务管理**：将目标拆分为可执行的任务
- **情绪追踪**：记录和分析情绪变化
- **周期复盘**：定期回顾进展，优化计划
- **AI伙伴**：提供个性化指导和建议

## 新增功能

### 多语言支持

OneThing现已支持以下三种语言：

- 中文
- 英文
- 日文

系统会自动检测用户设备的默认语言进行设置，用户也可以通过界面右上角的语言切换器手动切换语言。

### 移动端适配

OneThing已优化了移动端体验，适配了各种移动设备：

- 响应式布局，在不同尺寸的设备上都能良好显示
- 针对移动设备优化的UI交互，包括触摸手势等
- 底部导航栏，方便单手操作
- 针对iOS安全区域的特殊适配

## 技术栈

- **前端**：React, TypeScript, Material UI, Zustand
- **后端**：Express, GraphQL, MongoDB
- **AI技术**：DeepSeek API, LangChain

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

这将同时启动前端和后端服务。

3. 访问应用

在浏览器中访问 `http://localhost:3000`

## 部署

构建生产版本：

```bash
npm run build
```

启动生产服务器：

```bash
npm run start
```

## 环境变量

应用使用以下环境变量：

- `REACT_APP_API_URL`：API服务器地址
- `PORT`：服务器端口
- `NODE_ENV`：环境（development/production）
- `MONGO_URI`：MongoDB连接字符串
- `DEEPSEEK_API_KEY`：DeepSeek API密钥

## 贡献

欢迎提交问题和贡献代码！ 