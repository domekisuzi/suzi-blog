/**
 * 本地存储服务 - 模拟后端API
 * 在开发模式下使用 localStorage 存储数据，无需后端
 */

import { Module, ModuleDetailVo } from '../../domains/module/model/module'
import { Subtask, Task, TaskDetailVo, Goal, Milestone, Todo } from '../../domains/task/model/taskTypes'

const STORAGE_KEYS = {
  MODULES: 'suzi_blog_modules',
  TASKS: 'suzi_blog_tasks',
  SUBTASKS: 'suzi_blog_subtasks',
  GOALS: 'suzi_blog_goals',
  MILESTONES: 'suzi_blog_milestones',
  TODOS: 'suzi_blog_todos',
}

// ============ 工具函数 ============

const generateId = (): string => {
  return crypto.randomUUID()
}

const getCurrentTime = (): string => {
  return new Date().toISOString()
}

const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const saveToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

// ============ Goal/大目标 相关 ============

export const goalApi = {
  getAll: async (): Promise<Goal[]> => {
    return getFromStorage<Goal>(STORAGE_KEYS.GOALS)
  },

  getById: async (id: string): Promise<Goal | null> => {
    const goals = getFromStorage<Goal>(STORAGE_KEYS.GOALS)
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    
    const goal = goals.find(g => g.id === id)
    if (!goal) return null
    
    return {
      ...goal,
      milestones: milestones.filter(m => m.goalId === id),
      tasks: tasks.filter(t => t.goalId === id)
    }
  },

  create: async (goal: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> => {
    const goals = getFromStorage<Goal>(STORAGE_KEYS.GOALS)
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: getCurrentTime(),
    }
    goals.push(newGoal)
    saveToStorage(STORAGE_KEYS.GOALS, goals)
    return newGoal
  },

  update: async (id: string, updates: Partial<Goal>): Promise<void> => {
    const goals = getFromStorage<Goal>(STORAGE_KEYS.GOALS)
    const index = goals.findIndex(g => g.id === id)
    if (index === -1) throw new Error('Goal not found')
    
    goals[index] = { ...goals[index], ...updates, updatedAt: getCurrentTime() }
    saveToStorage(STORAGE_KEYS.GOALS, goals)
  },

  delete: async (id: string): Promise<void> => {
    const goals = getFromStorage<Goal>(STORAGE_KEYS.GOALS)
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    
    saveToStorage(STORAGE_KEYS.GOALS, goals.filter(g => g.id !== id))
    saveToStorage(STORAGE_KEYS.MILESTONES, milestones.filter(m => m.goalId !== id))
  },
}

// ============ Milestone/里程碑 相关 ============

export const milestoneApi = {
  getByGoalId: async (goalId: string): Promise<Milestone[]> => {
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    return milestones.filter(m => m.goalId === goalId)
  },

  create: async (milestone: Omit<Milestone, 'id' | 'createdAt'>): Promise<Milestone> => {
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    const newMilestone: Milestone = {
      ...milestone,
      id: generateId(),
      createdAt: getCurrentTime(),
    }
    milestones.push(newMilestone)
    saveToStorage(STORAGE_KEYS.MILESTONES, milestones)
    return newMilestone
  },

  update: async (id: string, updates: Partial<Milestone>): Promise<void> => {
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    const index = milestones.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Milestone not found')
    
    milestones[index] = { ...milestones[index], ...updates }
    saveToStorage(STORAGE_KEYS.MILESTONES, milestones)
  },

  delete: async (id: string): Promise<void> => {
    const milestones = getFromStorage<Milestone>(STORAGE_KEYS.MILESTONES)
    saveToStorage(STORAGE_KEYS.MILESTONES, milestones.filter(m => m.id !== id))
  },
}

// ============ Todo/日常待办 相关 ============

export const todoApi = {
  getAll: async (): Promise<Todo[]> => {
    return getFromStorage<Todo>(STORAGE_KEYS.TODOS)
  },

  getByType: async (type: 'daily' | 'weekly'): Promise<Todo[]> => {
    const todos = getFromStorage<Todo>(STORAGE_KEYS.TODOS)
    const today = new Date().toISOString().split('T')[0]
    
    if (type === 'daily') {
      return todos.filter(t => t.type === 'daily' && t.dueDate === today)
    } else {
      return todos.filter(t => t.type === 'weekly')
    }
  },

  create: async (todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> => {
    const todos = getFromStorage<Todo>(STORAGE_KEYS.TODOS)
    const newTodo: Todo = {
      ...todo,
      id: generateId(),
      createdAt: getCurrentTime(),
    }
    todos.push(newTodo)
    saveToStorage(STORAGE_KEYS.TODOS, todos)
    return newTodo
  },

  update: async (id: string, updates: Partial<Todo>): Promise<void> => {
    const todos = getFromStorage<Todo>(STORAGE_KEYS.TODOS)
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Todo not found')
    
    todos[index] = { 
      ...todos[index], 
      ...updates,
      completedAt: updates.completed ? getCurrentTime() : undefined
    }
    saveToStorage(STORAGE_KEYS.TODOS, todos)
  },

  delete: async (id: string): Promise<void> => {
    const todos = getFromStorage<Todo>(STORAGE_KEYS.TODOS)
    saveToStorage(STORAGE_KEYS.TODOS, todos.filter(t => t.id !== id))
  },
}

// ============ Module/Project 相关 ============

export const moduleApi = {
  getAll: async (): Promise<Module[]> => {
    return getFromStorage<Module>(STORAGE_KEYS.MODULES)
  },

  getById: async (id: string): Promise<Module | null> => {
    const modules = getFromStorage<Module>(STORAGE_KEYS.MODULES)
    return modules.find(m => m.id === id) || null
  },

  create: async (module: Omit<Module, 'id'>): Promise<Module> => {
    const modules = getFromStorage<Module>(STORAGE_KEYS.MODULES)
    const newModule: Module = { ...module, id: generateId() }
    modules.push(newModule)
    saveToStorage(STORAGE_KEYS.MODULES, modules)
    return newModule
  },

  update: async (id: string, updates: Partial<Module>): Promise<Module> => {
    const modules = getFromStorage<Module>(STORAGE_KEYS.MODULES)
    const index = modules.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Module not found')
    modules[index] = { ...modules[index], ...updates }
    saveToStorage(STORAGE_KEYS.MODULES, modules)
    return modules[index]
  },

  delete: async (id: string): Promise<void> => {
    const modules = getFromStorage<Module>(STORAGE_KEYS.MODULES)
    saveToStorage(STORAGE_KEYS.MODULES, modules.filter(m => m.id !== id))
  },
}

// ============ Task 相关 ============

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    return tasks.map(task => ({
      ...task,
      subtasks: subtasks.filter(s => s.taskId === task.id)
    }))
  },

  getById: async (id: string): Promise<Task | null> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    const task = tasks.find(t => t.id === id)
    if (!task) return null
    return { ...task, subtasks: subtasks.filter(s => s.taskId === id) }
  },

  create: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const newTask: Task = { ...task, id: generateId(), createdAt: getCurrentTime() }
    tasks.push(newTask)
    saveToStorage(STORAGE_KEYS.TASKS, tasks)
    return newTask
  },

  update: async (id: string, updates: Partial<Task>): Promise<void> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    tasks[index] = { ...tasks[index], ...updates, updatedAt: getCurrentTime() }
    saveToStorage(STORAGE_KEYS.TASKS, tasks)
  },

  delete: async (id: string): Promise<void> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    saveToStorage(STORAGE_KEYS.TASKS, tasks.filter(t => t.id !== id))
    saveToStorage(STORAGE_KEYS.SUBTASKS, subtasks.filter(s => s.taskId !== id))
  },

  getVos: async (): Promise<TaskDetailVo[]> => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS)
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    return tasks.map(task => {
      const taskSubtasks = subtasks.filter(s => s.taskId === task.id)
      const completedSubtasks = taskSubtasks.filter(s => s.completed).length
      const totalSubtasks = taskSubtasks.length
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        subtasks: taskSubtasks,
        moduleName: task.moduleName,
        completedRate: totalSubtasks > 0
          ? Math.round((completedSubtasks / totalSubtasks) * 100) + '%'
          : '0%',
      }
    })
  },
}

// ============ Subtask 相关 ============

export const subtaskApi = {
  getAll: async (): Promise<Subtask[]> => getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS),
  
  getByTaskId: async (taskId: string): Promise<Subtask[]> => {
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    return subtasks.filter(s => s.taskId === taskId)
  },

  create: async (taskId: string, subtask: Omit<Subtask, 'id' | 'taskId' | 'createdAt'>): Promise<Subtask> => {
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    const newSubtask: Subtask = { ...subtask, id: generateId(), taskId, createdAt: getCurrentTime() }
    subtasks.push(newSubtask)
    saveToStorage(STORAGE_KEYS.SUBTASKS, subtasks)
    return newSubtask
  },

  update: async (taskId: string, subtaskId: string, updates: Partial<Subtask>): Promise<Subtask> => {
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    const index = subtasks.findIndex(s => s.id === subtaskId && s.taskId === taskId)
    if (index === -1) throw new Error('Subtask not found')
    subtasks[index] = { ...subtasks[index], ...updates, updatedAt: getCurrentTime() }
    saveToStorage(STORAGE_KEYS.SUBTASKS, subtasks)
    return subtasks[index]
  },

  delete: async (taskId: string, subtaskId: string): Promise<void> => {
    const subtasks = getFromStorage<Subtask>(STORAGE_KEYS.SUBTASKS)
    saveToStorage(STORAGE_KEYS.SUBTASKS, subtasks.filter(s => !(s.id === subtaskId && s.taskId === taskId)))
  },
}

// ============ 数据初始化 ============

export const initializeData = (): void => {
  if (localStorage.getItem(STORAGE_KEYS.GOALS)) return

  // 初始大目标数据 - 基于你的实际计划
  const initialGoals: Goal[] = [
    { id: 'goal-1', title: '日语学习', description: '最少半年 每天3h左右', type: 'longterm', category: '学习', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-2', title: '英语达到日常交流水平', description: '目标分数110', type: 'longterm', category: '学习', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-3', title: '健身', description: '保持身体健康', type: 'longterm', category: '健康', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-4', title: '修考', description: '8月必须考一次', type: 'monthly', category: '学习', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-5', title: '转职', description: '11月之前找到新工作', type: 'yearly', category: '工作', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-6', title: '阅读计划', description: '一年计划看多少本，看哪些', type: 'yearly', category: '学习', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-7', title: 'LeetCode刷题', description: '4月7日之前完成', type: 'monthly', category: '学习', progress: 0, createdAt: new Date().toISOString() },
    { id: 'goal-8', title: '当老板', description: '时机未到但是可以观察', type: 'longterm', category: '事业', progress: 0, createdAt: new Date().toISOString() },
  ]

  // 初始里程碑
  const initialMilestones: Milestone[] = [
    { id: 'ms-1', goalId: 'goal-7', title: '完成100道题', completed: false, createdAt: new Date().toISOString() },
    { id: 'ms-2', goalId: 'goal-7', title: '完成200道题', completed: false, createdAt: new Date().toISOString() },
    { id: 'ms-3', goalId: 'goal-5', title: '更新简历', completed: false, createdAt: new Date().toISOString() },
    { id: 'ms-4', goalId: 'goal-5', title: '投递简历', completed: false, createdAt: new Date().toISOString() },
    { id: 'ms-5', goalId: 'goal-5', title: '面试准备', completed: false, createdAt: new Date().toISOString() },
  ]

  // 今日待办示例
  const today = new Date().toISOString().split('T')[0]
  const initialTodos: Todo[] = [
    { id: 'todo-1', title: '日语学习1小时', type: 'daily', completed: false, dueDate: today, createdAt: new Date().toISOString() },
    { id: 'todo-2', title: 'LeetCode 3题', type: 'daily', completed: false, dueDate: today, createdAt: new Date().toISOString() },
    { id: 'todo-3', title: '健身30分钟', type: 'daily', completed: false, dueDate: today, createdAt: new Date().toISOString() },
  ]

  // 模块数据
  const initialModules: Module[] = [
    { id: 'mod-1', name: '学习' },
    { id: 'mod-2', name: '工作' },
    { id: 'mod-3', name: '健康' },
    { id: 'mod-4', name: '事业' },
  ]

  saveToStorage(STORAGE_KEYS.GOALS, initialGoals)
  saveToStorage(STORAGE_KEYS.MILESTONES, initialMilestones)
  saveToStorage(STORAGE_KEYS.TODOS, initialTodos)
  saveToStorage(STORAGE_KEYS.MODULES, initialModules)
  
  console.log('✅ 本地数据初始化完成')
}

export const resetData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  initializeData()
  console.log('✅ 数据已重置')
}

export { STORAGE_KEYS }