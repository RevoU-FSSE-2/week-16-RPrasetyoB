"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.getOneTask = exports.updateTask = exports.getAllTask = exports.createTask = void 0;
const schema_1 = require("../config/schemas/schema");
const getAllTask = async (req, res) => {
    try {
        const task = await schema_1.taskModel.find({ isDeleted: { $exists: false } });
        return res.status(200).json({
            success: true,
            message: "success get all tasks",
            data: task
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "failed to get task"
        });
    }
};
exports.getAllTask = getAllTask;
const getOneTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await schema_1.taskModel.findById(id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "success get task",
            user: task,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Internal server erro while get Task or Task id wrong format"
        });
    }
};
exports.getOneTask = getOneTask;
const createTask = async (req, res) => {
    try {
        const { task } = req.body;
        const newTask = await schema_1.taskModel.create({ task });
        return res.status(200).json({
            success: true,
            message: "Task registration success",
            data: newTask
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedStatus = await schema_1.taskModel.updateOne({ _id: id }, { status: status });
        if (updatedStatus.modifiedCount > 0) {
            return res.status(200).json({
                success: true,
                message: 'Successfully updated status',
                data: {
                    status: status
                }
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'No update status found for the provided ID'
            });
        }
    }
    catch (err) {
        console.log('Error updating status:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the status or TransferId wrong format'
        });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await schema_1.taskModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true });
        if (deletedTask) {
            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
                data: deletedTask
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
    }
    catch (err) {
        console.log('Error soft deleting transfer:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while soft deleting transfer data or TransferId wrong format'
        });
    }
};
exports.deleteTask = deleteTask;
