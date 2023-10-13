"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const main_route_1 = __importDefault(require("./routes/main.route"));
const db_connection_1 = require("./config/db/db.connection");
const middlewares_1 = __importDefault(require("./middlewares"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_connection_1.db)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, middlewares_1.default)(app);
app.use(main_route_1.default);
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});
