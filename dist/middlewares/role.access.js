"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerAuth = exports.authRole = void 0;
const jwt_1 = require("../config/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRole = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized' });
    }
    else {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, jwt_1.JWT_Sign);
            req.role = decodedToken.role;
            if (decodedToken.role === 'manager' || decodedToken.role === 'employee') {
                next();
            }
            else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        }
        catch (error) {
            console.log('Error updating user:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while get authorize'
            });
        }
    }
};
exports.authRole = authRole;
const managerAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized' });
    }
    else {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, jwt_1.JWT_Sign);
            if (decodedToken.role === 'manager') {
                next();
            }
            else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        }
        catch (error) {
            console.log('Error updating user:', error);
            return res.status(500).json({
                success: false,
                message: 'An error occurred while get authorize'
            });
        }
    }
};
exports.managerAuth = managerAuth;
