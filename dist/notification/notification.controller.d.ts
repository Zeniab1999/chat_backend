import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationService);
    saveToken(req: any, token: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/fcm-token.schema").FcmToken, {}, {}> & import("./schemas/fcm-token.schema").FcmToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/fcm-token.schema").FcmToken, {}, {}> & import("./schemas/fcm-token.schema").FcmToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
