import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Response({ passthrough: true }) res,
  ) {
    const tokens = await this.authService.login(body.email, body.password, res);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login berhasil',
      data: { accessToken: tokens.accessToken },
    };
  }

  @Post('logout')
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    return this.authService.logout(req, res);
  }
}
