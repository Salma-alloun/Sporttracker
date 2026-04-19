// src/auth/jwt.strategy.ts - Version simplifiée
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['HS256'],
      ignoreExpiration: false,
      secretOrKey: 'super_secret_key_change_this_in_production', // ← IDENTIQUE à .env !
    });
  }

  validate(payload: any) {
    console.log('✅ JWT Strategy - payload reçu:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}