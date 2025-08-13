import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { WsJwtAuthGuard } from 'src/config/guard/ws-jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { wsAuthMiddleware } from 'src/config/middleware/ws-auth.middleware'; // Or wherever the file is located
import { UsersService } from 'src/users/users.service';
import { send } from 'process';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { from } from 'rxjs';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway(8080, {
  namespace: '/chats',
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  // to add user to the socket.data
  constructor(
    private readonly appService: ChatsService,
    private readonly usersService: UsersService,
  ) {}
  afterInit() {
    this.appService.setServer(this.server);
    this.server.use(wsAuthMiddleware(this.usersService)); // use this server inside the services for send real-time messages
  }

  // @UseGuards(WsJwtAuthGuard)
  handleConnection(socket: Socket) {
    const user = socket.data.user;
    if (user._id) {
      this.appService.addUserToMap(user._id, socket.id); // add the user to the map
    }
    console.log(user);
    console.log(`✅ User connected: ${user?.name} (${socket.id})`);
  }

  handleDisconnect(socket: Socket) {
    const user = socket.data.user;
    console.log(`❌ User disconnected: ${user?.name} (${socket.id})`);
    this.appService.deleteUserFromMap[user._id]; // delete the user from the map

    this.server.emit('user_left', user?.name);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('chat_message')
  async handleChatMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: CreateChatDto,
  ) {
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

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { room_id?: string; receiver_id?: string },
  ) {
    try {
      const user = socket.data.user;
      let recipient: string;
      if (data.room_id) {
        recipient = data.room_id;
      } else if (data.receiver_id) {
        recipient = data.receiver_id;
      }
      if (recipient) {
        socket
          .to(
            data.receiver_id
              ? this.appService.getUserFromMap(recipient)
              : data.room_id,
          )
          .emit('typing', { user_name: user?.name, message: 'typing...' });
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { room_id: string; user_id: string },
  ) {
    try {
      const user = await this.usersService.findOne(data.user_id);
      if (!user) throw new NotFoundException('User not found');
      socket.join(data.room_id);
      // this.appService.addUserToRoomMap(data.room_id, user._id); // add this online user to this room
      socket.to(data.room_id).emit('room_message', {
        from: 'SYSTEM',
        text: `${user.name} joined room ${data.room_id}`,
      });
      console.log(`${user.name} joined room ${data.room_id}`);
      // console.log(roomSocketMap);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { room_id: string; user_id: string },
  ) {
    try {
      const user = await this.usersService.findOne(data.user_id);
      if (!user) throw new NotFoundException('User not found');
      socket.leave(data.room_id);
      // this.appService.addUserToRoomMap(data.room_id, user._id); // add this online user to this room
      socket.to(data.room_id).emit('room_message', {
        from: 'SYSTEM',
        text: `${user.name} leave the room ${data.room_id}`,
      });
      console.log(`${user.name} joined room ${data.room_id}`);
      // console.log(roomSocketMap);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('room_message')
  async handleRoomMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
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
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @UseGuards(WsJwtAuthGuard)
  // @SubscribeMessage('get_room_messages')
  // async handleGetMessages(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() room_id: string,
  // ) {
  //   try {
  //     const messages = await this.appService.getRoomChats(room_id);
  //     socket.to(room_id).emit('room_messages', messages);
  //     console.log(messages);
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // @UseGuards(WsJwtAuthGuard)
  // @SubscribeMessage('get_user_chats')
  // async handleGetUserChats(@ConnectedSocket() socket: Socket) {
  //   try {
  //     const user = socket.data.user;
  //     const chats = await this.appService.getUserChats(user.id);
  //     // this return {user: userinfo, messages: all the messages with this user} both of them will be in array
  //     socket.emit('user_chats', chats);
  //     console.log(chats[0].messages);
  //   } catch (error) {
  //     console.log(error.message);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /////////////////////////// can be modified to return all the room that the socket user is part of //////////////////////////////////////
  // @UseGuards(WsJwtAuthGuard)
  // @SubscribeMessage('get_chat_rooms')
  // async handleGetChatRooms(@ConnectedSocket() socket: Socket) {
  //   const rooms = await this.appService.getAllRooms();
  //   socket.emit('chat_rooms', rooms);
  // }

  //// it can be replaced with get_user_chats event (handleGetUserChats method)
  // @UseGuards(WsJwtAuthGuard)
  // @SubscribeMessage('get_messages_between_users')
  // async handleGetMessagesBetweenUsers(
  //   @ConnectedSocket() socket: Socket,
  //   @MessageBody() data: { user2: string },
  // ) {
  //   const user1 = socket.data.user;
  //   const messages = await this.appService.getMessagesBetweenUsers(
  //     user1,
  //     data.user2,
  //   );
  //   socket.emit('direct_messages', messages);
  // }
}
