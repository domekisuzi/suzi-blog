package cn.domekisuzi.blog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;   
import java.util.List;


import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Data
@Table(name = "modules") // 显式映射数据库表名
@NoArgsConstructor
@AllArgsConstructor
public class Module extends BaseEntity {
    @Id
    private String id;

    private String name;

    @OneToMany(mappedBy = "module")
    @JsonManagedReference
    private List<Task> tasks;


      
}