"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// db.ts
var mysql = require("mysql2/promise");
exports.pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_HOST,
});
