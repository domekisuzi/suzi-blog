package cn.domekisuzi.blog.service;

import cn.domekisuzi.blog.dto.GoalDTO;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Goal;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface GoalService {
    
    List<GoalDTO> getAllGoals();
    
    GoalDTO getGoalById(String id);
    
    GoalDTO createGoal(GoalDTO goalDTO);
    
    GoalDTO updateGoal(String id, GoalDTO goalDTO);
    
    void deleteGoal(String id);
    
    List<GoalDTO> getActiveGoals();
    
    List<GoalDTO> getLongTermGoals();
    
    List<GoalDTO> getGoalsInRange(LocalDate startDate, LocalDate endDate);
    
    GoalDTO updateProgress(String id, Integer progress);
    
    // 绑定任务到目标
    GoalDTO addTasksToGoal(String goalId, Set<String> taskIds);
    
    // 从目标移除任务
    GoalDTO removeTasksFromGoal(String goalId, Set<String> taskIds);
    
    // 自动计算并更新进度
    GoalDTO recalculateProgress(String goalId);
    
    // 获取目标绑定的任务列表
    List<TaskDTO> getTasksByGoalId(String goalId);
}
