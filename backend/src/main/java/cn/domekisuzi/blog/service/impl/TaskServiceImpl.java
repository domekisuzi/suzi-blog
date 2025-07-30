package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.utils.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.service.TaskService;


@Service
@RequiredArgsConstructor
public class TaskServiceImpl  implements TaskService {

    private final TaskRepository taskRepository;

    private final SubtaskRepository subtaskRepository;

    // 获取所有任务
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 根据 ID 获取单个任务
    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    // 创建新任务
    public Task createTask(Task task) {
        task.setDueDate(TimeUtils.parse(task.getDueDate().toString()));
        task.setCreatedAt(TimeUtils.now());
        task.setUpdatedAt(TimeUtils.now());
        return taskRepository.save(task);
    }

    // 更新任务（需先查找原任务）
    public Task updateTask(String id, Task updates) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existing.setTitle(updates.getTitle());
        existing.setDescription(updates.getDescription());
        existing.setCompleted(updates.getCompleted());
        existing.setPriority(updates.getPriority());
        existing.setDueDate(updates.getDueDate());
        existing.setUpdatedAt(updates.getUpdatedAt());
        existing.setModule(updates.getModule());
        existing.setCategory(updates.getCategory());

        existing.setSubtasks(updates.getSubtasks());

        return taskRepository.save(existing);
    }

    // 删除任务
    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }


public List<Task> getTasksByModule(String moduleId) {
    return taskRepository.findByModuleId(moduleId);
}

public List<Subtask> getSubtasksForTask(String taskId) {
    return subtaskRepository.findByTaskId(taskId);
}

public long countCompletedTasksInModule(String moduleId) {
    return taskRepository.findByModuleId(moduleId)
                         .stream()
                         .filter(Task::getCompleted)
                         .count();
}

}