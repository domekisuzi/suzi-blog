package cn.domekisuzi.blog.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
 
import org.springframework.stereotype.Repository;
import cn.domekisuzi.blog.model.Task;
 
import java.util.List;
@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByModuleId(String moduleId);
    List<Task> findByCompleted(Boolean completed);

  
}
