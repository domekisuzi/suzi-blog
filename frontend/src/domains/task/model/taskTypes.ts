// 子任务类型
export interface Subtask {
    id: string
    title: string
    completed: boolean
    createdAt: string
    updatedAt?: string
    dueDate?:string
    taskId: string // 关联的主任务ID
   
}

// 任务优先级枚举
export type TaskPriority = 'low' | 'medium' | 'high'

export const TaskPriorityValues: TaskPriority[] = ['low', 'medium', 'high']
// 主任务类型
// be careful that this entity is used for the show data but not for  directly  access database 
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
}
//TODO("这个代码目前完全就是shi，目前TaskDetailVo没报错的原因是它包含了一堆不需要的数据结构，导致它算是task的子类了，如果去掉不需要的结构前端就会有大量 task和vo混淆的地方需要去解决")
export interface TaskDetailVo{ 
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

//这个 Module 用于给每个任务指定一个

export interface TaskCategory {
    id: string
    name: string
    color?: string
    icon?: string
}
