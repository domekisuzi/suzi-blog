import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import DeleteIcon from '@mui/icons-material/Delete'

interface ConfirmDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'delete' | 'warning' | 'info'
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title = '确认操作',
    message,
    confirmText = '确定',
    cancelText = '取消',
    type = 'warning',
}) => {
    const getIcon = () => {
        switch (type) {
            case 'delete':
                return <DeleteIcon sx={{ fontSize: 48, color: '#ef4444' }} />
            case 'warning':
                return <WarningIcon sx={{ fontSize: 48, color: '#f59e0b' }} />
            case 'info':
            default:
                return <WarningIcon sx={{ fontSize: 48, color: '#6366f1' }} />
        }
    }

    const getConfirmButtonColor = () => {
        switch (type) {
            case 'delete':
                return '#ef4444'
            case 'warning':
                return '#f59e0b'
            case 'info':
            default:
                return '#6366f1'
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                }
            }}
        >
            <DialogContent sx={{ py: 3, px: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {getIcon()}
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', textAlign: 'center' }}>
                        {message}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#64748b',
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': { backgroundColor: '#f1f5f9' }
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: getConfirmButtonColor(),
                        borderRadius: '8px',
                        px: 3,
                        '&:hover': {
                            backgroundColor: type === 'delete' ? '#dc2626' : 
                                           type === 'warning' ? '#d97706' : '#4f46e5'
                        }
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog
