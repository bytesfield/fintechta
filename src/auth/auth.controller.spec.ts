import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { User } from '../database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../database/typeorm/utils/testing-database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users/users.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtService, UsersService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
