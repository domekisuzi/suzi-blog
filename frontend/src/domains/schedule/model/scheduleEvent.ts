export interface WeeklyScheduleEvent {
    id: string
    title: string
    category: string
    moduleId: string
    moduleName?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    note?: string
    color?: string
    createdAt?: string
    updatedAt?: string
}

export interface WeeklyScheduleEventFormData {
    title: string
    category: string
    moduleId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    note: string
    color: string
}

export interface WeeklyScheduleUsageStat {
    moduleId: string
    moduleName: string
    totalMinutes: number
    totalEvents: number
    totalHours: number
}

export const WEEK_DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
