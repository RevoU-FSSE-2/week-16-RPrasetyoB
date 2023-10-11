import { Request, Response } from 'express';
import { taskModel } from '../../../config/schemas/schema';
import { deleteTask } from '../../../controllers/task.controller';

jest.mock('../../../config/schema'); // Mock the task model module

describe('deleteTask', () => {
  it('should successfully delete a task', async () => {
    const mockDeletedTask = { _id: 'deletedTaskId', isDeleted: true, title: 'Deleted Task' };
    const mockRequest = {
      params: { id: 'mockTaskId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockDeletedTask);

    await deleteTask(mockRequest, mockResponse);

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
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (taskModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await deleteTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Task not found'
    });
  });

  it('should return 500 on internal server error', async () => {
    const mockRequest = {
      params: { id: 'mockTaskId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const mockError = new Error('Mock error');
    (taskModel.findByIdAndUpdate as jest.Mock).mockRejectedValue(mockError);

    await deleteTask(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while soft deleting transfer data or TransferId wrong format'
    });
  });
});
