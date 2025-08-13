import { UsersService } from 'src/users/users.service';
import { Socket } from 'socket.io';
export declare const wsAuthMiddleware: (usersService: UsersService) => (socket: Socket, next: any) => Promise<void>;
