import React, { useState, useCallback } from 'react'
import {
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material'

interface NotificationState {
    open: boolean
    message: string
    severity: AlertColor
}

interface NotificationContextType {
    showSuccess: (message: string) => void
    showError: (message: string) => void
    showWarning: (message: string) => void
    showInfo: (message: string) => void
}

// 创建 Context
export const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

// Notification Provider 组件
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        message: '',
        severity: 'info',
    })

    const showNotification = useCallback((message: string, severity: AlertColor) => {
        setNotification({
            open: true,
            message,
            severity,
        })
    }, [])

    const showSuccess = useCallback((message: string) => {
        showNotification(message, 'success')
    }, [showNotification])

    const showError = useCallback((message: string) => {
        showNotification(message, 'error')
    }, [showNotification])

    const showWarning = useCallback((message: string) => {
        showNotification(message, 'warning')
    }, [showNotification])

    const showInfo = useCallback((message: string) => {
        showNotification(message, 'info')
    }, [showNotification])

    const handleClose = useCallback(() => {
        setNotification((prev) => ({ ...prev, open: false }))
    }, [])

    return (
        <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbar-root': {
                        top: '24px',
                    },
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                        '& .MuiAlert-icon': {
                            fontSize: '24px',
                        },
                        '& .MuiAlert-message': {
                            fontSize: '14px',
                            fontWeight: 500,
                        },
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    )
}

// 自定义 hook 使用通知
export const useNotification = () => {
    const context = React.useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}