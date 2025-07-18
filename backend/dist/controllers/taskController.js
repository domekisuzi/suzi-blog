"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.create = create;
exports.update = update;
exports.remove = remove;
const db_1 = require("../db/db");
// 获取所有任务
async function getAll(req, res) {
    const conn = await db_1.pool.getConnection();
    try {
        const [tasks] = await conn.query('SELECT * FROM tasks');
        const result = [];
        for (const task of tasks) {
            const [subs] = await conn.query('SELECT * FROM subtasks WHERE task_id = ?', [task.id]);
            result.push({ ...task, subtasks: subs });
        }
        res.json(result);
    }
    catch (err) {
        const error = err;
        res.status(500).send(error.message);
    }
    finally {
        conn.release();
    }
}
function formatForSQL(datetime) {
    return datetime.slice(0, 19).replace('T', ' ');
}
// 创建任务（含子任务）   bug
async function create(req, res) {
    const { id, title, description, completed, priority, dueDate, createdAt, updatedAt, module, category, subtasks } = req.body;
    const conn = await db_1.pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query(`INSERT INTO tasks (id, title, description, completed, priority, due_date, created_at, updated_at, module_id, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, title, description, completed, priority, dueDate, createdAt, updatedAt, module?.id, category?.id]);
        for (const sub of subtasks || []) {
            await conn.query(`INSERT INTO subtasks (id, title, completed, created_at, updated_at, task_id)
         VALUES (?, ?, ?, ?, ?, ?)`, [sub.id, sub.title, sub.completed, formatForSQL(new Date().toISOString()), formatForSQL(new Date().toISOString()), id]);
        }
        await conn.commit();
        res.status(201).json({ id });
    }
    catch (err) {
        await conn.rollback();
        const error = err;
        res.status(500).send(error.message);
    }
    finally {
        conn.release();
    }
}
// 更新任务
async function update(req, res) {
    const id = req.params.id;
    const update = req.body;
    const fields = Object.keys(update);
    const values = Object.values(update);
    const sql = `UPDATE tasks SET ${fields.map(k => `${k}=?`).join(', ')} WHERE id=?`;
    try {
        await db_1.pool.query(sql, [...values, id]);
        res.json({ message: 'updated' });
    }
    catch (err) {
        const error = err;
        res.status(500).send(error.message);
    }
}
// 删除任务
async function remove(req, res) {
    try {
        await db_1.pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ message: 'deleted' });
    }
    catch (err) {
        const error = err;
        res.status(500).send(error.message);
    }
}
