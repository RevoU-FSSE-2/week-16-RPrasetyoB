"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandlerMiddleware = (err, res) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        errors: err.errors,
    });
};
exports.default = errorHandlerMiddleware;
