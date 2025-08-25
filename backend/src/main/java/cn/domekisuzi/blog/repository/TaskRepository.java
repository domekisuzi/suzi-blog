package cn.domekisuzi.blog.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.projection.TaskDetailProjection;

import java.util.List;
@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByModuleId(String moduleId);
    List<Task> findByCompleted(Boolean completed);

  
        @Query(value = """
        SELECT 
            t.id AS id,
            t.title AS title,
            t.description AS description,
            m.name AS moduleName,
            t.completed AS completed,
            t.due_date AS dueDate,
            t.created_at AS createdAt,
            COALESCE(st.completed_count * 100.0 / NULLIF(st.total_count, 0), 0) AS completedRate,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', s.id,
                    'title', s.title,
                    'completed', s.completed,
                    'dueDate', s.due_date
                )
            ) AS subtasks
        FROM tasks t
        JOIN modules m ON t.module_id = m.id
        LEFT JOIN subtasks s ON t.id = s.task_id
        LEFT JOIN (
            SELECT 
                task_id,
                COUNT(*) AS total_count,
                SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_count
            FROM subtasks
            GROUP BY task_id
        ) st ON t.id = st.task_id
        GROUP BY t.id, t.title, t.description, m.name, t.completed, t.due_date, t.created_at, st.completed_count, st.total_count
        """, nativeQuery = true)

    List<TaskDetailProjection> findTaskDetailVo();
}
