package cn.domekisuzi.blog.dto;

import cn.domekisuzi.blog.model.WeeklyScheduleEvent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyScheduleEventDTO extends BaseDTO {
    private String id;
    private String eventDate;
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
                entity.getEventDate() != null ? entity.getEventDate().toString() : null,
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
        LocalDate parsedEventDate = parseDate(this.eventDate);
        if (parsedEventDate != null) {
            entity.setEventDate(parsedEventDate);
        }
        entity.setCategory(this.category);
        if ((entity.getCategory() == null || entity.getCategory().isBlank()) && this.moduleName != null && !this.moduleName.isBlank()) {
            entity.setCategory(this.moduleName);
        }
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

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String text = value.trim();
        int tIndex = text.indexOf('T');
        if (tIndex > 0) {
            text = text.substring(0, tIndex);
        }
        if (text.length() > 10) {
            text = text.substring(0, 10);
        }
        try {
            return LocalDate.parse(text);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("eventDate 格式无效，请使用 yyyy-MM-dd");
        }
    }

    private LocalTime parseTime(String timeText) {
        if (timeText == null || timeText.isBlank()) {
            return null;
        }
        String normalized = normalizeTimeText(timeText);
        if (normalized == null) {
            return null;
        }
        String[] parts = normalized.split(":");
        if (parts.length < 2) {
            return null;
        }
        try {
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);
            if (hour < 0 || hour > 24 || minute < 0 || minute > 59) {
                return null;
            }
            if (hour == 24 && minute == 0) {
                return LocalTime.MIDNIGHT;
            }
            return LocalTime.of(hour, minute);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String normalizeTimeText(String value) {
        String trimmed = value.trim().replace('：', ':');
        int tIndex = trimmed.lastIndexOf('T');
        if (tIndex >= 0 && tIndex < trimmed.length() - 1) {
            trimmed = trimmed.substring(tIndex + 1);
        }
        if (trimmed.contains(" ")) {
            String[] parts = trimmed.trim().split("\\s+");
            trimmed = parts[parts.length - 1];
        }

        java.util.regex.Matcher matcher = Pattern
                .compile("(\\d{1,2}):(\\d{1,2})")
                .matcher(trimmed);
        if (!matcher.find()) {
            return null;
        }
        try {
            int hour = Integer.parseInt(matcher.group(1));
            int minute = Integer.parseInt(matcher.group(2));
            if (hour == 24 && minute == 0) {
                return "24:00";
            }
            if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                return String.format("%02d:%02d", hour, minute);
            }
        } catch (NumberFormatException ex) {
            return null;
        }
        return null;
    }
}
