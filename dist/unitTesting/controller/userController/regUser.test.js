"use strict";
// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import { userModel } from '../../../config/schemas/schema';
// import { regUser } from '../../../controllers/userController';
// jest.mock('../../../config/schema');
// jest.mock('bcrypt');
// describe('regUser', () => {
//   it('should successfully register a new user', async () => {
//     const mockRequest = {
//       body: {
//         username: 'mockUser',
//         password: 'mockPassword123',
//         role: 'employee'
//       }
//     } as unknown as Request;
//     const mockResponse = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn()
//     } as unknown as Response;
//     (userModel.findOne as jest.Mock).mockResolvedValue(null);
//     (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
//     (userModel.create as jest.Mock).mockResolvedValue({
//       _id: 'newUserId',
//       username: 'mockUser',
//       role: 'employee'
//     });
//     await regUser(mockRequest, mockResponse);
//     expect(mockResponse.status).toHaveBeenCalledWith(200);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       success: true,
//       message: 'Registration success',
//       data: {
//         _id: 'newUserId',
//         username: 'mockUser',
//         role: 'employee'
//       }
//     });
//   });
// });
