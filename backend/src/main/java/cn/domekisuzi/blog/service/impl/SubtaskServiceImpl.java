package cn.domekisuzi.blog.service.impl;

 

 
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.mapper.SubtaskMapper;
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
                .map(SubtaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubtaskDTO createSubtask(String taskId, SubtaskDTO dto) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在: " + taskId));

        System.out.println("子任务----生成" + dto.toString());
        
        Subtask subtask = SubtaskMapper.toEntity(dto);
        subtask.setTask(task); // 关联任务
        // subtask.setTitle(dto.getTitle());
        subtask.setCreatedAt(LocalDateTime.now());
        subtask.setUpdatedAt(LocalDateTime.now());
        // if(dto.getDueDate() != null && dto.getDueDate() != "") {
        //     subtask.setDueDate(LocalDateTime.parse(dto.getDueDate()));
        // }
        Subtask saved = subtaskRepo.save(subtask);
        return SubtaskMapper.toDTO(saved);
    }

    
    @Override
    public SubtaskDTO updateSubtask(String taskId, String subtaskId, SubtaskDTO dto) {
        Subtask subtask = subtaskRepo.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在或不属于该任务"));

        subtask.setTitle(dto.getTitle());
        subtask.setCompleted(dto.isCompleted());
        return SubtaskMapper.toDTO(subtaskRepo.save(subtask));
    }

    //TODO("以后有空可以优化这个，其实不需要taskId")
    @Override
    public void deleteSubtask(String taskId, String subtaskId) {
        Subtask subtask = subtaskRepo.findByIdAndTaskId(subtaskId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在或不属于该任务"));
        subtaskRepo.delete(subtask);
    }

    @Override
    public List<SubtaskDTO> parseSubtasksJson(String subtasks) {
        return SubtaskMapper.parseSubtasksJson(subtasks);
    }

    @Override
    public void deleteSubtaskById(String subtaskId) {
        Subtask subtask = subtaskRepo.findById(subtaskId)
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在"));
        subtaskRepo.delete(subtask);
    }

    @Override
    public SubtaskDTO updateSubtask(SubtaskDTO dto) {
        // TODO Auto-generated method stub
        Subtask subtask = subtaskRepo.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("子任务不存在"));
        subtask.setTitle(dto.getTitle());
        subtask.setCompleted(dto.isCompleted());
        return SubtaskMapper.toDTO(subtaskRepo.save(subtask));
    }

}
