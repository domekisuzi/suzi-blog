package cn.domekisuzi.blog.service.impl;


import java.util.List;
import java.util.stream.Collectors;
 
import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.repository.projection.ModuleDetailProjection;
import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;

import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.exception.ResourceNotFoundException;
import cn.domekisuzi.blog.mapper.ModuleMapper;
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.service.ModuleService;
import cn.domekisuzi.blog.service.TaskService;
import cn.domekisuzi.blog.vo.ModuleDetailVo;
 
@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {
    private final ModuleRepository moduleRepository;
   
    private final ModuleMapper moduleMapper;
    
    private final TaskService taskService; // 假设有一个任务服务来处理任务相关逻辑

    @Override
    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        Module module = moduleMapper.toEntity(moduleDTO);
        Module saved = moduleRepository.save(module);
        return moduleMapper.toDTO(saved);
    }

    @Override
    public ModuleDTO getModuleById(String id) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        return moduleMapper.toDTO(module);
    }

    @Override
    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(moduleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleDTO updateModule(String id, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        module.setName(moduleDTO.getName());
        Module updated = moduleRepository.save(module);
        return moduleMapper.toDTO(updated);
    }

    @Override
    public void deleteModule(String id) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        moduleRepository.delete(module);
    }



    @Override
    public ModuleDetailVo getModuleDetail(String moduleId) {
        // 使用优化后的查询方法，一次性加载Module、Tasks和Subtasks
        Module module = moduleRepository.findByIdWithTasksAndSubtasks(moduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        
        List<Task> tasks = module.getTasks();

        int taskNumber = tasks.size();
        int completedTaskNumber = (int) tasks.stream().filter(Task::getCompleted).count();

        int subTaskNumber = 0;
        int completedSubtaskNumber = 0;

        for (Task task : tasks) {
            List<Subtask> subtasks = task.getSubtasks(); // 现在不会触发额外查询
            subTaskNumber += subtasks.size();
            completedSubtaskNumber += (int) subtasks.stream().filter(Subtask::getCompleted).count();
        }

        int totalItems = taskNumber + subTaskNumber;
        int completedItems = completedTaskNumber + completedSubtaskNumber;
        float completedRate = totalItems == 0 ? 0 : (float) (completedItems * 100.0 / totalItems);

        ModuleDetailVo vo = new ModuleDetailVo();
        vo.setId(module.getId());
        vo.setName(module.getName());
        vo.setTaskNumber(taskNumber);
        vo.setSubtaskNumber(subTaskNumber);
        vo.setCompletedTaskNumber(completedTaskNumber);
        vo.setCompletedSubtaskNumber(completedSubtaskNumber);
        vo.setCompletedRate(String.valueOf(completedRate));
        vo.setIconSVG(module.getIconSVG());
        return vo;
    }

    @Override
    public List<ModuleDetailVo> getAllModuleDetails() {
        List<ModuleDetailProjection> moduleDetailProjections =  moduleRepository.findMoudleDetailVo();
        return moduleDetailProjections.stream()
                .map(projection -> {
                    int subtaskNumber = projection.getSubtaskNumber() != null ? projection.getSubtaskNumber().intValue() : 0;
                    int completedSubtaskNumber = projection.getCompletedSubtaskNumber() != null ? projection.getCompletedSubtaskNumber().intValue() : 0;
                    int taskNumber = projection.getTaskNumber() != null ? projection.getTaskNumber().intValue() : 0;
                    int completedTaskNumber = projection.getCompletedTaskNumber() != null ? projection.getCompletedTaskNumber().intValue() : 0;
                    int totalItems = taskNumber + subtaskNumber;
                    float completedRate = totalItems == 0 ? 0 : (float) (100.0 * (completedSubtaskNumber + completedTaskNumber) / totalItems);
                    // System.out.println("ModuleDetailProjection: " + projection.getId() + ", completedRate: " + completedRate);
                    return new ModuleDetailVo(
                            projection.getId(),
                            projection.getName(),
                            taskNumber,
                            subtaskNumber,
                            String.valueOf(completedRate),
                            completedSubtaskNumber,
                            completedTaskNumber,
                            projection.getIconSVG(),
                            null // dueDate 暂时设为 null
                    );
                })
                .collect(Collectors.toList());
    }
}
