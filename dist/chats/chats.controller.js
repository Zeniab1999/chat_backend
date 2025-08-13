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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const jwt_auth_guard_1 = require("../config/guard/jwt-auth.guard");
const roles_enums_1 = require("../config/enums/roles_enums");
const roles_decorator_1 = require("../auth/decorators/roles_decorator");
const swagger_1 = require("@nestjs/swagger");
let ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    getUsers() {
        return this.chatsService.getUsers();
    }
    getUsername(userId) {
        return this.chatsService.getUser(userId);
    }
    getCachedMessages(req, userId) {
        const receiverId = userId;
        const senderId = req.user._id;
        return this.chatsService.getMessages(senderId, receiverId);
    }
    getMessagesBetweenUsers(req, user2Id) {
        const user1Id = req.user._id;
        return this.chatsService.getMessagesBetweenUsers(user1Id, user2Id);
    }
    getUserChats(userId) {
        return this.chatsService.getUserChats(userId);
    }
    getChatRooms() {
        return this.chatsService.getAllRooms();
    }
    createRoom(req, name, type) {
        const createdBy = req.user._id;
        const userRole = 'admin';
        return this.chatsService.createRoom(createdBy, name, type, userRole);
    }
    updateRoom(req, roomId, updateData) {
        const userId = req.user._id;
        return this.chatsService.updateRoom(userId, roomId, updateData);
    }
    deleteRoom(req, roomId) {
        const userId = req.user._id;
        return this.chatsService.deleteRoom(userId, roomId);
    }
    getRoomInfo(roomId) {
        return this.chatsService.getRoomInfo(roomId);
    }
    getRoomStats(roomId) {
        return this.chatsService.getRoomStats(roomId);
    }
    listRoomUsers(roomId) {
        return this.chatsService.listRoomUsers(roomId);
    }
    inviteUserToRoom(roomId, userId) {
        return this.chatsService.inviteUserToRoom(roomId, userId);
    }
    async joinRoomRequest(roomId, req) {
        const userId = req.user._id;
        return this.chatsService.createRoomInvitation(userId, roomId);
    }
    async acceptInvitation(roomId, userId) {
        return this.chatsService.acceptRoomInvitation(userId, roomId);
    }
    generateRoomInviteQR(roomId, req) {
        return this.chatsService.getRoomQRCode(roomId);
    }
    getRoomURL(roomId) {
        return this.chatsService.getRoomURL(roomId);
    }
    removeUserFromRoom(req, roomId, userId) {
        const adminId = req.user._id;
        return this.chatsService.removeUserFromRoom(adminId, roomId, userId);
    }
    findAll(roomId) {
        return this.chatsService.getRoomChats(roomId);
    }
    getMessagesByRoom(roomId) {
        return this.chatsService.getMessagesByRoom(roomId);
    }
    getRoomMessages(roomId, limit, lastId) {
        const lim = limit ? parseInt(limit, 10) : 50;
        return this.chatsService.getRoomMessages(roomId, lim, lastId);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getUser'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getUsername", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getUserMessages'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getCachedMessages", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('between'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('user2Id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getMessagesBetweenUsers", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getUserChats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getAllRooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getChatRooms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('room/createRoom'),
    (0, roles_decorator_1.Roles)(roles_enums_1.Role.Admin, roles_enums_1.Role.Manager),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('room/updateRoom'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('roomId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "updateRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('room/deleteRoom'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "deleteRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getRoomInfo'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getRoomInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getRoomStats'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getRoomStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getRoomMembers'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "listRoomUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)(roles_enums_1.Role.Admin, roles_enums_1.Role.Manager),
    (0, common_1.Post)('room/inviteToRoom'),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "inviteUserToRoom", null);
__decorate([
    (0, common_1.Get)('room/joinRoomRequest'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "joinRoomRequest", null);
__decorate([
    (0, common_1.Post)('room/inviteAccept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/generateRoomInviteQr'),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "generateRoomInviteQR", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getRoomUrl'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getRoomURL", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('room/removeUserFromRoom'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('roomId')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "removeUserFromRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('room/getRoomChats'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rooms/chatMessages'),
    __param(0, (0, common_1.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getMessagesByRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rooms/chatHistory'),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('lastId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ChatsController.prototype, "getRoomMessages", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map