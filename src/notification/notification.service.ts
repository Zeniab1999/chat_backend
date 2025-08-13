import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FcmToken, FcmTokenDocument } from './schemas/fcm-token.schema';
import { User } from 'src/users/schemas/user.schemas'; // We need this to get user info
import * as path from 'path';

// Import the Firebase Admin SDK
import admin from 'firebase-admin';

// The path to your service account key file
const serviceAccount = require(
  path.join(__dirname, '../../src/notification/firebase-admin-sdk.json'),
);
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(FcmToken.name) private fcmTokenModel: Model<FcmTokenDocument>,
  ) {
    // Initialize the Firebase Admin SDK once when the service is created
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  // This method saves the FCM token from the client for a specific user
  async saveUserToken(userId: string, token: string) {
    try {
      // Find and update the document. The 'upsert: true' option creates it if it doesn't exist.
      return await this.fcmTokenModel
        .findOneAndUpdate(
          { userId: new Types.ObjectId(userId) },
          { token },
          { upsert: true, new: true },
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to save FCM token.');
    }
  }

  // This is the core method to send a push notification
  async sendPushNotification(user: User, title: string, body: string) {
    try {
      // Find the FCM token for the target user
      const fcmTokenDoc = await this.fcmTokenModel
        .findOne({ userId: user._id })
        .exec();
      if (!fcmTokenDoc || !fcmTokenDoc.token) {
        console.warn(`No FCM token found for user ${user.name}`);
        return;
      }

      const message = {
        notification: {
          title: title,
          body: body,
        },
        token: fcmTokenDoc.token,
      };

      // Send the message via Firebase
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new InternalServerErrorException(
        'Failed to send push notification.',
      );
    }
  }
}
