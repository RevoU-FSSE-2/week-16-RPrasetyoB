"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes = express_1.default.Router();
const user_controller_1 = require("../controllers/user.controller");
const role_access_1 = require("../middlewares/role.access");
userRoutes.get('/v1/users', user_controller_1.getAllUsers);
userRoutes.get('/v1/users/:id', user_controller_1.getOneUser);
userRoutes.post('/v1/auth/register', user_controller_1.regUser);
userRoutes.post('/v1/auth/login', user_controller_1.loginUser);
userRoutes.delete('/v1/users/:id', role_access_1.managerAuth, user_controller_1.deleteUser);
userRoutes.patch('/v1/users/:id', role_access_1.authRole, user_controller_1.updateUser);
exports.default = userRoutes;
