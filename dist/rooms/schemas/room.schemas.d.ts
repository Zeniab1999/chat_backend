import mongoose, { HydratedDocument, Types } from 'mongoose';
export type RoomDocument = HydratedDocument<Room>;
export declare enum RoomType {
    PRIVATE = "private",
    GROUP = "group"
}
export declare class Room {
    name: string;
    type: RoomType;
    members: Types.ObjectId[];
    createdBy: Types.ObjectId;
    Admins: Types.ObjectId[];
}
export declare const RoomSchema: mongoose.Schema<Room, mongoose.Model<Room, any, any, any, mongoose.Document<unknown, any, Room, any, {}> & Room & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Room, mongoose.Document<unknown, {}, mongoose.FlatRecord<Room>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Room> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
