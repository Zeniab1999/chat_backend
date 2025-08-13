"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chats_service_1 = require("./chats.service");
const ws_jwt_auth_guard_1 = require("../config/guard/ws-jwt-auth.guard");
const use_guards_decorator_1 = require("@nestjs/common/decorators/core/use-guards.decorator");
const ws_auth_middleware_1 = require("../config/middleware/ws-auth.middleware");
const users_service_1 = require("../users/users.service");
const common_1 = require("@nestjs/common");
const create_chat_dto_1 = require("./dto/create-chat.dto");
let ChatsGateway = class ChatsGateway {
    constructor(appService, usersService) {
        this.appService = appService;
        this.usersService = usersService;
    }
    afterInit() {
        this.appService.setServer(this.server);
        this.server.use((0, ws_auth_middleware_1.wsAuthMiddleware)(this.usersService));
    }
    handleConnection(socket) {
        const user = socket.data.user;
        if (user._id) {
            this.appService.addUserToMap(user._id, socket.id);
        }
        console.log(user);
        console.log(`✅ User connected: ${user?.name} (${socket.id})`);
    }
    handleDisconnect(socket) {
        const user = socket.data.user;
        console.log(`❌ User disconnected: ${user?.name} (${socket.id})`);
        this.appService.deleteUserFromMap[user._id];
        this.server.emit('user_left', user?.name);
    }
    async handleChatMessage(socket, data) {
        const user = socket.data.user;
        this.server
            .to(this.appService.getUserFromMap(data.receiver_id))
            .emit('chat_message', data);
        await this.appService.sendMessage({
            content: data.content,
            receiver_id: data.receiver_id,
            sender_id: user._id,
        });
    }
    handleTyping(socket, data) {
        try {
            const user = socket.data.user;
            let recipient;
            if (data.room_id) {
                recipient = data.room_id;
            }
            else if (data.receiver_id) {
                recipient = data.receiver_id;
            }
            if (recipient) {
                socket
                    .to(data.receiver_id
                    ? this.appService.getUserFromMap(recipient)
                    : data.room_id)
                    .emit('typing', { user_name: user?.name, message: 'typing...' });
            }
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleJoinRoom(socket, data) {
        try {
            const user = await this.usersService.findOne(data.user_id);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            socket.join(data.room_id);
            socket.to(data.room_id).emit('room_message', {
                from: 'SYSTEM',
                text: `${user.name} joined room ${data.room_id}`,
            });
            console.log(`${user.name} joined room ${data.room_id}`);
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleLeaveRoom(socket, data) {
        try {
            const user = await this.usersService.findOne(data.user_id);
            if (!user)
                throw new common_1.NotFoundException('User not found');
            socket.leave(data.room_id);
            socket.to(data.room_id).emit('room_message', {
                from: 'SYSTEM',
                text: `${user.name} leave the room ${data.room_id}`,
            });
            console.log(`${user.name} joined room ${data.room_id}`);
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleRoomMessage(socket, data) {
        try {
            const user = socket.data.user;
            socket.to(data.roomId).emit('room_message', {
                from: user.name,
                text: `[${data.roomId}] ${data.message}`,
            });
            const roomId = data.roomId;
            const senderId = user._id;
            const content = data.message;
            await this.appService.sendRoomMessage({
                content: content,
                room_id: roomId,
                sender_id: senderId,
            });
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, use_guards_decorator_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('chat_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket,
        create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleChatMessage", null);
__decorate([
    (0, use_guards_decorator_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatsGateway.prototype, "handleTyping", null);
__decorate([
    (0, use_guards_decorator_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, use_guards_decorator_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, use_guards_decorator_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('room_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleRoomMessage", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        namespace: '/chats',
        cors: { origin: '*', methods: ['GET', 'POST'] },
    }),
    __metadata("design:paramtypes", [chats_service_1.ChatsService,
        users_service_1.UsersService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map