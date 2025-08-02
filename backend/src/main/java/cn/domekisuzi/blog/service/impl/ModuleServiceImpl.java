package cn.domekisuzi.blog.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
 
import cn.domekisuzi.blog.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.model.Module;


import cn.domekisuzi.blog.service.ModuleService;
 
@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Override
    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        Module module = new Module();
         
        module.setName(moduleDTO.getName());

        Module saved = moduleRepository.save(module);

        ModuleDTO result = new ModuleDTO();
        result.setId(saved.getId());
        result.setName(saved.getName());
        result.setTasks(new ArrayList<>()); // 初始可为空
        return result;
    }

    @Override
    public ModuleDTO getModuleById(String id) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));

        return convertEntityToDTO(module);
    }

    @Override
    public List<ModuleDTO> getAllModules() {
        List<Module> modules = moduleRepository.findAll();
        return modules.stream()
                .map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ModuleDTO updateModule(String id, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        module.setName(moduleDTO.getName());
        Module updated = moduleRepository.save(module);

        return convertEntityToDTO(updated);
    }

    @Override
    public void deleteModule(String id) {
        Module module = moduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Module not found"));
        moduleRepository.delete(module);
    }

    private ModuleDTO convertEntityToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setName(module.getName());

        if (module.getTasks() != null) {
            List<TaskDTO> taskDTOs = module.getTasks().stream()
                    .map(task -> {
                        TaskDTO t = new TaskDTO();
                        t.setId(task.getId());
                        t.setName(task.getName());
                        // ...根据 Task 属性补齐你需要展示的字段
                        return t;
                    })
                    .collect(Collectors.toList());
            dto.setTasks(taskDTOs);
        } else {
            dto.setTasks(new ArrayList<>());
        }

        return dto;
    }
}
