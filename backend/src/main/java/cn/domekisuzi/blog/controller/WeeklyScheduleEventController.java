package cn.domekisuzi.blog.controller;

import cn.domekisuzi.blog.dto.WeeklyScheduleEventDTO;
import cn.domekisuzi.blog.dto.WeeklyScheduleEventUsageStatDTO;
import cn.domekisuzi.blog.service.WeeklyScheduleEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class WeeklyScheduleEventController {

    private final WeeklyScheduleEventService scheduleEventService;

    @GetMapping
    public ResponseEntity<List<WeeklyScheduleEventDTO>> getEvents(@RequestParam(required = false) Integer dayOfWeek) {
        if (dayOfWeek == null) {
            return ResponseEntity.ok(scheduleEventService.getAllEvents());
        }
        return ResponseEntity.ok(scheduleEventService.getEventsByDay(dayOfWeek));
    }

    @GetMapping("/stats")
    public ResponseEntity<List<WeeklyScheduleEventUsageStatDTO>> getStats() {
        return ResponseEntity.ok(scheduleEventService.getUsageStats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeeklyScheduleEventDTO> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(scheduleEventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<WeeklyScheduleEventDTO> createEvent(@RequestBody WeeklyScheduleEventDTO eventDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleEventService.createEvent(eventDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeeklyScheduleEventDTO> updateEvent(@PathVariable String id, @RequestBody WeeklyScheduleEventDTO updates) {
        return ResponseEntity.ok(scheduleEventService.updateEvent(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        scheduleEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
