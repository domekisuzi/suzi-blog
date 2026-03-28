import React from 'react'
import { Box, Typography, LinearProgress, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Module } from '../model/module'

// 为每个模块预定义独特的渐变背景
const getModuleGradient = (moduleName: string): string => {
  const gradients: Record<string, string> = {
    '修考': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    '当老板': 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
    '日语': 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%)',
    '健身': 'linear-gradient(135deg, #30cfd0 0%, #330867 50%, #a8edea 100%)',
    '英语': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
    '看书': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 50%, #c2e9fb 100%)',
    '工作': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff8a80 100%)',
  }
  return gradients[moduleName] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// 获取模块的图标emoji
const getModuleIcon = (moduleName: string): string => {
  const icons: Record<string, string> = {
    '修考': '🎓',
    '当老板': '💼',
    '日语': '🗾',
    '健身': '💪',
    '英语': '🇬🇧',
    '看书': '📚',
    '工作': '💻',
  }
  return icons[moduleName] || '📦'
}

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
    const defaultColor = { bg: getModuleGradient(module.name), color: '#fff' }
    const colors = colorScheme || defaultColor

    const taskNumber = module.taskNumber || 0
    const completedRate = module.completedRate || 0
    const icon = getModuleIcon(module.name)

    return (
        <Box
            onClick={() => navigate(`/tasks?moduleId=${module.id}`)}
            sx={{
                position: 'relative',
                borderRadius: '20px',
                background: colors.bg,
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                },
            }}
        >
            {/* 装饰性圆形背景 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '20px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '60px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                }}
            />

            {/* 大图标 - 融入背景 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '80px',
                    opacity: 0.25,
                    filter: 'grayscale(30%)',
                    transform: 'rotate(-15deg)',
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            >
                {icon}
            </Box>

            {/* 操作按钮 */}
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5, zIndex: 1 }}>
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(module) }}
                    sx={{ 
                        color: colors.color, 
                        opacity: 0.8, 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': { 
                            opacity: 1,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                        } 
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                    size="small"
                    onClick={(e) => { e.stopPropagation(); onDelete?.(module) }}
                    sx={{ 
                        color: colors.color, 
                        opacity: 0.8,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '&:hover': { 
                            opacity: 1,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                        }
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* 标题区域 */}
            <Box sx={{ zIndex: 1 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: colors.color, 
                        fontWeight: 700,
                        fontSize: '1.3rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        mb: 0.5,
                    }}
                >
                    {module.name}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: colors.color, 
                        opacity: 0.85,
                        fontSize: '0.9rem',
                    }}
                >
                    {taskNumber} 个任务
                </Typography>
            </Box>

            {/* 进度区域 */}
            <Box sx={{ zIndex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: colors.color, opacity: 0.9, fontWeight: 500 }}>
                        完成进度
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.color, fontWeight: 700 }}>
                        {completedRate}%
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={completedRate}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: colors.color,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        },
                    }}
                />
            </Box>
        </Box>
    )
}

export default ModuleDetailCard
