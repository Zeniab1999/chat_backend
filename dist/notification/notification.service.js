"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fcm_token_schema_1 = require("./schemas/fcm-token.schema");
const path = require("path");
const firebase_admin_1 = require("firebase-admin");
const serviceAccount = require(path.join(__dirname, '../../src/notification/firebase-admin-sdk.json'));
let NotificationService = class NotificationService {
    constructor(fcmTokenModel) {
        this.fcmTokenModel = fcmTokenModel;
        if (firebase_admin_1.default.apps.length === 0) {
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccount),
            });
        }
    }
    async saveUserToken(userId, token) {
        try {
            return await this.fcmTokenModel
                .findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { token }, { upsert: true, new: true })
                .exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to save FCM token.');
        }
    }
    async sendPushNotification(user, title, body) {
        try {
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
            const response = await firebase_admin_1.default.messaging().send(message);
            console.log('Successfully sent message:', response);
            return response;
        }
        catch (error) {
            console.error('Error sending message:', error);
            throw new common_1.InternalServerErrorException('Failed to send push notification.');
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fcm_token_schema_1.FcmToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
//# sourceMappingURL=notification.service.js.map