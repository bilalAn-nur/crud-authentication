import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      const { password, confirmPassword, ...rest } = dto;
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: { ...rest, password: hashPassword },
      });

      return {
        message: 'User berhasil dibuat',
        data: user,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email sudah terdaftar');
      }
      throw new InternalServerErrorException('Gagal membuat user');
    }
  }

  async findAll(limit: number, page: number) {
    try {
      const skip = (page - 1) * limit;

      const [total, data] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.findMany({
          take: limit,
          skip,
          orderBy: { id: 'desc' },
        }),
      ]);

      return {
        message: 'Success',
        total,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil data users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }

      return {
        message: 'Success',
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil data user');
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      if (dto.password) {
        dto.password = await bcrypt.hash(dto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: dto,
      });

      return {
        message: 'User berhasil diperbarui',
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal memperbarui user');
    }
  }

  async detele(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'User Berhasil Dihapus' };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus user');
    }
  }
}
