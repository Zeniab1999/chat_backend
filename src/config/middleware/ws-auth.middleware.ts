// src/config/middleware/ws-auth.middleware.ts

import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service'; // You need to import the service
import { Server, Socket } from 'socket.io'; // Import Socket type

// You need to export a factory function to inject the dependencies
export const wsAuthMiddleware = (usersService: UsersService) => {
  return async (socket: Socket, next) => {
    try {
      const { authorization } = socket.handshake.headers;
      if (!authorization) {
        throw new Error('No authorization token provided.');
      }

      const token = authorization.split(' ')[1];
      console.log('token', token);
      const payload: any = jwt.verify(token, process.env.JWT_SECRET);
      
      // Use the injected service to find the user
      const user = await usersService.findOne(payload.sub); 
      if (!user) {
        throw new Error('User not found.');
      }
      // Attach the user object to the socket data
      socket.data.user = user;

      next();
    } catch (error) {
      // Handle the error gracefully
      console.error('WebSocket Authentication Error:', error.message);
    //   socket.emit('error', 'Authentication failed: ' + error.message);
      socket.disconnect(true);
      next(new Error('Authentication failed: ' + error.message));
    }
  };
};