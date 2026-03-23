import React from 'react'
import { TaskDetailVo } from '../model/taskTypes'
import { Card, CardContent, Button, Box, Typography, Chip, IconButton, LinearProgress } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import FolderIcon from '@mui/icons-material/Folder'
import DoneIcon from '@mui/icons-material/Done'
import AddIcon from '@mui/icons-material/Add'

interface Props {
    task: TaskDetailVo
    onDelete: (task: TaskDetailVo) => void
    onEdit: (task: TaskDetailVo) => void
    onClick: () => void
    addSubTaskClick: () => void
}

const priorityColors = {
    high: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    low: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

const priorityLabels = {
    high: '高优先级',
    medium: '中优先级', 
    low: '低优先级',
}

export default function TaskMain({ task, onClick, onDelete, onEdit, addSubTaskClick }: Readonly<Props>) {
    const priorityStyle = priorityColors[task.priority || 'low']
    const priorityLabel = priorityLabels[task.priority || 'low']

    return (
        <Card
            onClick={onClick}
            sx={{
                position: 'relative',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)',
                },
                overflow: 'hidden',
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                {/* 头部：模块名 + 状态 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FolderIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {task.moduleName || '未分类'}
                        </Typography>
                    </Box>
                    <Chip
                        label={task.completed ? '已完成' : '进行中'}
                        icon={task.completed ? <DoneIcon sx={{ fontSize: 16 }} /> : <AccessTimeIcon sx={{ fontSize: 16 }} />}
                        sx={{
                            height: 24,
                            fontSize: 12,
                            backgroundColor: task.completed ? '#dcfce7' : '#fef3c7',
                            color: task.completed ? '#16a34a' : '#d97706',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                        size="small"
                    />
                </Box>

                {/* 标题 */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {task.title}
                </Typography>

                {/* 描述 */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#64748b',
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 40,
                    }}
                >
                    {task.description || '暂无描述'}
                </Typography>

                {/* 进度条 */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12 }}>
                            完成进度
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600, fontSize: 12 }}>
                            {task.completedRate}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={parseFloat(task.completedRate) || 0}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                            },
                        }}
                    />
                </Box>

                {/* 底部：优先级 + 操作按钮 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* 优先级标签 */}
                    <Chip
                        icon={
                            task.priority === 'high' ? <PriorityHighIcon sx={{ fontSize: 16 }} /> :
                            task.priority === 'medium' ? <ArrowUpwardIcon sx={{ fontSize: 16 }} /> :
                            <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                        }
                        label={priorityLabel}
                        size="small"
                        sx={{
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                            border: `1px solid ${priorityStyle.border}`,
                            fontSize: 12,
                            '& .MuiChip-icon': { color: priorityStyle.color },
                        }}
                    />

                    {/* 操作按钮 */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); addSubTaskClick() }}
                            sx={{
                                backgroundColor: '#f1f5f9',
                                '&:hover': { backgroundColor: '#e2e8f0' },
                            }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
                            sx={{
                                backgroundColor: '#f1f5f9',
                                '&:hover': { backgroundColor: '#e2e8f0' },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); onDelete(task) }}
                            sx={{
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                '&:hover': { backgroundColor: '#fee2e2' },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}