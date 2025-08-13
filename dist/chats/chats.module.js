"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const chats_gateway_1 = require("./chats.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const chat_schemas_1 = require("./schemas/chat.schemas");
const rooms_module_1 = require("../rooms/rooms.module");
const users_module_1 = require("../users/users.module");
const chats_controller_1 = require("./chats.controller");
const notification_module_1 = require("../notification/notification.module");
let ChatsModule = class ChatsModule {
};
exports.ChatsModule = ChatsModule;
exports.ChatsModule = ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: chat_schemas_1.Chat.name, schema: chat_schemas_1.ChatSchema }]),
            (0, common_1.forwardRef)(() => rooms_module_1.RoomsModule),
            users_module_1.UsersModule,
            notification_module_1.NotificationModule,
        ],
        providers: [chats_gateway_1.ChatsGateway, chats_service_1.ChatsService],
        controllers: [chats_controller_1.ChatsController],
        exports: [chats_service_1.ChatsService, chats_gateway_1.ChatsGateway],
    })
], ChatsModule);
//# sourceMappingURL=chats.module.js.map