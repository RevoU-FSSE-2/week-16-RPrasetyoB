import { Request, Response } from 'express';
import { taskModel } from '../../../config/schemas/schema';
import { updateTask } from '../../../controllers/task.controller';

jest.mock('../../../config/schema');

type MockRequest = Request & {
  params: { id: string };
  body: { status: string };
  role: string;
};

describe('updateTask', () => {
  let req: MockRequest;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { id: '123' },
      body: { status: 'In progress' },
      role: 'manager'
    } as MockRequest;

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    } as any;
  });

  it('should update task status for manager role', async () => {
    const mockUpdateOne = jest.spyOn(taskModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 } as any);
    await updateTask(req, res);

    expect(mockUpdateOne).toHaveBeenCalledWith({ _id: '123' }, { status: 'In progress' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Successfully updated status',
      data: { status: 'In progress' }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});