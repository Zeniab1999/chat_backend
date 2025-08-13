import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(dto: LoginAuthDto): Promise<{
        message: string;
        data: {
            user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            token: string;
        };
    }>;
    register(dto: RegisterAuthDto): Promise<{
        message: string;
        data: {
            user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schemas").User, {}, {}> & import("../users/schemas/user.schemas").User & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
            token: string;
        };
    }>;
    private signJwtToken;
}
