import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { validate } from '../env.validate';
import { TokenlistModule } from 'src/tokenlist/tokenlist.module';
import { UsersModule } from 'src/users/users.module';
import { getTypeOrmModuleConfig } from 'src/typeorm/data-source';
import { RouteMiddlewareModule } from 'src/routemiddleware/routemiddleware.module';
import { generateToken, hash } from 'src/utils/hash-utils';
import { TokenList } from 'src/tokenlist/token-list.entity';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
          envFilePath: '.env.test.local',
        }),
        AuthModule,
        UsersModule,
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: getTypeOrmModuleConfig,
        }),
        TokenlistModule,
        RouteMiddlewareModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /register', () => {
    it('should register the user successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(201)
        .expect({ success: true });
    });

    it('should throw an error if already registered email is used for registration', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password',
        })
        .expect(422)
        .expect({
          message: 'User with the email already exists',
          error: 'Unprocessable Entity',
          statusCode: 422,
        });
    });

    it('should throw validation errors if invalid payload is passed', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400)
        .expect({
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
        });
    });

    it('should throw validation errors if password and confirmPassword is not same', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password',
          confirmPassword: 'password2',
        })
        .expect(400)
        .expect({
          message: ['password and confirmPassword must be equal'],
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });

  describe('POST /login', () => {
    it('should login the user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password',
        });

      expect(response.body.success).toEqual(true);
      expect(response.body.token).toBeDefined();
    });

    it('should throw an error if password is incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password2',
        })
        .expect(401)
        .expect({
          message: 'Incorrect Password',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should throw an error if email is not registered', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test2@test.com',
          password: 'password',
        })
        .expect(404)
        .expect({
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
        });
    });

    it('should throw validation errors if invalid payload is passed', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400)
        .expect({
          message: [
            'email must be an email',
            'email should not be empty',
            'password must be shorter than or equal to 32 characters',
            'password must be longer than or equal to 8 characters',
            'password must be a string',
            'password should not be empty',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });
  });

  describe('POST /logout', () => {
    it('should logout the user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password',
        });
      const token = response.body.token;

      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect({
          success: true,
        });
    });

    it('should throw an error if token is not passed', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(401)
        .expect({
          message: 'Missing authorization header',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should throw an error if token is incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer abcd')
        .expect(401)
        .expect({
          message: 'Token not found',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should throw an error if token is expired', async () => {
      const token = generateToken();
      const tokenListRepository = app.get<Repository<TokenList>>(
        getRepositoryToken(TokenList),
      );
      const userRepository = app.get<Repository<User>>(
        getRepositoryToken(User),
      );

      const user = await userRepository.findOneBy({
        email: 'test@test.com',
      });

      const tokenList = tokenListRepository.create({
        user_id: user?.id,
        token: hash(token),
        expiresAt: DateTime.now(),
      });
      await tokenListRepository.insert(tokenList);

      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect({
          message: 'Token expired',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });
  });
});
