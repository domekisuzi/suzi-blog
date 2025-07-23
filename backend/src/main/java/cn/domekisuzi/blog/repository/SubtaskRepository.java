package cn.domekisuzi.blog.repository;

import cn.domekisuzi.blog.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, String> {
    List<Subtask> findByTaskId(String taskId);
    List<Subtask> findByCompleted(Boolean completed);
}