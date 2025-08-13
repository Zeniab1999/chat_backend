"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    constructor() {
        this.users = {};
        this.messages = [];
    }
    getUsers() {
        return Object.values(this.users);
    }
    addUser(socketId, username) {
        this.users[socketId] = username;
    }
    removeUser(socketId) {
        const username = this.users[socketId];
        delete this.users[socketId];
        return username;
    }
    getMessages() {
        return this.messages;
    }
    addMessage(message) {
        this.messages.push(message);
    }
    getUsername(socketId) {
        return this.users[socketId];
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=test.js.map