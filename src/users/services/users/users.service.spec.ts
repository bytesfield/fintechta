import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../..//database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../../../database/typeorm/utils/testing-database';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
