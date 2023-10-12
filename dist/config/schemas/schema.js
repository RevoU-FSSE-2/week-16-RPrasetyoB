"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: '',
        enum: ['manager', 'leader', 'member', '']
    }
}, {
    versionKey: false
});
exports.userModel = mongoose_1.default.model('users', userSchema);
const taskSchema = new mongoose_1.default.Schema({
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Not started",
        enum: ['Not started', 'In progress', 'In review', 'Done / Approved', 'Need revision/ Rejected']
    },
    isDeleted: {
        type: Boolean
    }
}, {
    timestamps: {
        currentTime: () => new Date().setUTCHours(0, 0, 0, 0)
    },
    versionKey: false
});
exports.taskModel = mongoose_1.default.model("tasks", taskSchema);
