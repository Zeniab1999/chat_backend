// import { Module } from '@nestjs/common';
// import { ChatsService } from './chats.service';
// import { ChatsGateway } from './chats.gateway';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Chat, ChatSchema } from './schemas/chat.schemas';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
//   ],
//   providers: [
//     ChatsGateway,
//     ChatsService,
//   ],
//   exports: [
//     ChatsService,
//   ],
// })
// export class ChatsModule { }

import { Module, forwardRef } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
import { ChatsController } from './chats.controller';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => RoomsModule), // ضروري ليكون RoomModel متاح في ChatsModule
    UsersModule,
    NotificationModule,
  ],
  providers: [ChatsGateway, ChatsService],
  controllers: [ChatsController],
  exports: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
