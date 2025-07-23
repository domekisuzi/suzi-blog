package cn.domekisuzi.blog.model;
import lombok.Data;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "subtasks") // 显式映射数据库表名
public class Subtask extends BaseEntity {
    @Id
    private String id;

    private String title;
    private Boolean completed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

     
}