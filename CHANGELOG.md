# 📋 项目更新日志

---

## 2026.03.23

### UI 重构 (下午)
```
├── 全新设计风格
│   ├── 渐变背景: 紫色渐变主背景
│   ├── 毛玻璃效果: 内容区域 backdrop-filter
│   ├── 深色侧边栏: 半透明深色主题
│   └── 卡片渐变: 多彩渐变模块卡片
├── 重构组件
│   ├── Header.tsx: 搜索栏、快速添加、通知、主题切换
│   ├── Layout.tsx: 渐变背景 + 毛玻璃内容区
│   ├── Sidebar.tsx: 深色主题、折叠菜单、快速添加
│   ├── ModulePage.tsx: 搜索、排序、视图切换
│   └── ModuleDetailCard.tsx: 渐变卡片、进度条
├── 技术改进
│   ├── 修复 MUI v6 Grid API 兼容问题
│   ├── Module 模型添加 createdAt/taskNumber/completedRate
│   └── 响应式布局适配
└── 截图保存: new-ui-modules.png
```

### 初始配置 (上午)
```
├── 配置本地开发环境
│   ├── 添加 localStorage 本地存储模式
│   ├── 配置 MySQL 数据库连接 (密码: 000000)
│   └── 创建数据初始化脚本
├── 重构 API 层
│   └── 统一 API 适配器，支持环境切换
├── 新增数据模型
│   ├── Goal (大目标) - 年度/月度/长期
│   ├── Milestone (里程碑) - 关键节点
│   └── Todo (日常待办) - 日/周任务
├── 初始化你的目标数据
│   ├── 日语学习、英语、健身、修考
│   ├── 转职、阅读计划、LeetCode、当老板
│   └── 里程碑：简历更新、投递、面试准备
├── 修复编译错误
│   ├── 修复 taskTypes.ts 类型导入问题
│   ├── 修复 APIUtils.ts 适配器返回类型
│   ├── 修复 moduleApi.ts API调用
│   └── 修复 ModuleDetailCard.tsx 样式属性
├── 修复 CSS 样式问题
│   └── Sidebar.tsx: kebab-case → camelCase
│       ├── 'flex-grow' → flexGrow
│       ├── 'overflow-y' → overflowY
│       ├── 'scroll-behavior' → scrollBehavior
│       └── 'scrollbar-width' → scrollbarWidth
└── 优化 ModuleDetailCard 样式
    └── 设置固定宽度200px、高度140px
```

---

## 数据结构说明

### 当前结构
```
Module (模块/分类) → Task (任务) → Subtask (子任务)
```

### 规划结构
```
Goal (大目标)          - 年度/月度/长期目标
├── Milestone (里程碑)  - 关键节点
└── Task (任务)        - 具体执行项

Todo (日常待办)        - 日/周任务，独立存在