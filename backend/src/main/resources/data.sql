-- =============================================
-- 初始化示例数据（仅在数据库为空时执行）
-- 更新时间：2026-03-24
-- =============================================

-- 1. 分类数据
INSERT IGNORE INTO categories (id, name, description, color) VALUES 
('cat-001', '工作', '工作相关任务', '#6366f1'),
('cat-002', '学习', '学习计划', '#22c55e'),
('cat-003', '生活', '日常生活', '#f59e0b');

-- 2. 模块数据
INSERT IGNORE INTO modules (id, name, description, status, priority, created_at, updated_at) VALUES 
('mod-001', '前端开发', 'React + TypeScript 前端项目', 'IN_PROGRESS', 'HIGH', NOW(), NOW()),
('mod-002', '后端开发', 'Spring Boot 后端 API', 'IN_PROGRESS', 'HIGH', NOW(), NOW()),
('mod-003', '数据库设计', 'MySQL 数据库设计与优化', 'PENDING', 'MEDIUM', NOW(), NOW()),
('mod-004', 'UI/UX 设计', '用户界面和体验设计', 'COMPLETED', 'MEDIUM', NOW(), NOW());

-- 3. 任务数据
INSERT IGNORE INTO tasks (id, title, description, status, priority, module_id, start_date, end_date, created_at, updated_at, completed) VALUES 
('task-001', '完成登录页面', '实现用户登录功能', 'IN_PROGRESS', 'HIGH', 'mod-001', '2026-03-20', '2026-03-25', NOW(), NOW(), false),
('task-002', 'API 接口开发', '开发 RESTful API', 'PENDING', 'HIGH', 'mod-002', '2026-03-25', '2026-03-30', NOW(), NOW(), false),
('task-003', '数据库表设计', '设计核心业务表结构', 'COMPLETED', 'MEDIUM', 'mod-003', '2026-03-15', '2026-03-18', NOW(), NOW(), true),
('task-004', '首页 Dashboard 开发', '开发数据展示 Dashboard', 'IN_PROGRESS', 'MEDIUM', 'mod-001', '2026-03-22', '2026-03-28', NOW(), NOW(), false),
('task-005', '用户管理模块', '实现用户 CRUD 操作', 'PENDING', 'HIGH', 'mod-002', '2026-03-26', '2026-04-02', NOW(), NOW(), false),
('task-006', '性能优化', '优化页面加载速度', 'PENDING', 'LOW', 'mod-001', '2026-03-28', '2026-04-05', NOW(), NOW(), false);

-- 4. 子任务数据
INSERT IGNORE INTO subtasks (id, title, completed, task_id, created_at, updated_at) VALUES 
('sub-001', '设计登录表单 UI', false, 'task-001', NOW(), NOW()),
('sub-002', '实现表单验证', false, 'task-001', NOW(), NOW()),
('sub-003', '连接后端 API', false, 'task-001', NOW(), NOW()),
('sub-004', '用户控制器', false, 'task-002', NOW(), NOW()),
('sub-005', '任务控制器', false, 'task-002', NOW(), NOW());

-- 5. 目标数据（用于时间线页面）
INSERT IGNORE INTO goals (id, title, description, start_date, end_date, color, progress, type) VALUES 
('goal-001', '完成项目 MVP', '开发并发布项目的最小可行产品', '2026-03-01', '2026-04-30', '#6366f1', 45, 'SHORT_TERM'),
('goal-002', '学习 TypeScript 进阶', '深入理解 TypeScript 的高级类型和泛型', '2026-02-15', '2026-05-15', '#22c55e', 30, 'MEDIUM_TERM'),
('goal-003', '年度阅读计划', '今年阅读 24 本书', '2026-01-01', '2026-12-31', '#f59e0b', 20, 'LONG_TERM'),
('goal-004', '健身目标', '减重 10kg，增肌塑形', '2026-03-15', '2026-08-31', '#ec4899', 0, 'MEDIUM_TERM');

-- 6. 目标 - 任务关联表数据
INSERT IGNORE INTO goal_tasks (goal_id, task_id) VALUES 
('goal-001', 'task-001'),
('goal-001', 'task-002'),
('goal-001', 'task-004'),
('goal-002', 'task-005'),
('goal-002', 'task-006');
