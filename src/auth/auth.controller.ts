import { Body, Controller, Post, Req } from '@nestjs/common';
import { SuccessType } from 'src/common/common.types';
import { CreateUserDto } from 'src/users/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/login-user.dto';
import { ExtendedRequest } from 'src/common/extended-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<SuccessType> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<SuccessType> {
    return this.authService.login(loginUserDto);
  }

  @Post('/logout')
  async logout(@Req() request: ExtendedRequest): Promise<SuccessType> {
    return this.authService.logout(request.user, request.token);
  }
}
