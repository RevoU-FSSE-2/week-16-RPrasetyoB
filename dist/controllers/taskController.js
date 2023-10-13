"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAllTask = exports.createTask = void 0;
const schema_1 = require("../config/schemas/schema");
const taskService_1 = require("../services/taskService");
const getCookie_1 = __importDefault(require("../reusable/getCookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//------ getTasks ------
const getAllTask = async (req, res) => {
    const tokenCookie = (0, getCookie_1.default)(req);
    const decodedToken = jsonwebtoken_1.default.decode(tokenCookie);
    const userRole = decodedToken.role;
    try {
        if (userRole === "manager") {
            const task = await (0, taskService_1.getMakerTasks)();
            return res.status(200).json({
                success: true,
                message: "Successfully fetched all tasks",
                data: task,
            });
        }
        else {
            const username = decodedToken.username;
            const task = await (0, taskService_1.getMakerTasks)(username);
            return res.status(200).json({
                success: true,
                message: "Successfully fetched tasks for the user",
                data: task,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get tasks",
        });
    }
};
exports.getAllTask = getAllTask;
const createTask = async (req, res) => {
    const tokenCookie = (0, getCookie_1.default)(req);
    const decodedToken = jsonwebtoken_1.default.decode(tokenCookie);
    const username = decodedToken.username;
    try {
        const { task } = req.body;
        const newTask = await schema_1.taskModel.create({ task, maker: username });
        return res.status(200).json({
            success: true,
            message: "Task registration success",
            data: newTask,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const tokenCookie = (0, getCookie_1.default)(req);
    const decodedToken = jsonwebtoken_1.default.decode(tokenCookie);
    const username = decodedToken.username;
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedStatus = await (0, taskService_1.updateMakerTasks)(id, status, username);
        if (updatedStatus.success) {
            return res.status(200).json({
                success: true,
                message: "Successfully updated status",
                data: {
                    status: status,
                },
            });
        }
        else {
            return res.status(updatedStatus.status).json({
                success: false,
                message: updatedStatus.message,
            });
        }
    }
    catch (err) {
        console.log("Error updating status:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the status",
        });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const tokenCookie = (0, getCookie_1.default)(req);
    const decodedToken = jsonwebtoken_1.default.decode(tokenCookie);
    const username = decodedToken.username;
    try {
        const { id } = req.params;
        const task = await schema_1.taskModel.findOne({ _id: id });
        if (task && task.maker === username) {
            const deletedTask = await (0, taskService_1.deleteMakerTasks)(id, username);
            if (deletedTask.status = 200) {
                return res.status(200).json({
                    success: true,
                    message: "Task deleted successfully",
                    data: deletedTask,
                });
            }
            else {
                return res.status(deletedTask.status).json({
                    success: false,
                    message: 'Failed deteted task',
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this task",
            });
        }
    }
    catch (err) {
        console.log("Error deleting task:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the task",
        });
    }
};
exports.deleteTask = deleteTask;
