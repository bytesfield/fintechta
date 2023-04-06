import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseHandler } from '../common/utils/responses';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger('AuthController');

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const user = await this.authService.login(req.user);

    return ResponseHandler.success(res, 'Login successfully', user);
  }
}
