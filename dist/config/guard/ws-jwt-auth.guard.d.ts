import { ExecutionContext } from '@nestjs/common';
declare const WsJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class WsJwtAuthGuard extends WsJwtAuthGuard_base {
    getRequest(context: ExecutionContext): any;
}
export {};
