import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ResponseHandler } from 'src/common/utils/responses';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { UsersService } from 'src/users/services/users/users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserDto);

    return ResponseHandler.success(res, 'Account created successfully.', user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUsers(@Res() res: Response) {
    const users = await this.userService.findAll();

    return ResponseHandler.success(res, 'Users retrieved successfully.', users);
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    return ResponseHandler.success(res, 'User retrieved successfully.', user);
  }
}
