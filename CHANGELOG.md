# 更新记录

## 2026-03-24 Goal任务绑定功能

### 后端
- `Goal.java` - 添加`tasks`多对多关联
- `Task.java` - 添加`goals`反向关联
- `GoalDTO.java` - 新增`taskIds`、`taskCount`、`completedTaskCount`字段
- `GoalService.java` - 新增`addTasksToGoal`、`removeTasksFromGoal`、`recalculateProgress`
- `GoalServiceImpl.java` - 实现任务绑定与进度自动计算
- `GoalController.java` - 新增API: `POST/DELETE /{id}/tasks`, `POST /{id}/recalculate`

### 前端
- `goalApi.ts` - 新增`addTasksToGoal`、`removeTasksFromGoal`、`recalculateProgress`
- `TimelinePage.tsx` - 添加绑定任务按钮、对话框、任务列表显示

---

## 2026-03-23 快速添加任务功能

### 前端
- `QuickAddTaskDialog.tsx` - 新增快速添加任务对话框组件
- `Layout.tsx` - 顶部添加快速添加按钮
- `taskApi.ts` - 新增快速创建任务API

### 后端
- `TaskController.java` - 新增快速创建任务端点