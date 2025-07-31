

package cn.domekisuzi.blog.dto;

import java.util.UUID;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseDTO {


  
    @GeneratedValue(strategy =  GenerationType.UUID)
    @Id
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    @PrePersist
        public void generateId() {
            if (this.id == null) {
                this.id = UUID.randomUUID().toString();
            }
               System.out.println("触发dto层UUID生成");
        }
    
}