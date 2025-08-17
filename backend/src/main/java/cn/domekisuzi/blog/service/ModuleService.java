package cn.domekisuzi.blog.service;

 
import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.vo.ModuleDetailVo;

import java.util.List;


public interface ModuleService {
  

    ModuleDTO createModule(ModuleDTO moduleDTO);
    ModuleDTO getModuleById(String id);
    List<ModuleDTO> getAllModules();
    ModuleDTO updateModule(String id, ModuleDTO moduleDTO);
    void deleteModule(String id);
    ModuleDetailVo getModuleDetail(String moduleId);
    List<ModuleDetailVo> getAllModuleDetails();
}

