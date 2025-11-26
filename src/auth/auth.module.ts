import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [AuthGuard, PrismaService],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
