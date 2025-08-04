// 子任务类型
export interface Subtask {
    id: string
    title: string
    completed: boolean
    createdAt: string
    updatedAt?: string
    taskId: string // 关联的主任务ID
}

// 任务优先级枚举
export type TaskPriority = 'low' | 'medium' | 'high'

export const TaskPriorityValues: TaskPriority[] = ['low', 'medium', 'high']


// 主任务类型
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
    module?: Module
}
//这个 Module 用于给每个任务指定一个
export interface Module {
    id: string
    name: string
}
// 分类（可选）
export interface TaskCategory {
    id: string
    name: string
    color?: string
    icon?: string
}
 