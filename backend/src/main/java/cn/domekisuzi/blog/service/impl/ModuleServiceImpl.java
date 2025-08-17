package cn.domekisuzi.blog.service.impl;


import java.util.List;
import java.util.stream.Collectors;
 
import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.repository.projection.ModuleDetailProjection;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
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
        Module module = moduleRepository.findById(moduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        
        List<Task> tasks = module.getTasks(); // depend on  repository,now it can get every task list,but it is a little inefficent to get useless task 

        int taskNumber = tasks.size();
        int completedTaskNumber = (int) tasks.stream().filter(Task::getCompleted).count();

        int subTaskNumber = 0;
        int completedSubtaskNumber = 0;

        for (Task task : tasks) {
            List<Subtask> subtasks = task.getSubtasks(); // 假设已关联子任务
            subTaskNumber += subtasks.size();
            completedSubtaskNumber += subtasks.stream().filter(Subtask::getCompleted).count();
        }

        int totalItems = taskNumber + subTaskNumber;
        int completedItems = completedTaskNumber + completedSubtaskNumber;
        float completedRate = totalItems == 0 ? 0 :(float) (completedItems * 100 / totalItems);

        ModuleDetailVo vo = new ModuleDetailVo();
        vo.setId(module.getId());
        vo.setName(module.getName());
        vo.setTaskNumber(taskNumber);
        vo.setSubtaskNumber(subTaskNumber);
        vo.setCompletedTaskNumber(completedTaskNumber);
        vo.setCompletedSubtaskNumber(completedSubtaskNumber);
        vo.setCompletedRate(String.valueOf(completedRate)); // 转换为字符串格式
        vo.setIconSVG(module.getIconSVG()); // 假设字段名为 iconSvg
        // vo.setDueDate(module.getDueDate() != null ? module.getDueDate().toString() : null);
        return vo;
    }

    @Override
    public List<ModuleDetailVo> getAllModuleDetails() {
        List<ModuleDetailProjection> moduleDetailProjections =  moduleRepository.findMoudleDetailVo();
        return moduleDetailProjections.stream()
                .map(projection -> new ModuleDetailVo(
                        projection.getId(),
                        projection.getName(),
                        projection.getTaskNumber().intValue(),
                        projection.getSubtaskNumber().intValue(),
                        String.valueOf ((float) projection.getCompletedTaskNumber().intValue()* 100 / projection.getTaskNumber().intValue()  ),
                        projection.getCompletedSubtaskNumber().intValue(),
                        projection.getCompletedTaskNumber().intValue(),
                        projection.getIconSVG(),
                        null // dueDate 暂时设为 null
                ))
                .collect(Collectors.toList());
    }

}
