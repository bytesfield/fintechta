import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { applicationConfig } from 'src/common/config';
import { UsersService } from 'src/users/services/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: applicationConfig.jwtAccessTokenSecret,
      signOptions: { expiresIn: applicationConfig.jwtAccessTokenExpiration },
    }),
    // JwtModule.register({
    //   global: true,
    //   secret: applicationConfig.jwtRefreshTokenSecret,
    //   signOptions: { expiresIn: applicationConfig.jwtRefreshTokenExpiration },
    // }),
  ],
})
export class AuthModule {}
