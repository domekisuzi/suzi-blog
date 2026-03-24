import React, { useEffect, useState } from 'react'
import { Box, Typography, Chip, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import SortIcon from '@mui/icons-material/Sort'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ModuleDetailCard from '../components/ModuleDetailCard'
import ConfirmDialog from '../../../components/ConfirmDialog'
import { fetchModules, updateModule, deleteModule, createModule } from '../api/moduleApi'
import { Module } from '../model/module'
import { getAllTaskVos } from '../../task/api/taskApi'
import { useLoading } from '../../../context/LoadingContext'

type ViewMode = 'grid' | 'list'
type SortMode = 'name' | 'date'

interface ModuleWithProgress extends Module {
    taskNumber: number
    completedRate: number
    totalSubtasks: number
    completedSubtasks: number
}

const ModulePage: React.FC = () => {
    const { setLoading } = useLoading()
    const [moduleList, setModuleList] = useState<ModuleWithProgress[]>([])
    const [filteredModules, setFilteredModules] = useState<ModuleWithProgress[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortMode, setSortMode] = useState<SortMode>('name')
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [newModuleName, setNewModuleName] = useState('')
    
    // 编辑模块相关状态
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingModule, setEditingModule] = useState<ModuleWithProgress | null>(null)
    const [editModuleName, setEditModuleName] = useState('')

    // 确认对话框状态
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null)

    // 通知状态
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    })

    // 加载数据
    const loadModules = () => {
        setLoading(true)
        Promise.all([fetchModules(), getAllTaskVos()])
            .then(([modules, taskVos]) => {
                const modulesWithProgress = calculateModuleProgress(modules, taskVos)
                setModuleList(modulesWithProgress)
                setFilteredModules(modulesWithProgress)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    // 计算模块进度的函数
    const calculateModuleProgress = (modules: Module[], taskVos: any[]): ModuleWithProgress[] => {
        return modules.map(module => {
            // 找到该模块下的所有任务
            const moduleTasks = taskVos.filter((t: any) => t.moduleName === module.name)
            
            // 计算所有子任务
            let totalSubtasks = 0
            let completedSubtasks = 0
            
            moduleTasks.forEach((task: any) => {
                if (task.subtasks && task.subtasks.length > 0) {
                    totalSubtasks += task.subtasks.length
                    completedSubtasks += task.subtasks.filter((s: any) => s.completed).length
                }
            })
            
            // 计算完成率
            const completedRate = totalSubtasks > 0 
                ? Math.round((completedSubtasks / totalSubtasks) * 100)
                : 0
            
            return {
                ...module,
                taskNumber: moduleTasks.length,
                completedRate,
                totalSubtasks,
                completedSubtasks,
            }
        })
    }

    useEffect(() => {
        // 并行获取模块和任务数据
        Promise.all([fetchModules(), getAllTaskVos()])
            .then(([modules, taskVos]) => {
                const modulesWithProgress = calculateModuleProgress(modules, taskVos)
                setModuleList(modulesWithProgress)
                setFilteredModules(modulesWithProgress)
                console.log(modulesWithProgress, 'modules with progress fetched successfully')
            })
            .catch((e: Error) => {
                console.error(e, 'modules fetch failed')
            })
    }, [])

    useEffect(() => {
        let filtered = moduleList.filter(m => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        // 排序
        filtered.sort((a, b) => {
            if (sortMode === 'name') return a.name.localeCompare(b.name)
            if (sortMode === 'date') return (a.createdAt || '').localeCompare(b.createdAt || '')
            return 0
        })
        
        setFilteredModules(filtered)
    }, [searchQuery, moduleList, sortMode])

    const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget)
    }

    const handleSortClose = () => {
        setSortAnchorEl(null)
    }

    const handleSortSelect = (mode: SortMode) => {
        setSortMode(mode)
        handleSortClose()
    }

    const handleAddModule = async () => {
        const trimmedName = newModuleName.trim()
        if (!trimmedName) return

        // 检查模块名称是否已存在
        const isDuplicate = moduleList.some(m => m.name.toLowerCase() === trimmedName.toLowerCase())
        if (isDuplicate) {
            setSnackbar({ open: true, message: `模块 "${trimmedName}" 已存在`, severity: 'error' })
            return
        }

        setLoading(true)
        try {
            await createModule(trimmedName)
            setNewModuleName('')
            setAddDialogOpen(false)
            setSnackbar({ open: true, message: `模块 "${trimmedName}" 创建成功`, severity: 'success' })
            loadModules()
        } catch (error: any) {
            console.error('Failed to create module:', error)
            const errorMessage = error.response?.data?.message || '创建模块失败，请重试'
            setSnackbar({ open: true, message: errorMessage, severity: 'error' })
        } finally {
            setLoading(false)
        }
    }

    // 编辑模块
    const handleEditModule = (module: Module) => {
        setEditingModule(module as ModuleWithProgress)
        setEditModuleName(module.name)
        setEditDialogOpen(true)
    }

    const handleSaveEdit = async () => {
        if (editingModule && editModuleName.trim()) {
            setLoading(true)
            try {
                await updateModule(editingModule.id, { name: editModuleName })
                setEditDialogOpen(false)
                setEditingModule(null)
                loadModules()
            } catch (error) {
                console.error('Failed to update module:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    // 删除模块
    const handleDeleteModule = (module: Module) => {
        setModuleToDelete(module)
        setConfirmDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!moduleToDelete) return
        
        setLoading(true)
        try {
            await deleteModule(moduleToDelete.id)
            setSnackbar({ open: true, message: `模块 "${moduleToDelete.name}" 删除成功`, severity: 'success' })
            loadModules()
        } catch (error) {
            console.error('Failed to delete module:', error)
            setSnackbar({ open: true, message: '删除模块失败，请重试', severity: 'error' })
        } finally {
            setLoading(false)
            setConfirmDialogOpen(false)
            setModuleToDelete(null)
        }
    }

    const moduleColors = [
        { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' },
        { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' },
        { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff' },
        { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#333' },
        { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#333' },
        { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' },
    ]

    return (
        <Box>
            {/* 页面标题和操作栏 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        模块管理
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        共 {filteredModules.length} 个模块
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* 添加按钮 */}
                    <IconButton 
                        onClick={() => setAddDialogOpen(true)}
                        sx={{ 
                            backgroundColor: '#6366f1', 
                            color: 'white',
                            '&:hover': { backgroundColor: '#4f46e5' },
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* 搜索和工具栏 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {/* 搜索框 */}
                <TextField
                    placeholder="搜索模块..."
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
                    </Menu>

                    {/* 视图切换 */}
                    <IconButton 
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        sx={{ 
                            backgroundColor: '#f1f5f9',
                            '&:hover': { backgroundColor: '#e2e8f0' },
                        }}
                    >
                        {viewMode === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* 快速筛选标签 */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Chip 
                    label="全部" 
                    clickable 
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        '&:hover': { backgroundColor: '#4f46e5' },
                    }} 
                />
                <Chip 
                    label="进行中" 
                    clickable 
                    sx={{ borderRadius: '8px' }} 
                    variant="outlined"
                />
                <Chip 
                    label="已完成" 
                    clickable 
                    sx={{ borderRadius: '8px' }} 
                    variant="outlined"
                />
            </Box>

            {/* 模块网格/列表 */}
            {viewMode === 'grid' ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
                    {filteredModules.map((module, index) => (
                        <ModuleDetailCard 
                            key={module.id}
                            module={module} 
                            colorScheme={moduleColors[index % moduleColors.length]}
                            onEdit={handleEditModule}
                            onDelete={handleDeleteModule}
                        />
                    ))}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredModules.map((module, index) => (
                        <Box 
                            key={module.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: 2,
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: '#f1f5f9',
                                    transform: 'translateX(4px)',
                                },
                                cursor: 'pointer',
                            }}
                        >
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: moduleColors[index % moduleColors.length].bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 2,
                            }}>
                                <Typography sx={{ color: moduleColors[index % moduleColors.length].color, fontWeight: 700 }}>
                                    {module.name[0]}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {module.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    创建于 {module.createdAt ? new Date(module.createdAt).toLocaleDateString() : '未知'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton 
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleEditModule(module) }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteModule(module) }}
                                    sx={{ color: '#dc2626' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* 添加模块对话框 */}
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
                    📁 添加新模块
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="模块名称"
                        fullWidth
                        variant="outlined"
                        value={newModuleName}
                        onChange={(e) => setNewModuleName(e.target.value)}
                        sx={{ 
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setAddDialogOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleAddModule} 
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

            {/* 编辑模块对话框 */}
            <Dialog 
                open={editDialogOpen} 
                onClose={() => setEditDialogOpen(false)}
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
                    ✏️ 编辑模块
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="模块名称"
                        fullWidth
                        variant="outlined"
                        value={editModuleName}
                        onChange={(e) => setEditModuleName(e.target.value)}
                        sx={{ 
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                    <Button 
                        onClick={() => setEditDialogOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            '&:hover': { backgroundColor: '#f1f5f9' }
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleSaveEdit} 
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

            {/* 删除确认对话框 */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={() => {
                    setConfirmDialogOpen(false)
                    setModuleToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                title="删除模块"
                message={moduleToDelete ? `确定要删除模块 "${moduleToDelete.name}" 吗？此操作不可撤销。` : ''}
                confirmText="删除"
                cancelText="取消"
                type="delete"
            />

            {/* 通知 Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: '12px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ModulePage
