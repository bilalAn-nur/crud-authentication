import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from 'src/dto/auth/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: CreateAuthDto,
    @Response({ passthrough: true }) res,
  ) {
    const tokens = await this.authService.login(dto, res);

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
