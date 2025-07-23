package cn.domekisuzi.blog.model;

import java.time.LocalDateTime;
 

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
 

@Entity
@Data  // Lombok 自动生成 getter/setter
@Table(name = "tasks") // 显式映射数据库表名
@NoArgsConstructor
@AllArgsConstructor
// @EqualsAndHashCode(callSuper=true)
public class Task   extends BaseEntity {
    @Id
    private String id;
    private String title;
    private String description;
    private Boolean completed;
    private String priority;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "UTC")
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Subtask> subtasks;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

     
    
}
