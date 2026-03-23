import { Box, SvgIcon, Typography, IconButton, Tooltip } from '@mui/material'
import React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'

import { ReactComponent as BookListIcon } from '../asserts/icon/booklist.svg'
import { ReactComponent as ModuleIcon } from '../asserts/icon/module.svg'
import { ReactComponent as TaskIcon } from '../asserts/icon/task.svg'
import { ReactComponent as SubTaskIcon } from '../asserts/icon/subtask.svg'
import { ReactComponent as StatisticsIcon } from '../asserts/icon/statistics.svg'
import { ReactComponent as ProjectIcon } from '../asserts/icon/project.svg'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar: React.FC = () => {
    const [open, setOpen] = React.useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { path: '/books', icon: BookListIcon, label: 'Book List' },
    ]

    const projectItems = [
        { path: '/modules', icon: ModuleIcon, label: 'Module' },
        { path: '/tasks', icon: TaskIcon, label: 'Task' },
        { path: '/subtasks', icon: SubTaskIcon, label: 'Subtask' },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <Box sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            width: '260px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
        }}>
            {/* Logo区域 */}
            <Box sx={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
                <IconButton 
                    onClick={() => navigate('/statistics')}
                    sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.4)',
                            transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <SvgIcon 
                        sx={{ 
                            width: 36, 
                            height: 36, 
                            color: '#a5b4fc',
                        }} 
                        component={StatisticsIcon} 
                        inheritViewBox 
                    />
                </IconButton>
            </Box>

            {/* 菜单列表 */}
            <List sx={{ flex: 1, padding: '12px' }}>
                {/* Book List */}
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        sx={{
                            borderRadius: '12px',
                            marginBottom: '4px',
                            backgroundColor: isActive(item.path) ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <SvgIcon 
                                sx={{ 
                                    color: isActive(item.path) ? '#a5b4fc' : '#94a3b8',
                                }} 
                                component={item.icon} 
                                inheritViewBox 
                            />
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.label} 
                            sx={{ 
                                '& .MuiListItemText-primary': { 
                                    color: isActive(item.path) ? '#fff' : '#cbd5e1',
                                    fontWeight: isActive(item.path) ? 600 : 400,
                                }
                            }}
                        />
                    </ListItemButton>
                ))}

                {/* Project 折叠菜单 */}
                <ListItemButton
                    onClick={() => setOpen(!open)}
                    sx={{
                        borderRadius: '12px',
                        marginBottom: '4px',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        <SvgIcon sx={{ color: '#94a3b8' }} component={ProjectIcon} inheritViewBox />
                    </ListItemIcon>
                    <ListItemText 
                        primary="Project" 
                        sx={{ '& .MuiListItemText-primary': { color: '#cbd5e1' } }}
                    />
                    {open ? <ExpandLess sx={{ color: '#94a3b8' }} /> : <ExpandMore sx={{ color: '#94a3b8' }} />}
                </ListItemButton>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {projectItems.map((item) => (
                            <ListItemButton
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    marginLeft: '20px',
                                    paddingLeft: '36px',
                                    marginBottom: '4px',
                                    backgroundColor: isActive(item.path) ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <SvgIcon 
                                        sx={{ 
                                            color: isActive(item.path) ? '#a5b4fc' : '#94a3b8',
                                            width: 20,
                                            height: 20,
                                        }} 
                                        component={item.icon} 
                                        inheritViewBox 
                                    />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.label} 
                                    sx={{ 
                                        '& .MuiListItemText-primary': { 
                                            color: isActive(item.path) ? '#fff' : '#cbd5e1',
                                            fontSize: '14px',
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </List>

            {/* 底部添加按钮 */}
            <Box sx={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Tooltip title="快速添加" placement="right">
                    <IconButton
                        sx={{
                            width: '100%',
                            height: 48,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            },
                        }}
                    >
                        <AddIcon sx={{ marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 500 }}>添加新任务</Typography>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default Sidebar