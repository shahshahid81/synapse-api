import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { TokenlistModule } from 'src/tokenlist/tokenlist.module';
import { UsersModule } from 'src/users/users.module';
import { SnakeNamingStrategy } from 'src/typeorm/naming-strategy';

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
        // TODO: check how to use root async method
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'test-database',
          port: 5432,
          username: 'synapse-db-admin',
          password: 'MjNrYNbDXQFmPYFMNL9N',
          database: 'synapse-db',
          namingStrategy: new SnakeNamingStrategy(),
          synchronize: true,
          autoLoadEntities: true,
        }),
        TokenlistModule,
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
    it('it should register the user successfully', () => {
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
  });
});
