import React, { useState, useRef, useEffect } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    Collapse,
    Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayIcon from '@mui/icons-material/Today'
import FlagIcon from '@mui/icons-material/Flag'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import FilterListIcon from '@mui/icons-material/FilterList'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { useLoading } from '../../../context/LoadingContext'
import { useNotification } from '../../../components/Notification'
import { fetchAllGoals, createGoal, deleteGoal, addTasksToGoal, GoalCreateInput, fetchTasksByGoalId, TaskInfo } from '../api/goalApi'
import { fetchTasks } from '../../task/api/taskApi'
import { Task } from '../../task/model/taskTypes'

// 类型定义 - 扩展Goal添加任务关联信息
interface Goal {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    color: string
    progress: number
    type: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
    taskIds?: string[]
    taskCount?: number
    completedTaskCount?: number
}

// 本地存储键
const STORAGE_KEYS = {
    BOTTOM_SECTION_COLLAPSED: 'timeline_bottom_section_collapsed',
    HIDDEN_GOALS: 'timeline_hidden_goals',
}

const TimelinePage: React.FC = () => {
    const { setLoading } = useLoading()
    const { showSuccess, showError, showWarning } = useNotification()
    const timelineRef = useRef<HTMLDivElement>(null)
    const timelineContainerRef = useRef<HTMLDivElement>(null)
    
    // 状态
    const [currentDate] = useState(new Date())
    const [viewStartDate, setViewStartDate] = useState(() => {
        // 初始化为当前月份前2个月
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth() - 2, 1)
    })
    const [goals, setGoals] = useState<Goal[]>([])
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
    const [selectedGoalTasks, setSelectedGoalTasks] = useState<TaskInfo[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [bindTaskDialogOpen, setBindTaskDialogOpen] = useState(false)
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
    const [bindingGoalId, setBindingGoalId] = useState<string | null>(null)
    
    // 下半部分整体折叠状态
    const [isBottomSectionCollapsed, setIsBottomSectionCollapsed] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.BOTTOM_SECTION_COLLAPSED)
        return saved ? JSON.parse(saved) : false
    })
    
    // 隐藏的目标列表
    const [hiddenGoals, setHiddenGoals] = useState<string[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.HIDDEN_GOALS)
        return saved ? JSON.parse(saved) : []
    })
    
    // 显示隐藏目标管理对话框
    const [showHiddenGoalsDialog, setShowHiddenGoalsDialog] = useState(false)
    
    // 新目标表单
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'SHORT_TERM' as Goal['type'],
    })

    // 保存折叠状态到本地存储
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.BOTTOM_SECTION_COLLAPSED, JSON.stringify(isBottomSectionCollapsed))
    }, [isBottomSectionCollapsed])
    
    // 保存隐藏目标到本地存储
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.HIDDEN_GOALS, JSON.stringify(hiddenGoals))
    }, [hiddenGoals])

    // 加载数据
    useEffect(() => {
        loadGoals()
    }, [])

    // 当选中目标变化时，加载绑定的任务
    useEffect(() => {
        if (selectedGoal) {
            loadSelectedGoalTasks(selectedGoal.id)
        } else {
            setSelectedGoalTasks([])
        }
    }, [selectedGoal])

    // 当绑定任务对话框打开时，加载所有任务
    useEffect(() => {
        if (bindTaskDialogOpen && bindingGoalId) {
            // 先验证目标是否存在于当前目标列表中
            const goalExists = goals.find(g => g.id === bindingGoalId)
            if (!goalExists) {
                console.error('目标不存在:', bindingGoalId)
                setBindTaskDialogOpen(false)
                setBindingGoalId(null)
                showWarning('目标已不存在，请刷新页面后重试')
                return
            }
            fetchTasks().then(tasks => {
                setAllTasks(tasks)
                setSelectedTaskIds([])
            })
        }
    }, [bindTaskDialogOpen, bindingGoalId, goals])

    const loadGoals = async () => {
        setLoading(true)
        try {
            const data = await fetchAllGoals()
            setGoals(data)
            // 验证 selectedGoal 是否仍然存在于新的数据中
            if (selectedGoal) {
                const goalStillExists = data.find(g => g.id === selectedGoal.id)
                if (!goalStillExists) {
                    console.warn('选中的目标已不存在，清除选中状态:', selectedGoal.id)
                    setSelectedGoal(null)
                    setSelectedGoalTasks([])
                }
            }
        } catch (error) {
            console.error('加载目标失败:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadSelectedGoalTasks = async (goalId: string) => {
        setLoading(true)
        try {
            const tasks = await fetchTasksByGoalId(goalId)
            setSelectedGoalTasks(tasks)
        } catch (error: any) {
            console.error('加载目标任务失败:', error)
            // 如果目标不存在（404 或错误信息包含 Goal not found），清除选中状态
            if (error.response?.status === 404 || error.message?.includes('Goal not found')) {
                console.warn('目标已不存在，清除选中状态:', goalId)
                setSelectedGoal(null)
                setSelectedGoalTasks([])
            } else {
                setSelectedGoalTasks([])
            }
        } finally {
            setLoading(false)
        }
    }

    // 显示6个月的时间线
    const monthsInView = 6
    
    // 生成月份列表 - 使用 viewStartDate 作为起始点
    const getMonthsList = () => {
        const months = []
        const startDate = new Date(viewStartDate.getFullYear(), viewStartDate.getMonth(), 1)
        for (let i = 0; i < monthsInView; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
            months.push({
                date,
                label: `${date.getMonth() + 1}月`,
                fullLabel: `${date.getFullYear()}年${date.getMonth() + 1}月`,
                isCurrentMonth: date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear(),
            })
        }
        return months
    }

    // 计算目标在时间线上的位置
    const getGoalPosition = (goal: Goal) => {
        const months = getMonthsList()
        const startMonth = months[0].date
        const start = new Date(goal.startDate)
        const end = new Date(goal.endDate)
        
        const startOffset = (start.getFullYear() - startMonth.getFullYear()) * 12 + (start.getMonth() - startMonth.getMonth())
        const endOffset = (end.getFullYear() - startMonth.getFullYear()) * 12 + (end.getMonth() - startMonth.getMonth())
        
        const leftPercent = Math.max(0, (startOffset / monthsInView) * 100)
        const rightPercent = Math.min(100, ((endOffset + 1) / monthsInView) * 100)
        const widthPercent = rightPercent - leftPercent
        
        return {
            left: `${leftPercent}%`,
            width: `${Math.max(widthPercent, 8)}%`,
            isInView: startOffset < monthsInView && endOffset >= 0,
        }
    }

    // 计算当前日期指示线位置
    const getTodayPosition = () => {
        const months = getMonthsList()
        const startMonth = months[0].date
        const dayOffset = (currentDate.getFullYear() - startMonth.getFullYear()) * 12 + 
            (currentDate.getMonth() - startMonth.getMonth())
        const dayInMonth = currentDate.getDate()
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
        
        const monthPercent = dayOffset / monthsInView
        const dayPercent = (dayInMonth / daysInMonth) / monthsInView
        
        return (monthPercent + dayPercent) * 100
    }

    // 导航 - 向左移动3个月
    const navigateLeft = () => {
        setViewStartDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 3, 1))
    }

    // 导航 - 向右移动3个月
    const navigateRight = () => {
        setViewStartDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 3, 1))
    }

    // 导航 - 回到今天（当前月份前2个月）
    const goToToday = () => {
        const now = new Date()
        setViewStartDate(new Date(now.getFullYear(), now.getMonth() - 2, 1))
    }

    // 获取长期目标
    const getLongTermGoals = () => {
        return goals.filter(g => g.type === 'LONG_TERM')
    }
    
    // 获取可见的目标（排除隐藏的）
    const getVisibleGoals = () => {
        return goals.filter(g => !hiddenGoals.includes(g.id))
    }

    // 添加目标
    const handleAddGoal = async () => {
        if (newGoal.title && newGoal.startDate && newGoal.endDate) {
            setLoading(true)
            try {
                const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6']
                const input: GoalCreateInput = {
                    ...newGoal,
                    color: colors[Math.floor(Math.random() * colors.length)],
                }
                await createGoal(input)
                await loadGoals()
                setAddDialogOpen(false)
                setNewGoal({ title: '', description: '', startDate: '', endDate: '', type: 'SHORT_TERM' })
            } catch (error) {
                console.error('创建目标失败:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    // 删除目标
    const handleDeleteGoal = async (id: string) => {
        if (window.confirm('确定要删除这个目标吗？')) {
            setLoading(true)
            try {
                await deleteGoal(id)
                await loadGoals()
                setSelectedGoal(null)
            } catch (error) {
                console.error('删除目标失败:', error)
            } finally {
                setLoading(false)
            }
        }
    }
    
    // 隐藏/显示目标
    const toggleGoalVisibility = (goalId: string) => {
        setHiddenGoals(prev => {
            if (prev.includes(goalId)) {
                return prev.filter(id => id !== goalId)
            } else {
                return [...prev, goalId]
            }
        })
    }

    // 获取类型显示文本
    const getTypeLabel = (type: Goal['type']) => {
        switch (type) {
            case 'SHORT_TERM': return '短期'
            case 'MEDIUM_TERM': return '中期'
            case 'LONG_TERM': return '长期'
        }
    }
    
    // 格式化日期显示
    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return `${date.getMonth() + 1}/${date.getDate()}`
    }

    const months = getMonthsList()
    const longTermGoals = getLongTermGoals()
    const visibleGoals = getVisibleGoals()

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: 'calc(100vh - 120px)', 
            gap: 3,
            overflow: 'hidden',
        }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        时间线
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        管理你的目标和任务进度
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="隐藏的目标">
                        <IconButton 
                            onClick={() => setShowHiddenGoalsDialog(true)}
                            sx={{ 
                                backgroundColor: hiddenGoals.length > 0 ? '#fef3c7' : '#f1f5f9',
                                color: hiddenGoals.length > 0 ? '#f59e0b' : '#64748b',
                            }}
                        >
                            <FilterListIcon />
                            {hiddenGoals.length > 0 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
                                        width: 18,
                                        height: 18,
                                        borderRadius: '50%',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontSize: 11,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {hiddenGoals.length}
                                </Box>
                            )}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="今天">
                        <IconButton onClick={goToToday} sx={{ backgroundColor: '#f1f5f9' }}>
                            <TodayIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="向左移动">
                        <IconButton onClick={navigateLeft} sx={{ backgroundColor: '#f1f5f9' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="向右移动">
                        <IconButton onClick={navigateRight} sx={{ backgroundColor: '#f1f5f9' }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="添加目标">
                        <IconButton 
                            onClick={() => setAddDialogOpen(true)}
                            sx={{ backgroundColor: '#6366f1', color: 'white', '&:hover': { backgroundColor: '#4f46e5' } }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* 上半部分：时间线 */}
            <Card sx={{ 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                flex: isBottomSectionCollapsed ? 1 : '0 0 auto',
                height: isBottomSectionCollapsed ? 'calc(100vh - 200px)' : 280,
                minHeight: isBottomSectionCollapsed ? 'calc(100vh - 200px)' : 280,
                maxHeight: isBottomSectionCollapsed ? 'calc(100vh - 200px)' : 280,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <CardContent sx={{ 
                    p: 2, 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b' }}>
                            📅 目标时间线
                            {isBottomSectionCollapsed && (
                                <Typography component="span" variant="caption" sx={{ ml: 1, color: '#94a3b8' }}>
                                    (已展开)
                                </Typography>
                            )}
                        </Typography>
                        <Tooltip title={isBottomSectionCollapsed ? "展开详情区域" : "折叠详情区域"}>
                            <IconButton 
                                size="small"
                                onClick={() => setIsBottomSectionCollapsed(!isBottomSectionCollapsed)}
                                sx={{ 
                                    backgroundColor: isBottomSectionCollapsed ? '#6366f1' : '#f1f5f9',
                                    color: isBottomSectionCollapsed ? 'white' : '#64748b',
                                    '&:hover': { 
                                        backgroundColor: isBottomSectionCollapsed ? '#4f46e5' : '#e2e8f0' 
                                    }
                                }}
                            >
                                {isBottomSectionCollapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    <Box 
                        sx={{ 
                            position: 'relative',
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                        }} 
                        ref={timelineContainerRef}
                    >
                        {/* 月份标题行 */}
                        <Box sx={{ display: 'flex', borderBottom: '1px solid #e2e8f0', mb: 2, position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 5, flexShrink: 0 }}>
                            {months.map((month, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        flex: 1,
                                        textAlign: 'center',
                                        py: 1,
                                        backgroundColor: month.isCurrentMonth ? '#f1f5f9' : 'transparent',
                                        borderRight: index < months.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: month.isCurrentMonth ? 700 : 400,
                                            color: month.isCurrentMonth ? '#6366f1' : '#64748b',
                                        }}
                                    >
                                        {month.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* 目标条容器 - 使用flex布局 */}
                        <Box sx={{ 
                            position: 'relative', 
                            flex: 1,
                            minHeight: visibleGoals.length > 0 ? visibleGoals.length * 35 + 20 : 60,
                        }}>
                            {visibleGoals.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                        {goals.length > 0 ? '所有目标已隐藏' : '暂无目标'}
                                    </Typography>
                                </Box>
                            ) : (
                                visibleGoals.map((goal, index) => {
                                    const position = getGoalPosition(goal)
                                    const isSelected = selectedGoal?.id === goal.id
                                    if (!position.isInView) return null
                                    return (
                                        <Box
                                            key={goal.id}
                                            sx={{
                                                position: 'absolute',
                                                left: position.left,
                                                top: index * 35 + 10,
                                                width: position.width,
                                                height: 28,
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* 目标条 */}
                                            <Box
                                                onClick={() => setSelectedGoal(isSelected ? null : goal)}
                                                sx={{
                                                    flex: 1,
                                                    height: 28,
                                                    backgroundColor: goal.color,
                                                    borderRadius: '14px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    px: 1.5,
                                                    transition: 'all 0.2s ease',
                                                    opacity: isSelected ? 1 : 0.85,
                                                    boxShadow: isSelected ? `0 4px 12px ${goal.color}40` : 'none',
                                                    transform: isSelected ? 'scale(1.02)' : 'none',
                                                    zIndex: isSelected ? 10 : 1,
                                                    '&:hover': {
                                                        opacity: 1,
                                                        transform: 'scale(1.02)',
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 500,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {goal.title}
                                                </Typography>
                                                <Chip
                                                    label={`${goal.progress}%`}
                                                    size="small"
                                                    sx={{
                                                        ml: 'auto',
                                                        height: 18,
                                                        fontSize: 10,
                                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                                        color: 'white',
                                                    }}
                                                />
                                            </Box>
                                            
                                            {/* 隐藏/显示按钮 */}
                                            <Tooltip title={hiddenGoals.includes(goal.id) ? '显示' : '隐藏'}>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleGoalVisibility(goal.id)
                                                    }}
                                                    sx={{
                                                        ml: 0.5,
                                                        width: 24,
                                                        height: 24,
                                                        color: '#64748b',
                                                        opacity: 0.6,
                                                        '&:hover': { opacity: 1, backgroundColor: '#f1f5f9' },
                                                    }}
                                                >
                                                    {hiddenGoals.includes(goal.id) ? (
                                                        <VisibilityOffIcon fontSize="small" />
                                                    ) : (
                                                        <VisibilityIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )
                                })
                            )}

                            {/* 当前日期指示线 */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: `${getTodayPosition()}%`,
                                    top: 0,
                                    bottom: 0,
                                    width: 2,
                                    backgroundColor: '#ef4444',
                                    zIndex: 20,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: '#ef4444',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* 下半部分：三个区域（可整体折叠） */}
            <Collapse in={!isBottomSectionCollapsed} sx={{ flex: 1, minHeight: 0, '& .MuiCollapse-wrapper': { height: '100%' }, '& .MuiCollapse-wrapperInner': { height: '100%' } }}>
                <Box sx={{ display: 'flex', gap: 3, height: '100%', minHeight: 0, maxHeight: 'calc(100vh - 420px)' }}>
                    {/* 选中的目标信息 */}
                    <Card sx={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0', 
                        flex: '0 0 320px', 
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#64748b' }}>
                                    🎯 选中目标
                                </Typography>
                            </Box>
                            
                            <Box sx={{ flex: 1, overflow: 'auto' }}>
                                {selectedGoal ? (
                                    <Box sx={{ p: 2, borderRadius: '12px', backgroundColor: selectedGoal.color + '10', border: `1px solid ${selectedGoal.color}30` }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: selectedGoal.color,
                                                }}
                                            />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {selectedGoal.title}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12, mb: 1 }}>
                                            {selectedGoal.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{ flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3 }}>
                                                <Box
                                                    sx={{
                                                        width: `${selectedGoal.progress}%`,
                                                        height: '100%',
                                                        backgroundColor: selectedGoal.color,
                                                        borderRadius: 3,
                                                        transition: 'width 0.3s ease',
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                                {selectedGoal.progress}%
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                            {new Date(selectedGoal.startDate).toLocaleDateString()} - {new Date(selectedGoal.endDate).toLocaleDateString()}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                                            <Chip
                                                label={getTypeLabel(selectedGoal.type)}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: 11,
                                                    backgroundColor: selectedGoal.color + '20',
                                                    color: selectedGoal.color,
                                                }}
                                            />
                                            <Chip
                                                label={`${selectedGoal.completedTaskCount || 0}/${selectedGoal.taskCount || 0} 任务`}
                                                size="small"
                                                sx={{
                                                    height: 22,
                                                    fontSize: 11,
                                                    backgroundColor: '#f1f5f9',
                                                    color: '#64748b',
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteGoal(selectedGoal.id)}
                                                sx={{
                                                    ml: 'auto',
                                                    color: '#ef4444',
                                                    '&:hover': { backgroundColor: '#ef444420' }
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                            请选择一个目标
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 绑定任务列表 */}
                    <Card sx={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0', 
                        flex: 1, 
                        minWidth: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#64748b' }}>
                                    📋 {selectedGoal ? '绑定任务列表' : '请选择一个目标查看任务'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {selectedGoal && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                // 先验证目标是否仍然存在于目标列表中
                                                const goalExists = goals.find(g => g.id === selectedGoal.id)
                                                if (!goalExists) {
                                                    showWarning('目标已不存在，请刷新页面后重试')
                                                    setSelectedGoal(null)
                                                    return
                                                }
                                                setBindingGoalId(selectedGoal.id)
                                                setBindTaskDialogOpen(true)
                                            }}
                                            sx={{ color: '#6366f1' }}
                                        >
                                            <LinkIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            
                            <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0, maxHeight: '100%' }}>
                                {!selectedGoal ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                                            👆 点击时间线中的目标来查看绑定任务
                                        </Typography>
                                    </Box>
                                ) : selectedGoalTasks.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                                            暂无绑定任务
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            onClick={async () => {
                                                // 先验证目标是否仍然存在于目标列表中
                                                const goalExists = goals.find(g => g.id === selectedGoal.id)
                                                if (!goalExists) {
                                                    showWarning('目标已不存在，请重新选择')
                                                    setSelectedGoal(null)
                                                    return
                                                }
                                                setBindingGoalId(selectedGoal.id)
                                                const tasks = await fetchTasks()
                                                setAllTasks(tasks)
                                                setSelectedTaskIds([])
                                                setBindTaskDialogOpen(true)
                                            }}
                                            sx={{
                                                backgroundColor: '#6366f1',
                                                borderRadius: '8px',
                                                px: 3,
                                                '&:hover': { backgroundColor: '#4f46e5' }
                                            }}
                                        >
                                            绑定任务
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {selectedGoalTasks.map((task) => (
                                            <Card
                                                key={task.id}
                                                sx={{
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                                                                {task.title}
                                                            </Typography>
                                                            {task.description && (
                                                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12 }}>
                                                                    {task.description}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        <Chip
                                                            label={task.completed ? '已完成' : '进行中'}
                                                            size="small"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: 11,
                                                                backgroundColor: task.completed ? '#22c55e20' : '#f59e0b20',
                                                                color: task.completed ? '#22c55e' : '#f59e0b',
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                        {task.moduleName && (
                                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                                📁 {task.moduleName}
                                                            </Typography>
                                                        )}
                                                        {/* 显示任务时间 */}
                                                        {task.dueDate && (
                                                            <Typography variant="caption" sx={{ 
                                                                color: new Date(task.dueDate) < new Date() && !task.completed ? '#ef4444' : '#94a3b8',
                                                                fontWeight: new Date(task.dueDate) < new Date() && !task.completed ? 600 : 400,
                                                            }}>
                                                                📅 截止: {formatDate(task.dueDate)}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* 长期目标 */}
                    <Card sx={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0', 
                        flex: '0 0 320px',
                        minWidth: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: '#64748b' }}>
                                    🌟 长期目标
                                </Typography>
                            </Box>
                            
                            <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0, maxHeight: '100%' }}>
                                {longTermGoals.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                            暂无长期目标
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {longTermGoals.map(goal => (
                                            <Box
                                                key={goal.id}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    backgroundColor: goal.color + '10',
                                                    border: `1px solid ${goal.color}30`,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <FlagIcon sx={{ fontSize: 18, color: goal.color }} />
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        {goal.title}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12, mb: 1 }}>
                                                    {goal.description}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                        {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: goal.color, fontWeight: 600 }}>
                                                        {goal.progress}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Collapse>

            {/* 添加目标对话框 */}
            <Dialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b',
                    borderBottom: '1px solid #e2e8f0',
                    pb: 2,
                }}>
                    🎯 添加新目标
                </DialogTitle>
                <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="目标名称"
                        fullWidth
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <TextField
                        label="描述"
                        fullWidth
                        multiline
                        rows={2}
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="开始日期"
                            type="date"
                            fullWidth
                            value={newGoal.startDate}
                            onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            label="结束日期"
                            type="date"
                            fullWidth
                            value={newGoal.endDate}
                            onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                    </Box>
                    <FormControl fullWidth>
                        <InputLabel>目标类型</InputLabel>
                        <Select
                            value={newGoal.type}
                            label="目标类型"
                            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
                            sx={{ borderRadius: '12px' }}
                        >
                            <MenuItem value="SHORT_TERM">短期目标（1-3个月）</MenuItem>
                            <MenuItem value="MEDIUM_TERM">中期目标（3-6个月）</MenuItem>
                            <MenuItem value="LONG_TERM">长期目标（6个月以上）</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setAddDialogOpen(false)}
                        sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleAddGoal} 
                        variant="contained"
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { backgroundColor: '#4f46e5' }
                        }}
                    >
                        添加
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 绑定任务对话框 */}
            <Dialog
                open={bindTaskDialogOpen}
                onClose={() => setBindTaskDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b',
                    borderBottom: '1px solid #e2e8f0',
                    pb: 2,
                }}>
                    🔗 绑定任务到目标
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                        选择要关联到此目标的任务：
                    </Typography>
                    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {allTasks.length === 0 ? (
                            <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', py: 4 }}>
                                暂无可用的任务
                            </Typography>
                        ) : (
                            allTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    onClick={() => {
                                        setSelectedTaskIds(prev => 
                                            prev.includes(task.id) 
                                                ? prev.filter(id => id !== task.id)
                                                : [...prev, task.id]
                                        )
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                        mb: 1,
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: selectedTaskIds.includes(task.id) ? '#6366f1' : '#e2e8f0',
                                        backgroundColor: selectedTaskIds.includes(task.id) ? '#6366f110' : 'white',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: '#6366f1',
                                            backgroundColor: '#f8fafc',
                                        },
                                    }}
                                >
                                    <Checkbox
                                        checked={selectedTaskIds.includes(task.id)}
                                        size="small"
                                        sx={{ color: '#6366f1' }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                            {task.title}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                            {task.completed ? '✓ 已完成' : '○ 进行中'}
                                            {task.dueDate && ` · 📅 ${formatDate(task.dueDate)}`}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setBindTaskDialogOpen(false)}
                        sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={async () => {
                            if (bindingGoalId && selectedTaskIds.length > 0) {
                                setLoading(true)
                                try {
                                    // 先检查目标是否存在
                                    await loadSelectedGoalTasks(bindingGoalId)
                                    // 绑定任务
                                    await addTasksToGoal(bindingGoalId, selectedTaskIds)
                                    // 重新加载目标列表
                                    await loadGoals()
                                    // 重新加载选中目标的任务列表
                                    await loadSelectedGoalTasks(bindingGoalId)
                                    // 关闭对话框并重置状态
                                    setBindTaskDialogOpen(false)
                                    setSelectedTaskIds([])
                                    setBindingGoalId(null)
                                    showSuccess('任务绑定成功！')
                                } catch (error: any) {
                                    console.error('绑定任务失败:', error)
                                    const errorMsg = error.response?.data?.message || error.message || '绑定任务失败，请重试'
                                    showError('绑定任务失败：' + errorMsg)
                                } finally {
                                    setLoading(false)
                                }
                            }
                        }}
                        variant="contained"
                        disabled={selectedTaskIds.length === 0}
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { backgroundColor: '#4f46e5' },
                            '&:disabled': { backgroundColor: '#c7d2fe' }
                        }}
                    >
                        绑定 {selectedTaskIds.length} 个任务
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 隐藏目标管理对话框 */}
            <Dialog
                open={showHiddenGoalsDialog}
                onClose={() => setShowHiddenGoalsDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: '#1e293b',
                    borderBottom: '1px solid #e2e8f0',
                    pb: 2,
                }}>
                    👁️ 隐藏的目标
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    {hiddenGoals.length === 0 ? (
                        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', py: 4 }}>
                            没有隐藏的目标
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {goals
                                .filter(g => hiddenGoals.includes(g.id))
                                .map(goal => (
                                    <Box
                                        key={goal.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 2,
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: goal.color,
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                                                {goal.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Button
                                            size="small"
                                            onClick={() => toggleGoalVisibility(goal.id)}
                                            sx={{
                                                color: '#6366f1',
                                                '&:hover': { backgroundColor: '#6366f110' },
                                            }}
                                        >
                                            显示
                                        </Button>
                                    </Box>
                                ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setShowHiddenGoalsDialog(false)}
                        sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }}
                    >
                        关闭
                    </Button>
                    {hiddenGoals.length > 0 && (
                        <Button 
                            onClick={() => setHiddenGoals([])}
                            sx={{ color: '#6366f1', '&:hover': { backgroundColor: '#6366f110' } }}
                        >
                            显示全部
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TimelinePage
