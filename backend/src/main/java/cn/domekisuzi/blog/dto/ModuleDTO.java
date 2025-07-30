package cn.domekisuzi.blog.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 模块数据传输对象 —— 用于模块详情展示、任务聚合视图等
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
 
public class ModuleDTO {

    /**
     * 模块唯一标识
     */
    private String id;

    /**
     * 模块名称（例如 Frontend、Backend）
     */
    private String name;

    /**
     * 该模块下的任务列表（可选，视接口需求而定）
     */
    private List<TaskDTO> tasks;

    // Getter / Setter
}
