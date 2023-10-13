"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessTokenRefresh = exports.resetPassReq = exports.resetPass = exports.logoutUser = exports.update = exports.login = exports.regUser = exports.getOneUser = exports.getAllUsers = void 0;
const schema_1 = require("../config/schemas/schema");
const userService_1 = require("../services/userService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCookie_1 = __importDefault(require("../reusable/getCookie"));
//------ Login user ------
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await (0, userService_1.loginUser)({ username, password });
        if (result.success) {
            res.cookie("accessToken", result.message.accessToken, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true,
                path: '/'
            });
            res.cookie("refreshToken", result.message.refreshToken, {
                maxAge: 1 * 60 * 60 * 1000,
                httpOnly: true,
                path: '/'
            });
            return res.status(200).json({
                success: true,
                message: "Successfully login",
                data: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
//------ Create user ------
const regUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const result = await (0, userService_1.registerUser)({ username, email, password });
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Registration success',
                data: result.message
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.regUser = regUser;
//------ Update Role ------
const update = async (req, res, next) => {
    const tokenCookie = (0, getCookie_1.default)(req);
    try {
        if (!tokenCookie) {
            return res.status(401).json({ success: false, message: "Unauthorized: Missing Token" });
        }
        const decodedToken = jsonwebtoken_1.default.decode(tokenCookie);
        const userRole = decodedToken.role;
        if (userRole !== 'manager') {
            return res.status(403).json({ success: false, message: "Unauthorized: Insufficient Permissions" });
        }
        const { username, role } = req.body;
        const updatedRole = await (0, userService_1.updateRole)({ username, role });
        if (updatedRole.success) {
            return res.status(200).json({ success: true, message: 'Role updated successfully', updatedRole });
        }
        else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
//------ Password reset -------
const resetPassReq = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await (0, userService_1.passResetReq)(email);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Password reset link sent',
                data: result.data,
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassReq = resetPassReq;
const resetPass = async (req, res, next) => {
    try {
        const key = req.query.key;
        const { password } = req.body;
        const result = await (0, userService_1.passwordReset)(key, password);
        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Password reset successful',
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: result.message,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.resetPass = resetPass;
//------ token refresh -------
const accessTokenRefresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: 'No refresh token provided' });
            return;
        }
        const accessToken = await (0, userService_1.refreshAccessToken)(refreshToken);
        if (accessToken) {
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                path: '/',
                maxAge: 15 * 60 * 1000,
            });
            res.json({
                success: true,
                message: 'Access token refreshed successfully'
            });
        }
        else {
            res.status(403).json({ message: 'Invalid refresh token' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.accessTokenRefresh = accessTokenRefresh;
//------ log out ------
const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            path: '/'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            path: '/'
        });
        return res.status(200).json({
            success: true,
            message: 'Successfully logout'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logoutUser = logoutUser;
//------ Get all users ------
const getAllUsers = async (req, res) => {
    try {
        const user = await schema_1.userModel.find({});
        return res.status(200).json({
            success: true,
            message: "success get all user",
            user: user
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "failed to get all users"
        });
    }
};
exports.getAllUsers = getAllUsers;
//------ Get one user by id ------
const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await schema_1.userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "success get user",
            user: user,
        });
    }
    catch (err) {
        console.log('Error get user:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while get the user or userId wrong format'
        });
    }
};
exports.getOneUser = getOneUser;
