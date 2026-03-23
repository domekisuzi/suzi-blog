import React from 'react'
import { Box, Typography, LinearProgress, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Module } from '../model/module'

interface ColorScheme {
    bg: string
    color: string
}

interface ModuleDetailProps {
    module: Module
    colorScheme?: ColorScheme
    onEdit?: (module: Module) => void
    onDelete?: (module: Module) => void
}

const ModuleDetailCard: React.FC<ModuleDetailProps> = ({ module, colorScheme, onEdit, onDelete }) => {
    const navigate = useNavigate()
    const defaultColor = { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }
    const colors = colorScheme || defaultColor

    const taskNumber = module.taskNumber || 0
    const completedRate = module.completedRate || 0

    return (
        <Box
            onClick={() => navigate(`/tasks?moduleId=${module.id}`)}
            sx={{
                position: 'relative',
                borderRadius: '16px',
                background: colors.bg,
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                },
            }}
        >
            {/* 操作按钮 */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(module) }}
                    sx={{ color: colors.color, opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onDelete?.(module) }}
                    sx={{ color: colors.color, opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* 标题区域 */}
            <Box>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: colors.color, 
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        mb: 1,
                    }}
                >
                    {module.name}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: colors.color, 
                        opacity: 0.8,
                        fontSize: '0.85rem',
                    }}
                >
                    {taskNumber} 个任务
                </Typography>
            </Box>

            {/* 进度区域 */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: colors.color, opacity: 0.9 }}>
                        完成进度
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.color, fontWeight: 600 }}>
                        {completedRate}%
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={completedRate}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: colors.color,
                        },
                    }}
                />
            </Box>
        </Box>
    )
}

export default ModuleDetailCard