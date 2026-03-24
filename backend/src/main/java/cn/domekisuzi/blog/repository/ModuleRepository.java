package cn.domekisuzi.blog.repository;

 
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.repository.projection.ModuleDetailProjection;
 

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {
    Optional<Module> findByName(String name);

    // 使用EntityGraph预加载tasks和subtasks，避免N+1查询
    @EntityGraph(attributePaths = {"tasks", "tasks.subtasks"})
    @Query("SELECT m FROM Module m WHERE m.id = :id")
    Optional<Module> findByIdWithTasksAndSubtasks(@Param("id") String id);

    @Query(value = """
    SELECT 
      m.id AS id,
      m.name AS name,
      (SELECT COUNT(*) FROM tasks t WHERE t.module_id = m.id) AS taskNumber,
      (SELECT COUNT(*) FROM tasks t WHERE t.module_id = m.id AND t.completed = 1) AS completedTaskNumber,
      (SELECT COUNT(*) FROM subtasks st JOIN tasks t ON st.task_id = t.id WHERE t.module_id = m.id) AS subtaskNumber,
      (SELECT COUNT(*) FROM subtasks st JOIN tasks t ON st.task_id = t.id WHERE t.module_id = m.id AND st.completed = 1) AS completedSubtaskNumber,
      m.icon_svg AS iconSVG
    FROM 
      modules m
    """, nativeQuery = true)
    List<ModuleDetailProjection> findMoudleDetailVo();
}
