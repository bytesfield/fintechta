import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/typeorm/entities/User';
import { UsersService } from 'src/users/services/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findUserByUsername(username);

      if (user && compareSync(password, user?.password)) {
        return user;
      }

      return null;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  public async login(user: any) {
    const payload = { user, sub: user.id };

    return {
      userId: user.id,
      email: user.email,
      accessToken: this.jwtService.sign(payload),
    };
  }

  public validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
