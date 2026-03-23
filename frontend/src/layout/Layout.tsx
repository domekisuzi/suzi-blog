import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box } from '@mui/material'
import QuickAddTaskDialog from '../components/QuickAddTaskDialog'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [quickAddOpen, setQuickAddOpen] = useState(false)

    const handleQuickAddOpen = () => setQuickAddOpen(true)
    const handleQuickAddClose = () => setQuickAddOpen(false)

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            {/* 侧边栏 */}
            <Sidebar onQuickAdd={handleQuickAddOpen} />

            {/* 主内容区 */}
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                marginLeft: '260px',
                minHeight: '100vh',
            }}>
                {/* 头部 */}
                <Header onQuickAdd={handleQuickAddOpen} />

                {/* 内容区域 - 毛玻璃效果 */}
                <Box sx={{
                    flexGrow: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    overflowY: 'auto',
                }}>
                    {children}
                </Box>
            </Box>

            {/* 快速添加任务对话框 */}
            <QuickAddTaskDialog 
                open={quickAddOpen} 
                onClose={handleQuickAddClose}
            />
        </Box>
    )
}

export default Layout
