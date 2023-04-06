import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ResponseHandler } from '../../../common/utils/responses';
import { Response, Request } from 'express';
import { CreateUserDto } from '../../dtos/CreateUserDto';
import { UsersService } from '../../services/users/users.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt.auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const user = await this.userService.create(createUserDto);

    return ResponseHandler.created(res, 'Account created successfully.', user);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle(3, 60) // Override default configuration for Rate limiting and duration.
  @Get()
  async getUsers(@Res() res) {
    const users = await this.userService.findAll();

    return ResponseHandler.success(res, 'Users retrieved successfully.', users);
  }

  @SkipThrottle(false) // Rate limiting is applied to this route.
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const user = await this.userService.findOne(id);

    return ResponseHandler.success(res, 'User retrieved successfully.', user);
  }
}
