package cn.domekisuzi.blog.mapper;

import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.model.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ModuleMapper {

    public ModuleDTO toDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setName(module.getName());
        if (module.getIconSVG() != null) {
            dto.setIconSVG(module.getIconSVG());    
        }
        if (module.getTasks() != null) {
            List<TaskDTO> taskDTOs = module.getTasks().stream()
                    .map(this::toTaskDTO)
                    .collect(Collectors.toList());
            dto.setTasks(taskDTOs);
        }

        return dto;
    }

    public Module toEntity(ModuleDTO dto) {
        Module module = new Module();
        module.setId(dto.getId()); // 可选：创建时可能为空
        module.setName(dto.getName());
        if(dto.getIconSVG() != null){
            module.setIconSVG(dto.getIconSVG());
        }
        // 不设置 tasks，这通常由 TaskService 管理
        return module;
    }

    private TaskDTO toTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setCompleted(task.getCompleted());// it is unsutable to get task because it cause a looper
        // 可扩展更多字段
        return dto;
    }
}
