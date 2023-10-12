"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(error, req, res, next) {
    const status = error.status || 500;
    const message = error.message || 'An error occurred';
    const success = error.success || false;
    res.status(status).json({ success, message });
}
exports.default = errorHandler;
