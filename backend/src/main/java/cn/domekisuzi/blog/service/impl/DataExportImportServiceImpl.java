package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.dto.*;
import cn.domekisuzi.blog.model.*;
import cn.domekisuzi.blog.repository.*;
import cn.domekisuzi.blog.service.DataExportImportService;
import cn.domekisuzi.blog.mapper.TaskMapper;
import cn.domekisuzi.blog.mapper.ModuleMapper;
import cn.domekisuzi.blog.mapper.SubtaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DataExportImportServiceImpl implements DataExportImportService {

    private final ModuleRepository moduleRepository;
    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final GoalRepository goalRepository;
    private final TaskMapper taskMapper;
    private final ModuleMapper moduleMapper;

    @Override
    public ExportDataDTO exportAllData() {
        ExportDataDTO exportData = new ExportDataDTO();
        exportData.setExportVersion("1.0");
        exportData.setExportTime(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // 导出所有模块
        List<cn.domekisuzi.blog.model.Module> modules = moduleRepository.findAll();
        exportData.setModules(modules.stream()
                .map(moduleMapper::toDTO)
                .collect(Collectors.toList()));

        // 导出所有任务
        List<Task> tasks = taskRepository.findAll();
        exportData.setTasks(tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList()));

        // 导出所有子任务
        List<Subtask> subtasks = subtaskRepository.findAll();
        exportData.setSubtasks(subtasks.stream()
                .map(SubtaskMapper::toDTO)
                .collect(Collectors.toList()));

        // 导出所有目标
        List<Goal> goals = goalRepository.findAll();
        exportData.setGoals(goals.stream()
                .map(this::goalToDTO)
                .collect(Collectors.toList()));

        return exportData;
    }

    @Override
    @Transactional
    public void importData(ExportDataDTO data) {
        if (data == null) {
            throw new IllegalArgumentException("导入数据不能为空");
        }

        // 创建 ID 映射表，用于处理关联关系
        Map<String, String> moduleIdMap = new HashMap<>();
        Map<String, String> taskIdMap = new HashMap<>();

        // 1. 先清空现有数据（按依赖顺序）
        subtaskRepository.deleteAll();
        goalRepository.deleteAll();
        taskRepository.deleteAll();
        moduleRepository.deleteAll();

        // 2. 导入模块
        if (data.getModules() != null) {
            for (ModuleDTO moduleDTO : data.getModules()) {
                String oldId = moduleDTO.getId();
                cn.domekisuzi.blog.model.Module module = moduleMapper.toEntity(moduleDTO);
                module.setId(null); // 让数据库生成新 ID
                cn.domekisuzi.blog.model.Module saved = moduleRepository.save(module);
                moduleIdMap.put(oldId, saved.getId());
            }
        }

        // 3. 导入任务（不导入子任务，子任务单独处理）
        if (data.getTasks() != null) {
            for (TaskDTO taskDTO : data.getTasks()) {
                String oldId = taskDTO.getId();
                
                // 手动创建 Task，避免使用 taskMapper.toEntity 带来的子任务问题
                Task task = new Task();
                task.setId(null); // 让数据库生成新 ID
                task.setTitle(taskDTO.getTitle());
                task.setDescription(taskDTO.getDescription());
                task.setPriority(taskDTO.getPriority());
                task.setCompleted(taskDTO.isCompleted());
                
                if (taskDTO.getDueDate() != null && !taskDTO.getDueDate().isEmpty()) {
                    task.setDueDate(taskMapper.parseDateTime(taskDTO.getDueDate()));
                }
                if (taskDTO.getCreatedAt() != null && !taskDTO.getCreatedAt().isEmpty()) {
                    task.setCreatedAt(taskMapper.parseDateTime(taskDTO.getCreatedAt()));
                } else {
                    task.setCreatedAt(LocalDateTime.now());
                }
                if (taskDTO.getUpdatedAt() != null && !taskDTO.getUpdatedAt().isEmpty()) {
                    task.setUpdatedAt(taskMapper.parseDateTime(taskDTO.getUpdatedAt()));
                } else {
                    task.setUpdatedAt(LocalDateTime.now());
                }
                
                // 通过模块名称查找模块（使用第一个匹配的模块）
                if (taskDTO.getModuleName() != null && !taskDTO.getModuleName().isEmpty()) {
                    List<cn.domekisuzi.blog.model.Module> modules = moduleRepository.findAllByName(taskDTO.getModuleName());
                    if (!modules.isEmpty()) {
                        task.setModule(modules.get(0));
                    }
                }
                
                Task saved = taskRepository.save(task);
                taskIdMap.put(oldId, saved.getId());
            }
        }

        // 4. 导入子任务
        if (data.getSubtasks() != null) {
            for (SubtaskDTO subtaskDTO : data.getSubtasks()) {
                Subtask subtask = new Subtask();
                subtask.setId(null); // 让数据库生成新 ID
                subtask.setTitle(subtaskDTO.getTitle());
                subtask.setCompleted(subtaskDTO.isCompleted());
                if (subtaskDTO.getDueDate() != null && !subtaskDTO.getDueDate().isEmpty()) {
                    subtask.setDueDate(cn.domekisuzi.blog.mapper.SubtaskMapper.parseDateTime(subtaskDTO.getDueDate()));
                }
                
                // 更新任务 ID 引用
                if (subtaskDTO.getTaskId() != null) {
                    String newTaskId = taskIdMap.get(subtaskDTO.getTaskId());
                    if (newTaskId != null) {
                        Task task = taskRepository.findById(newTaskId).orElse(null);
                        subtask.setTask(task);
                    }
                }
                
                subtaskRepository.save(subtask);
            }
        }

        // 5. 导入目标
        if (data.getGoals() != null) {
            for (GoalDTO goalDTO : data.getGoals()) {
                Goal goal = new Goal();
                goal.setId(null); // 让数据库生成新 ID
                goal.setTitle(goalDTO.getTitle());
                goal.setDescription(goalDTO.getDescription());
                goal.setStartDate(goalDTO.getStartDate());
                goal.setEndDate(goalDTO.getEndDate());
                goal.setColor(goalDTO.getColor());
                
                // 更新任务 ID 引用
                if (goalDTO.getTaskIds() != null) {
                    Set<Task> tasks = new HashSet<>();
                    for (String oldTaskId : goalDTO.getTaskIds()) {
                        String newTaskId = taskIdMap.get(oldTaskId);
                        if (newTaskId != null) {
                            Task task = taskRepository.findById(newTaskId).orElse(null);
                            if (task != null) {
                                tasks.add(task);
                            }
                        }
                    }
                    goal.setTasks(tasks);
                }
                
                goalRepository.save(goal);
            }
        }
    }

    private GoalDTO goalToDTO(Goal goal) {
        GoalDTO dto = new GoalDTO();
        dto.setId(goal.getId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setStartDate(goal.getStartDate());
        dto.setEndDate(goal.getEndDate());
        dto.setColor(goal.getColor());
        
        if (goal.getTasks() != null) {
            dto.setTaskIds(goal.getTasks().stream()
                    .map(Task::getId)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
