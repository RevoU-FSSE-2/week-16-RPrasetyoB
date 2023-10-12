"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_access_1 = require("../middlewares/role.access");
const taskController_1 = require("../controllers/taskController");
const taskRoutes = express_1.default.Router();
taskRoutes.get('/tasks', role_access_1.authRole, taskController_1.getAllTask);
taskRoutes.get('/tasks/:id', role_access_1.authRole, taskController_1.getOneTask);
taskRoutes.post('/tasks', role_access_1.managerAuth, taskController_1.createTask);
taskRoutes.patch('/tasks/:id', role_access_1.authRole, taskController_1.updateTask);
taskRoutes.delete('/tasks/:id', role_access_1.managerAuth, taskController_1.deleteTask);
exports.default = taskRoutes;
