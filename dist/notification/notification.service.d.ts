import { Model, Types } from 'mongoose';
import { FcmToken, FcmTokenDocument } from './schemas/fcm-token.schema';
import { User } from 'src/users/schemas/user.schemas';
export declare class NotificationService {
    private fcmTokenModel;
    constructor(fcmTokenModel: Model<FcmTokenDocument>);
    saveUserToken(userId: string, token: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, FcmToken, {}, {}> & FcmToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, FcmToken, {}, {}> & FcmToken & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    sendPushNotification(user: User, title: string, body: string): Promise<string>;
}
