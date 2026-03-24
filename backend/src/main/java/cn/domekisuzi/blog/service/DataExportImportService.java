package cn.domekisuzi.blog.service;

import cn.domekisuzi.blog.dto.ExportDataDTO;

public interface DataExportImportService {
    
    /**
     * 导出所有数据
     */
    ExportDataDTO exportAllData();
    
    /**
     * 导入数据
     */
    void importData(ExportDataDTO data);
}
