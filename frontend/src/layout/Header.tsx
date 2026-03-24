import React, { useRef, useState } from 'react'
import { Box, IconButton, Tooltip, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import { exportData, importData } from '../shared/services/dataApi'

interface HeaderProps {
    onQuickAdd?: () => void
}

const Header: React.FC<HeaderProps> = ({ onQuickAdd }) => {
    const [darkMode, setDarkMode] = React.useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = async () => {
        try {
            await exportData()
            setNotification({ message: '数据导出成功！', severity: 'success' })
        } catch (error) {
            setNotification({ message: '数据导出失败，请重试', severity: 'error' })
        }
    }

    const handleImportClick = () => {
        setConfirmDialogOpen(true)
    }

    const handleConfirmImport = () => {
        setConfirmDialogOpen(false)
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            await importData(file)
            setNotification({ message: '数据导入成功！请刷新页面查看', severity: 'success' })
        } catch (error) {
            setNotification({ message: '数据导入失败，请检查文件格式', severity: 'error' })
        }

        // 清空文件输入
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleCloseNotification = () => {
        setNotification(null)
    }

    return (
        <>
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
                    {/* 导出数据 */}
                    <Tooltip title="导出数据">
                        <IconButton 
                            onClick={handleExport}
                            sx={{
                                color: '#666',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: '12px',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                            }}
                        >
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>

                    {/* 导入数据 */}
                    <Tooltip title="导入数据">
                        <IconButton 
                            onClick={handleImportClick}
                            sx={{
                                color: '#666',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                                borderRadius: '12px',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                            }}
                        >
                            <UploadIcon />
                        </IconButton>
                    </Tooltip>

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

            {/* 隐藏的文件输入 */}
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* 确认对话框 */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>确认导入数据</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        导入数据将覆盖所有现有数据（模块、任务、子任务、目标）。此操作不可撤销，请确保已备份重要数据。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>
                        取消
                    </Button>
                    <Button onClick={handleConfirmImport} color="warning" variant="contained">
                        确认导入
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 通知 */}
            <Snackbar
                open={notification !== null}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification?.severity || 'info'}
                    sx={{ width: '100%' }}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Header
