import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token gerekli');
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>" formatında gelir
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'secret',
      }); // Aynı secret olmalı
      request.user = decoded; // Kullanıcıyı `req.user` içine ekler
      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Geçersiz veya süresi dolmuş token');
    }
  }
}

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { configs } from 'src/configuration/configuration';

// type JwtPayload = {
//   sub: string;
//   userId: string;
//   username: string;
// };

// @Injectable()
// export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configs.jwtAccessSecret,
//     });
//   }

//   validate(payload: JwtPayload) {
//     return payload;
//   }
// }
