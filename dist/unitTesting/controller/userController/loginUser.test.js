"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../../../config/schema");
const user_controller_1 = require("../../../controllers/user.controller");
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findOne.mockResolvedValue(mockUser);
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue('mockToken');
        await (0, user_controller_1.loginUser)(mockRequest, mockResponse);
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
