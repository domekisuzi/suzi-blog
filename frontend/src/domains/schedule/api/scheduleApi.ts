import { apiAdapter } from '../../../shared/utils/APIUtils'
import { WeeklyScheduleEvent, WeeklyScheduleEventFormData, WeeklyScheduleUsageStat } from '../model/scheduleEvent'

export async function fetchScheduleEvents(): Promise<WeeklyScheduleEvent[]> {
  const res = await apiAdapter.schedule.getAll()
  return res.data
}

export async function fetchScheduleEventsByWeekday(dayOfWeek: number): Promise<WeeklyScheduleEvent[]> {
  const res = await apiAdapter.schedule.getByWeekday(dayOfWeek)
  return res.data
}

export async function fetchScheduleUsageStats(): Promise<WeeklyScheduleUsageStat[]> {
  const res = await apiAdapter.schedule.getUsageStats()
  return res.data
}

export async function createScheduleEvent(payload: WeeklyScheduleEventFormData): Promise<WeeklyScheduleEvent> {
  const res = await apiAdapter.schedule.create(payload)
  return res.data
}

export async function updateScheduleEvent(
  id: string,
  payload: WeeklyScheduleEventFormData
): Promise<WeeklyScheduleEvent> {
  const res = await apiAdapter.schedule.update(id, payload)
  return res.data
}

export async function deleteScheduleEvent(id: string): Promise<void> {
  await apiAdapter.schedule.delete(id)
}
