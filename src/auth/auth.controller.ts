import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';

@Controller('auth')
export class AuthController {
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Record<string, any>> {
    return {
      ok: true,
      createUserDto,
    };
  }
}
