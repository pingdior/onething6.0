export default {
  // 通用
  app: {
    name: 'onething-你的目标达成伙伴',
    tagline: '你的AI智能目标管理助手',
  },
  
  // 通用操作和文本
  common: {
    viewAll: '查看全部',
    loading: '加载中...',
    empty: '暂无数据',
    error: '出错了',
    retry: '重试',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
  },
  
  // 导航菜单
  nav: {
    dashboard: '仪表盘',
    goals: '目标',
    review: '复盘',
    emotions: '情绪',
    profile: '我的',
    tasks: '任务',
    companion: 'AI伴侣',
    settings: '设置',
    help: '帮助',
  },
  
  // 仪表盘页面
  dashboard: {
    overview: '今日概览',
    pendingTasks: '待完成',
    goalProgress: '整体目标完成率',
    emotionStatus: '当前情绪状态',
    todayTasks: '今日任务完成',
    sort: '排序',
    viewAll: '查看全部',
    dailyTasks: '每日任务',
    morningTasks: '上午',
    afternoonTasks: '下午',
    improvedComparedToYesterday: '比昨天提升了{{value}}',
  },
  
  // 目标页面
  goals: {
    summary: '目标管理',
    noGoals: '暂无目标',
    createFirst: '创建第一个目标',
    viewAll: '查看全部',
    management: '目标管理',
    newGoal: '新目标',
    allGoals: '所有目标',
    inProgress: '进行中',
    completed: '已完成',
    priority: '优先目标',
    deadline: '截止日期',
    completionRate: '完成率：{{value}}%',
    subgoals: '共 {{count}} 个目标',
    viewDetails: '查看详情',
    high: '高',
    medium: '中',
    low: '低',
    milestones: {
      planning: '初步规划',
      midpoint: '半程检查点',
      finalSprint: '最终冲刺',
      completed: '目标完成'
    },
    filterTitle: '目标分类',
    sortTitle: '排序方式',
    sortByPriority: '按优先级',
    sortByDeadline: '按截止日期',
    sortByCompletion: '按完成度',
    priorityLabels: {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级'
    },
    deadlineLabel: '截止',
    progress: '进度',
    subgoalProgress: '子目标: {{completed}}/{{total}}',
    noGoalsYet: '暂无目标，点击"新建目标"按钮开始'
  },
  
  // 任务页面
  tasks: {
    timeline: '时间线',
    kanban: '看板',
    from: '来自',
    dailyTasks: '每日任务',
    calendar: '日历',
    addTask: '添加任务',
    letAIPlan: '让AI帮我规划今天',
    todo: '待办',
    inProgress: '进行中',
    completed: '已完成',
    discussWithAI: '与AI讨论'
  },
  
  // 情绪页面
  emotions: {
    todayMood: '今日心情',
    moodTypes: {
      happy: '开心',
      calm: '平静',
      sad: '悲伤',
      angry: '愤怒',
      anxious: '焦虑',
      thoughtful: '思考',
      excited: '兴奋',
      tired: '疲惫'
    },
    moodRecord: '心情记录',
    moodPlaceholder: '记录今天的心情...',
    save: '保存',
    emotionJournal: '情绪日记',
    trend: '情绪趋势',
    recentDistribution: '近期情绪分布',
    recordToday: '记录今日心情',
    noRecords: '暂无情绪记录',
    chart: {
      pleasantness: '愉悦度',
      energyLevel: '能量水平'
    },
    intensity: '强度',
    relatedGoals: '相关目标',
    relatedTasks: '相关任务',
    count: '个',
    editRecord: '编辑情绪记录',
    howDoYouFeel: '你今天感觉如何？',
    intensityScale: {
      weak: '弱',
      strong: '强'
    },
    relatedFactors: '关联事件',
    factors: {
      work: '工作',
      study: '学习',
      health: '健康',
      relationship: '人际关系',
      family: '家庭',
      finance: '财务',
      personalGrowth: '个人成长'
    },
    detailedDescription: '详细描述',
    descriptionPlaceholder: '今天发生了什么？你的感受如何？',
    date: '日期'
  },
  
  // 复盘页面
  review: {
    title: '复盘分析',
    dashboardDescription: '查看你的目标完成状态和效率分析',
    goToReview: '前往复盘',
    weekly: '周报',
    monthly: '月报',
    goalsOverview: '目标概览',
    completionRate: '完成率',
    goalsProgressDetails: '目标进展详情',
    weeklyCompletion: '本周完成',
    bestTimeSlots: '时间效率分析',
    currentWeek: '本周',
    currentMonth: '本月',
    customTimeRange: '自定义时间段',
    generateNew: '生成新复盘',
    custom: '自定义',
    to: '至',
    review: '复盘',
    noReviews: '暂时没有复盘记录',
    generateFirst: '生成首个复盘报告',
    taskAnalysisAndOptimization: '任务分析与优化',
    clickForDetails: '更多详情点击复盘查看',
    taskPerformanceAnalysis: '任务表现分析',
    strengths: '做得好的方面',
    improvements: '需要改进的方面',
    sopRecommendations: 'SOP流程优化建议',
    viewFullRecommendations: '查看完整建议',
    weeklyReview: '周复盘',
    monthlyReview: '月复盘',
    dailyReview: '日复盘',
    reviewAnalysis: '复盘分析',
    overallProgress: '整体进度',
    totalTasks: '总任务数',
    completedTasks: '已完成任务',
    completedItemsCount: '已完成{{completed}}/{{total}}项',
    timeSpent: '花费时间{{hours}}小时',
    timeEfficiencyAnalysis: '时间效率分析',
    interruptionCount: '被打断次数',
    times: '次',
    averageFocusTime: '平均专注时间',
    coreInsights: '核心洞察',
    actionSuggestions: '行动建议',
    detailedAnalysis: '详细分析',
    efficiency: {
      high: '高效',
      medium: '一般',
      low: '低效'
    },
    sopAppliedAlert: '建议已应用到您的明日计划',
    applyToTomorrowPlan: '应用到明日计划',
    exportReport: '导出报告',
    taskAnalysis: '任务分析',
    sopOptimization: 'SOP优化',
    confirmGenerateMessage: '确定要为{{timeRange}}生成新的复盘吗？',
    generate: '生成',
    goalsProgress: '目标进展',
    averageEfficiency: '平均效率'
  },
  
  // AI伙伴页面
  companion: {
    companionStatus: '伙伴状态',
    level: '等级',
    growthValue: '成长值',
    traits: '特质',
    interactionMemory: '互动记忆',
    importantMoments: '重要时刻',
    recentTopics: '最近话题',
    interactionRituals: '互动仪式',
    morningPlan: '晨间计划',
    eveningReview: '晚间复盘',
    status: '状态',
    notCompleted: '未完成',
    availableAt: '可用',
    startMorningPlan: '开始晨间计划',
    setReminder: '设置提醒',
    chat: '聊天',
    inputPlaceholder: '输入消息...',
    errorResponse: '抱歉，我遇到了问题。请稍后再试。',
    thinking: '正在思考...'
  },
  
  // 设置页面
  settings: {
    title: '设置',
    account: '账户信息',
    notifications: '通知管理',
    appSettings: '应用设置',
    language: '语言',
    theme: '主题',
    about: '关于我们',
    logout: '退出登录',
    deleteAccount: '删除账户',
    profile: '个人资料',
    username: '用户名',
    email: '邮箱',
    changePassword: '修改密码',
    accountManagement: '账号管理',
    workHabits: '工作习惯设置',
    workdays: '工作日',
    weekdays: {
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日'
    },
    efficientWorkingHours: '高效工作时段',
    addTimeSlot: '添加时段',
    reminderSettings: '提醒设置',
    taskReminder: '任务提醒',
    enabled: '开启',
    minutesBefore: '提前{{minutes}}分钟',
    morningPlanReminder: '晨间计划提醒',
    eveningReviewReminder: '晚间复盘提醒',
    dailyAt: '每天 {{time}}',
    interfaceSettings: '界面设置',
    lightTheme: '浅色',
    darkTheme: '深色',
    systemTheme: '跟随系统',
    fontSize: '字体大小',
    fontSizes: {
      small: '小',
      medium: '中',
      large: '大'
    }
  },
  
  // 欢迎页面
  welcome: {
    title: '欢迎使用 OneThing',
    subtitle: '你的AI智能目标管理助手，帮你实现更好的自己',
    getStarted: '开始体验',
    watchIntro: '观看介绍视频',
  },
  
  // 通用操作
  actions: {
    add: '添加',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
  },
  
  // 通用时间表示
  time: {
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    days: '天',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    year: '年'
  },
  
  // 帮助页面
  help: {
    quickStart: '快速入门',
    howToSetGoals: '如何设定目标',
    dailyTaskManagement: '每日任务管理',
    emotionRecordingGuide: '情绪记录指南',
    communicateWithAI: '与AI伙伴交流',
    viewAllGuides: '查看所有入门指南',
    interactiveTutorials: '交互式教程',
    goalManagementMastery: '目标管理精通',
    progress: '进度',
    steps: '步',
    continueLearning: '继续学习',
    emotionIntroduction: '情绪认知入门',
    notStarted: '未开始',
    startTutorial: '开始教程',
    faq: '常见问题',
    howToChangeReminderSettings: '如何更改提醒设置？',
    isMyDataSafe: '我的数据安全吗？',
    howToExportGoals: '如何导出我的目标？',
    howAICompanionGrows: 'AI伙伴如何成长？',
    viewAllQuestions: '查看所有问题',
    shortcutGuide: '快捷操作手册',
    search: '搜索',
    searchShortcuts: '搜索快捷操作...',
    popularShortcuts: '热门快捷键',
    shortcuts: {
      newTask: '新建任务',
      goToDashboard: '转到仪表盘',
      search: '搜索'
    }
  },
  
  // 添加目标模态框 (Add Goal Modal)
  addGoalModal: {
    title: '创建新目标',
    steps: {
      defineGoal: '设定目标',
      aiBreakdown: 'AI分解目标',
      confirmAndSave: '确认并保存'
    },
    labels: {
      title: '目标标题',
      description: '目标描述',
      priority: '优先级',
      deadline: '截止日期',
      selectIcon: '选择图标',
      subGoalList: '子目标清单',
      addSubGoal: '添加子目标',
      confirmGoalInfo: '确认目标信息',
      useAiHelp: '使用AI辅助'
    },
    helpers: {
      title: '请输入清晰、具体的目标标题',
      description: '描述你的目标细节，包括背景和期望达成的结果'
    },
    buttons: {
      next: '下一步',
      thinking: '正在思考...',
      rebreakdown: '让AI重新分解目标',
      save: '保存目标'
    },
    info: {
      noSubGoals: '暂无子目标，请手动添加或使用AI自动分解',
      aiHelperTitle: 'AI助手提示',
      aiHelperDescription: '子目标应该是清晰可执行的小任务，每个子目标完成后，整体目标的进度会自动更新。你可以根据需要添加、删除或编辑AI生成的子目标。',
      goalSaved: '目标设置完成！点击"保存目标"按钮开始你的旅程。',
      noSubGoalsManual: '未手动添加子目标。'
    },
    error: {
      missingTitle: '请输入目标标题',
      missingDeadline: '请选择截止日期',
      noSubGoals: '请至少添加一个子目标',
      missingTitleForAI: '请先输入目标名称再使用AI分解',
      aiBreakdownFailed: '自动分解目标失败: {{error}}'
    }
  },
}; 