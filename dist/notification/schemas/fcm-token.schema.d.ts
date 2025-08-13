import mongoose, { HydratedDocument, Types } from 'mongoose';
export type FcmTokenDocument = HydratedDocument<FcmToken>;
export declare class FcmToken {
    userId: Types.ObjectId;
    token: string;
}
export declare const FcmTokenSchema: mongoose.Schema<FcmToken, mongoose.Model<FcmToken, any, any, any, mongoose.Document<unknown, any, FcmToken, any, {}> & FcmToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, FcmToken, mongoose.Document<unknown, {}, mongoose.FlatRecord<FcmToken>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<FcmToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
