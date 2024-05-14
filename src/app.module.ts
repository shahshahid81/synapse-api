import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { validate } from 'env.validate';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleConfig } from './typeorm/data-source';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TokenlistModule } from './tokenlist/tokenlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [configuration],
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [
        // TODO: remove duplicate ConfigModule Registration
        ConfigModule.forRoot({
          validate,
          load: [configuration],
        }),
      ],
      inject: [ConfigService],
      useFactory: getTypeOrmModuleConfig,
    }),
    TokenlistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
