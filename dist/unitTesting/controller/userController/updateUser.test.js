"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("../../../config/schemas/schema");
const userController_1 = require("../../../controllers/userController");
jest.mock('../../../config/schema');
jest.mock('bcrypt');
describe('updateUser', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findOne.mockResolvedValue(null);
        schema_1.userModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser);
        bcrypt_1.default.hash.mockResolvedValue('hashedPassword');
        await (0, userController_1.updateUser)(mockRequest, mockResponse);
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findOne.mockResolvedValue(null);
        await (0, userController_1.updateUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'User not found',
            data: 'Not found'
        });
    });
});
