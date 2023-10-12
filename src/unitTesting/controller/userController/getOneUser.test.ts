import { Request, Response } from 'express';
import { userModel } from '../../../config/schemas/schema';
import { getOneUser } from '../../../controllers/userController';

jest.mock('../../../config/schema');

describe('getOneUser', () => {
  it('should return user when found', async () => {
    const mockUserData = { name: 'Mock User' };
    const mockRequest = {
      params: { id: 'mockUserId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findById as jest.Mock).mockResolvedValue(mockUserData);

    await getOneUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "success get user",
      user: mockUserData
    });
  });

  it('should return 404 when user not found', async () => {
    const mockRequest = {
      params: { id: 'nonExistentUserId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findById as jest.Mock).mockResolvedValue(null);

    await getOneUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "user not found"
    });
  });

  it('should return 500 on internal server error', async () => {
    const mockRequest = {
      params: { id: 'mockUserId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const mockError = new Error('Mock error');
    (userModel.findById as jest.Mock).mockRejectedValue(mockError);

    await getOneUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while get the user or userId wrong format'
    });
  });
});
