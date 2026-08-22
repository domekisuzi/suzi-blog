package cn.domekisuzi.blog.repository;

import cn.domekisuzi.blog.model.WeeklyScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyScheduleEventRepository extends JpaRepository<WeeklyScheduleEvent, String> {

    List<WeeklyScheduleEvent> findByDayOfWeekOrderByStartTimeAsc(Integer dayOfWeek);

    List<WeeklyScheduleEvent> findAllByOrderByDayOfWeekAscStartTimeAsc();
}
