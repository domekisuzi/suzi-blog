import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * 导出所有数据
 */
export const exportData = async (): Promise<void> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/export`, {
            responseType: 'blob'
        });
        
        // 创建下载链接
        const blob = new Blob([response.data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // 从响应头获取文件名，或使用默认文件名
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'suzi-blog-data.json';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('导出数据失败:', error);
        throw error;
    }
};

/**
 * 导入数据
 */
export const importData = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${API_BASE_URL}/data/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('导入数据失败:', error);
        throw error;
    }
};
