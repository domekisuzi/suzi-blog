package cn.domekisuzi.blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "goals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Goal extends BaseEntity {
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private String color;
    
    @Column(nullable = false)
    private Integer progress = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType type = GoalType.SHORT_TERM;
    
    // 关联的任务列表
    @ManyToMany
    @JoinTable(
        name = "goal_tasks",
        joinColumns = @JoinColumn(name = "goal_id"),
        inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    @Builder.Default
    private Set<Task> tasks = new HashSet<>();
    
    public enum GoalType {
        SHORT_TERM,   // 短期目标 (1-3个月)
        MEDIUM_TERM,  // 中期目标 (3-6个月)
        LONG_TERM     // 长期目标 (6个月以上)
    }
}
