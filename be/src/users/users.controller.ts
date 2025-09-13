import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const salt = Math.random().toString(36).substr(2, 10);
    const password = await bcrypt.hash(salt + createUserDto.password, 12);

    const { role_id, ...data } = createUserDto;

    return this.usersService.create({
      ...data,
      password,
      salt: salt,
      role: { id: role_id },
    });
  }

  @Get()
  async findAll(@Request() request) {
    return this.usersService.paginate('users', [['users.role', 'role']], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['users.name'],
    });
  }
}
