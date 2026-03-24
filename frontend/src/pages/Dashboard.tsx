import React from 'react';
import { 
    Box, 
    Typography, 
    Paper,
} from '@mui/material';

const Dashboard: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                仪表盘
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    欢迎使用 Suzi Blog
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    这是一个任务管理和目标追踪系统。您可以通过左侧导航栏访问：
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>模块</strong> - 管理任务分类
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>任务</strong> - 查看和管理所有任务
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>时间线</strong> - 设置目标并追踪进度
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        • <strong>书单</strong> - 管理阅读清单
                    </Typography>
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    数据管理
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    数据导出和导入功能已移至右上角工具栏，点击下载/上传图标即可使用。
                </Typography>
            </Paper>
        </Box>
    );
};

export default Dashboard;
