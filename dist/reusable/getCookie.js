"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCookie = (req) => {
    return req.cookies['accessToken'];
};
exports.default = getCookie;
