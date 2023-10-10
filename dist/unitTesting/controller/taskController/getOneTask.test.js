"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schema");
const task_controller_1 = require("../../../controllers/task.controller");
jest.mock('../../../config/schema');
describe('getOneTask', () => {
    it('should return task when found', async () => {
        const mockTask = { _id: 'mockTaskId', title: 'Mock Task' };
        const mockRequest = {
            params: { id: 'mockTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.taskModel.findById.mockResolvedValue(mockTask);
        await (0, task_controller_1.getOneTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: "success get task",
            user: mockTask
        });
    });
    it('should return 404 when task not found', async () => {
        const mockRequest = {
            params: { id: 'nonExistentTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.taskModel.findById.mockResolvedValue(null);
        await (0, task_controller_1.getOneTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Task not found"
        });
    });
    it('should return 400 on internal server error', async () => {
        const mockRequest = {
            params: { id: 'mockTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.taskModel.findById.mockRejectedValue(mockError);
        await (0, task_controller_1.getOneTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server erro while get Task or Task id wrong format"
        });
    });
});
