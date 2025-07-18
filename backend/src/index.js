"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var tasks_1 = require("./routes/tasks");
var dotenv = require("dotenv");
dotenv.config();
var app = (0, express_1.default)();
// ✅ 配置 CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // 或部署后的前端地址，也可用 "*" 允许所有
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}));
// ✅ 解析 JSON 请求体
app.use(body_parser_1.default.json());
// ✅ 注册路由
app.use('/api/tasks', tasks_1.default);
// ✅ 启动服务
var PORT = 3001;
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 \u540E\u7AEF\u670D\u52A1\u542F\u52A8\u6210\u529F\uFF1Ahttp://localhost:".concat(PORT));
});
