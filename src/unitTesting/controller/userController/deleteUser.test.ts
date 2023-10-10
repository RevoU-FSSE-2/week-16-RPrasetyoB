import { Request, Response } from 'express';
import { userModel } from '../../../config/schema';
import { deleteUser } from '../../../controllers/user.controller'; 

jest.mock('../../../config/schema');

describe('deleteUser', () => {
  it('should successfully delete a user', async () => {
    const mockDeletedUser = {
      _id: 'deletedUserId',
      username: 'deletedUser',
      role: 'employee'
    };
    const mockRequest = {
      params: { id: 'mockUserId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedUser);

    await deleteUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'user deleted successfully',
      data: { id: 'mockUserId' }
    });
  });

  it('should return 404 if user is not found', async () => {
    const mockRequest = {
      params: { id: 'nonExistentUserId' }
    } as unknown as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "failed to delete a user",
      data: "Not found"
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
    (userModel.findByIdAndDelete as jest.Mock).mockRejectedValue(mockError);

    await deleteUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred while deleting the user or userId wrong format'
    });
  });
});
