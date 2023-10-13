"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMakerTasks = exports.updateMakerTasks = exports.getMakerTasks = void 0;
const schema_1 = require("../config/schemas/schema");
const errorCatch_1 = __importDefault(require("../reusable/errorCatch"));
//------ get tasks ------
const getMakerTasks = async (username) => {
    try {
        const query = username
            ? { maker: username, isDeleted: { $exists: false } }
            : { isDeleted: { $exists: false } };
        const tasks = await schema_1.taskModel.find(query);
        return {
            success: true,
            status: 200,
            message: username
                ? "Successfully fetched tasks"
                : "Successfully fetched all tasks",
            data: tasks,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
};
exports.getMakerTasks = getMakerTasks;
// ------ update task ------
const updateMakerTasks = async (id, status, maker) => {
    try {
        const task = await schema_1.taskModel.findOne({ _id: id, maker: maker });
        if (!task) {
            return {
                success: false,
                status: 404,
                message: "Task not found or you do not have permission to update it",
                data: null,
            };
        }
        await schema_1.taskModel.updateOne({ _id: id }, { status: status });
        return {
            success: true,
            status: 200,
            message: "Successfully updated task",
            data: task,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
};
exports.updateMakerTasks = updateMakerTasks;
const deleteMakerTasks = async (id, maker) => {
    try {
        const task = await schema_1.taskModel.findOne({ _id: id, maker: maker });
        if (!task) {
            return {
                success: false,
                status: 404,
                message: "Task not found or you do not have permission to delete it",
                data: null,
            };
        }
        const deletedTask = await schema_1.taskModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        return {
            status: 200,
            data: deletedTask,
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: 500,
        });
    }
};
exports.deleteMakerTasks = deleteMakerTasks;
