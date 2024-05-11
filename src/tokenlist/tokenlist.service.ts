import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { TokenList } from './token-list.entity';
import { DateTime } from 'luxon';

@Injectable()
export class TokenlistService {
  constructor(
    @InjectRepository(TokenList)
    private tokenListRepository: Repository<TokenList>,
  ) {}

  async getUser(token: string): Promise<User> {
    const tokenList = await this.tokenListRepository.find({
      relations: { user: true },
      where: { token, user: { isActive: true } },
      select: {
        user: {
          id: true,
          email: true,
          isActive: true,
          createdAt: {},
          updatedAt: {},
        },
      },
    });
    if (!tokenList.length) {
      throw new UnprocessableEntityException('Token not found');
    }

    if (DateTime.now() > tokenList[0].expiresAt) {
      await this.tokenListRepository.delete(tokenList[0].id);
      throw new UnprocessableEntityException('Token expired');
    }

    return tokenList[0].user;
  }
}
