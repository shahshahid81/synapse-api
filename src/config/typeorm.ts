// import { ConfigService } from '@nestjs/config';
// import { SnakeNamingStrategy } from 'src/typeorm/naming-strategy';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

// const configService = new ConfigService();

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  autoLoadEntities: true,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
