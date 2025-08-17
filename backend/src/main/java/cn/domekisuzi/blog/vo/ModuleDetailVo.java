package cn.domekisuzi.blog.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModuleDetailVo {
    
    private String id;

    private String name;

    private Integer taskNumber;

    private Integer subtaskNumber;

    private String completedRate;

    private Integer completedSubtaskNumber;

    private Integer completedTaskNumber;

    private String iconSVG;

    private String dueDate;
 
    
    public ModuleDetailVo( String id,
    Integer taskNumber,
    Integer completedTaskNumber,
    Integer subtaskNumber,
    Integer completedSubtaskNumber,
    String iconSVG, 
    String name )    //this must match the order with sql
    {  
        this.id = id;
        this.name = name;
        this.taskNumber = taskNumber;
        this.subtaskNumber = subtaskNumber;
        this.completedTaskNumber = completedTaskNumber;
        this.completedSubtaskNumber = completedSubtaskNumber;
        this.iconSVG = iconSVG;
        this.completedRate = (taskNumber + subtaskNumber) == 0 ? "0" :  String.format("%.2f", (float)(completedTaskNumber + completedSubtaskNumber) / (taskNumber + subtaskNumber) * 100);
    }
}
