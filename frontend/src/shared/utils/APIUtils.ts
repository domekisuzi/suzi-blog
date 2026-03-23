/**
 * API 适配器 - 根据环境切换本地存储或后端API
 */

import axios from 'axios'
import { 
  initializeData, 
  taskApi as localTaskApi, 
  moduleApi as localModuleApi, 
  subtaskApi as localSubtaskApi,
  goalApi as localGoalApi,
  todoApi as localTodoApi,
  milestoneApi as localMilestoneApi
} from '../services/LocalStorageService'

// 是否使用本地存储模式
const USE_LOCAL_STORAGE = process.env.REACT_APP_USE_LOCAL_STORAGE === 'true'

// API 基础配置
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 初始化本地数据（仅在使用本地存储模式时）
if (USE_LOCAL_STORAGE) {
  console.log('🔄 使用本地存储模式 (开发模式)')
  initializeData()
}

// 统一的 API 适配器
export const apiAdapter = {
  // Goal APIs - 大目标
  goal: {
    getAll: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localGoalApi.getAll() }
      return api.get('/goals')
    },
    getById: async (id: string) => {
      if (USE_LOCAL_STORAGE) return { data: await localGoalApi.getById(id) }
      return api.get(`/goals/${id}`)
    },
    create: async (goal: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localGoalApi.create(goal) }
      return api.post('/goals', goal)
    },
    update: async (id: string, updates: any) => {
      if (USE_LOCAL_STORAGE) { await localGoalApi.update(id, updates); return { data: { success: true } } }
      return api.put(`/goals/${id}`, updates)
    },
    delete: async (id: string) => {
      if (USE_LOCAL_STORAGE) { await localGoalApi.delete(id); return { data: { success: true } } }
      return api.delete(`/goals/${id}`)
    },
  },

  // Milestone APIs - 里程碑
  milestone: {
    getByGoalId: async (goalId: string) => {
      if (USE_LOCAL_STORAGE) return { data: await localMilestoneApi.getByGoalId(goalId) }
      return api.get(`/goals/${goalId}/milestones`)
    },
    create: async (milestone: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localMilestoneApi.create(milestone) }
      return api.post('/milestones', milestone)
    },
    update: async (id: string, updates: any) => {
      if (USE_LOCAL_STORAGE) { await localMilestoneApi.update(id, updates); return { data: { success: true } } }
      return api.put(`/milestones/${id}`, updates)
    },
    delete: async (id: string) => {
      if (USE_LOCAL_STORAGE) { await localMilestoneApi.delete(id); return { data: { success: true } } }
      return api.delete(`/milestones/${id}`)
    },
  },

  // Todo APIs - 日常待办
  todo: {
    getAll: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localTodoApi.getAll() }
      return api.get('/todos')
    },
    getByType: async (type: 'daily' | 'weekly') => {
      if (USE_LOCAL_STORAGE) return { data: await localTodoApi.getByType(type) }
      return api.get(`/todos/${type}`)
    },
    create: async (todo: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localTodoApi.create(todo) }
      return api.post('/todos', todo)
    },
    update: async (id: string, updates: any) => {
      if (USE_LOCAL_STORAGE) { await localTodoApi.update(id, updates); return { data: { success: true } } }
      return api.put(`/todos/${id}`, updates)
    },
    delete: async (id: string) => {
      if (USE_LOCAL_STORAGE) { await localTodoApi.delete(id); return { data: { success: true } } }
      return api.delete(`/todos/${id}`)
    },
  },

  // Task APIs
  task: {
    getAll: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localTaskApi.getAll() }
      return api.get('/tasks')
    },
    getById: async (id: string) => {
      if (USE_LOCAL_STORAGE) return { data: await localTaskApi.getById(id) }
      return api.get(`/tasks/${id}`)
    },
    create: async (task: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localTaskApi.create(task) }
      return api.post('/tasks', task)
    },
    update: async (id: string, updates: any) => {
      if (USE_LOCAL_STORAGE) { await localTaskApi.update(id, updates); return { data: { success: true } } }
      return api.put(`/tasks/${id}`, updates)
    },
    delete: async (id: string) => {
      if (USE_LOCAL_STORAGE) { await localTaskApi.delete(id); return { data: { success: true } } }
      return api.delete(`/tasks/${id}`)
    },
    getVos: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localTaskApi.getVos() }
      return api.get('/tasks/vo')
    },
  },

  // Module APIs
  module: {
    getAll: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localModuleApi.getAll() }
      return api.get('/modules')
    },
    getById: async (id: string) => {
      if (USE_LOCAL_STORAGE) return { data: await localModuleApi.getById(id) }
      return api.get(`/modules/${id}`)
    },
    create: async (module: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localModuleApi.create(module) }
      return api.post('/modules', module)
    },
    update: async (id: string, updates: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localModuleApi.update(id, updates) }
      return api.put(`/modules/${id}`, updates)
    },
    delete: async (id: string) => {
      if (USE_LOCAL_STORAGE) { await localModuleApi.delete(id); return { data: { success: true } } }
      return api.delete(`/modules/${id}`)
    },
  },

  // Subtask APIs
  subtask: {
    getAll: async () => {
      if (USE_LOCAL_STORAGE) return { data: await localSubtaskApi.getAll() }
      return api.get('/tasks/subtasks')
    },
    getByTaskId: async (taskId: string) => {
      if (USE_LOCAL_STORAGE) return { data: await localSubtaskApi.getByTaskId(taskId) }
      return api.get(`/tasks/${taskId}/subtasks`)
    },
    create: async (taskId: string, subtask: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localSubtaskApi.create(taskId, subtask) }
      return api.post(`/tasks/${taskId}/subtasks`, subtask)
    },
    update: async (taskId: string, subtaskId: string, updates: any) => {
      if (USE_LOCAL_STORAGE) return { data: await localSubtaskApi.update(taskId, subtaskId, updates) }
      return api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, updates)
    },
    delete: async (taskId: string, subtaskId: string) => {
      if (USE_LOCAL_STORAGE) { await localSubtaskApi.delete(taskId, subtaskId); return { data: { success: true } } }
      return api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`)
    },
  },
}

// 导出类型标记（用于调试）
export const isLocalStorageMode = () => USE_LOCAL_STORAGE