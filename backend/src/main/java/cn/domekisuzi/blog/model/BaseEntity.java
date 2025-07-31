
package cn.domekisuzi.blog.model;
import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * this class serves as a base class for all entities in the application.
 * It provides a common identifier field and ensures that each entity has a unique ID generated before it
 * is persisted to the database.
 * The ID is generated using UUID, which guarantees uniqueness across different entities.
 * This class is annotated with @MappedSuperclass, which means it will not be mapped to a database table
 * but its fields will be inherited by subclasses.
 * Subclasses can extend this class to inherit the ID field and the ID generation logic.
 * The @PrePersist annotation ensures that the ID is generated before the entity is persisted to the database.
 * By using this base class, we can avoid code duplication and ensure consistent ID generation across all
 */
@Data
@MappedSuperclass // This class will not be mapped to a database table, but its fields will be inherited by subclasses
@NoArgsConstructor // Lombok will generate a no-args constructor, if do not have it, project will not work well 
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy =  GenerationType.UUID)
    private String id;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        System.out.println("触发po层UUID生成" + this.id);
    }


    
}
