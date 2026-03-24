package cn.domekisuzi.blog.mapper;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.model.Subtask;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
 
public class SubtaskMapper {


    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    // 支持多种日期格式
    private static final DateTimeFormatter[] DATE_FORMATTERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"),
        DateTimeFormatter.ISO_LOCAL_DATE_TIME
    };

    /**
     * 尝试用多种格式解析日期字符串
     */
    public static LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        
        // 先尝试替换空格为 T，使其符合 ISO 格式
        String normalized = dateStr.replace(' ', 'T');
        
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                return LocalDateTime.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // 尝试下一个格式
            }
        }
        
        // 如果都失败了，尝试解析标准化后的字符串
        try {
            return LocalDateTime.parse(normalized);
        } catch (DateTimeParseException e) {
            System.err.println("无法解析日期: " + dateStr);
            return null;
        }
    }

    public static Subtask toEntity(SubtaskDTO dto) {
        Subtask sub = new Subtask();
        if(dto.getId() != null && dto.getId() != ""){
            sub.setId(dto.getId()); // to prevent from losing  efficacy of the function of generated id  
        }
        sub.setTitle(dto.getTitle());
        sub.setCompleted(dto.isCompleted());

        if (dto.getDueDate() != null && !dto.getDueDate().isEmpty()) {
            sub.setDueDate(parseDateTime(dto.getDueDate()));
        }

        return sub;
    }

    public static SubtaskDTO toDTO(Subtask sub) {
        SubtaskDTO dto = new SubtaskDTO();
        if(sub.getId() != null && sub.getId() != ""){
            dto.setId(sub.getId());
        }
        
        dto.setTitle(sub.getTitle());
        dto.setCompleted(sub.getCompleted());

        if (sub.getDueDate() != null) {
            dto.setDueDate(sub.getDueDate().toString());
        }

        // 设置所属任务的ID
        if (sub.getTask() != null) {
            dto.setTaskId(sub.getTask().getId());
        }

        return dto;
    }

    public static List<SubtaskDTO> parseSubtasksJson(String subtasks) {
        // Assuming subtasks is a JSON array string
        if (subtasks == null || subtasks.isBlank()) {
                return Collections.emptyList();
            }

            try {
                List<SubtaskDTO>  res =  objectMapper.readValue(subtasks, new TypeReference<List<SubtaskDTO>>() {}); 
                return res.stream().filter( sub -> sub != null && sub.getTitle() != null && !sub.getTitle().isBlank()).collect(Collectors.toList()); // filter the empty object 
            } catch (Exception e) {
                // 可根据需要记录日志或抛出自定义异常
                System.err.println("Failed to parse subtasks JSON: " + e.getMessage());
                return Collections.emptyList();
            }
        }
    
}
