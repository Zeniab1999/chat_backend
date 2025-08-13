import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChatsService } from 'src/chats/chats.service';
export declare class RoomsController {
    private readonly roomsService;
    private readonly chatsService;
    constructor(roomsService: RoomsService, chatsService: ChatsService);
    create(req: any, createRoomDto: CreateRoomDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/room.schemas").Room, {}, {}> & import("./schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getByRequest(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schemas").Room, {}, {}> & import("./schemas/room.schemas").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
