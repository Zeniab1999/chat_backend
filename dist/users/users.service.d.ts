import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schemas';
import { Model, Types } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(dto: RegisterAuthDto): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    validateUser(email: string, password: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
