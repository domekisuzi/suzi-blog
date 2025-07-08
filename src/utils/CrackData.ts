import {Module, Task} from "../features/tasks/types";
export const mockModules:Module[] = [
    {id:"md-1",name:"learn Japanese"},
    {id:"md-2",name:"Finance"},
]

export const mockTasks: Task[] = [
    {
        id: 'task-1',
        title: '完成任务系统原型设计',
        description: '设计任务列表、子任务、分类结构',
        completed: false,
        priority: 'high',
        dueDate: '2025-07-15',
        createdAt: '2025-07-01T09:00:00Z',
        subtasks: [
            { id: 'sub-1', title: '定义 Task 类型结构', completed: true, createdAt: '2025-07-01T09:10:00Z' },
            { id: 'sub-2', title: '设计 TaskForm 表单字段', completed: false, createdAt: '2025-07-01T09:20:00Z' }
        ],
        module :{id:"md-1",name:"learn Japanese"},
    },
    {
        id: 'task-2',
        title: '阅读《Clean Code》第三章',
        description: '理解函数设计原则',
        completed: true,
        priority: 'medium',
        dueDate: '2025-07-10',
        createdAt: '2025-06-28T14:00:00Z',
        subtasks: [],
        module :{id:"md-2",name:"Finance"},
    },
    {
        id: 'task-3',
        title: '重构 TaskPage 页面结构',
        description: '将任务列表与表单逻辑解耦',
        completed: false,
        priority: 'low',
        dueDate: '2025-07-20',
        createdAt: '2025-07-05T11:30:00Z',
        subtasks: [
            { id: 'sub-3', title: '提取 TaskList 组件', completed: false, createdAt: '2025-07-05T11:35:00Z' },
            { id: 'sub-4', title: '优化状态管理逻辑', completed: false, createdAt: '2025-07-05T11:40:00Z' }
        ],


    }
]