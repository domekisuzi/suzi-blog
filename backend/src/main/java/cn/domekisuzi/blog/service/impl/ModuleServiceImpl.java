package cn.domekisuzi.blog.service.impl;

import java.util.List;

import cn.domekisuzi.blog.repository.ModuleRepository;
 import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import cn.domekisuzi.blog.model.Module;

import cn.domekisuzi.blog.service.ModuleService;
@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {
    
    // 依赖注入 ModuleRepository
 private final ModuleRepository moduleRepository;

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    public void deleteModule(String moduleId) {
        moduleRepository.deleteById(moduleId);
    }
}
