"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const task_route_1 = __importDefault(require("./task.route"));
const routes = express_1.default.Router();
routes.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to RPB rest API'
    });
});
routes.use('/v1', user_route_1.default);
routes.use('/v1', task_route_1.default);
exports.default = routes;
