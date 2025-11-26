import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
