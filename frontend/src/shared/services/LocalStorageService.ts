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
  if (localStorage.getItem(STORAGE_KEYS.MODULES)) return

  const now = new Date().toISOString()

  // 模块数据 - 8个主要模块
  const initialModules: Module[] = [
    { id: 'mod-1', name: '日语', description: '最少半年每天3h，做到不用太准备就可以学', color: '#ef4444' },
    { id: 'mod-2', name: '英语', description: '目标110分，日常交流水平', color: '#3b82f6' },
    { id: 'mod-3', name: '健身', description: '保持健康，规律锻炼', color: '#22c55e' },
    { id: 'mod-4', name: '修考', description: '8月必须考一次', color: '#f59e0b' },
    { id: 'mod-5', name: '工作', description: '11月之前找到新工作转职', color: '#8b5cf6' },
    { id: 'mod-6', name: '看书', description: '一年计划看多少本，看哪些', color: '#ec4899' },
    { id: 'mod-7', name: 'LeetCode', description: '1个月 4.7之前完成', color: '#06b6d4' },
    { id: 'mod-8', name: '当老板', description: '时机未到但是可以观察', color: '#64748b' },
  ]

  // 任务数据
  const initialTasks: Task[] = [
    // 日语任务
    { id: 'task-1', title: '日语学习计划', description: '每天3h学习，累计15h以上/周\n- 怎么积累想好\n- 不用太准备就可以学', completed: false, priority: 'high', moduleName: '日语', createdAt: now },
    // 英语任务
    { id: 'task-2', title: '英语提升计划', description: '目标：托福110分，日常交流水平', completed: false, priority: 'high', moduleName: '英语', createdAt: now },
    // 健身任务
    { id: 'task-3', title: '健身计划', description: '保持规律锻炼，健康生活', completed: false, priority: 'medium', moduleName: '健身', createdAt: now },
    // 修考任务
    { id: 'task-4', title: '修考准备', description: '8月必须考一次', completed: false, priority: 'high', moduleName: '修考', createdAt: now },
    // 工作任务
    { id: 'task-5', title: '转职计划', description: '11月之前找到新工作\n- 这个月先不看工作，4月1号再看', completed: false, priority: 'high', moduleName: '工作', createdAt: now },
    // 看书任务
    { id: 'task-6', title: '阅读计划', description: '一年计划看多少本，看哪些', completed: false, priority: 'medium', moduleName: '看书', createdAt: now },
    // LeetCode任务
    { id: 'task-7', title: 'LeetCode刷题', description: '1个月 4.7之前完成\n- 大量过', completed: false, priority: 'high', moduleName: 'LeetCode', createdAt: now },
    // 当老板任务
    { id: 'task-8', title: '创业观察', description: '时机未到但是可以观察', completed: false, priority: 'low', moduleName: '当老板', createdAt: now },
    // 周常任务
    { id: 'task-9', title: '周常任务', description: '每周固定任务\n- 日语累计15h以上\n- 力扣大量过\n- 计划软件完成\n- 月初进行月计划\n- 套磁怎么办\n- 专业化\n- 考虑下衣服', completed: false, priority: 'medium', moduleName: '日语', createdAt: now },
  ]

  // 子任务数据
  const initialSubtasks: Subtask[] = [
    // 日语子任务
    { id: 'sub-1', taskId: 'task-1', title: '制定学习方法', completed: false, createdAt: now },
    { id: 'sub-2', taskId: 'task-1', title: '每周累计15h', completed: false, createdAt: now },
    { id: 'sub-3', taskId: 'task-1', title: '日常会话练习', completed: false, createdAt: now },
    // 英语子任务
    { id: 'sub-4', taskId: 'task-2', title: '背单词', completed: false, createdAt: now },
    { id: 'sub-5', taskId: 'task-2', title: '听力练习', completed: false, createdAt: now },
    { id: 'sub-6', taskId: 'task-2', title: '口语练习', completed: false, createdAt: now },
    // 健身子任务
    { id: 'sub-7', taskId: 'task-3', title: '每周运动3次', completed: false, createdAt: now },
    { id: 'sub-8', taskId: 'task-3', title: '控制饮食', completed: false, createdAt: now },
    // 修考子任务
    { id: 'sub-9', taskId: 'task-4', title: '套磁怎么办', completed: false, createdAt: now },
    { id: 'sub-10', taskId: 'task-4', title: '专业化准备', completed: false, createdAt: now },
    { id: 'sub-11', taskId: 'task-4', title: '复习计划', completed: false, createdAt: now },
    // 工作子任务
    { id: 'sub-12', taskId: 'task-5', title: '简历更新', completed: false, createdAt: now },
    { id: 'sub-13', taskId: 'task-5', title: '投递准备', completed: false, createdAt: now },
    { id: 'sub-14', taskId: 'task-5', title: '面试准备', completed: false, createdAt: now },
    { id: 'sub-15', taskId: 'task-5', title: '4月1日开始行动', completed: false, createdAt: now },
    // 看书子任务
    { id: 'sub-16', taskId: 'task-6', title: '确定书单', completed: false, createdAt: now },
    { id: 'sub-17', taskId: 'task-6', title: '每月阅读目标', completed: false, createdAt: now },
    // LeetCode子任务
    { id: 'sub-18', taskId: 'task-7', title: '算法基础', completed: false, createdAt: now },
    { id: 'sub-19', taskId: 'task-7', title: '数据结构', completed: false, createdAt: now },
    { id: 'sub-20', taskId: 'task-7', title: '模拟面试题', completed: false, createdAt: now },
    // 当老板子任务
    { id: 'sub-21', taskId: 'task-8', title: '市场观察', completed: false, createdAt: now },
    { id: 'sub-22', taskId: 'task-8', title: '人脉积累', completed: false, createdAt: now },
    // 周常子任务
    { id: 'sub-23', taskId: 'task-9', title: '日语累计15h以上', completed: false, createdAt: now },
    { id: 'sub-24', taskId: 'task-9', title: '力扣大量过', completed: false, createdAt: now },
    { id: 'sub-25', taskId: 'task-9', title: '计划软件完成', completed: false, createdAt: now },
    { id: 'sub-26', taskId: 'task-9', title: '月初进行月计划', completed: false, createdAt: now },
    { id: 'sub-27', taskId: 'task-9', title: '套磁', completed: false, createdAt: now },
    { id: 'sub-28', taskId: 'task-9', title: '专业化', completed: false, createdAt: now },
    { id: 'sub-29', taskId: 'task-9', title: '考虑下衣服', completed: false, createdAt: now },
  ]

  saveToStorage(STORAGE_KEYS.MODULES, initialModules)
  saveToStorage(STORAGE_KEYS.TASKS, initialTasks)
  saveToStorage(STORAGE_KEYS.SUBTASKS, initialSubtasks)
  
  console.log('✅ 本地数据初始化完成: 8个模块, 9个任务, 29个子任务')
}

export const resetData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  initializeData()
  console.log('✅ 数据已重置')
}

export { STORAGE_KEYS }