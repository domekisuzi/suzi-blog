/**
 * Task API - 使用统一的 API 适配器
 * 自动根据环境切换本地存储或后端API
 */
import { apiAdapter } from '../../../shared/utils/APIUtils'
import { Subtask, Task, TaskDetailVo } from '../model/taskTypes'

/** 获取所有任务（包含子任务） */
export async function fetchTasks(): Promise<Task[]> {
  const res = await apiAdapter.task.getAll()
  return res.data
}

/** 创建任务 */
export async function createTask(task: Partial<Task>): Promise<Task> {
  const res = await apiAdapter.task.create(task)
  return res.data
}

/** 更新任务 */
export async function updateTask(id: string, updates: Partial<Task>): Promise<void> {
  await apiAdapter.task.update(id, updates)
}

/** 删除任务 */
export async function deleteTask(id: string): Promise<void> {
  await apiAdapter.task.delete(id)
}

/** 获取任务详情视图 */
export async function getAllTaskVos(): Promise<TaskDetailVo[]> {
  const res = await apiAdapter.task.getVos()
  return res.data
}

/** 获取子任务 */
export async function getSubtasks(taskId: string): Promise<Subtask[]> {
  const res = await apiAdapter.subtask.getByTaskId(taskId)
  return res.data
}

/** 创建子任务 */
export async function createSubtask(
  taskId: string,
  payload: Partial<Subtask>
): Promise<Subtask> {
  const res = await apiAdapter.subtask.create(taskId, payload)
  return res.data
}

/** 更新子任务 */
export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  payload: Partial<Subtask>
): Promise<Subtask> {
  const res = await apiAdapter.subtask.update(taskId, subtaskId, payload)
  return res.data
}

/** 删除子任务 */
export async function deleteSubtask(
  taskId: string,
  subtaskId: string
): Promise<void> {
  await apiAdapter.subtask.delete(taskId, subtaskId)
}

/** 获取所有子任务 */
export async function getAllSubtasks(): Promise<Subtask[]> {
  const res = await apiAdapter.subtask.getAll()
  return res.data
}

/** 根据ID删除子任务 */
export async function deleteSubtaskById(subtaskId: string): Promise<void> {
  // 在本地存储模式下，需要遍历找到对应的taskId
  const allSubtasks = await getAllSubtasks()
  const subtask = allSubtasks.find(s => s.id === subtaskId)
  if (subtask) {
    if (!subtask.taskId) {
      throw new Error('子任务不存在或不属于该任务：taskId 为空')
    }
    await deleteSubtask(subtask.taskId, subtaskId)
  } else {
    throw new Error('子任务不存在')
  }
}

/** 更新子任务实体 */
export async function updateSubtaskByEntity(dto: Subtask): Promise<Subtask> {
  const res = await apiAdapter.subtask.update(dto.taskId, dto.id, dto)
  return res.data
}