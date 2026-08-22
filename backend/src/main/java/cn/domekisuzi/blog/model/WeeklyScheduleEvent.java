package cn.domekisuzi.blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@Builder
@Table(name = "weekly_schedule_events", indexes = {
        @Index(name = "idx_weekly_schedule_events_day", columnList = "day_of_week"),
        @Index(name = "idx_weekly_schedule_events_weekday_start", columnList = "day_of_week,start_time"),
        @Index(name = "idx_weekly_schedule_events_category", columnList = "category"),
        @Index(name = "idx_weekly_schedule_events_module", columnList = "module_id")
})
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class WeeklyScheduleEvent extends BaseEntity {

    @Id
    private String id;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "module_id", length = 36)
    private String moduleId;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "note", length = 500)
    private String note;

    @Column(name = "color", nullable = false, length = 24)
    private String color;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
