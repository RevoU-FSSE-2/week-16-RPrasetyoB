"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("./helmet"));
const morgan_1 = __importDefault(require("./morgan"));
const xRequestId_1 = __importDefault(require("./xRequestId"));
const cookiesParser_1 = __importDefault(require("./cookiesParser"));
// import corsMiddleware from "./cors";
const middleWares = (app) => {
    (0, helmet_1.default)(app);
    (0, morgan_1.default)(app);
    // corsMiddleware(app)
    app.use(xRequestId_1.default);
    (0, cookiesParser_1.default)(app);
};
exports.default = middleWares;
