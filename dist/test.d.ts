export declare class AppService {
    private users;
    private messages;
    getUsers(): string[];
    addUser(socketId: string, username: string): void;
    removeUser(socketId: string): string;
    getMessages(): any[];
    addMessage(message: any): void;
    getUsername(socketId: string): string;
}
