package cn.domekisuzi.blog.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExportDataDTO {
    
    private String exportVersion = "1.0";
    private String exportTime;
    
    private List<ModuleDTO> modules;
    private List<TaskDTO> tasks;
    private List<SubtaskDTO> subtasks;
    private List<GoalDTO> goals;
}
