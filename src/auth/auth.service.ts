import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
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
import { applicationConfig } from '../common/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
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

    const { accessToken, refreshToken } = await this.getTokens(userId);

    await this.updateRefreshToken(refreshToken, userId);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  public validateToken(token: string): any {
    return this.jwtService.verify(token);
  }

  public async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.decode(refreshToken) as JwtPayload;

      if (!decoded) {
        throw new UnauthorizedException('Access Denied');
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
      throw new UnauthorizedException('Access Denied');
    }
  }

  public async updateRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<UpdateResult> {
    const currentHashedRefreshToken = await Hash.make(refreshToken);

    return await this.usersService.update(userId, {
      refresh_token: currentHashedRefreshToken,
    });
  }

  public async logout(user: any): Promise<UpdateResult> {
    const isUserExist = await this.usersService.findOne(user.id);

    if (!isUserExist) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.usersService.update(user.id, {
      refresh_token: null,
    });
  }

  public async getTokens(userId: number) {
    const payload = {
      sub: userId,
      id: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: applicationConfig.jwtAccessTokenSecret,
        expiresIn: applicationConfig.jwtAccessTokenExpiration,
      }),
      this.jwtService.signAsync(payload, {
        secret: applicationConfig.jwtRefreshTokenSecret,
        expiresIn: applicationConfig.jwtRefreshTokenExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
