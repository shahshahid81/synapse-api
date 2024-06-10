import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DateTime } from 'luxon';
import * as hashUtils from 'src/utils/hash-utils';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn((x) => x),
            save: jest.fn((x) => x),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('shoud create the user', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const dto = { email, password };
      const payload = {
        ...dto,
        confirmPassword: password,
      };
      const hashedString = 'hashed-string';
      jest
        .spyOn(hashUtils, 'hashPassword')
        .mockImplementation(async () => hashedString);
      const user = {
        id: '1',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        email,
        password: await hashUtils.hashPassword(password),
        isActive: true,
      };
      jest
        .spyOn(usersRepository, 'create')
        .mockImplementationOnce(() => dto as User);
      jest
        .spyOn(usersRepository, 'save')
        .mockImplementationOnce(async () => user);
      jest.spyOn(usersService, 'createUser');

      const response = await usersService.createUser(payload);

      expect(usersService.createUser).toHaveBeenCalledWith(payload);
      expect(response).toEqual(user);
    });
  });
});
