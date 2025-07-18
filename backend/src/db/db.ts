// db.ts
import * as mysql from 'mysql2/promise'

// export const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_HOST,
//
// })
export const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password: '000000',
    database: 'blog_system',

})