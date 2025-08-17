package cn.domekisuzi.blog.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import cn.domekisuzi.blog.dto.ModuleDTO;
import cn.domekisuzi.blog.service.ModuleService;
import cn.domekisuzi.blog.vo.ModuleDetailVo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

 
 
@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody @Valid ModuleDTO moduleDTO) {
        ModuleDTO savedModule = moduleService.createModule(moduleDTO);
       
        return ResponseEntity.status(HttpStatus.CREATED).body(savedModule);
    }

    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        List<ModuleDTO> modules = moduleService.getAllModules();
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable String id) {
        ModuleDTO module = moduleService.getModuleById(id);
        return ResponseEntity.ok(module);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable String id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModuleName(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String newName = payload.get("name");
        ModuleDTO dto = new ModuleDTO();
        dto.setName(newName);
        ModuleDTO updated = moduleService.updateModule(id, dto);
        return ResponseEntity.ok(updated);
    }


    @GetMapping("/{moduleId}/detail")
    public ResponseEntity<ModuleDetailVo> getModuleDetail(@PathVariable String moduleId) {
        ModuleDetailVo moduleDetail = moduleService.getModuleDetail(moduleId);
        return ResponseEntity.ok(moduleDetail);
    }

    @GetMapping("/vo")
    public ResponseEntity<List<ModuleDetailVo>> getAllModuleDetails() {
        List<ModuleDetailVo> moduleDetails = moduleService.getAllModuleDetails();
        return ResponseEntity.ok(moduleDetails);
    }
}
