import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authRole } from '../../middlewares/role.access';

jest.mock('jsonwebtoken');

describe('authRole middleware', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
  const mockRequest = {
    headers: {
      authorization: 'Bearer mockToken'
    }
  } as unknown as Request;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;

  const mockNext = jest.fn() as unknown as NextFunction;

  it('should allow access for manager role', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({
      userId: 'mockUserId',
      role: 'manager'
    });

    await authRole(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should allow access for employee role', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({
      userId: 'mockUserId',
      role: 'employee'
    });

    await authRole(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should deny access for invalid roles', async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({
      userId: 'mockUserId',
      role: 'invalidRole'
    });
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await authRole(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle token verification error', async () => {
    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Token verification error');
    });
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await authRole(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'An error occurred while get authorize'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
