import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './auth.dto';
import { type User } from 'generated/prisma/client';
import { JwtAuthGuard } from 'src/common/guard/jwt.guard';
import { CurrentUser } from 'src/common/decorations/current-user.decorator';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('/login')
  login(@Body() dto: RegisterDto) {
    return this.service.login(dto);
  }
  
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}