// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import mongoose, { HydratedDocument, Types } from "mongoose";
// import { RoomType } from "../enums/room-type.enum";
// import { User } from "src/users/schemas/user.schemas";
// @Schema({
//     timestamps: true,
//     versionKey: false,

//     toJSON: ({
//         transform(_, ret, __) {
//             return new RoomDocument(ret);
//         },
//     })
// })
// export class Room {

//     @Prop()
//     name: string;

//     @Prop({ enum: RoomType, default: RoomType.PERSONAL })
//     type: RoomType;

//     @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: User.name, autopopulate: true }])
//     members: (Types.ObjectId | User)[]; // <-- عدلنا هنا
// }

// export const RoomSchema = SchemaFactory.createForClass(Room);

// export class RoomDocument {
//     _id: Types.ObjectId;
//     name: string;
//     type: RoomType;
//     members: (Types.ObjectId | User)[];

//     constructor(props: Partial<RoomDocument>) {
//         this._id = props._id;
//         this.members = props.members;
//         this.name = props.name;
//         this.type = props.type;

//         if (this.type === RoomType.PERSONAL) {
//             const otherMember = (this.members as User[]).find(
//                 (member) => member._id.toString() !== this._id.toString()
//             );
//             this.name = otherMember?.name ?? this.name;
//         }
//     }
// }

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schemas';
// import { User } from "src/users/schemas/user.schema";

export type RoomDocument = HydratedDocument<Room>;

export enum RoomType {
  PRIVATE = 'private',
  GROUP = 'group',
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    required: true,
    type: String,
    enum: RoomType,
    default: RoomType.PRIVATE,
  })
  type: RoomType;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: User.name,
    autopopulate: true,
    required: true,
  })
  members: Types.ObjectId[];
  // members: User[];

  // the user who created the room
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
    required: true,
  })
  createdBy: Types.ObjectId;
  // the room's admins
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
    required: true,
  })
  Admins: Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.plugin(require('mongoose-autopopulate'));
