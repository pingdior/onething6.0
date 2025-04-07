export default {
  // 通用
  app: {
    name: 'OneThing',
    tagline: 'あなたのAIゴール管理アシスタント',
  },
  
  // 通用操作和文本
  common: {
    viewAll: 'すべて表示',
    loading: '読み込み中...',
    empty: 'データなし',
    error: 'エラー',
    retry: '再試行',
    success: '成功',
    confirm: '確認',
    cancel: 'キャンセル',
  },
  
  // 导航菜单
  nav: {
    dashboard: 'ダッシュボード',
    goals: '目標',
    tasks: 'タスク',
    emotions: '感情',
    review: 'レビュー',
    companion: 'AIパートナー',
    settings: '設定',
    help: 'ヘルプ',
  },
  
  // 仪表盘页面
  dashboard: {
    overview: '今日の概要',
    pendingTasks: '未完了',
    goalProgress: '全体的な目標進捗',
    emotionStatus: '現在の感情状態',
    todayTasks: '今日のタスク完了',
    sort: '並べ替え',
    viewAll: 'すべて表示',
    dailyTasks: '毎日のタスク',
    morningTasks: '午前',
    afternoonTasks: '午後',
    improvedComparedToYesterday: '昨日より{{value}}改善',
  },
  
  // 目标页面
  goals: {
    management: '目標管理',
    newGoal: '新しい目標',
    allGoals: 'すべての目標',
    inProgress: '進行中',
    completed: '完了',
    priority: '優先目標',
    deadline: '期限',
    completionRate: '完了率: {{value}}%',
    subgoals: '合計 {{count}} 目標',
    viewDetails: '詳細を見る',
    high: '高',
    medium: '中',
    low: '低',
    summary: '目標概要',
    noGoals: '目標がありません',
    createFirst: '最初の目標を作成',
    milestones: {
      planning: '初期計画',
      midpoint: '中間チェック',
      finalSprint: '最終スプリント',
      completed: '目標達成'
    },
    filterTitle: '目標カテゴリ',
    sortTitle: '並べ替え',
    sortByPriority: '優先度順',
    sortByDeadline: '期限順',
    sortByCompletion: '完了率順',
    priorityLabels: {
      high: '高優先度',
      medium: '中優先度',
      low: '低優先度'
    },
    deadlineLabel: '期限',
    progress: '進捗',
    subgoalProgress: 'サブ目標: {{completed}}/{{total}}',
    noGoalsYet: '目標はまだありません。「新しい目標」をクリックして開始します'
  },
  
  // 任务页面
  tasks: {
    timeline: 'タイムライン',
    kanban: 'カンバン',
    from: '由来',
    dailyTasks: '毎日のタスク',
    calendar: 'カレンダー',
    addTask: 'タスクを追加',
    letAIPlan: 'AIに今日の計画を手伝ってもらう',
    todo: '未着手',
    inProgress: '進行中',
    completed: '完了',
    discussWithAI: 'AIと相談'
  },
  
  // 情绪页面
  emotions: {
    todayMood: '今日の気分',
    moodTypes: {
      happy: '幸せ',
      calm: '穏やか',
      sad: '悲しい',
      angry: '怒り',
      anxious: '不安',
      thoughtful: '思慮深い',
      excited: '興奮',
      tired: '疲れた'
    },
    moodRecord: '気分記録',
    moodPlaceholder: '今日の気分を記録してください...',
    save: '保存',
    emotionJournal: '感情日記',
    trend: '感情の傾向',
    recentDistribution: '最近の感情分布',
    recordToday: '今日の気分を記録',
    noRecords: '感情記録はまだありません',
    chart: {
      pleasantness: '快適度',
      energyLevel: 'エネルギーレベル'
    },
    intensity: '強度',
    relatedGoals: '関連目標',
    relatedTasks: '関連タスク',
    count: '個',
    editRecord: '感情記録を編集',
    howDoYouFeel: '今日の気分はどうですか？',
    intensityScale: {
      weak: '弱い',
      strong: '強い'
    },
    relatedFactors: '関連要因',
    factors: {
      work: '仕事',
      study: '勉強',
      health: '健康',
      relationship: '人間関係',
      family: '家族',
      finance: '財務',
      personalGrowth: '自己成長'
    },
    detailedDescription: '詳細な説明',
    descriptionPlaceholder: '今日何がありましたか？どんな気分ですか？',
    date: '日付'
  },
  
  // 复盘页面
  review: {
    weekly: '週報',
    monthly: '月報',
    goalsOverview: '目標の概要',
    completionRate: '完了率',
    goalsProgressDetails: '目標の進捗詳細',
    weeklyCompletion: '今週の完了',
    bestTimeSlots: '時間効率分析',
    title: 'レビュー分析',
    dashboardDescription: '目標の完了状況と効率の分析を確認',
    goToReview: 'レビューへ',
    currentWeek: '今週',
    currentMonth: '今月',
    customTimeRange: 'カスタム期間',
    generateNew: '新しいレビューを生成',
    custom: 'カスタム',
    to: 'から',
    review: 'レビュー',
    noReviews: 'まだレビュー記録がありません',
    generateFirst: '最初のレビューレポートを生成',
    taskAnalysisAndOptimization: 'タスク分析と最適化',
    clickForDetails: '詳細はレビューをクリック',
    taskPerformanceAnalysis: 'タスクパフォーマンス分析',
    strengths: '強み',
    improvements: '改善点',
    sopRecommendations: 'SOPプロセス最適化提案',
    viewFullRecommendations: '推奨事項をすべて表示',
    weeklyReview: '週間レビュー',
    monthlyReview: '月間レビュー',
    dailyReview: '日次レビュー',
    reviewAnalysis: 'レビュー分析',
    overallProgress: '全体の進捗',
    totalTasks: '総タスク数',
    completedTasks: '完了タスク',
    completedItemsCount: '{{completed}}/{{total}}項目が完了',
    timeSpent: '{{hours}}時間費やしました',
    timeEfficiencyAnalysis: '時間効率分析',
    interruptionCount: '中断回数',
    times: '回',
    averageFocusTime: '平均集中時間',
    coreInsights: '主要な洞察',
    actionSuggestions: '行動提案',
    detailedAnalysis: '詳細分析',
    efficiency: {
      high: '高効率',
      medium: '普通',
      low: '低効率'
    },
    sopAppliedAlert: '提案が明日の計画に適用されました',
    applyToTomorrowPlan: '明日の計画に適用',
    exportReport: 'レポートをエクスポート',
    taskAnalysis: 'タスク分析',
    sopOptimization: 'SOP最適化',
    confirmGenerateMessage: '{{timeRange}}の新しいレビューを生成しますか？',
    generate: '生成',
    goalsProgress: '目標の進捗',
    averageEfficiency: '平均効率'
  },
  
  // AI伙伴页面
  companion: {
    companionStatus: 'パートナーの状態',
    level: 'レベル',
    growthValue: '成長値',
    traits: '特性',
    interactionMemory: '交流の記憶',
    importantMoments: '重要な瞬間',
    recentTopics: '最近のトピック',
    interactionRituals: '交流の儀式',
    morningPlan: '朝のプラン',
    eveningReview: '夜のレビュー',
    status: '状態',
    notCompleted: '未完了',
    availableAt: '利用可能時間',
    startMorningPlan: '朝のプランを開始',
    setReminder: 'リマインダーを設定',
    chat: 'チャット',
    inputPlaceholder: 'メッセージを入力...',
    errorResponse: '申し訳ありません、問題が発生しました。後でもう一度お試しください。',
    thinking: '考え中...'
  },
  
  // 设置页面
  settings: {
    title: '設定',
    account: 'アカウント情報',
    notifications: '通知管理',
    appSettings: 'アプリ設定',
    language: '言語',
    theme: 'テーマ',
    about: '私たちについて',
    logout: 'ログアウト',
    deleteAccount: 'アカウント削除',
    profile: '個人プロフィール',
    username: 'ユーザー名',
    email: 'メールアドレス',
    changePassword: 'パスワード変更',
    accountManagement: 'アカウント管理',
    workHabits: '作業習慣設定',
    workdays: '勤務日',
    weekdays: {
      monday: '月曜日',
      tuesday: '火曜日',
      wednesday: '水曜日',
      thursday: '木曜日',
      friday: '金曜日',
      saturday: '土曜日',
      sunday: '日曜日'
    },
    efficientWorkingHours: '効率的な作業時間',
    addTimeSlot: '時間枠を追加',
    reminderSettings: 'リマインダー設定',
    taskReminder: 'タスクリマインダー',
    enabled: '有効',
    minutesBefore: '{{minutes}}分前',
    morningPlanReminder: '朝の計画リマインダー',
    eveningReviewReminder: '夜のレビューリマインダー',
    dailyAt: '毎日 {{time}}',
    interfaceSettings: 'インターフェース設定',
    lightTheme: 'ライト',
    darkTheme: 'ダーク',
    systemTheme: 'システム設定に従う',
    fontSize: 'フォントサイズ',
    fontSizes: {
      small: '小',
      medium: '中',
      large: '大'
    }
  },
  
  // 欢迎页面
  welcome: {
    title: 'OneThing へようこそ',
    subtitle: 'より良い自分を実現するためのAIゴール管理アシスタント',
    getStarted: '始める',
    watchIntro: '紹介ビデオを見る',
  },
  
  // 通用操作
  actions: {
    add: '追加',
    edit: '編集',
    delete: '削除',
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    back: '戻る',
  },
  
  // 通用时间表示
  time: {
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日',
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    year: '年'
  },
  
  // 帮助页面
  help: {
    quickStart: 'クイックスタート',
    howToSetGoals: '目標の設定方法',
    dailyTaskManagement: '毎日のタスク管理',
    emotionRecordingGuide: '感情記録ガイド',
    communicateWithAI: 'AIアシスタントとの対話',
    viewAllGuides: 'すべてのガイドを見る',
    interactiveTutorials: 'インタラクティブチュートリアル',
    goalManagementMastery: '目標管理マスタリー',
    progress: '進捗',
    steps: 'ステップ',
    continueLearning: '学習を続ける',
    emotionIntroduction: '感情認識入門',
    notStarted: '未開始',
    startTutorial: 'チュートリアルを開始',
    faq: 'よくある質問',
    howToChangeReminderSettings: 'リマインダー設定を変更するには？',
    isMyDataSafe: '私のデータは安全ですか？',
    howToExportGoals: '目標をエクスポートするには？',
    howAICompanionGrows: 'AIパートナーはどのように成長しますか？',
    viewAllQuestions: 'すべての質問を見る',
    shortcutGuide: 'ショートカットガイド',
    search: '検索',
    searchShortcuts: 'ショートカットを検索...',
    popularShortcuts: '人気のショートカット',
    shortcuts: {
      newTask: '新規タスク',
      goToDashboard: 'ダッシュボードに移動',
      search: '検索'
    }
  },
  
  // 目標追加モーダル (Add Goal Modal)
  addGoalModal: {
    title: '新しい目標を作成',
    steps: {
      defineGoal: '目標を設定',
      aiBreakdown: 'AIで分解',
      confirmAndSave: '確認して保存'
    },
    labels: {
      title: '目標タイトル',
      description: '目標の説明',
      priority: '優先度',
      deadline: '締め切り',
      selectIcon: 'アイコンを選択',
      subGoalList: 'サブ目標リスト',
      addSubGoal: 'サブ目標を追加',
      confirmGoalInfo: '目標情報を確認',
      useAiHelp: 'AIアシスタントを使用'
    },
    helpers: {
      title: '明確で具体的な目標タイトルを入力してください',
      description: '目標の詳細（背景や期待される結果など）を記述してください'
    },
    buttons: {
      next: '次へ',
      thinking: '考え中...',
      rebreakdown: 'AIに再分解させる',
      save: '目標を保存'
    },
    info: {
      noSubGoals: 'サブ目標はまだありません。手動で追加するか、AI分解を使用してください。',
      aiHelperTitle: 'AIアシスタントのヒント',
      aiHelperDescription: 'サブ目標は明確で実行可能な小さなタスクであるべきです。各サブ目標が完了すると、全体の目標進捗が自動的に更新されます。必要に応じて、AIが生成したサブ目標を追加、削除、編集できます。',
      goalSaved: '目標設定が完了しました！「目標を保存」をクリックして始めましょう。',
      noSubGoalsManual: 'サブ目標は手動で追加されていません。'
    },
    error: {
      missingTitle: '目標タイトルを入力してください',
      missingDeadline: '締め切りを選択してください',
      noSubGoals: '少なくとも1つのサブ目標を追加してください',
      missingTitleForAI: 'AI分解を使用する前に、まず目標名を入力してください',
      aiBreakdownFailed: '目標の自動分解に失敗しました: {{error}}'
    }
  },
}; 