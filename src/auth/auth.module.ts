import configuration from 'config/configuration';
import { validate } from 'env.validate';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenList } from '../tokenlist/token-list.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          validate,
          load: [configuration],
        }),
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          signOptions: { expiresIn: '1d' },
          secret: configService.get('SECRET_KEY'),
        };
      },
    }),
    TypeOrmModule.forFeature([TokenList]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
