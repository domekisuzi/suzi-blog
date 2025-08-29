package cn.domekisuzi.blog.vo;

import java.util.List;

import cn.domekisuzi.blog.dto.SubtaskDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDetailVo {
    private String id;
    private String title;
    private String description;
    private String moduleName;
    private String priority;
    private Boolean completed;
    private String dueDate;
    private String createdAt;
    private String completedRate;
    private List<SubtaskDTO> subtasks;
}
