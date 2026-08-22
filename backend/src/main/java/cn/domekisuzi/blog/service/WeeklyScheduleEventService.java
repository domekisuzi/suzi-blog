package cn.domekisuzi.blog.service;

import cn.domekisuzi.blog.dto.WeeklyScheduleEventDTO;
import cn.domekisuzi.blog.dto.WeeklyScheduleEventUsageStatDTO;

import java.util.List;

public interface WeeklyScheduleEventService {
    List<WeeklyScheduleEventDTO> getAllEvents();
    List<WeeklyScheduleEventDTO> getEventsByDay(Integer dayOfWeek);
    WeeklyScheduleEventDTO getEventById(String id);
    WeeklyScheduleEventDTO createEvent(WeeklyScheduleEventDTO eventDTO);
    WeeklyScheduleEventDTO updateEvent(String id, WeeklyScheduleEventDTO updates);
    void deleteEvent(String id);
    List<WeeklyScheduleEventUsageStatDTO> getUsageStats();
}
