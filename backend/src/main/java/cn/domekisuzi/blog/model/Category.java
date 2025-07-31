package cn.domekisuzi.blog.model;

 

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
 
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
 

@Entity
@Table(name = "task_categories") // 显式映射数据库表名
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category extends BaseEntity {

    @Id
    private String id;

    private String name;


    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Task> tasks;


     
}