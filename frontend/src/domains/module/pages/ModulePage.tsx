import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Chip, TextField, InputAdornment, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import SortIcon from '@mui/icons-material/Sort'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ModuleDetailCard from '../components/ModuleDetailCard'
import { fetchModules } from '../api/moduleApi'
import { Module } from '../model/module'

type ViewMode = 'grid' | 'list'
type SortMode = 'name' | 'date' | 'tasks'

const ModulePage: React.FC = () => {
    const [moduleList, setModuleList] = useState<Module[]>([])
    const [filteredModules, setFilteredModules] = useState<Module[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortMode, setSortMode] = useState<SortMode>('name')
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [newModuleName, setNewModuleName] = useState('')

    useEffect(() => {
        fetchModules().then((res: Module[]) => {
            setModuleList(res)
            setFilteredModules(res)
            console.log(res, 'modules fetched successfully')
        }).catch((e: Error) => {
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

    const handleAddModule = () => {
        if (newModuleName.trim()) {
            const newModule: Module = {
                id: Date.now().toString(),
                name: newModuleName,
                iconSVG: '',
                createdAt: new Date().toISOString(),
            }
            setModuleList([...moduleList, newModule])
            setNewModuleName('')
            setAddDialogOpen(false)
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
                    >
                        <MenuItem onClick={() => handleSortSelect('name')}>
                            <ListItemText>按名称排序</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handleSortSelect('date')}>
                            <ListItemText>按创建时间排序</ListItemText>
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
                                <IconButton size="small">
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* 添加模块对话框 */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>添加新模块</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="模块名称"
                        fullWidth
                        variant="outlined"
                        value={newModuleName}
                        onChange={(e) => setNewModuleName(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>取消</Button>
                    <Button onClick={handleAddModule} variant="contained">添加</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ModulePage