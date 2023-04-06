import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/services/users/users.service';
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
        const { password, ...result } = user;

        return result;
      }

      return null;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }

  public async login(user: any) {
    const payload = { id: user.id, sub: user.id };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  public validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
