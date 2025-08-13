// const { createServer } = require('http');
// const { Server } = require('socket.io');

// const httpServer = createServer();
// const io = new Server(httpServer, {
//     cors: {
//         origin: "*"
//     }
// });

// let users = {};

// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on('set_username', (username, callback) => {
//         users[socket.id] = username;
//         socket.broadcast.emit('user_joined', username);
//         io.emit('user_list', Object.values(users));
//         callback(`Welcome, ${username}`);
//     });

//     socket.on('chat_message', (msg, ack) => {
//         io.emit('chat_message', { from: users[socket.id], text: msg });
//         ack && ack('Delivered');
//     });

//     socket.on('typing', () => {
//         socket.broadcast.emit('typing', users[socket.id]);
//     });

//     socket.on('private_message', ({ to, message }) => {
//         const recipientSocketId = Object.entries(users).find(([id, name]) => name === to)?.[0];
//         if (recipientSocketId) {
//             io.to(recipientSocketId).emit('private_message', {
//                 from: users[socket.id],
//                 message
//             });
//         }
//     });

//     socket.on('join_room', (room) => {
//         socket.join(room);
//         socket.to(room).emit('chat_message', { from: 'SYSTEM', text: `${users[socket.id]} joined room ${room}` });
//     });

//     socket.on('room_message', ({ room, message }) => {
//         socket.to(room).emit('chat_message', { from: users[socket.id], text: `[${room}] ${message}` });
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//         io.emit('user_left', users[socket.id]);
//         delete users[socket.id];
//         io.emit('user_list', Object.values(users));
//     });
// });

// httpServer.listen(3000, () => {
//     console.log('Socket.IO server running at http://localhost:3000/');
// });


import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class AppService {
  private users: Record<string, string> = {};
  private messages: any[] = [];

  getUsers() {
    return Object.values(this.users);
  }

  addUser(socketId: string, username: string) {
    this.users[socketId] = username;
  }

  removeUser(socketId: string) {
    const username = this.users[socketId];
    delete this.users[socketId];
    return username;
  }

  getMessages() {
    return this.messages;
  }

  addMessage(message: any) {
    this.messages.push(message);
  }

  getUsername(socketId: string) {
    return this.users[socketId];
  }
}
