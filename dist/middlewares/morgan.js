"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const morganApp = (app) => {
    app.use((0, morgan_1.default)('combined', { stream: fs_1.default.createWriteStream('./logging.log', { flags: 'a' }) }));
    app.use((0, morgan_1.default)('dev'));
};
exports.default = morganApp;
