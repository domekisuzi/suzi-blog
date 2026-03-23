package cn.domekisuzi.blog.dto;

import cn.domekisuzi.blog.model.Goal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalDTO {
    
    private String id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String color;
    private Integer progress;
    private Goal.GoalType type;
    private List<String> taskIds;      // 关联的任务ID列表
    private Integer taskCount;         // 任务总数
    private Integer completedTaskCount; // 已完成任务数
    
    public static GoalDTO fromEntity(Goal goal) {
        return GoalDTO.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .startDate(goal.getStartDate())
                .endDate(goal.getEndDate())
                .color(goal.getColor())
                .progress(goal.getProgress())
                .type(goal.getType())
                .taskIds(goal.getTasks() != null 
                    ? goal.getTasks().stream().map(task -> task.getId()).collect(Collectors.toList()) 
                    : List.of())
                .taskCount(goal.getTasks() != null ? goal.getTasks().size() : 0)
                .completedTaskCount(goal.getTasks() != null 
                    ? (int) goal.getTasks().stream().filter(task -> Boolean.TRUE.equals(task.getCompleted())).count() 
                    : 0)
                .build();
    }
    
    public Goal toEntity() {
        return Goal.builder()
                .title(this.title)
                .description(this.description)
                .startDate(this.startDate)
                .endDate(this.endDate)
                .color(this.color)
                .progress(this.progress != null ? this.progress : 0)
                .type(this.type != null ? this.type : Goal.GoalType.SHORT_TERM)
                .build();
    }
}
