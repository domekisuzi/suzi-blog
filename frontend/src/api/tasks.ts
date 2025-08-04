import {api} from '../utils/APIUtils'
import {Task,Subtask,Module} from "../features/tasks/types";
 


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

// "/api/tasks/{taskId}/subtasks")
 export async function getSubtasks (taskId: string): Promise<Subtask>  {
   const res = await api.get(`/tasks/${taskId}/subtasks`);
   return res.data;
};

export async function createSubtask  (
  taskId: string,
  payload: { title: string }
) : Promise<Subtask>  {
    const res = await api.post(`/tasks/${taskId}/subtasks`, {
    title: payload.title,
    completed: false
  });

  return res.data;
};

export async function updateSubtask (
  taskId: string,
  subtaskId: string,
  payload: Partial<Subtask>
)  : Promise<Subtask> {
   const   res = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, payload);
   return res.data
};

export async function deleteSubtask  (
  taskId: string,
  subtaskId: string
): Promise<void>  {
  await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
}; 
 
export async function createModule(name:string) :Promise<Module>{
  const res = await  api.post('/modules', { name });
  return res.data
}
export async function fetchModules():Promise<Module[]>{
  const res = await api.get('/modules')
  return res.data 
}
