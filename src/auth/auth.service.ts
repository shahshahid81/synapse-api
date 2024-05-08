import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SuccessType } from 'src/common/common.types';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginResponseType } from './auth.types';
import { LoginUserDto } from 'src/users/login-user.dto';
import { comparePassword, generateToken } from 'src/utils/hash-utils';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenList } from '../tokenlist/token-list.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(TokenList)
    private tokenListRepository: Repository<TokenList>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<SuccessType> {
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

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseType> {
    const { email } = loginUserDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordEqual = await comparePassword(
      user.password,
      loginUserDto.password,
    );

    if (!isPasswordEqual) {
      return { success: false };
    }

    const token = generateToken();
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const tokenList = await this.tokenListRepository.create({
      user_id: user.id,
      token,
      expiresAt: oneHourLater,
    });
    await this.tokenListRepository.insert(tokenList);
    return { success: true, token };
  }

  async logout(user: User, token: string): Promise<LoginResponseType> {
    await this.tokenListRepository.delete({ user_id: user.id, token });
    return { success: true };
  }
}
