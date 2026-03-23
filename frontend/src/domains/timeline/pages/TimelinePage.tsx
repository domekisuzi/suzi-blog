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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayIcon from '@mui/icons-material/Today'
import FlagIcon from '@mui/icons-material/Flag'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import { useLoading } from '../../../context/LoadingContext'
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

const TimelinePage: React.FC = () => {
    const { setLoading } = useLoading()
    const timelineRef = useRef<HTMLDivElement>(null)
    
    // 状态
    const [currentDate] = useState(new Date())
    const [viewStartDate, setViewStartDate] = useState(new Date(2026, 0, 1))
    const [goals, setGoals] = useState<Goal[]>([])
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
    const [selectedGoalTasks, setSelectedGoalTasks] = useState<TaskInfo[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [bindTaskDialogOpen, setBindTaskDialogOpen] = useState(false)
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])
    const [bindingGoalId, setBindingGoalId] = useState<string | null>(null)
    
    // 新目标表单
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'SHORT_TERM' as Goal['type'],
    })

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
                alert('目标已不存在，请刷新页面后重试')
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
    
    // 生成月份列表
    const getMonthsList = () => {
        const months = []
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 2, 1)
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

    // 导航
    const navigateLeft = () => {
        setViewStartDate(new Date(viewStartDate.getFullYear(), viewStartDate.getMonth() - 3, 1))
    }

    const navigateRight = () => {
        setViewStartDate(new Date(viewStartDate.getFullYear(), viewStartDate.getMonth() + 3, 1))
    }

    const goToToday = () => {
        setViewStartDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1))
    }

    // 获取当前进行中的目标
    const getActiveGoals = () => {
        const today = currentDate.toISOString().split('T')[0]
        return goals.filter(g => g.startDate <= today && g.endDate >= today)
    }

    // 获取长期目标
    const getLongTermGoals = () => {
        return goals.filter(g => g.type === 'LONG_TERM')
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

    // 获取类型显示文本
    const getTypeLabel = (type: Goal['type']) => {
        switch (type) {
            case 'SHORT_TERM': return '短期'
            case 'MEDIUM_TERM': return '中期'
            case 'LONG_TERM': return '长期'
        }
    }

    const months = getMonthsList()
    const longTermGoals = getLongTermGoals()

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 3 }}>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        时间线
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        管理你的目标和任务进度
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={goToToday} sx={{ backgroundColor: '#f1f5f9' }}>
                        <TodayIcon />
                    </IconButton>
                    <IconButton onClick={navigateLeft} sx={{ backgroundColor: '#f1f5f9' }}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={navigateRight} sx={{ backgroundColor: '#f1f5f9' }}>
                        <ChevronRightIcon />
                    </IconButton>
                    <IconButton 
                        onClick={() => setAddDialogOpen(true)}
                        sx={{ backgroundColor: '#6366f1', color: 'white', '&:hover': { backgroundColor: '#4f46e5' } }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* 上半部分：时间线 */}
            <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', flex: '0 0 auto' }}>
                <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
                        📅 目标时间线
                    </Typography>
                    
                    <Box sx={{ position: 'relative' }} ref={timelineRef}>
                        {/* 月份标题行 */}
                        <Box sx={{ display: 'flex', borderBottom: '1px solid #e2e8f0', mb: 2 }}>
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

                        {/* 目标条 */}
                        <Box sx={{ position: 'relative', minHeight: 120 }}>
                            {goals.map((goal, index) => {
                                const position = getGoalPosition(goal)
                                const isSelected = selectedGoal?.id === goal.id
                                if (!position.isInView) return null
                                return (
                                    <Box
                                        key={goal.id}
                                        onClick={() => setSelectedGoal(isSelected ? null : goal)}
                                        sx={{
                                            position: 'absolute',
                                            left: position.left,
                                            top: index * 35 + 10,
                                            width: position.width,
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
                                )
                            })}

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

            {/* 下半部分：选中目标的绑定任务 */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, overflow: 'hidden' }}>
                {/* 选中的目标信息 */}
                {selectedGoal ? (
                    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', flex: '0 0 320px', overflow: 'auto' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
                                🎯 选中目标
                            </Typography>
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
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
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
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ) : null}

                {/* 绑定任务列表 */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, overflow: 'auto' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#64748b' }}>
                                📋 {selectedGoal ? '绑定任务列表' : '请选择一个目标查看任务'}
                            </Typography>
                            {selectedGoal && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        // 先验证目标是否仍然存在于目标列表中
                                        const goalExists = goals.find(g => g.id === selectedGoal.id)
                                        if (!goalExists) {
                                            alert('目标已不存在，请刷新页面后重试')
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
                                            alert('目标已不存在，请重新选择')
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
                                            {task.moduleName && (
                                                <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block' }}>
                                                    📁 {task.moduleName}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* 长期目标 */}
                <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', width: 320, overflow: 'auto' }}>
                    <CardContent>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
                            🌟 长期目标
                        </Typography>
                        
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
                    </CardContent>
                </Card>
            </Box>

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
                                    alert('任务绑定成功！')
                                } catch (error: any) {
                                    console.error('绑定任务失败:', error)
                                    const errorMsg = error.response?.data?.message || error.message || '绑定任务失败，请重试'
                                    alert('绑定任务失败：' + errorMsg)
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
        </Box>
    )
}

export default TimelinePage
