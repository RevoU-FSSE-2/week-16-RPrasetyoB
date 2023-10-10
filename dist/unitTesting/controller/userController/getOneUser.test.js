"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schema");
const user_controller_1 = require("../../../controllers/user.controller");
jest.mock('../../../config/schema');
describe('getOneUser', () => {
    it('should return user when found', async () => {
        const mockUserData = { name: 'Mock User' };
        const mockRequest = {
            params: { id: 'mockUserId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findById.mockResolvedValue(mockUserData);
        await (0, user_controller_1.getOneUser)(mockRequest, mockResponse);
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findById.mockResolvedValue(null);
        await (0, user_controller_1.getOneUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "user not found"
        });
    });
    it('should return 500 on internal server error', async () => {
        const mockRequest = {
            params: { id: 'mockUserId' }
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.userModel.findById.mockRejectedValue(mockError);
        await (0, user_controller_1.getOneUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while get the user or userId wrong format'
        });
    });
});
