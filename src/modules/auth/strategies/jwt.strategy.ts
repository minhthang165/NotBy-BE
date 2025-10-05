// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';// Đường dẫn có thể khác
import { UserService } from 'src/modules/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // Mặc định tên là 'jwt'
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Try to extract the token from cookie first
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['jwtToken'] || request.cookies['auth'];
          }
          return token;
        },
        // Fall back to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: any) {
    const user = await this.userService.findByGoogleId(payload.sub);
     return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}