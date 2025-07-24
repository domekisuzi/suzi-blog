import {api} from '../utils/APIUtils'
import {Task} from "../features/tasks/types";



const BASE = '/tasks'
/** 获取所有任务（包含子任务） */
export async function fetchTasks(): Promise<Task[]> {
    const res = await api.get(`${BASE}`)
    return res.data
}

/** 创建任务（前端构造完整结构） */
export async function createTask(task: Task): Promise<{ id: string }> {
    const res = await api.post(`${BASE}`, task)
    return res.data
}

/** 更新任务字段（只传需要更新的字段） */
export async function updateTask(id: string, updates: Partial<Task>) {
    await api.put(`${BASE}/${id}`, updates)
}

/** 删除任务 */
export async function deleteTask(id: string) {
    await api.delete(`${BASE}/${id}`)
}
