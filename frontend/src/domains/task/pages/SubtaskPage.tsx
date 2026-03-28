import React, { useEffect, useState } from 'react'
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
    Pagination,
    Checkbox,
    Card,
    CardContent,
    ListItem,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { Subtask } from '../model/taskTypes'
import { getAllSubtasks, deleteSubtaskById, updateSubtaskByEntity } from '../api/taskApi'
import { useLoading } from '../../../context/LoadingContext'
import { dateUtils } from '../../../shared/utils/DateUtil'

type SortMode = 'name' | 'date' | 'status'
type FilterStatus = 'all' | 'pending' | 'completed'
const ITEMS_PER_PAGE = 15

const SubtaskPage: React.FC = () => {
    const { setLoading } = useLoading()
    
    // 数据状态
    const [subtasks, setSubtasks] = useState<Subtask[]>([])
    const [filteredSubtasks, setFilteredSubtasks] = useState<Subtask[]>([])
    
    // UI状态
    const [searchQuery, setSearchQuery] = useState('')
    const [sortMode, setSortMode] = useState<SortMode>('date')
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
    const [currentPage, setCurrentPage] = useState(1)

    // 确认对话框状态
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [subtaskToDelete, setSubtaskToDelete] = useState<Subtask | null>(null)

    // 编辑对话框状态
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [subtaskToEdit, setSubtaskToEdit] = useState<Subtask | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDueDate, setEditDueDate] = useState('')

    // 通知状态
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    })

    // 加载数据
    useEffect(() => {
        loadSubtasks()
    }, [])

    // 筛选和排序
    useEffect(() => {
        let filtered = [...subtasks]

        // 搜索筛选
        if (searchQuery) {
            filtered = filtered.filter(s => 
                s.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // 状态筛选
        if (filterStatus !== 'all') {
            filtered = filtered.filter(s => {
                return filterStatus === 'completed' ? s.completed : !s.completed
            })
        }

        // 排序
        filtered.sort((a, b) => {
            if (sortMode === 'name') return a.title.localeCompare(b.title)
            if (sortMode === 'date') return (b.createdAt || '').localeCompare(a.createdAt || '')
            if (sortMode === 'status') return Number(a.completed) - Number(b.completed)
            return 0
        })

        setFilteredSubtasks(filtered)
        setCurrentPage(1)
    }, [searchQuery, filterStatus, sortMode, subtasks])

    const loadSubtasks = () => {
        setLoading(true)
        getAllSubtasks().then(res => {
            setSubtasks(res)
        }).catch(console.error)
        .finally(() => setLoading(false))
    }

    // 分页计算
    const totalPages = Math.ceil(filteredSubtasks.length / ITEMS_PER_PAGE)
    const paginatedSubtasks = filteredSubtasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // 事件处理
    const handleSortClick = (event: React.MouseEvent<HTMLElement>) => setSortAnchorEl(event.currentTarget)
    const handleSortClose = () => setSortAnchorEl(null)
    const handleSortSelect = (mode: SortMode) => { setSortMode(mode); handleSortClose() }

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => setFilterAnchorEl(event.currentTarget)
    const handleFilterClose = () => setFilterAnchorEl(null)

    const handleToggleComplete = (subtask: Subtask) => {
        setLoading(true)
        updateSubtaskByEntity({ ...subtask, completed: !subtask.completed })
            .then(() => loadSubtasks())
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    const handleDelete = (subtask: Subtask) => {
        setSubtaskToDelete(subtask)
        setConfirmDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!subtaskToDelete) return
        
        // 检查 taskId 是否存在
        if (!subtaskToDelete.taskId) {
            setSnackbar({ 
                open: true, 
                message: '无法删除：该子任务数据不完整（缺少关联任务信息）', 
                severity: 'error' 
            })
            setConfirmDialogOpen(false)
            setSubtaskToDelete(null)
            return
        }
        
        setLoading(true)
        try {
            await deleteSubtaskById(subtaskToDelete.id)
            setSnackbar({ 
                open: true, 
                message: `子任务 "${subtaskToDelete.title}" 删除成功`, 
                severity: 'success' 
            })
            loadSubtasks()
        } catch (error: any) {
            console.error('Failed to delete subtask:', error)
            const errorMessage = error.response?.data?.message || error.message || '删除子任务失败'
            setSnackbar({ 
                open: true, 
                message: errorMessage, 
                severity: 'error' 
            })
        } finally {
            setLoading(false)
            setConfirmDialogOpen(false)
            setSubtaskToDelete(null)
        }
    }

    // 编辑处理函数
    const handleEditClick = (subtask: Subtask) => {
        setSubtaskToEdit(subtask)
        setEditTitle(subtask.title)
        setEditDueDate(subtask.dueDate || '')
        setEditDialogOpen(true)
    }

    const handleEditSave = async () => {
        if (!subtaskToEdit) return
        
        setLoading(true)
        try {
            await updateSubtaskByEntity({
                ...subtaskToEdit,
                title: editTitle,
                dueDate: editDueDate || undefined,
            })
            setSnackbar({ 
                open: true, 
                message: '子任务更新成功', 
                severity: 'success' 
            })
            loadSubtasks()
            setEditDialogOpen(false)
            setSubtaskToEdit(null)
        } catch (error: any) {
            console.error('Failed to update subtask:', error)
            setSnackbar({ 
                open: true, 
                message: error.response?.data?.message || '更新子任务失败', 
                severity: 'error' 
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditCancel = () => {
        setEditDialogOpen(false)
        setSubtaskToEdit(null)
        setEditTitle('')
        setEditDueDate('')
    }

    // 统计
    const completedCount = subtasks.filter(s => s.completed).length
    const pendingCount = subtasks.filter(s => !s.completed).length

    return (
        <Box>
            {/* 页面标题 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        子任务管理
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        共 {subtasks.length} 个子任务 · {completedCount} 已完成 · {pendingCount} 进行中
                    </Typography>
                </Box>
            </Box>

            {/* 搜索和工具栏 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="搜索子任务..."
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
                    >
                        <MenuItem onClick={() => { setFilterStatus('all'); handleFilterClose() }}>
                            <ListItemText primary="全部" />
                        </MenuItem>
                        <MenuItem onClick={() => { setFilterStatus('pending'); handleFilterClose() }}>
                            <ListItemText primary="进行中" />
                        </MenuItem>
                        <MenuItem onClick={() => { setFilterStatus('completed'); handleFilterClose() }}>
                            <ListItemText primary="已完成" />
                        </MenuItem>
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
                            onClick={() => handleSortSelect('status')}
                            sx={{ 
                                borderRadius: '8px', 
                                mx: 1, 
                                my: 0.5,
                                backgroundColor: sortMode === 'status' ? '#f1f5f9' : 'transparent',
                            }}
                        >
                            <ListItemText sx={{ color: sortMode === 'status' ? '#6366f1' : '#64748b' }}>
                                ✅ 按状态排序
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

            {/* 子任务列表 */}
            <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    {paginatedSubtasks.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                                暂无子任务
                            </Typography>
                        </Box>
                    ) : (
                        paginatedSubtasks.map((subtask, index) => (
                            <ListItem
                                key={subtask.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    py: 2,
                                    px: 3,
                                    borderBottom: index < paginatedSubtasks.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                    },
                                }}
                            >
                                {/* 完成状态复选框 */}
                                <Checkbox
                                    checked={subtask.completed}
                                    onChange={() => handleToggleComplete(subtask)}
                                    sx={{
                                        color: '#94a3b8',
                                        '&.Mui-checked': {
                                            color: '#22c55e',
                                        },
                                    }}
                                />

                                {/* 标题和日期 */}
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: subtask.completed ? '#94a3b8' : '#1e293b',
                                            textDecoration: subtask.completed ? 'line-through' : 'none',
                                        }}
                                    >
                                        {subtask.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: 12 }}>
                                            创建于 {subtask.createdAt ? new Date(subtask.createdAt).toLocaleDateString() : '未知'}
                                        </Typography>
                                        {subtask.dueDate && (
                                            <Typography variant="body2" sx={{ color: '#f59e0b', fontSize: 12 }}>
                                                截止: {dateUtils.toDisplayFormat(subtask.dueDate)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {/* 状态标签 */}
                                <Chip
                                    icon={subtask.completed ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CircleIcon sx={{ fontSize: 16 }} />}
                                    label={subtask.completed ? '已完成' : '进行中'}
                                    size="small"
                                    sx={{
                                        height: 24,
                                        fontSize: 12,
                                        backgroundColor: subtask.completed ? '#dcfce7' : '#fef3c7',
                                        color: subtask.completed ? '#16a34a' : '#d97706',
                                        '& .MuiChip-icon': { color: 'inherit' },
                                    }}
                                />

                                {/* 编辑按钮 */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleEditClick(subtask)}
                                    sx={{
                                        backgroundColor: '#eff6ff',
                                        color: '#3b82f6',
                                        '&:hover': { backgroundColor: '#dbeafe' },
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                </IconButton>

                                {/* 删除按钮 */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(subtask)}
                                    sx={{
                                        backgroundColor: '#fef2f2',
                                        color: '#dc2626',
                                        '&:hover': { backgroundColor: '#fee2e2' },
                                    }}
                                >
                                    <Typography sx={{ fontSize: 14 }}>删除</Typography>
                                </IconButton>
                            </ListItem>
                        ))
                    )}
                </CardContent>
            </Card>

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

            {/* 编辑对话框 */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditCancel}
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
                    ✏️ 编辑子任务
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <TextField
                        label="标题"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        label="截止日期"
                        type="date"
                        fullWidth
                        value={editDueDate ? dateUtils.toDisplayWithPattern(editDueDate, 'YYYY-MM-DD') : ''}
                        onChange={(e) => setEditDueDate(dateUtils.toBackendFormat(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={handleEditCancel}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleEditSave}
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

            {/* 确认对话框 */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title="确认删除"
                message={subtaskToDelete ? `确定要删除子任务 "${subtaskToDelete.title}" 吗？此操作不可恢复。` : ''}
                onConfirm={handleConfirmDelete}
                onClose={() => {
                    setConfirmDialogOpen(false)
                    setSubtaskToDelete(null)
                }}
                type="delete"
            />

            {/* 通知提示 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SubtaskPage
