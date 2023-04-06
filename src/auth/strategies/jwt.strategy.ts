import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { applicationConfig } from '../../common/config';
import { UsersService } from '../../users/services/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: applicationConfig.jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.id);

    return user;
  }
}
