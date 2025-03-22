const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # 目标类型
  type Goal {
    id: ID!
    title: String!
    description: String
    priority: String!
    deadline: String!
    progress: Float!
    createdAt: String!
    subgoals: [SubGoal!]!
  }
  
  type SubGoal {
    id: ID!
    title: String!
    completed: Boolean!
    goalId: ID!
  }
  
  enum Priority {
    high
    medium
    low
  }
  
  # 任务类型
  type Task {
    id: ID!
    title: String!
    description: String
    time: String
    dueDate: String
    completed: Boolean!
    goalId: ID
    source: String
  }
  
  # 情绪类型
  type Emotion {
    id: ID!
    type: EmotionType!
    intensity: Int!
    date: String!
    notes: String
    triggers: [String!]
  }
  
  enum EmotionType {
    happy
    calm
    sad
    angry
    anxious
    thoughtful
  }
  
  # 用户类型
  type User {
    id: ID!
    name: String!
    email: String!
    preferences: UserPreferences!
  }
  
  type UserPreferences {
    theme: Theme!
    workDays: [Int!]!
    workHours: [WorkHour!]!
    notifications: NotificationSettings!
  }
  
  enum Theme {
    light
    dark
    system
  }
  
  type WorkHour {
    start: String!
    end: String!
  }
  
  type NotificationSettings {
    tasks: Boolean!
    goals: Boolean!
    emotions: Boolean!
  }
  
  # 查询
  type Query {
    # 目标相关查询
    goals: [Goal!]!
    goal(id: ID!): Goal
    
    # 任务相关查询
    tasks: [Task!]!
    tasksByDate(date: String!): [Task!]!
    task(id: ID!): Task
    
    # 情绪相关查询
    emotions: [Emotion!]!
    emotionsByDateRange(startDate: String!, endDate: String!): [Emotion!]!
    emotion(id: ID!): Emotion
    
    # 用户相关查询
    me: User!
  }
  
  # 变更
  type Mutation {
    # 目标相关变更
    createGoal(title: String!, description: String, priority: String!, deadline: String!): Goal!
    updateGoal(id: ID!, title: String, description: String, priority: String, deadline: String): Goal!
    deleteGoal(id: ID!): Boolean!
    
    addSubGoal(goalId: ID!, input: SubGoalInput!): SubGoal!
    updateSubGoal(id: ID!, completed: Boolean!): SubGoal!
    deleteSubGoal(id: ID!): Boolean!
    
    # 任务相关变更
    createTask(title: String!, description: String, time: String, goalId: ID): Task!
    updateTask(id: ID!, title: String, description: String, time: String, completed: Boolean): Task!
    deleteTask(id: ID!): Boolean!
    
    # 情绪相关变更
    recordEmotion(input: EmotionInput!): Emotion!
    updateEmotion(id: ID!, input: EmotionInput!): Emotion!
    deleteEmotion(id: ID!): Boolean!
    
    # 用户相关变更
    updateUserPreferences(input: UserPreferencesInput!): User!
  }
  
  # 输入类型
  input GoalInput {
    title: String!
    description: String
    priority: String!
    deadline: String!
  }
  
  input SubGoalInput {
    title: String!
    completed: Boolean = false
  }
  
  input TaskInput {
    title: String!
    description: String
    time: String
    dueDate: String
    completed: Boolean
    goalId: ID
    source: String
  }
  
  input EmotionInput {
    type: EmotionType!
    intensity: Int!
    date: String
    notes: String
    triggers: [String!]
  }
  
  input UserPreferencesInput {
    theme: Theme
    workDays: [Int!]
    workHours: [WorkHourInput!]
    notifications: NotificationSettingsInput
  }
  
  input WorkHourInput {
    start: String!
    end: String!
  }
  
  input NotificationSettingsInput {
    tasks: Boolean
    goals: Boolean
    emotions: Boolean
  }
`;

module.exports = typeDefs; 