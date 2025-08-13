import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/config/guard/jwt-auth.guard';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  // POST endpoint to receive and save the client's FCM token
  @Post('save-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async saveToken(@Request() req, @Body('token') token: string) {
    // We get the user ID from the authenticated request
    return this.notificationsService.saveUserToken(req.user._id, token);
  }
}
