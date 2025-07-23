package cn.domekisuzi.blog.model;

import lombok.Data;
import jakarta.persistence.*;   
import java.util.List;
import java.util.UUID;


@Entity
@Data
@Table(name = "modules") // 显式映射数据库表名
public class Module extends BaseEntity {
    @Id
    private String id;

    private String name;

    @OneToMany(mappedBy = "module")
    private List<Task> tasks;


      
}