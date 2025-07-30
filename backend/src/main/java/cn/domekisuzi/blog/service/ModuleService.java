package cn.domekisuzi.blog.service;

 
import cn.domekisuzi.blog.model.Module;
import java.util.List;


public interface ModuleService {
  

    public List<Module> getAllModules() ;
   
    public Module createModule(Module module);
  
 
    public void deleteModule(String moduleId);
}

