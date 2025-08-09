package cn.domekisuzi.blog.service.impl;


import java.util.List;
import java.util.stream.Collectors;
 
import cn.domekisuzi.blog.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;

import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.exception.ResourceNotFoundException;
import cn.domekisuzi.blog.mapper.ModuleMapper;
import cn.domekisuzi.blog.model.Module;


import cn.domekisuzi.blog.service.ModuleService;
 
@Service
@RequiredArgsConstructor
public class ModuleServiceImpl implements ModuleService {

  private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;

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
}
