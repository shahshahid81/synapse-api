import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post()
  async login(): Promise<Record<string, boolean>> {
    return {
      ok: true,
    };
  }
}
