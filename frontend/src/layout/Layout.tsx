import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box } from '@mui/material'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            {/* 侧边栏 */}
            <Sidebar />

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
                <Header />

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
        </Box>
    )
}

export default Layout