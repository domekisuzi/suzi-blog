// ========================================
// 任务管理数据类型定义
// ========================================

// 任务优先级枚举
export type TaskPriority = 'low' | 'medium' | 'high'
export const TaskPriorityValues: TaskPriority[] = ['low', 'medium', 'high']

// 目标类型枚举
export type GoalType = 'yearly' | 'monthly' | 'longterm'
export const GoalTypeValues: GoalType[] = ['yearly', 'monthly', 'longterm']

// 目标类型中文映射
export const GoalTypeLabels: Record<GoalType, string> = {
  yearly: '年度目标',
  monthly: '月度目标',
  longterm: '长期目标'
}

// Todo 类型枚举
export type TodoType = 'daily' | 'weekly'
export const TodoTypeValues: TodoType[] = ['daily', 'weekly']

// ========================================
// 大目标 (Goal) - 年度/月度/长期目标
// ========================================
export interface Goal {
  id: string
  title: string
  description?: string
  type: GoalType           // 年度/月度/长期
  category?: string        // 分类：日语、英语、健身、工作等
  progress: number         // 进度 0-100
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt?: string
  milestones?: Milestone[]
  tasks?: Task[]
}

// ========================================
// 里程碑 (Milestone) - 大目标的关键节点
// ========================================
export interface Milestone {
  id: string
  goalId: string
  title: string
  completed: boolean
  dueDate?: string
  createdAt: string
}

// ========================================
// 子任务 (Subtask)
// ========================================
export interface Subtask {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt?: string
  dueDate?: string
  taskId: string
}

// ========================================
// 任务 (Task) - 可属于目标或独立存在
// ========================================
export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt?: string
  subtasks?: Subtask[]
  moduleName?: string
  goalId?: string          // 关联的目标（可选）
}

// ========================================
// 日常待办 (Todo) - 日/周任务，独立存在
// ========================================
export interface Todo {
  id: string
  title: string
  type: TodoType           // daily / weekly
  completed: boolean
  dueDate?: string         // 具体日期
  weekNumber?: number      // 周数（用于周任务）
  createdAt: string
  completedAt?: string
}

// ========================================
// 视图对象 (VO)
// ========================================
export interface TaskDetailVo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority?: TaskPriority
  dueDate?: string
  createdAt: string
  subtasks?: Subtask[]
  moduleName?: string
  completedRate: string
}

export interface GoalDetailVo {
  id: string
  title: string
  description?: string
  type: GoalType
  category?: string
  progress: number
  startDate?: string
  endDate?: string
  createdAt: string
  milestoneCount: number
  completedMilestoneCount: number
  taskCount: number
  completedTaskCount: number
}

// ========================================
// 分类
// ========================================
export interface TaskCategory {
  id: string
  name: string
  color?: string
  icon?: string
}