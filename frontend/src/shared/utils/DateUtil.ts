import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { PickerValue } from '@mui/x-date-pickers/internals'

dayjs.extend(utc)
dayjs.extend(timezone)
//this code is just show the datebase date,need backend to deal with the tiemzoine 
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
const DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm'

export const dateUtils = {
  toBackendFormat(date: Date | string | null | PickerValue): string {
    return date ? dayjs(date).utc().format(DATE_FORMAT) : ''
  },
  toDisplayFormat(dateStr: string): string {
    return dayjs.utc(dateStr).tz(dayjs.tz.guess()).format(DISPLAY_FORMAT)
  },
  now(): string {
    return dayjs().utc().format(DATE_FORMAT)
  },
  toDisplayWithPattern(dateStr: string, pattern: string): string {
    return dayjs.utc(dateStr).tz(dayjs.tz.guess()).format(pattern)
  }
}
