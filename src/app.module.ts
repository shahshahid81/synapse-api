import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from 'env.validate';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmModuleConfig } from './typeorm/data-source';
import { TokenlistModule } from './tokenlist/tokenlist.module';
import { RouteMiddlewareModule } from './routemiddleware/routemiddleware.module';
import { MasterDataModule } from './master-data/master-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env.development.local',
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmModuleConfig,
    }),
    TokenlistModule,
    RouteMiddlewareModule,
    MasterDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
