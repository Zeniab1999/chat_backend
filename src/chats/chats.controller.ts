import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { Role } from 'src/config/enums/roles_enums';
import { Roles } from 'src/auth/decorators/roles_decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * ChatsController
 * Exposes HTTP endpoints for 1:1 messages and room chat features.
 */
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // -----------------------------
  // In-memory user management (optional helpers)
  // -----------------------------
  @UseGuards(JwtAuthGuard)
  @Get('getUsers')
  getUsers() {
    return this.chatsService.getUsers();
  }
  // get the user with specific Id
  @UseGuards(JwtAuthGuard)
  @Get('getUser')
  getUsername(@Query('userId') userId: string) {
    return this.chatsService.getUser(userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getUserMessages')
  getCachedMessages(@Request() req, @Query('userId') userId: string) {
    const receiverId = userId;
    const senderId = req.user._id;
    return this.chatsService.getMessages(senderId, receiverId); // send recriver id
  }

  // -----------------------------
  // Direct / 1:1 messages
  // -----------------------------

  // @Post()
  // sendMessage(@Body() createChatDto: CreateChatDto) {
  //   return this.chatsService.sendMessage(createChatDto);
  // }
  @UseGuards(JwtAuthGuard)
  @Get('between')
  getMessagesBetweenUsers(@Request() req, @Query('user2Id') user2Id: string) {
    const user1Id = req.user._id;
    return this.chatsService.getMessagesBetweenUsers(user1Id, user2Id);
  }

  @Get('user')
  getUserChats(@Query('userId') userId: string) {
    return this.chatsService.getUserChats(userId);
  }

  // -----------------------------
  // Room basics
  // -----------------------------

  // get all rooms
  @UseGuards(JwtAuthGuard)
  @Get('room/getAllRooms')
  getChatRooms() {
    return this.chatsService.getAllRooms();
  }

  // create room
  @UseGuards(JwtAuthGuard)
  @Post('room/createRoom')
  @Roles(Role.Admin, Role.Manager)
  createRoom(
    @Request() req,
    @Body('name') name: string,
    @Body('type') type: string,
  ) {
    const createdBy = req.user._id;
    const userRole = 'admin';
    return this.chatsService.createRoom(createdBy, name, type, userRole);
  }
  // update the room
  @UseGuards(JwtAuthGuard)
  @Patch('room/updateRoom')
  updateRoom(
    @Request() req,
    @Query('roomId') roomId: string,
    @Body() updateData: any, // Partial<RoomDocument> – typed as any here to avoid import cycles
  ) {
    const userId = req.user._id;
    return this.chatsService.updateRoom(userId, roomId, updateData);
  }
  // delete a room
  @UseGuards(JwtAuthGuard)
  @Delete('room/deleteRoom')
  deleteRoom(@Request() req, @Query('roomId') roomId: string) {
    const userId = req.user._id;
    return this.chatsService.deleteRoom(userId, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/getRoomInfo')
  getRoomInfo(@Query('roomId') roomId: string) {
    return this.chatsService.getRoomInfo(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/getRoomStats')
  getRoomStats(@Query('roomId') roomId: string) {
    return this.chatsService.getRoomStats(roomId);
  }

  // -----------------------------
  // Room members
  // -----------------------------

  @UseGuards(JwtAuthGuard)
  @Get('room/getRoomMembers')
  listRoomUsers(@Query('roomId') roomId: string) {
    return this.chatsService.listRoomUsers(roomId);
  }

  ////////////////////////////////////////////////////// Invatation start //////////////////////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Manager)
  @Post('room/inviteToRoom')
  inviteListOfUsersToRoom(
    @Query('roomId') roomId: string,
    @Body('usersId') usersId:  string[]
  ) {
    return this.chatsService.inviteUsersToRoom(roomId, usersId);
  }

  @Get('room/joinRoomRequest')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async joinRoomRequest(@Query('roomId') roomId: string, @Request() req) {
    const userId = req.user._id;
    // Call a service method to handle the acceptance logic
    return this.chatsService.createRoomInvitation(userId, roomId);
  }

  @Post('room/inviteAccept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async acceptInvitation(
    @Query('roomId') roomId: string,
    @Query('userId') userId: string,
  ) {
    return this.chatsService.acceptRoomInvitation(userId, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/generateRoomInviteQr')
  generateRoomInviteQR(@Query('roomId') roomId: string, @Request() req) {
    return this.chatsService.getRoomQRCode(roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('room/getRoomUrl')
  getRoomURL(@Query('roomId') roomId: string) {
    return this.chatsService.getRoomURL(roomId);
  }
  ////////////////////////////////////////////////////// Invatation end //////////////////////////////////////////////////////////

  @UseGuards(JwtAuthGuard)
  @Delete('room/removeUserFromRoom')
  removeUserFromRoom(
    @Request() req,
    @Query('roomId') roomId: string,
    @Query('userId') userId: string,
  ) {
    const adminId = req.user._id;
    return this.chatsService.removeUserFromRoom(adminId, roomId, userId);
  }

  // // alias to manual removal (uses same service)
  // @Delete('rooms/:roomId/members/:userId/manual')
  // removeUserFromRoomManual(
  //   @Param('roomId') roomId: string,
  //   @Param('userId') userId: string,
  // ) {
  //   return this.chatsService.removeUserFromRoomManual(roomId, userId);
  // }

  // -----------------------------
  // Room messaging
  // -----------------------------

  // Simple "all messages in a room" (ascending by createdAt)
  @UseGuards(JwtAuthGuard)
  @Get('room/getRoomChats') // kept for parity with your service.findAll signature
  findAll(@Query('roomId') roomId: string) {
    return this.chatsService.getRoomChats(roomId);
  }

  // Same intent but explicit path
  @UseGuards(JwtAuthGuard)
  @Get('rooms/chatMessages')
  getMessagesByRoom(@Query('roomId') roomId: string) {
    return this.chatsService.getMessagesByRoom(roomId);
  }

  // Paginated / infinite scroll (most recent first)
  @UseGuards(JwtAuthGuard)
  @Get('rooms/chatHistory')
  getRoomMessages(
    @Query('roomId') roomId: string,
    @Query('limit') limit?: string,
    @Query('lastId') lastId?: string,
  ) {
    const lim = limit ? parseInt(limit, 10) : 50;
    return this.chatsService.getRoomMessages(roomId, lim, lastId);
  }

  // @Post('rooms/:roomId/messages')
  // sendRoomMessage(
  //   @Param('roomId') roomId: string,
  //   @Body('sender_id') sender_id: string,
  //   @Body('content') content: string,
  // ) {
  //   return this.chatsService.sendRoomMessage({
  //     room_id: roomId,
  //     sender_id,
  //     content,
  //   } as any);
  // }

  // -----------------------------
  // Room utilities
  // -----------------------------
}
