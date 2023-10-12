"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const db_config_1 = __importDefault(require("./db.config"));
const mongoose_1 = __importDefault(require("mongoose"));
// DB Local
// mongoose.connect('mongodb://127.0.0.1:27017/week10',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   } as mongoose.ConnectOptions
// );
// DB Atlas
mongoose_1.default.connect(`mongodb+srv://${db_config_1.default.username}:${db_config_1.default.password}@${db_config_1.default.cluster}.mongodb.net/${db_config_1.default.dbname}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const dbConnect = mongoose_1.default.connection;
const db = () => {
    dbConnect.on('error', console.error.bind(console, 'connection error: '));
    dbConnect.once('open', function () {
        console.log('Connected to database');
    });
};
exports.db = db;
