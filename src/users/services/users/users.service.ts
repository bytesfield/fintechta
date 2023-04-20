import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/common/types';
import Hash from '../../../common/utils/hash';
import { User } from '../../../database/typeorm/entities/User';

import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from '../../../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(payload: CreateUserParams): Promise<User | null> {
    const newUser = this.usersRepository.create({
      ...payload,
      created_at: new Date(),
    });

    newUser.password = await Hash.make(payload.password);

    const user = await this.usersRepository.save(newUser);

    const tokens = await this.authService.getTokens(user.id);

    await this.authService.updateRefreshToken(tokens.refreshToken, user.id);

    return user;
  }

  update(id: number, payload: UpdateUserParams | any): Promise<UpdateResult> {
    return this.usersRepository.update(
      { id },
      { ...payload, updated_at: new Date() },
    );
  }

  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
