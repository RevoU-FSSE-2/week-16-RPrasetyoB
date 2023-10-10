"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_access_1 = require("../middlewares/role.access");
const task_controller_1 = require("../controllers/task.controller");
const taskRoutes = express_1.default.Router();
taskRoutes.get('/v1/tasks', role_access_1.authRole, task_controller_1.getAllTask);
taskRoutes.get('/v1/tasks/:id', role_access_1.authRole, task_controller_1.getOneTask);
taskRoutes.post('/v1/tasks', role_access_1.managerAuth, task_controller_1.createTask);
taskRoutes.patch('/v1/tasks/:id', role_access_1.authRole, task_controller_1.updateTask);
taskRoutes.delete('/v1/tasks/:id', role_access_1.managerAuth, task_controller_1.deleteTask);
exports.default = taskRoutes;
