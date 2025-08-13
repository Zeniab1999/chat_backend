"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jwt = require("jsonwebtoken");
class JwtUtil {
    static isValidAuthHeader(authorization) {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false,
        });
        return payload;
    }
}
exports.JwtUtil = JwtUtil;
//# sourceMappingURL=jwt.util.js.map