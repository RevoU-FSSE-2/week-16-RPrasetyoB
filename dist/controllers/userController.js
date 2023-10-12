"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.update = exports.updateUser = exports.deleteUser = exports.login = exports.regUser = exports.getOneUser = exports.getAllUsers = void 0;
const schema_1 = require("../config/schemas/schema");
const userService_1 = require("../services/userService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/auth/jwt");
//------ Login user ------
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await (0, userService_1.loginUser)({ username, password });
        if (result.success) {
            res.cookie("accessToken", result.message.accessToken, {
                maxAge: (7 * 60 * 60 * 1000) + (10 * 60 * 1000),
                httpOnly: true,
                path: '/'
            });
            res.cookie("refreshToken", result.message.refreshToken, {
                maxAge: (7 + 24) * 60 * 60 * 1000,
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
const update = async (req, res, next) => {
    try {
        const { role } = req.body;
        const token = req.cookies.accessToken;
        if (!token) {
            throw new Error("You are unauthorized");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwt_1.JWT_Sign);
        const userId = decodedToken.id;
        const updatedRole = await (0, userService_1.updateRole)({ _id: userId, role: role });
        if (updatedRole === null || updatedRole === void 0 ? void 0 : updatedRole.success) {
            res.status(200).json({
                success: true,
                message: 'Update role success',
                data: updatedRole
            });
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
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
//------ Update user ------
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const { username, password, role } = updates;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username cannot be empty"
            });
        }
        const existingUser = await schema_1.userModel.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }
        if (role !== "employee") {
            return res.status(400).json({
                success: false,
                message: "Possible role only Employee"
            });
        }
        if (password && password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }
        if (password && !/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain both alphabetic and numeric characters"
            });
        }
        if (password) {
            updates.password = await bcrypt_1.default.hash(updates.password, 10);
        }
        const updatedUser = await schema_1.userModel.findByIdAndUpdate(userId, updates, { new: true });
        if (updatedUser) {
            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: {
                    _id: userId,
                    username,
                    role,
                    passwordUpdated: !!password,
                }
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: 'Not found'
            });
        }
    }
    catch (error) {
        console.log('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating the user or userId wrong format'
        });
    }
};
exports.updateUser = updateUser;
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
//------ Delete user ------
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await schema_1.userModel.findByIdAndDelete(id);
        if (deletedUser) {
            return res.status(201).json({
                success: true,
                message: 'user deleted successfully',
                data: { id }
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "failed to delete a user",
                data: "Not found"
            });
        }
    }
    catch (error) {
        console.log('Error delete user:', error);
        return res.status(500).json({
            message: 'An error occurred while deleting the user or userId wrong format'
        });
    }
};
exports.deleteUser = deleteUser;
