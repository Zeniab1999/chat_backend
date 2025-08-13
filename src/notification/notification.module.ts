// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FcmToken, FcmTokenSchema } from './schemas/fcm-token.schema';
import { UsersModule } from 'src/users/users.module'; // Import to provide access to the User model

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FcmToken.name, schema: FcmTokenSchema },
    ]),
    UsersModule, // This is needed for the NotificationsService to access the User model
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService], // Export the service to be used in other modules
})
export class NotificationModule {}
