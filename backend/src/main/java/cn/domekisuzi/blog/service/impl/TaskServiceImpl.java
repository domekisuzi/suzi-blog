package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.repository.projection.TaskDetailProjection;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.dto.TaskDTO;

import cn.domekisuzi.blog.mapper.TaskMapper;

import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.service.SubtaskService;
import cn.domekisuzi.blog.service.TaskService;
import cn.domekisuzi.blog.vo.TaskDetailVo;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ModuleRepository moduleRepository;
    private final SubtaskService subtaskService;
    private final TaskMapper taskMapper;

    @Override
    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        return taskMapper.toDTO(task);
    }

    @Override
    public TaskDTO createTask(TaskDTO dto) {
        // 检查同一模块下是否已存在相同标题的任务
        if (dto.getTitle() != null && !dto.getTitle().isEmpty()) {
            List<Task> existingTasks = taskRepository.findByTitle(dto.getTitle());
            for (Task existing : existingTasks) {
                // 如果模块相同（都为空或相同模块名），则认为是重复
                boolean sameModule = (dto.getModuleName() == null || dto.getModuleName().isEmpty()) 
                    ? existing.getModule() == null 
                    : existing.getModule() != null && existing.getModule().getName().equals(dto.getModuleName());
                if (sameModule) {
                    throw new IllegalArgumentException("该模块下已存在相同标题的任务: " + dto.getTitle());
                }
            }
        }

        Task task = taskMapper.toEntity(dto);
        task.setId(null); // 确保 ID 由数据库生成
        Task saved = taskRepository.save(task);
        return taskMapper.toDTO(saved);
    }

    @Override
    public TaskDTO updateTask(String id, TaskDTO dto) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setPriority(dto.getPriority());
        existing.setCompleted(dto.isCompleted());
        if (dto.getDueDate() != null) {
            if (dto.getDueDate() == "") {
                existing.setDueDate(null);
            } else {
                existing.setDueDate(taskMapper.parseDateTime(dto.getDueDate()));
            }

        }
        if (dto.getModuleName() != null && dto.getModuleName() != "") {
            Module module = moduleRepository.findByName(dto.getModuleName())
                    .orElseThrow(() -> new IllegalArgumentException("模块不存在"));
            existing.setModule(module);
        }

        if (dto.getSubtasks() != null) {
            for (SubtaskDTO subtask : dto.getSubtasks()) {
                // 如果子任务 ID 为空，说明是新建的子任务
                if (subtask.getId() == null || subtask.getId().isEmpty()) {
                    subtaskService.createSubtask(existing.getId(), subtask);
                } else {
                    // 否则更新现有子任务
                    subtaskService.updateSubtask(existing.getId(), subtask.getId(), subtask);
                }
            }
        }
        Task updated = taskRepository.save(existing);
        return taskMapper.toDTO(updated);
    }

    @Override
    public void deleteTask(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        taskRepository.delete(task);
    }

    @Override
    public List<TaskDetailVo> getAllTaskDetailVos() {
        List<TaskDetailProjection> projections = taskRepository.findTaskDetailVo();
        List<TaskDetailVo> taskDetailVos = projections.stream()
                .map(proj -> new TaskDetailVo(
                        proj.getId(),
                        proj.getTitle(),
                        proj.getDescription(),
                        proj.getModuleName(),
                        proj.getPriority(),
                        proj.getCompletedInteger() == 1 ? true : false,
                        proj.getDueDate(),
                        proj.getCreatedAt(),
                        proj.getCompletedRate(),
                        proj.getSubtasks() != null ? subtaskService.parseSubtasksJson(proj.getSubtasks()) : List.of()  
                ))
                .collect(Collectors.toList());

        return taskDetailVos;
    }

}