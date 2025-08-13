import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/config/enums/roles_enums';
import { Interest } from 'src/interests/schemas/interest.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  //_id
  //    @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId;

  @Prop()
  role: Role;
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    select: false,
  })
  password_key: string;

  @Prop({
    required: true,
    unique: true,
  })
  phoneNumber: string;

  @Prop({
    required: true,
  })
  countryCode: string;

  @Prop()
  about?: string;
  @Prop([String]) // This defines the property as an array of strings
  invitations?: string[];

  @Prop([String]) // This defines the property as an array of strings
  invitationRequests?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
