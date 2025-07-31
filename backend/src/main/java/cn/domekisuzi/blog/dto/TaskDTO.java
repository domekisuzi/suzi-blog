package cn.domekisuzi.blog.dto;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

import lombok.NoArgsConstructor;
import lombok.Setter;
import cn.domekisuzi.blog.dto.SubtaskDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 任务数据传输对象 —— 用于任务卡片展示、任务详情页、创建/编辑接口
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO extends BaseDTO {

    /**
     * 任务唯一标识
     */
    private String id;

    /**
     * 任务标题
     */
    private String title;

    /**
     * 任务描述
     */
    private String description;

    /**
     * 所属模块名称（如 Frontend）
     */
    private String moduleName;

    /**
     * 任务优先级（如 HIGH / MEDIUM / LOW）
     */
    private String priority;

    /**
     * 截止时间（统一格式为 yyyy-MM-ddTHH:mm:ss）
     */
    private String dueDate;

    /**
     * 是否已完成
     */
    private boolean completed;

    /**
     * 子任务列表（用于展示聚合结构）
     */
    private List<SubtaskDTO> subtasks;
 

}
