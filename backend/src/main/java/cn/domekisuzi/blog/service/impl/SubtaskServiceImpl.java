package cn.domekisuzi.blog.service.impl;

 

 
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.service.SubtaskService;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class SubtaskServiceImpl implements SubtaskService {

    private final SubtaskRepository subtaskRepo;
    private final TaskRepository taskRepo;

    public SubtaskServiceImpl(SubtaskRepository subtaskRepo, TaskRepository taskRepo) {
        this.subtaskRepo = subtaskRepo;
        this.taskRepo = taskRepo;
    }

    @Override
    public List<SubtaskDTO> getSubtasksByTaskId(String taskId) {
        return subtaskRepo.findByTaskId(taskId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubtaskDTO createSubtask(String taskId, SubtaskDTO dto) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在: " + taskId));

        Subtask subtask = toEntity(dto);
        subtask.setTask(task); // 关联任务
        subtask.setCreatedAt(LocalDateTime.now());
        subtask.setUpdatedAt(LocalDateTime.now());
        Subtask saved = subtaskRepo.save(subtask);
        return toDTO(saved);
    }

    @Override
    public SubtaskDTO updateSubtask(String taskId, String subtaskId, SubtaskDTO dto) {
        Subtask subtask = subtaskRepo.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在或不属于该任务"));

        subtask.setTitle(dto.getTitle());
        subtask.setCompleted(dto.isCompleted());
        return toDTO(subtaskRepo.save(subtask));
    }

    @Override
    public void deleteSubtask(String taskId, String subtaskId) {
        Subtask subtask = subtaskRepo.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在或不属于该任务"));
        subtaskRepo.delete(subtask);
    }

    // ---------- DTO ↔ Entity 映射 ----------   ??
    private SubtaskDTO toDTO(Subtask subtask) {
        SubtaskDTO dto = new SubtaskDTO();
    
        dto.setId(subtask.getId());

        dto.setTitle(subtask.getTitle());
        dto.setCompleted(subtask.getCompleted());
        dto.setTaskId(subtask.getTask().getId());
        return dto;
    }

    private Subtask toEntity(SubtaskDTO dto) {
        Subtask entity = new Subtask();
        entity.setTitle(dto.getTitle());
        entity.setCompleted(dto.isCompleted());
        return entity;
    }
}
