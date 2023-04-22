import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateUserDTO,
  UserDtoStub,
  UsersDtoStub,
} from '../../../../test/stubs/user.dto.stub';
import { User } from '../../../database/typeorm/entities/User';
import { TypeORMMySqlTestingModule } from '../../../database/typeorm/utils/testing-database';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from './users.controller';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import { AuthModule } from '../../../auth/auth.module';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  let findUserMock: jest.SpyInstance;
  let findUsersMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;

  const mockedUser = UserDtoStub();
  const mockedUsers = UsersDtoStub();
  const createUserDto = CreateUserDTO();

  const mockedResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockExecutionContext = createMock<ExecutionContext>();
  const mockedRequest = mockExecutionContext.switchToHttp().getRequest();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeORMMySqlTestingModule([User]),
        TypeOrmModule.forFeature([User]),
        AuthModule,
      ],
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);

    findUserMock = jest.spyOn(usersService, 'findOne');
    findUsersMock = jest.spyOn(usersService, 'findAll');
    createUserMock = jest.spyOn(usersService, 'create');
  });

  afterEach(async () => {
    findUserMock.mockReset();
    findUsersMock.mockReset();
    createUserMock.mockReset();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('Get Users', () => {
    it('should retrieve a single user successfully', async () => {
      findUserMock.mockImplementation(() => Promise.resolve(mockedUser));

      await usersController.getUser(mockedUser.id, mockedResponse);

      const response = {
        status: 'success',
        message: 'User retrieved successfully.',
        data: mockedUser,
      };

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith(response);
      expect(mockedResponse.json.mock.lastCall[0]).toEqual(response);
    });

    it('should retrieve all users successfully', async () => {
      findUsersMock.mockImplementation(() => Promise.resolve(mockedUsers));

      await usersController.getUsers(mockedResponse);

      const response = {
        status: 'success',
        message: 'Users retrieved successfully.',
        data: mockedUsers,
      };

      expect(mockedResponse.status).toHaveBeenCalledWith(200);
      expect(mockedResponse.json).toHaveBeenCalledWith(response);
      expect(mockedResponse.json.mock.lastCall[0]).toEqual(response);
    });
  });

  describe('Create Users', () => {
    it('should create a user successfully', async () => {
      createUserMock.mockImplementation(() => Promise.resolve(mockedUser));

      await usersController.create(createUserDto, mockedResponse);

      const response = {
        status: 'success',
        message: 'Account created successfully.',
        data: mockedUser,
      };

      expect(mockedResponse.status).toHaveBeenCalledWith(201);
      expect(mockedResponse.json).toHaveBeenCalledWith(response);
      expect(mockedResponse.json.mock.lastCall[0]).toEqual(response);
    });
  });
});
