import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/services/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';
import Hash from '../common/utils/hash';
import { UpdateResult } from 'typeorm';

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
    const userId = user.id;
    const payload = { id: userId, sub: userId };
    const accessToken = this.jwtService.sign(payload);

    await this.setCurrentRefreshToken(accessToken, userId);

    return {
      user,
      accessToken,
    };
  }

  public validateToken(jwt: string): any {
    return this.jwtService.verify(jwt);
  }

  public async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as JwtPayload;

      if (!decoded) {
        throw new Error();
      }

      const user = await this.usersService.findOne(decoded.id);

      if (!user) {
        throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
      }

      const isRefreshTokenMatching = compareSync(
        refreshToken,
        user.refresh_token,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Token is invalid');
      }

      return this.login(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  public async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<UpdateResult> {
    const currentHashedRefreshToken = await Hash.make(refreshToken);

    return await this.usersService.update(userId, {
      refresh_token: currentHashedRefreshToken,
    });
  }

  public async removeRefreshToken(email: string): Promise<UpdateResult> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.usersService.update(user.id, {
      refresh_token: null,
    });
  }
}
