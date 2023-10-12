"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const role_access_1 = require("../middlewares/role.access");
userRoutes.get('/v1/users', userController_1.getAllUsers);
userRoutes.get('/v1/users/:id', userController_1.getOneUser);
userRoutes.post('/v1/auth/register', userController_1.regUser);
userRoutes.post('/v1/auth/login', userController_1.login);
userRoutes.delete('/v1/users/:id', role_access_1.managerAuth, userController_1.deleteUser);
userRoutes.put('/v1/users/:id', userController_1.update);
exports.default = userRoutes;
