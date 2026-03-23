package cn.domekisuzi.blog.config;

import cn.domekisuzi.blog.model.Goal;
import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.repository.GoalRepository;
import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * 数据初始化配置
 * 仅在数据库为空时初始化示例数据
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            GoalRepository goalRepository,
            ModuleRepository moduleRepository,
            TaskRepository taskRepository,
            SubtaskRepository subtaskRepository
    ) {
        return args -> {
            // 如果已有数据，跳过初始化
            if (moduleRepository.count() > 0 && goalRepository.count() > 0) {
                System.out.println("✅ 数据库已有数据，跳过初始化");
                return;
            }

            System.out.println("🔄 初始化示例数据...");

            LocalDateTime now = LocalDateTime.now();
            List<Module> modules = new ArrayList<>();
            List<Task> tasks = new ArrayList<>();
            List<Subtask> subtasks = new ArrayList<>();

            // ========== 创建模块 ==========
            
            // 日语模块
            Module japaneseModule = createModule("日语", "最少半年每天3h，做到不用太准备就可以学", "#ef4444");
            modules.add(japaneseModule);
            
            // 英语模块
            Module englishModule = createModule("英语", "目标110分，日常交流水平", "#3b82f6");
            modules.add(englishModule);
            
            // 健身模块
            Module fitnessModule = createModule("健身", "保持健康，规律锻炼", "#22c55e");
            modules.add(fitnessModule);
            
            // 修考模块
            Module examModule = createModule("修考", "8月必须考一次", "#f59e0b");
            modules.add(examModule);
            
            // 工作模块
            Module workModule = createModule("工作", "11月之前找到新工作转职", "#8b5cf6");
            modules.add(workModule);
            
            // 看书模块
            Module readingModule = createModule("看书", "一年计划看多少本，看哪些", "#ec4899");
            modules.add(readingModule);
            
            // LeetCode模块
            Module leetcodeModule = createModule("LeetCode", "1个月 4.7之前完成可否？", "#06b6d4");
            modules.add(leetcodeModule);
            
            // 当老板模块
            Module bossModule = createModule("当老板", "时机未到但是可以观察", "#64748b");
            modules.add(bossModule);

            moduleRepository.saveAll(modules);

            // ========== 创建任务 ==========

            // 日语任务
            Task japaneseTask = createTask("日语学习计划", "每天3h学习，累计15h以上/周\n- 怎么积累想好\n- 不用太准备就可以学", false, "high", japaneseModule, now);
            tasks.add(japaneseTask);
            subtasks.add(createSubtask("制定学习方法", false, japaneseTask, now));
            subtasks.add(createSubtask("每周累计15h", false, japaneseTask, now));
            subtasks.add(createSubtask("日常会话练习", false, japaneseTask, now));

            // 英语任务
            Task englishTask = createTask("英语提升计划", "目标：托福110分，日常交流水平", false, "high", englishModule, now);
            tasks.add(englishTask);
            subtasks.add(createSubtask("背单词", false, englishTask, now));
            subtasks.add(createSubtask("听力练习", false, englishTask, now));
            subtasks.add(createSubtask("口语练习", false, englishTask, now));

            // 健身任务
            Task fitnessTask = createTask("健身计划", "保持规律锻炼，健康生活", false, "medium", fitnessModule, now);
            tasks.add(fitnessTask);
            subtasks.add(createSubtask("每周运动3次", false, fitnessTask, now));
            subtasks.add(createSubtask("控制饮食", false, fitnessTask, now));

            // 修考任务
            Task examTask = createTask("修考准备", "8月必须考一次", false, "high", examModule, now);
            tasks.add(examTask);
            subtasks.add(createSubtask("套磁怎么办", false, examTask, now));
            subtasks.add(createSubtask("专业化准备", false, examTask, now));
            subtasks.add(createSubtask("复习计划", false, examTask, now));

            // 工作任务
            Task workTask = createTask("转职计划", "11月之前找到新工作\n- 这个月先不看工作，4月1号再看", false, "high", workModule, now);
            tasks.add(workTask);
            subtasks.add(createSubtask("简历更新", false, workTask, now));
            subtasks.add(createSubtask("投递准备", false, workTask, now));
            subtasks.add(createSubtask("面试准备", false, workTask, now));
            subtasks.add(createSubtask("4月1日开始行动", false, workTask, now));

            // 看书任务
            Task readingTask = createTask("阅读计划", "一年计划看多少本，看哪些", false, "medium", readingModule, now);
            tasks.add(readingTask);
            subtasks.add(createSubtask("确定书单", false, readingTask, now));
            subtasks.add(createSubtask("每月阅读目标", false, readingTask, now));

            // LeetCode任务
            Task leetcodeTask = createTask("LeetCode刷题", "1个月 4.7之前完成\n- 大量过", false, "high", leetcodeModule, now);
            tasks.add(leetcodeTask);
            subtasks.add(createSubtask("算法基础", false, leetcodeTask, now));
            subtasks.add(createSubtask("数据结构", false, leetcodeTask, now));
            subtasks.add(createSubtask("模拟面试题", false, leetcodeTask, now));

            // 当老板任务
            Task bossTask = createTask("创业观察", "时机未到但是可以观察", false, "low", bossModule, now);
            tasks.add(bossTask);
            subtasks.add(createSubtask("市场观察", false, bossTask, now));
            subtasks.add(createSubtask("人脉积累", false, bossTask, now));

            // ========== 周常任务 ==========
            Task weeklyTask = createTask("周常任务", "每周固定任务\n- 日语累计15h以上\n- 力扣大量过\n- 计划软件完成\n- 月初进行月计划\n- 套磁怎么办\n- 专业化\n- 考虑下衣服", false, "medium", japaneseModule, now);
            tasks.add(weeklyTask);
            subtasks.add(createSubtask("日语累计15h以上", false, weeklyTask, now));
            subtasks.add(createSubtask("力扣大量过", false, weeklyTask, now));
            subtasks.add(createSubtask("计划软件完成", false, weeklyTask, now));
            subtasks.add(createSubtask("月初进行月计划", false, weeklyTask, now));
            subtasks.add(createSubtask("套磁", false, weeklyTask, now));
            subtasks.add(createSubtask("专业化", false, weeklyTask, now));
            subtasks.add(createSubtask("考虑下衣服", false, weeklyTask, now));

            taskRepository.saveAll(tasks);
            subtaskRepository.saveAll(subtasks);

            // ========== 创建目标（Goals） ==========
            List<Goal> goals = new ArrayList<>();
            
            // 短期目标
            Goal goal1 = new Goal();
            goal1.setTitle("完成项目 MVP");
            goal1.setDescription("开发并发布项目的最小可行产品");
            goal1.setStartDate(LocalDate.of(2026, 3, 1));
            goal1.setEndDate(LocalDate.of(2026, 4, 30));
            goal1.setColor("#6366f1");
            goal1.setProgress(45);
            goal1.setType(Goal.GoalType.SHORT_TERM);
            goals.add(goal1);
            
            // 中期目标
            Goal goal2 = new Goal();
            goal2.setTitle("学习 TypeScript 进阶");
            goal2.setDescription("深入理解 TypeScript 的高级类型和泛型");
            goal2.setStartDate(LocalDate.of(2026, 2, 15));
            goal2.setEndDate(LocalDate.of(2026, 5, 15));
            goal2.setColor("#22c55e");
            goal2.setProgress(30);
            goal2.setType(Goal.GoalType.MEDIUM_TERM);
            goals.add(goal2);
            
            // 长期目标
            Goal goal3 = new Goal();
            goal3.setTitle("年度阅读计划");
            goal3.setDescription("今年阅读 24 本书");
            goal3.setStartDate(LocalDate.of(2026, 1, 1));
            goal3.setEndDate(LocalDate.of(2026, 12, 31));
            goal3.setColor("#f59e0b");
            goal3.setProgress(20);
            goal3.setType(Goal.GoalType.LONG_TERM);
            goals.add(goal3);
            
            // 健身目标
            Goal goal4 = new Goal();
            goal4.setTitle("健身目标");
            goal4.setDescription("减重 10kg，增肌塑形");
            goal4.setStartDate(LocalDate.of(2026, 3, 15));
            goal4.setEndDate(LocalDate.of(2026, 8, 31));
            goal4.setColor("#ec4899");
            goal4.setProgress(0);
            goal4.setType(Goal.GoalType.MEDIUM_TERM);
            goals.add(goal4);
            
            goalRepository.saveAll(goals);

            // ========== 绑定任务到目标 ==========
            // 获取所有任务
            List<Task> allTasks = taskRepository.findAll();
            
            // 为 goal1 绑定任务（完成项目 MVP）
            if (goals.size() > 0 && allTasks.size() > 0) {
                Goal mvpGoal = goals.get(0);
                Set<Task> mvpTasks = new HashSet<>();
                // 绑定前 3 个任务到 MVP 目标
                for (int i = 0; i < Math.min(3, allTasks.size()); i++) {
                    mvpTasks.add(allTasks.get(i));
                }
                mvpGoal.setTasks(mvpTasks);
                goalRepository.save(mvpGoal);
            }

            int goalCount = (int) goalRepository.count();
            System.out.println("✅ 示例数据初始化完成！创建了 " + modules.size() + " 个模块，" + tasks.size() + " 个任务，" + subtasks.size() + " 个子任务，" + goalCount + " 个目标");
        };
    }

    private Module createModule(String name, String description, String color) {
        Module module = new Module();
        // 不手动设置ID，让JPA自动生成
        module.setName(name);
        module.setDescription(description);
        module.setColor(color);
        return module;
    }

    private Task createTask(String title, String description, Boolean completed, String priority, Module module, LocalDateTime createdAt) {
        Task task = new Task();
        // 不手动设置ID，让JPA自动生成
        task.setTitle(title);
        task.setDescription(description);
        task.setCompleted(completed);
        task.setPriority(priority);
        task.setModule(module);
        task.setCreatedAt(createdAt);
        return task;
    }

    private Subtask createSubtask(String title, Boolean completed, Task task, LocalDateTime createdAt) {
        Subtask subtask = new Subtask();
        // 不手动设置ID，让JPA自动生成
        subtask.setTitle(title);
        subtask.setCompleted(completed);
        subtask.setTask(task);
        subtask.setCreatedAt(createdAt);
        return subtask;
    }
}