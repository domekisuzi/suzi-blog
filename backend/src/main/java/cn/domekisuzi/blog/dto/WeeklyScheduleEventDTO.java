package cn.domekisuzi.blog.dto;

import cn.domekisuzi.blog.model.WeeklyScheduleEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyScheduleEventDTO extends BaseDTO {
    private String id;
    private String title;
    private String category;
    private String moduleId;
    private String moduleName;
    private Integer dayOfWeek;
    private String startTime;
    private String endTime;
    private String note;
    private String color;
    private String createdAt;
    private String updatedAt;

    public static WeeklyScheduleEventDTO fromEntity(WeeklyScheduleEvent entity) {
        if (entity == null) {
            return null;
        }

        return new WeeklyScheduleEventDTO(
                entity.getId(),
                entity.getTitle(),
                entity.getCategory(),
                entity.getModuleId(),
                entity.getCategory(),
                entity.getDayOfWeek(),
                entity.getStartTime() != null ? entity.getStartTime().toString() : null,
                entity.getEndTime() != null ? entity.getEndTime().toString() : null,
                entity.getNote(),
                entity.getColor(),
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null,
                entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null
        );
    }

    public WeeklyScheduleEvent toEntity() {
        WeeklyScheduleEvent entity = new WeeklyScheduleEvent();
        entity.setId(this.id);
        entity.setTitle(this.title);
        entity.setCategory(this.category);
        entity.setModuleId(this.moduleId);
        entity.setDayOfWeek(this.dayOfWeek);
        entity.setStartTime(parseTime(this.startTime));
        entity.setEndTime(parseTime(this.endTime));
        entity.setNote(this.note);
        entity.setColor(this.color);

        if (this.createdAt != null && !this.createdAt.isBlank()) {
            entity.setCreatedAt(LocalDateTime.parse(this.createdAt));
        }
        if (this.updatedAt != null && !this.updatedAt.isBlank()) {
            entity.setUpdatedAt(LocalDateTime.parse(this.updatedAt));
        }

        return entity;
    }

    private LocalTime parseTime(String timeText) {
        if (timeText == null || timeText.isBlank()) {
            return null;
        }

        if (timeText.length() > 5) {
            return LocalTime.parse(timeText.substring(0, 5));
        }
        return LocalTime.parse(timeText);
    }
}
