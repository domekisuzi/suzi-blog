package cn.domekisuzi.blog.service;

 import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.repository.ModuleRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleService {
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

