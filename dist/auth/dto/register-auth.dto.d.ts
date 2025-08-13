import { LoginAuthDto } from './login-auth.dto';
import { Role } from 'src/config/enums/roles_enums';
declare const RegisterAuthDto_base: import("@nestjs/common").Type<Partial<LoginAuthDto>>;
export declare class RegisterAuthDto extends RegisterAuthDto_base {
    name: string;
    username: string;
    countryCode: string;
    phoneNumber: string;
    role: Role;
}
export {};
