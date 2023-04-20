import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/services/users/users.service';
import { applicationConfig } from '../common/config';
import { User } from '../database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../database/typeorm/utils/testing-database';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
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
          secret: applicationConfig.jwtAccessTokenSecret,
          signOptions: {
            expiresIn: applicationConfig.jwtAccessTokenExpiration,
          },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        LocalStrategy,
        JwtAccessTokenStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
