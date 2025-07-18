import { pool } from '../db/db'
import { Request, Response } from 'express'

// 获取所有任务
export async function getAll(req:Request, res:Response) {
    const conn = await pool.getConnection()
    try {
        const [tasks] = await conn.query<any[]>('SELECT * FROM tasks')
        const result = []

        for (const task of tasks) {
            const [subs] = await conn.query('SELECT * FROM subtasks WHERE task_id = ?', [task.id])
            result.push({ ...task, subtasks: subs })
        }
        res.json(result)
    } catch (err) {
        const error = err as Error
        res.status(500).send(error.message)
    } finally {
        conn.release()
    }
}

function formatForSQL(datetime: string): string {
    return datetime.slice(0, 19).replace('T', ' ')
}

// 创建任务（含子任务）   bug
export async function create(req:Request, res:Response) {
    const { id, title, description, completed, priority, dueDate, createdAt, updatedAt, module, category, subtasks } = req.body
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        await conn.query(
            `INSERT INTO tasks (id, title, description, completed, priority, due_date, created_at, updated_at, module_id, category_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, title, description, completed, priority, dueDate, createdAt, updatedAt, module?.id, category?.id]
        )
        for (const sub of subtasks || []) {
            await conn.query(
                `INSERT INTO subtasks (id, title, completed, created_at, updated_at, task_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [sub.id, sub.title, sub.completed, formatForSQL(new Date().toISOString()) , formatForSQL(new Date().toISOString()), id]
            )
        }
        await conn.commit()
        res.status(201).json({ id })
    } catch (err) {
        await conn.rollback()
        const error = err as Error
        res.status(500).send(error.message)
    } finally {
        conn.release()
    }
}

// 更新任务
export async function update(req:Request, res:Response) {
    const id = req.params.id
    const update = req.body
    const fields = Object.keys(update)
    const values = Object.values(update)
    const sql = `UPDATE tasks SET ${fields.map(k => `${k}=?`).join(', ')} WHERE id=?`
    try {
        await pool.query(sql, [...values, id])
        res.json({ message: 'updated' })
    } catch (err) {
        const error = err as Error
        res.status(500).send(error.message)
    }
}

// 删除任务
export async function remove(req:Request, res:Response) {
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id])
        res.json({ message: 'deleted' })
    } catch (err) {
        const error = err as Error
        res.status(500).send(error.message)
    }
}
