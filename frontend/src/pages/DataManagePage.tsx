import React, { useRef, useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import StorageIcon from '@mui/icons-material/Storage'
import BackupIcon from '@mui/icons-material/Backup'
import RestoreIcon from '@mui/icons-material/Restore'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { exportData, importData } from '../shared/services/dataApi'
import { useLoading } from '../context/LoadingContext'

const DataManagePage: React.FC = () => {
    const { setLoading } = useLoading()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // 通知状态
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
        open: false,
        message: '',
        severity: 'info'
    })
    
    // 确认对话框状态
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    // 导出数据
    const handleExport = async () => {
        setLoading(true)
        try {
            await exportData()
            setSnackbar({ 
                open: true, 
                message: '数据导出成功！文件已下载到本地', 
                severity: 'success' 
            })
        } catch (error) {
            console.error('Export failed:', error)
            setSnackbar({ 
                open: true, 
                message: '数据导出失败，请重试', 
                severity: 'error' 
            })
        } finally {
            setLoading(false)
        }
    }

    // 点击导入按钮
    const handleImportClick = () => {
        setConfirmDialogOpen(true)
    }

    // 确认导入
    const handleConfirmImport = () => {
        setConfirmDialogOpen(false)
        fileInputRef.current?.click()
    }

    // 选择文件后导入
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setLoading(true)
        try {
            await importData(file)
            setSnackbar({ 
                open: true, 
                message: '数据导入成功！请刷新页面查看更新后的数据', 
                severity: 'success' 
            })
        } catch (error: any) {
            console.error('Import failed:', error)
            const errorMessage = error.response?.data?.message || error.message || '数据导入失败，请检查文件格式'
            setSnackbar({ 
                open: true, 
                message: errorMessage, 
                severity: 'error' 
            })
        } finally {
            setLoading(false)
            // 清空文件输入
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    return (
        <Box>
            {/* 页面标题 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                    数据管理
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                    备份和恢复您的所有数据，包括模块、任务、子任务和目标
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* 导出数据卡片 */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        },
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '16px',
                                    backgroundColor: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}>
                                    <BackupIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        导出数据
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        将所有数据备份到本地文件
                                    </Typography>
                                </Box>
                            </Box>

                            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                                导出文件包含所有模块、任务、子任务和目标数据，可用于数据备份或迁移
                            </Alert>

                            <List sx={{ mb: 3 }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon sx={{ color: '#16a34a' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="完整的模块信息" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon sx={{ color: '#16a34a' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="所有任务和子任务" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon sx={{ color: '#16a34a' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="时间线目标数据" />
                                </ListItem>
                            </List>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<DownloadIcon />}
                                onClick={handleExport}
                                sx={{
                                    backgroundColor: '#16a34a',
                                    borderRadius: '12px',
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#15803d',
                                    },
                                }}
                            >
                                导出数据到 JSON 文件
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 导入数据卡片 */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ 
                        borderRadius: '16px', 
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        },
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '16px',
                                    backgroundColor: '#fef3c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                }}>
                                    <RestoreIcon sx={{ fontSize: 32, color: '#d97706' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                        导入数据
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                        从备份文件恢复数据
                                    </Typography>
                                </Box>
                            </Box>

                            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
                                <strong>注意：</strong>导入数据将覆盖所有现有数据，请确保已备份重要数据
                            </Alert>

                            <List sx={{ mb: 3 }}>
                                <ListItem>
                                    <ListItemIcon>
                                        <WarningIcon sx={{ color: '#d97706' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="现有数据将被完全替换" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <StorageIcon sx={{ color: '#6366f1' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="支持 .json 格式的备份文件" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircleIcon sx={{ color: '#16a34a' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="导入后请刷新页面查看结果" />
                                </ListItem>
                            </List>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<UploadIcon />}
                                onClick={handleImportClick}
                                sx={{
                                    backgroundColor: '#d97706',
                                    borderRadius: '12px',
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: '#b45309',
                                    },
                                }}
                            >
                                从 JSON 文件导入数据
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 使用说明 */}
            <Paper sx={{ 
                mt: 4, 
                p: 3, 
                borderRadius: '16px', 
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                    📋 使用说明
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                    <strong>导出数据：</strong>点击"导出数据"按钮，系统会将所有数据打包成 JSON 文件并下载到您的设备。建议定期备份数据。
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                    <strong>导入数据：</strong>点击"导入数据"按钮，选择之前导出的 JSON 备份文件。导入前请确保已备份当前数据，因为导入会覆盖所有现有内容。
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    <strong>数据格式：</strong>备份文件为标准的 JSON 格式，包含 modules、tasks、subtasks 和 goals 四个主要部分。
                </Typography>
            </Paper>

            {/* 隐藏的文件输入 */}
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* 确认导入对话框 */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '16px' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600, color: '#1e293b' }}>
                    ⚠️ 确认导入数据
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: '#64748b' }}>
                        导入数据将<strong>覆盖所有现有数据</strong>（模块、任务、子任务、目标）。
                        <br /><br />
                        此操作<strong>不可撤销</strong>，请确保已备份重要数据。
                        <br /><br />
                        是否继续？
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button 
                        onClick={() => setConfirmDialogOpen(false)}
                        sx={{ 
                            color: '#64748b',
                            borderRadius: '8px',
                        }}
                    >
                        取消
                    </Button>
                    <Button 
                        onClick={handleConfirmImport} 
                        color="warning" 
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#d97706',
                            '&:hover': {
                                backgroundColor: '#b45309',
                            },
                        }}
                    >
                        确认导入
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 通知提示 */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: '12px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default DataManagePage
