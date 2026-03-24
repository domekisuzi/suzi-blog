package cn.domekisuzi.blog.mapper;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.model.Module;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class TaskMapper {
    private final ModuleRepository moduleRepository;

    // 支持多种日期格式
    private static final DateTimeFormatter[] DATE_FORMATTERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ISO_LOCAL_DATE
    };

    /**
     * 尝试用多种格式解析日期字符串，只保留日期部分
     */
    public LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }

        // 如果字符串包含时间部分，只取日期部分
        String dateOnly = dateStr;
        if (dateStr.contains(" ")) {
            dateOnly = dateStr.substring(0, dateStr.indexOf(" "));
        } else if (dateStr.contains("T")) {
            dateOnly = dateStr.substring(0, dateStr.indexOf("T"));
        }

        // 直接解析为 LocalDate，然后转换为 LocalDateTime（时间为 00:00:00）
        try {
            LocalDate date = LocalDate.parse(dateOnly);
            return date.atStartOfDay();
        } catch (DateTimeParseException e) {
            System.err.println("无法解析日期: " + dateStr);
            return null;
        }
    }

    //  DTO → Entity
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
            task.setDueDate(parseDateTime(dto.getDueDate()));
        }

        // 处理空字符串或 null 情况
        if (dto.getCreatedAt() != null && !dto.getCreatedAt().isEmpty()) {
            task.setCreatedAt(parseDateTime(dto.getCreatedAt()));
        } else {
            task.setCreatedAt(LocalDateTime.now());
        }
        if (dto.getUpdatedAt() != null && !dto.getUpdatedAt().isEmpty()) {
            task.setUpdatedAt(parseDateTime(dto.getUpdatedAt()));
        } else {
            task.setUpdatedAt(LocalDateTime.now());
        }

        if (dto.getModuleName() != null && dto.getModuleName() != "") {
            // 使用 findAllByName 避免重复模块名导致的查询错误，取第一个匹配的模块
            List<Module> modules = moduleRepository.findAllByName(dto.getModuleName());
            if (!modules.isEmpty()) {
                task.setModule(modules.get(0));
            }
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

    //  Entity → DTO
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

    //  批量转换：DTO → Entity
    public List<Task> toEntityList(List<TaskDTO> dtos) {
        return dtos.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    //  批量转换：Entity → DTO
    public List<TaskDTO> toDTOList(List<Task> tasks) {
        return tasks.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
