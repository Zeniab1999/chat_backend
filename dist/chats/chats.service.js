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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schemas_1 = require("./schemas/chat.schemas");
const room_schemas_1 = require("../rooms/schemas/room.schemas");
const QRCode = require("qrcode");
const user_schemas_1 = require("../users/schemas/user.schemas");
const notification_service_1 = require("../notification/notification.service");
let ChatsService = class ChatsService {
    constructor(chatModel, roomModel, userDocument, notificationService) {
        this.chatModel = chatModel;
        this.roomModel = roomModel;
        this.userDocument = userDocument;
        this.notificationService = notificationService;
        this.userSocketMap = {};
        this.roomSocketMap = {};
        this.messages = [];
    }
    getUserSocket(userId) {
        return this.userSocketMap[userId];
    }
    getConnectedUserIds() {
        return Object.keys(this.userSocketMap);
    }
    setServer(server) {
        this.server = server;
    }
    addUserToMap(userId, socketId) {
        this.userSocketMap[userId] = socketId;
    }
    deleteUserFromMap(userId) {
        delete this.userSocketMap[userId];
    }
    getUserFromMap(userId) {
        return this.userSocketMap[userId];
    }
    async getUsers() {
        try {
            const allUsers = await this.userDocument.find().exec();
            const connectedUsersIds = new Set(this.getConnectedUserIds());
            console.log(connectedUsersIds);
            const connectedUsers = allUsers.filter((user) => connectedUsersIds.has(user._id.toString()));
            return allUsers;
        }
        catch (err) {
            throw new common_1.NotFoundException('No users found!');
        }
    }
    async getUser(userId) {
        try {
            const user_id = new mongoose_2.Types.ObjectId(userId);
            if (!mongoose_2.Types.ObjectId.isValid(user_id)) {
                throw new common_1.NotFoundException('User not found.');
            }
            return await this.userDocument.findById(user_id).exec();
        }
        catch (err) {
            throw new common_1.NotFoundException(err.message);
        }
    }
    async getMessages(senderId, receiverId) {
        try {
            const receiver_id = new mongoose_2.Types.ObjectId(receiverId);
            if (!mongoose_2.Types.ObjectId.isValid(receiver_id)) {
                throw new common_1.NotFoundException('User not found.');
            }
            return await this.chatModel
                .find({
                $or: [
                    {
                        sender_id: new mongoose_2.Types.ObjectId(senderId),
                        receiver_id: new mongoose_2.Types.ObjectId(receiverId),
                    },
                    {
                        sender_id: new mongoose_2.Types.ObjectId(receiverId),
                        receiver_id: new mongoose_2.Types.ObjectId(senderId),
                    },
                ],
            })
                .exec();
        }
        catch (err) {
            console.log(err.message);
            throw new common_1.NotFoundException(err.message);
        }
    }
    addMessage(message) {
        this.messages.push(message);
    }
    async sendMessage(createChatDto) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(createChatDto.sender_id))
                throw new common_1.NotFoundException('Invalid sender ID');
            if (!mongoose_2.Types.ObjectId.isValid(createChatDto.receiver_id))
                throw new common_1.NotFoundException('Invalid receiver ID');
            const createdChat = new this.chatModel({
                ...createChatDto,
            });
            return createdChat.save();
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Error while creating the chat');
        }
    }
    async getRoomChats(roomId) {
        try {
            const query = {
                room_id: new mongoose_2.Types.ObjectId(roomId),
            };
            if (!mongoose_2.Types.ObjectId.isValid(roomId)) {
                throw new common_1.NotFoundException('Invalid Room ID.');
            }
            return this.chatModel.find(query).sort({ createdAt: 1 }).exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error while finding the chat');
        }
    }
    async getMessagesByRoom(room_id) {
        return this.chatModel
            .find({ room_id: new mongoose_2.Types.ObjectId(room_id) })
            .sort({ createdAt: 1 })
            .exec();
    }
    async getMessagesBetweenUsers(user1Id, user2Id) {
        try {
            return this.chatModel
                .find({
                $or: [
                    {
                        sender_id: new mongoose_2.Types.ObjectId(user1Id),
                        receiver_id: new mongoose_2.Types.ObjectId(user2Id),
                    },
                    {
                        sender_id: new mongoose_2.Types.ObjectId(user2Id),
                        receiver_id: new mongoose_2.Types.ObjectId(user1Id),
                    },
                ],
            })
                .sort({ createdAt: 1 })
                .exec();
        }
        catch (err) {
            console.log(err);
            throw new common_1.InternalServerErrorException('Error while finding the chat');
        }
    }
    async getUserChats(userId) {
        return this.chatModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: new mongoose_2.Types.ObjectId(userId) },
                        { receiver_id: new mongoose_2.Types.ObjectId(userId) },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ['$sender_id', new mongoose_2.Types.ObjectId(userId)] },
                            then: '$receiver_id',
                            else: '$sender_id',
                        },
                    },
                    messages: { $push: '$$ROOT' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $unwind: '$userInfo',
            },
            {
                $project: {
                    _id: 0,
                    user: '$userInfo',
                    messages: '$messages',
                },
            },
        ]);
    }
    async getAllRooms() {
        try {
            return this.roomModel.find().exec();
        }
        catch (err) {
            console.log(err);
            throw new common_1.NotFoundException('there is no chat rooms');
        }
    }
    async createRoom(createdBy, roomName, roomType, userRole) {
        if (!['admin', 'manager'].includes(userRole.toLowerCase())) {
            throw new Error('Unauthorized: Only admins or managers can create rooms');
        }
        const createdById = new mongoose_2.Types.ObjectId(createdBy);
        try {
            const room = new this.roomModel({
                createdBy: createdById,
                name: roomName,
                type: roomType,
                Admins: [createdById],
                members: [createdById],
            });
            const savedRoom = await room.save();
            return savedRoom;
        }
        catch (error) {
            console.error('Error creating room:', error);
            throw new common_1.InternalServerErrorException('Failed to create room. Please try again later.');
        }
    }
    async updateRoom(userId, roomId, updateData) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId) || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid room ID or user ID');
        }
        try {
            const isAdmin = await this.roomModel.findOne({
                _id: roomId,
                Admins: userId,
            });
            if (!isAdmin)
                throw new common_1.BadRequestException('not admin user');
            const updatedRoom = await this.roomModel.findByIdAndUpdate(roomId, updateData, { new: true });
            if (!updatedRoom)
                throw new common_1.NotFoundException('Room not found');
            return updatedRoom;
        }
        catch (error) {
            console.error('Error updating room:', error);
            throw new common_1.InternalServerErrorException('Failed to update room');
        }
    }
    async deleteRoom(userId, roomId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId) || !mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid room ID or user ID');
        }
        try {
            const isAdmin = await this.roomModel.findOne({
                _id: roomId,
                Admins: userId,
            });
            if (!isAdmin)
                throw new common_1.BadRequestException('not admin user');
            const deleted = await this.roomModel.findByIdAndDelete(roomId);
            if (!deleted)
                throw new common_1.NotFoundException('Room not found');
            await this.chatModel.deleteMany({ room_id: roomId });
            return { message: 'Room and associated chats deleted' };
        }
        catch (error) {
            console.error('Error deleting room:', error);
            throw new common_1.InternalServerErrorException('Failed to delete room');
        }
    }
    async getRoomInfo(roomId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId))
            throw new common_1.NotFoundException('Invalid room ID');
        try {
            const room = await this.roomModel.findById(roomId);
            if (!room)
                throw new common_1.NotFoundException('Room not found');
            return room;
        }
        catch (err) {
            console.log('Error getting room info:', err.message);
            throw new common_1.InternalServerErrorException('Failed to get room info');
        }
    }
    async getRoomMessages(roomId, limit = 50, lastId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId))
            throw new common_1.NotFoundException('Invalid room ID');
        try {
            const query = { room_id: new mongoose_2.Types.ObjectId(roomId) };
            if (lastId && mongoose_2.Types.ObjectId.isValid(lastId))
                query._id = { $lt: new mongoose_2.Types.ObjectId(lastId) };
            return await this.chatModel
                .find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
        }
        catch (err) {
            console.log('Error getting room messages:', err.message);
            throw new common_1.InternalServerErrorException('Failed to get room messages');
        }
    }
    async inviteUsersToRoom(roomId, usersId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId)) {
            throw new common_1.NotFoundException('Invalid room ID');
        }
        if (!Array.isArray(usersId) || usersId.length === 0) {
            throw new common_1.BadRequestException('usersId must be a non-empty array');
        }
        const invalidIds = [];
        const validIds = [];
        for (const id of usersId) {
            (mongoose_2.Types.ObjectId.isValid(id) ? validIds : invalidIds).push(id);
        }
        if (validIds.length === 0) {
            return { invited: [], alreadyInvited: [], notFound: [], invalidIds };
        }
        const users = await this.userDocument
            .find({ _id: { $in: validIds } }, { _id: 1, invitations: 1 })
            .lean();
        const foundSet = new Set(users.map(u => String(u._id)));
        const notFound = validIds.filter(id => !foundSet.has(id));
        const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
        const invited = [];
        const alreadyInvited = [];
        const bulkOps = [];
        for (const u of users) {
            const uid = String(u._id);
            const inviteUrl = `${baseUrl}/chats/room/inviteAccept?roomId=${roomId}&userId=${uid}`;
            const existing = (u.invitations ?? []);
            if (existing.includes(inviteUrl)) {
                alreadyInvited.push(uid);
                continue;
            }
            invited.push(uid);
            bulkOps.push({
                updateOne: {
                    filter: { _id: u._id },
                    update: { $addToSet: { invitations: inviteUrl } },
                },
            });
        }
        if (bulkOps.length) {
            await this.userDocument.bulkWrite(bulkOps);
        }
        return { invited, alreadyInvited, notFound, invalidIds };
    }
    async createRoomInvitation(roomId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId)) {
            throw new common_1.NotFoundException('Invalid room ID');
        }
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid user ID');
        }
        const inviteUrl = `http://localhost:3000/chats/room/inviteAccept?roomId=${roomId}&userId=${userId}`;
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        const adminIds = room.Admins;
        const admins = await this.userDocument
            .find({ _id: { $in: adminIds } })
            .exec();
        for (const admin of admins) {
            admin.invitationRequests.push(inviteUrl);
            await admin.save();
        }
        return 'invitation sent!';
    }
    async acceptRoomInvitation(userId, roomId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId)) {
            throw new common_1.NotFoundException('Invalid room ID.');
        }
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.NotFoundException('Invalid user ID.');
        }
        const inviteUrl = `http://localhost:3000/chats/room/inviteAccept?roomId=${roomId}&userId=${userId}`;
        const room = await this.roomModel.findById(roomId);
        if (!room) {
            throw new common_1.NotFoundException('Room not found.');
        }
        const user = await this.userDocument.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const isMember = room.members.some((memberId) => memberId.equals(userObjectId));
        if (isMember) {
            return {
                message: 'User is already a member of the room.',
            };
        }
        const adminIds = room.Admins;
        const admins = await this.userDocument
            .find({ _id: { $in: adminIds } })
            .exec();
        await this.userDocument
            .findByIdAndUpdate(userId, {
            $pull: { invitations: inviteUrl },
        })
            .exec();
        for (const admin of admins) {
            if (admin.invitationRequests.includes(inviteUrl)) {
                admin.invitationRequests = admin.invitationRequests.filter((link) => link !== inviteUrl);
                await admin.save();
            }
        }
        room.members.push(userObjectId);
        const updatedRoom = await room.save();
        return {
            message: 'User successfully added to the room.',
            roomMembers: updatedRoom.members,
        };
    }
    async generateRoomURL(roomId) {
        return `http://localhost:3000/chats/room/joinRoomRequest?roomId=${roomId}&`;
    }
    async getRoomURL(roomId) {
        return this.generateRoomURL(roomId);
    }
    async generateRoomQRCode(roomId) {
        const inviteUrl = `http://localhost:3000/chats/room/joinRoomRequest?roomId=${roomId}&`;
        const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
        return qrCodeDataUrl;
    }
    async getRoomQRCode(roomId) {
        return this.generateRoomQRCode(roomId);
    }
    async removeUserFromRoom(adminId, roomId, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId))
            throw new common_1.NotFoundException('Invalid room ID');
        if (!mongoose_2.Types.ObjectId.isValid(userId))
            throw new common_1.NotFoundException('Invalid user ID');
        if (!mongoose_2.Types.ObjectId.isValid(adminId))
            throw new common_1.NotFoundException('Invalid user ID');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        try {
            const room = await this.roomModel.findById(roomId);
            if (!room)
                throw new common_1.NotFoundException('Room not found');
            const isAdmin = await this.roomModel.findOne({
                _id: roomId,
                Admins: adminId,
            });
            if (!isAdmin)
                throw new common_1.BadRequestException('not admin user');
            room.members = room.members.filter((member) => !(member._id.equals
                ? member._id.equals(userObjectId)
                : member._id.toString() === userObjectId.toString()));
            await room.save();
            return room;
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException('Error removing user from room');
        }
    }
    async listRoomUsers(roomId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId))
            throw new common_1.NotFoundException('Invalid room ID');
        const room = await this.roomModel.findById(roomId).select('members');
        if (!room)
            throw new common_1.NotFoundException('Room not found');
        return room.members;
    }
    async sendRoomMessage(createChatDto) {
        if (!mongoose_2.Types.ObjectId.isValid(createChatDto.room_id))
            throw new common_1.NotFoundException('Invalid room ID');
        if (!mongoose_2.Types.ObjectId.isValid(createChatDto.sender_id))
            throw new common_1.NotFoundException('Invalid sender ID');
        const message = new this.chatModel({
            room_id: new mongoose_2.Types.ObjectId(createChatDto.room_id),
            sender_id: new mongoose_2.Types.ObjectId(createChatDto.sender_id),
            content: createChatDto.content,
            createdAt: new Date(),
        });
        return await message.save();
    }
    async getRoomStats(roomId) {
        if (!mongoose_2.Types.ObjectId.isValid(roomId))
            throw new common_1.NotFoundException('Invalid room ID');
        const userCount = await this.roomModel.countDocuments({
            _id: roomId,
            members: { $exists: true },
        });
        const messageCount = await this.chatModel.countDocuments({
            room_id: roomId,
        });
        return { userCount, messageCount };
    }
    async onJoinRoom(socketId, roomId) {
        console.log(`${socketId} joined room ${roomId}`);
    }
    async onLeaveRoom(socketId, roomId) {
        console.log(`${socketId} left room ${roomId}`);
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schemas_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(room_schemas_1.Room.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_service_1.NotificationService])
], ChatsService);
//# sourceMappingURL=chats.service.js.map