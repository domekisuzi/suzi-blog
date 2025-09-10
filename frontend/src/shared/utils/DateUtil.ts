import dayjs from 'dayjs'
//this code is just show the datebase date,need backend to deal with the tiemzoine 
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'
const DISPLAY_FORMAT = 'YYYY-MM-DD HH:mm'

export const dateUtils = {
  toBackendFormat(date: Date | string | null): string {
    return date ? dayjs(date).format(DATE_FORMAT) : ''
  },
  toDisplayFormat(dateStr: string): string {
    return dayjs(dateStr).format(DISPLAY_FORMAT)
  },
  now(): string {
    return dayjs().format(DATE_FORMAT)
  }
}
