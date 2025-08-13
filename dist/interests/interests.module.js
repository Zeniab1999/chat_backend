"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestsModule = void 0;
const common_1 = require("@nestjs/common");
const interests_service_1 = require("./interests.service");
const interests_command_1 = require("./interests.command");
const mongoose_1 = require("@nestjs/mongoose");
const interest_schema_1 = require("./schemas/interest.schema");
const interests_controller_1 = require("./interests.controller");
let InterestsModule = class InterestsModule {
};
exports.InterestsModule = InterestsModule;
exports.InterestsModule = InterestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: interest_schema_1.Interest.name, schema: interest_schema_1.InterestSchema }]),
        ],
        providers: [interests_command_1.InterestCommand, interests_service_1.InterestsService],
        controllers: [interests_controller_1.InterestsController],
    })
], InterestsModule);
//# sourceMappingURL=interests.module.js.map