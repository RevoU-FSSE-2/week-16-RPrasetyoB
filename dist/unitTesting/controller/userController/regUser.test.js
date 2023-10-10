"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("../../../config/schema");
const user_controller_1 = require("../../../controllers/user.controller");
jest.mock('../../../config/schema');
jest.mock('bcrypt');
describe('regUser', () => {
    it('should successfully register a new user', async () => {
        const mockRequest = {
            body: {
                username: 'mockUser',
                password: 'mockPassword123',
                role: 'employee'
            }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findOne.mockResolvedValue(null);
        bcrypt_1.default.hash.mockResolvedValue('hashedPassword');
        schema_1.userModel.create.mockResolvedValue({
            _id: 'newUserId',
            username: 'mockUser',
            role: 'employee'
        });
        await (0, user_controller_1.regUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Registration success',
            data: {
                _id: 'newUserId',
                username: 'mockUser',
                role: 'employee'
            }
        });
    });
});
