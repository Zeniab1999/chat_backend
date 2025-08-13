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
exports.InterestCommand = void 0;
const common_1 = require("@nestjs/common");
const nestjs_command_1 = require("nestjs-command");
const interests_service_1 = require("./interests.service");
let InterestCommand = class InterestCommand {
    constructor(interestsService) {
        this.interestsService = interestsService;
    }
    async seed() {
        await this.interestsService.removeAll();
        const interests = [
            'Gym',
            'Reading',
            'Music',
            'Travel',
            'Cooking',
            'Hiking',
            'Camping',
            'Swimming',
            'Cycling',
            'Running',
            'Yoga',
            'Meditation',
            'Photography',
            'Painting',
            'Dancing',
            'Singing',
            'Writing',
            'Gardening',
            'Fishing',
            'Hunting',
            'Gaming',
            'Movies',
            'TV Shows',
            'Fashion',
            'Shopping',
        ];
        const result = await this.interestsService.bulkInsert(interests);
        console.log(result);
    }
};
exports.InterestCommand = InterestCommand;
__decorate([
    (0, nestjs_command_1.Command)({
        command: 'seed:interests',
        describe: 'seeding interests',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InterestCommand.prototype, "seed", null);
exports.InterestCommand = InterestCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interests_service_1.InterestsService])
], InterestCommand);
//# sourceMappingURL=interests.command.js.map