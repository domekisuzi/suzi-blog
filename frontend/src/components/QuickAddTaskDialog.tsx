import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    IconButton,
    Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { fetchModules } from '../domains/module/api/moduleApi'
import { createTask } from '../domains/task/api/taskApi'
import { Module } from '../domains/module/model/module'
import { TaskPriority } from '../domains/task/model/taskTypes'

interface QuickAddTaskDialogProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
}

const QuickAddTaskDialog: React.FC<QuickAddTaskDialogProps> = ({ open, onClose, onSuccess }) => {
    const [modules, setModules] = useState<Module[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleId, setModuleId] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('medium')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            fetchModules().then(setModules).catch(console.error)
        }
    }, [open])

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('请输入任务标题')
            return
        }

        setLoading(true)
        try {
            await createTask({
                title: title.trim(),
                description: description.trim(),
                moduleId: moduleId || undefined,
                priority: priority,
                completed: false,
            })
            
            // 重置表单
            setTitle('')
            setDescription('')
            setModuleId('')
            setPriority('medium')
            
            onSuccess?.()
            onClose()
        } catch (error) {
            console.error('创建任务失败:', error)
            alert('创建任务失败')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setTitle('')
        setDescription('')
        setModuleId('')
        setPriority('medium')
        onClose()
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: '#1e293b',
                pb: 1,
            }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    ✨ 快速添加任务
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                    {/* 任务标题 */}
                    <TextField
                        autoFocus
                        label="任务标题"
                        placeholder="输入任务标题..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />

                    {/* 任务描述 */}
                    <TextField
                        label="任务描述"
                        placeholder="输入任务描述（可选）..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />

                    {/* 模块选择 */}
                    <FormControl fullWidth>
                        <InputLabel>所属模块</InputLabel>
                        <Select
                            value={moduleId}
                            label="所属模块"
                            onChange={(e) => setModuleId(e.target.value)}
                            sx={{
                                borderRadius: '12px',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '12px',
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em style={{ color: '#94a3b8' }}>不选择模块</em>
                            </MenuItem>
                            {modules.map((module) => (
                                <MenuItem key={module.id} value={module.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box 
                                            sx={{ 
                                                width: 12, 
                                                height: 12, 
                                                borderRadius: '50%', 
                                                backgroundColor: module.color || '#6366f1' 
                                            }} 
                                        />
                                        {module.name}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 优先级选择 */}
                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#64748b', fontWeight: 500 }}>
                            优先级
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[
                                { value: 'low' as TaskPriority, label: '低', color: '#22c55e' },
                                { value: 'medium' as TaskPriority, label: '中', color: '#f59e0b' },
                                { value: 'high' as TaskPriority, label: '高', color: '#ef4444' },
                            ].map((item) => (
                                <Chip
                                    key={item.value}
                                    label={item.label}
                                    onClick={() => setPriority(item.value)}
                                    sx={{
                                        borderRadius: '8px',
                                        backgroundColor: priority === item.value ? item.color : '#f1f5f9',
                                        color: priority === item.value ? 'white' : '#64748b',
                                        fontWeight: priority === item.value ? 600 : 400,
                                        '&:hover': {
                                            backgroundColor: priority === item.value ? item.color : '#e2e8f0',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0' }}>
                <Button 
                    onClick={handleClose}
                    sx={{ 
                        color: '#64748b',
                        '&:hover': { backgroundColor: '#f1f5f9' }
                    }}
                >
                    取消
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !title.trim()}
                    sx={{
                        backgroundColor: '#6366f1',
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': { backgroundColor: '#4f46e5' },
                        '&:disabled': {
                            backgroundColor: '#c7d2fe',
                        }
                    }}
                >
                    {loading ? '创建中...' : '创建任务'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default QuickAddTaskDialog