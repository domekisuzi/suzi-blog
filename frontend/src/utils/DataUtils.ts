import { useMemo } from 'react'
import { format, formatDistanceToNow, isBefore, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function useLocalTime(isoString: string | null | undefined) {
    return useMemo(() => {
        if (!isoString) return {
            formatted: '无时间信息',
            relative: '未知时间'
        }

        const date = parseISO(isoString)
        const formatted = format(date, 'yyyy-MM-dd HH:mm') // 输出格式
        const relative = isBefore(date, new Date())
            ? `已过期 ${formatDistanceToNow(date, { locale: zhCN })}`
            : `还剩 ${formatDistanceToNow(date, { locale: zhCN })}`

        return { formatted, relative }
    }, [isoString])
}

export  function formatForSQL(datetime: string): string {
    return datetime.slice(0, 19).replace('T', ' ')
}


