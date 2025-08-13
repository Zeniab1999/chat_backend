"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsAuthMiddleware = void 0;
const jwt = require("jsonwebtoken");
const wsAuthMiddleware = (usersService) => {
    return async (socket, next) => {
        try {
            const { authorization } = socket.handshake.headers;
            if (!authorization) {
                throw new Error('No authorization token provided.');
            }
            const token = authorization.split(' ')[1];
            console.log('token', token);
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await usersService.findOne(payload.sub);
            if (!user) {
                throw new Error('User not found.');
            }
            socket.data.user = user;
            next();
        }
        catch (error) {
            console.error('WebSocket Authentication Error:', error.message);
            socket.disconnect(true);
            next(new Error('Authentication failed: ' + error.message));
        }
    };
};
exports.wsAuthMiddleware = wsAuthMiddleware;
//# sourceMappingURL=ws-auth.middleware.js.map