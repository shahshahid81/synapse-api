import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { validate } from 'env.validate';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleConfig } from './typeorm/data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          validate,
          load: [configuration],
        }),
      ],
      inject: [ConfigService],
      useFactory: getTypeOrmModuleConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
