package cn.domekisuzi.blog.controller;

import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.service.SubtaskService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
 

@RestController
@RequestMapping("/api/tasks/{taskId}/subtasks")
public class SubtaskController {

    private final SubtaskService subtaskService;

    public SubtaskController(SubtaskService subtaskService) {
        
        this.subtaskService = subtaskService;
    }

    /**
     * 获取某个任务下的所有子任务
     */
    @GetMapping
    public ResponseEntity<List<SubtaskDTO>> getSubtasks(@PathVariable String taskId) {
        List<SubtaskDTO> subtasks = subtaskService.getSubtasksByTaskId(taskId);
        return ResponseEntity.ok(subtasks);
    }

    /**
     * 创建子任务（绑定任务 ID）
     */
    @PostMapping
    public ResponseEntity<SubtaskDTO> createSubtask(@PathVariable String taskId, @RequestBody SubtaskDTO dto) {
        SubtaskDTO created = subtaskService.createSubtask(taskId, dto);
        
        return ResponseEntity.ok(created);
    }

    /**
     * 更新子任务内容（如标题、完成状态）
     */
    @PutMapping("/{subtaskId}")
    public ResponseEntity<SubtaskDTO> updateSubtask(@PathVariable String taskId, @PathVariable String subtaskId, @RequestBody SubtaskDTO dto) {
        SubtaskDTO updated = subtaskService.updateSubtask(taskId, subtaskId, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * 删除子任务
     */
    @DeleteMapping("/{subtaskId}")
    public ResponseEntity<Void> deleteSubtask(@PathVariable String taskId, @PathVariable String subtaskId) {
        subtaskService.deleteSubtask(taskId, subtaskId);
        return ResponseEntity.noContent().build();
    }
}
