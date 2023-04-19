import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { extractTokenFromHeader } from 'src/common/utils/helpers';
import { ResponseHandler } from '../common/utils/responses';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger('AuthController');

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const response = await this.authService.login(req.user);

    return ResponseHandler.success(res, 'Login successfully', response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logOut(@Req() req, @Res() res: Response) {
    await this.authService.removeRefreshToken(req.user.email);

    req.res.setHeader('Authorization', null);

    return ResponseHandler.success(res, 'Logout successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const token = extractTokenFromHeader(req);

    const response = await this.authService.createAccessTokenFromRefreshToken(
      token,
    );

    return ResponseHandler.success(
      res,
      'Token refreshed successfully',
      response,
    );
  }
}
