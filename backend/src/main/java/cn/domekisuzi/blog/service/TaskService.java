package cn.domekisuzi.blog.service;

 
import java.util.List;
 
import cn.domekisuzi.blog.dto.TaskDTO;
import cn.domekisuzi.blog.vo.TaskDetailVo;
 

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
    List<TaskDetailVo> getAllTaskDetailVos();
}  