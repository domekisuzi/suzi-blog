package cn.domekisuzi.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 子任务数据传输对象 —— 用于任务详情中的子任务列表展示
 */


@Data
@NoArgsConstructor
@AllArgsConstructor

public class SubtaskDTO {

    /**
     * 子任务唯一标识
     */
    private String id;

    /**
     * 子任务标题
     */
    private String title;

    /**
     * 是否已完成
     */
    private boolean completed;

    /**
     * 所属任务的 ID（可选，视接口是否需要反向追踪）
     */
    private String taskId;

    // Getter / Setter
}
