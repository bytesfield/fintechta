import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../../auth/auth.service';
import { AuthModule } from '../../../auth/auth.module';
import { User } from '../../../database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../../../database/typeorm/utils/testing-database';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
        AuthModule,
      ],
      providers: [UsersService, AuthService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
