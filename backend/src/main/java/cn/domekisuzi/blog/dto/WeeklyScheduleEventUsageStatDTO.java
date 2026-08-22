package cn.domekisuzi.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyScheduleEventUsageStatDTO {
    private String moduleId;
    private String moduleName;
    private long totalMinutes;
    private int totalEvents;
    private double totalHours;
}

