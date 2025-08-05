package cn.domekisuzi.blog.service;

import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.utils.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.model.Subtask;

public interface TaskService {

    public List<TaskDTO> getAllTasks() ;
    // 根据 ID 获取单个任务
    public TaskDTO getTaskById(String id) ;

    // 创建新任务
    public TaskDTO createTask(TaskDTO taskdTask);

    // 更新任务（需先查找原任务）
    public TaskDTO updateTask(String id, TaskDTO updates) ;
   

    // 删除任务
    public void deleteTask(String id) ;

    // public List<TaskDTO> getTasksByModule(String moduleId) ;
    // public List<Subtask> getSubtasksForTask(String taskId)  ;

    // public long countCompletedTasksInModule(String moduleId) ;
        
}  