import { Request, Response } from 'express';
import { userModel } from '../../../config/schemas/schema';
import { getAllUsers } from '../../../controllers/userController';

jest.mock('../../../config/schema');

describe('getAllUsers', () => {
  it('should return all users when successful', async () => {
    const mockUserData = [{ name: 'User 1' }, { name: 'User 2' }];
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.find as jest.Mock).mockResolvedValue(mockUserData);

    await getAllUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "success get all user",
      user: mockUserData
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
    (userModel.find as jest.Mock).mockRejectedValue(mockError);

    await getAllUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "failed to get all users"
    });
  });
});
