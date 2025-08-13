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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomSchema = exports.Room = exports.RoomType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schemas_1 = require("../../users/schemas/user.schemas");
var RoomType;
(function (RoomType) {
    RoomType["PRIVATE"] = "private";
    RoomType["GROUP"] = "group";
})(RoomType || (exports.RoomType = RoomType = {}));
let Room = class Room {
};
exports.Room = Room;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        enum: RoomType,
        default: RoomType.PRIVATE,
    }),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Schema.Types.ObjectId],
        ref: user_schemas_1.User.name,
        autopopulate: true,
        required: true,
    }),
    __metadata("design:type", Array)
], Room.prototype, "members", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: user_schemas_1.User.name,
        autopopulate: true,
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Room.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: user_schemas_1.User.name,
        autopopulate: true,
        required: true,
    }),
    __metadata("design:type", Array)
], Room.prototype, "Admins", void 0);
exports.Room = Room = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Room);
exports.RoomSchema = mongoose_1.SchemaFactory.createForClass(Room);
exports.RoomSchema.plugin(require('mongoose-autopopulate'));
//# sourceMappingURL=room.schemas.js.map