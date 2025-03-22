// 简单的内存模拟数据
let goals = [
  {
    id: '1',
    title: 'PMP认证',
    description: '完成PMP项目管理认证',
    priority: 'high',
    deadline: '2024-06-30',
    progress: 68,
    createdAt: new Date().toISOString(),
    subgoals: [
      { id: '1-1', title: 'PMBOK第1章', completed: true, goalId: '1' },
      { id: '1-2', title: 'PMBOK第2章', completed: true, goalId: '1' },
      { id: '1-3', title: 'PMBOK第3章', completed: true, goalId: '1' },
    ]
  },
  {
    id: '2',
    title: '健身计划',
    description: '完成年度健身计划',
    priority: 'medium',
    deadline: '2024-12-31',
    progress: 45,
    createdAt: new Date().toISOString(),
    subgoals: [
      { id: '2-1', title: '减重5kg', completed: false, goalId: '2' },
      { id: '2-2', title: '每周3次训练', completed: true, goalId: '2' },
    ]
  }
];

let tasks = [
  {
    id: '1',
    title: '完成项目提案初稿',
    time: '9:00',
    completed: false,
    source: '项目管理',
    goalId: '1'
  },
  {
    id: '2',
    title: '团队周会',
    time: '11:00-12:00',
    completed: false,
    source: '工作安排'
  },
  {
    id: '3',
    title: '健身训练',
    time: '15:00-16:00',
    completed: false,
    source: '健身计划',
    goalId: '2'
  }
];

const resolvers = {
  Query: {
    goals: () => goals,
    goal: (_, { id }) => goals.find(goal => goal.id === id),
    tasks: () => tasks,
    task: (_, { id }) => tasks.find(task => task.id === id)
  },
  
  Mutation: {
    createGoal: (_, { title, description, priority, deadline }) => {
      const newGoal = {
        id: String(goals.length + 1),
        title,
        description,
        priority,
        deadline,
        progress: 0,
        createdAt: new Date().toISOString(),
        subgoals: []
      };
      goals.push(newGoal);
      return newGoal;
    },
    
    updateGoal: (_, { id, ...updates }) => {
      const goalIndex = goals.findIndex(goal => goal.id === id);
      if (goalIndex === -1) throw new Error('目标不存在');
      
      goals[goalIndex] = {
        ...goals[goalIndex],
        ...updates
      };
      
      return goals[goalIndex];
    },
    
    deleteGoal: (_, { id }) => {
      const initialLength = goals.length;
      goals = goals.filter(goal => goal.id !== id);
      return goals.length < initialLength;
    },
    
    createTask: (_, { title, description, time, goalId }) => {
      const newTask = {
        id: String(tasks.length + 1),
        title,
        description,
        time,
        completed: false,
        goalId
      };
      tasks.push(newTask);
      return newTask;
    },
    
    updateTask: (_, { id, ...updates }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error('任务不存在');
      
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates
      };
      
      return tasks[taskIndex];
    },
    
    deleteTask: (_, { id }) => {
      const initialLength = tasks.length;
      tasks = tasks.filter(task => task.id !== id);
      return tasks.length < initialLength;
    }
  }
};

module.exports = resolvers; 