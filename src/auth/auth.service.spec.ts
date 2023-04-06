import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/services/users/users.service';
import { applicationConfig } from '../common/config';
import { User } from '../database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../database/typeorm/utils/testing-database';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          global: true,
          secret: applicationConfig.jwtSecret,
          signOptions: { expiresIn: applicationConfig.jtwExpiresIn },
        }),
      ],
      providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
