// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async login(email: string, password: string): Promise<{ token: string; userId: number; role: string; user: any }> {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      role: user.role, 
      sub: user.id 
    };
    const token = this.jwtService.sign(payload);

    // ✅ Notification de connexion réussie
    if (user.expoPushToken) {
      await this.notificationService.sendNotification(
        user.expoPushToken,
        '🔐 Connexion réussie',
        `Bienvenue ${user.name} !`,
        { type: 'login', userId: user.id }
      );
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      userId: user.id,
      role: user.role,
      user: userWithoutPassword,
    };
  }
}