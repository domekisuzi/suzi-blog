package cn.domekisuzi.blog.controller;
 
import lombok.RequiredArgsConstructor;
 import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cn.domekisuzi.blog.dto.TaskDTO;
 
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.service.TaskService;
import cn.domekisuzi.blog.vo.TaskDetailVo;
import jakarta.validation.Valid;

import java.util.List;
import java.time.LocalDateTime;
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskRepository repo;
 

    private final TaskService taskService;


    //convert it to DTO but not entity     
    @GetMapping
    public   ResponseEntity<List<TaskDTO>> getAll() {
        List<TaskDTO> allTasks = taskService.getAllTasks();
        return ResponseEntity.ok(allTasks);
    }

    @GetMapping("vo")
    public ResponseEntity<List<TaskDetailVo>> getAllTaskDetails() {
        List<TaskDetailVo> allTaskDetails = taskService.getAllTaskDetailVos();
        return ResponseEntity.ok(allTaskDetails);
    }

    @PostMapping
    public TaskDTO create(@RequestBody @Valid TaskDTO task) {
        task.setCreatedAt(LocalDateTime.now().toString());
        task.setUpdatedAt(LocalDateTime.now().toString());
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable String id, @RequestBody TaskDTO taskInput) {
        TaskDTO updated = taskService.updateTask(id, taskInput);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
