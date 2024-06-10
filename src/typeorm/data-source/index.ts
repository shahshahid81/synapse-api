import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '../naming-strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Environment } from 'src/common/common.enums';

const getDataSourceConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: configService.get('NODE_ENV') === Environment.TEST,
  };
};

export const getDataSource = (configService: ConfigService): DataSource => {
  return new DataSource(getDataSourceConfig(configService));
};

export const getTypeOrmModuleConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dataSource = getDataSourceConfig(configService);
  return {
    ...dataSource,
    autoLoadEntities: true,
  };
};
