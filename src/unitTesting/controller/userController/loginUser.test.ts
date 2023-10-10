import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../../../config/schema';
import { loginUser } from '../../../controllers/user.controller'; 

jest.mock('../../../config/schema'); 
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const JWT_Sign = 'mock-secret-key'; 

describe('loginUser', () => {
  it('should successfully log in a user with correct credentials', async () => {
    const mockUser = {
      _id: 'mockUserId',
      username: 'mockUser',
      password: 'hashedPassword123',
      role: 'employee'
    };

    const mockRequest = {
      body: {
        username: 'mockUser',
        password: 'mockPassword123'
      }
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    await loginUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'User successfully logged in',
      user: 'mockUser',
      role: 'employee',
      token: 'mockToken'
    });
  });
});
