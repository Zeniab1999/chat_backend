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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schemas_1 = require("./schemas/user.schemas");
const mongoose_2 = require("mongoose");
const password_hash_helper_1 = require("../helper/hash/password-hash.helper");
const roles_enums_1 = require("../config/enums/roles_enums");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(dto) {
        const existingUser = await this.userModel
            .findOne({
            $or: [
                { email: dto.email },
                { username: dto.username },
                { phoneNumber: dto.phoneNumber },
            ],
        })
            .exec();
        if (existingUser) {
            let message = 'User already exists.';
            if (existingUser.email === dto.email) {
                message = 'A user with this email already exists.';
            }
            else if (existingUser.username === dto.username) {
                message = 'A user with this username already exists.';
            }
            else if (existingUser.phoneNumber === dto.phoneNumber) {
                message = 'phone number already exists.';
            }
            throw new common_1.BadRequestException(message);
        }
        const passwordGenerator = await password_hash_helper_1.PasswordHashHelper.hash(dto.password);
        dto.password = passwordGenerator.hash;
        const createdUser = new this.userModel({
            ...dto,
            password_key: passwordGenerator.passKey,
            role: dto.role || roles_enums_1.Role.Disabled,
        });
        try {
            return await createdUser.save();
        }
        catch (error) {
            throw new common_1.BadRequestException('Error creating user.');
        }
    }
    async validateUser(email, password) {
        const user = await this.userModel
            .findOne({ email })
            .select('+password')
            .select('+password_key')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('Could not find user.');
        }
        const isPasswordCorrect = await password_hash_helper_1.PasswordHashHelper.comparePassword(password, user.password_key, user.password);
        if (!isPasswordCorrect) {
            throw new common_1.NotFoundException('Could not find user.');
        }
        return user;
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException('Could not find user.');
        }
        return user;
    }
    async update(id, updateUserDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid user ID.');
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('Could not find user.');
        }
        return {
            message: 'User updated successfully',
            data: updatedUser,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schemas_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map