package cn.domekisuzi.blog.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "subtasks") // 显式映射数据库表名
@NoArgsConstructor
@AllArgsConstructor
public class Subtask extends BaseEntity {
    @Id
    private String id;

    private String title;
    private Boolean completed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonBackReference
    private Task task;
}