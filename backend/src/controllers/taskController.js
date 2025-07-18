"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.create = create;
exports.update = update;
exports.remove = remove;
var db_1 = require("../db/db");
// 获取所有任务
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var conn, tasks, result, _i, tasks_1, task, subs, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.pool.getConnection()];
                case 1:
                    conn = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, 9, 10]);
                    return [4 /*yield*/, conn.query('SELECT * FROM tasks')];
                case 3:
                    tasks = (_a.sent())[0];
                    result = [];
                    _i = 0, tasks_1 = tasks;
                    _a.label = 4;
                case 4:
                    if (!(_i < tasks_1.length)) return [3 /*break*/, 7];
                    task = tasks_1[_i];
                    return [4 /*yield*/, conn.query('SELECT * FROM subtasks WHERE task_id = ?', [task.id])];
                case 5:
                    subs = (_a.sent())[0];
                    result.push(__assign(__assign({}, task), { subtasks: subs }));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    res.json(result);
                    return [3 /*break*/, 10];
                case 8:
                    err_1 = _a.sent();
                    res.status(500).send(err_1.message);
                    return [3 /*break*/, 10];
                case 9:
                    conn.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// 创建任务（含子任务）
function create(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, title, description, completed, priority, dueDate, createdAt, updatedAt, module, category, subtasks, conn, _i, _b, sub, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, id = _a.id, title = _a.title, description = _a.description, completed = _a.completed, priority = _a.priority, dueDate = _a.dueDate, createdAt = _a.createdAt, updatedAt = _a.updatedAt, module = _a.module, category = _a.category, subtasks = _a.subtasks;
                    return [4 /*yield*/, db_1.pool.getConnection()];
                case 1:
                    conn = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 10, 12, 13]);
                    return [4 /*yield*/, conn.beginTransaction()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, conn.query("INSERT INTO tasks (id, title, description, completed, priority, due_date, created_at, updated_at, module_id, category_id)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [id, title, description, completed, priority, dueDate, createdAt, updatedAt, module === null || module === void 0 ? void 0 : module.id, category === null || category === void 0 ? void 0 : category.id])];
                case 4:
                    _c.sent();
                    _i = 0, _b = subtasks || [];
                    _c.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    sub = _b[_i];
                    return [4 /*yield*/, conn.query("INSERT INTO subtasks (id, title, completed, created_at, updated_at, task_id)\n         VALUES (?, ?, ?, ?, ?, ?)", [sub.id, sub.title, sub.completed, sub.createdAt, sub.updatedAt, id])];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, conn.commit()];
                case 9:
                    _c.sent();
                    res.status(201).json({ id: id });
                    return [3 /*break*/, 13];
                case 10:
                    err_2 = _c.sent();
                    return [4 /*yield*/, conn.rollback()];
                case 11:
                    _c.sent();
                    res.status(500).send(err_2.message);
                    return [3 /*break*/, 13];
                case 12:
                    conn.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// 更新任务
function update(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, update, fields, values, sql, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    update = req.body;
                    fields = Object.keys(update);
                    values = Object.values(update);
                    sql = "UPDATE tasks SET ".concat(fields.map(function (k) { return "".concat(k, "=?"); }).join(', '), " WHERE id=?");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db_1.pool.query(sql, __spreadArray(__spreadArray([], values, true), [id], false))];
                case 2:
                    _a.sent();
                    res.json({ message: 'updated' });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    res.status(500).send(err_3.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 删除任务
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id])];
                case 1:
                    _a.sent();
                    res.json({ message: 'deleted' });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    res.status(500).send(err_4.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
