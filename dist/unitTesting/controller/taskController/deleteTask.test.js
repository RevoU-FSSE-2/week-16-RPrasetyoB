"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schemas/schema");
const taskController_1 = require("../../../controllers/taskController");
jest.mock('../../../config/schema'); // Mock the task model module
describe('deleteTask', () => {
    it('should successfully delete a task', async () => {
        const mockDeletedTask = { _id: 'deletedTaskId', isDeleted: true, title: 'Deleted Task' };
        const mockRequest = {
            params: { id: 'mockTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.taskModel.findByIdAndUpdate.mockResolvedValue(mockDeletedTask);
        await (0, taskController_1.deleteTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Task deleted successfully',
            data: mockDeletedTask
        });
    });
    it('should return 404 if task is not found', async () => {
        const mockRequest = {
            params: { id: 'nonExistentTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.taskModel.findByIdAndUpdate.mockResolvedValue(null);
        await (0, taskController_1.deleteTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'Task not found'
        });
    });
    it('should return 500 on internal server error', async () => {
        const mockRequest = {
            params: { id: 'mockTaskId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.taskModel.findByIdAndUpdate.mockRejectedValue(mockError);
        await (0, taskController_1.deleteTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while soft deleting transfer data or TransferId wrong format'
        });
    });
});
