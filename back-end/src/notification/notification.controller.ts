// src/notification/notification.controller.ts
import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('push-token')
  async updatePushToken(@Request() req, @Body() body: any) {
    console.log('✅ ROUTE PUSH-TOKEN ATTEINTE !');
    console.log('Body:', body);
    
    const pushToken = body.pushToken;
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    
    if (!pushToken) {
      return { success: false, message: 'pushToken requis' };
    }
    
    if (!userId) {
      return { success: false, message: 'Utilisateur non identifié' };
    }
    
    const numericUserId = parseInt(userId, 10);
    const result = await this.userService.updatePushToken(numericUserId, pushToken);
    
    return { success: true, message: 'Token push enregistré', user: result };
  }
}