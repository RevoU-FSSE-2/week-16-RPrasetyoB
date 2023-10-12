"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schemas/schema");
const userController_1 = require("../../../controllers/userController");
jest.mock('../../../config/schema');
describe('getAllUsers', () => {
    it('should return all users when successful', async () => {
        const mockUserData = [{ name: 'User 1' }, { name: 'User 2' }];
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.find.mockResolvedValue(mockUserData);
        await (0, userController_1.getAllUsers)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: "success get all user",
            user: mockUserData
        });
    });
    it('should return an error response when an error occurs', async () => {
        const mockRequest = {};
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            sendStatus: jest.fn(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.userModel.find.mockRejectedValue(mockError);
        await (0, userController_1.getAllUsers)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: "failed to get all users"
        });
    });
});
