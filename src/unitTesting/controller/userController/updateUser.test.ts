import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../../../config/schemas/schema';
import { updateUser } from '../../../controllers/userController';

jest.mock('../../../config/schema');
jest.mock('bcrypt');

describe('updateUser', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })
  it('should successfully update a user', async () => {
    const mockUpdatedUser = {
      _id: 'updatedUserId',
      username: 'updatedUser',
      role: 'employee'
    };

    const mockRequest = {
      params: { id: 'mockUserId' },
      body: {
        username: 'updatedUser',
        password: 'newPassword123',
        role: 'employee'
      }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findOne as jest.Mock).mockResolvedValue(null);
    (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    await updateUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: 'mockUserId',
        username: 'updatedUser',
        role: 'employee',
        passwordUpdated: true
      }
    });
  });

  it('should return 404 if user is not found', async () => {
    const mockRequest = {
      params: { id: 'nonExistentUserId' },
      body: {
        username: 'updatedUser',
        password: 'newPassword123',
        role: 'employee'
      }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findOne as jest.Mock).mockResolvedValue(null);

    await updateUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
      data: 'Not found'
    });
  });
});
