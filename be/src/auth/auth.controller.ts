import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('check-auth')
  async checkAuth(@Req() req: Request) {
    const token = req.cookies['accessToken'];

    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      this.jwtService.verify(token);
      const { user, newToken } = await this.authService.signInWithToken(token);

      const safeUser = plainToInstance(User, user);

      return {
        isAuthenticated: true,
        user: safeUser,
        accessToken: newToken,
      };
    } catch (error) {
      return { isAuthenticated: false };
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ name: username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(user.salt + password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('accessToken', jwt, { httpOnly: true });

    return { accessToken: jwt, user: user };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in-with-token')
  async signInWithToken(@Body('accessToken') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak disediakan');
    }

    try {
      const { user, newToken } = await this.authService.signInWithToken(token);

      return {
        message: 'Sign in berhasil',
        user: user,
        accessToken: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    return {
      message: 'Success',
    };
  }
}
