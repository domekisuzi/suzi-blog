package cn.domekisuzi.blog.model;

 

import lombok.Data;
import jakarta.persistence.*;
 
import java.util.List;
 

@Entity
@Table(name = "task_categories") // 显式映射数据库表名
@Data
public class Category extends BaseEntity {

    @Id
    private String id;

    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Task> tasks;


     
}