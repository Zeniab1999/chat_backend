export declare class PasswordHashHelper {
    static hash(password: string): Promise<{
        hash: string;
        passKey: string;
    }>;
    static comparePassword(password: string, passKey: string, hash: string): Promise<boolean>;
}
