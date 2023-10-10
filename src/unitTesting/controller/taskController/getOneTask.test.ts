import { Request, Response } from 'express';
import { taskModel } from '../../../config/schema';
import { getOneTask } from '../../../controllers/task.controller';

jest.mock('../../../config/schema');

describe('getOneTask', () => {
  it('should return task when found', async () => {
    const mockTask = { _id: 'mockTaskId', title: 'Mock Task' };
    const mockRequest = {
      params: { id: 'mockTaskId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (taskModel.findById as jest.Mock).mockResolvedValue(mockTask);

    await getOneTask(mockRequest, mockResponse);

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
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (taskModel.findById as jest.Mock).mockResolvedValue(null);

    await getOneTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Task not found"
    });
  });

  it('should return 400 on internal server error', async () => {
    const mockRequest = {
      params: { id: 'mockTaskId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const mockError = new Error('Mock error');
    (taskModel.findById as jest.Mock).mockRejectedValue(mockError);

    await getOneTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server erro while get Task or Task id wrong format"
    });
  });
});
