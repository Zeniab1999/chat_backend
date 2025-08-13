import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    me(req: any): any;
}
