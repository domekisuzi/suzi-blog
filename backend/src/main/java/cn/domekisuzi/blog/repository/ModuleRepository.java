package cn.domekisuzi.blog.repository;

 
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.repository.projection.ModuleDetailProjection;
import cn.domekisuzi.blog.vo.ModuleDetailVo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ModuleRepository extends JpaRepository<Module, String> {
    Optional<Module> findByName(String name);

    //   @Query(value = """
    //     SELECT 
    //       m.id  AS id ,
    //       COUNT(DISTINCT t.id) AS taskNumber,
    //       COUNT(DISTINCT CASE WHEN t.completed = 1 THEN t.id END) AS completedTaskNumber,
    //       COUNT(st.id) AS subtaskNumber,
    //       COUNT(CASE WHEN st.completed = 1 THEN 1 END) AS completedSubtaskNumber,
    //       m.icon_svg AS iconSVG,
    //       m.name AS name 
    //     FROM 
    //       modules m
    //     LEFT JOIN tasks t ON t.module_id = m.id
    //     LEFT JOIN subtasks st ON st.task_id = t.id
    //     GROUP BY 
    //       m.id
    //     """, nativeQuery = true)
    @Query(value = """
    SELECT 
      m.id AS id,
      m.name AS name,
      COUNT(DISTINCT t.id) AS taskNumber,
      COUNT(DISTINCT CASE WHEN t.completed = 1 THEN t.id END) AS completedTaskNumber,
      COUNT(st.id) AS subtaskNumber,
      COUNT(CASE WHEN st.completed = 1 THEN 1 END) AS completedSubtaskNumber,
      m.icon_svg AS iconSVG
    FROM 
      modules m
    LEFT JOIN tasks t ON t.module_id = m.id
    LEFT JOIN subtasks st ON st.task_id = t.id
    GROUP BY 
      m.id
    """, nativeQuery = true)
    List<ModuleDetailProjection> findMoudleDetailVo();
}
