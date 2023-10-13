"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes = express_1.default.Router();
const userController_1 = require("../controllers/userController");
userRoutes.get('/users', userController_1.getAllUsers);
userRoutes.put('/users', userController_1.update);
userRoutes.post('/reset-req', userController_1.resetPassReq);
userRoutes.post('/reset', userController_1.resetPass);
userRoutes.post('/refresh-token', userController_1.accessTokenRefresh);
exports.default = userRoutes;
