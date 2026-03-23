import React from 'react'
import { Box, IconButton, Tooltip, Avatar, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

interface HeaderProps {
    onQuickAdd?: () => void
}

const Header: React.FC<HeaderProps> = ({ onQuickAdd }) => {
    const [darkMode, setDarkMode] = React.useState(false)

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            backgroundColor: 'transparent',
            borderRadius: '16px',
            marginBottom: 2,
        }}>
            {/* 左侧搜索 */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: '12px',
                padding: '8px 16px',
                width: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                <SearchIcon sx={{ color: '#666', marginRight: 1 }} />
                <input 
                    placeholder="搜索任务、模块..." 
                    style={{ 
                        border: 'none', 
                        outline: 'none', 
                        background: 'transparent',
                        width: '100%',
                        fontSize: '14px'
                    }} 
                />
            </Box>

            {/* 右侧操作 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* 快速添加 */}
                <Tooltip title="快速添加任务">
                    <IconButton 
                        onClick={onQuickAdd}
                        sx={{
                            backgroundColor: '#6366f1',
                            color: 'white',
                            '&:hover': { backgroundColor: '#4f46e5' },
                            borderRadius: '12px',
                            padding: '10px',
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>

                {/* 通知 */}
                <Tooltip title="通知">
                    <IconButton sx={{ 
                        color: '#666',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        borderRadius: '12px',
                    }}>
                        <NotificationsIcon />
                    </IconButton>
                </Tooltip>

                {/* 主题切换 */}
                <Tooltip title={darkMode ? "切换亮色模式" : "切换暗色模式"}>
                    <IconButton 
                        onClick={() => setDarkMode(!darkMode)}
                        sx={{ 
                            color: '#666',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderRadius: '12px',
                        }}
                    >
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                </Tooltip>

                {/* 用户头像 */}
                <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: '#6366f1',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}>
                    S
                </Avatar>
            </Box>
        </Box>
    )
}

export default Header