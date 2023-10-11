import { Request, Response } from 'express';
import { taskModel } from '../../../config/schemas/schema';
import { createTask } from '../../../controllers/task.controller';

jest.mock('../../../config/schema');

const mockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('createTask', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      body: {
        task: 'Test task'
      }
    };
  });

  it('should create a task and return success response', async () => {
    const mockCreatedTask = { _id: 'testId', task: 'Test task' };
    (taskModel.create as jest.Mock).mockResolvedValueOnce(mockCreatedTask);

    const response = mockResponse();

    await createTask(mockRequest as Request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      message: 'Task registration success',
      data: mockCreatedTask
    });
  });

  it('should handle errors and return error response', async () => {
    const mockError = new Error('Mock error');
    (taskModel.create as jest.Mock).mockRejectedValueOnce(mockError);

    const response = mockResponse();

    await createTask(mockRequest as Request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ message: mockError });
  });
});
