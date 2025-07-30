package cn.domekisuzi.blog.repository;

import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;
@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, String> {
    List<Subtask> findByTaskId(String taskId);
    List<Subtask> findByCompleted(Boolean completed);
    List<SubtaskDTO> getSubtasksByTaskId(String taskId);
    // SubtaskDTO createSubtask(String taskId, SubtaskDTO dto);
    // SubtaskDTO updateSubtask(String taskId, String subtaskId, SubtaskDTO dto);
    // void deleteSubtask(String taskId, String subtaskId);
    Optional<Subtask> findByIdAndTaskId(String subtaskId, String taskId);

}