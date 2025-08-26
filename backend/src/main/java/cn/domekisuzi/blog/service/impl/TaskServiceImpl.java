package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.repository.projection.TaskDetailProjection;
import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import cn.domekisuzi.blog.dto.TaskDTO;
 
import cn.domekisuzi.blog.mapper.TaskMapper;
 
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.service.SubtaskService;
import cn.domekisuzi.blog.service.TaskService;
import cn.domekisuzi.blog.vo.TaskDetailVo;
 

@Service
@RequiredArgsConstructor
public class TaskServiceImpl  implements TaskService {


    private final TaskRepository taskRepository;
    private final ModuleRepository moduleRepository;
    private final SubtaskService subtaskService;
    private final TaskMapper taskMapper;

    @Override
    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream()
                .map(taskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        return taskMapper.toDTO(task);
    }

    @Override
    public TaskDTO createTask(TaskDTO dto) {
        
        Task task = taskMapper.toEntity(dto);
        task.setId(null); // 确保 ID 由数据库生成
        Task saved = taskRepository.save(task);
        return taskMapper.toDTO(saved);
    }


    @Override
    public TaskDTO updateTask(String id, TaskDTO dto) {
        Task existing = taskRepository.findById( id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setPriority( dto.getPriority());
        existing.setCompleted(dto.isCompleted());
        if(dto.getDueDate()!= null){
            existing.setDueDate(LocalDateTime.parse(dto.getDueDate()));
        }
       
 
        if (dto.getModuleName() != null) {
            Module module = moduleRepository.findByName(dto.getModuleName())
                    .orElseThrow(() -> new IllegalArgumentException("模块不存在"));
            existing.setModule(module);
            
        }
 

        if(dto.getSubtasks() != null){
            for (SubtaskDTO subtask : dto.getSubtasks()) {
                subtaskService.updateSubtask(existing.getId(), subtask.getId(), subtask);
            }
        }
        Task updated = taskRepository.save(existing);
        return taskMapper.toDTO(updated);
    }

    @Override
    public void deleteTask(String id) {
        Task task = taskRepository.findById( id)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        taskRepository.delete(task);
    }

    @Override
    public  List<TaskDetailVo> getAllTaskDetailVos(){
        List<TaskDetailProjection> projections = taskRepository.findTaskDetailVo();
        List<TaskDetailVo> taskDetailVos = projections.stream()
                .map(proj -> new TaskDetailVo(
                        proj.getId(),
                        proj.getTitle(),
                        proj.getDescription(),
                        proj.getModuleName(),
                        proj.getCompletedInteger() == 1  ? true : false,
                        proj.getDueDate(),
                        proj.getCreatedAt(),
                        proj.getCompletedRate(),
                        proj.getSubtasks() != null ? subtaskService.parseSubtasksJson(proj.getSubtasks()) : List.of()   // if set it to null,it will create a new subtask object with null value 
                ))
                .collect(Collectors.toList()) ;
        
        return taskDetailVos; 
    }
    
}