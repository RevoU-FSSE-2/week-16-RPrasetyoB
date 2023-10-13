"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passResetReq = exports.updateRole = exports.registerUser = exports.loginUser = void 0;
const schema_1 = require("../config/schemas/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const date_fns_1 = require("date-fns");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_1 = require("../config/auth/jwt");
;
const node_cache_1 = __importDefault(require("node-cache"));
const errorCatch_1 = __importDefault(require("../errors/errorCatch"));
const uuid_1 = require("uuid");
const failedLogins = new node_cache_1.default({ stdTTL: 20 });
const cache = new node_cache_1.default({ stdTTL: 60 });
//------ login ------
const loginUser = async ({ username, password }) => {
    try {
        const user = await schema_1.userModel.findOne({ username });
        const loginAttempts = failedLogins.get(user === null || user === void 0 ? void 0 : user.username) || 0;
        console.log('loginAttempts', loginAttempts);
        if (loginAttempts >= 4) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Too many failed login attempts. please try again later',
                status: 429
            });
        }
        if (!user) {
            failedLogins.set(username, loginAttempts + 1);
            throw new errorCatch_1.default({
                success: false,
                message: 'Username or Password invalid',
                status: 401
            });
        }
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (isPasswordCorrect) {
            const accessTokenExpired = (0, date_fns_1.addDays)(new Date(), 1);
            const accessToken = (0, jsonwebtoken_1.sign)({
                username: user.username,
                id: user._id,
                role: user.role
            }, jwt_1.JWT_Sign, { expiresIn: '24h' });
            const refreshTokenPayload = {
                username: user.username,
                id: user._id,
                role: user.role,
            };
            const refreshToken = (0, jsonwebtoken_1.sign)(refreshTokenPayload, jwt_1.JWT_Sign, {
                expiresIn: '7d',
            });
            await failedLogins.del(username);
            return {
                success: true,
                message: {
                    accessToken,
                    refreshToken,
                    accessTokenExpired
                },
            };
        }
        else {
            failedLogins.set(username, loginAttempts + 1);
            throw new errorCatch_1.default({
                success: false,
                message: 'Username or Password invalid',
                status: 401
            });
        }
    }
    catch (error) {
        console.log(error);
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: error.status
        });
    }
};
exports.loginUser = loginUser;
//------ register ------
const registerUser = async ({ username, email, password }) => {
    try {
        if (!username) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Username cannot be empty',
                status: 400
            });
        }
        if (password.length < 8) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Password must be at least 8 characters long',
                status: 400
            });
        }
        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Password must contain both alphabetic and numeric characters',
                status: 400
            });
        }
        const existUser = await schema_1.userModel.findOne({ username });
        if (existUser) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Username already exists',
                status: 409
            });
        }
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        const newUser = await schema_1.userModel.create({ username, email, password: hashedPass });
        return {
            success: true,
            message: newUser
        };
    }
    catch (error) {
        console.log(error);
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: error.status
        });
    }
};
exports.registerUser = registerUser;
//------ update user role ------
const updateRole = async ({ _id, role }) => {
    try {
        const response = await schema_1.userModel.findByIdAndUpdate(_id, { role: role });
        if (response) {
            return {
                success: true,
                message: response
            };
        }
        else {
            throw new Error("User not found");
        }
    }
    catch (error) {
        console.log(error);
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: error.status,
        });
    }
};
exports.updateRole = updateRole;
//------ password reset request ------
const passResetReq = async (email) => {
    try {
        const user = await schema_1.userModel.findOne({ email: email });
        if (!user) {
            throw new errorCatch_1.default({
                success: false,
                message: 'Email not registered',
                status: 404,
            });
        }
        const key = (0, uuid_1.v4)();
        cache.set(key, email, 25 * 1000);
        return {
            success: true,
            message: "Password reset link sent",
            data: key
        };
    }
    catch (error) {
        throw new errorCatch_1.default({
            success: false,
            message: error.message,
            status: error.status,
        });
    }
};
exports.passResetReq = passResetReq;
