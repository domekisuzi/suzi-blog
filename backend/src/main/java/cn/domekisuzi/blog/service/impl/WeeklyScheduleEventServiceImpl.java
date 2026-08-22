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

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WeeklyScheduleEventServiceImpl implements WeeklyScheduleEventService {

    private final WeeklyScheduleEventRepository repository;
    private final ModuleRepository moduleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<WeeklyScheduleEventDTO> getAllEvents() {
        return repository.findAllByOrderByDayOfWeekAscStartTimeAsc().stream()
                .map(WeeklyScheduleEventDTO::fromEntity)
                .collect(Collectors.toList());
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
            long durationMinutes = Duration.between(event.getStartTime(), event.getEndTime()).toMinutes();
            if (durationMinutes < 0) {
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
        Module module = fetchModule(eventDTO.getModuleId());
        event.setModuleId(module.getId());
        event.setCategory(module.getName());
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
        Module module = fetchModule(updates.getModuleId());
        existing.setModuleId(module.getId());
        existing.setCategory(module.getName());
        existing.setTitle(updates.getTitle());
        existing.setDayOfWeek(updates.getDayOfWeek());
        existing.setStartTime(parseTime(updates.getStartTime()));
        existing.setEndTime(parseTime(updates.getEndTime()));
        existing.setNote(updates.getNote());
        existing.setColor(
                updates.getColor() == null || updates.getColor().isBlank()
                        ? defaultColorForCategory(module.getName())
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
            throw new IllegalArgumentException("moduleId 不能为空");
        }
        dto.setModuleId(dto.getModuleId().trim());
        validateDayOfWeek(dto.getDayOfWeek());
        LocalTime start = parseTime(dto.getStartTime());
        LocalTime end = parseTime(dto.getEndTime());
        if (start == null) {
            throw new IllegalArgumentException("startTime 不能为空（推荐格式 HH:mm）");
        }
        if (end == null) {
            throw new IllegalArgumentException("endTime 不能为空（推荐格式 HH:mm）");
        }
        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("endTime 必须大于 startTime");
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
        if (value.length() > 5) {
            return LocalTime.parse(value.substring(0, 5));
        }
        return LocalTime.parse(value);
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

    private Module fetchModule(String moduleId) {
        return moduleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("模块不存在: " + moduleId));
    }
}
