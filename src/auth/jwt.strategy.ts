import * as dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    let user = await this.userService.findOne(payload.sub);
    // const admins = ['mostafaZanon1', 'mostafaZanon', 'zeinabtarek'];
    // const userRole = admins.includes(user.username) ? 'admin' : 'user';
    return user;
  }
}
