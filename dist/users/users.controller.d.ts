import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    update(req: any, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schemas/user.schemas").User, {}, {}> & import("./schemas/user.schemas").User & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
