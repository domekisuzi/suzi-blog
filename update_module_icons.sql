-- 更新现有模块的 icon_svg 数据
-- 执行方式：在 MySQL 客户端中运行此脚本

UPDATE modules SET icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#6366f1" stroke="#fff" d="M18 6h18a2 2 0 0 1 2 2v36a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V12l8-6Z"/><path stroke="#fff" stroke-linecap="round" d="m14 16l8 6-8 6m10 4h8"/></g></svg>' WHERE name = '前端开发';

UPDATE modules SET icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#10b981" stroke="#fff" d="M24 4l14 8v24l-14 8-14-8V12l14-8z"/><path stroke="#fff" stroke-linecap="round" d="M24 24v16m0-16l14-8m-14 8L10 16"/></g></svg>' WHERE name = '后端开发';

UPDATE modules SET icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke-linejoin="round" stroke-width="4"><ellipse cx="24" cy="12" rx="18" ry="6" fill="#f59e0b" stroke="#fff"/><path stroke="#fff" stroke-linecap="round" d="M6 12v12c0 3 4 6 9 7.5M42 12v12c0 3-4 6-9 7.5M6 24v12c0 3 4 6 9 7.5M42 24v12c0 3-4 6-9 7.5"/><path stroke="#fff" stroke-linecap="round" d="M15 31.5c5 1.5 13 1.5 18 0M15 19.5c5 1.5 13 1.5 18 0"/></g></svg>' WHERE name = '数据库设计';

UPDATE modules SET icon_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#ec4899" stroke="#fff" d="M24 4C12 4 8 14 8 20c0 8 6 16 16 24 10-8 16-16 16-24 0-6-4-16-16-16z"/><circle cx="24" cy="20" r="6" fill="#fff"/></g></svg>' WHERE name = 'UI/UX 设计';

-- 查看更新结果
SELECT id, name, icon_svg IS NOT NULL AS has_icon FROM modules;
