"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const origin = [
    "https://week15-rpb-x.netlify.app",
    "https://week-15-rprasetyob-production.up.railway.app"
];
const partnerOrigin = [
    "https://week15-rpb-y.netlify.app"
];
const corsOptions = (req, callback) => {
    const clientOrigin = origin.includes(req.header("Origin"));
    const clientPartnerOrigin = partnerOrigin.includes(req.header("Origin"));
    if (clientOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST, DELETE, PUT, OPTIONS, HEAD'
        });
    }
    else if (clientPartnerOrigin) {
        callback(null, {
            origin: true,
            methods: 'GET, POST'
        });
    }
    else {
        callback(new Error('Not allowed by CORS'));
    }
};
const corsMiddleware = (app) => {
    app.use((0, cors_1.default)(corsOptions));
};
exports.default = corsMiddleware;
