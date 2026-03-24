package cn.domekisuzi.blog.controller;

import cn.domekisuzi.blog.dto.ExportDataDTO;
import cn.domekisuzi.blog.service.DataExportImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, 
              methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS},
              allowCredentials = "true")
public class DataExportImportController {

    private final DataExportImportService dataExportImportService;
    private final ObjectMapper objectMapper;

    public DataExportImportController(DataExportImportService dataExportImportService) {
        this.dataExportImportService = dataExportImportService;
        this.objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .enable(SerializationFeature.INDENT_OUTPUT);
    }

    /**
     * 导出所有数据
     */
    @GetMapping("/export")
    public ResponseEntity<String> exportData() {
        try {
            ExportDataDTO data = dataExportImportService.exportAllData();
            String json = objectMapper.writeValueAsString(data);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"suzi-blog-data-" + System.currentTimeMillis() + ".json\"");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(json);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("导出失败: " + e.getMessage());
        }
    }

    /**
     * 导入数据
     */
    @PostMapping("/import")
    public ResponseEntity<String> importData(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("文件不能为空");
            }
            
            String content = new String(file.getBytes());
            ExportDataDTO data = objectMapper.readValue(content, ExportDataDTO.class);
            dataExportImportService.importData(data);
            
            return ResponseEntity.ok("数据导入成功");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("导入失败: " + e.getMessage());
        }
    }
}
