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
exports.InterestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const interest_schema_1 = require("./schemas/interest.schema");
const mongoose_2 = require("mongoose");
let InterestsService = class InterestsService {
    constructor(interestModel) {
        this.interestModel = interestModel;
    }
    async getAll() {
        return await this.interestModel.find().exec();
    }
    async bulkInsert(interests) {
        const interestsToInsert = interests.map(interest => ({ name: interest }));
        const insertedInterests = await this.interestModel.insertMany(interestsToInsert);
        return {
            message: 'Interests created successfully',
            data: insertedInterests
        };
    }
    async removeAll() {
        const removedInterests = await this.interestModel.deleteMany({}).exec();
        return {
            message: 'Interests removed successfully',
            data: removedInterests,
        };
    }
};
exports.InterestsService = InterestsService;
exports.InterestsService = InterestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(interest_schema_1.Interest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InterestsService);
//# sourceMappingURL=interests.service.js.map