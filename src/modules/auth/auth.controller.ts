import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiBody({ type: CreateAccountDto })
  @Post('create-account')
  async createAccount(@Body() data: CreateAccountDto) {
    return await this.authService.createAccountService(data);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'Logged successfully' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.loginService(data)
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @UseGuards(JwtGuard)
  @Get('profile')
  async profile(@Req() request: Request) {
    const user: Partial<User> = request.user
    return user;
  }
}
