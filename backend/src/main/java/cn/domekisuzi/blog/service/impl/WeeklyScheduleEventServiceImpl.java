package cn.domekisuzi.blog.service.impl;

import cn.domekisuzi.blog.dto.WeeklyScheduleEventDTO;
import cn.domekisuzi.blog.dto.WeeklyScheduleEventUsageStatDTO;
import cn.domekisuzi.blog.model.WeeklyScheduleEvent;
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.repository.WeeklyScheduleEventRepository;
import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.service.WeeklyScheduleEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
public class WeeklyScheduleEventServiceImpl implements WeeklyScheduleEventService {

    private final WeeklyScheduleEventRepository repository;
    private final ModuleRepository moduleRepository;

    @Override
    public List<WeeklyScheduleEventDTO> getAllEvents() {
        List<WeeklyScheduleEvent> events = repository.findAll();
        List<WeeklyScheduleEvent> repairedEvents = new ArrayList<>();
        for (WeeklyScheduleEvent event : events) {
            if (event.getEventDate() == null) {
                LocalDate fixedDate = resolveLegacyEventDate(event);
                event.setEventDate(fixedDate);
                event.setDayOfWeek(toDayOfWeek(fixedDate));
                event.setUpdatedAt(LocalDateTime.now());
                repairedEvents.add(event);
            }
        }
        if (!repairedEvents.isEmpty()) {
            repository.saveAll(repairedEvents);
        }

        return events.stream()
                .sorted(Comparator
                        .comparing((WeeklyScheduleEvent e) -> e.getEventDate() == null ? LocalDate.MAX : e.getEventDate())
                        .thenComparing(e -> e.getDayOfWeek() == null ? 0 : e.getDayOfWeek())
                        .thenComparing(e -> e.getStartTime() == null ? LocalTime.MIN : e.getStartTime()))
                .map(WeeklyScheduleEventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private LocalDate resolveLegacyEventDate(WeeklyScheduleEvent event) {
        LocalDate anchorDate = event.getCreatedAt() == null
                ? LocalDate.now()
                : event.getCreatedAt().toLocalDate();
        Integer dayOfWeek = event.getDayOfWeek();
        if (dayOfWeek == null || dayOfWeek < 0 || dayOfWeek > 6) {
            return anchorDate;
        }
        LocalDate monday = anchorDate.minusDays(toDayOfWeek(anchorDate));
        return monday.plusDays(dayOfWeek);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeeklyScheduleEventDTO> getEventsByDay(Integer dayOfWeek) {
        validateDayOfWeek(dayOfWeek);
        return repository.findByDayOfWeekOrderByStartTimeAsc(dayOfWeek).stream()
                .map(WeeklyScheduleEventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WeeklyScheduleEventUsageStatDTO> getUsageStats() {
        List<WeeklyScheduleEvent> events = repository.findAll();
        Map<String, WeeklyScheduleEventUsageStatDTO> grouped = new LinkedHashMap<>();

        for (WeeklyScheduleEvent event : events) {
            if (event == null || event.getStartTime() == null || event.getEndTime() == null) {
                continue;
            }
            long durationMinutes = calculateMinutesSpan(event.getStartTime(), event.getEndTime());
            if (durationMinutes < 0) {
                durationMinutes += 24 * 60;
            }
            if (durationMinutes <= 0) {
                continue;
            }
            String moduleId = event.getModuleId() == null ? "" : event.getModuleId();
            String moduleName = Optional.ofNullable(event.getCategory())
                    .filter(name -> !name.isBlank())
                    .orElse("未关联");
            String key = moduleId + "||" + moduleName;
            WeeklyScheduleEventUsageStatDTO stat = grouped.get(key);
            if (stat == null) {
                stat = new WeeklyScheduleEventUsageStatDTO(moduleId, moduleName, 0L, 0, 0D);
                grouped.put(key, stat);
            }
            stat.setTotalMinutes(stat.getTotalMinutes() + durationMinutes);
            stat.setTotalEvents(stat.getTotalEvents() + 1);
            stat.setTotalHours(Math.round(stat.getTotalMinutes() * 1.0 / 60 * 100.0) / 100.0);
        }

        return grouped.values().stream()
                .sorted(Comparator.comparingLong(WeeklyScheduleEventUsageStatDTO::getTotalMinutes).reversed())
                .collect(Collectors.toList());
    }

    private long calculateMinutesSpan(LocalTime startTime, LocalTime endTime) {
        if (startTime == null || endTime == null) {
            return 0;
        }
        long start = startTime.getHour() * 60L + startTime.getMinute();
        long end = endTime.getHour() * 60L + endTime.getMinute();
        if (start == end) {
            return 0;
        }
        long span = end > start ? end - start : 24 * 60 - start + end;
        if (end > start && start / 60 == end / 60 && endTime.getMinute() == 59) {
            long expanded = span + 1;
            return Math.min(expanded, 24 * 60 - start);
        }
        return span;
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyScheduleEventDTO getEventById(String id) {
        WeeklyScheduleEvent event = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule event not found: " + id));
        return WeeklyScheduleEventDTO.fromEntity(event);
    }

    @Override
    public WeeklyScheduleEventDTO createEvent(WeeklyScheduleEventDTO eventDTO) {
        validateScheduleEvent(eventDTO);
        WeeklyScheduleEvent event = eventDTO.toEntity();
        LocalDate eventDate = parseEventDate(eventDTO.getEventDate());
        Module module = resolveModule(eventDTO.getModuleId());
        event.setModuleId(module == null ? null : module.getId());
        event.setCategory(module == null ? normalizeCategory(eventDTO.getCategory()) : module.getName());
        event.setEventDate(eventDate);
        event.setDayOfWeek(toDayOfWeek(eventDate));
        event.setId(null);
        if (event.getColor() == null || event.getColor().isBlank()) {
            event.setColor(defaultColorForCategory(event.getCategory()));
        }
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        WeeklyScheduleEvent saved = repository.save(event);
        return WeeklyScheduleEventDTO.fromEntity(saved);
    }

    @Override
    public WeeklyScheduleEventDTO updateEvent(String id, WeeklyScheduleEventDTO updates) {
        WeeklyScheduleEvent existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule event not found: " + id));

        validateScheduleEvent(updates);
        Module module = resolveModule(updates.getModuleId());
        LocalDate eventDate = parseEventDate(updates.getEventDate());
        existing.setModuleId(module == null ? null : module.getId());
        existing.setCategory(module == null ? normalizeCategory(updates.getCategory()) : module.getName());
        existing.setEventDate(eventDate);
        existing.setDayOfWeek(toDayOfWeek(eventDate));
        existing.setTitle(updates.getTitle());
        existing.setStartTime(parseTime(updates.getStartTime()));
        existing.setEndTime(parseTime(updates.getEndTime()));
        existing.setNote(updates.getNote());
        existing.setColor(
                updates.getColor() == null || updates.getColor().isBlank()
                        ? defaultColorForCategory(existing.getCategory())
                        : updates.getColor()
        );
        existing.setUpdatedAt(LocalDateTime.now());

        WeeklyScheduleEvent saved = repository.save(existing);
        return WeeklyScheduleEventDTO.fromEntity(saved);
    }

    @Override
    public void deleteEvent(String id) {
        WeeklyScheduleEvent event = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Schedule event not found: " + id));
        repository.delete(event);
    }

    private void validateScheduleEvent(WeeklyScheduleEventDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Schedule event payload is empty");
        }
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("title 不能为空");
        }
        dto.setTitle(dto.getTitle().trim());
        if (dto.getModuleId() == null || dto.getModuleId().isBlank()) {
            dto.setModuleId(null);
        } else {
            dto.setModuleId(dto.getModuleId().trim());
        }
        if (dto.getEventDate() == null || dto.getEventDate().isBlank()) {
            throw new IllegalArgumentException("eventDate 不能为空");
        }
        LocalDate eventDate;
        try {
            eventDate = parseEventDate(dto.getEventDate());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("eventDate 格式无效");
        }
        if (dto.getDayOfWeek() == null) {
            dto.setDayOfWeek(toDayOfWeek(eventDate));
        } else {
            validateDayOfWeek(dto.getDayOfWeek());
        }
        LocalTime start = parseTime(dto.getStartTime());
        LocalTime end = parseTime(dto.getEndTime());
        if (start == null) {
            throw new IllegalArgumentException("startTime 不能为空（推荐格式 HH:mm）");
        }
        if (end == null) {
            throw new IllegalArgumentException("endTime 不能为空（推荐格式 HH:mm）");
        }
        if (start.equals(end)) {
            throw new IllegalArgumentException("endTime 不能与 startTime 相同");
        }
    }

    private void validateDayOfWeek(Integer dayOfWeek) {
        if (dayOfWeek == null || dayOfWeek < 0 || dayOfWeek > 6) {
            throw new IllegalArgumentException("dayOfWeek 必须是 0-6 的整数（0=周一）");
        }
    }

    private LocalTime parseTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = normalizeTimeText(value);
        if (normalized == null) {
            return null;
        }
        try {
            String[] timeParts = normalized.split(":");
            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);
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

    private String defaultColorForCategory(String category) {
        if (category == null) {
            return "#6366f1";
        }
        switch (category) {
            case "工作": return "#6366f1";
            case "学习": return "#0ea5e9";
            case "开会": return "#f59e0b";
            case "健身": return "#10b981";
            case "生活": return "#14b8a6";
            case "复盘": return "#a855f7";
            default: return "#64748b";
        }
    }

    private Module resolveModule(String moduleId) {
        if (moduleId == null || moduleId.isBlank()) {
            return null;
        }
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("模块不存在: " + moduleId));
    }

    private String normalizeCategory(String category) {
        return category == null || category.isBlank() ? "未分类" : category.trim();
    }

    private LocalDate parseEventDate(String eventDate) {
        if (eventDate == null || eventDate.isBlank()) {
            throw new IllegalArgumentException("eventDate 不能为空");
        }

        String normalized = eventDate.trim();
        int tIndex = normalized.indexOf('T');
        if (tIndex > 0) {
            normalized = normalized.substring(0, tIndex);
        }
        if (normalized.length() > 10) {
            normalized = normalized.substring(0, 10);
        }

        try {
            return LocalDate.parse(normalized);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("eventDate 格式无效，请使用 yyyy-MM-dd");
        }
    }

    private Integer toDayOfWeek(LocalDate eventDate) {
        if (eventDate == null) {
            return 0;
        }
        DayOfWeek day = eventDate.getDayOfWeek();
        return (day.getValue() + 6) % 7;
    }

}
