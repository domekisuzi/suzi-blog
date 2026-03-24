import dayjs from 'dayjs'
import { PickerValue } from '@mui/x-date-pickers/internals'

// 使用本地时间，不进行 UTC 转换
const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm'

export const dateUtils = {
  toBackendFormat(date: Date | string | null | PickerValue): string {
    // 直接使用本地时间，不转换 UTC
    return date ? dayjs(date).format(DATE_FORMAT) : ''
  },
  toDisplayFormat(dateStr: string): string {
    // 直接显示，不做时区转换
    return dateStr ? dayjs(dateStr).format(DISPLAY_FORMAT) : ''
  },
  now(): string {
    return dayjs().format(DATE_FORMAT)
  },
  toDisplayWithPattern(dateStr: string, pattern: string): string {
    return dateStr ? dayjs(dateStr).format(pattern) : ''
  }
}
