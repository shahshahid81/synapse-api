import { Test, TestingModule } from '@nestjs/testing';
import { TokenlistService } from './tokenlist.service';
import { TokenList } from './token-list.entity';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { hashPassword } from 'src/utils/hash-utils';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TokenlistService', () => {
  let tokenListService: TokenlistService;
  let tokenListRepository: Repository<TokenList>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenlistService,
        {
          provide: getRepositoryToken(TokenList),
          useValue: {
            find: jest.fn(() => []),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenListService = module.get<TokenlistService>(TokenlistService);
    tokenListRepository = module.get<Repository<TokenList>>(
      getRepositoryToken(TokenList),
    );
  });

  it('should be defined', () => {
    expect(tokenListService).toBeDefined();
    expect(tokenListRepository).toBeDefined();
  });

  describe('getUser', () => {
    it('should get the user', async () => {
      const token = 'random-string';
      const user = {
        id: '1',
        email: 'test@test.com',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        password: await hashPassword('password'),
        isActive: true,
      };
      const users = [
        {
          id: '1',
          user_id: '1',
          token,
          expiresAt: DateTime.now().plus({ hours: 1 }),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          user,
        },
      ];
      jest
        .spyOn(tokenListRepository, 'find')
        .mockImplementationOnce(async () => users);
      jest.spyOn(tokenListService, 'getUser');

      const response = await tokenListService.getUser(token);

      expect(tokenListService.getUser).toHaveBeenCalledWith(token);
      expect(response).toStrictEqual(user);
    });

    it('should throw error if token is not found', async () => {
      expect.assertions(2);
      const token = 'random-string';
      jest.spyOn(tokenListService, 'getUser');

      try {
        await tokenListService.getUser(token);
      } catch (error) {
        expect(error).toMatchObject({
          response: {
            message: 'Token not found',
            error: 'Unprocessable Entity',
            statusCode: 422,
          },
        });
        expect(tokenListService.getUser).toHaveBeenCalledWith(token);
      }
    });

    it('should throw error if token is expired', async () => {
      expect.assertions(2);
      const token = 'random-string';
      const user = {
        id: '1',
        email: 'test@test.com',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        password: await hashPassword('password'),
        isActive: true,
      };
      const users = [
        {
          id: '1',
          user_id: '1',
          token,
          expiresAt: DateTime.now().minus({ hours: 1 }),
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          user,
        },
      ];
      jest
        .spyOn(tokenListRepository, 'find')
        .mockImplementationOnce(async () => users);
      jest.spyOn(tokenListService, 'getUser');

      try {
        await tokenListService.getUser(token);
      } catch (error) {
        expect(error).toMatchObject({
          response: {
            message: 'Token expired',
            error: 'Unprocessable Entity',
            statusCode: 422,
          },
        });
        expect(tokenListService.getUser).toHaveBeenCalledWith(token);
      }
    });
  });
});
