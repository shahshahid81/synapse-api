import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SuccessType } from 'src/common/common.types';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<SuccessType> {
    const { email } = createUserDto;
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new UnprocessableEntityException(
        'User with the email already exists',
      );
    }

    await this.usersService.createUser(createUserDto);
    return { success: true };
  }
}
