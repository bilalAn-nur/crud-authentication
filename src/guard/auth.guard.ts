import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.cookies?.accessToken;
    const refreshToken = request.cookies?.refreshToken;

    if (!accessToken) {
      throw new UnauthorizedException('Missing access token in cookie');
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request.user = payload;
      return true;
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid access token');
      }
    }

    // === ACCESS TOKEN EXPIRED → CHECK REFRESH TOKEN ===
    if (!refreshToken) {
      throw new ForbiddenException(
        'Access token expired and no refresh token provided',
      );
    }

    // Check in DB
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken }, // sesuaikan nama kolom tabel
    });

    if (!stored) {
      throw new ForbiddenException('Refresh token not found in database');
    }

    // Verify refresh token
    let refreshPayload;
    try {
      refreshPayload = this.jwtService.verify(refreshToken);
    } catch {
      throw new ForbiddenException('Expired or invalid refresh token');
    }

    // === Generate new access token ===
    const newAccessToken = this.jwtService.sign(
      {
        userId: refreshPayload.userId,
        email: refreshPayload.email,
      },
      { expiresIn: '15m' },
    );

    // Simpan accessToken ke COOKIE
    request.res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
    });

    request.user = refreshPayload;

    return true;
  }
}
