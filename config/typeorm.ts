import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  autoLoadEntities: true,
  migrations: ['database/migrations/*.ts'],
};

export const connectionSource = new DataSource(config as DataSourceOptions);
