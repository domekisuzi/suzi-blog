package cn.domekisuzi.blog.config;

import cn.domekisuzi.blog.model.Module;
import cn.domekisuzi.blog.model.Task;
import cn.domekisuzi.blog.model.Subtask;
import cn.domekisuzi.blog.repository.ModuleRepository;
import cn.domekisuzi.blog.repository.TaskRepository;
import cn.domekisuzi.blog.repository.SubtaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 数据初始化配置
 * 仅在数据库为空时初始化示例数据
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            ModuleRepository moduleRepository,
            TaskRepository taskRepository,
            SubtaskRepository subtaskRepository
    ) {
        return args -> {
            // 如果已有数据，跳过初始化
            if (moduleRepository.count() > 0) {
                System.out.println("✅ 数据库已有数据，跳过初始化");
                return;
            }

            System.out.println("🔄 初始化示例数据...");

            // 创建模块
            Module workModule = createModule("工作", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"/><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/></svg>");
            Module studyModule = createModule("学习", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"/><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"/></svg>");
            Module healthModule = createModule("健康", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\"/></svg>");

            moduleRepository.saveAll(List.of(workModule, studyModule, healthModule));

            // 创建任务
            LocalDateTime now = LocalDateTime.now();
            
            Task task1 = createTask("完成项目报告", "撰写Q2季度项目总结报告", false, "high", workModule, now);
            Task task2 = createTask("学习 TypeScript", "完成TypeScript基础教程", false, "medium", studyModule, now);
            Task task3 = createTask("每日锻炼", "完成30分钟有氧运动", true, "low", healthModule, now);

            taskRepository.saveAll(List.of(task1, task2, task3));

            // 创建子任务
            Subtask sub1 = createSubtask("收集数据", true, task1, now);
            Subtask sub2 = createSubtask("编写草稿", false, task1, now);
            Subtask sub3 = createSubtask("审核修改", false, task1, now);
            Subtask sub4 = createSubtask("学习基础类型", true, task2, now);
            Subtask sub5 = createSubtask("练习泛型", false, task2, now);

            subtaskRepository.saveAll(List.of(sub1, sub2, sub3, sub4, sub5));

            System.out.println("✅ 示例数据初始化完成!");
        };
    }

    private Module createModule(String name, String iconSVG) {
        Module module = new Module();
        module.setId(UUID.randomUUID().toString());
        module.setName(name);
        module.setIconSVG(iconSVG);
        return module;
    }

    private Task createTask(String title, String description, Boolean completed, String priority, Module module, LocalDateTime createdAt) {
        Task task = new Task();
        task.setId(UUID.randomUUID().toString());
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
        subtask.setId(UUID.randomUUID().toString());
        subtask.setTitle(title);
        subtask.setCompleted(completed);
        subtask.setTask(task);
        subtask.setCreatedAt(createdAt);
        return subtask;
    }
}