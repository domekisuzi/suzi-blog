package cn.domekisuzi.blog.controller;

import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.mapper.SubtaskMapper;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import cn.domekisuzi.blog.service.SubtaskService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

 

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class SubtaskController {
    //TOOD("好像有点冗余，为什么一定要taskID")
    private final SubtaskService subtaskService;


    private final SubtaskRepository subtaskRepository;


    /**
     * 获取某个任务下的所有子任务
     */
    @GetMapping("/{taskId}/subtasks")
    public ResponseEntity<List<SubtaskDTO>> getSubtasks(@PathVariable String taskId) {
        List<SubtaskDTO> subtasks = subtaskService.getSubtasksByTaskId(taskId);
        return ResponseEntity.ok(subtasks);
    }

    
    /**
     * 创建子任务（绑定任务 ID）
     */
    @PostMapping("/{taskId}/subtasks")
    public ResponseEntity<SubtaskDTO> createSubtask(@PathVariable String taskId, @RequestBody SubtaskDTO dto) {
        SubtaskDTO created = subtaskService.createSubtask(taskId, dto);
        
        System.out.println("生成子任务" + created.toString());
        return ResponseEntity.ok(created);
    }

    /**
     * 更新子任务内容（如标题、完成状态）
     */
    @PutMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<SubtaskDTO> updateSubtask(@PathVariable String taskId, @PathVariable String subtaskId, @RequestBody SubtaskDTO dto) {
        SubtaskDTO updated = subtaskService.updateSubtask(taskId, subtaskId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 删除子任务
     */
    @DeleteMapping("/{taskId}/subtasks/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(@PathVariable String taskId, @PathVariable String subtaskId) {
        subtaskService.deleteSubtask(taskId, subtaskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/subtasks")
    public ResponseEntity<List<SubtaskDTO>> getAllSubtasks() {
        List<SubtaskDTO> subtasks = subtaskRepository.findAll().stream()
                .map(SubtaskMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subtasks);
    }

    @DeleteMapping("/subtasks/{subtaskId}")
    public ResponseEntity<Void> deleteSubtaskById(@PathVariable String subtaskId) {
        subtaskService.deleteSubtaskById(subtaskId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/subtasks")
    public ResponseEntity<SubtaskDTO> updateSubtask(@RequestBody SubtaskDTO dto) {
        SubtaskDTO updated = subtaskService.updateSubtask(dto);
        return ResponseEntity.ok(updated);
    }
    
}
