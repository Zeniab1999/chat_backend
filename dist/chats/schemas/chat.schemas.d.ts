import mongoose, { HydratedDocument } from "mongoose";
import { Room } from "src/rooms/schemas/room.schemas";
import { User } from "src/users/schemas/user.schemas";
export type ChatDocument = HydratedDocument<Chat>;
export declare class Chat {
    content: string;
    sender_id: User;
    receiver_id?: User;
    room_id?: Room;
}
export declare const ChatSchema: mongoose.Schema<Chat, mongoose.Model<Chat, any, any, any, mongoose.Document<unknown, any, Chat, any, {}> & Chat & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Chat, mongoose.Document<unknown, {}, mongoose.FlatRecord<Chat>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Chat> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
