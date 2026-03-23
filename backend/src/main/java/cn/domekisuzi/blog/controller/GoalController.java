package cn.domekisuzi.blog.controller;

import cn.domekisuzi.blog.dto.GoalDTO;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    
    private final GoalService goalService;
    
    @GetMapping
    public ResponseEntity<List<GoalDTO>> getAllGoals() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GoalDTO> getGoalById(@PathVariable String id) {
        return ResponseEntity.ok(goalService.getGoalById(id));
    }
    
    @PostMapping
    public ResponseEntity<GoalDTO> createGoal(@RequestBody GoalDTO goalDTO) {
        return new ResponseEntity<>(goalService.createGoal(goalDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable String id, @RequestBody GoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.updateGoal(id, goalDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id) {
        goalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<GoalDTO>> getActiveGoals() {
        return ResponseEntity.ok(goalService.getActiveGoals());
    }
    
    @GetMapping("/long-term")
    public ResponseEntity<List<GoalDTO>> getLongTermGoals() {
        return ResponseEntity.ok(goalService.getLongTermGoals());
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<GoalDTO>> getGoalsInRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(goalService.getGoalsInRange(startDate, endDate));
    }
    
    @PatchMapping("/{id}/progress")
    public ResponseEntity<GoalDTO> updateProgress(
            @PathVariable String id,
            @RequestParam Integer progress) {
        return ResponseEntity.ok(goalService.updateProgress(id, progress));
    }
    
    // 添加任务到目标
    @PostMapping("/{id}/tasks")
    public ResponseEntity<GoalDTO> addTasksToGoal(
            @PathVariable String id,
            @RequestBody Set<String> taskIds) {
        return ResponseEntity.ok(goalService.addTasksToGoal(id, taskIds));
    }
    
    // 从目标移除任务
    @DeleteMapping("/{id}/tasks")
    public ResponseEntity<GoalDTO> removeTasksFromGoal(
            @PathVariable String id,
            @RequestBody Set<String> taskIds) {
        return ResponseEntity.ok(goalService.removeTasksFromGoal(id, taskIds));
    }
    
    // 重新计算进度
    @PostMapping("/{id}/recalculate")
    public ResponseEntity<GoalDTO> recalculateProgress(@PathVariable String id) {
        return ResponseEntity.ok(goalService.recalculateProgress(id));
    }
    
    // 获取目标绑定的任务列表
    @GetMapping("/{id}/tasks/list")
    public ResponseEntity<List<TaskDTO>> getTasksByGoalId(@PathVariable String id) {
        return ResponseEntity.ok(goalService.getTasksByGoalId(id));
    }
}
