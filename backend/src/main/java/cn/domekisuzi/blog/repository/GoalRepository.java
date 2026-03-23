package cn.domekisuzi.blog.repository;

import cn.domekisuzi.blog.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, String> {
    
    // 查找进行中的目标（当前日期在开始和结束日期之间）
    List<Goal> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate start, LocalDate end);
    
    // 按类型查找目标
    List<Goal> findByType(Goal.GoalType type);
    
    // 查找长期目标
    List<Goal> findByTypeOrderByStartDateAsc(Goal.GoalType type);
    
    // 查找指定日期范围内重叠的目标
    List<Goal> findByEndDateGreaterThanEqualAndStartDateLessThanEqual(LocalDate rangeStart, LocalDate rangeEnd);
}