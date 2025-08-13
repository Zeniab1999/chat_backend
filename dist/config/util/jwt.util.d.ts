import * as jwt from 'jsonwebtoken';
export declare class JwtUtil {
    static isValidAuthHeader(authorization: string): string | jwt.JwtPayload;
}
