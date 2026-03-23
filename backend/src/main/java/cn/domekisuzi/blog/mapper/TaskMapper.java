package cn.domekisuzi.blog.mapper;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.model.Module;
 
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class TaskMapper {
    private final ModuleRepository moduleRepository;

    // public TaskMapper(ModuleRepository moduleRepository) {
    //     this.moduleRepository = moduleRepository;
    // }

    // 🔁 DTO → Entity
    public Task toEntity(TaskDTO dto) {
        Task task = new Task();

        if(dto.getId() != null && dto.getId() != ""){
            task.setId(dto.getId());
        }
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setCompleted(dto.isCompleted());

        if (dto.getDueDate() != null && !dto.getDueDate().isEmpty()) {
            if(dto.getDueDate().isEmpty()){
                task.setDueDate(null);
            }
            else 
            task.setDueDate(LocalDateTime.parse(dto.getDueDate()));
        }

        task.setCreatedAt(LocalDateTime.parse(dto.getCreatedAt()));
        task.setUpdatedAt(LocalDateTime.parse(dto.getUpdatedAt()));

        if (dto.getModuleName() != null && dto.getModuleName() != "") {
            Module module = moduleRepository.findByName(dto.getModuleName())
                .orElseThrow(() -> new IllegalArgumentException("模块不存在"));
            task.setModule(module);// if one entity do not have any module, it will be null directly 
        }

        if (dto.getSubtasks() != null) {
            List<Subtask> subtasks = dto.getSubtasks().stream()
                .map(SubtaskMapper::toEntity)
                .collect(Collectors.toList());
            subtasks.forEach(sub -> sub.setTask(task));
            task.setSubtasks(subtasks);
        }

        return task;
    }

    // 🔁 Entity → DTO
    public TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        if(task.getId() != null && task.getId() != ""){
            dto.setId(task.getId());
        }
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setCompleted(task.getCompleted());

        if (task.getDueDate() != null) {
            dto.setDueDate(task.getDueDate().toString());
        }

        // 处理 null 值情况
        dto.setCreatedAt(task.getCreatedAt() != null ? task.getCreatedAt().toString() : "");
        dto.setUpdatedAt(task.getUpdatedAt() != null ? task.getUpdatedAt().toString() : "");
        dto.setModuleName(task.getModule() != null ? task.getModule().getName() : null);

        if (task.getSubtasks() != null) {
            dto.setSubtasks(task.getSubtasks().stream()
                .map(SubtaskMapper::toDTO)
                .collect(Collectors.toList()));
        }

        return dto;
    }

    // 🔁 批量转换：DTO → Entity
    public List<Task> toEntityList(List<TaskDTO> dtos) {
        return dtos.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    // 🔁 批量转换：Entity → DTO
    public List<TaskDTO> toDTOList(List<Task> tasks) {
        return tasks.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
