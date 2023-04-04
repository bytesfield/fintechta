import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { applicationConfig } from 'src/common/config';
import { UsersService } from 'src/users/services/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: applicationConfig.jwtSecret,
      signOptions: { expiresIn: applicationConfig.jtwExpiresIn },
    }),
  ],
})
export class AuthModule {}
