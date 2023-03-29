import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/common/types';
import Hash from 'src/common/utils/hash';
import { User } from 'src/database/typeorm/entities/User';

import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(payload: CreateUserParams): Promise<User | null> {
    const newUser = this.usersRepository.create({
      ...payload,
      created_at: new Date(),
    });

    newUser.password = await Hash.make(payload.password);

    return await this.usersRepository.save(newUser);
  }

  update(id: number, payload: UpdateUserParams): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id },
      { ...payload, updated_at: new Date() },
    );
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
