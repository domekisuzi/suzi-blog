import { apiAdapter } from '../../../shared/utils/APIUtils';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/goals';

export interface Goal {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    progress: number;
    type: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
    taskIds?: string[];          // 关联的任务ID列表
    taskCount?: number;          // 任务总数
    completedTaskCount?: number; // 已完成任务数
}

export interface GoalCreateInput {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    type: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
}

// 获取所有目标
export const fetchAllGoals = async (): Promise<Goal[]> => {
    const response = await apiAdapter.goal.getAll();
    return response.data;
};

// 获取单个目标
export const fetchGoalById = async (id: string): Promise<Goal> => {
    const response = await apiAdapter.goal.getById(id);
    return response.data;
};

// 创建目标
export const createGoal = async (goal: GoalCreateInput): Promise<Goal> => {
    const response = await apiAdapter.goal.create(goal);
    return response.data;
};

// 更新目标
export const updateGoal = async (id: string, goal: Partial<Goal>): Promise<Goal> => {
    const response = await apiAdapter.goal.update(id, goal);
    return response.data;
};

// 删除目标
export const deleteGoal = async (id: string): Promise<void> => {
    await apiAdapter.goal.delete(id);
};

// 添加任务到目标
export const addTasksToGoal = async (goalId: string, taskIds: string[]): Promise<Goal> => {
    const response = await axios.post(`${API_BASE}/${goalId}/tasks`, taskIds);
    return response.data;
};

// 从目标移除任务
export const removeTasksFromGoal = async (goalId: string, taskIds: string[]): Promise<Goal> => {
    const response = await axios.delete(`${API_BASE}/${goalId}/tasks`, { data: taskIds });
    return response.data;
};

// 重新计算进度
export const recalculateProgress = async (goalId: string): Promise<Goal> => {
    const response = await axios.post(`${API_BASE}/${goalId}/recalculate`);
    return response.data;
};

// 获取目标绑定的任务列表
export interface TaskInfo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    moduleName: string;
    dueDate: string;
}

export const fetchTasksByGoalId = async (goalId: string): Promise<TaskInfo[]> => {
    const response = await axios.get(`${API_BASE}/${goalId}/tasks/list`);
    return response.data;
};
