import { Model, Types } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, ChatDocument } from './schemas/chat.schemas';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schemas';
import { Server } from 'socket.io';
import { User, UserDocument } from 'src/users/schemas/user.schemas';
import { NotificationService } from 'src/notification/notification.service';
export declare class ChatsService {
    private chatModel;
    private roomModel;
    private userDocument;
    private readonly notificationService;
    constructor(chatModel: Model<ChatDocument>, roomModel: Model<RoomDocument>, userDocument: Model<UserDocument>, notificationService: NotificationService);
    private server;
    private userSocketMap;
    private roomSocketMap;
    getUserSocket(userId: string): any;
    getConnectedUserIds(): string[];
    private messages;
    setServer(server: Server): void;
    addUserToMap(userId: string, socketId: string): void;
    deleteUserFromMap(userId: string): void;
    getUserFromMap(userId: string): any;
    getUsers(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUser(userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMessages(senderId: string, receiverId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    addMessage(message: any): void;
    sendMessage(createChatDto: CreateChatDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getRoomChats(roomId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getMessagesByRoom(room_id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getMessagesBetweenUsers(user1Id: string, user2Id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getUserChats(userId: string): Promise<any[]>;
    getAllRooms(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    createRoom(createdBy: string, roomName: string, roomType: string, userRole: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateRoom(userId: string, roomId: string, updateData: Partial<RoomDocument>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deleteRoom(userId: string, roomId: string): Promise<{
        message: string;
    }>;
    getRoomInfo(roomId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getRoomMessages(roomId: string, limit?: number, lastId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    inviteUserToRoom(roomId: string, userId: string): Promise<"user invitation sent!" | {
        message: string;
    }>;
    createRoomInvitation(roomId: string, userId: string): Promise<string>;
    acceptRoomInvitation(userId: string, roomId: string): Promise<{
        message: string;
        roomMembers?: undefined;
    } | {
        message: string;
        roomMembers: Types.ObjectId[];
    }>;
    generateRoomURL(roomId: string): Promise<string>;
    getRoomURL(roomId: string): Promise<string>;
    generateRoomQRCode(roomId: string): Promise<string>;
    getRoomQRCode(roomId: string): Promise<string>;
    removeUserFromRoom(adminId: string, roomId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Room, {}, {}> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    listRoomUsers(roomId: string): Promise<Types.ObjectId[]>;
    sendRoomMessage(createChatDto: CreateChatDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Chat, {}, {}> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getRoomStats(roomId: string): Promise<{
        userCount: number;
        messageCount: number;
    }>;
    onJoinRoom(socketId: string, roomId: string): Promise<void>;
    onLeaveRoom(socketId: string, roomId: string): Promise<void>;
}
