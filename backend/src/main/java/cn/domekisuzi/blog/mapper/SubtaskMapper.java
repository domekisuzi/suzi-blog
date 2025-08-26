package cn.domekisuzi.blog.mapper;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.model.Subtask;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
 
public class SubtaskMapper {


    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Subtask toEntity(SubtaskDTO dto) {
        Subtask sub = new Subtask();
        if(dto.getId() != null && dto.getId() != ""){
            sub.setId(dto.getId()); // to prevent from losing  efficacy of the function of generated id  
        }
        sub.setTitle(dto.getTitle());
        sub.setCompleted(dto.isCompleted());

        if (dto.getDueDate() != null && !dto.getDueDate().isEmpty()) {
            sub.setDueDate(LocalDateTime.parse(dto.getDueDate()));
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
