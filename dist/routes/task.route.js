"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const taskRoutes = express_1.default.Router();
taskRoutes.get('/tasks', taskController_1.getAllTask);
taskRoutes.post('/tasks', taskController_1.createTask);
taskRoutes.put('/tasks/:id', taskController_1.updateTask);
taskRoutes.delete('/tasks/:id', taskController_1.deleteTask);
exports.default = taskRoutes;
