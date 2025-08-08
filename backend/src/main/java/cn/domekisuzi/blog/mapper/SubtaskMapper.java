package cn.domekisuzi.blog.mapper;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.model.Subtask;

import java.time.LocalDateTime;
public class SubtaskMapper {
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
}
