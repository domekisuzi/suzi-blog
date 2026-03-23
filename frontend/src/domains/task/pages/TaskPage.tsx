import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    Box,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Pagination,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import TaskMain from '../components/TaskMain'
import TaskDetailCard from '../components/TaskDetailCard'
import CreateTaskCard from '../components/CreateTaskCard'
import CreateSubTaskCard from '../components/CreateSubTaskCard'
import { fetchTasks, deleteTask, updateTask, getAllTaskVos } from '../api/taskApi'
import { fetchModules } from '../../module/api/moduleApi'
import { Task, TaskDetailVo, Subtask } from '../model/taskTypes'
import { Module } from '../../module/model/module'
import { useLoading } from '../../../context/LoadingContext'

type SortMode = 'name' | 'date' | 'priority' | 'module'
type FilterStatus = 'all' | 'pending' | 'completed'
const ITEMS_PER_PAGE = 12

const TaskPage: React.FC = () => {
    const { setLoading } = useLoading()
    const [searchParams] = useSearchParams()
    const moduleIdFromUrl = searchParams.get('moduleId')
    const moduleNameFromUrl = searchParams.get('moduleName')
    
    // 数据状态
    const [detailTaskVoList, setDetailTaskVoList] = useState<TaskDetailVo[]>([])
    const [moduleList, setModuleList] = useState<Module[]>([])
    const [filteredTasks, setFilteredTasks] = useState<TaskDetailVo[]>([])
    
    // UI状态
    const [searchQuery, setSearchQuery] = useState('')
    const [sortMode, setSortMode] = useState<SortMode>('date')
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [filterModule, setFilterModule] = useState<string>(moduleIdFromUrl || 'all')
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
    const [currentPage, setCurrentPage] = useState(1)
    
    // 对话框状态
    const [createTaskOpen, setCreateTaskOpen] = useState(false)
    const [detailTaskOpen, setDetailTaskOpen] = useState(false)
    const [editTaskOpen, setEditTaskOpen] = useState(false)
    const [createSubTaskOpen, setCreateSubTaskOpen] = useState(false)
    const [nowDetailTask, setNowDetailTask] = useState<Task | null>(null)

    // 加载数据
    useEffect(() => {
        refreshData()
    }, [])

    // 当URL参数变化时更新筛选
    useEffect(() => {
        if (moduleIdFromUrl) {
            setFilterModule(moduleIdFromUrl)
        }
    }, [moduleIdFromUrl])

    // 筛选和排序
    useEffect(() => {
        let filtered = [...detailTaskVoList]

        // 模块筛选 - 根据模块名称筛选
        if (filterModule !== 'all') {
            // 找到对应的模块名称
            const selectedModule = moduleList.find(m => m.id === filterModule)
            if (selectedModule) {
                filtered = filtered.filter(t => t.moduleName === selectedModule.name)
            }
        }

        // 搜索筛选
        if (searchQuery) {
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // 状态筛选
        if (filterStatus !== 'all') {
            filtered = filtered.filter(t => {
                const isCompleted = t.completedRate === '100%'
                return filterStatus === 'completed' ? isCompleted : !isCompleted
            })
        }

        // 排序
        filtered.sort((a, b) => {
            if (sortMode === 'name') return a.title.localeCompare(b.title)
            if (sortMode === 'date') return (b.createdAt || '').localeCompare(a.createdAt || '')
            if (sortMode === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0)
            }
            return 0
        })

        setFilteredTasks(filtered)
        setCurrentPage(1) // 重置页码
    }, [searchQuery, filterStatus, filterModule, sortMode, detailTaskVoList, moduleList])

    const refreshData = () => {
        fetchModules().then(setModuleList).catch(console.error)
        getAllTaskVos().then(setDetailTaskVoList).catch(console.error)
    }

    // 分页计算
    const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // 事件处理
    const handleSortClick = (event: React.MouseEvent<HTMLElement>) => setSortAnchorEl(event.currentTarget)
    const handleSortClose = () => setSortAnchorEl(null)
    const handleSortSelect = (mode: SortMode) => { setSortMode(mode); handleSortClose() }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => setFilterAnchorEl(event.currentTarget)
    const handleFilterClose = () => setFilterAnchorEl(null)

    const handleDeleteTask = (task: TaskDetailVo) => {
        if (window.confirm('确定要删除这个任务吗？')) {
            setLoading(true)
            deleteTask(task.id).then(() => {
                refreshData()
            }).finally(() => setLoading(false))
        }
    }

    const handleEditTask = (task: TaskDetailVo) => {
        const fullTask: Task = {
            ...task,
            subtasks: task.subtasks || [],
        }
        setNowDetailTask(fullTask)
        setEditTaskOpen(true)
    }

    const handleDetailTaskOpen = (task: TaskDetailVo) => {
        const fullTask: Task = {
            ...task,
            subtasks: task.subtasks || [],
        }
        setNowDetailTask(fullTask)
        setDetailTaskOpen(true)
    }

    const handleCreateSubTaskOpen = (task: TaskDetailVo) => {
        const fullTask: Task = {
            ...task,
            subtasks: task.subtasks || [],
        }
        setNowDetailTask(fullTask)
        setCreateSubTaskOpen(true)
    }

    const handleEditTaskSubmit = () => {
        if (nowDetailTask) {
            setLoading(true)
            updateTask(nowDetailTask.id, nowDetailTask).then(() => {
                refreshData()
                setEditTaskOpen(false)
            }).finally(() => setLoading(false))
        }
    }

    const handleCreateTaskSubmit = (task: Task) => {
        setCreateTaskOpen(false)
        refreshData()
    }

    const handleCreateSubTaskSubmit = (subtask: Partial<Subtask>) => {
        setCreateSubTaskOpen(false)
        refreshData()
    }

    // 优先级颜色
    const getPriorityColor = (priority?: number) => {
        switch (priority) {
            case 3: return '#ef4444' // 高 - 红色
            case 2: return '#f59e0b' // 中 - 橙色
            case 1: return '#22c55e' // 低 - 绿色
            default: return '#64748b'
        }
    }

    return (
        <Box>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        任务管理
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        共 {filteredTasks.length} 个任务
                    </Typography>
                </Box>
                <IconButton 
                    onClick={() => setCreateTaskOpen(true)}
                    sx={{ 
                        backgroundColor: '#6366f1', 
                        color: 'white',
                        '&:hover': { backgroundColor: '#4f46e5' },
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            {/* 搜索和工具栏 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="搜索任务..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                    sx={{ 
                        minWidth: 300,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#f8fafc',
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    {/* 筛选按钮 */}
                    <IconButton 
                        onClick={handleFilterClick}
                        sx={{ 
                            backgroundColor: '#f1f5f9',
                            '&:hover': { backgroundColor: '#e2e8f0' },
                        }}
                    >
                        <FilterListIcon />
                    </IconButton>
                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterClose}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                mt: 1,
                                minWidth: 200,
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                📊 状态筛选
                            </Typography>
                        </Box>
                        <MenuItem 
                            onClick={() => { setFilterStatus('all'); handleFilterClose() }}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: filterStatus === 'all' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: filterStatus === 'all' ? '#6366f1' : '#64748b' }}>
                                📋 全部
                            </ListItemText>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => { setFilterStatus('pending'); handleFilterClose() }}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: filterStatus === 'pending' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: filterStatus === 'pending' ? '#6366f1' : '#64748b' }}>
                                🔄 进行中
                            </ListItemText>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => { setFilterStatus('completed'); handleFilterClose() }}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: filterStatus === 'completed' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: filterStatus === 'completed' ? '#6366f1' : '#64748b' }}>
                                ✅ 已完成
                            </ListItemText>
                        </MenuItem>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                📁 模块筛选
                            </Typography>
                        </Box>
                        <MenuItem 
                            onClick={() => { setFilterModule('all'); handleFilterClose() }}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: filterModule === 'all' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: filterModule === 'all' ? '#6366f1' : '#64748b' }}>
                                📂 全部模块
                            </ListItemText>
                        </MenuItem>
                        {moduleList.map(m => (
                            <MenuItem 
                                key={m.id} 
                                onClick={() => { setFilterModule(m.id); handleFilterClose() }}
                                sx={{ 
                                    borderRadius: '8px', 
                                    mx: 1, 
                                    my: 0.5,
                                    backgroundColor: filterModule === m.id ? '#f1f5f9' : 'transparent',
                                }}
                            >
                                <ListItemText sx={{ color: filterModule === m.id ? '#6366f1' : '#64748b' }}>
                                    {m.name}
                                </ListItemText>
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* 排序按钮 */}
                    <IconButton 
                        onClick={handleSortClick}
                        sx={{ 
                            backgroundColor: '#f1f5f9',
                            '&:hover': { backgroundColor: '#e2e8f0' },
                        }}
                    >
                        <SortIcon />
                    </IconButton>
                    <Menu
                        anchorEl={sortAnchorEl}
                        open={Boolean(sortAnchorEl)}
                        onClose={handleSortClose}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                mt: 1,
                                minWidth: 180,
                            }
                        }}
                    >
                        <MenuItem 
                            onClick={() => handleSortSelect('date')}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: sortMode === 'date' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: sortMode === 'date' ? '#6366f1' : '#64748b' }}>
                                📅 按创建时间排序
                            </ListItemText>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleSortSelect('name')}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: sortMode === 'name' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: sortMode === 'name' ? '#6366f1' : '#64748b' }}>
                                🔤 按名称排序
                            </ListItemText>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => handleSortSelect('priority')}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: sortMode === 'priority' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: sortMode === 'priority' ? '#6366f1' : '#64748b' }}>
                                ⚡ 按优先级排序
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* 快速筛选标签 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                    label="全部" 
                    clickable 
                    onClick={() => setFilterStatus('all')}
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: filterStatus === 'all' ? '#6366f1' : '#f1f5f9',
                        color: filterStatus === 'all' ? 'white' : '#64748b',
                    }} 
                />
                <Chip 
                    label="进行中" 
                    clickable 
                    onClick={() => setFilterStatus('pending')}
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: filterStatus === 'pending' ? '#6366f1' : '#f1f5f9',
                        color: filterStatus === 'pending' ? 'white' : '#64748b',
                    }} 
                />
                <Chip 
                    label="已完成" 
                    clickable 
                    onClick={() => setFilterStatus('completed')}
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: filterStatus === 'completed' ? '#6366f1' : '#f1f5f9',
                        color: filterStatus === 'completed' ? 'white' : '#64748b',
                    }} 
                />
            </Box>

            {/* 任务网格 */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: 2,
                mb: 3 
            }}>
                {paginatedTasks.map((task) => (
                    <TaskMain
                        key={task.id}
                        task={task}
                        onClick={() => handleDetailTaskOpen(task)}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        addSubTaskClick={() => handleCreateSubTaskOpen(task)}
                    />
                ))}
            </Box>

            {/* 空状态 */}
            {paginatedTasks.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                        暂无任务
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', mt: 1 }}>
                        点击右上角的 + 按钮创建新任务
                    </Typography>
                </Box>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => setCurrentPage(page)}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: '8px',
                            },
                        }}
                    />
                </Box>
            )}

            {/* 创建任务对话框 */}
            <Dialog 
                open={createTaskOpen} 
                onClose={() => setCreateTaskOpen(false)} 
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
                    ✨ 创建任务
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <CreateTaskCard onSubmit={handleCreateTaskSubmit} />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setCreateTaskOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        type="submit" 
                        form="createTaskForm" 
                        variant="contained"
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { backgroundColor: '#4f46e5' }
                        }}
                    >
                        创建
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 任务详情对话框 */}
            <Dialog 
                open={detailTaskOpen} 
                onClose={() => setDetailTaskOpen(false)} 
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
                    📋 任务详情
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3 }}>
                    {nowDetailTask && <TaskDetailCard task={nowDetailTask} isEditing={false} />}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={() => setDetailTaskOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 编辑任务对话框 */}
            <Dialog 
                open={editTaskOpen} 
                onClose={() => setEditTaskOpen(false)} 
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
                    ✏️ 编辑任务
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3 }}>
                    {nowDetailTask && (
                        <TaskDetailCard task={nowDetailTask} isEditing={true} onChange={setNowDetailTask} />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setEditTaskOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleEditTaskSubmit} 
                        variant="contained"
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { backgroundColor: '#4f46e5' }
                        }}
                    >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 创建子任务对话框 */}
            <Dialog 
                open={createSubTaskOpen} 
                onClose={() => setCreateSubTaskOpen(false)} 
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
                    ➕ 添加子任务
                </DialogTitle>
                <DialogContent dividers sx={{ py: 3 }}>
                    {nowDetailTask && (
                        <CreateSubTaskCard taskId={nowDetailTask.id} onSubmit={handleCreateSubTaskSubmit} />
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setCreateSubTaskOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        type="submit" 
                        form="createSubTaskForm" 
                        variant="contained"
                        sx={{
                            backgroundColor: '#6366f1',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': { backgroundColor: '#4f46e5' }
                        }}
                    >
                        创建
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

// Divider 组件
const Divider: React.FC<{ sx?: object }> = ({ sx }) => (
    <Box sx={{ height: 1, backgroundColor: '#e2e8f0', my: 1, ...sx }} />
)

export default TaskPage