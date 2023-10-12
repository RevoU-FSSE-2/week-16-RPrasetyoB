import { Request, Response } from 'express';
import { taskModel } from '../../../config/schemas/schema';
import { getAllTask } from '../../../controllers/taskController'; 

jest.mock('../../../config/schema');

describe('getAllTask', () => {
  it('should return all tasks when successful', async () => {
    const mockTaskData = [{ title: 'Task 1' }, { title: 'Task 2' }];
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (taskModel.find as jest.Mock).mockResolvedValue(mockTaskData);

    await getAllTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "success get all tasks",
      data: mockTaskData
    });
  });

  it('should return an error response when an error occurs', async () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      json: jest.fn()
    } as unknown as Response;

    const mockError = new Error('Mock error');
    (taskModel.find as jest.Mock).mockRejectedValue(mockError);

    await getAllTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "failed to get task"
    });
  });
});
