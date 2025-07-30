package cn.domekisuzi.blog.service;

 import cn.domekisuzi.blog.dto.SubtaskDTO;
import java.util.List;

 
public  interface SubtaskService {

    List<SubtaskDTO> getSubtasksByTaskId(String taskId);
    SubtaskDTO createSubtask(String taskId, SubtaskDTO dto);
    SubtaskDTO updateSubtask(String taskId, String subtaskId, SubtaskDTO dto);
    void deleteSubtask(String taskId, String subtaskId);
} 