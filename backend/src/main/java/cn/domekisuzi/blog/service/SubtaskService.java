package cn.domekisuzi.blog.service;

import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.repository.SubtaskRepository;    
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubtaskService {
    private final SubtaskRepository subtaskRepository;

    public List<Subtask> getSubtasksByTask(String taskId) {
        return subtaskRepository.findByTaskId(taskId);
    }

    public Subtask createSubtask(Subtask subtask) {
        return subtaskRepository.save(subtask);
    }

    public void deleteSubtask(String subtaskId) {
        subtaskRepository.deleteById(subtaskId);
    }
}
