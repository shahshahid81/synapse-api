import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { DateTime } from 'luxon';
import { hashPassword } from 'src/utils/hash-utils';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: 'TokenListRepository',
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('register', () => {
    it('should register the user', async () => {
      const payload = {
        email: 'test@test.com',
        password: 'password',
        confirmPassword: 'password',
      };
      jest.spyOn(authService, 'register');

      const response = await authService.register(payload);

      expect(authService.register).toHaveBeenCalledWith(payload);
      expect(response).toStrictEqual({ success: true });
    });
  });

  describe('login', () => {
    it('should login the user', async () => {
      const payload = {
        email: 'test@test.com',
        password: 'password',
      };
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockImplementationOnce(async () => ({
          ...payload,
          password: await hashPassword('password'),
          id: '1',
          isActive: true,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        }));
      jest.spyOn(authService, 'login');

      const response = await authService.login(payload);

      expect(authService.login).toHaveBeenCalledWith(payload);
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('token');
      expect(typeof (response as { success: true; token: string }).token).toBe(
        'string',
      );
    });
  });

  describe('logout', () => {
    it('should logout the user', async () => {
      const userId = 'random-id';
      const token = 'random-string';
      jest.spyOn(authService, 'logout');

      const response = await authService.logout(userId, token);

      expect(authService.logout).toHaveBeenCalledWith(userId, token);
      expect(response).toStrictEqual({ success: true });
    });
  });
});
