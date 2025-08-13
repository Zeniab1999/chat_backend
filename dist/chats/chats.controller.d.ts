import { ChatsService } from './chats.service';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    getUsers(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUsername(userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getCachedMessages(req: any, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getMessagesBetweenUsers(req: any, user2Id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getUserChats(userId: string): Promise<any[]>;
    getChatRooms(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    createRoom(req: any, name: string, type: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateRoom(req: any, roomId: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    deleteRoom(req: any, roomId: string): Promise<{
        message: string;
    }>;
    getRoomInfo(roomId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getRoomStats(roomId: string): Promise<{
        userCount: number;
        messageCount: number;
    }>;
    listRoomUsers(roomId: string): Promise<import("mongoose").Types.ObjectId[]>;
    inviteUserToRoom(roomId: string, userId: string): Promise<"user invitation sent!" | {
        message: string;
    }>;
    joinRoomRequest(roomId: string, req: any): Promise<string>;
    acceptInvitation(roomId: string, userId: string): Promise<{
        message: string;
        roomMembers?: undefined;
    } | {
        message: string;
        roomMembers: import("mongoose").Types.ObjectId[];
    }>;
    generateRoomInviteQR(roomId: string, req: any): Promise<string>;
    getRoomURL(roomId: string): Promise<string>;
    removeUserFromRoom(req: any, roomId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../rooms/schemas/room.schemas").Room, {}, {}> & import("../rooms/schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(roomId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getMessagesByRoom(roomId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getRoomMessages(roomId: string, limit?: string, lastId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/chat.schemas").Chat, {}, {}> & import("./schemas/chat.schemas").Chat & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
