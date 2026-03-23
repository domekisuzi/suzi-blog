package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.dto.GoalDTO;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.exception.ResourceNotFoundException;
import cn.domekisuzi.blog.model.Goal;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.GoalRepository;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class GoalServiceImpl implements GoalService {
    
    private final GoalRepository goalRepository;
    private final TaskRepository taskRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getAllGoals() {
        return goalRepository.findAll().stream()
                .map(GoalDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public GoalDTO getGoalById(String id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        return GoalDTO.fromEntity(goal);
    }
    
    @Override
    public GoalDTO createGoal(GoalDTO goalDTO) {
        Goal goal = goalDTO.toEntity();
        Goal savedGoal = goalRepository.save(goal);
        return GoalDTO.fromEntity(savedGoal);
    }
    
    @Override
    public GoalDTO updateGoal(String id, GoalDTO goalDTO) {
        Goal existingGoal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        
        existingGoal.setTitle(goalDTO.getTitle());
        existingGoal.setDescription(goalDTO.getDescription());
        existingGoal.setStartDate(goalDTO.getStartDate());
        existingGoal.setEndDate(goalDTO.getEndDate());
        existingGoal.setColor(goalDTO.getColor());
        existingGoal.setProgress(goalDTO.getProgress());
        existingGoal.setType(goalDTO.getType());
        
        Goal updatedGoal = goalRepository.save(existingGoal);
        return GoalDTO.fromEntity(updatedGoal);
    }
    
    @Override
    public void deleteGoal(String id) {
        if (!goalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Goal not found with id: " + id);
        }
        goalRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getActiveGoals() {
        LocalDate today = LocalDate.now();
        return goalRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(today, today).stream()
                .map(GoalDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getLongTermGoals() {
        return goalRepository.findByTypeOrderByStartDateAsc(Goal.GoalType.LONG_TERM).stream()
                .map(GoalDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<GoalDTO> getGoalsInRange(LocalDate startDate, LocalDate endDate) {
        return goalRepository.findByEndDateGreaterThanEqualAndStartDateLessThanEqual(startDate, endDate).stream()
                .map(GoalDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public GoalDTO updateProgress(String id, Integer progress) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        
        goal.setProgress(Math.min(100, Math.max(0, progress)));
        Goal updatedGoal = goalRepository.save(goal);
        return GoalDTO.fromEntity(updatedGoal);
    }
    
    @Override
    public GoalDTO addTasksToGoal(String goalId, Set<String> taskIds) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        
        List<Task> tasks = taskRepository.findAllById(taskIds);
        if (tasks.size() != taskIds.size()) {
            throw new ResourceNotFoundException("Some tasks not found");
        }
        
        goal.getTasks().addAll(tasks);
        Goal updatedGoal = goalRepository.save(goal);
        
        // 自动重新计算进度
        return recalculateProgress(goalId);
    }
    
    @Override
    public GoalDTO removeTasksFromGoal(String goalId, Set<String> taskIds) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        
        goal.getTasks().removeIf(task -> taskIds.contains(task.getId()));
        Goal updatedGoal = goalRepository.save(goal);
        
        // 自动重新计算进度
        return recalculateProgress(goalId);
    }
    
    @Override
    public GoalDTO recalculateProgress(String goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        
        Set<Task> tasks = goal.getTasks();
        if (tasks == null || tasks.isEmpty()) {
            goal.setProgress(0);
        } else {
            long completedCount = tasks.stream()
                    .filter(task -> Boolean.TRUE.equals(task.getCompleted()))
                    .count();
            int progress = (int) ((completedCount * 100) / tasks.size());
            goal.setProgress(progress);
        }
        
        Goal updatedGoal = goalRepository.save(goal);
        return GoalDTO.fromEntity(updatedGoal);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByGoalId(String goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + goalId));
        
        return goal.getTasks().stream()
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * 将 Task 实体转换为 TaskDTO
     */
    private TaskDTO convertToTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCompleted(task.getCompleted() != null ? task.getCompleted() : false);
        dto.setPriority(task.getPriority());
        dto.setModuleName(task.getModule() != null ? task.getModule().getName() : null);
        
        // 格式化日期
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        if (task.getDueDate() != null) {
            dto.setDueDate(task.getDueDate().format(formatter));
        }
        if (task.getCreatedAt() != null) {
            dto.setCreatedAt(task.getCreatedAt().format(formatter));
        }
        if (task.getUpdatedAt() != null) {
            dto.setUpdatedAt(task.getUpdatedAt().format(formatter));
        }
        
        return dto;
    }
}
