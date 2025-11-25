import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/dto/users/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const result = await this.service.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User berhasil dibuat',
      data: result,
    };
  }

  @Get()
  async findAll(@Query('limit') limit = 10, @Query('page') page = 1) {
    const { total, data } = await this.service.findAll(+limit, +page);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      total,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    const data = await this.service.findOne(+id);
    return {
      message: 'success',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto: UpdateUserDto) {
    const result = await this.service.update(+id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Data user telah diperbarui',
      result,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    const result = await this.service.detele(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Data user telah dihapus',
      result,
    };
  }
}
