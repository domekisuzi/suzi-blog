package cn.domekisuzi.blog.controller;
 
import lombok.RequiredArgsConstructor;
 import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.service.TaskService;
import jakarta.validation.Valid;

import java.util.List;
import java.time.LocalDateTime;
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskRepository repo;
 

    private final TaskService taskService;


    @GetMapping
    public List<Task> getAll() {
        return repo.findAll();
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
