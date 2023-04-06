import { CreateUserDto } from '../../src/users/dtos/CreateUserDto';
import { User } from '../../src/database/typeorm/entities/User';

export const UserDtoStub = (): User => {
  return {
    id: 1,
    first_name: 'Joe',
    last_name: 'Doe',
    email: 'johndoe@gmail.com',
    username: 'johndoe123',
    password: '$2b$10$557s.AYRMNhGT5Odrk/zKeLW7pI8qIl89lWk2WsrvhKu2Ry295eDi',
    created_at: new Date(),
    status: false,
    email_verified_at: null,
    verified_at: null,
    deleted_at: null,
    updated_at: null,
    auth_strategy: null,
  };
};

export const CreateUserDTO = (): CreateUserDto => {
  return {
    first_name: 'Joe',
    last_name: 'Doe',
    email: 'johndoe@gmail.com',
    username: 'johndoe123',
    password: '123456',
  };
};

export const UsersDtoStub = (): User[] => {
  return [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
      username: 'johndoe123',
      password: '$2b$10$557s.AYRMNhGT5Odrk/zKeLW7pI8qIl89lWk2WsrvhKu2Ry295eDi',
      created_at: new Date(),
      status: false,
      email_verified_at: null,
      verified_at: null,
      deleted_at: null,
      updated_at: null,
      auth_strategy: null,
    },
    {
      id: 2,
      first_name: 'Mary',
      last_name: 'Doe',
      email: 'marydoe@gmail.com',
      username: 'marydoe123',
      password: '$2b$10$557s.AYRMNhGT5Odrk/zKeLW7pI8qIl89lWk2WsrvhKu2Ry295eDi',
      created_at: new Date(),
      status: false,
      email_verified_at: null,
      verified_at: null,
      deleted_at: null,
      updated_at: null,
      auth_strategy: null,
    },
  ];
};
