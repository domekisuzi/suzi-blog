import React, { useEffect, useMemo, useState } from 'react'
import {
    InputLabel,
    Alert,
    Box,
    Button,
    IconButton,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import ConfirmDialog from '../../../components/ConfirmDialog'
import { useLoading } from '../../../context/LoadingContext'
import { useNotification } from '../../../components/Notification'
import { useNavigate } from 'react-router-dom'
import { Module } from '../../module/model/module'
import { fetchModules } from '../../module/api/moduleApi'
import {
    WeeklyScheduleEvent,
    WeeklyScheduleEventFormData,
    WEEK_DAY_LABELS,
    WeeklyScheduleUsageStat,
} from '../model/scheduleEvent'
import {
    createScheduleEvent,
    deleteScheduleEvent,
    fetchScheduleEvents,
    fetchScheduleUsageStats,
    updateScheduleEvent,
} from '../api/scheduleApi'

const HOUR_HEIGHT = 52
const HOUR_COUNT = 24
const TOTAL_HEIGHT = HOUR_HEIGHT * HOUR_COUNT
const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60
const WEEK_START = 0
const MINUTES_PER_DAY = HOUR_COUNT * 60

const formatDateInputValue = (date: Date): string => date.toISOString().slice(0, 10)
const parseDateInputValue = (value: string): Date => {
    const [year, month, day] = value.split('-').map(Number)
    if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        return new Date()
    }
    return new Date(year, month - 1, day)
}
const formatDateLabel = (date: Date): string =>
    `${date.getMonth() + 1}/${date.getDate()}`
const toWeekdayIndex = (dateStr: string): number => {
    if (!dateStr) {
        return WEEK_START
    }
    const date = parseDateInputValue(dateStr)
    const jsDay = date.getDay()
    return (jsDay + 6) % 7
}
const pickDateFromEvent = (event: WeeklyScheduleEvent): string => {
    if (event.eventDate) {
        return event.eventDate.split('T')[0]
    }
    return ''
}
const pickEventDateForWeek = (event: WeeklyScheduleEvent, weekDates: Date[]) => {
    if (!event) {
        return ''
    }
    const rawDate = pickDateFromEvent(event)
    if (rawDate) {
        return rawDate
    }
    if (event.dayOfWeek == null) {
        return ''
    }
    const idx = ((event.dayOfWeek % 7) + 7) % 7
    return weekDates[idx] ? formatDateInputValue(weekDates[idx]) : ''
}
const isWeekMatch = (dateText: string, weekDates: Date[]): boolean => {
    return weekDates.some((date) => formatDateInputValue(date) === dateText)
}

const normalizeTimeText = (time: string): string | null => {
    const trimmed = (time || '').trim()
    if (!trimmed) {
        return null
    }
    let candidate = trimmed.replace(/：/g, ':')
    const tIndex = candidate.lastIndexOf('T')
    if (tIndex >= 0) {
        candidate = candidate.slice(tIndex + 1)
    }
    if (candidate.includes(' ')) {
        const chunks = candidate.trim().split(/\s+/)
        candidate = chunks[chunks.length - 1]
    }

    const match = candidate.match(/(\d{1,2}):(\d{1,2})/)
    if (!match) {
        return null
    }

    const hour = Number.parseInt(match[1], 10)
    const minute = Number.parseInt(match[2], 10)
    if (hour === 24 && minute === 0) {
        return '24:00'
    }
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }

    return null
}

const toMinutes = (time: string): number => {
    const normalized = normalizeTimeText(time)
    if (!normalized) {
        return -1
    }
    const [hours, minutes] = normalized.split(':').map((item) => Number.parseInt(item, 10))
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return -1
    }
    if (hours === 24 && minutes === 0) {
        return MINUTES_PER_DAY
    }
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return -1
    }
    return hours * 60 + minutes
}

const calculateMinutesSpan = (startTime: string, endTime: string): number => {
    const start = toMinutes(startTime)
    const end = toMinutes(endTime)
    if (start < 0 || end < 0 || start === end) {
        return 0
    }
    const isOverMidnight = end <= start
    const span = isOverMidnight ? (MINUTES_PER_DAY - start) + end : end - start
    if (!isOverMidnight) {
        const startMinute = start % 60
        const endMinute = end % 60
        const sameHour = Math.floor(start / 60) === Math.floor(end / 60)
        if (sameHour && endMinute === 59) {
            return Math.min(span + 1, MINUTES_PER_DAY - start)
        }
    }
    return span
}

const isValidTimeRange = (startTime: string, endTime: string): boolean => {
    return calculateMinutesSpan(startTime, endTime) > 0
}

const toPixels = (time: string): number => {
    return toMinutes(time) * PIXELS_PER_MINUTE
}

const formatHours = (hour: number) => String(hour).padStart(2, '0') + ':00'
const TIME_MARKS = Array.from({ length: HOUR_COUNT + 1 }, (_, idx) => formatHours(idx))

const eventTop = (time: string) => toPixels(time)
const eventHeight = (startTime: string, endTime: string) => {
    const spanMinutes = calculateMinutesSpan(startTime, endTime)
    const height = spanMinutes * PIXELS_PER_MINUTE
    return Math.max(height, 36)
}

const emptyForm: WeeklyScheduleEventFormData = {
    eventDate: formatDateInputValue(new Date()),
    title: '',
    category: '',
    moduleId: '',
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    note: '',
    color: '#6366f1',
}

const formatMinutesLabel = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
}

const findModuleNameById = (modules: Module[], moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.name || ''
}

const resolveInitialModuleId = (modules: Module[]) => {
    return modules[0]?.id || ''
}

const formatWeekRange = (weekDates: Date[]): string => {
    if (weekDates.length === 0) {
        return ''
    }
    const start = weekDates[0]
    const end = weekDates[weekDates.length - 1]
    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
}

const WeeklySchedulePage: React.FC = () => {
    const { setLoading } = useLoading()
    const { showSuccess, showError, showWarning } = useNotification()
    const navigate = useNavigate()

    const [events, setEvents] = useState<WeeklyScheduleEvent[]>([])
    const [modules, setModules] = useState<Module[]>([])
    const [stats, setStats] = useState<WeeklyScheduleUsageStat[]>([])
    const [moduleFilter, setModuleFilter] = useState('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<WeeklyScheduleEvent | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<WeeklyScheduleEvent | null>(null)
    const [form, setForm] = useState<WeeklyScheduleEventFormData>(emptyForm)
    const [hasLocalError, setHasLocalError] = useState('')
    const [weekStart, setWeekStart] = useState(() => {
        const now = new Date()
        const monday = new Date(now)
        monday.setHours(0, 0, 0, 0)
        const jsDay = monday.getDay()
        monday.setDate(monday.getDate() - ((jsDay + 6) % 7))
        return monday
    })

    const moduleMap = useMemo(() => {
        const map = new Map<string, Module>()
        modules.forEach((item) => map.set(item.id, item))
        return map
    }, [modules])

    const moduleColorMap = useMemo(() => {
        const map = new Map<string, string>()
        modules.forEach((item) => map.set(item.id, item.color || '#6366f1'))
        return map
    }, [modules])

    const moduleFilterOptions = useMemo(() => {
        const options = modules.map((item) => ({ id: item.id, name: item.name }))
        options.sort((a, b) => a.name.localeCompare(b.name))
        return [{ id: 'all', name: '全部模块' }, ...options]
    }, [modules])

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, idx) => {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + idx)
            return date
        })
    }, [weekStart])

    const jumpWeek = (offset: number) => {
        setWeekStart((prev) => {
            const next = new Date(prev)
            next.setDate(prev.getDate() + 7 * offset)
            return next
        })
    }

    const resetToThisWeek = () => {
        const now = new Date()
        const monday = new Date(now)
        monday.setHours(0, 0, 0, 0)
        const jsDay = monday.getDay()
        monday.setDate(monday.getDate() - ((jsDay + 6) % 7))
        setWeekStart(monday)
    }

    const jumpToDate = (dateText: string) => {
        if (!dateText) {
            return
        }
        const selected = parseDateInputValue(dateText)
        const monday = new Date(selected)
        monday.setHours(0, 0, 0, 0)
        const jsDay = monday.getDay()
        monday.setDate(monday.getDate() - ((jsDay + 6) % 7))
        setWeekStart(monday)
    }

    const loadScheduleData = async () => {
        setLoading(true)
        try {
            const [data, moduleData, usageStats] = await Promise.all([
                fetchScheduleEvents(),
                fetchModules(),
                fetchScheduleUsageStats(),
            ])
            setEvents(data)
            setModules(moduleData)
            setStats(usageStats)
            const nextModuleId = resolveInitialModuleId(moduleData)
            if (moduleData.length > 0 && (!form.moduleId || !moduleData.some((item) => item.id === form.moduleId))) {
                setForm((prev) => ({
                    ...prev,
                    moduleId: nextModuleId,
                    category: nextModuleId ? findModuleNameById(moduleData, nextModuleId) : '',
                }))
            }
        } catch (error: any) {
            console.error('加载周安排失败', error)
            showError('加载周安排失败：' + (error?.message || '请重试'))
            setHasLocalError('加载周安排失败，请检查后端服务是否启动')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadScheduleData()
    }, [])

    const moduleNameById = useMemo(() => {
        return (moduleId: string) => {
            if (moduleId && moduleMap.has(moduleId)) {
                return moduleMap.get(moduleId)?.name || '未关联'
            }
            return '未关联'
        }
    }, [moduleMap])

    const filteredEvents = useMemo(() => {
        return events
            .filter((item) => moduleFilter === 'all' || item.moduleId === moduleFilter)
            .filter((item) => {
                const eventDate = pickEventDateForWeek(item, weekDates)
                if (!eventDate) {
                    return false
                }
                return isWeekMatch(eventDate, weekDates)
            })
            .sort((a, b) => (a.dayOfWeek - b.dayOfWeek) || (toMinutes(a.startTime) - toMinutes(b.startTime)))
    }, [events, moduleFilter, weekDates])

    const eventsByDay = useMemo(() => {
        const buckets = Array.from({ length: 7 }, () => [] as WeeklyScheduleEvent[])
        const dateIndexMap = new Map<string, number>()
        weekDates.forEach((date, idx) => {
            dateIndexMap.set(formatDateInputValue(date), idx)
        })
        for (const item of filteredEvents) {
            const eventDate = pickEventDateForWeek(item, weekDates)
            const day = dateIndexMap.get(eventDate)
            if (day === undefined) {
                continue
            }
            buckets[day].push(item)
        }
        return buckets.map((items) => items.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime)))
    }, [filteredEvents, weekDates])

    const totalMinutes = useMemo(() => stats.reduce((sum, item) => sum + item.totalMinutes, 0), [stats])

    const openCreateDialog = () => {
        setEditingEvent(null)
        const defaultModule = moduleFilter !== 'all' ? moduleFilter : resolveInitialModuleId(modules)
        const defaultDate = formatDateInputValue(weekDates[WEEK_START] || new Date())
        setForm({
            ...emptyForm,
            category: defaultModule ? findModuleNameById(modules, defaultModule) : '',
            moduleId: defaultModule,
            eventDate: defaultDate,
            dayOfWeek: toWeekdayIndex(defaultDate),
        })
        setHasLocalError('')
        setIsDialogOpen(true)
    }

    const openEditDialog = (event: WeeklyScheduleEvent) => {
        const moduleId = event.moduleId && moduleMap.has(event.moduleId)
            ? event.moduleId
            : resolveInitialModuleId(modules)
        const resolvedModuleName = moduleId ? findModuleNameById(modules, moduleId) : ''
        const eventDate = pickEventDateForWeek(event, weekDates)
        const resolvedDate = eventDate || formatDateInputValue(weekDates[event.dayOfWeek] || new Date())
        setEditingEvent(event)
        setForm({
            eventDate: resolvedDate,
            title: event.title,
            category: resolvedModuleName || event.category || '未关联',
            moduleId,
            dayOfWeek: toWeekdayIndex(resolvedDate),
            startTime: event.startTime,
            endTime: event.endTime,
            note: event.note || '',
            color: event.color || moduleColorMap.get(moduleId) || '#6366f1',
        })
        setHasLocalError('')
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setEditingEvent(null)
    }

    const handleCreateSubmit = async () => {
        const selectedModule = moduleMap.get(form.moduleId)
        if (!form.title.trim()) {
            showWarning('标题不能为空')
            return
        }
        if (!selectedModule) {
            showWarning('请选择模块（分类）')
            return
        }
        if (!form.eventDate) {
            showWarning('请选择日期')
            return
        }
        if (form.dayOfWeek < 0 || form.dayOfWeek > 6) {
            showWarning('请选择正确的星期')
            return
        }
        if (!isValidTimeRange(form.startTime, form.endTime)) {
            showWarning('结束时间不能与开始时间相同')
            return
        }

        setLoading(true)
        try {
            const payload = {
                ...form,
                dayOfWeek: toWeekdayIndex(form.eventDate),
                eventDate: form.eventDate,
                category: selectedModule.name,
                color: form.color || selectedModule.color || '#6366f1',
            }
            if (editingEvent) {
                await updateScheduleEvent(editingEvent.id, payload)
                showSuccess('修改成功')
            } else {
                await createScheduleEvent(payload)
                showSuccess('新增成功')
            }
            await loadScheduleData()
            setIsDialogOpen(false)
            setEditingEvent(null)
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || '提交失败'
            showError('保存失败：' + msg)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setLoading(true)
        try {
            await deleteScheduleEvent(deleteTarget.id)
            showSuccess('删除成功')
            await loadScheduleData()
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || '删除失败'
            showError('删除失败：' + msg)
        } finally {
            setDeleteTarget(null)
            setLoading(false)
        }
    }

    const hasConflictHint =
        hasLocalError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
                <strong>当前无法访问后端接口：</strong> {hasLocalError}
            </Alert>
        ) : null

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexShrink: 0 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Google 会议表（日程表）
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        通过“模块”分类日程，并在下方统计每个模块本周时间占比
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => jumpWeek(-1)} sx={{ border: '1px solid #cbd5e1' }}>
                        <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 150, textAlign: 'center', color: '#0f172a' }}>
                        {formatWeekRange(weekDates)}
                    </Typography>
                    <IconButton size="small" onClick={() => jumpWeek(1)} sx={{ border: '1px solid #cbd5e1' }}>
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                    <TextField
                        type="date"
                        size="small"
                        label="选日期跳转"
                        value={formatDateInputValue(weekDates[WEEK_START] || new Date())}
                        onChange={(e) => jumpToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 160 }}
                    />
                    <Button size="small" variant="outlined" onClick={resetToThisWeek} sx={{ ml: 1 }}>
                        回到本周
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="返回主页">
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            返回
                        </Button>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openCreateDialog}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            },
                        }}
                    >
                        新建事件
                    </Button>
                </Box>
            </Box>

            {hasConflictHint}

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                    }}
                >
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                        总时长（本周）
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatMinutesLabel(totalMinutes)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        共 {stats.length} 个模块分类
                    </Typography>
                </Box>
                {stats.length === 0 ? (
                    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #cbd5e1', background: '#fff' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            暂无可统计的模块分类
                        </Typography>
                    </Box>
                ) : (
                    stats.slice(0, 6).map((item) => {
                        const percentage = totalMinutes > 0 ? Math.round((item.totalMinutes / totalMinutes) * 100) : 0
                        return (
                            <Box
                                key={`${item.moduleId}||${item.moduleName}`}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid #cbd5e1',
                                    background: '#fff',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: '#0f172a', fontWeight: 600 }}>
                                    {item.moduleName}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {item.totalHours.toFixed(1)}h
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                    {item.totalEvents} 个时段 · {percentage}%
                                </Typography>
                            </Box>
                        )
                    })
                )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <AccessTimeIcon sx={{ color: '#64748b' }} />
                <Typography sx={{ color: '#334155', fontWeight: 600 }}>模块筛选：</Typography>
                {moduleFilterOptions.map((item) => (
                    <Chip
                        key={item.id}
                        label={item.name}
                        clickable
                        color={item.id === moduleFilter ? 'primary' : 'default'}
                        onClick={() => setModuleFilter(item.id)}
                        variant={item.id === moduleFilter ? 'filled' : 'outlined'}
                    />
                ))}
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', background: '#ffffff' }}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '72px repeat(7, 1fr)',
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                    }}>
                        <Box sx={{ height: 48, borderRight: '1px solid #e2e8f0' }} />
                        {WEEK_DAY_LABELS.map((day, idx) => (
                            <Box
                                key={day}
                                sx={{
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: idx === WEEK_DAY_LABELS.length - 1 ? 'none' : '1px solid #e2e8f0',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                }}
                            >
                                {day}
                                <Typography component="span" variant="caption" sx={{ ml: 0.5, color: '#64748b' }}>
                                    {formatDateLabel(weekDates[idx])}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '72px repeat(7, 1fr)' }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRight: '1px solid #e2e8f0',
                                    minHeight: TOTAL_HEIGHT,
                                    backgroundColor: '#f8fafc',
                                }}
                            >
                                {TIME_MARKS.map((label, idx) => (
                                    <Box
                                        key={`time-${idx}`}
                                        sx={{
                                            position: 'absolute',
                                            top: idx * HOUR_HEIGHT,
                                            left: 0,
                                            right: 0,
                                            height: HOUR_HEIGHT,
                                            borderTop: idx === 0 ? 'none' : '1px dashed #cbd5e1',
                                            pl: 1,
                                            pointerEvents: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        >
                                        <Typography
                                            variant="caption"
                                            sx={{ color: '#64748b', fontWeight: 600, mt: '-0.1rem' }}
                                        >
                                            {label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                        {eventsByDay.map((dayEvents, dayIndex) => (
                            <Box
                                key={dayIndex}
                                sx={{
                                    position: 'relative',
                                    minHeight: TOTAL_HEIGHT,
                                    borderRight: dayIndex === eventsByDay.length - 1 ? 'none' : '1px solid #e2e8f0',
                                }}
                            >
                                {Array.from({ length: TIME_MARKS.length }).map((_, hour) => (
                                    <Box
                                        key={`grid-${dayIndex}-${hour}`}
                                        sx={{
                                            position: 'absolute',
                                            top: hour * HOUR_HEIGHT,
                                            left: 0,
                                            right: 0,
                                            borderTop: '1px solid #e2e8f0',
                                            borderBottom: 'none',
                                            pointerEvents: 'none',
                                            opacity: hour % 2 === 0 ? 1 : 0.5,
                                            height: 1,
                                        }}
                                    />
                                ))}

                                {dayEvents
                                    .filter((event) => isValidTimeRange(event.startTime, event.endTime))
                                    .map((event) => {
                                    const top = eventTop(event.startTime)
                                    const height = eventHeight(event.startTime, event.endTime)
                                    const eventModuleName = event.moduleId
                                        ? moduleNameById(event.moduleId)
                                        : event.category || '未关联'
                                    const eventColor = event.color || moduleColorMap.get(event.moduleId) || '#6366f1'

                                    return (
                                        <Box
                                            key={event.id}
                                            onClick={() => openEditDialog(event)}
                                            sx={{
                                                position: 'absolute',
                                                left: '4px',
                                                right: '4px',
                                                top,
                                                height,
                                                minHeight: 40,
                                                boxSizing: 'border-box',
                                                bgcolor: eventColor,
                                                color: '#fff',
                                                borderRadius: '10px',
                                                p: 0.8,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
                                                overflow: 'hidden',
                                                zIndex: 2,
                                                '&:hover': {
                                                    filter: 'brightness(1.05)',
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2 }}
                                                    noWrap
                                                >
                                                    {event.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="编辑">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'white', p: 0.3 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                openEditDialog(event)
                                                            }}
                                                        >
                                                            <EditIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="删除">
                                                        <IconButton
                                                            size="small"
                                                            sx={{ color: 'white', p: 0.3 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDeleteTarget(event)
                                                            }}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                <Typography variant="caption" sx={{ opacity: 0.95 }}>
                                    {pickEventDateForWeek(event, weekDates)} {event.startTime} - {event.endTime}
                                </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.9 }} noWrap>
                                                {eventModuleName}
                                            </Typography>
                                        </Box>
                                    )
                                })}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, color: '#0f172a' }}>
                    <CalendarMonthIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {editingEvent ? '编辑周事件' : '新建周事件'}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
                        <TextField
                            fullWidth
                            label="标题"
                            value={form.title}
                            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>模块（分类）</InputLabel>
                            <Select
                                label="模块（分类）"
                                    value={form.moduleId}
                                onChange={(e) => {
                                    const moduleId = String(e.target.value)
                                    const name = moduleNameById(moduleId)
                                    setForm((prev) => ({
                                        ...prev,
                                        moduleId,
                                        category: name || prev.category,
                                        color: moduleColorMap.get(moduleId) || '#6366f1',
                                    }))
                                }}
                                >
                                    {modules.length === 0 && (
                                        <MenuItem value="" disabled>
                                            暂无模块，请先创建模块
                                        </MenuItem>
                                    )}
                                    {moduleFilterOptions
                                        .filter((option) => option.id !== 'all')
                                        .map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            type="date"
                            label="日期"
                            value={form.eventDate}
                            onChange={(e) => {
                                const value = e.target.value
                                setForm((prev) => ({
                                    ...prev,
                                    eventDate: value,
                                    dayOfWeek: toWeekdayIndex(value),
                                }))
                            }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <FormControl fullWidth required>
                                <InputLabel>星期</InputLabel>
                                <Select
                                    label="星期"
                                    value={form.dayOfWeek}
                                    onChange={(e) => setForm((prev) => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
                                >
                                    {WEEK_DAY_LABELS.map((label, idx) => (
                                        <MenuItem key={label} value={idx}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                type="color"
                                label="颜色"
                                value={form.color || moduleColorMap.get(form.moduleId) || '#6366f1'}
                                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    type="time"
                                    label="开始时间"
                                    value={form.startTime}
                                    onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 60 }}
                                />
                            <TextField
                                fullWidth
                                type="time"
                                label="结束时间"
                                value={form.endTime}
                                onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                                    inputProps={{ step: 60 }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="备注"
                            value={form.note}
                            onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={closeDialog}>取消</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateSubmit}
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: 2,
                            '&:hover': { backgroundColor: '#4f46e5' },
                        }}
                    >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={!!deleteTarget}
                title="确认删除周事件"
                message={deleteTarget ? `确认删除「${deleteTarget.title}」吗？` : ''}
                onConfirm={handleDelete}
                onClose={() => setDeleteTarget(null)}
                type="delete"
            />
        </Box>
    )
}

export default WeeklySchedulePage
