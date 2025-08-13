// ------------------------
// chats.service.ts (Merged: previous + new functions)
// ------------------------
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';
import { Chat, ChatDocument } from './schemas/chat.schemas';
import { Room, RoomDocument } from 'src/rooms/schemas/room.schemas';
import * as QRCode from 'qrcode';
import { Server } from 'socket.io';
import { User, UserDocument } from 'src/users/schemas/user.schemas';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { NotificationService } from 'src/notification/notification.service'; // Import the service

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userDocument: Model<UserDocument>,
    private readonly notificationService: NotificationService,
  ) {}
  private server: Server; // Add a property to hold the server instance
  private userSocketMap = {}; // {userId: socketId} to store all online users
  private roomSocketMap = {}; // {userId: roomid} to store all online users inside their rooms
  getUserSocket(userId: string) {
    return this.userSocketMap[userId];
  }
  getConnectedUserIds() {
    return Object.keys(this.userSocketMap);
  }
  // private users: Record<string, string> = {};
  private messages: any[] = [];

  // get the server from the gateway
  setServer(server: Server) {
    this.server = server;
  }

  ///////// get room ids' and userSocket from the gateway

  addUserToMap(userId: string, socketId: string) {
    this.userSocketMap[userId] = socketId;
  }
  deleteUserFromMap(userId: string) {
    delete this.userSocketMap[userId];
  }
  getUserFromMap(userId: string) {
    return this.userSocketMap[userId];
  }

  // -------- In-memory user management (for sockets) --------

  // get all users
  async getUsers() {
    try {
      const allUsers = await this.userDocument.find().exec();
      const connectedUsersIds = new Set(this.getConnectedUserIds());
      // const arrayOfConnectedUsers = Array.from(connectedUsersIds);
      console.log(connectedUsersIds);
      // Filter the allUsers array
      const connectedUsers = allUsers.filter((user) =>
        connectedUsersIds.has(user._id.toString()),
      );
      return allUsers; // return for now all users
    } catch (err) {
      throw new NotFoundException('No users found!');
    }
  }
  // get individual user
  async getUser(userId: string) {
    try {
      const user_id = new Types.ObjectId(userId);

      if (!Types.ObjectId.isValid(user_id)) {
        throw new NotFoundException('User not found.');
      }
      return await this.userDocument.findById(user_id).exec();
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async getMessages(senderId: string, receiverId: string) {
    try {
      //userId here is the receiver id
      const receiver_id = new Types.ObjectId(receiverId);

      if (!Types.ObjectId.isValid(receiver_id)) {
        throw new NotFoundException('User not found.');
      }
      return await this.chatModel
        .find({
          $or: [
            {
              sender_id: new Types.ObjectId(senderId),
              receiver_id: new Types.ObjectId(receiverId),
            },
            {
              sender_id: new Types.ObjectId(receiverId),
              receiver_id: new Types.ObjectId(senderId),
            },
          ],
        })
        .exec();
    } catch (err) {
      console.log(err.message);
      throw new NotFoundException(err.message);
    }
  }

  addMessage(message: any) {
    this.messages.push(message);
  }

  // send message to specific user

  async sendMessage(createChatDto: CreateChatDto) {
    try {
      if (!Types.ObjectId.isValid(createChatDto.sender_id))
        throw new NotFoundException('Invalid sender ID');
      if (!Types.ObjectId.isValid(createChatDto.receiver_id))
        throw new NotFoundException('Invalid receiver ID');

      const createdChat = new this.chatModel({
        ...createChatDto,
      });
      // await this.notificationsService.sendPushNotification(
      //   member,
      //   `New message in ${room.name}`,
      //   `You received a message from ${createChatDto.sender_id.username}: ${createChatDto.content}`,
      // );
      return createdChat.save();
    } catch (err) {
      throw new InternalServerErrorException('Error while creating the chat');
    }
  }

  async getRoomChats(roomId: string) {
    try {
      const query = {
        // Ensure the roomId is a valid ObjectId
        room_id: new Types.ObjectId(roomId),
      };

      // Check if the ObjectId is valid
      if (!Types.ObjectId.isValid(roomId)) {
        throw new NotFoundException('Invalid Room ID.');
      }
      return this.chatModel.find(query).sort({ createdAt: 1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Error while finding the chat');
    }
  }

  async getMessagesByRoom(room_id: string) {
    return this.chatModel
      .find({ room_id: new Types.ObjectId(room_id) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getMessagesBetweenUsers(user1Id: string, user2Id: string) {
    try {
      return this.chatModel
        .find({
          $or: [
            {
              sender_id: new Types.ObjectId(user1Id),
              receiver_id: new Types.ObjectId(user2Id),
            },
            {
              sender_id: new Types.ObjectId(user2Id),
              receiver_id: new Types.ObjectId(user1Id),
            },
          ],
        })
        .sort({ createdAt: 1 })
        .exec();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error while finding the chat');
    }
  }

  async getUserChats(userId: string) {
    return this.chatModel.aggregate([
      {
        // Match all chats where the user is either the sender or the receiver
        $match: {
          $or: [
            { sender_id: new Types.ObjectId(userId) },
            { receiver_id: new Types.ObjectId(userId) },
          ],
        },
      },
      {
        // Group all messages by the other user's ID
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender_id', new Types.ObjectId(userId)] },
              then: '$receiver_id',
              else: '$sender_id',
            },
          },
          // Collect all messages for this conversation into an array
          messages: { $push: '$$ROOT' },
        },
      },
      {
        // Look up the full user object for the other person
        $lookup: {
          from: 'users', // The name of your users collection
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        // Deconstruct the userInfo array
        $unwind: '$userInfo',
      },
      {
        // Reshape the output to a clean format
        $project: {
          _id: 0,
          user: '$userInfo',
          messages: '$messages',
        },
      },
    ]);
  }
  // get all rooms
  async getAllRooms() {
    try {
      return this.roomModel.find().exec();
    } catch (err) {
      console.log(err);
      throw new NotFoundException('there is no chat rooms');
    }
  }
  //create room if i am an admin or manager

  async createRoom(
    createdBy: string,
    roomName: string,
    roomType: string,
    userRole: string,
  ) {
    // Only allow if user is admin or manager
    if (!['admin', 'manager'].includes(userRole.toLowerCase())) {
      throw new Error('Unauthorized: Only admins or managers can create rooms');
    }
    const createdById = new Types.ObjectId(createdBy);
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
    } catch (error) {
      console.error('Error creating room:', error);
      throw new InternalServerErrorException(
        'Failed to create room. Please try again later.',
      );
    }
  }
  // update the room data
  async updateRoom(
    userId: string,
    roomId: string,
    updateData: Partial<RoomDocument>,
  ) {
    if (!Types.ObjectId.isValid(roomId) || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid room ID or user ID');
    }
    try {
      const isAdmin = await this.roomModel.findOne({
        _id: roomId,
        Admins: userId,
      });
      if (!isAdmin) throw new BadRequestException('not admin user');
      const updatedRoom = await this.roomModel.findByIdAndUpdate(
        roomId,
        updateData,
        { new: true },
      );
      if (!updatedRoom) throw new NotFoundException('Room not found');
      return updatedRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      throw new InternalServerErrorException('Failed to update room');
    }
  }

  // delete a room
  async deleteRoom(userId: string, roomId: string) {
    if (!Types.ObjectId.isValid(roomId) || !Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid room ID or user ID');
    }
    try {
      const isAdmin = await this.roomModel.findOne({
        _id: roomId,
        Admins: userId,
      });
      if (!isAdmin) throw new BadRequestException('not admin user');
      const deleted = await this.roomModel.findByIdAndDelete(roomId);
      if (!deleted) throw new NotFoundException('Room not found');
      // Optional: cascade delete chats for this room if needed
      await this.chatModel.deleteMany({ room_id: roomId });
      return { message: 'Room and associated chats deleted' };
    } catch (error) {
      console.error('Error deleting room:', error);
      throw new InternalServerErrorException('Failed to delete room');
    }
  }

  async getRoomInfo(roomId: string) {
    if (!Types.ObjectId.isValid(roomId))
      throw new NotFoundException('Invalid room ID');
    try {
      const room = await this.roomModel.findById(roomId);
      if (!room) throw new NotFoundException('Room not found');
      return room;
    } catch (err) {
      console.log('Error getting room info:', err.message);
      throw new InternalServerErrorException('Failed to get room info');
    }
  }

  async getRoomMessages(roomId: string, limit = 50, lastId?: string) {
    if (!Types.ObjectId.isValid(roomId))
      throw new NotFoundException('Invalid room ID');
    try {
      const query: any = { room_id: new Types.ObjectId(roomId) };
      if (lastId && Types.ObjectId.isValid(lastId))
        query._id = { $lt: new Types.ObjectId(lastId) };
      return await this.chatModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
    } catch (err) {
      console.log('Error getting room messages:', err.message);
      throw new InternalServerErrorException('Failed to get room messages');
    }
  }

  ////////////////////////////////////////////////////// Invatation start //////////////////////////////////////////////////////////
  async inviteUserToRoom(roomId: string, userId: string) {
    if (!Types.ObjectId.isValid(roomId)) {
      throw new NotFoundException('Invalid room ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    // 3. Find the user to ensure they exist
    const user = await this.userDocument.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const inviteUrl = `http://localhost:3000/chats/room/inviteAccept?roomId=${roomId}&userId=${userId}`;

    // 4. Check if the user is already invited
    const isInvited = user.invitations.some(
      (inviteUrl) => inviteUrl === inviteUrl,
    );

    if (isInvited) {
      return {
        message: 'User is already invited.',
      };
    } else {
      await this.userDocument
        .findByIdAndUpdate(userId, {
          $push: { invitations: inviteUrl },
        })
        .exec();
    }

    // const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
    return 'user invitation sent!';
  }
  async createRoomInvitation(roomId: string, userId: string) {
    if (!Types.ObjectId.isValid(roomId)) {
      throw new NotFoundException('Invalid room ID');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }
    const inviteUrl = `http://localhost:3000/chats/room/inviteAccept?roomId=${roomId}&userId=${userId}`;

    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    // Get the IDs of all admins in the room
    const adminIds = room.Admins;

    // Find all user documents for the admin IDs
    const admins = await this.userDocument
      .find({ _id: { $in: adminIds } })
      .exec();

    for (const admin of admins) {
      admin.invitationRequests.push(inviteUrl);
      await admin.save();
    }

    return 'invitation sent!';
  }

  // This is the new method to handle an invitation being accepted.
  async acceptRoomInvitation(userId: string, roomId: string) {
    if (!Types.ObjectId.isValid(roomId)) {
      throw new NotFoundException('Invalid room ID.');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID.');
    }

    const inviteUrl = `http://localhost:3000/chats/room/inviteAccept?roomId=${roomId}&userId=${userId}`;

    // 2. Find the room
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    // 3. Find the user to ensure they exist
    const user = await this.userDocument.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const userObjectId = new Types.ObjectId(userId);

    // 4. Check if the user is already a member
    const isMember = room.members.some((memberId) =>
      memberId.equals(userObjectId),
    );

    if (isMember) {
      return {
        message: 'User is already a member of the room.',
      };
    }
    // Get the IDs of all admins in the room
    const adminIds = room.Admins;

    // Find all user documents for the admin IDs
    const admins = await this.userDocument
      .find({ _id: { $in: adminIds } })
      .exec();
    // remove invitation from user invitations
    await this.userDocument
      .findByIdAndUpdate(userId, {
        $pull: { invitations: inviteUrl },
      })
      .exec();

    for (const admin of admins) {
      if (admin.invitationRequests.includes(inviteUrl)) {
        admin.invitationRequests = admin.invitationRequests.filter(
          (link) => link !== inviteUrl,
        );
        await admin.save();
      }
    }
    // 5. Add the user to the members array
    room.members.push(userObjectId);
    const updatedRoom = await room.save();

    return {
      message: 'User successfully added to the room.',
      roomMembers: updatedRoom.members,
    };
  }

  async generateRoomURL(roomId: string) {
    return `http://localhost:3000/chats/room/joinRoomRequest?roomId=${roomId}&`;
  }

  async getRoomURL(roomId: string) {
    return this.generateRoomURL(roomId);
  }

  async generateRoomQRCode(roomId: string) {
    const inviteUrl = `http://localhost:3000/chats/room/joinRoomRequest?roomId=${roomId}&`;
    const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
    return qrCodeDataUrl;
  }

  async getRoomQRCode(roomId: string) {
    return this.generateRoomQRCode(roomId);
  }
  ////////////////////////////////////////////////////// Invatation end //////////////////////////////////////////////////////////

  async removeUserFromRoom(adminId: string, roomId: string, userId: string) {
    if (!Types.ObjectId.isValid(roomId))
      throw new NotFoundException('Invalid room ID');
    if (!Types.ObjectId.isValid(userId))
      throw new NotFoundException('Invalid user ID');
    if (!Types.ObjectId.isValid(adminId))
      throw new NotFoundException('Invalid user ID');
    const userObjectId = new Types.ObjectId(userId);
    try {
      const room = await this.roomModel.findById(roomId);
      if (!room) throw new NotFoundException('Room not found');
      const isAdmin = await this.roomModel.findOne({
        _id: roomId,
        Admins: adminId,
      });
      if (!isAdmin) throw new BadRequestException('not admin user');
      // Filter out the user by _id comparison
      room.members = room.members.filter(
        (member: any) =>
          !(member._id.equals
            ? member._id.equals(userObjectId)
            : member._id.toString() === userObjectId.toString()),
      );
      await room.save();
      return room;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Error removing user from room');
    }
  }

  // Placeholder for QR code generation - implement with a QR code lib in reality

  async listRoomUsers(roomId: string) {
    if (!Types.ObjectId.isValid(roomId))
      throw new NotFoundException('Invalid room ID');
    const room = await this.roomModel.findById(roomId).select('members');
    if (!room) throw new NotFoundException('Room not found');
    return room.members;
  }

  // send message to specific room
  async sendRoomMessage(createChatDto: CreateChatDto) {
    if (!Types.ObjectId.isValid(createChatDto.room_id))
      throw new NotFoundException('Invalid room ID');
    if (!Types.ObjectId.isValid(createChatDto.sender_id))
      throw new NotFoundException('Invalid sender ID');
    const message = new this.chatModel({
      room_id: new Types.ObjectId(createChatDto.room_id),
      sender_id: new Types.ObjectId(createChatDto.sender_id),
      content: createChatDto.content,
      createdAt: new Date(),
    });
    return await message.save();
  }

  async getRoomStats(roomId: string) {
    if (!Types.ObjectId.isValid(roomId))
      throw new NotFoundException('Invalid room ID');
    const userCount = await this.roomModel.countDocuments({
      _id: roomId,
      members: { $exists: true },
    });
    const messageCount = await this.chatModel.countDocuments({
      room_id: roomId,
    });
    return { userCount, messageCount };
  }

  // async removeUserFromRoomManual(roomId: string, userId: string) {
  //   return this.removeUserFromRoom(roomId, userId);
  // }

  // --- Socket Events stubs ---

  async onJoinRoom(socketId: string, roomId: string) {
    // Track socket joins, e.g., in-memory or DB for presence
    console.log(`${socketId} joined room ${roomId}`);
  }

  async onLeaveRoom(socketId: string, roomId: string) {
    // Track socket leaves
    console.log(`${socketId} left room ${roomId}`);
  }
}
