import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { UsersService } from 'src/users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';
export declare class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly appService;
    private readonly usersService;
    server: Server;
    constructor(appService: ChatsService, usersService: UsersService);
    afterInit(): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    handleChatMessage(socket: Socket, data: CreateChatDto): Promise<void>;
    handleTyping(socket: Socket, data: {
        room_id?: string;
        receiver_id?: string;
    }): void;
    handleJoinRoom(socket: Socket, data: {
        room_id: string;
        user_id: string;
    }): Promise<void>;
    handleLeaveRoom(socket: Socket, data: {
        room_id: string;
        user_id: string;
    }): Promise<void>;
    handleRoomMessage(socket: Socket, data: {
        roomId: string;
        message: string;
    }): Promise<void>;
}
