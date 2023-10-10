"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schema");
const user_controller_1 = require("../../../controllers/user.controller");
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findByIdAndDelete.mockResolvedValue(mockDeletedUser);
        await (0, user_controller_1.deleteUser)(mockRequest, mockResponse);
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        schema_1.userModel.findByIdAndDelete.mockResolvedValue(null);
        await (0, user_controller_1.deleteUser)(mockRequest, mockResponse);
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
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockError = new Error('Mock error');
        schema_1.userModel.findByIdAndDelete.mockRejectedValue(mockError);
        await (0, user_controller_1.deleteUser)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'An error occurred while deleting the user or userId wrong format'
        });
    });
});
