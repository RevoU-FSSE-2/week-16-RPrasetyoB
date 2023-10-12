"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schemas/schema");
const taskController_1 = require("../../../controllers/taskController");
jest.mock('../../../config/schema');
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('createTask', () => {
    let mockRequest;
    beforeEach(() => {
        mockRequest = {
            body: {
                task: 'Test task'
            }
        };
    });
    it('should create a task and return success response', async () => {
        const mockCreatedTask = { _id: 'testId', task: 'Test task' };
        schema_1.taskModel.create.mockResolvedValueOnce(mockCreatedTask);
        const response = mockResponse();
        await (0, taskController_1.createTask)(mockRequest, response);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({
            success: true,
            message: 'Task registration success',
            data: mockCreatedTask
        });
    });
    it('should handle errors and return error response', async () => {
        const mockError = new Error('Mock error');
        schema_1.taskModel.create.mockRejectedValueOnce(mockError);
        const response = mockResponse();
        await (0, taskController_1.createTask)(mockRequest, response);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({ message: mockError });
    });
});
