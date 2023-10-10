"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const role_access_1 = require("../../middlewares/role.access");
jest.mock('jsonwebtoken');
describe('authRole middleware', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const mockRequest = {
        headers: {
            authorization: 'Bearer mockToken'
        }
    };
    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const mockNext = jest.fn();
    it('should allow access for manager role', async () => {
        jsonwebtoken_1.default.verify.mockReturnValueOnce({
            userId: 'mockUserId',
            role: 'manager'
        });
        await (0, role_access_1.authRole)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
    });
    it('should allow access for employee role', async () => {
        jsonwebtoken_1.default.verify.mockReturnValueOnce({
            userId: 'mockUserId',
            role: 'employee'
        });
        await (0, role_access_1.authRole)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
    });
    it('should deny access for invalid roles', async () => {
        jsonwebtoken_1.default.verify.mockReturnValueOnce({
            userId: 'mockUserId',
            role: 'invalidRole'
        });
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await (0, role_access_1.authRole)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
        expect(mockNext).not.toHaveBeenCalled();
    });
    it('should handle token verification error', async () => {
        jsonwebtoken_1.default.verify.mockImplementationOnce(() => {
            throw new Error('Token verification error');
        });
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await (0, role_access_1.authRole)(mockRequest, mockResponse, mockNext);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: 'An error occurred while get authorize'
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
