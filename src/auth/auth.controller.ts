import { Body, Controller, Post, Req } from '@nestjs/common';
import { SuccessType } from 'src/common/common.types';
import { CreateUserDto } from 'src/users/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/login-user.dto';
import { ExtendedRequest } from 'src/common/extended-request.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    content: { 'application/json': { example: { success: true } } },
  })
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        examples: {
          'Validation Errors': {
            value: {
              message: [
                'email must be an email',
                'email should not be empty',
                'password must be shorter than or equal to 32 characters',
                'password must be longer than or equal to 8 characters',
                'password must be a string',
                'password should not be empty',
                'password and confirmPassword must be equal',
                'confirmPassword must be shorter than or equal to 32 characters',
                'confirmPassword must be longer than or equal to 8 characters',
                'confirmPassword must be a string',
                'confirmPassword should not be empty',
              ],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
          'Different Password Error': {
            value: {
              message: ['password and confirmPassword must be equal'],
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    content: {
      'application/json': {
        example: {
          message: 'User with the email already exists',
          error: 'Unprocessable Entity',
          statusCode: 422,
        },
      },
    },
  })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<SuccessType> {
    return this.authService.register(createUserDto);
  }

  @ApiResponse({
    status: 404,
    content: {
      'application/json': {
        example: {
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    content: {
      'application/json': {
        example: {
          message: 'Incorrect Password',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        example: {
          success: true,
          token:
            'dc997edd5c4beef0ade4bed3c91eac1a471b02cfa8d439aa8ba1367358717085caf2bc4130306120',
        },
      },
    },
  })
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<SuccessType> {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        example: {
          success: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    content: {
      'application/json': {
        examples: {
          'Missing Authorization Header': {
            value: {
              message: 'Missing authorization header',
              error: 'Unauthorized',
              statusCode: 401,
            },
          },
          'Token Not Found': {
            value: {
              message: 'Token not found',
              error: 'Unauthorized',
              statusCode: 401,
            },
          },
          'Token Expired': {
            value: {
              message: 'Token expired',
              error: 'Unauthorized',
              statusCode: 401,
            },
          },
        },
      },
    },
  })
  @Post('/logout')
  async logout(@Req() request: ExtendedRequest): Promise<SuccessType> {
    return this.authService.logout(request.user.id, request.token);
  }
}
