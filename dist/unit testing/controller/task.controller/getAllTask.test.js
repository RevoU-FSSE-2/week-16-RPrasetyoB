"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schema");
const task_controller_1 = require("../../../controllers/task.controller"); // Import the function you want to test
jest.mock('../../../config/schema'); // Mock the task model module
describe('getAllTask', () => {
    it('should return all tasks when successful', async () => {
        const mockTaskData = [{ title: 'Task 1' }, { title: 'Task 2' }]; // Sample task data
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.taskModel.find.mockResolvedValue(mockTaskData);
        await (0, task_controller_1.getAllTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: "success get all transfer's datas",
            user: mockTaskData
        });
    });
    it('should return an error response when an error occurs', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            sendStatus: jest.fn(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.taskModel.find.mockRejectedValue(mockError);
        await (0, task_controller_1.getAllTask)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: "failed to get transfer's data"
        });
    });
});
