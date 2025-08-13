// import { Module } from '@nestjs/common';
// import { RoomsService } from './rooms.service';
// import { RoomsController } from './rooms.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Room, RoomSchema } from './schemas/room.schemas';
// import { ChatsModule } from 'src/chats/chats.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
//     ChatsModule,
//   ],
//   controllers: [RoomsController],
//   providers: [RoomsService],
// })
// export class RoomsModule { }
import { Module, forwardRef } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schemas';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    forwardRef(() => ChatsModule),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService, MongooseModule], // ⚠️ صدر MongooseModule لكي RoomModel متاح
})
export class RoomsModule {}
