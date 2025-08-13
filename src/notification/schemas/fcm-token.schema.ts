import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';

// Defines the Mongoose document type
export type FcmTokenDocument = HydratedDocument<FcmToken>;

// The schema for storing a user's Firebase Cloud Messaging (FCM) token
@Schema({ timestamps: true, versionKey: false })
export class FcmToken {
  // A reference to the user who owns this token.
  // The 'unique: true' constraint ensures a user has only one token stored.
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  // The unique FCM token for a device, provided by the client application.
  @Prop({ required: true })
  token: string;
}

export const FcmTokenSchema = SchemaFactory.createForClass(FcmToken);
