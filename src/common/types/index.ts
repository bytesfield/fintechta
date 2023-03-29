import { Exclude } from 'class-transformer';

export type CreateUserParams = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type UpdateUserParams = {
  first_name: string;
  last_name: string;
};

export class SerializedUser {
  first_name: string;
  last_name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
