export default {
  // Common
  app: {
    name: 'OneThing',
    tagline: 'Your AI Goal Management Assistant',
  },
  
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    goals: 'Goals',
    tasks: 'Tasks',
    emotions: 'Emotions',
    review: 'Review',
    companion: 'AI Companion',
    settings: 'Settings',
    help: 'Help',
  },
  
  // Dashboard page
  dashboard: {
    overview: 'Today\'s Overview',
    pendingTasks: 'Pending',
    goalProgress: 'Goal Progress',
    emotionStatus: 'Emotion Status',
    todayTasks: 'Today\'s Tasks',
    sort: 'Sort',
    viewAll: 'View All',
    dailyTasks: 'Daily Tasks',
    morningTasks: 'Morning',
    afternoonTasks: 'Afternoon',
    improvedComparedToYesterday: 'Improved by {{value}} from yesterday',
  },
  
  // Common elements
  common: {
    viewAll: 'View All',
    loading: 'Loading...',
    empty: 'No data',
    error: 'Error',
    retry: 'Retry',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  
  // Goals page
  goals: {
    management: 'Goal Management',
    newGoal: 'New Goal',
    allGoals: 'All Goals',
    inProgress: 'In Progress',
    completed: 'Completed',
    priority: 'Priority Goal',
    deadline: 'Deadline',
    completionRate: 'Completion Rate: {{value}}%',
    subgoals: 'Total {{count}} goals',
    viewDetails: 'View Details',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    summary: 'Goal Summary',
    noGoals: 'No goals yet',
    createFirst: 'Create your first goal',
    milestones: {
      planning: 'Initial Planning',
      midpoint: 'Midpoint Check',
      finalSprint: 'Final Sprint',
      completed: 'Goal Completed'
    },
    filterTitle: 'Goal Category',
    sortTitle: 'Sort By',
    sortByPriority: 'Priority',
    sortByDeadline: 'Deadline',
    sortByCompletion: 'Completion Rate',
    priorityLabels: {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    },
    deadlineLabel: 'Deadline',
    progress: 'Progress',
    subgoalProgress: 'Subgoals: {{completed}}/{{total}}',
    noGoalsYet: 'No goals yet, click \'New Goal\' to start'
  },
  
  // Tasks page
  tasks: {
    timeline: 'Timeline',
    kanban: 'Kanban',
    from: 'From',
    dailyTasks: 'Daily Tasks',
    calendar: 'Calendar',
    addTask: 'Add Task',
    letAIPlan: 'Let AI plan my day',
    todo: 'To Do',
    inProgress: 'In Progress',
    completed: 'Completed',
    discussWithAI: 'Discuss with AI'
  },
  
  // Emotions page
  emotions: {
    todayMood: 'Today\'s Mood',
    moodTypes: {
      happy: 'Happy',
      calm: 'Calm',
      sad: 'Sad',
      angry: 'Angry',
      anxious: 'Anxious',
      thoughtful: 'Thoughtful',
      excited: 'Excited',
      tired: 'Tired'
    },
    moodRecord: 'Mood Record',
    moodPlaceholder: 'Record your mood today...',
    save: 'Save',
    emotionJournal: 'Emotion Journal',
    trend: 'Emotion Trend',
    recentDistribution: 'Recent Emotion Distribution',
    recordToday: 'Record Today\'s Mood',
    noRecords: 'No emotion records yet',
    chart: {
      pleasantness: 'Pleasantness',
      energyLevel: 'Energy Level'
    },
    intensity: 'Intensity',
    relatedGoals: 'Related Goals',
    relatedTasks: 'Related Tasks',
    count: '',
    editRecord: 'Edit Emotion Record',
    howDoYouFeel: 'How do you feel today?',
    intensityScale: {
      weak: 'Weak',
      strong: 'Strong'
    },
    relatedFactors: 'Related Factors',
    factors: {
      work: 'Work',
      study: 'Study',
      health: 'Health',
      relationship: 'Relationship',
      family: 'Family',
      finance: 'Finance',
      personalGrowth: 'Personal Growth'
    },
    detailedDescription: 'Detailed Description',
    descriptionPlaceholder: 'What happened today? How do you feel?',
    date: 'Date'
  },
  
  // Review page
  review: {
    weekly: 'Weekly',
    monthly: 'Monthly',
    goalsOverview: 'Goals Overview',
    completionRate: 'Completion Rate',
    goalsProgressDetails: 'Goal Progress Details',
    weeklyCompletion: 'Completed This Week',
    bestTimeSlots: 'Time Efficiency Analysis',
    title: 'Review Analysis',
    dashboardDescription: 'Review your goal completion status and efficiency analysis',
    goToReview: 'Go to Review',
    currentWeek: 'This Week',
    currentMonth: 'This Month',
    customTimeRange: 'Custom Time Range',
    generateNew: 'Generate New Review',
    custom: 'Custom',
    to: 'to',
    review: 'Review',
    noReviews: 'No review records yet',
    generateFirst: 'Generate First Review Report',
    taskAnalysisAndOptimization: 'Task Analysis & Optimization',
    clickForDetails: 'Click review for more details',
    taskPerformanceAnalysis: 'Task Performance Analysis',
    strengths: 'Strengths',
    improvements: 'Areas for Improvement',
    sopRecommendations: 'SOP Process Optimization Suggestions',
    viewFullRecommendations: 'View Full Recommendations',
    weeklyReview: 'Weekly Review',
    monthlyReview: 'Monthly Review',
    dailyReview: 'Daily Review',
    reviewAnalysis: 'Review Analysis',
    overallProgress: 'Overall Progress',
    totalTasks: 'Total Tasks',
    completedTasks: 'Completed Tasks',
    completedItemsCount: '{{completed}}/{{total}} items completed',
    timeSpent: '{{hours}} hours spent',
    timeEfficiencyAnalysis: 'Time Efficiency Analysis',
    interruptionCount: 'Interruption Count',
    times: 'times',
    averageFocusTime: 'Average Focus Time',
    coreInsights: 'Core Insights',
    actionSuggestions: 'Action Suggestions',
    detailedAnalysis: 'Detailed Analysis',
    efficiency: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    sopAppliedAlert: 'Suggestions applied to your tomorrow\'s plan',
    applyToTomorrowPlan: 'Apply to Tomorrow\'s Plan',
    exportReport: 'Export Report',
    taskAnalysis: 'Task Analysis',
    sopOptimization: 'SOP Optimization',
    confirmGenerateMessage: 'Are you sure you want to generate a new review for {{timeRange}}?',
    generate: 'Generate',
    goalsProgress: 'Goals Progress',
    averageEfficiency: 'Average Efficiency'
  },
  
  // AI Companion page
  companion: {
    companionStatus: 'Companion Status',
    level: 'Level',
    growthValue: 'Growth Value',
    traits: 'Traits',
    interactionMemory: 'Interaction Memory',
    importantMoments: 'Important Moments',
    recentTopics: 'Recent Topics',
    interactionRituals: 'Interaction Rituals',
    morningPlan: 'Morning Plan',
    eveningReview: 'Evening Review',
    status: 'Status',
    notCompleted: 'Not Completed',
    availableAt: 'Available at',
    startMorningPlan: 'Start Morning Plan',
    setReminder: 'Set Reminder',
    chat: 'Chat',
    inputPlaceholder: 'Type a message...',
    errorResponse: 'Sorry, I encountered a problem. Please try again later.',
    thinking: 'Thinking...'
  },
  
  // Settings page
  settings: {
    title: 'Settings',
    account: 'Account Information',
    notifications: 'Notification Management',
    appSettings: 'App Settings',
    language: 'Language',
    theme: 'Theme',
    about: 'About Us',
    logout: 'Logout',
    deleteAccount: 'Delete Account',
    profile: 'Personal Profile',
    username: 'Username',
    email: 'Email',
    changePassword: 'Change Password',
    accountManagement: 'Account Management',
    workHabits: 'Work Habits Settings',
    workdays: 'Work Days',
    weekdays: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    },
    efficientWorkingHours: 'Efficient Working Hours',
    addTimeSlot: 'Add Time Slot',
    reminderSettings: 'Reminder Settings',
    taskReminder: 'Task Reminder',
    enabled: 'Enabled',
    minutesBefore: '{{minutes}} minutes before',
    morningPlanReminder: 'Morning Plan Reminder',
    eveningReviewReminder: 'Evening Review Reminder',
    dailyAt: 'Daily at {{time}}',
    interfaceSettings: 'Interface Settings',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    systemTheme: 'System',
    fontSize: 'Font Size',
    fontSizes: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large'
    }
  },
  
  // Welcome page
  welcome: {
    title: 'Welcome to OneThing',
    subtitle: 'Your AI Goal Management Assistant, helping you become a better self',
    getStarted: 'Get Started',
    watchIntro: 'Watch Intro Video',
  },
  
  // Common actions
  actions: {
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
  },
  
  // Common time expressions
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    year: 'Year'
  },
  
  // Help page
  help: {
    quickStart: 'Quick Start',
    howToSetGoals: 'How to Set Goals',
    dailyTaskManagement: 'Daily Task Management',
    emotionRecordingGuide: 'Emotion Recording Guide',
    communicateWithAI: 'Communicate with AI Assistant',
    viewAllGuides: 'View All Guides',
    interactiveTutorials: 'Interactive Tutorials',
    goalManagementMastery: 'Goal Management Mastery',
    progress: 'Progress',
    steps: ' steps',
    continueLearning: 'Continue Learning',
    emotionIntroduction: 'Emotion Awareness Introduction',
    notStarted: 'Not started',
    startTutorial: 'Start Tutorial',
    faq: 'Frequently Asked Questions',
    howToChangeReminderSettings: 'How to change reminder settings?',
    isMyDataSafe: 'Is my data safe?',
    howToExportGoals: 'How to export my goals?',
    howAICompanionGrows: 'How does the AI companion grow?',
    viewAllQuestions: 'View All Questions',
    shortcutGuide: 'Shortcut Guide',
    search: 'Search',
    searchShortcuts: 'Search shortcuts...',
    popularShortcuts: 'Popular Shortcuts',
    shortcuts: {
      newTask: 'New Task',
      goToDashboard: 'Go to Dashboard',
      search: 'Search'
    }
  },
  
  // Add Goal Modal
  addGoalModal: {
    title: 'Create New Goal',
    steps: {
      defineGoal: 'Set Goal',
      aiBreakdown: 'AI Breakdown',
      confirmAndSave: 'Confirm & Save'
    },
    labels: {
      title: 'Goal Title',
      description: 'Goal Description',
      priority: 'Priority',
      deadline: 'Deadline',
      selectIcon: 'Select Icon',
      subGoalList: 'Sub-goal List',
      addSubGoal: 'Add Sub-goal',
      confirmGoalInfo: 'Confirm Goal Information',
      useAiHelp: 'Use AI Assistant'
    },
    helpers: {
      title: 'Enter a clear and specific goal title',
      description: 'Describe the details of your goal, including background and desired outcome'
    },
    buttons: {
      next: 'Next',
      thinking: 'Thinking...',
      rebreakdown: 'Let AI Re-breakdown',
      save: 'Save Goal'
    },
    info: {
      noSubGoals: 'No sub-goals yet. Add manually or use AI breakdown.',
      aiHelperTitle: 'AI Assistant Tip',
      aiHelperDescription: 'Sub-goals should be clear, actionable small tasks. The overall goal progress will update automatically as each sub-goal is completed. You can add, delete, or edit AI-generated sub-goals as needed.',
      goalSaved: 'Goal setup complete! Click "Save Goal" to start your journey.',
      noSubGoalsManual: 'No sub-goals added manually.'
    },
    error: {
      missingTitle: 'Please enter the goal title',
      missingDeadline: 'Please select a deadline',
      noSubGoals: 'Please add at least one sub-goal',
      missingTitleForAI: 'Please enter the goal name first before using AI breakdown',
      aiBreakdownFailed: 'Failed to breakdown goal automatically: {{error}}'
    }
  },
}; 